import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
	config => {
		if(store.getters.token) {
			config.headers["Authorization"] = getToken();
		}
		return config;
	},
	error => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	response => {

		const res = response.data;

		if(res.code !== 20000 && res.code !== "000000" && res.code !== "0000") {
			Message({
				message: res.message || "Error",
				type: "error",
				duration: 5 * 1000
			});

			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if(res.code === "50008" || res.code === "50012" || res.code === "40301" || res.code === "0007") {
				store.dispatch("user/resetToken").then(() => {
					location.reload();
				});
				// MessageBox.confirm("你已被登出，可以取消继续留在该页面，或者重新登录", "确定登出", {
				// 	confirmButtonText: "重新登录",
				// 	cancelButtonText: "取消",
				// 	type: "warning"
				// }).then(() => {
				// 	store.dispatch("user/resetToken").then(() => {
				// 		location.reload();
				// 	});
				// });
			}

			return Promise.reject(new Error(res.message || "Error"));
		} else {
			return res;
		}
	},
	error => {
		console.log("error");
		console.log(error.response.data); // for debug
		Message({
			message: error.response.data.msg || error.response.data.message ||"系统异常",
			type: "error",
			duration: 5 * 1000
		});
		return Promise.reject(error);
	}
);

export default service;
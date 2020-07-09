import axios from "axios";
import store from "@/store";
import Config from "@/utils/config";


const instance = axios.create({
    timeout: 30000
});

instance.defaults.headers["Content-Type"] = "application/json";

instance.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers["auth-token"] = store.getters.token;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code == "0000") {
            return response.data;
        } else if (res.code == "0007") { // 登录已过期  跳转到登录
            store.commit("modToken", "");
            window.location.href = Config.oauthUrl;
            return Promise.reject(res);
        } else {
            return Promise.reject(res);
        }
    },
    error => {
        let err = error + "";
        if (err.indexOf("timeout") > -1) {
            return Promise.reject({ message: "操作超时" });
        } else if (err.indexOf("404") > -1 || err.indexOf("Network Error") > -1) {
            return Promise.reject({ message: "网络错误" });
        }
        return Promise.reject({ message: err });
    }
);

export default instance;
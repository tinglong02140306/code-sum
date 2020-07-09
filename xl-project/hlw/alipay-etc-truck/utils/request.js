const env = require("./config");
import APIs from "../apis/index";
import { hideLoading, showLoading, showToast } from "../utils/util";

export const ajax = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let res = await request(data);
			if(res.code == "0000" || res.code == "200") {

				resolve(res);
			} else if(res.code == "0007") {
				console.log("131313");
				await getToken();
				res = await request(data);
				if(res.code == "0000" || res.code == "200") {
					resolve(res);
				} else {

					reject({ message: res.message });
				}
			} else if(res.code == "0001") {

				reject({ message: res.message });
			} else {

				reject({ message: res.message });
			}
		} catch (error) {
			reject({ message: error });
		}
	});
};
export const getToken = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let { data: isThirdPart } = my.getStorageSync({ "key": "isThirdPart" });
			let { data: financeId } = my.getStorageSync({ "key": "financeId" });
			let { data: source } = my.getStorageSync({ "key": "source" });
			let res = await getAuthCode();
			let params1 = {
				is_third_part: false,
				"authCode": res.authCode,
				finance_id: ""
			};
			let params2 = {
				is_third_part: isThirdPart,
				"authCode": res.authCode,
				finance_id: financeId
			};
			if(source == "74") {
				res = await APIs.login(params2);
			} else {
				res = await APIs.login(params1);
			}
			let { token, ali_user_id, username, cert_no, avatar, mobile } = res.data;
			my.setStorageSync({
				key: "token",
				data: token
			});
			my.setStorageSync({
				key: "aliUserId",
				data: ali_user_id
			});
			my.setStorageSync({
				key: "idName",
				data: username
			});
			my.setStorageSync({
				key: "idNumber",
				data: cert_no
			});
			my.setStorageSync({
				key: "avatar",
				data: avatar
			});
			my.setStorageSync({
				key: "mobile",
				data: mobile
			});

			resolve();
		} catch (error) {
			if(error.message == "用户信息不匹配") {
				hideLoading();
				reject({ message: error.message });
			} else {
				reject({ message: error.message });
			}
		}
	});
};

export const request = (params) => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		if(my.canIUse("request")) {
			my.request({
				url: `${env.baseUrl}${params.url}`,
				headers: {
					"auth-token": token || ""
				},
				method: "post",
				timeout: 60000,
				data: params.data,
				dataType: params.dataType || "json",
				success: res => {
					const statusCode = res.status;
					res = res.data;
					if(statusCode === 200) {
						if(res.code == "0000" || res.code == "200" || res.code == "0007") {
							resolve(res);
						} else {
							reject(res.msg || res.message);
						}
					} else if(statusCode === 404) {
						reject("请求的接口不存在");
					} else {
						reject("系统繁忙，错误码：" + statusCode);
					}
				},
				fail: error => {
					let err = "";
					if(error.error == 19) {
						err = "HTTP错误";
					} else if(error.error == 11) {
						err = "无权跨域";
					} else if(error.error == 12) {
						err = "网络出错";
					} else if(error.error == 13) {
						err = "请求超时";
					} else if(error.error == 14) {
						err = "请求失败";
					} else if(error.message) {
						err = error.message;
					} else {
						err = error + "";
					}
					reject(err);
				}
			});
		} else {
			my.httpRequest({
				url: `${env.baseUrl}${params.url}`,
				headers: {
					"Content-Type": "application/json",
					"auth-token": token || ""
				},
				method: "post",
				timeout: 20000,
				data: JSON.stringify(params.data),
				success: res => {
					const statusCode = res.status;
					res = res.data;
					if(statusCode === 200) {
						if(res.code == "0000" || res.code == "200" || res.code == "0007") {
							resolve(res);
						} else {
							reject(res.msg || res.message);
						}
					} else if(statusCode === 404) {
						reject("请求的接口不存在");
					} else {
						reject("系统繁忙，错误码：" + statusCode);
					}
				},
				fail: error => {
					let err = "";
					if(error.error == 19) {
						err = "HTTP错误";
					} else if(error.error == 11) {
						err = "无权跨域";
					} else if(error.error == 12) {
						err = "网络出错";
					} else if(error.error == 13) {
						err = "请求超时";
					} else if(error.error == 14) {
						err = "请求失败";
					} else if(error.message) {
						err = error.message;
					} else {
						err = error + "";
					}
					reject(err);
				}
			});
		}
	});
};

export const getAuthCode = () => {
	return new Promise((resolve, reject) => {
		my.getAuthCode({
			scopes: "auth_user",
			success: res => resolve(res),
			fail: (error) => {
				console.log(error, 191);
				reject({ message: "用户取消授权" });
			}
		});
	});
};

// 2019-11-19 企业新增  不再复用原来的ajax方法
export const cRequest = (params) => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		if(my.canIUse("request")) {
			my.request({
				url: `${env.baseUrl}${params.url}`,
				headers: {
					"auth-token": token || ""
				},
				method: "post",
				timeout: 60000,
				data: params.data,
				dataType: params.dataType || "json",
				success: res => {
					const statusCode = res.status;
					res = res.data;
					if(statusCode == "200") {
						if(res.code == "0000" || res.code == "200" || res.code == "0007") {
							resolve(res);
						} else {
							reject({ message: res.msg || res.message });
						}
					} else if(statusCode == "404") {
						reject({ message: "请求的接口不存在" });
					} else {
						reject({ message: "系统繁忙，错误码：" + statusCode });
					}
				},
				fail: error => {
					let err = "";
					if(error.error == 19) {
						err = "HTTP错误";
					} else if(error.error == 11) {
						err = "无权跨域";
					} else if(error.error == 12) {
						err = "网络出错";
					} else if(error.error == 13) {
						err = "请求超时";
					} else if(error.error == 14) {
						err = "请求失败";
					} else if(error.message) {
						err = error.message;
					} else {
						err = error + "";
					}
					reject({ message: err });
				}
			});
		} else {
			my.httpRequest({
				url: `${env.baseUrl}${params.url}`,
				headers: {
					"Content-Type": "application/json",
					"auth-token": token || ""
				},
				method: "post",
				timeout: 20000,
				data: JSON.stringify(params.data),
				success: res => {
					const statusCode = res.status;
					res = res.data;
					if(statusCode == "200") {
						if(res.code == "0000" || res.code == "200" || res.code == "0007") {
							resolve(res);
						} else {
							reject({ message: res.msg || res.message });
						}
					} else if(statusCode == "404") {
						reject({ message: "请求的接口不存在" });
					} else {
						reject({ message: "系统繁忙，错误码：" + statusCode });
					}
				},
				fail: error => {
					let err = "";
					if(error.error == 19) {
						err = "HTTP错误";
					} else if(error.error == 11) {
						err = "无权跨域";
					} else if(error.error == 12) {
						err = "网络出错";
					} else if(error.error == 13) {
						err = "请求超时";
					} else if(error.error == 14) {
						err = "请求失败";
					} else if(error.message) {
						err = error.message;
					} else {
						err = error + "";
					}
					reject({ message: err });
				}
			});
		}
	});
};

export const cAjax = data => {
	return new Promise(async (resolve, reject) => {
		try {
			let res = await cRequest(data);
			if(res.code == "0000" || res.code == "200") {
				resolve(res);
				return;
			}
			if(res.code == "0007") {
				await companyLogin();
				let res = await cRequest(data);
				if(res.code == "0000" || res.code == "200") {
					resolve(res);
				} else {
					reject({ message: res.message });
				}
			}
		} catch (error) {
			console.log(error);
			reject({ message: error.message });
		}
	});
};

export const companyLogin = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let res = await getAuthCode();
			let { data: { token, ali_user_id, username, cert_no, mobile } } = await APIs.cLogin({
				authCode: res.authCode,
				is_third_part: false
			});
			my.setStorageSync({
				key: "token",
				data: token
			});
			my.setStorageSync({
				key: "aliUserId",
				data: ali_user_id
			});
			my.setStorageSync({
				key: "idName",
				data: username
			});
			my.setStorageSync({
				key: "idNumber",
				data: cert_no
			});
			my.setStorageSync({
				key: "avatar",
				data: avatar
			});
			my.setStorageSync({
				key: "mobile",
				data: mobile
			});
			resolve();
		} catch (error) {
			console.log(error);
			reject({ message: "登录失败！" });
		}
	});
};



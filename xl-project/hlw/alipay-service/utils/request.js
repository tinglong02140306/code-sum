const env = require("./config");

export const getAuthCode = () => {
	return new Promise((resolve, reject) => {
		my.getAuthCode({
			scopes: "auth_base",
			success: res => {
				console.log(res);
				if(res.authCode) {
					resolve(res);
				} else {
					reject({ message: "登录失败！" });
				}
			},
			fail: (error) => {
				reject({ message: "登录失败！" });
			}
		});
	});
};

export const request = (params) => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		if(my.canIUse("request")) {
			my.request({
				url: `${ env.baseUrl }${ params.url }`,
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
						if(res.code === "0000" || res.code === "0007") {
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
				url: `${ env.baseUrl }${ params.url }`,
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
						if(res.code === "0000" || res.code === "0007") {
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

export const ajax = data => {
	return new Promise(async (resolve, reject) => {
		let res;
		try {
			res = await request(data);
			if(res.code === "0000") {
				resolve(res);
				return;
			}
			if(res.code === "0007") {
				res = await login();
				let { auth_token: token, card_type: cardType } = res.data;
				my.setStorageSync({ "key": "token", "data": token });
				my.setStorageSync({ "key": "cardType", "data": cardType || [] });
				res = await request(data);
				if(res.code === "0000") {
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

export const getSystemInfo = () => {
	return new Promise((resolve, reject) => {
		my.getSystemInfo({
			success: res => resolve(res),
			fail: error => reject(error)
		});
	});
};

export const login = () => {
	return new Promise(async (resolve, reject) => {
		let res, userInfo;
		try {
			userInfo = await getOpenUserInfo();
			res = await getAuthCode();
			let systemInfo = await getSystemInfo();
			let params = {
				url: "/wx/95011mp/login/alipay",
				method: "post",
				data: {
					auth_code: res.authCode,
					client_info: {
						model: systemInfo["model"],
						version: systemInfo["version"],
						system: systemInfo["system"],
						platform: systemInfo["platform"],
						brand: systemInfo["brand"],
						scree_width: systemInfo["screeWidth"],
						scree_height: systemInfo["screeHeight"]
					}
				}
			};
			res = await ajax(params);
			res["data"]["user_info"]["avatar_url"] = userInfo["avatar"];
			res["data"]["user_info"]["nickname"] = userInfo["nickName"];
			resolve(res);
		} catch (error) {
			reject({ message: "登录失败！" });
		}
	});
};

export const getSettings = () => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success: data => resolve(data),
			fail: err => reject({ message: err })
		});
	});
};

export const getOpenUserInfo = () => {
	return new Promise((resolve, reject) => {
		my.getOpenUserInfo({
			success: res => resolve(JSON.parse(res.response).response),
			fail: err => reject({ message: "请授权小程序获取您的基本信息" })
		});
	});
};



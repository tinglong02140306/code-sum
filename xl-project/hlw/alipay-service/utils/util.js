const env = require("./config");

export const showAlert = (msg) => {
	return new Promise((resolve) => {
		my.alert({
			content: msg,
			success: () => {
				resolve();
			}
		});
	});
};
export const showTitledAlert = (msg, title = "系统提示") => {
	return new Promise((resolve) => {
		my.alert({
			title: title,
			content: msg,
			success: () => {
				resolve();
			}
		});
	});
};

export const showLoading = (msg = "加载中···") => {
	my.showLoading({
		content: msg
	});
};

export const showConfirm = (content, title = "系统提示", confirmButtonText = "确定") => {
	return new Promise((resolve, reject) => {
		my.confirm({
			title,
			content,
			confirmButtonText,
			success: (res) => {
				console.log(res);
				if(res.confirm) {
					resolve();
				} else {
					reject();
				}
			},
			fail: () => {
				reject();
			}
		});
	});
};

export const hideLoading = () => {
	my.hideLoading();
};

export const showToast = (msg = "加载中···", duration = 2000, icon = "none") => {
	my.showToast({
		content: msg,
		type: icon,
		duration: duration
	});
};
export const selectImg = (count = 1) => {
	return new Promise((resolve, reject) => {
		my.chooseImage({
			count: count,
			sizeType: ["original", "compressed"], // 这里要选上original  不然可能出现返回不到小程序的情况
			sourceType: ["camera", "album"],
			success: async (res) => {
				console.log(res);
				const tempFilesPath = res.apFilePaths;
				let result = [];
				try {
					for(let i = 0; i < tempFilesPath.length; i++) {
						let temp = await compress(tempFilesPath[i]);
						result = [...result, ...temp];
					}
					resolve(result);
				} catch (error) {
					reject({ message: error });
				}
			},
			fail: () => {
				console.log("用户取消");
				resolve([]);
			},
		});
	});
};

function compress(url){
	return new Promise((resolve, reject) => {
		my.compressImage({
			apFilePaths: [url],
			compressLevel: 1,
			success: res => {
				resolve(res["apFilePaths"]);
			},
			fail: () => {
				reject("压缩图片出错");
			}
		});
	});
}

function uploadFile(url){
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		my.uploadFile({
			url: `${ env.baseUrl }/wx/95011mp/complaint/img/upload`,
			filePath: url,
			fileName: "img_file",
			fileType: "image",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"auth-token": token || ""
			},
			success: res => {
				let result = JSON.parse(res.data);
				if(result.code === "0000") {
					resolve(result.data);
				} else {
					reject(result.message);
				}
			},
			fail: (error) => {
				reject(error.message);
			}
		});
	});
}

export const uploadImg = (imgs) => {
	return new Promise(async (resolve, reject) => {
		let result = [];
		try {
			for(let i = 0; i < imgs.length; i++) {
				result.push(await uploadFile(imgs[i]));
			}
			resolve(result);
		} catch (e) {
			reject({ message: e });
		}
	});
};


// 去掉所有空格
export const trimAll = str => {
	if(!str) return "";
	return str.toString().replace(/\s/g, "");
};

export const getToday = () => {
	const now = new Date();
	return `${ now.getFullYear() }-${ String((now.getMonth() + 1)).padStart(2, "0") }-${ String(now.getDate()).padStart(2, "0") }`;
};

export const computeMonthRange = (year, month) => {
	const startDate = `${ year }-${ String(month).padStart(2, "0") }-01`;
	const lastTimeStamp = new Date(year, parseInt(month)).getTime() - 1;
	const endDate = `${ year }-${ String(month).padStart(2, "0") }-${ String(new Date(lastTimeStamp).getDate()).padStart(2, "0") }`;
	return {
		year,
		month: String(month).padStart(2, "0"),
		startDate,
		endDate
	};
};

export const getLoginState = () => {
	return new Promise(resolve => {
		const { data: token } = my.getStorageSync({ key: "token" });
		if(token) {
			resolve(true);
		}
		my.getSetting({
			success: res => {
				resolve(!!res.authSetting["scope.userInfo"]);
			},
			fail: err => {
				resolve(false);
			}
		});
	});
};

export const isValidIdNum = id => {
	const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
	const arrVaild = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码
	if(/^\d{17}\d|x$/i.test(id)) {
		var sum = 0, idx;
		for(let i = 0; i < id.length - 1; i++) {
			sum += parseInt(id.substr(i, 1), 10) * arrExp[i];
		}
		idx = sum % 11;
		return arrVaild[idx] == id.substr(17, 1).toUpperCase();
	} else {
		return false;
	}
};

export const fmtCardNo = (cardNo) => {
	return cardNo.replace(/(\s)/g, "").replace(/(\d{4})/g, "$1 ").replace(/\s*$/, "");
};

const env = require("./config");
import { getToken } from "./request";

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

export const showConfirm = (content, title = "系统提示") => {
	return new Promise((resolve, reject) => {
		my.confirm({
			title,
			content,
			success: (res) => {
				console.log(res);
				if (res.confirm) {
					resolve();
				} else {
					reject();
				}
			},
			fail: () => {reject();}
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

export const fmtCardNo = (cardNo) => {
	return cardNo.replace(/(\s)/g, "").replace(/(\d{4})/g, "$1 ").replace(/\s*$/, "");
};

export const queryURLParams = url => {
	let obj = {}, reg = /([^=?&]+)=([^=?&]+)/g;
	let res = decodeURIComponent(url).match(reg);
	res.forEach(item => {
		let temp = item.split("=");
		obj[temp[0]] = temp[1];
		temp = null;
	});
	return obj;
};

// 时间戳
// export const ftDate = () => {
//   let vsDate = new Date();
//   let vsYear = vsDate.getFullYear();
//   let vsMonth = padZero(vsDate.getMonth()+1);
//   let vsDay = padZero(vsDate.getDate());
//   let vsHour = padZero(vsDate.getHours());
//   let vsMinute = padZero(vsDate.getMinutes());
//   let vsSecond = padZero(vsDate.getSeconds());
//   return `${vsYear}${vsMonth}${vsDay}${vsHour}${vsMinute}${vsSecond}`;
// };

export const encryptStr = val => {
	return val.slice(0, 1) + "**" + val.slice(-1);
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
					for (let i = 0; i < tempFilesPath.length; i++) {
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

function compress(url) {
	return new Promise((resolve,reject) => {
		my.compressImage({
			apFilePaths: [url],
			compressLevel: 1,
			success:res =>{
				console.info(res);
				resolve(res['apFilePaths']);
			},
			fail:() =>{
				reject('压缩图片出错');
			}
		})
	});
}

export const imgOcr = (params, count = 1) => {
	return new Promise(async (resolve, reject) => {
		hideLoading();
		let imgUrl = await selectImg(count);

		console.log(!params["ocrType"]);
		if (imgUrl.length) {
			// 不需要识别  直接返回临时路径
			if (!params["ocrType"] && !params["side"] && !params["type"]) {
				const res = { url: imgUrl };
				resolve(res);
			} else {
				imgUrl = imgUrl[0];
				showLoading();
				const data = { type: params["type"], filePath: imgUrl };
				console.log("////////////////////////////");
				console.log(data);
				uploadAndOcr(data).then(result => {
					const res = {
						url: [imgUrl],
						...result.data
					};
					console.info(res,161);
					hideLoading();
					resolve(res);
				}).catch(err => {
					console.log(err);
					hideLoading();
					reject({ message: err });
				});
			}
		}
	});
};

export const uploadAndOcr = data => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		my.uploadFile({
			url: `${ env.baseUrl }/alipay/order/img/ocr`,
			filePath: data.filePath,
			fileName: "img_file",
			fileType: "image",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"auth-token": token || ""
			},
			formData: {
				img_type: data.type
			},
			success: async (res) => {
				hideLoading();
				console.log("*-*-*-*-*-*-*-*-*-*-*-*-*");
				console.log(res);
				let result = JSON.parse(res.data);
				if (result.code == "0000") {
					resolve(result);
				} else {
					reject(result.message);
				}
			},
			fail: (error) => {
				hideLoading();
				reject(error.message);
			}
		});
	});
};

export const uploadImg = (url, filePath) => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise((resolve, reject) => {
		my.uploadFile({
			url: `${ env.baseUrl }${ url }`,
			filePath: filePath,
			fileName: "img_file",
			fileType: "image",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"auth-token": token || ""
			},
			formData: {
				img_type: data.type
			},
			success: (res) => {
				hideLoading();
				res = JSON.parse(res.data);
				if (res.code == "0000") {
					resolve(res.data.img_id);
				} else if (res.code == "0007") {
					getToken().then(async () => {
						let ret = await uploadImg(url, filePath);
						ret = JSON.parse(ret.data);
						if (ret.code == "0000") {
							resolve(ret.data.img_id);
						} else {
							reject(ret.message);
						}
					});
				} else {
					reject(res.message);
				}
			},
			fail: (error) => {
				hideLoading();
				reject(error.message);
			}
		});
	});
};

export const ftDate = () => {
	const now = new Date();
	const year = now.getFullYear();
	let month = now.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	let day = now.getDate();
	day = day < 10 ? "0" + day : day;
	let hour = now.getHours();
	hour = hour < 10 ? "0" + hour : hour;
	let minute = now.getMinutes();
	minute = minute < 10 ? "0" + minute : minute;
	let second = now.getSeconds();
	second = second < 10 ? "0" + second : second;
	return `${ year }${ month }${ day }${ hour }${ minute }${ second }`;
};
// 去空格
export const trimAll = str => {
	if (!str) {
		return "";
	}
	return str.toString().replace(/\s/g, "");
};

// 根据车辆颜色返回对应的key值
export const ftCarColor = data => {
	if (data == "蓝色") {
		return "0";
	}
  if (data == "黄色") {
		return "1";
	}
  if (data == "白色") {
		return "3";
	}
  if (data == "黑色") {
		return "2";
	}
  if (data == "渐变绿色") {
		return "4";
	}
  if (data == "黄绿双拼色:") {
		return "5";
	}
  if (data == "黄绿双拼色蓝色") {
		return "5";
	}
  if (data == "蓝白渐变色") {
		return "6";
	}
  if (data == "灰色") {
		return "14";
	}
  if (data == "青色") {
		return "15";
	}
  if (data == "银色") {
		return "16";
	}
   if (data == "红色") {
		return "17";
	}
   if (data == "棕色") {
		return "18";
	}
   if (data == "紫色") {
		return "19";
	}

};


// 根据车辆颜色返回对应的key值
export const ftpation = data => {
	if (data == "公务员") {
		return "1";
	}
  if (data == "事业单位员工") {
		return "2";
	}
  if (data == "公司员工") {
		return "3";
	}
  if (data == "军人警察") {
		return "4";
	}
  if (data == "工人") {
		return "5";
	}
  if (data == "农民") {
		return "6";
	}
  if (data == "管理人员") {
		return "7";
	}
  if (data == "技术人员") {
		return "8";
	}
  if (data == "私营业主") {
		return "9";
	}
   if (data == "文体明星") {
		return "10";
	}
   if (data == "自由职业者") {
		return "11";
	}
   if (data == "学生") {
		return "12";
	}
   if (data == "无职业") {
		return "13";
	}

};
// 根据发卡行确定联行号
export const ftAccBank = data => {
	return data === "中国工商银行" ? "102100099996" : data === "中国银行" ? "104100000004" :"301290000007";
};
// 后台base64压缩
export const img2base64 = () => {
	const { data: token } = my.getStorageSync({ key: "token" });
	return new Promise(async (resolve,reject) => {
		let imgUrl = await selectImg();
		if(imgUrl.length) {
			my.uploadFile({
				url: `${ env.baseUrl }/pay/channels/ap_xl_abc_wallet/accounts/cardBase64Compress`,
				filePath: imgUrl[0],
				fileName: "img_file",
				fileType: "image",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					"auth-token": token || ""
				},
				success: res => {
					hideLoading();
					console.log("*-*-*-*-*-*-*-*-*-*-*-*-*");
					console.log(res);
					let result = JSON.parse(res.data);
					if (result.code == "0000" || result.code === "200") {
						const urls = {
							tempFilePath: imgUrl[0],
							base64: result.result
						};
						resolve(urls);
					} else {
						reject(result.message);
					}
				},
				fail: (error) => {
					hideLoading();
          console.log("12331")
					reject(error.message);
				}
			});
		}
	});
};


// 前补零
const padZero = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 格式化日期 默认分隔符为空
export const formatDate = (date, split = "") => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year,month,day].map(padZero).join(split);
};

export const sleep = (ms = 3000) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		},ms)
	});
};
export const sleep_ccb = (ms = 5000) => {
	return new Promise((resolve) => {
		setTimeout(()=>{
			resolve();
		},ms)
	});
};

export const ftPlateColor = data => {
	return data === "黄色" ? "1" : data === "蓝色" ? "0" :"4";
};

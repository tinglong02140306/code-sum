var bleUtil = require("./wj/WJService");
var bleAPI = require("./wj/WJBleAPI");
var GBK = require("../gbk/gbk.js");
var SUCCESS_CODE = "0";
var FAIL_CODE = "-1";

// 万集
module.exports = {
	connectBle,
	deployBle,
	getObuId,
	initAuthDevice,
	sendToDevice,
	obuActive,
	getPlate,
	getAcctState,
	updateAcctState,
	getObuPlate
};

function connectBle(device, cb){
	my.stopBluetoothDevicesDiscovery({
		success(res){
			console.log("停止搜索");
		}
	});
	bleUtil.connectDevice(device, res => {
		console.log("<<<<<<<<<<<<<<<<<<");
		console.log(res);
		if(res == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE);
			return;
		}
		typeof cb === "function" && cb(FAIL_CODE, "状态: 连接失败");
	});
}

function deployBle(cb){
	bleUtil.enableService(code => {
		if(code == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "状态:部署失败");
		}
	});
}

function getObuId(cb){
	bleAPI.getDeviceInfo("C0", (res) => {
		console.log(res);
		if(res.code == "0") {
			let sn = hexToASCII(res.data.deviceSN);
			typeof cb === "function" && cb(SUCCESS_CODE, sn);
			return;
		}
		typeof cb === "function" && cb(FAIL_CODE, "获取设备编号失败");
	});
	// 	}
	// })
}

function hexToASCII(val){
	var hex = val.toString();
	var str = "";
	for(var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str;
}

function initAuthDevice(random, mac, cb){
	bleAPI.authOBU(random, random.length, mac.substr(0, 8), res => {
		if(res.code == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE,res);
			return;
		}
		typeof cb === "function" && cb(FAIL_CODE,res);
	});
}

function sendToDevice(dataType, cosArr, cb){
	// 读取卡号
	if(cosArr.toString() == "00A40000023F00,00A40000021001,00B095002B") {
		readCardNo((code, res) => {
			typeof cb == "function" && cb(code, res);
		});
		return;
	}
	// 读取卡片随机数
	if(cosArr.toString() == "0084000004") {
		getCardRandom((code, res) => {
			typeof cb == "function" && cb(code, res);
		});
		return;
	}
	// 读取obu写系统信息随机数
	if(cosArr.toString() == "00A40000023F00,0084000004") {
		getObuSysRandom((code, res) => {
			typeof cb == "function" && cb(code, res);
		});
		return;
	}
	// 读取obu写车辆信息随机数
	if(cosArr.toString() == "00A4000002DF01,0084000004") {
		getObuCarRandom((code, res) => {
			typeof cb == "function" && cb(code, res);
		});
		return;
	}
	sendApdu(dataType, cosArr, (code, res) => {
		typeof cb == "function" && cb(code, res);
	});
}

/**
 * 发送apdu
 * */
function sendApdu(dataType, cosArr, cb){
	let tlv = makeTLV(cosArr);
	let result = [], type = "10";
	if(dataType == "02") {
		type = "20";
	}
	bleAPI.transCmd(tlv, type, "82", function(serviceResult){
		console.log(serviceResult);
		if(serviceResult.code == 0) {
			result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
			typeof cb == "function" && cb(SUCCESS_CODE, result);
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

/**
 * 读取卡号
 * */
function readCardNo(cb){
	let result = [];
	bleAPI.transCmd("010700A40000023F00", "10", "82", function(serviceResult){
		console.log(serviceResult);
		if(serviceResult.code == 0) {
			result.push(serviceResult.data);
			bleAPI.transCmd("010700A40000021001", "10", "82", function(serviceResult){
				console.log(serviceResult);
				if(serviceResult.code == 0) {
					result.push(serviceResult.data);
					bleAPI.transCmd("010500B095002B", "10", "82", function(serviceResult){
						console.log(serviceResult);
						if(serviceResult.code == 0) {
							const res = serviceResult.data.toUpperCase();
							result.push(res.substring(res.indexOf("C9BD")));
							typeof cb == "function" && cb(SUCCESS_CODE, result);
						} else {
							typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
						}
					});
				} else {
					typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
				}
			});
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

/**
 * 读取卡随机数
 * */
function getCardRandom(cb){
	let result = [];
	bleAPI.transCmd("01050084000004", "10", "82", function(serviceResult){
		console.log(serviceResult);
		if(serviceResult.code == 0) {
			result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
			typeof cb == "function" && cb(SUCCESS_CODE, result);
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

/**
 * 读取卡片车牌号
 * */
function getPlate(cb){
	bleAPI.transCmd("010700a40000023f00", "10", "82", function(serviceResult){
		if(serviceResult.code == 0) {
			bleAPI.transCmd("010700a40000021001", "10", "82", function(serviceResult){
				if(serviceResult.code == 0) {
					bleAPI.transCmd("010500B095002B", "10", "82", function(serviceResult){
						if (serviceResult.code == 0) {
							const res = serviceResult.data.substring(4, serviceResult.data.indexOf("9000"));
							const plateNo = GBK.decode(res.substring(56, 80));
							if (plateNo) {
								typeof cb === "function" && cb(SUCCESS_CODE, plateNo);
							} else {
								typeof cb === "function" && cb(FAIL_CODE, "无车牌号");
							}
						} else {
							typeof cb === "function" && cb(FAIL_CODE, "读卡失败");
						}
					});
				} else {
					typeof cb === "function" && cb(FAIL_CODE, "读卡失败");
				}
			});
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "读卡失败");
		}
	});
}

/**
 * 获取obu系统信息随机数
 * */
function getObuSysRandom(cb){
	let result = [];
	bleAPI.transCmd("010700A40000023F00", "20", "82", function(serviceResult){
		console.log(serviceResult);
		if(serviceResult.code == 0) {
			result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
			bleAPI.transCmd("01050084000004", "20", "82", function(serviceResult){
				if(serviceResult.code == 0) {
					result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
					typeof cb == "function" && cb(SUCCESS_CODE, result);
				} else {
					typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
				}
			});
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

/**
 * 获取obu车辆信息随机数
 * */
function getObuCarRandom(cb){
	let result = [];
	bleAPI.transCmd("010700A4000002DF01", "20", "82", function(serviceResult){
		console.log(serviceResult);
		if(serviceResult.code == 0) {
			result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
			bleAPI.transCmd("01050084000004", "20", "82", function(serviceResult){
				if(serviceResult.code == 0) {
					result.push(serviceResult.data.substring(4, serviceResult.data.indexOf("9000")));
					typeof cb == "function" && cb(SUCCESS_CODE, result);
				} else {
					typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
				}
			});
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

/**
 * obu激活指令
 * */
function obuActive(cb){
	getObuId((code, res) => {
		if(code == 0) {
			let obunum = res;
			bleAPI.transCmd("010700a40000023F00", "20", "82", function(serviceResult){
				if(serviceResult.code == 0) {
					bleAPI.transCmd("01050084000004", "20", "82", function(serviceResult){
						if(serviceResult.code == 0) {
							const random = serviceResult.data.substring(4, serviceResult.data.indexOf("9000"));
							const params = {
								random: random,
								obu_id: obunum
							};
							typeof cb === "function" && cb(SUCCESS_CODE, params);
						} else {
							typeof cb === "function" && cb(FAIL_CODE, "error3");
						}
					});
				} else {
					typeof cb === "function" && cb(FAIL_CODE, "error2");
				}
			});
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "error1");
		}
	});
}

function makeTLV(tpdus){
	let tlv = "";
	for(let i = 0; i < tpdus.length; i++) {
		let temp = "" + tpdus[i];
		tlv = tlv + numberToHexString(i + 1, 1, true) + numberToHexString(parseInt(temp.length / 2), 1, true) + temp;
	}
	return tlv;
}

/**
 * number转换成指定字节数的hexString
 * num：转换的number值
 * bitNum：转换后的字节数
 * isBig：true-大端，fasle-小端
 */
function numberToHexString(num, bitNum, isBig){
	//转大端hex并补足
	let hex = num.toString(16);
	for(let i = hex.length; i < bitNum * 2; i++) {
		hex = "0" + hex;
	}
	//多位截取
	if(hex.length > bitNum * 2) {
		hex = hex.substring(hex.length - bitNum * 2);
	}
	//转小端
	if(isBig == false) {
		let temp = "";
		for(let i = hex.length - 2; i >= 0; i -= 2) {
			temp = temp + hex.substring(i, i + 2);
		}
		hex = temp;
	}
	return hex;
}

// 读取防拆位状态
function getAcctState(cb) {
	bleAPI.transCmd("010700A40000023F00", "20", "82", function(serviceResult) {
		if (serviceResult.code == 0) {
			bleAPI.transCmd("010500B081001B", "20", "82", function(serviceResult) {
				console.log("++++++++++++++万集读取防拆位状态++++++++++++++++");
				console.log(serviceResult);
				if (serviceResult.code == 0) {
					let result = serviceResult.data.substring(4, serviceResult.data.indexOf("9000"));
					typeof cb == "function" && cb(SUCCESS_CODE, result.substr(52, 2));
				} else {
					typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
				}
			});
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

// 防拆位减一
function updateAcctState(cb) {
	bleAPI.transCmd("010700A40000023F00", "20", "82", function(serviceResult) {
		if (serviceResult.code == 0) {
			bleAPI.transCmd("01050059000001", "20", "82", function(serviceResult) {
				console.log("++++++++++++++万集更新防拆位状态++++++++++++++++");
				console.log(serviceResult);
				if (serviceResult.code == 0) {
					typeof cb == "function" && cb(SUCCESS_CODE);
				} else {
					typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
				}
			});
		} else {
			typeof cb == "function" && cb(FAIL_CODE, serviceResult.err_msg);
		}
	});
}

// 读取obu车牌号
function getObuPlate(cb) {
	bleAPI.transCmd("010500B081003B", "20", "82", function(serviceResult) {
		console.log("+++++++++++++++万集斯读取obu车牌号++++++++++++++++++");
		console.log(serviceResult);
		if (serviceResult.code == 0) {
			let result = serviceResult.data.substring(4, serviceResult.data.indexOf("9000"));
			console.log(result);
			let plateNo = GBK.decode(result.substr(54, 24));
			console.log("车牌号：", plateNo);
			if (plateNo) {
				typeof cb === "function" && cb(SUCCESS_CODE, plateNo);
			} else {
				typeof cb === "function" && cb(FAIL_CODE, "无车牌号");
			}
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "读取车辆信息失败");
		}
	});
}
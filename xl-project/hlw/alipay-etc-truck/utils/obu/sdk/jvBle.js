// 金溢设备SDK

var bleUtil = require("./jv/GenvictBleUtil");
var SUCCESS_CODE = "0";
var GBK = require("../gbk/gbk.js");
var FAIL_CODE = "-1";

// 金溢
module.exports = {
	getObuId,
	initAuthDevice,
	obuActive,
	sendToDevice,
	getPlate,
	connectBle,
	deployBle,
	disconnectBle,
	getAcctState,
	updateAcctState,
	getObuPlate
};

// 部署蓝牙外设
function deployBle(cb){
	bleUtil.deployBle(function(code, res){
		if(code == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "状态:部署失败");
		}
	});
}

//连接蓝牙外设
function connectBle(device, cb){
	bleUtil.connectBle(device, function(code){
		if(code == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "状态: 连接失败");
		}
	});
}

// 断开连接
function disconnectBle(cb){
	bleUtil.disconnectBle(function(code){
		if(code == 0) {
			typeof cb === "function" && cb(SUCCESS_CODE);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "状态: 蓝牙断开失败");
		}
	});
}

// 获取设备表面号
function getObuId(cb){
	bleUtil.initDevice(function(code){
		if(code == 0) {
			bleUtil.deviceChannel("C0", function(code, res){
				if(code == 0) {
					var sn = hexToASCII(res.substr(res.toUpperCase().indexOf("C0") + 2, 32));
					console.log("obu-sn号：", sn);
					typeof cb === "function" && cb(SUCCESS_CODE, sn);
				} else {
					typeof cb === "function" && cb(FAIL_CODE, "获取设备编号失败");
				}
			});
		}
	});
}

//读取ICC卡信息
function getIccInfo(cb){
	bleUtil.getICCInfo(function(code, res){
		if(code == "0") {
			typeof cb === "function" && cb(SUCCESS_CODE, res);
		} else {
			typeof z === "function" && z(FAIL_CODE, res);
		}
	});
}

//设备验证
function initAuthDevice(random, mac, cb){
	bleUtil.deviceAuthenChannel(random, mac.substr(0, 8), function(code,res){
		if(code == 0 && res.toUpperCase().indexOf("BD00") > -1) {
			typeof cb === "function" && cb(SUCCESS_CODE);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "认证失败");
		}
	});
}


function hexToASCII(val){
	var hex = val.toString();
	var str = "";
	for(var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str;
}

// OBU激活
function obuActive(cb){
	var self = this;
	bleUtil.deviceChannel("C0", function(code, res){
		if(code == 0) {
			// 获取obu设备号
			var sn = hexToASCII(res.substr(res.toUpperCase().indexOf("C0") + 2, 32));
			// 取随机数
			var cmdArr = ["00A40000023F00", "0084000004"];
			bleUtil.gvEsamChannel("20", cmdArr, function(code, res){
				if(code == 0) {
					var random = res[1].substr(0, 8);
					var params = {
						obu_id: sn,
						random: random
					};
					typeof cb === "function" && cb(SUCCESS_CODE, params);
				} else {
					typeof cb === "function" && cb(FAIL_CODE, "选目录失败");
				}
			});
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "获取设备编号失败");
		}
	});
}


// 读卡
function getPlate(cb){
	let cosArr = ["00a40000023f00", "00a40000021001", "00B095002B"];
	sendToDevice("01", cosArr, function(code, res){
		if(code == "0") {
			let plateNo = GBK.decode(res[2].substring(56, 80));
			console.log("车牌号：", plateNo);
			if(plateNo) {
				typeof cb === "function" && cb(SUCCESS_CODE, plateNo);
			} else {
				typeof cb === "function" && cb(FAIL_CODE, "无车牌号");
			}
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "读卡失败");
		}
	});
}

// 指令透传  01 卡通道  02 obu
function sendToDevice(channel, cosArr, cb){
	// 01 卡通道 02 obu通道
	if(channel == "01") {
		bleUtil.cosChannel("10", cosArr, function(code, res){
			if(code == 0) {
				typeof cb === "function" && cb(SUCCESS_CODE, res);
			} else {
				typeof cb === "function" && cb(FAIL_CODE);
			}
		});
	} else if(channel == "02") {
		bleUtil.gvEsamChannel("20", cosArr, function(code, res){
			if(code == 0) {
				typeof cb === "function" && cb(SUCCESS_CODE, res);
			} else {
				typeof cb === "function" && cb(FAIL_CODE);
			}
		});
	}
}

//获取后台数据接口
/**
 * @url 接口地址
 * @data 参数
 * @returns
 * */
function ajax(url, data, cb1, cb2){
	my.request({
		url: url,
		header: {
			"auth-token": my.getStorageSync({ key: "token" }) || ""
		},
		method: "post",
		timeout: 20000,
		data: data,
		success: function(res){
			typeof cb1 === "function" && cb1(SUCCESS_CODE, res.data);
		},
		fail: function(error){
			typeof cb2 === "function" && cb2(FAIL_CODE, error.message);
		}
	});
}

// 读取防拆位状态
function getAcctState(cb){
	const arr = ["00A40000023F00", "00B081001B"];
	bleUtil.gvEsamChannel("20", arr, function(code, res){
		console.log(code);
		console.log(res);
		if(code == 0) {
			console.log("+++++++++++++++金溢读取防拆位状态+++++++++++++++++++++");
			console.log(code);
			console.log(res);
			typeof cb === "function" && cb(code, res[1].substr(52, 2));
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "读取防拆位状态失败");
		}
	});
}

// 防拆位减一
function updateAcctState(cb){
	const arr = ["00A40000023F00", "0059000001"];
	bleUtil.gvEsamChannel("20", arr, function(code, res){
		if(code == 0) {
			console.log("+++++++++++++++金溢更新防拆位状态++++++++++++++++++");
			console.log(code);
			console.log(res);
			typeof cb === "function" && cb(code);
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "更新防拆位状态失败");
		}
	});
}

// 读取obu车牌号
function getObuPlate(cb){
	bleUtil.gvEsamChannel("20", ["00B081003B"], function(code, res){
		if(code == 0) {
			console.log("+++++++++++++++金溢读取obu车牌号++++++++++++++++++");
			console.log(code);
			console.log(res);
			let plateNo = GBK.decode(res[0].substr(54, 24));
			console.log("车牌号：", plateNo);
			if(plateNo) {
				typeof cb === "function" && cb(SUCCESS_CODE, plateNo);
			} else {
				typeof cb === "function" && cb(FAIL_CODE, "无车牌号");
			}
		} else {
			typeof cb === "function" && cb(FAIL_CODE, "读取车辆信息失败");
		}
	});
}



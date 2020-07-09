"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
		return typeof e
	} : function (e) {
		return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
	},
	_WJService = require("./WJService.js"),
	_WJService2 = _interopRequireDefault(_WJService),
	_WJDataEncode = require("./WJDataEncode.js"),
	_WJDataEncode2 = _interopRequireDefault(_WJDataEncode),
	_WJDataInteract = require("./WJDataInteract.js"),
	_WJDataInteract2 = _interopRequireDefault(_WJDataInteract),
	_WJUtils = require("./WJUtils.js"),
	_WJUtils2 = _interopRequireDefault(_WJUtils),
	_WJDataAnalysis = require("./WJDataAnalysis.js"),
	_WJDataAnalysis2 = _interopRequireDefault(_WJDataAnalysis);

function _interopRequireDefault(e) {
	return e && e.__esModule ? e : {
		default: e
	}
}

var connectedDeviceId, TAG_FUNCTION = "function";

function connectDevice(t) {
	_WJService2.default.reallyConnect(function (e) {
		console.log("连接结果：", e.err_msg), (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(e)
	})
}

function connectDevice2(e, t) {
	_WJService2.default._connectDevice(e, function (e) {
		console.log("连接结果：", e.err_msg), (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(e)
	})
}

function disconnectDevice(e, t) {
	_WJService2.default.reallyDisConnect(e, function (e) {
		console.log("断开结果：", e.err_msg), (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(e)
	})
}

function authOBU(e, t, a, d) {
	var i = {},
		s = e.length;
	if (s == t && 8 == a.length) {
		var n = "c5" + _WJUtils2.default.byte2hexStr(4 + parseInt(s / 2)) + e + a,
			o = _WJUtils2.default.getCMD_TYPE(),
			r = {},
			l = "";
		0 == o ? l = "84" : 1 == o && (l = "A2"), r = _WJDataEncode2.default.encode(n, "", l), _WJDataInteract2.default._StartSendData(r.serviceData.dataEncode, function (e) {
			0 == e.serviceCode ? (r = _WJDataAnalysis2.default.analysisAuthOBU(e.serviceData.dataBuff), i.code = r.serviceCode, i.err_msg = r.serviceInfo, i.data = r.serviceData.dataBuff) : i = e, (void 0 === d ? "undefined" : _typeof(d)) == TAG_FUNCTION && d(i)
		})
	} else i.serviceCode = -1, i.serviceInfo = "paramater is error！", (void 0 === d ? "undefined" : _typeof(d)) == TAG_FUNCTION && d(i)
}

function getActState(t) {
	var a = {},
		e = "",
		d = _WJUtils2.default.getCMD_TYPE(),
		i = {};
	0 == d ? e = "810100C6" : 1 == d && (e = "A2"), i = _WJDataEncode2.default.encode(e), _WJDataInteract2.default._StartSendData(i.serviceData.dataEncode, function (e) {
		0 == e.serviceCode ? (i = _WJDataAnalysis2.default.analysisGetActState(e.serviceData.dataBuff), a.code = i.serviceCode, a.err_msg = i.serviceInfo, a.data = i.serviceData.dataBuff) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function lightAct(e, t, a) {
	var d = {},
		i = "",
		s = "",
		n = _WJUtils2.default.getCMD_TYPE();
	if (1 == e || 0 == e && 0 < t) {
		var o = _WJUtils2.default.byte2hexStr(t);
		s = 0 == e ? "C1" : "C2";
		var r = {};
		0 == n ? i = "870200" + s + o : 1 == n && (i = "A2"), r = _WJDataEncode2.default.encode(i), _WJDataInteract2.default._StartSendData(r.serviceData.dataEncode, function (e) {
			0 == e.serviceCode ? (r = _WJDataAnalysis2.default.analysisLightAct(e.serviceData.dataBuff), d.code = r.serviceCode, d.err_msg = r.serviceInfo, d.data = r.serviceData.dataBuff) : d = e, (void 0 === a ? "undefined" : _typeof(a)) == TAG_FUNCTION && a(d)
		})
	} else d.serviceCode = -1, d.serviceInfo = "paramater is error", (void 0 === a ? "undefined" : _typeof(a)) == TAG_FUNCTION && a(d)
}

function upNewPipe(e, t) {
	var a = {},
		d = "",
		i = _WJUtils2.default.getCMD_TYPE();
	if (-1 < e) {
		var s = _WJUtils2.default.byte2hexStr(e),
			n = {};
		0 == i ? d = "810200C7" + s : 1 == i && (d = "A2"), n = _WJDataEncode2.default.encode(d), _WJDataInteract2.default._StartSendData(n.serviceData.dataEncode, function (e) {
			0 == e.serviceCode ? (n = _WJDataAnalysis2.default.analysisUpNewPipe(e.serviceData.dataBuff), a.code = n.serviceCode, a.err_msg = n.serviceInfo, a.data = n.serviceData.dataBuff) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
		})
	} else a.serviceCode = -1, a.serviceInfo = "paramater is error", (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
}

function transCmd(e, t, a, d) {
	var i = {};
	if ("10" == t || "20" == t || "30" == t || "00" == t) {
		var s;
		s = _WJDataEncode2.default.encode(e, t, a), _WJDataInteract2.default._StartSendData(s.serviceData.dataEncode, function (e) {
			0 == e.serviceCode ? (_WJUtils2.default.showLog("APDU透传指令成功"), i.code = 0, i.err_msg = "transcmd success", i.data = e.serviceData.dataBuff) : (i.err_msg = e.serviceInfo, i.code = e.serviceCode), (void 0 === d ? "undefined" : _typeof(d)) == TAG_FUNCTION && d(i)
		})
	} else i.code = -1, i.msg = "cmdtype参数错误！", (void 0 === d ? "undefined" : _typeof(d)) == TAG_FUNCTION && d(i)
}

function initIC(t) {
	var a = {},
		d = {},
		e = "",
		i = _WJUtils2.default.getCMD_TYPE();
	d = {};
	0 == i ? e = "80" : 1 == i && (e = "A2"), d = _WJDataEncode2.default.encode(e), _WJDataInteract2.default._StartSendData(d.serviceData.dataEncode, function (e) {
		0 == e.serviceCode ? (d = _WJDataAnalysis2.default.analysisinitIC(e.serviceData.dataBuff), a.code = d.serviceCode, a.err_msg = d.serviceInfo, a.data = d.serviceData.dataBuff) : (a.code = e.serviceCode, a.err_msg = e.serviceInfo), (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function getDeviceInfo(e, t) {
	var a = {},
		d = "",
		i = _WJUtils2.default.getCMD_TYPE(),
		s = {};
	0 == i ? d = "810100" + e : 1 == i && (d = "A501" + e), s = _WJDataEncode2.default.encode(d), _WJDataInteract2.default._StartSendData(s.serviceData.dataEncode, function (e) {
		0 == e.serviceCode ? (_WJUtils2.default.showLog("获取设备信息成功"), s = _WJDataAnalysis2.default.analysisDeviceInfo(e.serviceData.dataBuff), a.err_msg = "获取设备信息成功", a.code = s.serviceCode, a.data = s.serviceData) : (a.code = e.serviceCode, a.err_msg = e.serviceInfo), (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function selectDir(t, e, a) {
	var d = {},
		i = {};
	if (4 == t.length && "10" == e || "20" == e) {
		var s = "010700A4000002" + t,
			n = e,
			o = "";
		1 == _WJUtils2.default.getTRANSFER_TYPE() && (s = _WJUtils2.default.TPDU2APDU(s));
		var r = _WJUtils2.default.getCMD_TYPE();
		0 == r ? o = "82" : 1 == r && (o = "A3"), this.transCmd(s, n, o, function (e) {
			0 == e.code ? (console.log(e.data), _WJUtils2.default.showLog("transCmd success", e.data), i = _WJDataAnalysis2.default._analysisIs9000(e.data), console.log(i), d.code = i.serviceCode, 0 == i.serviceCode ? (_WJUtils2.default.showLog("进 " + t + " 目录成功"), d.err_msg = "进" + t + "目录成功") : (_WJUtils2.default.showLog("进 " + t + " 目录失败"), d.err_msg = "进" + t + "目录失败")) : d = e, (void 0 === a ? "undefined" : _typeof(a)) == TAG_FUNCTION && a(d)
		})
	} else d.code = -1, d.err_msg = "参数长度有误", (void 0 === a ? "undefined" : _typeof(a)) == TAG_FUNCTION && a(d)
}

function getCardInfo(t) {
	var a = {},
		d = {},
		e = "010500B095002B0205805C000204",
		i = "",
		s = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (e = _WJUtils2.default.TPDU2APDU(e));
	var n = _WJUtils2.default.getCMD_TYPE();
	0 == n ? (i = "10", s = "82") : 1 == n && (i = "00", s = "A3"), this.transCmd(e, i, s, function (e) {
		0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisCardInfo(e.data), a.code = d.serviceCode, a.err_msg = "获取卡片信息成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function readCardOwnerRecord(t) {
	var a = {},
		d = {},
		e = "010500B0960037",
		i = "",
		s = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (e = _WJUtils2.default.TPDU2APDU(e));
	var n = _WJUtils2.default.getCMD_TYPE();
	0 == n ? (i = "10", s = "82") : 1 == n && (i = "00", s = "A3"), this.transCmd(e, i, s, function (e) {
		0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisCardOwnerRecord(e.data), a.code = d.serviceCode, a.err_msg = "获取持卡人信息成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function readCardTransactionRecord(e, t) {
	var a = {},
		d = {},
		i = "010500B2" + _WJUtils2.default.byte2hexStr(e) + "C400",
		s = "",
		n = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (i = _WJUtils2.default.TPDU2APDU(i));
	var o = _WJUtils2.default.getCMD_TYPE();
	0 == o ? (s = "10", n = "82") : 1 == o && (s = "00", n = "A3"), this.transCmd(i, s, n, function (e) {
		0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisCardTransactionRecord(e.data), a.code = d.serviceCode, a.err_msg = "获取交易记录信息成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function authPIN(e, t) {
	var a = {},
		d = {};
	if (e.length % 2 == 0 && 6 <= e.length && e.length <= 12) {
		var i = _WJUtils2.default.byte2hexStr(parseInt(e.length / 2)),
			s = "01" + _WJUtils2.default.byte2hexStr(5 + parseInt(e.length / 2)) + "00200000" + i + e,
			n = "",
			o = "";
		1 == _WJUtils2.default.getTRANSFER_TYPE() && (s = _WJUtils2.default.TPDU2APDU(s));
		var r = _WJUtils2.default.getCMD_TYPE();
		0 == r ? (n = "10", o = "82") : 1 == r && (n = "00", o = "A3"), this.transCmd(s, n, o, function (e) {
			0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default._analysisIs9000(e.data), a.code = d.serviceCode, 0 == a.code ? (_WJUtils2.default.showLog("PIN认证成功"), a.err_msg = "PIN认证成功") : (_WJUtils2.default.showLog("PIN认证失败"), a.err_msg = "PIN认证失败")) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
		})
	} else a.code = -1, a.err_msg = "参数长度有误", (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
}

function initLoadCreadit(e, t, a, d, i, s) {
	var n = {},
		o = {};
	if (null != e && null != t && null != a && null != d && null != i)
		if (12 == a.length && 2 == d.length && 2 == i.length) {
			var r = new ArrayBuffer(4),
				l = new DataView(r);
			l.setInt8(0, t >> 24 & 255), l.setInt8(1, t >> 16 & 255), l.setInt8(2, t >> 8 & 255), l.setInt8(3, t >> 0 & 255);
			var c = "0110805000" + d + "0B" + i + _WJUtils2.default.byteArray2hexStr(r) + a,
				f = "",
				_ = "";
			1 == _WJUtils2.default.getTRANSFER_TYPE() && (c = _WJUtils2.default.TPDU2APDU(c));
			var u = _WJUtils2.default.getCMD_TYPE();
			0 == u ? (f = "10", _ = "82") : 1 == u && (f = "00", _ = "A3"), this.transCmd(c, f, _, function (e) {
				0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), o = _WJDataAnalysis2.default.analysisInitInfo(e.data), n.code = o.serviceCode, n.err_msg = "圈存初始化成功", n.data = o.serviceData) : n = e, (void 0 === s ? "undefined" : _typeof(s)) == TAG_FUNCTION && s(n)
			})
		} else n.code = -2, n.err_msg = "参数长度有误！", (void 0 === s ? "undefined" : _typeof(s)) == TAG_FUNCTION && s(n);
	else n.code = -1, n.err_msg = "参数有空！", (void 0 === s ? "undefined" : _typeof(s)) == TAG_FUNCTION && s(n)
}

function loadCreadit(e, t) {
	var a = {},
		d = {};
	if (null != e && 22 == e.length) {
		var i = "0111805200000B" + e + "04",
			s = "",
			n = "";
		1 == _WJUtils2.default.getTRANSFER_TYPE() && (i = _WJUtils2.default.TPDU2APDU(i));
		var o = _WJUtils2.default.getCMD_TYPE();
		0 == o ? (s = "10", n = "82") : 1 == o && (s = "00", n = "A3"), this.transCmd(i, s, n, function (e) {
			0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisLoadCreadit(e.data), a.code = d.serviceCode, a.err_msg = "圈存成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
		})
	} else a.code = -1, a.err_msg = "获取圈存指令失败：参数null或长度有误", (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
}

function getObuSysInfo(t) {
	var a = {},
		d = {},
		e = "010500B081001B",
		i = "",
		s = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (e = _WJUtils2.default.TPDU2APDU(e));
	var n = _WJUtils2.default.getCMD_TYPE();
	0 == n ? (i = "20", s = "82") : 1 == n && (i = "00", s = "A0"), this.transCmd(e, i, s, function (e) {
		0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisgetObuSysInfo(e.data), a.code = d.serviceCode, a.err_msg = "获取系统信息成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function getRand(e, t) {
	var a = {},
		d = {},
		i = "01050084000004",
		s = e,
		n = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (i = _WJUtils2.default.TPDU2APDU(i));
	var o = _WJUtils2.default.getCMD_TYPE();
	0 == o ? n = "82" : 1 == o && (n = "A3"), this.transCmd(i, s, n, function (e) {
		0 == e.code ? (_WJUtils2.default.showLog("transCmd success"), d = _WJDataAnalysis2.default.analysisGetRand(e.data), a.code = d.serviceCode, a.err_msg = "获取随机数成功", a.data = d.serviceData) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function writeOBUInfo(e, t) {
	var a = {},
		d = {};
	if (null != e && e.length % 2 == 0) {
		var i = "01" + _WJUtils2.default.byte2hexStr(parseInt(e.length / 2)) + e,
			s = "",
			n = "";
		1 == _WJUtils2.default.getTRANSFER_TYPE() && (i = _WJUtils2.default.TPDU2APDU(i));
		var o = _WJUtils2.default.getCMD_TYPE();
		0 == o ? (s = "20", n = "82") : 1 == o && (s = "00", n = "A0"), this.transCmd(i, s, n, function (e) {
			0 == e.serviceCode ? (d = _WJDataAnalysis2.default._analysisIs9000(e.data), a.code = d.serviceCode, 0 == a.serviceCode ? (_WJUtils2.default.showLog("写OBU信息成功"), a.err_msg = "写OBU信息成功") : (_WJUtils2.default.showLog("写OBU信息失败"), a.err_msg = "写OBU信息失败")) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
		})
	} else a.code = -1, a.err_msg = "参数错误", (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
}

function writeObuIssueSpecial(t) {
	var a = {},
		d = {},
		e = "01050059000001",
		i = "",
		s = "";
	1 == _WJUtils2.default.getTRANSFER_TYPE() && (e = _WJUtils2.default.TPDU2APDU(e));
	var n = _WJUtils2.default.getCMD_TYPE();
	0 == n ? (i = "20", s = "82") : 1 == n && (i = "00", s = "A0"), this.transCmd(e, i, s, function (e) {
		0 == e.code ? (d = _WJDataAnalysis2.default._analysisIs9000(e.data), a.code = d.serviceCode, 0 == a.serviceCode ? (_WJUtils2.default.showLog("写OBU信息成功"), a.err_msg = "写OBU信息成功") : (_WJUtils2.default.showLog("写OBU信息失败"), a.err_msg = "写OBU信息失败")) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
	})
}

function writeICInfo(e, t) {
	var a = {},
		d = {};
	if (null != e && e.length % 2 == 0) {
		var i = "01" + _WJUtils2.default.byte2hexStr(parseInt(e.length / 2)) + e,
			s = "",
			n = "";
		1 == _WJUtils2.default.getTRANSFER_TYPE() && (i = _WJUtils2.default.TPDU2APDU(i));
		var o = _WJUtils2.default.getCMD_TYPE();
		0 == o ? (s = "10", n = "82") : 1 == o && (s = "00", n = "A3"), this.transCmd(i, s, n, function (e) {
			0 == e.code ? (d = _WJDataAnalysis2.default._analysisIs9000(e.data), a.code = d.serviceCode, 0 == a.serviceCode ? (_WJUtils2.default.showLog("写IC信息成功"), a.err_msg = "写IC信息成功") : (_WJUtils2.default.showLog("写IC信息失败"), a.err_msg = "写IC信息失败")) : a = e, (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
		})
	} else a.code = -1, a.err_msg = "参数错误", (void 0 === t ? "undefined" : _typeof(t)) == TAG_FUNCTION && t(a)
}

module.exports = {
	connectDevice: connectDevice,
	connectDevice2: connectDevice2,
	disconnectDevice: disconnectDevice,
	transCmd: transCmd,
	getDeviceInfo: getDeviceInfo,
	getCardInfo: getCardInfo,
	selectDir: selectDir,
	getObuSysInfo: getObuSysInfo,
	getRand: getRand,
	authPIN: authPIN,
	initLoadCreadit: initLoadCreadit,
	loadCreadit: loadCreadit,
	writeOBUInfo: writeOBUInfo,
	writeICInfo: writeICInfo,
	readCardOwnerRecord: readCardOwnerRecord,
	readCardTransactionRecord: readCardTransactionRecord,
	initIC: initIC,
	authOBU: authOBU,
	upNewPipe: upNewPipe,
	lightAct: lightAct,
	getActState: getActState
};

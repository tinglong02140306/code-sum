"use strict";
var _WJUtils = require("./WJUtils.js"),
	_WJUtils2 = _interopRequireDefault(_WJUtils);

function _interopRequireDefault(e) {
	return e && e.__esModule ? e : {
		default: e
	}
}

function analysisAuthOBU(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {};
	return 1 == r.byteLength ? (197 == (255 & r[0]) ? (t.serviceCode = 0, t.serviceInfo = "认证成功") : (t.serviceCode = -2, t.serviceInfo = "认证失败"), t.serviceData = {}, t.serviceData.dataBuff = e) : (t.serviceCode = -1, t.serviceInfo = "认证失败，信息长度有误"), t
}

function analysisGetActState(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {};
	return 2 == r.byteLength ? 198 == (255 & r[0]) ? (0 == (255 & r[1]) ? (t.serviceCode = 0, t.serviceInfo = "防拆弹起") : 1 == (255 & r[1]) ? (t.serviceCode = 0, t.serviceInfo = "防拆按下") : (t.serviceCode = -3, t.serviceInfo = "防拆状态异常"), t.serviceData = {}, t.serviceData.dataBuff = e.substr(2)) : (t.serviceCode = -2, t.serviceInfo = "解析失败", t.serviceData = {}, t.serviceData.dataBuff = e) : (t.serviceCode = -1, t.serviceInfo = "获取防拆失败，信息长度有误"), t
}

function analysisLightAct(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {};
	return 1 == r.byteLength ? (193 == (255 & r[0]) ? (t.serviceCode = 0, t.serviceInfo = "闪前灯成功") : 194 == (255 & r[0]) ? (t.serviceCode = 0, t.serviceInfo = "闪后灯成功") : (t.serviceCode = -2, t.serviceInfo = "闪灯异常"), t.serviceData = {}, t.serviceData.dataBuff = e) : (t.serviceCode = -1, t.serviceInfo = "闪灯失败，信息长度有误"), t
}

function analysisUpNewPipe(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {};
	return 2 == r.byteLength ? (199 == (255 & r[0]) && 0 == (255 & r[1]) ? (t.serviceCode = 0, t.serviceInfo = "更新成功") : (t.serviceCode = -2, t.serviceInfo = "更新失败"), t.serviceData = {}, t.serviceData.dataBuff = e) : (t.serviceCode = -1, t.serviceInfo = "更新失败，信息长度有误"), t
}

function analysisinitIC(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {};
	return 73 == r.byteLength ? (0 == (128 & r[1]) ? (t.serviceCode = 0, t.serviceInfo = "初始化成功") : 128 == (128 & r[1]) ? (t.serviceCode = 1, t.serviceInfo = "初始化失败") : (t.serviceCode = -3, t.serviceInfo = "初始化异常"), t.serviceData = {}, t.serviceData.dataBuff = e) : (t.serviceCode = -2, t.serviceInfo = "获取卡片初始化失败，信息长度有误"), t
}

function analysisCardInfo(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (55 != a) return t.serviceCode = -3, t.serviceInfo = "获取卡片信息失败，信息长度有误", t;
	var i = r.slice(2, 10),
		l = r.slice(10, 11),
		c = (r.slice(11, 12), r.slice(12, 14)),
		n = r.slice(14, 22),
		y = r.slice(22, 26),
		o = (r.slice(26, 30), r.slice(30, 42)),
		d = r.slice(42, 43),
		f = r.slice(43, 44),
		v = r.slice(44, 45),
		u = r.slice(49, 53),
		h = parseInt((255 & u[0]) << 24);
	return h += parseInt((255 & u[1]) << 16), h += parseInt((255 & u[2]) << 8), h += parseInt(255 & u[3]), _WJUtils2.default.showLog("cardIssuerID：", _WJUtils2.default.byteArray2hexStr(i), "bindedPlate", _WJUtils2.default.byteArray2hexStr(o), "balance:", h), t.serviceCode = 0, t.serviceInfo = "获取卡片信息成功", t.serviceData = {}, t.serviceData.cardIssuerID = _WJUtils2.default.byteArray2hexStr(i), t.serviceData.cardType = _WJUtils2.default.byteArray2hexStr(l), t.serviceData.roadswebID = _WJUtils2.default.byteArray2hexStr(c), t.serviceData.cardNo = _WJUtils2.default.byteArray2hexStr(n), t.serviceData.SignedDate = _WJUtils2.default.byteArray2hexStr(y), t.serviceData.bindedPlate = _WJUtils2.default.byteArray2hexStr(o), t.serviceData.userType = _WJUtils2.default.byteArray2hexStr(d), t.serviceData.vehColor = _WJUtils2.default.byteArray2hexStr(f), t.serviceData.vehType = _WJUtils2.default.byteArray2hexStr(v), t.serviceData.intbalance = h, t
}

function analysisCardOwnerRecord(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (59 != a) return t.serviceCode = -3, t.serviceInfo = "获取持卡人信息失败，信息长度有误", t;
	var i = r.slice(2, 3),
		l = r.slice(3, 4),
		c = r.slice(4, 24),
		n = r.slice(24, 56),
		y = r.slice(56, 57);
	return _WJUtils2.default.showLog("ownerName：", _WJUtils2.default.byteArray2hexStr(c), "ownerLicenseNumber：", _WJUtils2.default.byteArray2hexStr(n), "ownerLicenseType:", y), t.serviceCode = 0, t.serviceInfo = "获取持卡人信息成功", t.serviceData = {}, t.serviceData.ownerId = _WJUtils2.default.byteArray2hexStr(i), t.serviceData.staffId = _WJUtils2.default.byteArray2hexStr(l), t.serviceData.ownerName = _WJUtils2.default.byteArray2hexStr(c), t.serviceData.ownerLicenseNumber = _WJUtils2.default.byteArray2hexStr(n), t.serviceData.ownerLicenseType = _WJUtils2.default.byteArray2hexStr(y), t
}

function analysisCardTransactionRecord(e) {
	var r = 0,
		t = _WJUtils2.default.hexStr2byteArray(e),
		a = t.byteLength,
		s = {};
	if (4 <= a) {
		for (s.serviceCode = 0, s.serviceInfo = "获取交易记录信息成功", s.serviceData = {}, s.serviceData.CardTransactionRecordData = []; r < a;) {
			var i = t[r++],
				l = t[r] - 1;
			if (console.log("WJ9000校验第" + i + "条：", t[r + l], t[r + l + 1]), 144 != t[r + l] || 0 != t[r + l + 1]) return console.log("交易记录：", s), s;
			var c = {};
			if (r++, c.onlineSn = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 2)), r += 2, c.overdrawLimit = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 3)), r += 3, c.transAmount = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 4)), r += 4, c.transType = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 1)), r += 1, c.terminalNo = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 6)), r += 6, c.transDate = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 4)), r += 4, c.transTime = _WJUtils2.default.byteArray2hexStr(t.slice(r, r + 3)), r += 3, r += 2, s.serviceData.CardTransactionRecordData.push(c), "ffff" == _WJUtils2.default.byteArray2hexStr(c.onlineSn) || "0000" == _WJUtils2.default.byteArray2hexStr(c.onlineSn)) return console.log("交易记录：", s), s
		}
		return console.log("交易记录：", s), s
	}
	return s.serviceCode = -3, s.serviceInfo = "获取交易记录失败，信息长度有误", s
}

function analysisInitInfo(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (20 != a) return t.serviceCode = -3, t.serviceInfo = "解析圈存初始化失败，信息长度有误", t;
	var i = r.slice(2, 6),
		l = r.slice(6, 8),
		c = r.slice(8, 9),
		n = r.slice(9, 10),
		y = r.slice(10, 14),
		o = r.slice(14, 18),
		d = parseInt((255 & i[0]) << 24);
	return d += parseInt((255 & i[1]) << 16), d += parseInt((255 & i[2]) << 8), d += parseInt(255 & i[3]), _WJUtils2.default.showLog("intbalance：", d, "pseudoRand:", _WJUtils2.default.byteArray2hexStr(y), "Mac1:", _WJUtils2.default.byteArray2hexStr(o), "CardSeq:", _WJUtils2.default.byteArray2hexStr(l)), t.serviceCode = 0, t.serviceInfo = "解析圈存初始化成功", t.serviceData = {}, t.serviceData.intbalance = d, t.serviceData.CardSeq = _WJUtils2.default.byteArray2hexStr(l), t.serviceData.keyVersion = _WJUtils2.default.byteArray2hexStr(c), t.serviceData.algTag = _WJUtils2.default.byteArray2hexStr(n), t.serviceData.pseudoRand = _WJUtils2.default.byteArray2hexStr(y), t.serviceData.Mac1 = _WJUtils2.default.byteArray2hexStr(o), t
}

function analysisLoadCreadit(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (8 != a) return t.serviceCode = -3, t.serviceInfo = "圈存解析失败，长度有误", t;
	var i = r.slice(2, 6);
	return _WJUtils2.default.showLog("TAG", _WJUtils2.default.byteArray2hexStr(i)), t.serviceCode = 0, t.serviceInfo = "圈存成功", t.serviceData = {}, t.serviceData.TAG = _WJUtils2.default.byteArray2hexStr(i), t
}

function analysisgetObuSysInfo(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (31 != a) return t.serviceCode = -1, t.serviceInfo = "OBU系统信息解析失败，长度有误", t;
	var i = r.slice(2, 10),
		l = r.slice(10, 11),
		c = r.slice(11, 12),
		n = r.slice(12, 20),
		y = r.slice(20, 24),
		o = r.slice(24, 28),
		d = r.slice(28, 29);
	return _WJUtils2.default.showLog("contractProvider", _WJUtils2.default.byteArray2hexStr(i), "contractSerialNumber", _WJUtils2.default.byteArray2hexStr(n), "issueFlag", _WJUtils2.default.byteArray2hexStr(d)), t.serviceCode = 0, t.serviceInfo = "获取OBU系统成功", t.serviceData = {}, t.serviceData.contractProvider = _WJUtils2.default.byteArray2hexStr(i), t.serviceData.contractType = _WJUtils2.default.byteArray2hexStr(l), t.serviceData.contractVersion = _WJUtils2.default.byteArray2hexStr(c), t.serviceData.contractSerialNumber = _WJUtils2.default.byteArray2hexStr(n), t.serviceData.contractSignedDate = _WJUtils2.default.byteArray2hexStr(y), t.serviceData.contractExpiredDate = _WJUtils2.default.byteArray2hexStr(o), t.serviceData.issueFlag = _WJUtils2.default.byteArray2hexStr(d), t
}

function analysisGetRand(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = r.byteLength,
		s = _analysisIs9000(e);
	if (0 != s.serviceCode) return t = s;
	if (8 != a) return t.serviceCode = -1, t.serviceInfo = "获取随机数失败，长度有误", t;
	var i = r.slice(2, 6);
	return _WJUtils2.default.showLog("rand", _WJUtils2.default.byteArray2hexStr(i)), t.serviceCode = 0, t.serviceInfo = "获取随机数成功", t.serviceData = {}, t.serviceData.rand = _WJUtils2.default.byteArray2hexStr(i), t
}

function _analysisIs9000(e) {
	console.log("5465464");
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = 0,
		s = r.byteLength;
	if (4 <= s) {
		for (; a < s;) {
			var i = r[a++];
			if (a += r[a] - 1, _WJUtils2.default.showLog("WJ9000校验第" + i + "条：", r[a], r[a + 1]), 144 != r[a] || 0 != r[a + 1]) {
				t.serviceCode = -1, t.serviceInfo = "WJ第" + i + "包APDU非9000";
				break
			}
			a += 2, t.serviceCode = 0, t.serviceInfo = "9000认证成功"
		}
		return t
	}
	return t.serviceCode = -2, t.serviceInfo = "9000认证失败，长度有误", t
}

function analysisDeviceInfo(e) {
	var r = _WJUtils2.default.hexStr2byteArray(e),
		t = {},
		a = 0,
		s = r.byteLength,
		i = r[a++];
	switch (_WJUtils2.default.showLog(e), i) {
		case 192:
			if (17 != s) return t.serviceCode = -1, t.serviceInfo = "获取设备信息失败，信息长度有误", t;
			var l = r.slice(1);
			return _WJUtils2.default.showLog("deviceSN:", _WJUtils2.default.byteArray2hexStr(l)), t.serviceCode = 0, t.serviceInfo = "获取设备信息成功", t.serviceData = {}, t.serviceData.deviceSN = _WJUtils2.default.byteArray2hexStr(l), t;
		case 204:
			if (17 != s) return t.serviceCode = -1, t.serviceInfo = "获取设备信息失败，信息长度有误", t;
			var c = r.slice(1, 3),
				n = r.slice(3, 4),
				y = (l = r.slice(4, 12), r.slice(12, 16)),
				o = r.slice(16);
			return _WJUtils2.default.showLog("deviceSN:", _WJUtils2.default.byteArray2hexStr(l), "bleMac:", _WJUtils2.default.byteArray2hexStr(y), "flag:", _WJUtils2.default.byteArray2hexStr(o)), t.serviceCode = 0, t.serviceInfo = "获取设备信息成功", t.serviceData = {}, t.serviceData.verId = _WJUtils2.default.byteArray2hexStr(c), t.serviceData.battery = _WJUtils2.default.byteArray2hexStr(n), t.serviceData.deviceSN = _WJUtils2.default.byteArray2hexStr(l), t.serviceData.bleMac = _WJUtils2.default.byteArray2hexStr(y), t.serviceData.flag = o, t;
		default:
			return t.serviceCode = -2, t.serviceInfo = "获取设备信息失败，指令类型有误", _WJUtils2.default.showError("WJ获取设备信息失败:", "指令类型有误"), t
	}
}

module.exports = {
	analysisCardInfo: analysisCardInfo,
	analysisDeviceInfo: analysisDeviceInfo,
	analysisInitInfo: analysisInitInfo,
	analysisLoadCreadit: analysisLoadCreadit,
	analysisgetObuSysInfo: analysisgetObuSysInfo,
	analysisGetRand: analysisGetRand,
	_analysisIs9000: _analysisIs9000,
	analysisCardOwnerRecord: analysisCardOwnerRecord,
	analysisCardTransactionRecord: analysisCardTransactionRecord,
	analysisinitIC: analysisinitIC,
	analysisAuthOBU: analysisAuthOBU,
	analysisGetActState: analysisGetActState,
	analysisLightAct: analysisLightAct,
	analysisUpNewPipe: analysisUpNewPipe
};

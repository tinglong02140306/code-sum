"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
		return typeof e
	} : function (e) {
		return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
	},
	_WJService = require("./WJService.js"),
	_WJService2 = _interopRequireDefault(_WJService),
	_WJUtils = require("./WJUtils.js"),
	_WJUtils2 = _interopRequireDefault(_WJUtils),
	_WJDataDecode = require("./WJDataDecode.js"),
	_WJDataDecode2 = _interopRequireDefault(_WJDataDecode);

function _interopRequireDefault(e) {
	return e && e.__esModule ? e : {
		default: e
	}
}

var TAG_FUNCTION = "function",
	sendCallback = void 0,
	TimerID = null;

function _StartSendData(a, e) {
	var l = {},
		r = 0,
		i = 0;
	null != TimerID && (clearTimeout(TimerID), TimerID = null), _WJDataDecode2.default.init(), TimerID = setTimeout(pro_timeout, 1e4), _WJUtils2.default.showLog(TimerID, "开启时钟"), sendCallback = e, _WJService2.default.SetDataListenerCallBack(!0, datacallback),
		function t() {
			var e = "";
			40 * i >= a[r].length && (r++, i = 0);
			r < a.length && (e = a[r].length >= 40 * (i + 1) ? a[r].substring(40 * i, 40 * (i + 1)) : a[r].substring(40 * i, a[r].length));
			"" == e ? _WJUtils2.default.showLog("数据发送完毕！") : (_WJUtils2.default.showLog("发送数据：", e), _WJService2.default.reallyWriteBLECharacteristicValue(e, function (e) {
				0 == e.code ? (i++, t()) : (_WJUtils2.default.showError(TimerID, "数据发送失败，取消时钟"), null != TimerID && (clearTimeout(TimerID), TimerID = null), _WJService2.default.SetDataListenerCallBack(!1), l.serviceCode = -2, l.serviceInfo = "数据发送失败", (void 0 === sendCallback ? "undefined" : _typeof(sendCallback)) == TAG_FUNCTION && sendCallback(l))
			}))
		}()
}

function datacallback(e) {
	_WJService2.default.SetDataListenerCallBack(!0, datacallback), _ReceiveData(e)
}

function pro_timeout() {
	var e = {};
	_WJUtils2.default.showError(TimerID, "数据接收超时，取消时钟"), null != TimerID && (clearTimeout(TimerID), TimerID = null), _WJService2.default.SetDataListenerCallBack(!1), e.serviceCode = -3, e.serviceInfo = "数据接收超时", (void 0 === sendCallback ? "undefined" : _typeof(sendCallback)) == TAG_FUNCTION && sendCallback(e)
}

function _ReceiveData(e) {
	for (var t = _WJUtils2.default.hexStr2byteArray(e), a = new ArrayBuffer(t.byteLength), l = new DataView(a), r = 0; r < t.byteLength; r++) l.setUint8(r, t[r]);
	var i, o, s = {},
		u = _WJUtils2.default.getProtocolType();
	0 == u ? i = _WJDataDecode2.default.decode_GB(a) : 1 == u && (i = _WJDataDecode2.default.decode_WX(a)), 0 == i.serviceCode && (null != (o = PackageDecode(i.serviceData.strData)) ? (_WJUtils2.default.showLog(TimerID, "接收数据成功，取消时钟"), null != TimerID && (clearTimeout(TimerID), TimerID = null), _WJService2.default.SetDataListenerCallBack(!1), s.serviceCode = 0, s.serviceInfo = "数据接收成功", s.serviceData = {}, s.serviceData.dataBuff = o) : (_WJUtils2.default.showError(TimerID, "数据解析失败，取消时钟"), null != TimerID && (clearTimeout(TimerID), TimerID = null), _WJService2.default.SetDataListenerCallBack(!1), s.serviceCode = -1, s.serviceInfo = "数据解析失败"), (void 0 === sendCallback ? "undefined" : _typeof(sendCallback)) == TAG_FUNCTION && sendCallback(s))
}

function PackageDecode(e) {
	var t, a = _WJUtils2.default.getDATA_TYPE(),
		l = _WJUtils2.default.hexStr2byteArray(e),
		r = 0,
		i = l[1],
		o = l[0];
	if (_WJUtils2.default.showLog("WJPackageDecode：", e), 0 != i) return _WJUtils2.default.showError("WJ结果码非00"), null;
	switch (o) {
		case 146:
		case 176:
		case 179:
		case 180:
			if (0 == a) {
				var s = 7;
				129 == l[5] && (129 == l[6] ? (r = 255 & l[7], s += 1) : 130 == l[6] ? (r = l[7] << 8, r += 255 & l[8], s += 2) : r = 255 & l[6]), t = l.slice(s, r + s), c = _WJUtils2.default.byteArray2hexStr(t)
			} else 1 == a && (t = l.slice(5), c = _WJUtils2.default.APDU2TPDU(_WJUtils2.default.byteArray2hexStr(t)));
			return _WJUtils2.default.showLog("WJ有效数据长度：", c.length / 2, c), _WJUtils2.default.showLog("操作类型ok", o), c;
		case 145:
		case 151:
		case 148:
		case 144:
			var u = (255 & l[3]) << 8;
			u += l[2], t = l.slice(4, u + 4);
			var c = _WJUtils2.default.byteArray2hexStr(t);
			return _WJUtils2.default.showLog("WJ有效数据长度：", u, _WJUtils2.default.byteArray2hexStr(t)), _WJUtils2.default.showLog("操作类型ok", o), c;
		case 181:
			u = l[2];
			return t = l.slice(3, u + 3), _WJUtils2.default.showLog("WJ有效数据长度：", u, _WJUtils2.default.byteArray2hexStr(t)), _WJUtils2.default.showLog("操作类型ok", o), _WJUtils2.default.byteArray2hexStr(t);
		default:
			return _WJUtils2.default.showError("WJ通道类型有误"), null
	}
}

module.exports = {
	_StartSendData: _StartSendData,
	_ReceiveData: _ReceiveData
};

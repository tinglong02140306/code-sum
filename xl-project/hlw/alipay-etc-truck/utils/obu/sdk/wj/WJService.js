"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
		return typeof e;
	} : function(e) {
		return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	},
	_WJUtils = require("./WJUtils.js"),
	_WJUtils2 = _interopRequireDefault(_WJUtils);

function _interopRequireDefault(e) {
	return e && e.__esModule ? e : {
		default: e
	};
}

var connectedDeviceId, timeID, services = "0000fee7-0000-1000-8000-00805f9b34fb",
	notifyServiceId = "0000fec8-0000-1000-8000-00805f9b34fb",
	writeServiceId = "0000fec7-0000-1000-8000-00805f9b34fb",
	services_IOS = "FEE7",
	notifyServiceId_IOS = "FEC8",
	writeServiceId_IOS = "FEC7",
	reality_notifyServiceId = void 0,
	reality_writeServiceId = void 0,
	reality_services = void 0,
	TAG_FUNCTION = "function";

function reallyConnect(r) {
	var c = {};
	console.log("/***********Runing :: Do reallyConnect() begin *************/");
	var a = [];
	my.closeBluetoothAdapter(), my.openBluetoothAdapter({
		success: function(e) {
			my.startBluetoothDevicesDiscovery({
				services: [],
				success: function(e) {
					_onBLEConnectionStateChanged(), my.onBluetoothDeviceFound(function(e) {
						for (var c = 0; c < e.devices.length; c++) {
							for (var i = !1, t = 0; t < a.length; t++) {
								if (e.devices[c].deviceId == a[t].deviceId) {
									i = !0;
									break;
								}
							}
							var o = e.devices[c].name;
							if (console.log("connectedDeviceName", o), 0 == i && ("" != o || null != o) && (a.push(e.devices[c]), -1 != o.indexOf("WJ") || -1 != o.indexOf("WanJi"))) {
								my.offBluetoothDeviceFound(), connectedDeviceId = e.devices[c].deviceId;
								var n = {};
								n.device_name = o, n.device_no = connectedDeviceId, my.stopBluetoothDevicesDiscovery({
									success: function(e) {
										console.log("停止扫描，开始连接");
										_connectDevice(n, function(e) {
											(void 0 === r ? "undefined" : _typeof(r)) == TAG_FUNCTION && r(e);
										});
									}
								});
								break;
							}
						}
					});
				}, fail: function(e) {
					console.log("scanerror:" + e), c.code = 10024, c.err_msg = "scanerror fail!", (void 0 === r ? "undefined" : _typeof(r)) == TAG_FUNCTION && r(c);
				}
			}), timeID = setTimeout(function() {
				my.stopBluetoothDevicesDiscovery(), my.offBluetoothDeviceFound(), console.log("scan timeout"), c.code = -3, c.err_msg = "scan timeout fail!", (void 0 === r ? "undefined" : _typeof(r)) == TAG_FUNCTION && r(c);
			}, 5e3);
		}, fail: function(e) {
			console.log("openadapter:" + e), c.code = 10023, c.err_msg = "openadapter fail!", (void 0 === r ? "undefined" : _typeof(r)) == TAG_FUNCTION && r(c);
		}
	});
}

function _connectDevice(e, c) {
	var i = {},
		t = e.device_name;
	console.log("name:", t), -1 != t.indexOf("WJ") || -1 != t.indexOf("WanJi") ? (connectedDeviceId = e.device_no, my.connectBLEDevice({
		deviceId: connectedDeviceId,
		success: function(e) {
			console.log("已连接,开始使能服务", connectedDeviceId), _enableService(function(e) {
				0 == e.code ? (console.log("已连接,并使能成功"), (i = e).err_msg = "conned and enable success", i.data = connectedDeviceId) : (i = e).code = 10023, (void 0 === c ? "undefined" : _typeof(c)) == TAG_FUNCTION && c(i);
			});
		}, fail: function(e) {
			console.log("creatcon error:" + e), i.code = 10021, i.err_msg = "creatcon error fail!", (void 0 === c ? "undefined" : _typeof(c)) == TAG_FUNCTION && c(i);
		}
	})) : (i.code = 10020, i.err_msg = "device's name error", (void 0 === c ? "undefined" : _typeof(c)) == TAG_FUNCTION && c(i));
}

/* modified by lemon
*  2019-07-04
*  连接设备
* */
function connectDevice(e, A) {
	var t = e.name;
	if(t.indexOf("WJ") > -1 || t.indexOf("WanJi") > -1) {
		connectedDeviceId = e.deviceId;
		my.connectBLEDevice({
			deviceId: connectedDeviceId,
			success(res){
				console.log('>>>>>>>>>>>>>>>>');
				console.log(res);
				typeof A === 'function' && A(0)
			},
			fail(){
				typeof A === 'function' && A(10021)
			}
		});
		return;
	}
	typeof A === 'function' && A(10020);
}

/*
* modified by lemon 2019-07-04
* 设备部署
* */
function enableService(n) {
	console.log("_enableService start!");
	var r = {};
	my.getBLEDeviceServices({
		deviceId: connectedDeviceId,
		isPrimary: !0,
		success: function(e) {
			for (var c = 0; c < e.services.length; c++) {
				var i = e.services[c].serviceId;
				_WJUtils2.default.showLog("serviceuuid:", i), i !== services && i !== services_IOS || (reality_services = i, _WJUtils2.default.showLog("开始获取特征"), my.getBLEDeviceCharacteristics({
					deviceId: connectedDeviceId,
					serviceId: i,
					success: function(e) {
						for (var c = 0, i = 0; i < e.characteristics.length; i++) {
							var t = e.characteristics[i].characteristicId,
								o = e.characteristics[i].properties;
							_WJUtils2.default.showLog("chauuid:", t), _WJUtils2.default.showLog("valueID:", o), t === notifyServiceId || t === notifyServiceId_IOS ? (reality_notifyServiceId = t, c++) : t !== writeServiceId && t !== writeServiceId_IOS || (reality_writeServiceId = t, c++);
						}
						c < 2 ? (r.code = -1, console.log("getBLEDeviceCharacteristics temp<2!"), r.err_msg = "getBLEDeviceCharacteristics temp<2!", (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(-1)) : my.notifyBLECharacteristicValueChange({
							deviceId: connectedDeviceId,
							serviceId: reality_services,
							characteristicId: reality_notifyServiceId,
							state: !0,
							success: function(e) {
								_onBLECharacteristicValueChange(), null != timeID && (clearTimeout(timeID), timeID = null), console.log("notifyBLECharacteristicValueChange success!"), r.code = 0, r.err_msg = "enable success!", (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(0);
							}, fail: function() {
								r.code = -2, r.err_msg = "notifyBLECharacteristicValueChange fail!", console.log("notifyBLECharacteristicValueChange fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(-2);
							}
						});
					}, fail: function() {
						r.code = -3, r.err_msg = "getBLEDeviceCharacteristics fail!", console.log("getBLEDeviceCharacteristics fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(-3);
					}
				}));
			}
		}, fail: function(e) {
			r.code = -4, r.err_msg = "getBLEDeviceServices fail!", console.log("getBLEDeviceServices fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(-4);
		}
	});
}

function _enableService(n) {
	console.log("_enableService start!");
	var r = {};
	my.getBLEDeviceServices({
		deviceId: connectedDeviceId,
		isPrimary: !0,
		success: function(e) {
			for (var c = 0; c < e.services.length; c++) {
				var i = e.services[c].serviceId;
				_WJUtils2.default.showLog("serviceuuid:", i), i !== services && i !== services_IOS || (reality_services = i, _WJUtils2.default.showLog("开始获取特征"), my.getBLEDeviceCharacteristics({
					deviceId: connectedDeviceId,
					serviceId: i,
					success: function(e) {
						for (var c = 0, i = 0; i < e.characteristics.length; i++) {
							var t = e.characteristics[i].characteristicId,
								o = e.characteristics[i].properties;
							_WJUtils2.default.showLog("chauuid:", t), _WJUtils2.default.showLog("valueID:", o), t === notifyServiceId || t === notifyServiceId_IOS ? (reality_notifyServiceId = t, c++) : t !== writeServiceId && t !== writeServiceId_IOS || (reality_writeServiceId = t, c++);
						}
						c < 2 ? (r.code = -1, console.log("getBLEDeviceCharacteristics temp<2!"), r.err_msg = "getBLEDeviceCharacteristics temp<2!", (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(r)) : my.notifyBLECharacteristicValueChange({
							deviceId: connectedDeviceId,
							serviceId: reality_services,
							characteristicId: reality_notifyServiceId,
							state: !0,
							success: function(e) {
								_onBLECharacteristicValueChange(), null != timeID && (clearTimeout(timeID), timeID = null), console.log("notifyBLECharacteristicValueChange success!"), r.code = 0, r.err_msg = "enable success!", (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(r);
							}, fail: function() {
								r.code = -2, r.err_msg = "notifyBLECharacteristicValueChange fail!", console.log("notifyBLECharacteristicValueChange fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(r);
							}
						});
					}, fail: function() {
						r.code = -3, r.err_msg = "getBLEDeviceCharacteristics fail!", console.log("getBLEDeviceCharacteristics fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(r);
					}
				}));
			}
		}, fail: function(e) {
			r.code = -4, r.err_msg = "getBLEDeviceServices fail!", console.log("getBLEDeviceServices fail!"), (void 0 === n ? "undefined" : _typeof(n)) == TAG_FUNCTION && n(r);
		}
	});
}

function reallyDisConnect(c, i) {
	var t = {};
	my.disconnectBLEDevice({
		deviceId: c,
		success: function(e) {
			my.closeBluetoothAdapter({
				success: function(e) {
					my.offBLEConnectionStateChanged(), t.code = 0, t.err_msg = "disconnect success", t.data = c, (void 0 === i ? "undefined" : _typeof(i)) == TAG_FUNCTION && i(t);
				}, fail: function(e) {
					t.code = 10031, t.err_msg = "disconnect success but close fail", console.error("disconnect fail but close fail", e), (void 0 === i ? "undefined" : _typeof(i)) == TAG_FUNCTION && i(t);
				}
			});
		}, fail: function(e) {
			t.code = 10030, t.err_msg = "disconnect fail", console.error("disconnect fail", e), (void 0 === i ? "undefined" : _typeof(i)) == TAG_FUNCTION && i(t);
		}
	});
}

function _onBLEConnectionStateChanged() {
	console.log("start _onBLEConnectionStateChanged"), my.offBLEConnectionStateChanged(), my.onBLEConnectionStateChanged(function(e) {
		console.error(e.deviceId + " is " + e.connected), e.connected || (my.closeBluetoothAdapter({
			success: function(e) {
			}
		}), my.offBLEConnectionStateChanged(), my.offBLECharacteristicValueChange());
	});
}

function _onBLECharacteristicValueChange() {
	console.log("start _onBLECharacteristicValueChange"), my.offBLECharacteristicValueChange(), my.onBLECharacteristicValueChange(function(e) {
		e.characteristicId === reality_notifyServiceId && (console.log("rev:" + e.value), 1 == ListenFlag && (void 0 === DataListenerCallBack ? "undefined" : _typeof(DataListenerCallBack)) == TAG_FUNCTION && DataListenerCallBack(e.value));
	});
}

var ListenFlag = void 0,
	DataListenerCallBack = void 0;

function SetDataListenerCallBack(e, c) {
	1 == e ? (ListenFlag = !0, DataListenerCallBack = c) : 0 == e && (ListenFlag = !1);
}

function reallyWriteBLECharacteristicValue(e, c) {
	var i = {};
	my.writeBLECharacteristicValue({
		deviceId: connectedDeviceId,
		serviceId: reality_services,
		characteristicId: reality_writeServiceId,
		value: e,
		success: function(e) {
			console.log("writeBLECharacteristicValue success", e), i.code = 0, i.msg = "write success", (void 0 === c ? "undefined" : _typeof(c)) == TAG_FUNCTION && c(i);
		}, fail: function(e) {
			console.log("writeBLECharacteristicValue fail", e), i.code = 10040, i.msg = "write fail", (void 0 === c ? "undefined" : _typeof(c)) == TAG_FUNCTION && c(i);
		}
	});
}

module.exports = {
	reallyConnect: reallyConnect,
	_connectDevice: _connectDevice,
	connectDevice: connectDevice,
	enableService:enableService,
	reallyDisConnect: reallyDisConnect,
	reallyWriteBLECharacteristicValue: reallyWriteBLECharacteristicValue,
	SetDataListenerCallBack: SetDataListenerCallBack
};

const SUCCESS_CODE = "0";
const FAIL_CODE = "1";
var b = [];

module.exports = {
	openBle,
	scanBle
};

function openBle(cb){
	my.openBluetoothAdapter({
		success: res => {
			typeof cb === "function" && cb(SUCCESS_CODE);
		},
		fail: () => {
			typeof cb === "function" && cb(FAIL_CODE);
		}
	});
}

function scanBle(cb){
	b = [];
	my.startBluetoothDevicesDiscovery({
		allowDuplicatesKey: false,
		success: () => {
			my.onBluetoothDeviceFound((res) => {
				console.log(res);
				for(let i = 0; i < res.devices.length; i++) {
					let name = res.devices[i].name;
					console.log("name：", name);
					let isHave = false;
					for(let j = 0; j < b.length; j++) {
						if(res.devices[i].deviceId === b[j].deviceId) {
							isHave = true;
							break;
						}
					}
					if(!isHave) {
						console.log(res.devices[i].name);
						if(res.devices[i].name) {
							if(res.devices[i].name.indexOf("QF") > -1 || res.devices[i].name.indexOf("JL") > -1 || res.devices[i].name.indexOf("sl") > -1 || res.devices[i].name.indexOf("SL") > -1 || res.devices[i].name.indexOf("CG") > -1 || res.devices[i].name.indexOf("WJ") > -1 || res.devices[i].name.indexOf("WanJi") > -1 || res.devices[i].name.indexOf("AT") > -1 || res.devices[i].name.indexOf("GV__GD_FK") == 0 || res.devices[i].name.indexOf("GV_HCB_Q1") == 0 || res.devices[i].name.indexOf("GV__BT_WX") == 0 || res.devices[i].name.indexOf("GENVICT") == 0 || res.devices[i].name.indexOf("GXETC_GV") == 0 || res.devices[i].name.indexOf("GV_BT_WX") == 0 || res.devices[i].name.indexOf("JY") == 0 || res.devices[i].name.indexOf("SD_BT_WX") == 0 || res.devices[i].name.indexOf("GS") == 0 || res.devices[i].name.indexOf("GV") == 0 || res.devices[i].name.indexOf("ETC") == 0) {
								b.push(res.devices[i]);
								cb(res.devices[i]);
							}
						}
					}
				}
			});
		},
		fail: () => {
			typeof cb === "function" && z(FAIL_CODE);
		}
	});
}



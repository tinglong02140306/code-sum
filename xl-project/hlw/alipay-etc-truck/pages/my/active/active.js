import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const bluetooth = require("../../../utils/obu/bluetooth");
const wj = require("../../../utils/obu/sdk/wjBle");
const jv = require("../../../utils/obu/sdk/jvBle");

const app = getApp();

Page({
	data: {
		activeInfo: "",
		showDeviceMask: false,
		currentStep: 1,
		devices: [],
		enable: true,
		currentBrand: "",
		deviceName: "",
		obuId: "",
		plateNum: "",
		cardId: "",
		cardRandom: ""
	},
	nextStep(){
		let current = this.data.currentStep;
		if(current < 3) {
			current++;
			this.setData({ currentStep: current });
			return;
		}
		if(this.data.enable) {
			this.scan();
		}
	},
	closeMask(){
		this.setData({ showMask: false, currentStep: 1 });
	},
	pretreatment(){
		my.offBluetoothDeviceFound();
		my.offBLECharacteristicValueChange();
		my.offBLEConnectionStateChanged();
	},
	scan(){
		this.pretreatment();
		this.setData({ enable: false, devices: [] });
		showLoading("初始化蓝牙...");
		bluetooth.openBle(code => {
			hideLoading();
			if(code == 0) {
				showLoading("正在搜索...");
				bluetooth.scanBle(device => {
					hideLoading();
					if(device == 1) {
						showTitledAlert("状态: 搜索失败");
						this.setData({ enable: true });
						return;
					}
					let devices = this.data.devices;
					if(devices.some(item => {
						return item.name == device.name;
					})) {
						devices.splice(devices.findIndex(item => item.name == device.name), 1, device);
					} else {
						devices.push(device);
					}
					this.setData({ devices });
					if(!this.data.showDeviceMask) {
						this.setData({ showDeviceMask: true });
					}
				});
			} else {
				this.setData({ enable: true });
				showTitledAlert("请先打开蓝牙！");
			}
		});
	},
	connect(e){
		this.setData({ showDeviceMask: false });
		const device = e.currentTarget.dataset.device;
		const name = device.name;
		if(name) {
			showLoading(`连接${name}...`);
		} else {
			showLoading("连接设备...");
		}
		if(device.name.indexOf("WJ") > -1 || device.name.indexOf("WanJi") > -1) {
			this.setData({ currentBrand: wj });
		} else {
			this.setData({ currentBrand: jv });
		}
		const currentBrand = this.data.currentBrand;
		currentBrand.connectBle(device, (code) => {
			my.onBLEConnectionStateChanged((res) => {
				if(!res.connected) {
					hideLoading();
					showTitledAlert("连接已断开");
					this.setData({
						connected: false,
						enable: true,
						devices: []
					});
				}
			});
			my.onBluetoothAdapterStateChange((res) => {
				if(!res.available) {
					hideLoading();
					showTitledAlert("蓝牙不可用！");
					this.setData({
						connected: false,
						enable: true
					});
				}
			});
			hideLoading();
			if(code == 0) {
				this.data.currentBrand.deployBle((code, res) => {
					if(code == 0) {
						this.setData({ connected: true, deviceName: name });
						showToast("连接成功");
						this.obuAuth();
					} else {
						this.setData({ enable: true });
						showTitledAlert("状态：部署失败");
					}
				});
			} else {
				this.setData({ enable: true });
				showTitledAlert("连接失败");
			}
		});
	},
	obuAuth(){
		showLoading("正在进行设备认证...");
		const brand = this.data.currentBrand;
		brand.getObuId((code, sn) => {
			if(code == 0) {
				this.setData({ obuId: sn });
				let params = {
					device_sn: sn
				};
				APIs.deviceAuthenticate(params).then(({ data: { nonce_str, mac } }) => {
					hideLoading();
					brand.initAuthDevice(nonce_str, mac, (code, res) => {
						if(code == 0) {
							showToast("认证成功");
							this.active();
							return;
						}
						showTitledAlert("认证失败：" + res);
					});
				}).catch(error => {
					hideLoading();
					showTitledAlert("设备认证失败");
				});
			}
		});
	},
	active(){
		let errMsg = "";
		showLoading("正在激活...");
		const brand = this.data.currentBrand;
		// 先读取车牌号
		brand.getPlate((code, res) => {
			if(code == 0) {
				this.setData({ plateNum: res });
				if(res !== this.data.activeInfo["vlp"]) {
					hideLoading();
					showTitledAlert(`设备与当前车辆${this.data.activeInfo["vlp"]}不匹配`);
					return;
				}
				// 读取卡片卡号和有效期
				const cos = ["00A40000023F00", "00A40000021001", "00B095002B"];
				// 读取卡号
				brand.sendToDevice("01", cos, (code, res) => {
					if(code == 0 && res[2] && res[2].length >= 90) {
						const cardId = res[2].substring(20, 40);
						const startDate = res[2].substring(40, 48);
						if(startDate !== "20000101") {
							hideLoading();
							this.setData({ enable: true });
							showTitledAlert("当前设备已激活");
							return;
						}
						this.setData({ cardId });
						// 取随机数
						brand.sendToDevice("01", ["0084000004"], (code, res) => {
							if(code == 0) {
								this.setData({ cardRandom: res[0].substr(0, 8) });
								const params = {
									card_id: this.data.cardId,
									random: this.data.cardRandom,
									vlp: this.data.activeInfo["vlp"],
									vlpc: this.data.activeInfo["vlpc"]
								};
								this.cardIssue(params, (code, res) => {
									if(code == 0) {
										const apdu = `04D695140C${res.data.apdu}`;
										brand.sendToDevice("01", [apdu], (code, res) => {
											if(code == 0) {
												brand.updateAcctState((code, res) => {
													if(code == 0) {
														hideLoading();
														showTitledAlert("激活成功").then(() => {
															my.navigateBack();
														});
													} else {
														hideLoading();
														showTitledAlert("激活成功，更新防拆位状态失败").then(() => {
															my.navigateBack();
														});
													}
												});
											} else {
												hideLoading();
												this.setData({ enable: true });
												errMsg = "激活失败";
												showTitledAlert(errMsg);
											}
										});
									} else {
										hideLoading();
										this.setData({ enable: true });
										errMsg = "写卡申请失败；" + res;
										showTitledAlert(errMsg);
									}
								});
							} else {
								hideLoading();
								this.setData({ enable: true });
								errMsg = "取卡片随机数失败";
								showTitledAlert(errMsg);
							}
						});
					} else {
						hideLoading();
						this.setData({ enable: true });
						errMsg = "读取卡号失败";
						showTitledAlert(errMsg);
					}
				});
			} else {
				hideLoading();
				this.setData({ enable: true });
				errMsg = res;
				showTitledAlert(errMsg);
			}
		});
	},
	cardIssue(params, cb){
		APIs.cardIssue(params).then(res => {
			cb("0", res);
		}).catch(error => {
			cb("-1", error.message);
		});
	},
	onLoad(){
		this.setData({ activeInfo: app.globalData.activeInfo });
	}
});

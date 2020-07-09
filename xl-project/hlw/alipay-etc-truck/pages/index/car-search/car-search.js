import { hideLoading, showLoading, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";
const app = getApp();
let animationShowHeight = 500;//动画偏移高度


Page({
	data: {
		active: 0,  // 当前车牌号位置
		plateColor: 1,//车牌颜色
		plateNum: ["", "", "", "", "", "", "", ""],//车牌号
		showKeyboard: false,
		animationData: "",
		isProvince: true,
		tapNum: false,
	},
	select(e) {
		const idx = e.detail.value;
		this.setData({ curSelect: this.data.range[idx] });
	},
	selectPlateNum(e) {
		const idx = e.currentTarget.dataset.idx;
		if (idx == 0) {
			this.setData({
				active: idx,
				isProvince: true
			});
		} else if (idx == 1) {
			this.setData({
				active: idx,
				isProvince: false,
				tapNum: false
			});
		} else {
			this.setData({
				active: idx,
				isProvince: false,
				tapNum: true
			});
		}
		this.showKeyboardx();
	},
	selectColor(e) {
		if (this.data.showKeyboard) {
			this.hideKeyboard();
		}
		this.setData({ plateColor: e.currentTarget.dataset.idx });
	},
	showKeyboardx() {
		var animation = my.createAnimation({
			duration: 500,
			timeFunction: "ease",
			delay: 0
		});
		this.animation = animation;
		animation.translateY(animationShowHeight).step();
		this.setData({
			animationData: animation.export(),
			showKeyboard: true //显示遮罩层
		});
		setTimeout(function() {
			animation.translateY(0).step();
			this.setData({
				animationData: animation.export()
			});
		}.bind(this), 1);
	},
	hideKeyboard() {
		var animation = my.createAnimation({
			duration: 500,
			timeFunction: "ease",
			delay: 0
		});
		this.animation = animation;
		animation.translateY(animationShowHeight).step();
		this.setData({
			animationData: animation.export(),
		});
		setTimeout(function() {
			animation.translateY(0).step();
			this.setData({
				animationData: animation.export(),
				showKeyboard: false
			});
		}.bind(this), 200);
	},
	del(e) {
		const currentIdx = this.data.active;
		let tempArr = this.data.plateNum.slice();
		tempArr[currentIdx] = "";
		this.setData({
			plateNum: tempArr,
			active: parseInt(currentIdx) - 1 < 0 ? 0 : parseInt(currentIdx) - 1
		});
		if (this.data.active == 0) {
			this.setData({
				isProvince: true
			});
		} else if (this.data.active == 1) {
			this.setData({
				isProvince: false,
				tapNum: false
			});
		} else {
			this.setData({
				isProvince: false,
				tapNum: true
			});
		}
		console.log(this.data.plateNum);
	},
	input(e) {
		const currentIdx = this.data.active;
		const val = e;
		let tempArr = this.data.plateNum.slice();
		tempArr[currentIdx] = val;
		this.setData({
			plateNum: tempArr,
			active: parseInt(currentIdx) + 1 > 7 ? 7 : parseInt(currentIdx) + 1
		});
		if (parseInt(currentIdx) + 1 == 8) {
			this.hideKeyboard();
		}
		if (this.data.active == 0) {
			this.setData({
				isProvince: true
			});
		} else if (this.data.active == 1) {
			this.setData({
				isProvince: false,
				tapNum: false
			});
		} else {
			this.setData({
				isProvince: false,
				tapNum: true
			});
		}
	},
	confirm(e) {
		this.hideKeyboard();
	},
	async search() {
		showLoading();
		if (!this.data.plateNum.join("")) {
			hideLoading()
			showToast("请输入车牌号");
			return false;
		}
		if (this.data.plateNum.join("").length < 7) {
			hideLoading()
			showToast("请输入正确车牌号");
			return false;
		}
		try {
			const params = {
				vehicle_no: this.data.plateNum.join(""),
				vlp_color: this.data.plateColor
			};
			const params1 = {
				vehicle_no: this.data.plateNum.join(""),
			};
			let { flow_sn, result } = await APIs.carQuery(params);
			app.globalData.flowSn = flow_sn;
			result = Object.assign(result, params1);
			app.globalData.vehicleInfo1 = result;
			console.log(result, 156)
			this.setData({ resultAarry: result })
			hideLoading();
			if (result.code == "0000" && result.vehicle_model) {
				const params = {
					flow_sn: flow_sn,
					veh_owner: this.data.resultAarry.owner || this.data.idName,
					vlp: this.data.plateNum.join(""),
					vehicle_type: this.data.resultAarry.vehicle_type,
					register_date: this.data.resultAarry.first_register_date,
					engine_num: this.data.resultAarry.engine_number,
					issue_date: this.data.resultAarry.drv_lic_dt || this.data.resultAarry.first_register_date,
					use_character: this.data.resultAarry.use_type,
					model: this.data.resultAarry.vehicle_model,
					vin: this.data.resultAarry.vin,
					addr: this.data.resultAarry.vehicle_area || this.data.dAddress
				};
				await APIs.ocrSubmit(params);
				const brandPrand = {
					flow_sn: flow_sn,
					model: this.data.resultAarry.vehicle_model
				}

				let { result } = await APIs.brandQuery(brandPrand);

				console.log(result, 177)
				if (result.state == true) {
					app.globalData.carInfo = result;
					my.redirectTo({
						url: "/pages/index/confirm-car-info/confirm-car-info"
					});
					return;
				} else {
					console.log("123456")
					my.redirectTo({
						url: "/pages/index/add-car-copy/add-car-copy"
					});
					return;
				}
			}
			app.globalData.vehicleInfo = {
				vlp: this.data.plateNum,
				vlpc: this.data.plateColor,
			};
			my.redirectTo({
				url: "/pages/index/add-car-info/add-car-info"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}


	},
	onLoad() {
		const { data: idName } = my.getStorageSync({ "key": "idName" });
		const dAddress = app.globalData.address
		this.setData({ idName, dAddress });


	},
});

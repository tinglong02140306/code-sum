import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
		activeIndex: 2,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		allList: [],
		carList: [],
		appendCar: false
	},
	addCar() {
		if (this.data.allList.length == 5) {
			showTitledAlert("您已经添加5辆车，无法再添加");
			return;
		}
		my.navigateTo({
			url: "/pages/index/car-search/car-search"
		});
	},
	async next() {
		if (!this.data.carList.length) {
			showToast("请先添加车辆");
			return;
		}
		try {
			showLoading();
			const { data: inviteCode } = my.getStorageSync({ "key": "inviteCode" });
			if (app.globalData.appendCar) {
				let vehicles;
				const list = this.data.carList;
				list.forEach(item => vehicles += `${ item["vehicle_id"] },`);
				await APIs.appendCarApply({ vehicle_ids: vehicles });
				let { result } = await APIs.creditQuery();
				if (result.credit_result === "ACCEPTED") {
					hideLoading();
					my.navigateTo({
						url: "/pages/index/apply-complete/apply-complete?target=week"
					});
				} else {
					let res = await APIs.customerQuery();
					hideLoading();
					if (res.result.bank_code == "MYBANK") {
						//	跳转到网商银行冻结保证金
					} else {
						my.navigateTo({
							url: "/pages/index/apply-deposit/apply-deposit"
						});
					}
				}
			} else {
				const params = {
					receiveMode: "1",
					inviteCode: inviteCode || ""
				};
				await APIs.applySubmit(params);
				hideLoading();
				my.navigateTo({
					url: "/pages/index/bankcard-list/bankcard-list"
				});
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	deleteCar(e) {
		const idx = e.currentTarget.dataset.idx;
		const list = this.data.carList;
		showConfirm(`您是否将${ list[idx]["vlp"] }移除申请车辆列表`).then(() => {
			//	执行移除
			showLoading();
			const params = {
				vehicle_id: list[idx]["vehicle_id"]
			};
			APIs.vehicleDelete(params).then(() => {
				hideLoading();
				showToast("删除成功");
				this.loadCar();
			}).catch(error => {
				hideLoading();
				console.log(error);
				showToast(error.message);
			});
		});
	},
	loadCar() {
		showLoading();
		let params = {};
		if (app.globalData.appendCar) {
			params = { query_type: 3 };
		} else {
			params = { query_type: 1 };
		}
		APIs.userVehicles(params).then(res => {
			hideLoading();
			if (res.result) {
				let allList = res.result;
				let carList = allList.filter(item => {
					return item.state == "6";
				});
				this.setData({ carList });
			}
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	async onShow() {
		this.setData({ appendCar: app.globalData.appendCar });
		if (app.globalData.appendCar) {
			let { result } = await APIs.customerQuery();
			this.setData({ allList: result.vehicles });
			app.globalData.applierInfo = {
				userName: result.user_name,
				userId: result.user_certificate_no
			};
		}
		this.loadCar();
	},
	onLoad() {
		this.setData({ appendCar: app.globalData.appendCar });
	}
});

import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";
import { receiving } from "../../../utils/mapUtils";
const app = getApp();
const receivPost= ["邮递", "现场领卡"];

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
		appendCar: false,
		receiverGet:"",
		dayspecial:false,
		intentionProduct:""
	},
	selectAxle() {
		my.showActionSheet({
			title: "选择领取方式",
			items: receivPost,
			success: (res) => {
				console.log(res,51);
				this.setData({
					receiverGet: res.index+1,
				});
				console.log(this.data.receiverGet,55)
			},
		});
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
		if(!this.data.receiverGet){
			showToast("请选择领取方式");
			return;
		}
		try {
			showLoading();
			const { data: inviteCode } = my.getStorageSync({ "key": "inviteCode" });
			if (app.globalData.appendCar) {
				console.log("12345678")
				let vehicles = "";

				const list = this.data.carList;
				list.forEach(item => vehicles += `${item["vehicle_id"]},`);
				await APIs.appendCarApply({ vehicle_ids: vehicles });

				let { result } = await APIs.customerQuery();
				console.log(result, 47)
				if (result.intention_product === "55"||result.intention_product === "61") {
					hideLoading();
					my.navigateTo({
						url: "/pages/bill/my-list/my-list"
					});
				} else {
					// let res = await APIs.customerQuery();
					hideLoading();
					if (result.bank_code == "MYBANK") {
						my.navigateTo({
							url: "/pages/index/apply-deposit/apply-deposit?parameter=NetworkBusiness"
						});
						//	跳转到网商银行冻结保证金
					} else if(result.bank_code == "CCB") {
						my.navigateTo({
							url: "/pages/index/ccb-deposit/ccb-deposit?parameter=other"	
						});
					}else{
						my.navigateTo({
							url: "/pages/index/other-deposit/other-deposit?parameter=other"
						});
					}
				}

			} else {
				const params = {
					// receiveMode: "1",
					inviteCode: inviteCode || "",
					receive_mode:this.data.receiverGet||"1"
				};
				const list = this.data.carList;
				console.log(list,76)
				console.log(params,75)
				await APIs.applySubmit(params);
				hideLoading();
				console.log(this.data.carList,80)
				app.globalData.carList=this.data.carList
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
		showConfirm(`您是否将${list[idx]["vlp"]}移除申请车辆列表`).then(() => {
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
			APIs.userVehicles(params).then(res => {
				hideLoading();
				console.log(res,122)
			   		// if(this.data.intentionProduct=="56"){
					// 	let switchAdd=app.globalData.switchAdd;
					// 	if(switchAdd=="true"){
					// 		if (res.result) {
					// 			let allList = res.result;
					// 			let carList = allList.filter(item => {
					// 				return item.state == "6"||"8";
					// 			});
					// 			this.setData({ carList });
					// 		}
					// 	}else{
					// 		if (res.result.length>0) {
					// 			console.log(res.result,148)
					// 			let allList = res.result;
					// 			let carList = allList.filter(item => {
					// 				return item.state == "6"||"8";
					// 			});
					// 			this.setData({ carList });
					// 			this.setData({dayspecial:true})
					// 		}
					// 	}
						

					// }else{}
					if (res.result) {
						let allList = res.result;
						let carList = allList.filter(item => {
							return item.state == "6"||"8";
						});
						this.setData({ carList });
					}
					
				}).catch(error => {
					hideLoading();
					console.log(error);
					showToast(error.message);
				});
		} else {
			params = { query_type: 1 };
			APIs.userVehicles(params).then(res => {
				hideLoading();
				console.log(res,122)
				if (res.result) {
					let allList = res.result;
					let carList = allList.filter(item => {
						return item.state == "6"||"8";
					});
					this.setData({ carList });
				}
				}).catch(error => {
					hideLoading();
					console.log(error);
					showToast(error.message);
				});
		}
		
	},
	async onShow() {
		let {data: retcode} =my.getStorageSync({"key":"retcode"});
		this.setData({retcode})
		this.setData({ appendCar: app.globalData.appendCar });
		if (app.globalData.appendCar) {

			let { result } = await APIs.customerQuery();
			console.log(result,167)
			this.setData({ allList: result.vehicles ,intentionProduct:result.intention_product});
			app.globalData.applierInfo = {
				userName: result.user_name,
				userId: result.user_certificate_no
			};
		}
		this.loadCar();
	},
	onLoad() {
		this.setData({ appendCar: app.globalData.appendCar ,receiving});
	}
});

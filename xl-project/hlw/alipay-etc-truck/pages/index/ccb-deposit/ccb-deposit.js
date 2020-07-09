import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, sleep } from "../../../utils/util";
import APIs from "../../../apis/index";
import { vehicleTypeMap } from "../../../utils/mapUtils";
const app = getApp();
let interval = "";
let intervalone = "";

Page({
	data: {
		carList: [],
		account: "",
		desc: "",
		vehicles: "",
		bankCode: "",
		total: "",
		skipToWs: false,
		deposit_payId: "",
		sentext: "确认缴纳保证金",
		skipToWsone: false,
		count: 0,
		flag: false,
		transfer:true,
		again:false,
		init:false,
		otherQue:false
	},
	// 划拨接口
	//调用一次接口
	async transferQuery() {
		const params = {
			deposit_pay_id: this.data.deposit_payId
		};
		try {
				let { result } = await APIs.depositTransferQuery(params);
				if (result.transfer_state == "INIT") {
						hideLoading();
						if(this.data.again){
							console.log("56")
							showTitledAlert("您已进行过保证金缴纳，请耐心等待缴纳结果");
						}else{
							console.log("78")
							showTitledAlert("尊敬的用户您好，保证金扣款时间较长，预计需要一小时左右，请一小时后再登录进来查看是否缴纳成功");
						}
						return
				} else if (result.transfer_state == "SUCCESS") {
					hideLoading();
					if (this.data.otherQue == "true") {
						my.redirectTo({
							url: "/pages/bill/my-list/my-list"
						});
					} else {
						my.redirectTo({
							url: "/pages/index/apply-complete/apply-complete?target=day"
						});
					return}
				} else if (result.transfer_state == "FAILURE") {
					hideLoading();
					// if(this.data.again){
					this.setData({again:false})
					// }else{}
						showTitledAlert("保证金缴纳失败，请重新发起缴纳");
					
					return
				} else if (result.transfer_state == "NOMONEY") {
					hideLoading();
					// if(this.data.again){
					this.setData({again:false})
					// }else{}
						showTitledAlert("账户余额不足，请完成充值后继续缴纳保证金");
					
					return
				}	
		} catch (e) {
			hideLoading();
			console.log(e);
			showTitledAlert(e.message);
		}
	},
	async charge() {
		showLoading();
		let sum = 0, vehicles = "";
		let list = this.data.carList;
		list.map(item => {
			sum += parseFloat(item["deposit"]);
			vehicles += `${item["vehicle_id"]},`;
		});
		try {
			let params;
			if (app.globalData.appendCar) {
				params = {
					transfer_type: "append",
					transfer_deposit: sum
				};
			} else {
				params = {
					transfer_type: "open_account",
					transfer_deposit: sum
				};
			}
			params = {
				bank_code: this.data.bankCode,
				vehicle_ids: vehicles,
				...params
			};
			let { result } = await APIs.depositTransfer(params);
			if (result.transfer_state == "INIT") {
				console.log(result.deposit_pay_id,87)
				this.setData({ deposit_payId: result.deposit_pay_id });
				this.transferQuery();
			} else if (result.transfer_state == "SUCCESS") {
				hideLoading();
					hideLoading();
					if (this.data.otherQue == "true") {
						my.redirectTo({
							url: "/pages/bill/my-list/my-list"
						});
					} else {
						my.redirectTo({
							url: "/pages/index/apply-complete/apply-complete?target=day"
						});
					return}
			} else if (result.transfer_state == "FAILURE") {
				hideLoading();
				showTitledAlert("保证金缴纳失败，请重新发起缴纳 ");
			} else if (result.transfer_state == "NOMONEY") {
				hideLoading();
				showTitledAlert("账户余额不足，请完成充值后继续缴纳保证金");
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	PaymentResult(){
		if(this.data.deposit_payId){
			this.setData({again:true})
			this.transferQuery()
		}else{
			this.Result()
			this.setData({again:false})
		}
		
	},
   async Result() {
		this.setData({ vehicleTypeMap });
		if (interval) {
			clearInterval(interval);
		}
		if (intervalone) {
			clearInterval(intervalone);
		}
		try {
			showLoading();
			let { result } = await APIs.customerQuery();
			this.setData({ bankCode: result.bank_code });
			app.globalData.signedId = result.signed_id;
			let [res1, res2] = await Promise.all([
				APIs.getDepositList(),
				APIs.signQueryById({ signed_id: app.globalData.signedId })
			]);
			this.setData({ desc: res1.result.deposit_describe });
			res1 = res1.result.vehicles;
			res2 = res2.result;
			console.log(res2, 100);
			let sum = 0;
			res1.forEach(item => (sum += parseFloat(item["deposit"])));
			this.setData({ carList: res1, total: sum });
            if(!this.data.carList){
				hideLoading();
				if(result.state == "1"){
					my.redirectTo({
						url: "/pages/my/my"
					});
				}
			}
			//建行保证金划拨结果查询
            let vehicles = "";
			let list = this.data.carList;
			list.map(item => {
				vehicles += `${item["vehicle_id"]},`;
			});
			let params;
			if (app.globalData.appendCar) {
				params = {
					transfer_type: "append",
				};
			} else {
				params = {
					transfer_type: "open_account",
				};
			}
			params = {
				bank_code: this.data.bankCode,
				vehicle_ids: vehicles,
				...params
			};
		
			let object = await APIs.ccBquery(params);
				if (object.result.transfer_state == "INIT") {
						hideLoading();
						showTitledAlert("保证金缴纳中，请耐心等待缴纳结果");
						this.setData({init:true})
						return
				} else if (object.result.transfer_state == "SUCCESS") {
					hideLoading();
					hideLoading();
					if (this.data.otherQue == "true") {
						my.redirectTo({
							url: "/pages/bill/my-list/my-list"
						});
					} else {
						my.redirectTo({
							url: "/pages/index/apply-complete/apply-complete?target=day"
						});
					return}
				} else if (object.result.transfer_state == "FAILURE") {
					hideLoading();
					showTitledAlert("保证金缴纳失败，请重新发起缴纳 ");
					this.setData({init:false})
					return
				} else if (object.result.transfer_state == "NOMONEY") {
					hideLoading();
					showTitledAlert("账户余额不足，请完成充值后继续缴纳保证金");
					this.setData({init:false})
					return
				}else if(object.result.transfer_state == "FIRSTFREEZE"){
					hideLoading();
					showTitledAlert("请先去缴纳保证金");
					return
				}
			
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}

	},
	async onShow(option) {
		this.Result()
		console.log(this.data.deposit_payId,191)
	},
	onLoad(option){
		if (option.parameter == "other") {
			this.setData({ otherQue: "true" })
			// this.freeze();
		}
	}

});

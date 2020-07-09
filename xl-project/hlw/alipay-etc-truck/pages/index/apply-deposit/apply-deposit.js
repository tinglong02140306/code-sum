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
		otherQue:false
	},
	async charge() {
		console.log("动车保证金");
		console.log(this.data.total);
		//跳转网商银行充值
		try {

			if (this.data.bankCode === "MYBANK") {
				console.log("跳转网商银行充值");
				my.navigateToMiniProgram({
					appId: "77700197",
					path: `pages/transIn/index?from=etcsd&amount=${this.data.total}`,
					success: res => {
						this.setData({ skipToWs: true });

						console.log(res);
					},
					fail: res => {

						console.error(res);
					}
				});
			} else {
				this.freeze();
			}
		} catch (error) {

			console.log(error);
			showToast(error.message);
		}
	},
	async freeze() {
		let sum = 0, vehicles = "";
		let list = this.data.carList;
		list.map(item => {
			sum += parseFloat(item["deposit"]);
			vehicles += `${item["vehicle_id"]},`;
		});
		this.setData({ vehicles });
		const msg = `您将为${list.length}辆车支付ETC保证金，系统将在您的账户中，冻结ETC通行费保证金￥${sum}元。该保证金将在您中止业务时，解除冻结。`;
		try {
			await showConfirm(msg, "系统提示", "冻结");
			showLoading();
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
			const { data: inviteCode } = my.getStorageSync({ key: "inviteCode" }) || "";
			params = {
				bank_code: this.data.bankCode,
				vehicle_ids: vehicles,
				receive_mode: "1",
				invite_code: inviteCode,
				...params
			};
			let res = await APIs.depositFreeze(params);
			console.log(res);
			if (res.result) {
				hideLoading();
				wx.redirectTo({
					url: "/pages/index/apply-complete/apply-complete?target=day"
				});
			} else {
				let { result } = await APIs.signQueryById({ signed_id: app.globalData.signedId });
				hideLoading();
				if (result.account_type === "SECOND_ACCOUNT") {
					await showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
					await APIs.secondChargeICBC({ amount: sum });
					await showTitledAlert("充值已受理，请等待1-2分钟后再次尝试冻结");
				} else if (result.account_type === "ABC_ACC_TRUCK") {
					await showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
					await APIs.secondChargeABC({ amount: sum });
					await showTitledAlert("充值已受理，请等待1-2分钟后再次尝试冻结");
				} else {
					showTitledAlert("请在银行卡内存入足够金额，再尝试冻结");
				}
			}
		} catch (error) {
			if (error) {
				hideLoading();
				console.log(error);
				showTitledAlert(error.message);
			}
		}
	},
	// 划拨接口
	//调用一次接口
	async transferQuery() {
		const params = {
			deposit_pay_id: this.data.deposit_payId
		};
		try {
			for (let i = 0; i < 6; i++) {
				let { result } = await APIs.depositTransferQuery(params);
				if (result.transfer_state == "INIT") {
					if (i < 5) {
						await sleep();
					} else {
						hideLoading();
						showTitledAlert("如长时间无响应，请您在接收到短信通知后再继续进行操作。");
					}
				} else if (result.transfer_state == "SUCCESS") {
					hideLoading();
					if (this.data.otherQue == "true") {
						console.log("+++++++++++++++++++++++++++++++++++++++++++++");
						my.redirectTo({
							url: "/pages/bill/my-list/my-list"
						});
					} else {
						my.redirectTo({
							url: "/pages/index/apply-complete/apply-complete?target=day"
						});
					}
					break;
				} else if (result.transfer_state == "FAILURE") {
					hideLoading();
					showTitledAlert("缴纳保证金失败，请您重试");
					break;
				} else if (result.transfer_state == "NOMONEY") {
					hideLoading();
					showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
					break;
				}
			}
		} catch (e) {
			hideLoading();
			console.log(e);
			showTitledAlert(e.message);
		}
	},
	async next() {
		showLoading();
		let sum = 0, vehicles = "";
		let list = this.data.carList;
		list.map(item => {
			sum += parseFloat(item["deposit"]);
			vehicles += `${item["vehicle_id"]},`;
		});
		const msg = `如点击"确定"，系统将从您的银行账户扣划资金缴纳保证金`;
		try {
			await showConfirm(msg, "温馨提示", "冻结");
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
				this.setData({ deposit_payId: result.deposit_pay_id });
				this.transferQuery();
			} else if (result.transfer_state == "SUCCESS") {
				hideLoading();
				if (this.data.otherQue == "true") {
					console.log("+++++++++++++++++++++++++++++++++++++++++++++");
					my.redirectTo({
						url: "/pages/bill/my-list/my-list"
					});
				} else {
					my.redirectTo({
					url: "/pages/index/apply-complete/apply-complete?target=day"
					});
				}
				
			} else if (result.transfer_state == "FAILURE") {
				hideLoading();
				showTitledAlert("缴纳保证金失败，请您重试");
			} else if (result.transfer_state == "NOMONEY") {
				hideLoading();
				showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			if(error){
				showTitledAlert(error.message);
			}
		}
	},
	async onLoad(option) {
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
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
		console.log(option.parameter)
		if (option.parameter == "NetworkBusiness") {
			this.setData({ otherQue: "true" })
			//网商的
		} 
	}
});

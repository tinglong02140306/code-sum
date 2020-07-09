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
		otherQue: false
	},
	async charge() {
		//跳转其他银行充值
		this.freeze();
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
			console.log(res, 61);
			if (res.result.transfer_state == "SUCCESS") {
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
			} else {
				let { result } = await APIs.queryById({ signed_id: app.globalData.signedId });
				hideLoading();
				console.log(result, 76)
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
			console.log(this.data.bankCode, 112)
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
		if (option.parameter == "other") {
			this.setData({ otherQue: "true" })
			console.log(this.setData.otherQue,133)
			// this.freeze();
		}
	}
});

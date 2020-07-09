import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, sleep, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";
import { vehicleTypeMap } from "../../../utils/mapUtils";

const app = getApp();
let interval = "";

Page({
	data: {
		carList: [],
		account: "",
		vehicles: "",
		bankCode: "",
		total: "",
		skipToWs: false,
		deposit_payId: "",
		sentext: "确认缴纳保证金",
		skipToWsone: false,
		count: 0,
		flag: false,
		condition: false,
		showModal: false,
		captcha: "",
		sendText: "发送验证码",
		vehicleId: ""
	},
	async chargeWs(){
		//跳转网商银行充值
		try {
			if(this.data.bankCode === "MYBANK") {
				console.log("跳转网商银行充值");
				my.navigateToMiniProgram({
					appId: "77700197",
					path: `pages/transIn/index?from=etcsd&amount=${ this.data.total }`,
					success: res => {
						this.setData({ skipToWs: true });
					},
					fail: res => {
						console.error(res);
					}
				});
			}
		} catch (error) {
			console.log(error);
			showToast(error.message);
		}
	},
	async Refresh(){
		const { data: curApplyType } = my.getStorageSync({ "key": "curApplyType" });
		try {
			if(this.data.bankCode === "MYBANK" || this.data.bankCode === "CCB" || curApplyType === "enterprise") {
				this.balance();
			} else {
				showToast("工行农行不刷新");
			}
		} catch (error) {
			console.log(error);
			showToast(error.message);
		}
	},
	async Return(){
		showLoading();
		if(this.data.PayBack == "0.00") {
			hideLoading();
			showToast("冻结保证金为0元，无需退还");
			return;
		}
		const msg = `您将发起为所有车辆退保证金的操作，我们会把车辆对应的ETC卡和设备注销，退款将在大约10个工作日内完成。请注意查收。`;
		await showTitledAlert(msg, "系统提示",);
		try {
			let params = {
				return_deposit: this.data.PayBack
			};
			await APIs.depositRefund(params);
			hideLoading();
			my.navigateBack();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	// 退还保证金
	refund(e){
		const msg = "您将发起为所选车辆退保证金的操作，我们会把车辆对应的ETC卡和设备注销，退款将在大约10个工作日内完成。请注意查收。";
		showConfirm(msg).then(() => {
			this.setData({ vehicleId: e.currentTarget.dataset.id, captcha: "" });
			if(interval) clearInterval(interval);
			this.sendMsg();
		}).catch(error => {
			console.log("取消");
		});
	},
	onClear(e){
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	onItemInput(e){
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	countDown(){
		this.setData({
			msgSent: true,
			sendText: "重新发送(60)"
		});
		let count = 60;
		interval = setInterval(() => {
			count--;
			if(count > 0) {
				this.setData({
					sendText: `重新发送(${ count })`
				});
			} else {
				clearInterval(interval);
				this.setData({
					msgSent: false,
					sendText: `重新发送`
				});
			}
		}, 1000);
	},
	sendMsg(){
		this.setData({ showModal: true });
		showLoading();
		const { data: mobile } = my.getStorageSync({ "key": "mobile" });
		APIs.sendMsgCommon({ mobile }).then(() => {
			hideLoading();
			showToast("发送成功");
			this.countDown();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	cancel(){
		if(interval) {
			clearInterval(interval);
		}
		this.setData({ showModal: false });
	},
	async confirm(){
		// 退还保证金
		if(!trimAll(this.data.captcha)) {
			showToast("请输入验证码");
			return;
		}
		try {
			showLoading();
			const { data: mobile } = my.getStorageSync({ "key": "mobile" });
			await APIs.msgValidCommon({ mobile, code: trimAll(this.data.captcha) });
			this.setData({ showModal: false });
			await APIs.depositRefundByCar({ vehicle_id: this.data.vehicleId });
			hideLoading();
			showToast("成功");
		} catch (e) {
			hideLoading();
			showTitledAlert(e.message);
		}
	},
	async charge(){
		//跳转其他银行充值
		const { data: curApplyType } = my.getStorageSync({ "key": "curApplyType" });
		try {
			if(this.data.bankCode === "MYBANK" || this.data.bankCode === "CCB" || curApplyType === "enterprise") {
				if(this.data.money === "0.00") {
					showTitledAlert("无需补缴保证金");
				} else {
					if(this.data.money === "0.00") {
						showTitledAlert("无需补缴保证金");
					} else {
						this.next();
					}
				}
			} else {
				if(this.data.money === "0.00") {
					showTitledAlert("无需补缴保证金");
				} else {
					this.freeze();
				}
			}
		} catch (error) {
			console.log(error);
			showToast(error.message);
		}
	},
	// 划拨接口
	//调用一次接口
	async transferQuery(){
		const params = {
			deposit_pay_id: this.data.deposit_payId
		};
		try {
			let { result } = await APIs.depositTransferQuery(params);
			if(result.transfer_state === "INIT") {
				hideLoading();
				showTitledAlert("您已发起补缴，耐心等待结果");
			} else if(result.transfer_state === "SUCCESS") {
				hideLoading();
				showTitledAlert("补缴保证金成功");
			} else if(result.transfer_state === "FAILURE") {
				hideLoading();
				showTitledAlert("缴纳保证金失败，请您重试");
			} else if(result.transfer_state === "NOMONEY") {
				hideLoading();
				showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
			}
		} catch (e) {
			hideLoading();
			console.log(e);
			showTitledAlert(e.message);
		}
	},
	async next(){
		showLoading();
		try {
			let params = {
				bank_code: this.data.bankCode,
				transfer_type: "replenish",
				transfer_deposit: this.data.money
			};
			let { result } = await APIs.depositTransfer(params);
			if(result.transfer_state === "INIT") {
				this.setData({ deposit_payId: result.deposit_pay_id });
				this.transferQuery();
			} else if(result.transfer_state === "SUCCESS") {
				hideLoading();
				showTitledAlert("补缴保证金成功");
			} else if(result.transfer_state === "FAILURE") {
				hideLoading();
				showTitledAlert("缴纳保证金失败，请您重试");
			} else if(result.transfer_state === "NOMONEY") {
				hideLoading();
				showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	//工行和农行的保证金
	async freeze(){
		try {
			showLoading();
			const { data: inviteCode } = my.getStorageSync({ key: "inviteCode" }) || "";
			let params = {
				bank_code: this.data.bankCode,
				receive_mode: "1",
				invite_code: inviteCode,
				transfer_type: "replenish",
				transfer_deposit: this.data.money
			};
			let res = await APIs.depositFreeze(params);
			if(res.result.transfer_state === "SUCCESS") {
				hideLoading();
				showTitledAlert("补缴保证金成功");
			} else {
				let { result } = await APIs.queryById({ signed_id: app.globalData.signedId });
				hideLoading();
				if(result.account_type === "SECOND_ACCOUNT") {
					await showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
					await APIs.secondChargeICBC({ amount: sum });
					await showTitledAlert("充值已受理，请等待1-2分钟后再次尝试冻结");
				} else if(result.account_type === "ABC_ACC_TRUCK") {
					await showTitledAlert("请在银行卡中充入足够金额进行保证金缴纳");
					await APIs.secondChargeABC({ amount: sum });
					await showTitledAlert("充值已受理，请等待1-2分钟后再次尝试冻结");
				} else {
					showTitledAlert("请在银行卡内存入足够金额，再尝试冻结");
				}
			}
		} catch (error) {
			if(error) {
				hideLoading();
				console.log(error);
				showTitledAlert(error.message);
			}
		}
	},
	async balance(){
		try {
			showLoading();
			let [res2, res3] = await Promise.all([
				APIs.depositQuery(),
				APIs.depositReplenish()
			]);
			res3 = res3.result;
			res2 = res2.result;
			this.setData({ money: res3, PayBack: res2 });
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	async onLoad(option){
		this.setData({ vehicleTypeMap });
		const { data: curApplyType } = my.getStorageSync({ key: "curApplyType" });
		this.setData({ curApplyType });
		try {
			showLoading();
			let res;
			if(curApplyType && curApplyType === "enterprise") {
				res = await APIs.companyInfoQuery();
			} else {
				res = await APIs.customerQuery();
			}
			let result = res.result;
			this.setData({ bankCode: result.bank_code });
			if(this.data.bankCode === "MYBANK") {
				this.setData({ condition: true });
			}
			app.globalData.signedId = result.signed_id;
			this.balance();
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
		if(option.parameter === "other") {
			this.setData({ otherQue: "true" });
		}
	},
	onShow(){
		APIs.listCar({ query_type: "4" }).then(res => {
			this.setData({ carList: res.result || [] });
		}).catch(error => {
			console.log(error);
			showToast(error.message);
		});
	}
});

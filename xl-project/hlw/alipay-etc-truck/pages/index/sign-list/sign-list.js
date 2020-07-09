// import regeneratorRuntime from "../../../utils/runtime";
 import { hideLoading, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
// import APIs from "../../../apis/index";


const app = getApp();
let interval = "";

Page({
	data: {
		steps: [],
		applierInfo: {},
		bank: "",
		currentIdx: 0,
		userName: "",
		certNo: "",
		cardNo: "",
		mobile: "",
		currentCardType: {},
		enableBtn: true,
		orderCardInfo: {},
		enableSmallButton: true,
		smallButtonText: "点击发送",
		captcha: "",
		smallButtonClickTimes: 0,
		loaded: false,
		channelSignedId: "",
		signedId: "",
		disableInput: false,			// 是否禁用银行卡输入
		oldSecondInfo: {},				// 旧的二类户信息
		hasOldSecond: false,			// 是否存在工行二类户
		currentType: "",						// 当前开户类型
	},
	bindKeyInput(e) {
		const item = e.detail;
		this.setData({ [item["key"]]: item["val"] });
	},
	update(e) {
		const idx = e.currentTarget.dataset.idx;
		const val = e.detail.value;
		this.setData({ [idx]: val });
	},
	clear(e) {
		const item = e.detail;
		this.setData({ [item["key"]]: "" });
	},
	countDown() {
		this.setData({
			enableSmallButton: false,
			smallButtonText: "重新发送(60)",
			disableInput: true,
			smallButtonClickTimes: this.data.smallButtonClickTimes + 1
		});
		let count = 60;
		interval = setInterval(() => {
			count--;
			if (count > 0) {
				this.setData({
					smallButtonText: `重新发送(${ count })`
				});
			} else {
				clearInterval(interval);
				this.setData({
					enableSmallButton: true,
					smallButtonText: `重新发送`,
					disableInput: false
				});
			}
		}, 1000);
	},
	// 先判断用户是点的哪个按钮进来的
	async sendMsg() {
		if (!this.check()) {
			return;
		}
		let res;
		try {
			showLoading();
			// 用户选择的工行进入签约页面
			if (this.data.bank == "ICBC") {
				let { result } = await APIs.checkCardBin({ account: this.data.cardNo });
				if (result.issuer_code === "ICBC") {
					this.setData({ currentType: "ICBC2" });
				} else {
					this.setData({ currentType: "SECOND_ACCOUNT" });
				}
				console.log(result);
				if (result.issuer_code === "ICBC") {
					await APIs.sendMsg2({ mobile: this.data.mobile });
					
					showToast("发送成功");
					this.countDown();
				} else {
					if (this.data.hasOldSecond) {
						
						const msg = `您当前身份证${this.data.applierInfo['userId']}下已有二类户账户，将使用已经开通的二类户签约，点击“确定”继续`;
						await showTitledAlert(msg);
						this.setData({
							disableInput: true,
							cardNo: this.data.oldSecondInfo.channel_signed_id,
							mobile: this.data.oldSecondInfo.mobile
						});
						showLoading();
						await APIs.sendMsg2({ mobile: this.data.mobile });
						
						showToast("发送成功");
						this.countDown();
					} else {
						const params = {
							credential_code: this.data.applierInfo["userId"],
							username: this.data.applierInfo["userName"],
							mobile: this.data.mobile,
							account_type: "SECOND_ACCOUNT",
							credential_type: "01",
							account: this.data.cardNo,
							merchant_code: "truck_obu_etc"
						};
						res = await APIs.sendMsg(params);
						res = res.result;
						this.setData({ signedId: res.signed_id, channelSignedId: res.channel_signed_id });
						
						showToast("发送成功");
						this.countDown();
					}
				}
			} else {
				this.setData({ currentType: "SECOND_ACCOUNT" });
				// 用户选择的二类户进入的页面
				if (this.data.hasOldSecond) {
					
					const msg = `您当前身份证${this.data.applierInfo['userId']}下已有二类户账户，将使用已经开通的二类户签约，点击“确定”继续`;
					await showTitledAlert(msg);
					this.setData({
						disableInput: true,
						cardNo: this.data.oldSecondInfo.channel_signed_id,
						mobile: this.data.oldSecondInfo.mobile
					});
					showLoading();
					// 已有二类户 调用基础短信
					await APIs.sendMsg2({ mobile: this.data.mobile });
					
					showToast("发送成功");
					this.countDown();
				} else {
					// 没有二类户 调用工行二类户短信
					const params = {
						credential_code: this.data.applierInfo["userId"],
						username: this.data.applierInfo["userName"],
						mobile: this.data.mobile,
						account_type: "SECOND_ACCOUNT",
						credential_type: "01",
						account: this.data.cardNo,
						merchant_code: "truck_obu_etc"
					};
					res = await APIs.sendMsg(params);
					res = res.result;
					
					showToast("发送成功");
					this.setData({ signedId: res.signed_id, channelSignedId: res.channel_signed_id });
					this.countDown();
				}
			}
		} catch (error) {
			
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	check() {
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
		if (!trimAll(this.data.mobile)) {
			showToast("请填写手机号");
			return false;
		}
		return true;
	},
	async next() {
		this.setData({ enableBtn: false });
		if (!this.check()) {
			this.setData({ enableBtn: true });
			return;
		}
		if (this.data.smallButtonClickTimes < 1) {
			this.setData({ enableBtn: true });
			showToast("请先获取验证码");
			return;
		}
		if (!trimAll(this.data.captcha)) {
			this.setData({ enableBtn: true });
			showToast("请填写验证码");
			return;
		}
		this.setData({ enableBtn: true });
		try {
			showLoading();
			const params2 = {
				sub_channel: this.data.currentType,
				credential_code: this.data.applierInfo["userId"],
				username: this.data.applierInfo["userName"],
				mobile: this.data.mobile,
				account: this.data.cardNo
			};
			let res;
			// 如果是工行一类户  调用基础短信服务 然后调用一类户签约
			if (this.data.currentType === "ICBC2") {
				await APIs.msgValid2({ mobile: this.data.mobile, code: this.data.captcha });
				res = await APIs.signApply(params2);
				if (res.result.signed_id) {
					const params3 = {
						signed_id: res.result.signed_id,
						notice_type: "1"
					};
					await APIs.signSuccessApply(params3);
					
					wx.redirectTo({
						url: "/pages/common/order-submit/order-submit"
					});
				} else {
					
				}
			} else {
				// 如果不是工行一类户
				// 之前是否有旧的二类户 如果有 调用基础短信验证
				if (this.data.hasOldSecond) {
					await APIs.msgValid2({ mobile: this.data.mobile, code: this.data.captcha });
					// res = await APIs.signApply(params2);
					// if (res.result.signedId) {
					// 	const params3 = {
					// 		signed_id: this.data.signedId
					// 	};
					// 	await APIs.signSuccessApply(params3);
					// 	
					// 	wx.redirectTo({
					// 		url: "/pages/common/order-submit/order-submit"
					// 	});
					// }
				} else {
					// 否则  调用工行二类户短信验证
					const params1 = {
						channel_signed_id: this.data.channelSignedId,
						chk_no: this.data.captcha
					};
					res = await APIs.msgValid(params1);
					console.log(res);
				}
				// 然后调用二类户签约
				res = await APIs.signSecondApply(params2);
				console.log("*****************************");
				if (res.result.signed_id) {
					const params3 = {
						signed_id: res.result.signed_id,
						notice_type: "1"
					};
					await APIs.signSuccessApply(params3);
					
					wx.redirectTo({
						url: "/pages/common/sign-second-success/sign-second-success"
					});
				}
			}
		} catch (error) {
			
			console.log(error);
			showToast(error.message);
		}
	},
	async onLoad(options) {
		const { bank } = options;
		this.setData({ bank });
		this.setData({ applierInfo: app.globalData.applierInfo });
		let res;
		// try {
		// 	// showLoading();
		// 	// res = await APIs.signSecondQuery({ credential_code: this.data.applierInfo["userId"] });
			
		// 	res = res.result;
		// 	if (res && res.account) {
		// 		this.setData({ oldSecondInfo: res, hasOldSecond: true });
		// 		if (this.data.bank != "ICBC") {
		// 			this.setData({ disableInput: true, cardNo: res.account, mobile: res.mobile });
		// 		}
		// 	}
		// } catch (error) {
			
		// 	console.log(error);
		// 	showToast(error.message);
		// }
	}
});

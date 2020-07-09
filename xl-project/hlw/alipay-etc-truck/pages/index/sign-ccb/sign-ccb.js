import APIs from "../../../apis/index";
import { showTitledAlert, selectImg, showToast, trimAll, showLoading, hideLoading } from "../../../utils/util";

const app = getApp();
let interval = "";

Page({
	data: {
		activeIndex: 3,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		// 6236682340011259214 中国建设银行， 霍付全 ， 372922198809224797 , 18566259221 两个手机号试试
		// 6217002220013313842 孙闰闰 370523199310191364 18366925136
		// 6217002190014038690 贾三六 370780197109247623      11195578838
		// 6217001210059830255 刘四四 371672199609208470 手机号 11421775780
		// 6214992170818865 宋四二 370904193408227431 手机号 11426353963
		// 6259650880418584 韩零一 370718197605164394 手机号 11536874278
		// userName: "龚九六",//姓名
		// certNo: "310671195501231403",//
		// cardNo: "6217001210038580229",//
		// mobile: "11639366159",//手机号码

		userName: "",//姓名
		certNo: "",//
		cardNo: "",//
		mobile: "",//手机号码
		captcha: "",//收件人
		enableSmallButton: true,
		smallButtonText: "点击发送",
		channelSignedId: "",
		signedId: "",
		oldCardNo: "",					// 发送完短信后保存一下  防止用户更改
		issuer: "",						// 卡片发行方
		disabledInput: false,			// 是否禁用银行卡输入
		hasOldSecond: false,			// 是否存在已签约的二类户
		accountType: "",				// 账户类型
		AccountNumber: "",
		icbcFlag: true,
		sendMsgFlag: false

	},
	onItemInput(e) {
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onClear(e) {
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	checkParams() {
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
		console.log(this.data.cardNo.length, 155)
		if (trimAll(this.data.cardNo.length) < 14) {
			showToast("请填写正确的银行卡号");
			return false;
		}
		if (!trimAll(this.data.userName)) {
			showToast("请填写银行卡账户名");
			return false;
		}
		if (!trimAll(this.data.certNo)) {
			showToast("请填写身份证号");
			return false;
		}
		// if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.mobile))) {
		// 	showToast("手机号码有误，请重填");
		// 	return;
		// }
		if (!trimAll(this.data.mobile)) {
			showToast("请填写银行预留手机号");
			return false;
		}
		return true;
	},
	countDown() {
		this.setData({
			enableSmallButton: false,
			smallButtonText: "重新发送(60)",
		});
		let count = 60;
		interval = setInterval(() => {
			count--;
			if (count > 0) {
				this.setData({
					smallButtonText: `重新发送(${count})`
				});
			} else {
				clearInterval(interval);
				this.setData({
					enableSmallButton: true,
					smallButtonText: `重新发送`,
				});
			}
		}, 1000);
	},
	onBlur() {
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
		console.log(this.data.cardNo.length, 155)
		if (trimAll(this.data.cardNo.length) < 14) {
			showToast("请填写正确的银行卡号");
			return false;
		}
		showLoading();
		APIs.checkCardBin({ account: this.data.cardNo }).then(({ result }) => {
			hideLoading();
			if (result.account_type == "1") {
                 hideLoading();
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			console.log(result.issuer_code, 96)
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			console.log(this.data.issuer, 109)
			if (this.data.issuer == "CCB") {
				this.setData({ sendMsgFlag: true })
			} else {
				// showToast("请填本行银行卡号");
				// return false;
				this.setData({ sendMsgFlag: true })
				this.setData({ icbcFlag: false })
				return false;
			}
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});

	},
	async sendMsg() {
		console.log("104")
		if (!this.checkParams()) {
			hideLoading();
			return;
		}
		try {
			showLoading();
			// 一类户调用通用短信
			let { result } = await APIs.checkCardBin({ account: this.data.cardNo })
			if (result.account_type == "1") {
				hideLoading();
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			console.log(result.issuer_code, 96)
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			if (this.data.issuer === "CCB") {
				await APIs.sendMsgCommon({ mobile: this.data.mobile });
				hideLoading();
				console.log("114")
				showToast("发送成功");
				this.setData({ oldCardNo: this.data.cardNo });
				this.countDown();
			} else {
				hideLoading();
				showToast("请输入建设银行卡号");
				// let information = {
				// 	cardNo: this.data.cardNo,
				// 	mobile: this.data.mobile,
				// }
				// app.globalData.information = information;
				// my.navigateTo({ url: "/pages/index/sign-icbc-household/sign-icbc-household" });
			}
		} catch (error) {
			hideLoading();
			showToast(error.message);
		}
	},
	async sign() {
		showLoading();
		if (!this.checkParams()) {
			hideLoading();
			return;
		}
		// if (this.data.captcha) {
		// }
		if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
			hideLoading();
			showToast("请填正确的验证码");
			return false;
		}
		console.log((this.data.issuer !== "CCB" && !this.data.signedId),157)
		if (!this.data.hasOldSecond) {
			console.log("191")
			if (this.data.issuer !== "CCB" && !this.data.signedId) {
				console.log("192")
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			if (this.data.issuer !== "CCB" && !this.data.channelSignedId) {
				console.log("193")
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			if (this.data.oldCardNo != trimAll(this.data.cardNo)) {
				console.log("194")
				hideLoading();
				showTitledAlert("您更改了银行卡号，请重新发送验证码");
				return;
			}
		}
		try {
			// 一类户签约
			console.log("200")
			if (this.data.issuer === "CCB") {
				await APIs.msgValidCommon({ mobile: this.data.mobile, code: this.data.captcha });
				const params = {
					sub_channel: "CCB_TRUCK",
					credential_code: this.data.certNo,
					username: this.data.userName,
					mobile: this.data.mobile,
					account: this.data.cardNo,
					merchant_code: "2103"
				};
				let {msg,result}= await APIs.signApply(params);
				if(msg.indexOf("请勿重复签约")!=-1){
                    showToast(msg);
				}
				const params2 = {
					bank_code: "CCB",
					signed_id: result.signed_id
				};
				await APIs.signedNotice(params2);
				hideLoading();
				if (interval) {
					clearInterval(interval);
					this.setData({
						smallButtonText: `点击发送`,
						disableInput: false
					});
				}
			} else {

			}
			// 跳转到授信页面
			// my.redirectTo({
			// 	url: "/pages/index/empty-page/empty-page?target=credit"
			// });
			my.redirectTo({
				url: "/pages/index/sign-credit-apply/sign-credit-apply"
				// url: "/pages/index/empty-page/empty-page?target=credit" 
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	signHousehold(){
		my.navigateTo({ url: "/pages/index/sign-ccb-household/sign-ccb-household" });
	},
	// onLoad() {
	// 	const { data: userName } = my.getStorageSync({ "key": "idName" });
	// 	const { data: certNo } = my.getStorageSync({ "key": "idNumber" });
	// 	this.setData({ userName, certNo });
	// },
	onShow() {
		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		const { data: idNumber } = my.getStorageSync({ key: "idNumber" });//身份证号
		this.setData({ userName: username })
		this.setData({ certNo: idNumber })
	}
});

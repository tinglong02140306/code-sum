import APIs from "../../../apis/index";
import {
	showTitledAlert,
	showToast,
	trimAll,
	showLoading,
	hideLoading,
	ftAccBank,
	img2base64
} from "../../../utils/util";

const app = getApp();
let interval = "";
const accBanks = ["中国农业银行", "中国工商银行", "中国银行", "中国建设银行", "交通银行", "中国邮政储蓄银行"];
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
		idFaceImg: "",
		realIdFaceImg: "",
		idBackImg: "",
		realIdBackImg: "",
		// 姓名     王磊
		// 身份证   370126199404033436
		// 手机号   13791118203
		// 银行卡   6217856000072578866(中行)
		// 夏风鲁  371524199205101651    6228210259028435377  15634131276
		// "AccNo":"6228481849035508877","Name":"于陈炜","CustomID":"372321199302038122",
		userName: "",//姓名
		certNo: "",//
		cardNo: "",//
		mobile: "",//手机号码
		captcha: "",//收件人
		enableSmallButton: true,
		smallButtonText: "点击发送",
		channelSignedId: "",
		signedId: "",
		oldCardNo: "",				   	// 发送完短信后保存一下  防止用户更改
		issuer: "ABC",						// 卡片发行方
		disabledInput: false,			// 是否禁用银行卡输入
		hasOldSecond: false,			// 是否存在已签约的二类户
		accountType: "",					// 账户类型
		seqNo: "",								// 短信流水号
		accBank: "",
		startDate: "",
		endDate: "",
		signed_id: "",
		channel_signed_id_one: "",//二类户账户名字
		abcFlag: true,
		staffId: "",
		mechanismId: "",
		sendMsgFlag: false
	},
	imgPreview(idx) {
		const urls = [idx];
		my.previewImage({
			urls
		});
	},
	deleteImg(e) {
		const idx = e.currentTarget.dataset.idx;
		if (idx == "people1") {
			this.setData({ idFaceImg: "", realIdFaceImg: "" });
			return;
		}
		if (idx == "people2") {
			this.setData({ idBackImg: "", realIdBackImg: "" });
		}
	},
	async selectImg(e) {
		const idx = e.currentTarget.dataset.idx;
		if (idx == "people1" && this.data.idFaceImg) {
			this.imgPreview(this.data.idFaceImg);
			return;
		}
		if (idx == "people2" && this.data.idBackImg) {
			this.imgPreview(this.data.idBackImg);
			return;
		}
		try {
			let res = await img2base64();
			console.log(res);
			if (idx === "people1") {
				this.setData({
					idFaceImg: res.tempFilePath,
					realIdFaceImg: res.base64
				});
			} else {
				this.setData({
					idBackImg: res.tempFilePath,
					realIdBackImg: res.base64
				});
			}
		} catch (error) {
			console.log(error);
			showToast(error.message);
		}
	},
	selectDate(e) {
		const idx = e.currentTarget.dataset.idx;
		my.datePicker({
			startDate: '1990-10-9',
			currentDate: '2016-10-10',
			endDate: '2099-10-9',
			success: (res) => {
				this.setData({ [idx]: res.date });
			},
			fail: () => {
				this.setData({ [idx]: "" });
			}
		});
	},
	selectAccBank() {
		my.showActionSheet({
			title: "选择发卡行",
			items: accBanks,
			success: (res) => {
				console.log(res);
				this.setData({
					accBank: accBanks[res.index],
				});
			},
		});
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
			hideLoading()
			showToast("请填写银行卡号");
			return false;
		}
		console.log(this.data.cardNo.length, 155)
		if (trimAll(this.data.cardNo.length) < 14) {
			hideLoading()
			showToast("请填写正确的银行卡号");
			return false;
		}
		if (!trimAll(this.data.userName)) {
			hideLoading()
			showToast("请填写银行卡账户名");
			return false;
		}
		if (!trimAll(this.data.certNo)) {
			hideLoading()
			showToast("请填写身份证号");
			return false;
		}
		if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.mobile))) {
			hideLoading()
			showToast("手机号码有误，请重填");
			return;
		}
		if (!trimAll(this.data.mobile)) {
			hideLoading()
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
		// if (!trimAll(this.data.cardNo)) {
		// 	showToast("请填写银行卡号");
		// 	return false;
		// }
		console.log(this.data.startDate.split("-").join(""), 332)
		showLoading();
		console.log("11111")
		APIs.checkCardBin({ account: this.data.cardNo }).then(({ result }) => {
			console.log(result, 175)
			hideLoading();
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			if (result.issuer_code == "ABC") {
				this.setData({ sendMsgFlag: true })
			} else {
				my.navigateTo({ url: "/pages/index/sign-abc-household/sign-abc-household" });
				this.setData({ abcFlag: false })
				console.log("+++++++++++++")
				this.setData({ sendMsgFlag: true })
				return false;
			}
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});
		console.log(this.data.accBank, 204)
	},
	async sendMsg() {
		showLoading()
		if (!this.checkParams()) {
			hideLoading()
			return;
		}
		try {
			console.log("------------")
			console.log(this.data.issuer, 231)
			let { result } = await APIs.checkCardBin({ account: this.data.cardNo })
			if (result.account_type == "1") {
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			// 一类户调用通用短信
			if (this.data.issuer === "ABC") {
				console.log("++++++++++")
				const params = {
					credential_code: this.data.certNo,
					mobile: this.data.mobile,
					username: this.data.userName,
					account: this.data.cardNo,
					merchant_code: "2102",
					credential_type: "01",
					account_type: "1"
				};
				let { result } = await APIs.signCheckABC(params);
				this.setData({ seqNo: result });
				hideLoading();
				showToast("发送成功");
				this.setData({ oldCardNo: this.data.cardNo });
				this.countDown();
			} else {
				hideLoading()
				showToast("请输入中国农业银行卡号");
				// let information = {
				// 	cardNo: this.data.cardNo,
				// 	mobile: this.data.mobile,
				// }
				// app.globalData.information = information;
				// my.navigateTo({ url: "/pages/index/sign-abc-household/sign-abc-household" });
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	async sign() {
		showLoading();
		if (!this.checkParams()) {
			hideLoading();
			return;
		}
		if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
			hideLoading();
			showToast("请填正确的验证码");
			return false;
		}
		if (!this.data.hasOldSecond) {
			if (this.data.issuer !== "ABC" && !this.data.signedId) {
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			if (this.data.issuer !== "ABC" && !this.data.channelSignedId) {
				hideLoading();
				showToast("请先获取验证码");
				return;
			}
			console.log(this.data.oldCardNo, 316, this.data.cardNo, 316)
			if (this.data.oldCardNo != trimAll(this.data.cardNo)) {
				hideLoading();
				showTitledAlert("您更改了银行卡号，请重新发送验证码");
				return;
			}
		}

		try {
			// 一类户签约
			if (this.data.issuer === "ABC") {
				const params = {
					sub_channel: "ABC_TRUCK",
					credential_code: this.data.certNo,
					username: this.data.userName,
					mobile: this.data.mobile,
					account: this.data.cardNo,
					credential_type: "01",
					account_type: this.data.accountType,
					seq_no: this.data.seqNo,
					verify_code: this.data.captcha,
					merchant_code: "2102"
				};
				console.log(params);
				let {msg,result}= await APIs.signApply(params);
				if(msg.indexOf("请勿重复签约")!=-1){
                    showToast(msg);
				}
				await APIs.signedNotice({
					bank_code: "ABC",
					signed_id: result.signed_id,
					sign_branch: this.data.mechanismId || "",
					sign_staf: this.data.staffId || ""
				});
				hideLoading();
				if (interval) {
					clearInterval(interval);
					this.setData({
						smallButtonText: `点击发送`,
						disableInput: false
					});
				}
			}
			// 跳转到授信页面
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
		my.navigateTo({ url: "/pages/index/sign-abc-household/sign-abc-household" });
	},
	onLoad() {
		// const { data: userName } = my.getStorageSync({ "key": "idName" });
		// const { data: certNo } = my.getStorageSync({ "key": "idNumber" });
		// this.setData({ userName, certNo });
	},
	async onShow() {
		let { result } = await APIs.customerQuery();
		this.setData({ address: result.address })
		// console.log(result, 333)

		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		const { data: idNumber } = my.getStorageSync({ key: "idNumber" });//身份证号
		const channel = my.getStorageSync({ "key": "source" }) || "";
		if (channel) {
				if(channel.data=="68"){
						const staffId  = app.globalData.invitecode;//工作人员编号
						const mechanismId  =app.globalData.inviteorg;//机构编码
						this.setData({ staffId, mechanismId })
						console.log(staffId, mechanismId, 464)
				}

		}
		
		this.setData({ userName: username })
		this.setData({ certNo: idNumber })


	}
});

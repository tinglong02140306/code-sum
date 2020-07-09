import APIs from "../../../apis/index";
import {
	showTitledAlert,
	showToast,
	trimAll,
	showLoading,
	hideLoading,
	ftAccBank,
	img2base64,
	ftDate
} from "../../../utils/util";

const app = getApp();
let interval = "";
const accBanks = ["中国工商银行", "中国银行", "交通银行",];
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
		// 6236682340011259214 中国建设银行， 霍付全 ， 372922198809224797 , 18566259221 两个手机号试试
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
		sendMsgFlag: false,
		item_time: ""

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
			currentDate: this.data.item_time,
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
		if (!trimAll(this.data.cardNo)) {
			showToast("请填写银行卡号");
			return false;
		}
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
				// showToast("请输入本行银行卡号");
				// this.setData({hasOldSecond:true})
				// return false;
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
			let { result } = await APIs.checkCardBin({ account: this.data.cardNo })
			console.log(result, 229)
			if (result.account_type == "1") {
				hideLoading()
				showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
				return;
			}
			this.setData({ issuer: result.issuer_code, accountType: result.account_type });
			if (this.data.issuer === "ABC") {
				hideLoading()
			} else {
				//  showToast("请输入本行银行卡号");
				//  hideLoading()
				if (!trimAll(this.data.accBank)) {
					hideLoading();
					showToast("请选择发卡方");
					return false;
				}
				console.log("000000000")
				// 二类户 先查询是否存在二类户
				console.log(this.data.accBank, 204)
				const paramsOne = {
					origin: "FINANCE",
					account_type: this.data.accountType,
					merchant_code: "truck_obu_etc",
					credential_code: this.data.certNo,
					username: this.data.userName,
					mobile: this.data.mobile,
					account: this.data.cardNo,
					credential_type: "01",
					arg_no: this.data.accBank === "农行" ? "151183" : "151161",
					bank_type: this.data.accBank === "农行" ? "01" : "02",
					acc_bank: ftAccBank(this.data.accBank)
				};
				console.log(paramsOne,273)
				showLoading();
				// let { result } = await APIs.sendMsgABC(params);
				let { result } = await APIs.signSecondQueryABC(paramsOne);
				console.log(result,269)
				hideLoading();
				if (result && result.status == "02") {
					console.log("1111111111111111")
					const msg = `您当前身份证${this.data.certNo}下已有二类户账户，将使用已经开通的二类户继续签约，点击“确定”继续`;
					await showTitledAlert(msg);
					this.setData({ disableInput: true, cardNo:result.medium_id, mobile: result.tell_no, hasOldSecond: true, channel_signed_id_one: result.medium_id });
					// console.log(this.data.mobile,276)
					//  await APIs.sendMsgCommon({ mobile: this.data.mobile });
					//  hideLoading();
					// showToast("发送成功");
					// this.countDown();
				} else {
					console.log("777777777777777")
					hideLoading()
					this.setData({ signedId: result.signed_id, channelSignedId: result.channel_signed_id });
					this.setData({ oldCardNo: this.data.cardNo, hasOldSecond: false });
					console.log(this.data.oldCardNo, this.data.cardNo, 285)
					this.countDown();
				}
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
		if (!this.data.hasOldSecond) {
			if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
				hideLoading();
				showToast("请填正确的验证码");
				return false;
			}
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
			// showToast("请输入本行银行卡号");
			// hideLoading()
			//	二类户签约
			if (this.data.hasOldSecond) {

				await APIs.msgValidCommon({ mobile: this.data.mobile, code: this.data.captcha });

			} else {
				if (!trimAll(this.data.startDate)) {
					hideLoading();
					showToast("请填写证件签发日期");
					return false;
				}
				if (!trimAll(this.data.accBank)) {
					hideLoading();
					showToast("请选择发卡方");
					return false;
				}
				if (!trimAll(this.data.realIdFaceImg)) {
					hideLoading();
					showToast("请上传身份证（人像面）");
					return false;
				}
				if (!trimAll(this.data.realIdBackImg)) {
					hideLoading();
					showToast("请上传身份证（国徽面）");
					return false;
				}
				//	这里需要上传身份证图片

				const params = {
					cert_no: this.data.certNo,
					cert_photo1: this.data.realIdFaceImg,
					cert_photo2: this.data.realIdBackImg,
					customer_name: this.data.userName,
					merchant_code: "truck_obu_etc",
					ori_request_id: this.data.channelSignedId
					//   
				};
				console.log("9999999999")
				console.log(params, 329)
				await APIs.uploadABC(params);
				const params2 = {
					channel_signed_id: this.data.channelSignedId,
					chk_no: this.data.captcha,
					address: this.data.address,
					arg_no: this.data.accBank === "农行" ? "151183" : "151161",
					markert_num: "",
					sign_date: this.data.startDate.split("-").join(""),
					vaildity_period: this.data.endDate.split("-").join("") ? this.data.endDate.split("-").join("") : "99999999",
					bank_type: this.data.accBank === "农行" ? "01" : "02"
				};
				
				let { result } = await APIs.msgValidABC(params2);

				this.setData({ channel_signed_id_one: result.channel_signed_id })

			}
			const params = {
				// sub_channel: "ABC_ACC_TRUCK",
				// credential_code: this.data.certNo,
				// username: this.data.userName,
				// mobile: this.data.mobile,
				// account: this.data.cardNo
				sub_channel: "ABC_ACC_TRUCK",
				credential_code: this.data.certNo,
				mobile: this.data.mobile,
				username: this.data.userName,
				account: this.data.channel_signed_id_one,
				merchant_code: "2102",
				credential_type: "01",
				account_type: "1"
			};
			// 去签约
			// let { result } = await APIs.signSecondApplyABC(params);
            // let res =await APIs.signSecondApplyABC(params);
            //     showToast(res.msg);
			let {msg,result}= await APIs.signSecondApplyABC(params);
				if(msg.indexOf("请勿重复签约")!=-1){
                    showToast(msg);
				}
			hideLoading();
			app.globalData.bank_code = "ABC";
			const params2 = {
				bank_code: "ABC",
				signed_id:result.signed_id,
				sign_branch: this.data.mechanismId || "",
				sign_staf: this.data.staffId || ""
			};
			console.log("1234567")
			//签约成功通知
			await APIs.signedNotice(params2);
			console.log("89101111")
			hideLoading();
			if (interval) {
				clearInterval(interval);
				this.setData({
					smallButtonText: `点击发送`,
					disableInput: false
				});
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
	onLoad() {
		let information = app.globalData.information
		this.setData({
			cardNo: information.cardNo,
			mobile: information.mobile,
		})
		// const { data: userName } = my.getStorageSync({ "key": "idName" });
		// const { data: certNo } = my.getStorageSync({ "key": "idNumber" });
		// this.setData({ userName, certNo });
	},
	async onShow() {
		console.log(ftDate(), 435)
		let item_time = ftDate()
		item_time = `${item_time.slice(0, 4)}-${item_time.slice(4, 6)}-${item_time.slice(6, 8)}`
		this.setData({ item_time: item_time })
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

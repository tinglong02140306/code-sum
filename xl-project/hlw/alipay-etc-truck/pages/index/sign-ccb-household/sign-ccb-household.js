import APIs from "../../../apis/index";
import {
	showTitledAlert,
	showToast,
	trimAll,
	showLoading,
	hideLoading,
	img2base64,
	ftDate,
	ftCarColor,
	ftpation,
	sleep_ccb
} from "../../../utils/util";

const app = getApp();
let interval = "";
const colors = ["蓝牌", "黄牌", "黑牌", "白牌", "渐变绿色", "黄绿双拼色", "蓝白渐变色"];
const pation = ["公务员", "事业单位员工", "公司员工", "军人警察", "工人", "农民", "管理人员","技术人员","私营业主","文体明星","自由职业者","学生","无职业"];
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
		// 6236682340011259214 中国建设银行， 霍付全 ， 372922198809224797 , 18566259221 两个手机号试试 6217856000073369760 中国银行
		// 工行： 6222023202047770911  电话 18566259221, 18660196906
		//  白羽 370403198901057292 ；交行 6222623740000095721 ； 15688892323
		userName: "夏风鲁",//姓名
		certNo: "371524199205101651",//
		cardNo: "6228210259028435377",//
		mobile: "15634131276",//手机号码
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
		startDate: "",
		endDate: "", 
		signed_id: "",
		channel_signed_id_one: "",//二类户账户名字
		abcFlag: true,
		staffId: "",
		mechanismId: "",
		sendMsgFlag: false,
		item_time: "",
		carColor: "",
		occupation:""
	},
	imgPreview(idx) {
		const urls = [idx];
		my.previewImage({
			urls
		});
	},
	selectCarColor() {
		my.showActionSheet({
			title: "选择车辆颜色",
			items: colors,
			success: (res) => {
				console.log(res);
				this.setData({
					carColor: colors[res.index],
				});
			},
		});
	},
	selectCaroccupation(){
		my.showActionSheet({
			title: "选择职业",
			items: pation,
			success: (res) => {
				console.log(res);
				this.setData({
					occupation: pation[res.index],
				});
			},
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
		if (!trimAll(this.data.startDate)) {
			hideLoading();
			showToast("请填写证件签发日期");
			return false;
		}
		// if (!trimAll(this.data.realIdFaceImg)) {
		// 	hideLoading();
		// 	showToast("请上传身份证（人像面）");
		// 	return false;
		// }
		// if (!trimAll(this.data.realIdBackImg)) {
		// 	hideLoading();
		// 	showToast("请上传身份证（国徽面）");
		// 	return false;
		// }
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
    async sleepccb(){
            const params = {
                cert_no: this.data.certNo,	      //证件号码
            }
            try{
                for (let i = 0; i < 6; i++) {
                    let { result } = await APIs.signedCCB(params);
                        if (result && result.status == "02") {
                            hideLoading()
                            console.log("1111111111111111")
                            const msg = `您当前身份证${this.data.certNo}下已有二类户账户，将使用已经开通的二类户继续签约，点击“确定”继续`;
                            await showTitledAlert(msg);
                            this.setData({ hasOldSecond: true });
							break;
                        } else if(result && result.status == "01") {
                            if (i < 5) {
                                console.log(i,250)
								console.log(sleep_ccb(),250)
                                await sleep_ccb();
                            } else {
                                hideLoading();
                                showTitledAlert("银行没有返回结果，请稍后重试");
                            }
                        }else{
                            console.log("777777777777777")
                            hideLoading()
                            this.setData({ hasOldSecond: false });
                            console.log(this.data.oldCardNo, this.data.cardNo, 285)
                            this.countDown();
						    break;
                        }
                }
            }catch(error){
                hideLoading();
                console.log(error);
                showToast(error.message);
            }
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
			if (this.data.issuer === "CCB") {
				hideLoading()
			} else {
                console.log(this.data.carColor,251)
				console.log("000000000")
				// 二类户 先查询是否存在二类户
				const paramsOne = {
					credential_type: "01",				//证件类型
					credential_code: this.data.certNo,	//证件号码
					mobile: this.data.mobile,			//手机号码
					username: this.data.userName,      	//用户名
					account: this.data.cardNo,			//签约账户
					account_type: this.data.accountType,//账户类型
				    // merchant_code: "truck_obu_etc",		//商户编码 默认
					address:this.data.address,							//联系地址, 邮寄地址或身份证地址 
					occupation:ftpation(this.data.occupation),	//职业
					sign_date: this.data.startDate.split("-").join(""),  //身份证签发期
					vaildity_period: this.data.endDate.split("-").join("") ? this.data.endDate.split("-").join("") : "99999999",  //身份证有效期,
					cert_photo1: this.data.realIdFaceImg,//身份证正面照
					cert_photo2: this.data.realIdBackImg,//身份证反面照
					vehicle_color:ftCarColor(this.data.carColor),                    //车牌颜色
					// vehicle_plate: "",					 //	车牌号码							
				};
				console.log(paramsOne, 273)
				showLoading();
				// 2.10.1.建设银行账号开户发送短信验证码
				let {result:{request_id}}=await APIs.accountsCCB(paramsOne);
                console.log(request_id, 269)
                this.setData({request_id:request_id})
				
                // 2.10.2.建设银行账号开户-鉴权结果查询
                this.sleepccb()
				hideLoading()
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
        if(!this.data.hasOldSecond){
            if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
                hideLoading();
                showToast("请填正确的验证码");
                return false;
            }
        }
		
		try {
			// showToast("请输入本行银行卡号");
			// hideLoading()
			//	二类户签约
			if (this.data.hasOldSecond) {
				// await APIs.msgValidCommon({ mobile: this.data.mobile, code: this.data.captcha });
			} else {
				const params2 = {
					chk_no: this.data.certNo,	        //验证码
					oriRequest_id:this.data.request_id,					//请求流水号
				};
				let { result } = await APIs.openCCB(params2);
				this.setData({ channel_signed_id_one: result.channel_signed_id })
			}

			const params = {
				sub_channel: "CCB_ACC_TRUCK",
				credential_code: this.data.certNo,
				mobile: this.data.mobile,
				username: this.data.userName,
				account: this.data.cardNo,
				merchant_code: "2103",
				credential_type: "01",
				account_type: "1"
			};
			// 去签约
			let { msg, result } = await APIs.signSecondApplyABC(params);
			if (msg.indexOf("请勿重复签约") != -1) {
				showToast(msg);
			}
			hideLoading();
			app.globalData.bank_code = "ABC";
			const params2 = {
				bank_code: "CCB",
				signed_id: result.signed_id,
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
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	onLoad() {
		// let information = app.globalData.information
		// this.setData({
		// 	cardNo: information.cardNo,
		// 	mobile: information.mobile,
		// })
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
		// const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		// const { data: idNumber } = my.getStorageSync({ key: "idNumber" });//身份证号
		// this.setData({ userName: username })
		// this.setData({ certNo: idNumber })


	}
});

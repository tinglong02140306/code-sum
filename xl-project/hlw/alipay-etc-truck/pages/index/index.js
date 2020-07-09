import APIs from "../../apis/index";
import { hideLoading, showLoading, ftDate, showTitledAlert } from "../../utils/util";
import { getToken } from "../../utils/request";

const app = getApp();
Page({
	data: {
		loaded: false,
		bankCode: "",
		source: "",
		flagETC:false,
		flag: false,
		flagTj: false,
		flagHb:false,
		flagYn:false,
		flagMony:false,
		flagGx: false
	},
	async next(){
		showLoading();
		try {
			await getToken();
			let { data: source } = my.getStorageSync({ "key": "source" });
			this.setData({ source: source });
			let { result } = await APIs.customerQuery();
			my.setStorageSync({ key: "curApplyType", data: "personal" });
			app.globalData.address = result.address;
			this.setData({ bankCode: result.bank_code });
			if(result.state === "1") {
				hideLoading();
				my.navigateTo({
					url: "/pages/my/my"
				});
				return;
			}
			if(result.state === "7") {
				if(result.step === "6") {
					my.reLaunch({
						url: "/pages/my/my"
					});
					return;
				}
			}
			let url;
			const step = result.step;
			if(step === "0") {
				url = "/pages/index/information/information";
			} else if(step === "1" || step === "2") {
				url = "/pages/index/car-info/car-info";
			} else if(step === "3") {
				url = "/pages/index/sign-credit-apply/sign-credit-apply";
			} else if(step === "4" || step === "5") {
				url = "/pages/index/sign-credit-result/sign-credit-result";
			} else {
				let { result } = await APIs.creditQuery();
				if(result.credit_result === "ACCEPTED") {
					url = "/pages/index/apply-complete/apply-complete?target=week";
				} else {
					if(this.data.bankCode === "MYBANK") {
						url = "/pages/index/apply-deposit/apply-deposit";
					} else if(this.data.bankCode === "CCB") {
						url = "/pages/index/ccb-deposit/ccb-deposit";
					} else {
						url = "/pages/index/other-deposit/other-deposit";
					}
				}
			}
			hideLoading();
			my.navigateTo({ url: url });
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	showProtocolMoney(){
		let time = ftDate();
		app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-sd.html?time=${time}`;
		my.navigateTo({
			url: "/pages/index/w-v/w-v"
		});
	},
	showProtocol(){
		const channel = my.getStorageSync({ "key": "source" }) || "";
		let time = ftDate();
		if(channel.data === "81" || channel.data === "82" || channel.data === "83") {//新疆
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-xj.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		} else if(channel.data === "85" || channel.data === "86" || channel.data === "87") {//天津
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-tj.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		} else if(channel.data === "94" || channel.data === "95" || channel.data === "96") {//河北
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-hb.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		} else if(channel.data === "91" || channel.data === "92" || channel.data === "93") {//云南
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-yn.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		} else if(channel.data === "101") {//红包
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/red-packet.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		}else if(channel.data === "97" || channel.data === "98" || channel.data === "99") {//广西
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-gx.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		}else {
			app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/etc-sd.html?time=${time}`;
			my.navigateTo({
				url: "/pages/index/w-v/w-v"
			});
		}
	},
	async onLoad(){
		my.setNavigationBar({ backgroundColor: "#108ee9" });
		const { data: curApplyType } = my.getStorageSync({ key: "curApplyType" });
		const { data: token } = my.getStorageSync({ "key": "token" });
		const channel = my.getStorageSync({ "key": "source" }) || "";
		if(channel.data === "81" || channel.data === "82" || channel.data === "83") {//新疆
			this.setData({ flag: true });
		} else if(channel.data === "85" || channel.data === "86" || channel.data === "87") {//天津
			this.setData({ flagTj: true});
		}else if(channel.data === "94" || channel.data === "95" || channel.data === "96") {//河北
			this.setData({flagHb:true });
		}else if(channel.data === "91" || channel.data === "92" || channel.data === "93") {//云南
			this.setData({flagYn:true });
		}else if(channel.data === "97" || channel.data === "98" || channel.data === "99") {//广西
			this.setData({flagGx:true });
		}else if(channel.data === "101") {//红包
			this.setData({flagMony:true });
		}else {
			this.setData({ flagETC: true });
		}
		if(token) {
			let result = "", res = "";
			try {
				if(curApplyType === "enterprise") {
					res = await APIs.companyInfoQuery();
				} else {
					res = await APIs.customerQuery();
				}
				result = res.result;
				if(result.state === "1" || result.state === "7") {
					my.reLaunch({
						url: "/pages/my/my"
					});
				} else {
					this.setData({ loaded: true });
				}
			} catch (error) {
				this.setData({ loaded: true });
				showTitledAlert(error.message.message || error.message);
			}
		} else {
			this.setData({ loaded: true });
		}
	},
	async company(){
		try {
			showLoading();
			let { result } = await APIs.companyInfoQuery();
			my.setStorageSync({ key: "curApplyType", data: "enterprise" });
			let url = "/pages/company/search-company/search-company";
			if(result) {
				app.companyData.companySignId = result.signed_id;
				app.companyData.companyIntentionProduct = result.intention_product;
				app.companyData.companyName = result.user_name;
				app.companyData.companyIdNum = result.user_certificate_no;
				app.companyData.companyBankCode = result.bank_code;
				if(result.state === "1" || result.state === "7") {
					hideLoading();
					my.reLaunch({ url: "/pages/my/my" });
					return;
				}
				const curStep = result.step;
				if(curStep === "1") {
					// 步骤一已经取消了  暂时保存这个代码 2020/01/14
					url = "/pages/company/vehicle-list/vehicle-list";
				} else if(curStep === "2") {
					url = "/pages/company/sign-account/sign-account";
				} else if(curStep === "3") {
					url = "/pages/company/credit-confirm/credit-confirm";
				} else if(curStep === "4") {
					url = "/pages/company/refresh-result/refresh-result?type=credit";
				} else if(curStep === "5") {
					if(result.audit_state === "ADOPT") {
						// 日结免保证金
						if(result.intention_product === "74") {
							url = "/pages/company/company-product-day-74/company-product-day-74";
						} else {
							url = "/pages/company/company-credit-result/company-credit-result?status=ACCEPTED";
						}
					} else if(result.audit_state === "REFUSE") {
						url = "/pages/company/company-credit-result/company-credit-result?status=REFUSED";
					} else {
						url = "/pages/company/refresh-result/refresh-result?type=credit";
					}
				} else if(curStep === "6") {
					if(result.state === "1") {
						url = "/pages/my/my";
					} else {
						// 日结免保证金  直接跳转到个人中心页面
						if(result.intention_product === "74") {
							url = "/pages/my/my";
						} else {
							url = "/pages/company/cash-deposit/cash-deposit";
						}
					}
				}
			}
			hideLoading();
			if(url === "/pages/my/my") {
				my.reLaunch({
					url: url
				});
				return;
			}
			my.navigateTo({
				url: url
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	}
});

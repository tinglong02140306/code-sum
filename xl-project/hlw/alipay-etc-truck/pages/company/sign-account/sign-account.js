import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";


const app = getApp();
Page({
	data: {
		loaded: false,
		signInfo: "",
		companyName: ""
	},
	async next(){
		try {
			showLoading();
			let params = {};
			const signInfo = this.data.signInfo;
			// 签约建行对公账户
			if(signInfo["account_type"] === "CCB_TRUCK") {
				params = {
					sub_channel: "CCB_TRUCK",
					credential_code: signInfo["credential_code"],
					username: signInfo["username"],
					mobile: signInfo["mobile"],
					account: signInfo["account"],
					merchant_code: signInfo["merchant_code"],
					credential_type: signInfo["credential_type"],
					account_type: "3"
				};
				let { result } = await APIs.companyBankSign(params);
				params = {
					bank_code: "CCB",
					signed_id: result["signed_id"],
				};
				let res = await APIs.companySignNotice(params);
				app.companyData.companySignId = res.result.signed_id;
				hideLoading();
				app.companyData.companyBankCode = "CCB";
				my.redirectTo({
					url: "/pages/company/credit-confirm/credit-confirm"
				});
				return;
			}
			// 签约工行虚拟户
			if(signInfo["account_type"] === "QYHC_ICBC_MA") {
				params = {
					sub_channel: "QYHC_ICBC_MA",
					credential_code: signInfo["credential_code"],
					username: signInfo["username"],
					mobile: signInfo["mobile"],
					account: signInfo["account"],
					merchant_code: signInfo["merchant_code"],
					credential_type: signInfo["credential_type"],
					account_type: "4",
					user_type: "2"
				};
				let { result } = await APIs.companyICBCSign(params);
				params = {
					bank_code: "ICBC",
					signed_id: result["signed_id"],
				};
				let res = await APIs.companySignNotice(params);
				app.companyData.companySignId = res.result.signed_id;
				hideLoading();
				app.companyData.companyBankCode = "ICBC";
				my.redirectTo({
					url: "/pages/company/credit-confirm/credit-confirm"
				});
			}
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async onLoad(){
		this.setData({ companyName: app.companyData.companyName });
		try {
			showLoading();
			const params = {
				channel_code: "apxl_trade",
				origin_user_id: app.companyData.companyIdNum,
				origin: "HBMS"
			};
			let { result } = await APIs.companySignQuery(params);
			if(result && result.length) {
				this.setData({ signInfo: result[0] });
			}
			this.setData({ loaded: true });
			hideLoading();
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	}
});

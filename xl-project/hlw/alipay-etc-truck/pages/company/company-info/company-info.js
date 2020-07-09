import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";

const app = getApp();
Page({
	data: {
		loaded: false,
		companyInfo: "",
		uuidAddress: ""
	},
	selectAddress(){
		my.navigateTo({
			url: "/pages/company/company-address-list/company-address-list"
		});
	},
	async next(){
		try {
			showLoading();
			// 先开户 再提交
			let res = "", params = {};
			const companyInfo = this.data.companyInfo;
			let { data: source } = my.getStorageSync({ key: "source" });
			source = source ? source === "alipay" ? "69" : source : "66";
			params = {
				source: source,
				user_name: companyInfo["name"],
				user_certificate_no: companyInfo["idnum"],
				address: companyInfo["addr"],
				uuid_address: this.data.uuidAddress["uuid_address"]
			};
			res = await APIs.companyCustomerDataApply(params);
			hideLoading();
			my.redirectTo({
				url: "/pages/company/vehicle-list/vehicle-list"
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async onLoad(){
		try {
			let res = await APIs.companyApplyInfoQuery({ name: app.companyData.companyName });
			if(res && res.result) {
				app.companyData.companyAddress = res.result.addr;
				app.companyData.companyIdNum = res.result.idnum;
				this.setData({ loaded: true, companyInfo: res.result });
			} else {
				const msg = "未查到相关企业，请确认已经通过批量系统上传该企业信息";
				await showTitledAlert(msg);
				my.navigateBack();
			}
		} catch (error) {
			showToast(error.message);
			setTimeout(() => {
				my.navigateBack();
			}, 2000);
		}
	},
	onShow(){
		const addressInfo = app.companyData.companyUuidAddress;
		if(addressInfo) {
			let uuidAddress = {};
			uuidAddress["uuid_address"] = addressInfo["uuid_address"];
			uuidAddress["address"] = addressInfo["receive_province"] + addressInfo["receive_city"] + addressInfo["receive_area"] + addressInfo["receive_address"];
			this.setData({ uuidAddress });
		}
	}
});

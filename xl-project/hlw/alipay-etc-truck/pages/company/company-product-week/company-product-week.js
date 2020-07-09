import { hideLoading, showLoading, showTitledAlert } from "../../../utils/util";
import APIs from "../../../apis";

const app = getApp();

Page({
	data: {
		creditLimit: 0
	},
	showProtocol(){
		my.navigateTo({
			url: "/pages/index/Withhold/Withhold"
		});
	},
	async next(){
		try {
			showLoading();
			let params = {};
			params = {
				intention_product: app.companyData.companyIntentionProduct
			};
			await APIs.companyProductIntention(params);
			params = {
				sign_id: app.companyData.companySignId
			};
			await APIs.companyAliSignNotice(params);
			hideLoading();
			my.navigateTo({
				url: "/pages/company/company-apply-complete/company-apply-complete?target=week"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	async onLoad(){
		try {
			showLoading();
			let { result } = await APIs.companyCreditQuery();
			hideLoading();
			app.companyData.companyCreditLimit = result.credit_limit;
			this.setData({ creditLimit: result.credit_limit });
		} catch(error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	}
});

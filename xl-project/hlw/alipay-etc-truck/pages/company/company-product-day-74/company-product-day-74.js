import { hideLoading, showLoading, showTitledAlert } from "../../../utils/util";
import APIs from "../../../apis";

const app = getApp();
Page({
	data: {},
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
				url: "/pages/company/company-apply-complete/company-apply-complete?target=day"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	}
});

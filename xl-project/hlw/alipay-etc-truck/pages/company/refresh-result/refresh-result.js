import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert } from "../../../utils/util";


const app = getApp();
Page({
	data: {
		curType: "",
	},
	async deposit(){
		try {
			showLoading();
			let params = {
				bank_code: app.companyData.companyBankCode,
				transfer_type: "open_account",
				vehicle_ids: app.companyData.companyVehicleIds
			};
			let { result } = await APIs.companyDepositTransferQuery(params);
			let msg = "";
			hideLoading();
			if(result.transfer_state === "INIT") {
				msg = result.fail_desc && result.fail_desc !== "INIT" ? result.fail_desc : "保证金划拨中，请稍后查询";
				showTitledAlert(msg);
				return;
			}
			if(result.transfer_state === "FAILURE") {
				msg = (result.fail_desc && result.fail_desc !== "FAILURE") ? result.fail_desc : "缴纳保证金失败，请您重试";
				showTitledAlert(msg);
				return;
			}
			if(result.transfer_state === "NOMONEY") {
				msg = (result.fail_desc && result.fail_desc !== "NOMONEY") ? result.fail_desc : "请在银行卡中充入足够金额进行保证金缴纳";
				showTitledAlert(msg);
				return;
			}
			await showTitledAlert("划拨成功！");
			my.navigateTo({
				url: "/pages/company/company-apply-complete/company-apply-complete?target=day"
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async credit(){
		try {
			showLoading();
			let { result } = await APIs.companyCreditQuery();
			hideLoading();
			app.companyData.companyIntentionProduct = result.intention_product;
			let url = "";
			if(result.credit_result === "REFUSED") {
				url = "/pages/company/company-credit-result/company-credit-result?status=REFUSED";
				my.navigateTo({
					url: url
				});
				return;
			}
			if(result.credit_result === "ACCEPTED") {
				app.companyData.companyCreditLimit = result.credit_limit;
				if(result.intention_product === "74") {
					url = "/pages/company/company-product-day-74/company-product-day-74";
					my.navigateTo({
						url: url
					});
					return;
				}
				url = "/pages/company/company-credit-result/company-credit-result?status=ACCEPTED";
				my.navigateTo({
					url: url
				});
				return;
			}
			if(result.credit_result === "INCONFORMITY") {
				await showTitledAlert(result.refuse_desc || "授信人与企业法人不一致，请重新扫码授信！");
				url = "/pages/company/credit-confirm/credit-confirm";
				my.redirectTo({
					url: url
				});
				return;
			}
			showTitledAlert("授信中，请稍后重试");
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	onLoad(options){
		this.setData({ curType: options.type });
	}
});

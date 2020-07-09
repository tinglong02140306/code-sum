import APIs from "../../../apis/index";
import { showTitledAlert } from "../../../utils/util";

let interval = "";

const app = getApp();
Page({
	data: {
		timer: "180",
		loaded: true,
	},
	countDown(count = 180){
		interval = setInterval(() => {
			if(!this.data.loaded) {
				this.setData({ loaded: true });
			}
			this.setData({ timer: count });
			count--;
			if(count % 10 === 0) {
				APIs.companyCreditQuery().then(({ result }) => {
					if(result.credit_result === "REFUSED") {
						if(interval) {
							clearInterval(interval);
						}
						app.companyData.companyIntentionProduct = result.intention_product;
						my.redirectTo({
							url: "/pages/company/company-credit-result/company-credit-result?status=REFUSED"
						});
						return;
					}
					if(result.credit_result === "ACCEPTED") {
						if(interval) {
							clearInterval(interval);
						}
						app.companyData.companyIntentionProduct = result.intention_product;
						app.companyData.companyCreditLimit = result.credit_limit;
						// 日结免保证金
						if(result.intention_product === "74") {
							my.redirectTo({
								url: "/pages/company/company-product-day-74/company-product-day-74"
							});
							return;
						}
						// 周结
						my.redirectTo({
							url: "/pages/company/company-credit-result/company-credit-result?status=ACCEPTED"
						});
						return;
					}
					if(result.credit_result === "INCONFORMITY") {
						if(interval) {
							clearInterval(interval);
						}
						const msg = "授信人与企业法人不一致，请重新扫码授信！";
						showTitledAlert(msg).then(() => {
							my.redirectTo({
								url: "/pages/company/credit-confirm/credit-confirm"
							});
							// my.navigateBack();
						});
					}
				}).catch(error => {
					if(interval) {
						clearInterval(interval);
					}
					showTitledAlert(error.message);
				});
			}
			if(count < 2) {
				clearInterval(interval);
				my.redirectTo({
					url: "/pages/company/refresh-result/refresh-result?type=credit"
				});
			}
		}, 1000);
	},
	onLoad(){
		if(interval) {
			clearInterval(interval);
		}
		this.countDown();
	}
});

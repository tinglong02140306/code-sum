import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert } from "../../../utils/util";


const app = getApp();
Page({
	data: {
		waitingTitle: "评估完成",
		waitingSubtitle: "您暂时没有获得信用额度，请前往签约日结卡",
		waitingButton: {
			mainButton: {
				buttonText: "前往签约",
			},
		},
		acceptButton: {
			mainButton: {
				buttonText: "前往签约"
			},
		},
		acceptTitle: "授信成功",
		acceptSubtitle: "网商银行信用额度申请成功,请前往签约周结卡",
		status: "REFUSED",
	},
	next(){
		my.navigateTo({
			url: "/pages/company/company-product-day/company-product-day"
		});
	},
	apply(){
		my.navigateTo({
			url: "/pages/company/company-product-week/company-product-week"
		});
	},
	async onLoad(options){
		this.setData({ status: options.status });
	}
});

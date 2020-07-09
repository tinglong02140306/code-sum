
import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";
const app = getApp();
Page({
	data: {
    waitingTitle: "评估完成",
		waitingSubtitle: "免保证金日结产品，是指您可按日结算通行费，在您通行高速后的第二天为您出具通行费账单，您需要在当天完成通行费账单的还款。",
		waitingButton: {
				mainButton: {
				buttonText: "前往个人中心",
			},
		},
    
	},
  next() {
		my.navigateTo({
				url: `/pages/my/my`
		});
		
	},
});

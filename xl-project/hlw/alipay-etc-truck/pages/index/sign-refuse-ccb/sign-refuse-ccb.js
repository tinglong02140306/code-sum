
import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";
const app = getApp();
Page({
	data: {
    waitingTitle: "评估完成",
		waitingSubtitle: "很遗憾，审批未通过，暂时无法办理",
		waitingButton: {
		},
    
	},
  async onLoad(option) {
	try {
			showLoading();
			const params = {
				intention_product: option.intention_product
			};
			await APIs.productIntention(params);
			hideLoading()
		} catch (error) {
			console.log(error);
			hideLoading();
			showToast(error.message);
		}
	}
});

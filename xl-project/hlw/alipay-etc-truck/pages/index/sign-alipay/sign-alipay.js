import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
		activeIndex: 4,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
	},
	goSign() {
		showLoading();
		// APIs.alipaySignApply(params).then(res => {
		// 	//	跳转到支付宝免密签约
		// }).catch(error => {
		// 	hideLoading();
		// 	console.log(error);
		// 	showToast(error.message);
		// });
	},
	async onShow() {
		try {
			showLoading();
      my.redirectTo({
				url:"/pages/index/apply-deposit/apply-deposit"
			});
			let { result } = await APIs.alipaySignQuery();
			console.log(result);
			//	如果成功  发送签约成功结果通知
			await APIs.alipaySignNotice({ sign_id: result.signed_id });
			let res = await APIs.creditQuery();
			let url;
			if (res.result.credit_result === "ACCEPTED") {
				url = "/pages/index/apply-complete/apply-complete?target=week";
			} else {
				url = "/pages/index/apply-deposit/apply-deposit";
			}
			hideLoading();
			my.redirectTo({
				url: url
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	}
});

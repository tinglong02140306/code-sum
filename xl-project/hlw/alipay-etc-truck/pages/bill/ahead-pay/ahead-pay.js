import { formatDate, hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";
import { channelCodeMap } from "../../../utils/mapUtils";

const app = getApp();


Page({
	data: {
		list: [],
		selected: [],
		sum: 0,
		channels: []
	},
	payNow() {
		let bills = "";
		const aheadList = app.globalData.aheadPayList;
		aheadList.forEach(item => {
			bills += `${ item["bill_account_statement_id"] },`;
		});
		const params = {
			repayment_way: "ONLINE_USER",
			bill_account_statement_id: bills
		};
		APIs.payNow(params).then(({ result }) => {
			// 这里怎么跳转
			if(result.some(item => {
				return item["sub_code"] != 200;
			})){
				showTitledAlert("部分账单未还款成功，请返回查看").then(() => {
					my.navigateBack();
				});
			} else {
				showTitledAlert("还款申请已提交").then(() => {
					my.navigateBack();
				});
			}
			// my.navigateTo({
			// 	url: "/pages/bill/repayment-result/repayment-result"
			// });
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});
	},
	onShow() {
		const aheadList = app.globalData.aheadPayList;
		let sum = 0;
		aheadList.forEach(item => {
			sum += Number(item["amount"]);
		});
		this.setData({ sum: sum.toFixed(2) });
	},
	onLoad() {
		this.setData({ channelCodeMap });
		showLoading();
		APIs.repayChannel().then(({ result }) => {
			hideLoading();
			this.setData({ channels: result });
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});
	}
});

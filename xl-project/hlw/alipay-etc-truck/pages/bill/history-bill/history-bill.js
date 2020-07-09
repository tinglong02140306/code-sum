import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";
import { billStateMap } from "../../../utils/mapUtils";

const app = getApp();


Page({
	data: {
		list: [],
		loaded: false
	},
	showDetail(e){
		const item = e.currentTarget.dataset.idx;
		my.navigateTo({
			url: `/pages/bill/history-bill-detail/history-bill-detail?flow=${ item["flow"] }&id=${ item["bill_account_statement_id"] }`
		});
	},
	getHistoryList(){
		showLoading();
		//9.1.6.历史账单列表
		APIs.historyBill({ flow_level: "0" }).then(res => {
			hideLoading();
			this.setData({ list: res.result, loaded: true });
		}).catch(error => {
			this.setData({ loaded: true });
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	onLoad(){
		this.setData({ billStateMap });
		this.getHistoryList();
	}
});

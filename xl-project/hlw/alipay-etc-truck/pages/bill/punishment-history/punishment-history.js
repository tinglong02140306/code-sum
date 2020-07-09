import { formatDate, hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";
import {billStateMap} from "../../../utils/mapUtils";

const app = getApp();


Page({
	data: {
		list: [],
		sum: 0,
		selected: []
	},
	goBack(){
		my.navigateBack();
	},
	showDetail(e){
		const item = e.currentTarget.dataset.item;
		my.navigateTo({
			url: `/pages/bill/punishment-detail/punishment-detail?id=${item["bill_account_statement_id"]}`
		});
	},
	loadData() {
		showLoading();
		const params = {
			category: "PUNISH",
			flow_level: "2",
			state: "CLEARED"
		};
		APIs.accountStatement(params).then(res => {
			hideLoading();
			res = res.result;
			this.setData({ list: res });
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	onLoad(){
		this.setData({billStateMap});
		this.loadData();
	}
});

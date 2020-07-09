import { formatDate, hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
		list: [],
		selected: [],
		sum: 0
	},
	cbxChange(e) {
		console.log(e);
		let sum = 0;
		const selected = e.detail.value;
		selected.forEach(item => {
			sum += parseFloat(this.data.list[item]["amount"]);
		});
		this.setData({ selected,sum });
	},
	pay(){
		let arr = [];
		const selected = this.data.selected;
		selected.forEach(item => {
			arr.push(this.data.list[item]);
		});
		app.globalData.aheadPayList = arr;
		if(!arr.length){
			showToast("请至少选择一条要还款的记录");
			return;
		}
		setTimeout(() => {
			my.navigateTo({
				url: "/pages/bill/ahead-pay/ahead-pay"
			});
		},10);
	},
	getList() {
		showLoading();
		const params = {
			flow_level: "0",
			state_cond: "2"
		};
		APIs.accountStatement(params).then(({ result }) => {
			hideLoading();
			this.setData({ list: result });
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	onShow(){
		this.getList();
	}
});

import { formatDate, hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
		list: [],
		sum: 0,
		selected: []
	},
	cbxChange(e) {
		let sum = 0;
		const selectedList = e.detail.value;
		this.setData({ selected: selectedList });
		selectedList.forEach(item => {
			sum += this.data.list[item];
		});
		this.setData({ sum });
	},
	pay() {
		if (!this.data.selected.length) {
			showToast("请至少选择一条记录");
		}
		let bills = "";
		const selected = this.data.selected;
		selected.forEach(item => {
			bills += `${this.data.list[item]["bill_account_statement_id"]},`
		});
		showLoading();
		APIs.payNow({repayment_way: "ONLINE_USER",bill_account_statement_id: bills}).then(res => {
			hideLoading();
			showTitledAlert("缴纳成功！").then(() => {
				my.navigateBack();
			});
		}).catch(error => {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		});
	},
	showHistory() {
		my.navigateTo({
			url: "/pages/bill/punishment-history/punishment-history"
		});
	},
	async loadData() {
		try {
			showLoading();
			let res = await APIs.punishCondition();
			if (res.result) {
				const params = {
					category: "PUNISH",
					flow_level: "2",
					state: "ENABLED"
				};
				res = await APIs.accountStatement(params);
				hideLoading();
				this.setData({ list: res.result });
			} else {
				hideLoading();
				showTitledAlert("您不符合解黑条件！");
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	onShow() {
		this.loadData();
	}
});

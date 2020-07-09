import APIs from "../../../apis/index";
import { showToast, showLoading, hideLoading, getToday } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		gmtDate: getToday(),
		plateNo: "",
		page: 1,
		hasMore: true,
		list: [],
		loaded: false,
		maxDate: getToday()
	},
	onLoad(options){
		this.setData({ plateNo: app.globalData.billInfo["plateNo"] });
		this.getData();
	},
	bindDateChange(e){
		this.setData({ gmtDate: e.detail.value, list: [], page: 1, hasMore: true });
		setTimeout(() => this.getData(), 10);
	},
	getData(){
		showLoading();
		const params = {
			card_id: app.globalData.billInfo["cardId"],
			gmt_start: `${this.data.gmtDate.split("-").join("")}000000`,
			gmt_end: `${this.data.gmtDate.split("-").join("")}235959`,
			page: this.data.page,
			per_num: 10
		};
		APIs.getConsumeList(params).then(res => {
			res = res.data || [];
			if(res.length === 10) {
				this.setData({ hasMore: true, page: this.data.page + 1 });
			} else {
				this.setData({ hasMore: false });
			}
			this.setData({ list: [...this.data.list, ...res], loaded: true });
			hideLoading();
		}).catch(error => {
			hideLoading();
			this.setData({ loaded: true });
			showToast(error.message);
		});
	},
	showMonthBill(){
		my.navigateTo({ url: "/pages/bill/traffic-bill-month/traffic-bill-month" });
	},
	scrollToLower(){
		if(this.data.hasMore) {
			this.getData();
		}
	}
});

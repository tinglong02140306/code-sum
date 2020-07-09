import APIs from "../../../apis/index";
import { showToast, showLoading, hideLoading, getToday, computeMonthRange } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		gmtYear: "",
		gmtMonth: "",
		plateNo: "",
		page: 1,
		hasMore: true,
		list: [],
		loaded: false,
		queryType: 1,
		cardId: ""
	},
	onLoad(options){
		const queryType = options.type || "1";
		const { year, month, plateNo, cardId } = app.globalData.billInfo;
		this.setData({ plateNo, gmtYear: year, gmtMonth: month, queryType, cardId });
		this.getData();
	},
	getData(){
		showLoading();
		const params = {
			card_id: this.data.cardId,
			month: `${ this.data.gmtYear }${ this.data.gmtMonth }`,
			bill_type: this.data.queryType === "1" ? "1" : "6",
			page: this.data.page,
			per_num: 10
		};
		APIs.getMonthBillDetail(params).then(res => {
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
	scrollToLower(){
		if(this.data.hasMore) {
			this.getData();
		}
	}
});

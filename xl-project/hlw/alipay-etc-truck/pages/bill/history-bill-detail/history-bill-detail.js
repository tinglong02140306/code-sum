import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";
const app = getApp();


Page({
	data: {
		more: false,
		list: [],
		billInfo: {}
	},
	showMore() {
		this.setData({ more: true });
	},
	hideMore() {
		this.setData({ more: false });
	},
	pay(){
		my.navigateTo({
			url: "/pages/bill/repayment/repayment"
		});
	},
	showDetail(e){
		const item = e.currentTarget.dataset.item;
		my.navigateTo({
			url: `/pages/bill/bill-detail/bill-detail?type=history&start=${item["booked_date_start"]}&end=${item["booked_date_end"]}&flow=${item["flow"]}`
		});
	},
	async onLoad(options){
		const {flow,id} = options;
		try {
			showLoading();
      //9.1.3.查询单个周账单或月账单对应的日列表
			let res = await APIs.accountStatement({flow_level: "1",flow:flow});
			this.setData({list:res.result});
      console.log(res.result,36)
      // 9.1.7.查询单个账单明细
			res = await APIs.accountStatement({bill_account_statement_id: id});
      console.log(res,39)
			this.setData({billInfo: res.result[0]});
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	}
});

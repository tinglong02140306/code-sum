import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";

const app = getApp();


Page({
	data: {
		billInfo: {},
		billList: [],
		type: ""
	},
	showMore(e) {
		const idx = e.currentTarget.dataset.idx;
		const item = this.data.billList[idx];
		my.navigateTo({
			url: `/pages/bill/bill-detail/bill-detail?type=week&flow=${item["flow"]}&start=${item["booked_date_start"]}&end=${item["booked_date_end"]}`
		});
	},
	async getUnPaid(){
		try {
			showLoading();
			const params1 = {
				flow_level: "1",   
				is_sum: "2",
				state: "ENABLED"
			};
			const params2 = {
				flow_level: "1",
				state: "ENABLED",
			};
			let [res1,res2] = await Promise.all([APIs.accountStatement(params1),APIs.accountStatement(params2)]);
			this.setData({
				billInfo: res1.result[0],
				billList: res2.result
			});
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
  //9.1.1.已出账单未还款总计 ；9.1.2.已出账单未还款列表
	async getCurrent(){
		try {
      console.log("123456789")
			showLoading();
			const params1 = {
				flow_level: "0",
				state_cond: "2",
				is_sum: "2"
			};
			const params2 = {
				flow_level: "0",
				state_cond: "2",
			};
			let [res1,res2] = await Promise.all([APIs.accountStatement(params1),APIs.accountStatement(params2)]);
			this.setData({
				billInfo: res1.result[0],
				billList: res2.result
			});
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	onLoad(options) {
		const { type } = options;
    console.log(type,71)
		if(type === "current"){
			this.getCurrent();
		} else {
			this.getUnPaid();
		}
	}
});

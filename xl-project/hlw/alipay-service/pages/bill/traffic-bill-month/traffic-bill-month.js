import APIs from "../../../apis/index";
import { showToast, fmtCardNo, showLoading, hideLoading, getToday, computeMonthRange } from "../../../utils/util";
import { cardStatusMap } from "../../../utils/mapUtils";

const app = getApp();

Page({
	data: {
		plateNo: "",
		list: [],
		gmtYear: getToday().substr(0, 4),
		gmtMonth: getToday().substr(5, 2),
		gmtEndYear: getToday().substr(0, 4)
	},
	showDayBill(){
		my.navigateBack();
	},
	bindYearChange(e){
		this.setData({ gmtYear: e.detail.value });
		this.generateMonth();
	},
	generateMonth(){
		let nowYear = getToday().substr(0, 4);
		let list = [];
		if(this.data.gmtYear > nowYear) {
			this.setData({ list: [] });
			return;
		}
		if(this.data.gmtYear === nowYear) {
			//	生成当前年的月份和区间
			const nowMonth = parseInt(getToday().substr(5, 2));
			for(let i = 1; i < nowMonth; i++) {
				list.unshift(computeMonthRange(nowYear, i));
			}
			this.setData({ list });
			return;
		}
		//	 生成往年的月份和区间
		for(let i = 1; i <= 12; i++) {
			list.unshift(computeMonthRange(this.data.gmtYear, i));
		}
		this.setData({ list });
	},
	showDetail(e){
		const { year, month } = e.currentTarget.dataset.item;
		app.globalData.billInfo = {
			...app.globalData.billInfo,
			year,
			month
		};
		my.navigateTo({ url: "/pages/bill/bill-month-summary/bill-month-summary" });
	},
	onLoad(){
		this.setData({ plateNo: app.globalData.billInfo["plateNo"] });
		this.generateMonth();
	}
});

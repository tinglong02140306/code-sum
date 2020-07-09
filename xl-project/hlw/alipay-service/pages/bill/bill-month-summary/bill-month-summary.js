import APIs from "../../../apis/index";
import { showToast, showLoading, hideLoading } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		currentYear: "",
		currentMonth: "",
		plateNo: "",
		trafficBill: [],
		parkingBill: [],
		trafficTotal: 0.00,
		parkingTotal: 0.00,
		total: 0.00,
		loaded: false
	},
	async onLoad(){
		const { year, month, plateNo, cardId } = app.globalData.billInfo;
		this.setData({ currentYear: year, currentMonth: month, plateNo });
		try {
			showLoading();
			const params1 = {
				card_id: cardId,
				month: `${ year }${ month }`
			};
			const params2 = {
				card_id: cardId,
				month: `${ year }${ month }`,
				bill_type: 1,
				page: 1,
				per_num: 2
			};
			const params3 = {
				card_id: cardId,
				month: `${ year }${ month }`,
				bill_type: 6,
				page: 1,
				per_num: 2
			};
			let [{ data: res1 }, { data: res2 }, { data: res3 }] = await Promise.all([APIs.getMonthBill(params1), APIs.getMonthBillDetail(params2), APIs.getMonthBillDetail(params3)]);
			if(res1) {
				let trafficList = [], parkingList = [], trafficTotal = 0, parkingTotal = 0;
				trafficList = res1.filter(item => item["bill_type"] === "1");
				if(trafficList.length) {
					trafficTotal = trafficList[0]["bill_money"];
				}
				parkingList = res1.filter(item => item["bill_type"] === "6");
				if(parkingList.length) {
					parkingTotal = parkingList[0]["bill_money"];
				}
				let total = parseFloat(trafficTotal) + parseFloat(parkingTotal);
				this.setData({ trafficTotal, parkingTotal, total });
			}
			this.setData({ trafficBill: res2 || [], parkingBill: res3 || [], loaded: true });
			hideLoading();
		} catch (error) {
			hideLoading();
			this.setData({ loaded: true });
			showToast(error.message || "系统繁忙");
		}
	},
	showMoreTrafficBill(){
		my.navigateTo({ url: "/pages/bill/bill-month/bill-month?type=1" });
	},
	showMoreParkingBill(){
		my.navigateTo({ url: "/pages/bill/bill-month/bill-month?type=6" });
	}
});

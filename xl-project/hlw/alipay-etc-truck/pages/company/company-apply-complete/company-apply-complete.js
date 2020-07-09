import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		current: "",
		target: "",
		signedId: "",
		maxSort: 0
	},
	async change(e){
		const idx = e.currentTarget.dataset.idx;
		if(idx === this.data.current) {
			return;
		}
		try {
			showLoading();
			let { result } = await APIs.companyConsumeQuery({ origin: "FINANCE" });
			if(result.length) {
				// 过滤符合条件的签约数组  应该是两条
				let list = result.filter(item => item["merchant_code"] === "2103" || item["merchant_code"] === "2001");
				// 返回当前排序大的一项 即当前选择的那一项
				let item = list.sort((a,b) => b["consume_sort"] - a["consume_sort"])[0];
				if(item["merchant_code"] === "2103" || (item["merchant_code"] === "2001" && item["channel_code"] === "ap_mybank_second_account")) {
					this.setData({ current: "day", maxSort: item["consume_sort"], signedId: item["signed_id"] });
				} else if(item["merchant_code"] === "2001" && item["channel_code"] === "ap_mybank_loan_account") {
					this.setData({ current: "week", maxSort: item["consume_sort"], signedId: item["signed_id"] });
				}
			}
			const params = {
				signed_id: this.data.signedId,
				consume_sort: this.data.maxSort
			};
			await APIs.companyConsumeSort(params);
			if(idx === "week") {
				this.setData({ current: "week" });
			} else {
				this.setData({ current: "day" });
			}
			hideLoading();
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	next(){
		my.reLaunch({ url: "/pages/my/my" });
	},
	onLoad(options){
		this.setData({ target: options.target });
		if(options.target === "week") {
			this.setData({ current: "week" });
		} else {
			this.setData({ current: "day" });
		}
	},
});

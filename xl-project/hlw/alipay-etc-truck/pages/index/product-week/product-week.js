import {
	hideLoading,
	showConfirm,
	showLoading,
	showTitledAlert,
	showToast,
	trimAll,
	ftDate
} from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();

Page({
	data: {
		creditLimit: "",
		serialno: "",
		activeIndex: 3,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		sign_id: "",
		intentionProduct: ""
	},
	showProtocol(){
		let time = ftDate();
		app.globalData.sign_str = `https://preset.etcsd.com/bank/mybank/html/protocol/bank-mybank.html?time=${ time }`;
		my.navigateTo({
			url: "/pages/index/w-v/w-v"
		});
	},
	async next(){
		try {
			showLoading();
			const params = {
				intention_product: this.data.intentionProduct
			};
			await APIs.productIntention(params);
			let pamefree = {
				serialno: this.data.serialno,
				sign_id: this.data.signed_id,
				type: "open"
			};
			await APIs.DensityFree(pamefree);
			hideLoading();
			my.navigateTo({
				url: "/pages/index/apply-complete/apply-complete?target=week"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	},
	async onLoad(option){
		this.setData({ intentionProduct: option.intention_product });
		try {
			showLoading();
			let { result } = await APIs.customerQuery();
			this.setData({ serialno: result.serialno });
			this.setData({ signed_id: result.signed_id });
			let pamrm = {
				serialno: result.serialno,
			};
			let res = await APIs.creditQuery(pamrm);
			if(res.result.credit_result === "ACCEPTED") {
				this.setData({ creditLimit: res.result.credit_limit });
			}
			hideLoading();
		} catch (error) {
			hideLoading();
			console.log(error);
			showTitledAlert(error.message);
		}
	}
});
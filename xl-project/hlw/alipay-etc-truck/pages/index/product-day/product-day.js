import { hideLoading, showLoading, showToast, ftDate, showTitledAlert } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();

Page({
	data: {
		amount: 2000,
		activeIndex: 3,
		Noapaneseknot: false,
		items: [ {
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		} ],
		DensityOption: ""
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
				intention_product: this.data.DensityOption
			};
			await APIs.productIntention(params);
			let { result } = await APIs.customerQuery();
			const params2 = {
				serialno: result.serialno,
				sign_id: result.signed_id,
				type: "open"
			};
			await APIs.DensityFree(params2);
			hideLoading();
			//网商信用卡面保证金日结
			if(this.data.DensityOption === "74" || this.data.DensityOption === "75") {
				my.navigateTo({
					url: "/pages/my/my"
				});
				return;
			}
			if(result.bank_code === "MYBANK") {
				my.navigateTo({
					url: "/pages/index/apply-deposit/apply-deposit"
				});
				return;
			}
			if(result.bank_code === "CCB") {
				my.navigateTo({
					url: "/pages/index/ccb-deposit/ccb-deposit"
				});
				return;
			}
			my.navigateTo({
				url: "/pages/index/other-deposit/other-deposit"
			});
		} catch (error) {
			console.log(error);
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async onLoad(option){
		this.setData({ DensityOption: option.intention_product });
		if(this.data.DensityOption === "74" || this.data.DensityOption === "75") {
			this.setData({ Noapaneseknot: true });
		}
	}
});

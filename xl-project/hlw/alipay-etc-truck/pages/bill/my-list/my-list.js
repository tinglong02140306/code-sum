import { hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();
Page({
	data: {

		list: [],
		nunm: "",
		addFlag: true
	},
	addCar(){
		app.globalData.appendCar = "true";
		my.navigateTo({
			url: "/pages/index/car-info/car-info",
		});
	},
	onShow(){
		showLoading();
		// APIs.LineOfCredit().then((res) => {
		//   console.log(res, 19)
		//   this.setData({ addcar: true })
		//   if (res.result == "TRUE") {
		//       this.setData({ addcar: true })
		//   } else {
		//       this.setData({ addcar: false })
		//   }
		//   hideLoading();
		// }).catch(error => {
		//   hideLoading();
		//   console.log(error);
		//   showToast(error.message);
		// });
		let parem = {
			query_type: "4"
		};
		APIs.listCar(parem).then((res) => {
			console.log(res, 35);
			if(res.result == "") {
				this.setData({ nunm: 0 });
			} else {
				let num = res.result.length;
				this.setData({ nunm: num });
				this.setData({ list: res.result });
			}
			hideLoading();
			console.log(this.data.list, 27);
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	active(e){
		const vlp = e.currentTarget.dataset.vlp;
		const vlpc = e.currentTarget.dataset.vlpc;
		app.globalData.activeInfo = {
			vlp,
			vlpc
		};
		my.navigateTo({
			url: "/pages/my/active/active"
		});
	},
	async onLoad(){
		const { data: curApplyType } = my.getStorageSync({ "key": "curApplyType" });
		let res;
		if(curApplyType === "enterprise") {
			res = await APIs.companyInfoQuery();
		} else {
			res = await APIs.customerQuery();
		}
		let result = res.result;
		if(result.intention_product === "55" || result.intention_product === "61" || result.intention_product === "56" || result.intention_product === "62") {
			this.setData({ addFlag: false });
			// hideLoading();
			// my.navigateTo({
			// 	url: "/pages/bill/my-list/my-list"
			// });
		}
	}
});

import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";

const app = getApp();


Page({
	data: {
		list: [],
		loaded: false
	},
	addNew(){
		app.companyData.companyUuidAddress = "";
		my.navigateTo({
			url: "/pages/company/company-add-address/company-add-address"
		});
	},
	edit(e){
		const idx = e.currentTarget.dataset.idx;
		app.companyData.companyUuidAddress = this.data.list[idx];
		my.navigateTo({
			url: "/pages/company/company-add-address/company-add-address"
		});
	},
	getList(){
		showLoading();
		APIs.addressQuery().then(({ result }) => {
			let list = [];
			if(result && result.length) {
				result.forEach(item => {
					let tmp = {};
					tmp.uuid_address = item["uuid_address"];
					tmp.addressee = item["addressee"];
					tmp.receive_province = item["receive_province"];
					tmp.receive_city = item["receive_city"];
					tmp.receive_area = item["receive_area"];
					tmp.receive_address = item["receive_address"];
					tmp.addressee_mobile = item["addressee_mobile"];
					list.push(tmp);
					tmp = null;
				});
			}
			this.setData({ list, loaded: true });
			hideLoading();
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	select(e){
		const idx = e.currentTarget.dataset.idx;
		app.companyData.companyUuidAddress = this.data.list[idx];
		setTimeout(() => {
			my.navigateBack();
		}, 50);
	},
	onShow(){
		this.getList();
	}
});

import { showToast, showTitledAlert, trimAll } from "../../../utils/util";


const app = getApp();
Page({
	data: {
		companyName: "",
		loaded: true
	},
	onItemInput(e){
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onClear(e){
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	next(){
		if(!trimAll(this.data.companyName)) {
			showToast("请输入完整企业名称");
			return;
		}
		app.companyData.companyName = trimAll(this.data.companyName);
		my.navigateTo({
			url: "/pages/company/company-info/company-info"
		});
	}
});

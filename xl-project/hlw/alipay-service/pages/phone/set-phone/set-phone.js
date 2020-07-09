import { showToast, trimAll, showLoading, hideLoading, } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();
Page({
	data: {
		mobile: "",
	},
	bindKeyInput(e){
		this.setData({
			mobile: e.detail.value
		});
	},
	// bindKeyInput(e){
	// 	const item = e.detail;
	// 	this.setData({ [item["key"]]: item["val"] });
	// },
	// clear(e) {
	// 	const item = e.detail;
	// 	this.setData({ [item["key"]]: "" });
	// },
	next(){
		if(trimAll(this.data.mobile).length !== 11) {
			showToast("输入手机号有误，请检查");
			return;
		}
		showLoading();
		APIs.sendMsg({ mobile: trimAll(this.data.mobile) }).then(() => {
			hideLoading();
			console.log('触发',this.data.mobile)
			my.navigateTo({
				url: "/pages/phone/send-msg/send-msg?mobile=" + trimAll(this.data.mobile)
			});
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	}
});
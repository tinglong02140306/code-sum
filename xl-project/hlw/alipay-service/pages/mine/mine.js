import { showToast, showLoading, hideLoading, getLoginState } from "../../utils/util";
import { login } from "../../utils/request";
import APIs from "../../apis/index";

const app = getApp();
Page({
	data: {
		userInfo: "",
		cardType: []
	},
	async next(e){
		if(!await getLoginState()) {
			showToast("请先登录");
			return;
		}
		const { idx } = e.currentTarget.dataset;
		const mobile = this.data.userInfo["mobile"];
		let url;
		if(idx === "mineEtc") {
			url = "/pages/bill/bill-card/bill-card";
		}
		if(idx === "bindPhone") {
			if(mobile) {
				url = "/pages/phone/check-phone/check-phone";
			} else {
				url = "/pages/phone/set-phone/set-phone";
			}
		}
		my.navigateTo({
			url
		});
	},
	onAuthError(){
		showToast("请授权小程序获取您的基本信息");
	},
	onGetAuthorize(res){
		showLoading();
		login().then(({ data: { auth_token: token, user_info: userInfo, card_type: cardType } }) => {
			this.setData({ userInfo, cardType: cardType || [] });
			my.setStorageSync({ "key": "userInfo", "data": userInfo });
			my.setStorageSync({ "key": "token", data: token });
			my.setStorageSync({ key: "cardType", data: cardType });
			hideLoading();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	async onShow(){
		const userInfo = my.getStorageSync({ key: "userInfo" })["data"] || "";
		const cardType = my.getStorageSync({ key: "cardType" })["data"] || [];
		if(userInfo) {
			this.setData({ userInfo, cardType });
		}
	}
});
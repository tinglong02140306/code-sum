
const app = getApp();
Page({
	data: {
		mobile: "",
	},
	next(){
		my.redirectTo({
			url: "/pages/phone/set-phone/set-phone"
		});
	},
	onShow(){
		const userInfo = my.getStorageSync("userInfo");
		if(userInfo) {
			this.setData({ mobile: userInfo["mobile"] });
		}
	}
});
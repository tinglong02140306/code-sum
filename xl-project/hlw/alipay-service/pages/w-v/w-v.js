const app = getApp();

Page({
	data: {
		src: ""
	},
	onLoad(){
		let src = app.globalData.url;
		let timestamp = new Date().getTime();
		if(src.indexOf("?") >= 0) {
			src = src + "&t=" + timestamp;
		} else {
			src = src + "?t=" + timestamp;
		}
		this.setData({ src });
	},
});

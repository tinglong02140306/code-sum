import { showTitledAlert } from "../../../utils/util";

const app = getApp();

Page({
	data: {},
	onLoad(options) {
		const { target } = options;
		if (target === "credit") {
			app.globalData.extraUrl = "http://www.baidu.com";
		}
		my.navigateTo({
			url: "/pages/index/w-v/w-v"
		});
	},
});

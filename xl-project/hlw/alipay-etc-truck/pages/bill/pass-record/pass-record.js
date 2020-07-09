import {billStateMap} from "../../../utils/mapUtils";

const app = getApp();


Page({
	data: {
		passInfo: {}
	},
	onLoad(options) {
		this.setData({passInfo: app.globalData.billDetail,billStateMap});
    console.log(this.data.passInfo,"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\")
	}
});

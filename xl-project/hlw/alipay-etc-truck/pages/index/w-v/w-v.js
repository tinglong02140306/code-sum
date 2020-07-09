import {showTitledAlert} from "../../../utils/util";

const app = getApp();

Page({
	data: {
		status: '',
		src: ''
	},
	onLoad(options) {
		const src = app.globalData.sign_str;
		if(src){
			this.setData({src});
			return;
		}
	
	},
	
});

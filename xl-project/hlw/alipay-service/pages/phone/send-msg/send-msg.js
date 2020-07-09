import { showToast, showLoading, hideLoading, showTitledAlert } from "../../../utils/util";
import APIs from "../../../apis/index";

let interval = "";

const app = getApp();
Page({
	data: {
		curIndex: 0,
		numList: ["", "", "", "", "", ""],
		enableSmallButton: true,
		smallButtonClickTimes: 0,
		mobile: "",
	},
	onLoad(options){
		this.setData({ mobile: options["mobile"] });
		showToast("发送成功！",1500,"success")
		this.countDown();
	},
	sendCode(){
		clearInterval(interval);
		showLoading();
		APIs.sendMsg({ mobile: this.data.mobile }).then(() => {
			hideLoading();
			showToast("发送成功！",1500,"success")
			this.countDown();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	// 验证码倒计时
	countDown(){
		this.setData({
			enableSmallButton: false,
			smallButtonText: "重新发送(60)"
		});
		let count = 60;
		interval = setInterval(() => {
			count--;
			if(count > 0) {
				this.setData({
					smallButtonText: `重新发送(${ count })`
				});
			} else {
				clearInterval(interval);
				this.setData({
					enableSmallButton: true,
					smallButtonText: `重新发送`
				});
			}
		}, 1000);
	},
	update(){
		showLoading();
		const mobile = this.data.mobile;
		const params = {
			captcha: this.data.numList.join(""),
			mobile: mobile,
		};
		APIs.msgValid(params).then((res) => {
			let userInfo = my.getStorageSync("userInfo");
			userInfo["mobile"] = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
			my.setStorageSync("userInfo", userInfo);
			hideLoading();
			showToast("绑定成功",3000,"success")
			setTimeout(() => {
				my.navigateBack({ delta: 2 })
			}, 2000);
			// showTitledAlert("您的手机号已设置成功").then(() => my.navigateBack({ delta: 2 }));
		}).catch(err => {
			hideLoading();
			showToast(err.message);
		});
	},
	clickNum(e){
		const { num } = e.currentTarget.dataset;
		let { numList, curIndex } = this.data;
		numList[curIndex] = num;
		curIndex < 5 ? curIndex++ : curIndex = 5;
		this.setData({ numList, curIndex });
		if(numList.every(item => item !== "")) {
			this.update();
		}
	},
	inputNum(e){
		this.setData({ curIndex: e.currentTarget.dataset.idx });
	},
	delete(){
		let { numList, curIndex } = this.data;
		numList[curIndex] === "" ? curIndex-- : numList[curIndex] = "";
		// if(numList[curIndex] === "") {
		// 	curIndex--;
		// } else {
		// 	numList[curIndex] = "";
		// }
		this.setData({ numList, curIndex });
	}
});
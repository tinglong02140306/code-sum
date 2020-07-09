import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast, showTitledAlert } from "../../../utils/util";

const app = getApp();
Page({
	data: {
		ready: false,
		icbc: false,
		ccb: false,
		abc: false,
		more: false,
		ws: false,
		list: [],
		loaded: true,
		activeIndex: 3,
		Other: false,
		ProvincialAbc: false,
		OtherWs: false,
		source: "",
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
	},
	addWsListener(){
		const name = "NEBULANOTIFY_mybank_tinyApp_openAccount";
		my.call("removeNotifyListener", {
			name,
		}, () => {
			my.call("addNotifyListener", {
				name,
			}, (res) => {
				// 开户成功
				if(!res.error) {
					console.log("网商开户成功");
					this.setData({ signed: true });
				} else {
					this.setData({ loaded: true });
					my.alert({
						content: "开户失败"
					});
				}
			});
		});
	},
	afterSignWs(){
		my.navigateTo({
			url: "/pages/index/sign-credit-apply/sign-credit-apply"
		});
	},
	showMore(){
		this.setData({ more: true });
	},
	hideMore(){
		this.setData({ more: false });
	},
	// 网商银行 跳转到网商银行开户
	signWs(){
		console.log("signWs");
		app.globalData.bank_code = "MYBANK";
		this.addWsListener();
		my.navigateToMiniProgram({
			appId: "77700195",
			path: "pages/index/index",
			extraData: {
				from: "etcsd"
			},
			success: res => {
				this.setData({ loaded: false });
				console.log(res);
			},
			fail: res => {
				showTitledAlert("跳转到网商银行错误！");
				console.error(res);
			}
		});
	},
	signIcbc(){
		app.globalData.bank_code = "ICBC";
		my.navigateTo({
			url: "/pages/index/sign-icbc/sign-icbc"
		});
	},
	signAbc(){
		app.globalData.bank_code = "ABC";
		my.navigateTo({
			url: "/pages/index/sign-abc/sign-abc"
		});
	},
	signCcb(){
		app.globalData.bank_code = "CCB";
		my.navigateTo({
			url: "/pages/index/sign-ccb/sign-ccb"
		});
	},
	onLoad(){
		//	查询是否已开户  已开户调用成功签约结果通知
		APIs.customerQuery().then((res) => {
			this.setData({ source: res.result.source });
			let channel = this.data.source;
			if(channel == 68) { //农行的
				this.setData({ abc: true });
			} else if(channel == 67 || channel == "82" || channel == "86" || channel == "14" || channel == "92" || channel == "95" || channel == "98") { //工商的    e高速渠道
				this.setData({ icbc: true });
			} else if(channel == "73" || channel == "83" || channel == "87" || channel == "93" || channel == "96" || channel == "99") { // 建行的
				this.setData({ ccb: true });
			} else if(channel == "74") { //路哥
				this.setData({ ws: true });
			} else if(channel == "77" || channel == "5") {//自营地推77 满易网5
				this.setData({ Other: true });
				const carList = app.globalData.carList;
				//校验的是鲁牌的车辆
				let carListABC = carList.filter(item => {
					return item.vlp[0] === "鲁";
				});
				let carListBlue = carList.filter(item => {
					return item.vlpc === "0";
				});
				if(carListABC && carListABC.length) {
					if(carListBlue && carListBlue.length) {
						this.setData({ OtherWs: true });
						this.setData({ abc: true });
					} else {
						this.setData({ abc: true });
					}
				} else if(carListBlue && carListBlue.length) {
					this.setData({ OtherWs: true });
				}
			} else {
				//校验的是蓝牌的车辆
				const carList = app.globalData.carList;
				let carListBlue = carList.filter(item => {
					return item.vlpc === "0";
				});
				let carListABC = carList.filter(item => {
					return item.vlp[0] === "鲁";
				});
				if(carListBlue && carListBlue.length) {
					if(carListABC && carListABC.length) {
						this.setData({ icbc: true });
						this.setData({ ccb: true });
						this.setData({ abc: true });
					} else {
						this.setData({ icbc: true });
						this.setData({ ccb: true });
					}
				} else if(carListABC && carListABC.length) {
					this.setData({ ProvincialAbc: false });
				} else {
					this.setData({ ProvincialAbc: true });
				}
			}
			this.setData({ ready: true });
		}).catch(error => {
			hideLoading();
			console.log(error);
			this.setData({ ready: true });
			showToast(error.message);
		});
	},
	onShow(){
		if(this.data.signed) {
			this.setData({ signed: false });
			this.afterSignWs();
		}
	}
});

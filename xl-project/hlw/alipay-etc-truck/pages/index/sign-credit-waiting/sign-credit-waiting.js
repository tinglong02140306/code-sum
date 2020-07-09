import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();
let interval = "";

Page({
	data: {
		activeIndex: 3,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		sendText: "",
		loaded: true,
		bankCode: ""
	},
	onUnload() {
		clearInterval(interval);
		if (interval) {
			my.setStorageSync({ key: "countNumber", data: this.data.sendText });
			const { data: count } = my.getStorageSync({ key: "countNumber" });
			console.log(count, 27)
		} else {
			my.removeStorageSync({ key: "countNumber" });
		}
	},
	onHide() {
		if (interval) {
			clearInterval(interval);
			my.setStorageSync({ key: "countNumber", data: this.data.sendText });
			const { data: count } = my.getStorageSync({ key: "countNumber" });
			console.log(count, 37)
		} else {
			my.removeStorageSync({ key: "countNumber" });
		}
	},
	countDown(count = 180) {
		interval = setInterval(() => {
			if (!this.data.loaded) {
				this.setData({ loaded: true });
			}
			this.setData({ sendText: `${count}` });
			count--;
			if (count % 10 == "0") {
				const serialno = app.globalData.serialno;
				console.log(serialno, "++++++++++++++++++++")
				let parem = {
					serialno: serialno
				}
				APIs.creditQuery(parem).then((res) => {
					hideLoading();
					if (res.result.credit_result == "REFUSED") {
						if (this.data.bankCode == "CCB") {
							my.navigateTo({
								url: `/pages/index/sign-result/sign-result?status=day&intention_product=${res.result.intention_product}`
							});
						} else {
							my.navigateTo({
								url: `/pages/index/sign-result/sign-result?status=day&intention_product=${res.result.intention_product}`
							});
						}
						clearInterval(interval);
						return;

					} else if (res.result.credit_result == "ACCEPTED") {
						my.navigateTo({
							url: `/pages/index/sign-result/sign-result?status=week&intention_product=${res.result.intention_product}`
						});
						clearInterval(interval);
						return;
					} else if (res.result.credit_result == "WAIT") {

					}
				}).catch(error => {
					hideLoading();
					console.log(error);
					showToast(error.message);
				});
				console.log("1111")
			}
			console.log(count, 61)
			if (count < 1) {
				clearInterval(interval);
				my.removeStorageSync({ key: "countNumber" });
				my.navigateTo({
					url: `/pages/index/sign-credit-result/sign-credit-result`
				});
			}

		}, 1000);
	},
	async onShow() {
		let { result } = await APIs.customerQuery();
		this.setData({ bankCode: result.bank_code })
		// this.countDown();
		clearInterval(interval);
		const { data: count } = my.getStorageSync({ key: "countNumber" });
		console.log(count, 76)
		if (count) {
			console.log("11111")
			this.countDown(count);

		} else {
			console.log("22222")
			this.countDown();
		}
	}
});

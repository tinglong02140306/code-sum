import APIs from "../../../apis/index";
import { hideLoading, isValidIdNum, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		cardNo: "",
		userName: "",
		certNo: "",
	},
	bindKeyInput(e){
		const item = e.detail;
		this.setData({ [item["key"]]: item["val"] });
	},
	clear(e){
		const item = e.detail;
		this.setData({ [item["key"]]: "" });
	},
	check(){
		if(!trimAll(this.data.cardNo) || trimAll(this.data.cardNo).length !== 20) {
			showToast("请输入20位ETC卡号");
			return false;
		}
		if(!trimAll(this.data.userName)) {
			showToast("请输入ETC卡用户名称");
			return false;
		}
		if(!trimAll(this.data.certNo)) {
			showToast("请输入证件号码");
			return false;
		}
		if(!isValidIdNum(trimAll(this.data.certNo))) {
			showToast("请输入正确的证件号码");
			return false;
		}
		return true;
	},
	submit(){
		if(!this.check()) {
			return;
		}
		showLoading();
		const params = {
			card_id: trimAll(this.data.cardNo),
			username: trimAll(this.data.userName),
			cert_no: trimAll(this.data.certNo)
		};
		APIs.bindCard(params).then(() => {
			hideLoading();
			showTitledAlert("绑定成功").then(() => {
				APIs.getCardType().then(res => {
					my.setStorageSync("cardType", res.data || []);
					my.navigateBack();
				}).catch(error => {
					console.log(error);
					my.navigateBack();
				});
			});
		}).catch(error => {
			hideLoading();
			showToast(error.message || "系统繁忙");
		});
	}
});

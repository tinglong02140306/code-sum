import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast, trimAll } from "../../../utils/util";
import address from "../../../utils/address";

const app = getApp();


Page({
	data: {
		receiver: "",
		telNumber: "",
		region: [],
		detail: ""
	},
	onItemInput(e){
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onClear(e){
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	selectRegion(){
		my.multiLevelSelect({
			title: "选择收货地址",//级联选择标题
			list: address,
			success: ({ result }) => {
				this.setData({ region: [result[0]["name"], result[1]["name"], result[2]["name"]] });
			}
		});
	},
	checkParams(){
		let reg = /^[\u2E80-\uFE4F\w.+()\-#·\[\]]+$/;
		if(!trimAll(this.data.receiver)) {
			showToast("请填写收货人");
			return false;
		}
		if(!reg.test(trimAll(this.data.receiver))) {
			showToast("收货人姓名不能包含特殊字符");
			return false;
		}
		if(!trimAll(this.data.telNumber)) {
			showToast("请填写收货人手机号");
			return false;
		}
		if(trimAll(this.data.telNumber).length !== 11) {
			showToast("手机号格式不正确");
			return false;
		}
		if(this.data.region.length !== 3) {
			showToast("请选择地区");
			return false;
		}
		if(!trimAll(this.data.detail)) {
			showToast("请填写收货人详细地址");
			return false;
		}
		if(!reg.test(trimAll(this.data.detail))) {
			showToast("收货人详细地址不能包含特殊字符");
			return false;
		}
		if(trimAll(this.data.detail).length > 32) {
			showToast("收货人详细地址超长");
			return false;
		}
		return true;
	},
	save(){
		if(!this.checkParams()) {
			return;
		}
		let params = {
			addressee: this.data.receiver,
			addressee_mobile: this.data.telNumber,
			address: this.data.detail,
			receive_province: this.data.region[0],
			receive_city: this.data.region[1],
			receive_area: this.data.region[2],
			receive_address: this.data.detail
		};
		if(app.companyData.companyUuidAddress) {
			params = {
				uuid_address: app.companyData.companyUuidAddress["uuid_address"],
				...params,
			};
		}
		showLoading();
		if(app.companyData.companyUuidAddress) {
			APIs.addressUpdate(params).then(() => {
				app.companyData.companyUuidAddress = "";
				hideLoading();
				showToast("添加成功");
				setTimeout(() => {
					my.navigateBack();
				}, 1500);
			}).catch(error => {
				hideLoading();
				console.log(error);
				showToast(error.message);
			});
		} else {
			APIs.addressAdd(params).then(() => {
				app.companyData.companyUuidAddress = "";
				hideLoading();
				showToast("添加成功");
				setTimeout(() => {
					my.navigateBack();
				}, 1500);
			}).catch(error => {
				hideLoading();
				console.log(error);
				showToast(error.message);
			});
		}
	},
	onLoad(){
		const addressInfo = app.companyData.companyUuidAddress;
		if(addressInfo) {
			this.setData({
				receiver: addressInfo["addressee"],
				telNumber: addressInfo["addressee_mobile"],
				region: [addressInfo["receive_province"], addressInfo["receive_city"], addressInfo["receive_area"]],
				detail: addressInfo["receive_address"]
			});
		}
	}
});

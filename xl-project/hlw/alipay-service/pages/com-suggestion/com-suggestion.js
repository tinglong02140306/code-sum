import {
	selectImg,
	showToast,
	showLoading,
	hideLoading,
	trimAll, showTitledAlert, getLoginState, uploadImg
} from "../../utils/util";
import APIs from "../../apis/index";
import { login } from "../../utils/request";

const app = getApp();

Page({
	data: {
		items: [
			{ name: "0", value: "业务办理结果投诉" },
			{ name: "1", value: "客服态度问题投诉" },
			{ name: "2", value: "其他投诉" },
		],
		focus: false,
		max: 300,
		// 当前输入字数
		currentWordNum: 0,
		phone: "",
		imgUrl: [],
		// 投诉类型
		style: "",
		// 投诉内容
		content: "",
		logined: false
	},
	bindKeyInput (e) {
		this.setData({
			phone: e.detail.value
		})
	},
	//类型选择
	radioChange(e){
		this.setData({
			style: e.detail.value,
		});
	},
	// 字数控制 
	bindTap(e){
		// 获取输入框的内容
		var content = e.detail.value;
		// 获取输入框内容的长度
		var len = parseInt(content.length);
		this.setData({
			currentWordNum: len //当前字数
		});
		//最多字数限制
		if(len > this.data.max) return;
		this.setData({
			content: content,
		});
	},
	onAuthError(){
		showToast("请授权小程序获取您的基本信息");
	},
	onGetAuthorize(){
		showLoading();
		login().then(({ data: { auth_token: token, user_info: userInfo, card_type: cardType } }) => {
			this.setData({ userInfo, cardType: cardType || [], logined: true });
			my.setStorageSync({ "key": "userInfo", "data": userInfo });
			my.setStorageSync({ "key": "token", data: token });
			my.setStorageSync({ key: "cardType", data: cardType });
			hideLoading();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	async upload(){
		const curNum = this.data.imgUrl.length;
		let oldImgs = this.data.imgUrl;
		try {
			let imgUrl = await selectImg(3 - curNum);
			imgUrl = [...oldImgs, ...imgUrl];
			this.setData({
				imgUrl
			});
			hideLoading();
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	imgPreview(e){
		const { idx } = e.currentTarget.dataset;
		my.previewImage({
			urls: this.data.imgUrl,
			current: this.data.imgUrl[idx]
		});
	},
	deleteImg(e){
		const idx = e.currentTarget.dataset.idx;
		let { imgUrl } = this.data;
		imgUrl.splice(idx, 1);
		this.setData({ imgUrl });
	},
	checkParams(){
		if(!trimAll(this.data.style)) {
			showToast("请选择您要投诉的类型");
			return false;
		}
		if(!trimAll(this.data.content)) {
			showToast("请填写您要投诉的内容");
			return false;
		}
		if(this.data.phone) {
			if(!trimAll(/^8[0-9]{3}$/.test(this.data.phone))) {
				showToast("请输入正确的客服工号");
				return false;
			}
		}
		return true;
	},
	uploadImgFiles(){
		return new Promise(async (resolve, reject) => {
			try {
				const imgs = this.data.imgUrl;
				let result = await uploadImg(imgs) || [];
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
	},
	async next(){
		if(!this.checkParams()) {
			return;
		}
		try {
			showLoading();
			let imgBase64 = [];
			if(this.data.imgUrl) {
				imgBase64 = await this.uploadImgFiles();
				console.log(imgBase64);
			}
			const params = {
				type: "1",
				clazz: this.data.style,
				content: this.data.content,
				attachments: imgBase64,
				contact: trimAll(this.data.phone),
			};
			await APIs.infoSubmit(params);
			hideLoading();
			showToast("建议发送成功");
			setTimeout(() => {
				my.navigateBack();
			}, 2000);
		} catch (e) {
			hideLoading();
			showTitledAlert(e.message);
		}
	},
	async onLoad(){
		this.setData({ logined: await getLoginState() });
	}
});

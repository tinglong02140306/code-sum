import { showToast, showLoading, hideLoading, getLoginState } from "../../utils/util";
import APIs from "../../apis/index";
import { login } from "../../utils/request";

const app = getApp();
Page({
	data: {
		list: [],
		page: 1,
		readStatus: "",
		loaded: true,
		logined: false,
		totalPage: 0
	},
	showDetail(e){
		const { id: msgId, item } = e.currentTarget.dataset;
		let list = this.data.list;
		if(item["msg_type"] === "1") {
			APIs.msgInfo({ msg_id: msgId, msg_type: item["msg_type"] }).then(({ data: { notice } }) => {
				if(item["read_status"] !== "1") {
					item["read_status"] = "1";
					list.splice(list.findIndex(item => item["msg_id"] == msgId), 1, item);
					this.setData({ list });
				}
				app.globalData.url = notice.url;
				my.navigateTo({ url: "/pages/w-v/w-v" });
			}).catch(error => showToast(error.message));
			return;
		}
		if(item["read_status"] !== "1") {
			item["read_status"] = "1";
			list.splice(list.findIndex(item => item["msg_id"] == msgId), 1, item);
			this.setData({ list });
		}
		my.navigateTo({
			url: "/pages/problem/suggest/suggest?msgId=" + msgId + "&msgType=" + item["msg_type"]
		});
	},
	readAll(){
		showLoading();
		APIs.readAll().then(() => {
			this.setData({ page: 1,list: [] });
			this.getMsgList();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	clickTap(e){
		const idx = e.currentTarget.dataset.idx;
		this.setData({
			readStatus: idx,
			page: 1,
			list: []
		});
		setTimeout(() => this.getMsgList(), 0);
	},
	getMsgList(){
		let curPage = this.data.page;
		let params = {
			read_status: this.data.readStatus,
			page: curPage,
			per_num: "10",
		};
		showLoading();
		APIs.msgList(params).then(({ data: res }) => {
			let list = this.data.list;
			const totalPage = res["total"] || 0;
			this.setData({ totalPage });
			if(res["list"]) {
				list = [...list, ...res["list"]];
			}
			if(curPage <= totalPage) {
				curPage++;
			}
			this.setData({ list, page: curPage, loaded: true });
			hideLoading();
		}).catch(err => {
			hideLoading();
			this.setData({ loaded: true });
			showToast(err.message);
		});
	},
	scrollToLower(e){
		if(this.data.page > this.data.totalPage) return;
		setTimeout(() => this.getMsgList(), 0);
	},
	async onLoad(){
		this.setData({ logined: await getLoginState() });
		if(this.data.logined) {
			this.getMsgList();
		} else {
			this.setData({ loaded: true });
		}
	},
	async onGetUserInfo(e){
		showLoading();
		let userInfo = e.detail.userInfo || "";
		if(userInfo) {
			try {
				let res = await login();
				const { auth_token: token, user_info: userInfo, card_type: cardType } = res.data;
				this.setData({ userInfo, logined: true });
				my.setStorageSync("userInfo", userInfo);
				my.setStorageSync("token", token);
				my.setStorageSync("cardType", cardType);
				hideLoading();
				this.getMsgList();
			} catch (e) {
				hideLoading();
				showToast(e.message);
			}
		} else {
			hideLoading();
		}
	},
});
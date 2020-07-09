import { hideLoading, showLoading, showToast } from "../../utils/util";
import { login } from "../../utils/request";
import APIs from "../../apis/index";

const app = getApp();

Page({
	data: {
		list: [],
		problems: [],
		count: 0,
		userInfo: "",
		cardType: [],
		page: 2,
		totalPage: 1,
		loaded: false
	},
	onTap(e){
		app.globalData.url = e["url"];
		my.navigateTo({ url: "/pages/w-v/w-v" });
	},
	onRefresh(){
		showLoading();
		const params = { page: this.data.page, per_num: 3 };
		APIs.getProblemList(params).then(res => {
			this.setData({ problems: res.data.list });
			const curPage = this.data.page;
			if(curPage >= this.data.totalPage) {
				this.setData({ page: 1 });
			} else {
				this.setData({ page: parseInt(curPage) + 1 });
			}
			hideLoading();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	onSearch(){
		my.navigateTo({
			url: "/pages/search/search"
		});
	},
	onSuggest(){
		my.navigateTo({
			url: "/pages/pro-suggestion/pro-suggestion"
		});
	},
	onService(){
		my.navigateTo({
			url: "/pages/com-suggestion/com-suggestion"
		});
	},
	next(e){
		console.log(e);
		const { idx } = e.currentTarget.dataset;
		let url = "/pages/mine/mine";
		switch(idx) {
			case "msg":
				url = "/pages/news-list/news-list";
				break;
			case "apply":
				url = "/pages/problem/category/category?id=1";
				break;
			case "active":
				url = "/pages/problem/category/category?id=4";
				break;
			case "service":
				url = "/pages/problem/category/category?id=6";
				break;
			case "bill":
				url = "/pages/problem/category/category?id=5";
				break;
			case "my":
				url = "/pages/mine/mine";
				break;
		}
		my.navigateTo({
			url
		});
	},
	showDetail(e){
		const { item } = e.currentTarget.dataset;
		my.navigateTo({
			url: "/pages/problem/answer/answer?id=" + item["question_id"]
		});
	},
	onAuthError(){
		showToast("请授权小程序获取您的基本信息");
	},
	onGetAuthorize(){
		showLoading();
		login().then(({ data: { auth_token: token, user_info: userInfo, card_type: cardType } }) => {
			this.setData({ userInfo, cardType: cardType || [] });
			my.setStorageSync({ "key": "userInfo", "data": userInfo });
			my.setStorageSync({ "key": "token", data: token });
			my.setStorageSync({ key: "cardType", data: cardType });
			hideLoading();
		}).catch(error => {
			hideLoading();
			showToast(error.message);
		});
	},
	async onLoad(){
		try {
			const params = { page: 1, per_num: 3 };
			let [{ data: notices }, { data: problems }] = await Promise.all([APIs.getNotices(), APIs.getProblemList(params)]);
			this.setData({ list: notices, problems: problems.list, totalPage: problems.pages });
			this.setData({ loaded: true });
		} catch (e) {
			this.setData({ loaded: true });
			showToast(e.message);
		}
	},
	onShow(){
		const { data: token } = my.getStorageSync({ "key": "token" });
		const { data: userInfo } = my.getStorageSync({ "key": "userInfo" });
		const { data: cardType } = my.getStorageSync({ "key": "cardType" });
		if(token) {
			this.setData({ userInfo, cardType });
			const msgParams = { read_status: 0, page: 1, per_num: 3 };
			APIs.getMsgList(msgParams).then(({ data: msg }) => this.setData({ count: msg.total })).catch(error => console.log(error.message));
		}
	},
	bindCard(){
		my.navigateTo({
			url: "/pages/bill/bill-card/bill-card"
		});
	}
});

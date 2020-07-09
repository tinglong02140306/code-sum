import { hideLoading, showLoading, showToast, trimAll } from "../../utils/util";
import APIs from "../../apis/index";

Page({
	data: {
		inputValue: "",
		hotList: [],
		historyList: [],
		focused: true,
		result: [],
		hide: false
	},
	bindKeyInput(e){
		this.setData({
			inputValue: e.detail.value
		});
	},
	onFocus(){
		this.setData({ focused: true });
	},
	onBlur(){
		this.setData({ focused: false });
	},
	quickSearch(e){
		this.setData({ focused: false });
		setTimeout(() => {
			let { idx } = e.currentTarget.dataset;
			this.setData({ inputValue: idx });
			setTimeout((() => {
				// this.setData({ focused: false });
				this.search();
			}), 150);
		}, 50);
	},
	search(){
		this.setData({ hide: true });
		const searchStr = trimAll(this.data.inputValue);
		if(!trimAll(searchStr)) {
			showToast("请输入搜索内容");
			return;
		}
		this.setData({ result: [] });
		const historyList = my.getStorageSync({ "key": "historyList" })["data"] || [];
		console.log(historyList);
		let newList = historyList;
		if(newList.indexOf(searchStr) === -1) {
			if(historyList.length >= 3) {
				newList = historyList.slice(0, 2);
			}
			newList.unshift(trimAll(searchStr));
		}
		my.setStorageSync({ "key": "historyList", "data": newList });
		this.setData({ historyList: newList });
		showLoading();
		const params = { page: 1, per_num: 99, question: trimAll(searchStr) };
		APIs.getProblemList(params).then(({ data: res }) => {
			hideLoading();
			this.setData({ result: res && res.list || [], focused: false });
		}).catch(error => {
			hideLoading();
			this.setData({ focused: true });
			showToast(error.message);
		});
	},
	select(e){
		const { idx } = e.currentTarget.dataset;
		const result = this.data.result;
		my.navigateTo({
			url: "/pages/problem/answer/answer?id=" + result[idx]["question_id"]
		});
	},
	onLoad(){
		const { data: historyList } = my.getStorageSync({ "key": "historyList" });
		if(historyList) {
			this.setData({ historyList });
		}
		APIs.getHotList().then(res => {
			this.setData({ hotList: res.data });
		}).catch(error => {
			console.log(error.message);
		});
	}
});

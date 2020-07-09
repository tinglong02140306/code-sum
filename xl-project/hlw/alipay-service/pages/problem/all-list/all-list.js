import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";

const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        problems: [],
        noMore: false,
        page: 1,
        totalPage: 0,
        class1: "",
        class2: "",
        questionId: ""
    },
    // 数据加载
    loadData() {
        let curPage = this.data.page;
        let params = {
            class1: this.data.class1,
            class2: this.data.class2,
            question: "",
            page: curPage,
            per_num: 10
        };
        showLoading();
        APIs.getProblemList(params).then(({ data: res }) => {
            let list = this.data.problems;
            const totalPage = res["pages"];
            this.setData({ totalPage: totalPage });
            if (res["list"]) {
                list = [...list, ...res["list"]];
            }
            if (curPage <= totalPage) {
                curPage++;
            }
            this.setData({ problems: list, page: curPage });
            setTimeout(() => {
                this.setData({ loaded: true });
            }, 200);
            hideLoading();
        }).catch(err => {
            hideLoading();
            setTimeout(() => {
                this.setData({ loaded: true });
            }, 200);
            showToast(err.message);
        });
    },
    /**
     * 上滑加载更多
     */
    scrollToLower(e) {
        if (this.data.page > this.data.totalPage) return;
        setTimeout(() => this.loadData(), 0);
    },
    /**
     * 查看问题答案
     */
    viewAnswer(e) {
        console.log(1)
        my.navigateTo({
            url: "/pages/problem/answer/answer?id=" + e.currentTarget.dataset.id
        });
    },
    onLoad(options) {
        console.log(options);
        this.setData({
            class1: options.class1,
            class2: options.class2 || ""
        });
        setTimeout(() => this.loadData(), 0);
    }
});
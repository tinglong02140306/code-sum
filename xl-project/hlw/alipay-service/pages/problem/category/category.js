import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";

const app = getApp();
Page({
    data: {
        typeList: ["申请办理", "设备领取", "设备安装", "设备激活", "账单明细", "ETC使用"],
        curIndex: 0,
        problems: [],
        toView: "",
        loaded: false,
        page: 1,
        totalPage: 1,
        preIndex: 0
    },
    // 问题列表接口
    getListData() {
        let params = {
            class1: parseInt(this.data.curIndex) + 1,
            page: 1,
            per_num: this.data.curIndex == "3" ? 50 : 15
        };
        showLoading();
        APIs.problemList(params).then(({ data: res }) => {
            let list = [];
            res = res.list || [];
            if (this.data.curIndex != "3") {
                // list = res.slice(0, 5);
                list = [...list, ...res]
            } else {
                list = [...list, ...res.filter(item => item["class2"] === "1").slice(0, 5)];
                list = [...list, ...res.filter(item => item["class2"] === "2").slice(0, 5)];
            }
            this.setData({ problems: list });
            setTimeout(() => {
                this.setData({ loaded: true });
            }, 200);
            hideLoading();
        }).catch(err => {
            hideLoading();
            this.setData({ loaded: true });
            showToast(err.message);
        });

    },
    // tab点击事件
    tabOn(e) {
        let curIndex = e.currentTarget.dataset.index,
            preIndex = this.data.preIndex,
            id;

        this.setData({
            curIndex: curIndex,
            page: 1,
            problems: []
        });
        if (preIndex > curIndex && curIndex == 3) {
            id = "tab2";
        } else if (preIndex > curIndex && curIndex == 2) {
            id = "tab1"
        } else if (preIndex > curIndex && curIndex == 1) {
            id = "tab0"
        } else {
            id = "tab" + (parseInt(this.data.curIndex));
        }
        this.setData({
            toView: id,
            preIndex: curIndex
        });
        setTimeout(() => this.getListData(), 50);
    },
    /**
     * 查看问题答案
     */
    viewAnswer(e) {
        const { id } = e.currentTarget.dataset;
        my.navigateTo({
            url: "/pages/problem/answer/answer?id=" + id
        });
    },
    /**
     * 查看全部
     */
    viewAllList(e) {
        let { class1, class2 } = e.currentTarget.dataset;
        class1 = class1 || parseInt(this.data.curIndex) + 1;
        let url = "/pages/problem/all-list/all-list?class1=" + class1;
        if (class2) {
            url += "&class2=" + class2;
        }
        my.navigateTo({
            url
        });
    },
    onLoad(options) {
        const { id } = options;
        console.log(options);
        this.setData({
            childW: this.data.typeList.length * 250,
            curIndex: parseInt(id) - 1
        });
        setTimeout(() => {
            this.setData({
                toView: "tab" + (parseInt(id) - 1)
            });
            this.getListData();
        }, 200);
    },
});
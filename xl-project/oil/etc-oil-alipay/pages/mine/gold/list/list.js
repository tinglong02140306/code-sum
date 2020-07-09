// pages/person/refueling-gold/refueling-gold.js

import { getHttpPost } from "../../../../http/http";
import { accountApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let page_num = 1;
const Pagesize = 10;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEmpty: true,
        account_balance: 0.00,
        defaulted: false,
        balance_list: [],
        loadingState: '',
        isCanLoadMore: false,
        isShowBottom: false,
        last_list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        page_num = 1;
        this.getBalanceQuery();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        page_num = 1;
        this.getBalanceQuery();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        const {
            isCanLoadMore,
            last_list
        } = this.data;
        if (isCanLoadMore) { //加载更多
            page_num++;
            this.setData({
                loadingState: '正在加载中...'
            });
            this.getBalanceQuery();

        } else { //已加载全部
            this.setData({
                loadingState: last_list.length >= 5 ? '已加载全部' : '',
                isShowBottom: true
            });
        }

    },
    //设置加油金
    switchChange() {
        let defaulted = !this.data.defaulted;
        const params = {
            enabled: defaulted
        };
        showLoading("正在提交...");
        getHttpPost(accountApi.balanceSet, params, res => {
            if (res.result_code === "00000") {
                hideLoading();
                showToast("设置成功");
                this.setData({
                    defaulted: defaulted
                });
            } else {
                hideLoading();
                showToast(res.result_msg);
            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },
    // 获取加油金状态
    getBalanceState() {
        getHttpPost(accountApi.balanceState, {}, res => {
            const data = res.data;
            this.setData({
                account_balance: res.balance,
                defaulted: res.enabled,
            });
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },

    //查询加油金列表
    getBalanceQuery() {
        const params = {
            page_num: page_num,
            page_size: Pagesize,
        };
        showLoading("");
        getHttpPost(accountApi.balanceList, params, res => {
            my.stopPullDownRefresh();
            hideLoading();
            const data = res.data;
            this.getBalanceState();
            if (data && data.length >= Pagesize) { //允许加载更多
                this.setData({
                    isCanLoadMore: true,
                    isShowBottom: false,
                });
            } else { //不允许加载更多
                this.setData({
                    isCanLoadMore: false,
                    isShowBottom: true,
                });
            }
            if (page_num === 1) {
                this.setData({
                    balance_list: data,
                });
            } else {
                const dataList = this.data.balance_list.concat(data);
                this.setData({
                    balance_list: dataList,
                });
            }
            if (this.data.balance_list && this.data.balance_list.length) {
                this.setData({
                    isEmpty: false,
                });
            } else {
                this.setData({
                    isEmpty: true,
                })
            }

        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    }

});
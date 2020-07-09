// pages/person/etc/etc.js
import {formatSpaceId, formatTime, trim } from "../../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
import { getHttpPost } from "../../../../http/http";
import { etcApi } from "../../../../http/api";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_empty: false,
        isIphoneX: false,
        is_show_modal: false,
        card_list: [],
        is_refresh: false,
        is_change_card: false,
        etc_card_no: '',
        isShowLoadingMore: false,
        loadingState: '',
        isLoadingFinish: false,
        show_finish: false,
        refresher: true, //下拉刷新状态
        status: 0, //1:列表为空 2:网络连接失败
        scroll_height: `calc(100vh - 100rpx)`,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.dealStyleData();
        this.getCardData();
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    // etc卡点击
    onETCItemClick(item) {
        // const item = e.detail;
        this.setData({
            etc_card_no: item.etc_card_no,
        })
        this.dealClickData(item);
    },

    //处理点击事件数据
    dealClickData(item) {
        const {
            card_list
        } = this.data;
        const select_etc_card_no = item.etc_card_no;
        for (let i = 0; i < card_list.length; i++) {
            const item = card_list[i];
            if (item.etc_card_no === select_etc_card_no) {
                if (item.is_click) { //关闭
                    item.is_click = false;
                } else {
                    card_list && card_list.map(item => {
                        item.is_click = false;
                    });
                    item.is_click = true;
                }
                break;
            }
        }
        this.setData({
            card_list: card_list
        });
    },

    //下拉刷新
    onRefresh() {
        // this.setData({refresher:true})
        this.getCardData();
    },

    //网络连接失败 重新加载
    onRetryClick() {
        this.getCardData();
    },

    //添加ETC卡信息
    etcAddClick(e) {
        my.navigateTo({
            url: '/pages/mine/etc/bind/bind'
        });
    },
    //修改ETC卡信息
    etcCarChange(e) {},

    //解绑ETC
    onUnbindClick(e) {
        let item = e.detail;
        let that = this;
        my.confirm({
            title: '提示',
            content: '确定要解绑此卡吗？',
            confirmColor: '#cf3046',
            success(res) {
                if (res.confirm) {
                    that.etcUnbind(item);
                }
            }
        });
    },

    etcUnbind(item) {
        const params = {
            etc_card_no: trim(this.data.etc_card_no),
        };
        showLoading("正在解绑...")
        getHttpPost(etcApi.unbind, params, res => {
            if (res.result_code === "00000") {
                hideLoading();
                showToast("解绑成功");
                this.getCardData();
            } else {
                hideLoading();
                showToast(res.msg);

            }
        }, fail => {
            hideLoading();
            showToast(fail);

        })
    },

    //获取列表
    getCardData() {
        showLoading("正在加载...");
        getHttpPost(etcApi.query, {}, res => {
            hideLoading();
            this.setData({
                is_refresh: false,
                refresher: false,
            });
            if (res.result_code === "00000") {
                let list = [];
                const data = res.data;
                if (data && data.length) {
                    list = data.filter((item) => {
                        item.etc_card_no_str = formatSpaceId(item.etc_card_no);
                        item.is_click = false;
                        return item.bind_status == 1 || item.bind_status == 0;
                    });
                    this.setData({
                        is_empty: false,
                        card_list: list,
                        status: 0,
                    });
                } else {
                    this.setData({
                        is_empty: true,
                        status: 1,
                    });
                }
            } else {
                hideLoading();
                showToast(res.result_msg);
            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },
})
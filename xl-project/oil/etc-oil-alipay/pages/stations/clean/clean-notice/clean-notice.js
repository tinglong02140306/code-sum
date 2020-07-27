// pages/stations/clean/clean-notice/clean-notice.js
import { PerferPull, FastOrderUnCheck, FastOrderCheck, FastOrderClose, PerferUsed } from '../../../../assets/url/url'
import { OPENID } from "../../../../constants/global";
import { getHttpPost } from "../../../../http/http";
import { cleanApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let params = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        order_no: '',
        washer_id: '',
        isIphoneX: false,

    },
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            params = JSON.parse(decodeURIComponent(options.params));
            this.setData({
                details: params,
                washer_id: params.washer_id,
                order_no: params.order_no,
            });
            // this.getOrder(params.washer_id);
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const openid = my.getStorageSync({key: OPENID}).data;
        this.setData({
            openid: openid
        });
        this.getOrder(this.data.washer_id); 
        console.log('notice onShow',this.data.washer_id)
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },
    /**
     * 导航栏返回
     */
    onBackClick() {
        const pages = getCurrentPages();
        if (pages.length >= 2) {
            console.log(pages);
            console.log(pages[pages.length - 2]);
            const prePage = pages[pages.length - 2];
            if (prePage.route == "pages/stations/clean/clean-order/clean-order") { //订单界面
                my.navigateBack({
                    delta: 2
                })
            } else if (prePage.route == "pages/stations/clean/park-confirm/park-confirm") { //停车确认界面界面
                my.navigateBack();
            }
        }
    },

    onConfirmClick() {
        const openid = my.getStorageSync({key: OPENID}).data;
        this.setData({
            openid: openid
        });
        if(!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        this.onCleanCheck();
    },

    //检查洗车机状态
    onCleanCheck() {
        showLoading("检查洗车机状态中...")
        this.setData({
            openid: my.getStorageSync({key: OPENID}).data
        });
        const { washer_id } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.check, paramsData, res => {
            hideLoading();
            console.log('洗车机状态' + res.washer_status)
            if (res.washer_status == '1') {
                showToast("车辆未停好");
            } else if (res.washer_status == '2') {
                showToast("洗车机正忙");
            } else if (res.washer_status == '3') {
                showToast("洗车机维护中");
            } else {
                this.startWasher();
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //启动洗车
    startWasher() {
        showLoading("请稍候...")
        this.setData({
            openid: my.getStorageSync({key: OPENID}).data
        });
        const { order_no } = this.data;
        const paramsData = {
            order_no: order_no,
        }
        getHttpPost(cleanApi.start, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const details = encodeURIComponent(JSON.stringify(params));
                my.navigateTo({
                    url: `/pages/stations/clean/clean-doing/clean-doing?params=${details}`
                });
            } else {
                hideLoading();
                showToast("res.msg");
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //检查用户在该洗车点的订单信息
    getOrder(washer_id) {
        // const {
        //     washer_id
        // } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.getOrder, paramsData, res => {
            // 消费成功 => 洗车中
            if (res.result_code === "00000" && res.order_status === '2') {
                console.log('洗车点的订单信息res.order_status' + res.order_status)
                this.onBackClick();
            }
        }, err => {
            showToast(err.msg);
        });
    },

})
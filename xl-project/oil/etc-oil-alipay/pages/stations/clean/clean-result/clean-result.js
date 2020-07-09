// pages/stations/clean/clean-result/clean-result.js
import { QrcodePaySuccess, QrcodePayFail } from '../../../../assets/url/url';
import { cleanApi } from "../../../../http/api";
import { getHttpPost } from "../../../../http/http";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let details = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: false,
        couponList: [],
        status: '01', //01成功 02失败
        order_no: '',
        icon_success: QrcodePaySuccess,
        icon_fail: QrcodePayFail,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            details = JSON.parse(decodeURIComponent(options.params));
            console.log(details);
            this.setData({
                status: details.status,
                order_no: details.order_no,
            });
            this.getCouponList();
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    /**
     * 导航栏返回
     */
    // onBackClick() {
    //     my.navigateBack({
    //         delta: 9
    //     })
    // },
    //重新支付
    onRetryPay() {
        my.navigateBack();
    },

    //查看订单
    onSeeOrder() {
        const details = {
            order_type: 'WASH',
            order_no: this.data.order_no,
        }
        const params = encodeURIComponent(JSON.stringify(details));
        my.navigateTo({
            url: `/pages/mine/order/details/details?details=` + params
        });
    },

    //返回首页
    onBackHome() {
        my.switchTab({
            url: '/pages/home/index/index'
        });
    },

    //查看优惠券
    goCouponClick() {
        my.navigateTo({
            url: '/pages/mine/coupons/list/list'
        });
    },

    //优惠券列表查询
    getCouponList() {
        const { order_no } = this.data;
        const paramsData = {
            order_no: order_no,
        }
        showLoading("正在加载中...")
        getHttpPost(cleanApi.couponListByOrder, paramsData, res => {
            hideLoading();
            // const data = this.dealResponse(res.data);
            const data = res.data;
            this.setData({
                couponList: data,
            });
        }, err => {
            hideLoading();
            showToast(err.msg);
        })
    },

    //洗车券包数据处理
    dealResponse(data) {
        return data && data.map(item => {
            // let discount = item.discount_rate.toString().replace('0','').replace('.','');
            // item.discount_rate = discount.replace('0','');
            // item.package_price = keepTwoDecimalFull(item.package_price);
            // item.isSelect = false;
            return item;
        })
    },
})
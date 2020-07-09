/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 10:27:30
 * @LastEditors: longting
 * @LastEditTime: 2020-04-30 10:47:55
 * @Description: 二维码支付结果页面
 */
import { QrcodePaySuccess, QrcodePayFail } from '../../../assets/url/url';
import { cleanApi } from '../../../http/api';
import { showLoading, hideLoading, showToast } from "../../../utils/my";
import { getHttpPost } from '../../../http/http';
let details = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status: -1,
        icon_success: QrcodePaySuccess,
        icon_fail: QrcodePayFail
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            details = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                status: details.payment_status,
                order_no: details.order_no
            });
            this.getCouponList();
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    //重新支付
    onRetryPay() {
        my.navigateBack();
    },

    //查看订单详情
    onSeeOrder() {
        details.gas_station_address = details.address;
        details.oil_type = details.oil_no;
        details.oil_consume_money = details.payment_amount;
        details.oil_total_money = details.payable_amount;
        details.oil_discount_money = details.discount_amount;
        details.oil_discount_money = details.discount_amount;
        details.oil_price = details.list_price;
        details.gas_station_logo = details.gas_station_logo;
        details.order_create_time = details.order_create_time;
        details.order_type = 'GAS';
        const params = encodeURIComponent(JSON.stringify(details));
        my.navigateTo({
            url: `/pages/mine/order/details/details?details=${params}`
        });
    },

    //开具发票 
    onOpenInvoice() {
        const params = {
            from: 1,
            invoice_total_money: details.payable_amount,
            order_no: details.order_no,
            invoice_detail: details.oil_detail
        };
        const _details = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: `/pages/mine/invoice/create/create?details=${_details}`
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
        const {
            order_no
        } = this.data;
        const paramsData = {
            order_no: order_no,
        }
        getHttpPost(cleanApi.couponListByOrder, paramsData, res => {
            hideLoading();
            const data = res.data;
            this.setData({
                couponList: data,
            });
        }, err => {
            hideLoading();
            showToast(err.msg);
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '',
            path: ''
        }
    }
})
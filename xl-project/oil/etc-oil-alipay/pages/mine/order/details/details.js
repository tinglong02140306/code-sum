// pages/mine/order/details/details.js
import { keepDecimalFull, keepTwoDecimalFull } from "../../../../utils/util";
import { getHttpPost } from "../../../../http/http";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
import { billApi } from "../../../../http/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_title: '', //加油站名称
        logo_url: '', //加油站图片
        order_no: '', //订单号
        create_time: '', //下单时间
        order_detail: '', //油品详情
        order_type: '', //油品类型
        order_price: '', //油品单价
        order_quantity: '', //油品数量
        oil_gun_no: '', //油枪号
        oil_no: '', //油号
        actual_amount: '', //实际金额
        total_amount: '', //定单金额
        discount_amount: '', //优惠金额
        plate_no: '', //车牌号
        etc_no: '', //ETC卡号
        details: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            const details = JSON.parse(decodeURIComponent(options.details));
            this.getBillDetails(details)
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },
    /**
     * 账单查询
     */
    getBillDetails: function (details) {
        showLoading("正在加载...");
        const params = {
            order_type: details.order_type,
            order_no: details.order_no,
        }
        getHttpPost(billApi.details, params, res => {
            hideLoading();
            const data = this.dealResponse(res);
            this.setData({
                details: data
            });

        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    /**
     * 数据处理
     */
    dealResponse: function (item) {
        const m = item.create_time.substr(5, 2)
        const d = item.create_time.substr(8, 2)
        const ss = item.create_time.substr(10, 6)
        item.invoice_create_time_str = m + '月' + d + '日' + ss;
        item.order_price = keepTwoDecimalFull(item.order_price);
        item.order_quantity = keepTwoDecimalFull(item.order_quantity);
        item.actual_amount = keepTwoDecimalFull(item.actual_amount);
        item.actual_amount_wash = keepDecimalFull(item.order_quantity, 0).replace('.', '');
        return item;
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
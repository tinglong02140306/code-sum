// pages/mine/invoice/resend/resend.js
import { getHttpPost } from "../../../../http/http";
import { invoiceApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from '../../../../utils/my';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: false,
        accept_email: '', //邮箱地址
        bill_order_no: '', //订单号/发票编号
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            const params = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                bill_order_no: params.bill_order_no,
            });
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
    onAcceptEmailClick(value) {
        if(!value) return;
        this.setData({
            accept_email: value
        });
    },

    // 提交开票
    onResend() {
        const {
            bill_order_no,
            accept_email
        } = this.data;
        let title = "";
        if (!bill_order_no) {
            title = "发票号为空";
        } else if (!accept_email) {
            title = "请填写邮箱号";
        }
        if (title) {
            showToast(title);
        } else {
            this.sendInvoice();
        }
    },

    /**
     * 发送邮件
     */
    sendInvoice() {

        const {
            bill_order_no,
            accept_email
        } = this.data;
        const params = {
            bill_order_no: bill_order_no,
            accept_email: accept_email,
        }
        showLoading("正在发送...");
        getHttpPost(invoiceApi.invoiceSend, params, res => {
            hideLoading();
            showToast("发送成功");
            my.navigateBack();

        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },
})
// pages/quick/qrcode/qrcode.js
import { qrApi } from '../../../utils/qrcode';
import { OPENID } from '../../../constants/global';
import { QrcodeIcon, QrcodePerfer, QrcodePerferNext, QrcodeNoBackground, QrcodeNoCharge, QrcodeStation, QrcodeInvoice,QrcodeWxPayLogo } from '../../../assets/url/url';
import { getHttpPost } from '../../../http/http';
import { qrcodeApi, accountApi, paymentApi } from "../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../utils/my";
const app = getApp();
let qrcodeTask = null; //获取二维码的Task
let statusTask = null; //获取二维码状态的Task
let resultTask = null; //获取消费结果的Task
let qrcodeTimer = null; //获取二维码的定时任务
let resultCount = 0; //获取消费结果的次数 最大为2次
let rotate = 1;
let preTime = new Date();
let currentTime = new Date();
let qrcodewidth = 235;
let qrcodeLogo = '/assets/static/icon-qrcode-logo.png';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrcodewidth: 235,
        qrCodeContent: null,
        refreshAnimation: null,
        status: 0, //1:已开通二维码 2:未开通二维码
        isShowPay: false,
        processing: false, //交易处理中
        preferent: 0, //可用优惠券数量
        default_type: "",
        default_pay_icon: "",
        isIphoneX: false,
        margin_top: 0,
        qrcode_icon: QrcodeIcon,
        perfer_icon: QrcodePerfer,
        perfer_next_icon: QrcodePerferNext,
        no_bg_icon: QrcodeNoBackground,
        station_icon: QrcodeStation,
        invoice_icon: QrcodeInvoice,
        no_charge: QrcodeNoCharge,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.dealStyleData()
        this.dealPay();
    },
    dealStyleData() {
        const {
            windowWidth,
            isIphoneX,
            windowHeight
        } = app.globalData;
        this.setData({
            isIphoneX: isIphoneX,
            margin_top: (windowHeight - 540) / 4,
        });
        //二维码显示参数
        qrcodewidth = parseInt(windowWidth * 0.65); //二维码宽高
        this.setData({
            qrcodewidth: qrcodewidth
        });
        console.log('二维码宽度',windowWidth,qrcodewidth)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        qrcodeTask && qrcodeTask.abort();
        statusTask && statusTask.abort();
        resultTask && resultTask.abort();
        resultCount = 0;
        rotate = 1;
        clearInterval(qrcodeTimer);
        qrcodeTimer = null;
        //避免在跳转下一个界面时 交易处理中的提示提前消失
        this.timerProcessing = setTimeout(() => {
            this.setData({
                processing: false
            });
            clearTimeout(this.timerProcessing);
        }, 200);
        my.hideToast();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clearInterval(qrcodeTimer);
        qrcodeTimer = null;
        this.setData({
            processing: false
        });
        qrcodeTask && qrcodeTask.abort();
        statusTask && statusTask.abort();
        resultTask && resultTask.abort();
        resultCount = 0;
        rotate = 1;
        my.hideToast();
        hideLoading();
    },

    //开通加油码
    onOpenQrcode() {
        my.navigateTo({
            url: '/pages/mine/pay/list/list'
        })
    },

    //优惠券
    onPreferentClick() {
        my.navigateTo({
            url: "/pages/mine/coupons/list/list"
        });
    },

    //获取优惠券数据
    getPerferent() {
        const params = {
            coupon_use_status: 1,
            page_num: 1,
            page_size: 0
        }
        getHttpPost(accountApi.couponList, params, res => {
            const data = res.data && res.data.filter(item=>{
               return item.coupon_type == 0;
            });
            this.setData({preferent:data && data.length});
        }, fail => {
            console.log("获取优惠券数据失败");
        });
    },

    /**
     * 获取用户已开通的支付方式 
     * 若无已绑定的支付方式 则显示未开通二维码
     */
    dealPay() {
        showLoading("正在获取...");
        getHttpPost(paymentApi.paymentList, {}, res => {
            hideLoading();
            let data = res.data;
            if (data && data.length) {
                this.setData({
                    default_type: `支付宝免密支付`,
                    default_pay_icon: QrcodeWxPayLogo,
                    status: 1
                });
                this.getQRCodeTimer();
                this.getPerferent();
            } else {
                this.setData({
                    status: 2
                });
            }
        }, err => {
            console.log(err);
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });
    },

    /**
     * 用户手动刷新二维码事件
     * 手动刷新必须限制 防止用户过频的刷新
     * 手动刷新间隔必须大于2s
     */
    onRefreshCode() {
        const { qrCodeContent } = this.data;
        if (!this.data.processing) {
            currentTime = new Date();
            const diffTime = parseInt(currentTime - preTime) / 1000;
            if (diffTime > 1) {
                this.removeStatus(qrCodeContent); //移除上一个二维码的状态
                this.refreshAnimation();
                this.getQRCodeTimer();
                preTime = currentTime;
            }
        }
    },

    /**
     * 刷新动画
     */
    refreshAnimation() {
        let refreshAnimation = my.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        });
        refreshAnimation.rotate(rotate * 180).step()
        rotate++;
        this.setData({
            refreshAnimation: refreshAnimation.export()
        });
    },

    /**
     * 支付方式选择
     */
    onPaymentClick() {},

    /**
     * 合作油站
     */
    onStationClick() {
        my.switchTab({
            url: '/pages/stations/index/index'
        });
    },

    /**
     * 电子发票
     */
    onInvoiceClick() {
        my.navigateTo({
            url: '/pages/mine/invoice/index/index'
        });
    },

    /**
     * 每60s获取一次二维码
     */
    getQRCodeTimer() {
        this.getQRCode();
        clearInterval(qrcodeTimer);
        qrcodeTimer = null;
        qrcodeTimer = setInterval(() => {
            this.getQRCode();
        }, 60000);
    },
    /**
     * 获取二维码
     */
    getQRCode() {
        const {
            qrCodeContent
        } = this.data;
        //首次获取加油码时显示loading
        if (!qrCodeContent) {
            showLoading("正在加载...");
        }
        qrcodeTask && qrcodeTask.abort();
        statusTask && statusTask.abort();
        resultTask && resultTask.abort();
        resultCount = 0;
        this.setData({
            processing: false
        });
        console.log(`二维码获取请求${new Date()}`);
        qrcodeTask = getHttpPost(qrcodeApi.qrcode, {}, res => {
            const qr_code = res.qr_code;
            hideLoading();
            if (qr_code) { //二维码获取成功
                console.log(`二维码获取成功${new Date()}`);
                console.log(`二维码获取成功${JSON.stringify(res)}`);
                qrApi.draw(qr_code, "qrcode", qrcodewidth, qrcodewidth, null, qrcodeLogo);
                this.setData({
                    qrCodeContent: qr_code
                });
                //获取该二维码对应的状态
                this.getQRCodeStatus(qr_code);
            } else {
                showToast("二维码为空");
            }
        }, err => {
            console.log(`二维码获取失败${JSON.stringify(err)}`);
            if (!qrCodeContent) {
                hideLoading();
                if (err.msg !== "request:fail abort") {
                    showToast(JSON.stringify(err));
                }
            } else {
                if (err && err.msg !== "request:fail abort") { //自动断开时 不再请求
                    this.getQRCodeTimer();
                }
            }
        });
    },

    /**
     * 获取二维码状态
     */
    getQRCodeStatus(qr_code) {
        const data = {
            qr_code: qr_code
        }
        console.log(`二维码状态获取请求${new Date()}`, qr_code);
        statusTask = getHttpPost(qrcodeApi.status, data, res => {
            //payment_status:00-支付中，01-支付成功，02-支付失败
            const payment_status = res.payment_status;
            //二维码被扫 终止获取二维码的定时任务 终止获取二维码状态的Task 显示交易处理中 开始获取消费结果
            if (payment_status == "00") {
                this.setData({
                    processing: true
                });
                clearInterval(qrcodeTimer);
                qrcodeTimer = null;
                qrcodeTask.abort();
                statusTask.abort();
                this.getConsumeResult(data);
            }
            console.log(`获取二维码状态成功${new Date()}`);
            console.log(`获取二维码状态成功${JSON.stringify(res)}`, qr_code);
        }, err => {
            console.log(`获取二维码状态失败${new Date()}`);
            console.log(`获取二维码状态失败${JSON.stringify(err)}`, qr_code);
            if (err && err.msg !== "request:fail abort") { //自动断开时 不再请求
                this.getQRCodeTimer();
            }
        });
    },

    /**
     * 获取消费结果
     */
    getConsumeResult(data) {
        if (resultCount < 2) {
            resultCount++;
            console.log(`消费结果获取请求${new Date()}`);
            resultTask = getHttpPost(qrcodeApi.result, data, res => {
                console.log(`获取消费结果成功:${JSON.stringify(res)}`);
                console.log(`获取消费结果成功${new Date()}`);
                const payment_details = res;
                resultTask.abort();
                const details = encodeURIComponent(JSON.stringify(payment_details));
                my.navigateTo({
                    url: `/pages/stations/qrcode-result/qrcode-result?details=${details}`
                })
            }, err => {
                console.log(`获取消费结果失败:${JSON.stringify(err.msg)}`);
                console.log(`获取消费结果失败${new Date()}`);
                //获取消费结果失败 若resultCount为1 则再次获取消费结果；若resultCount为2 则显示失败 不在获取
                if (resultCount === 1) {
                    this.getConsumeResult(data);
                } else {
                    if (err && err.msg !== "request:fail abort") { //自动断开时 不再请求
                        this.getQRCodeTimer();
                    }
                }
            });
        }
    },

    /**
     * 二维码意外更改时 告知后端移除上一个二维码状态的监听
     */
    removeStatus(qr_code) {
        const params = {
            qr_code: qr_code
        }
        console.log(`移除二维码状态的监听请求${new Date()}`);
        getHttpPost(qrcodeApi.removeQrcode, params, res => {
            console.log(`移除二维码状态监听${JSON.stringify(res)}`);
        }, fail => {
            console.log(`移除二维码状态监听${JSON.stringify(fail)}`);
        });
    },

})
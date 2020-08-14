import { qrApi } from '../../../../utils/qrcode';
// var qrApi = require('../../../../utils/qrcode');
// var QRCode = require('qrcode');
import { CouponFail, CouponSuccess } from '../../../../assets/url/url';
import { getHttpPost } from '../../../../http/http';
import { accountApi } from '../../../../http/api';
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let width;
const SUCCESS = '核销成功';
const FAIL = '核销失败';
let couponTask = null;
let resultCount = 0;//获取消费结果的次数 最大为2次
Page({

    data: {
        width: 0,
        code: '',
        imgSrc: '',
        result_text: '',
        result_image: '',
        payment_status: '',
        coupon_put_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        resultCount = 0;
        const coupon_put_id = options.coupon_put_id || '';
        this.setData({coupon_put_id:coupon_put_id});
        this.dealStyleData();
        this.getCode(coupon_put_id);
    },

    //页面隐藏
    onHide() {
        resultCount = 0;
        couponTask && couponTask.abort();
    },

    //页面关闭
    onUnload() {
        resultCount = 0;
        couponTask && couponTask.abort();
    },
    dealStyleData() {
        let windowWidth = app.globalData.windowWidth;
        width = parseInt(windowWidth * 0.65);
        this.setData({
            width: width
        });
    },

    /**
     * 获取提货券码
     */
    getCode(coupon_put_id) {
        const params = {
            coupon_put_id: coupon_put_id
        }
        showLoading("正在获取券码...");
        getHttpPost(accountApi.qrcode, params, res => {
            my.stopPullDownRefresh()
            hideLoading();
            const qr_code = res.qr_code;
            this.setData({
                code: qr_code
            });
            qrApi.draw(qr_code, "coupon", width, width, null);
            this.getResult(qr_code);
        }, err => {
            my.stopPullDownRefresh()
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });
    },

    /**
     * 获取核销结果
     */
    getResult(qr_code) {
        couponTask && couponTask.abort();
        const params = {
            qr_code: qr_code
        }
        if (resultCount < 2) {
            resultCount++;
            couponTask = getHttpPost(accountApi.qrcode_result, params, res => {
                console.log(res)
                if (res.payment_status == "01") {
                    this.setData({
                        result_text: SUCCESS,
                        result_image: CouponSuccess,
                        payment_status: '01'
                    })
                    const pages = getCurrentPages();
                    if (pages.length >= 2) {
                        const prePage = pages[pages.length - 2];
                        if (prePage.route == "pages/mine/coupons/list/list") {
                            prePage.onRefreshCoupon();
                            resultCount = 2;
                            setTimeout(() => {
                                my.navigateBack();
                            }, 800);
                        }
                    }
                } else if (res.payment_status == "02") {
                    this.setData({
                        result_text: FAIL,
                        result_image: CouponFail,
                        payment_status: '02'
                    })
                }
            }, err => {
                console.log(err)
                if (resultCount === 1) {
                    this.getResult(qr_code);
                }
            })
        }
    },
    // 触发下拉刷新时执行
    onPullDownRefresh() {
        resultCount = 0;
        const coupon_put_id = this.data.coupon_put_id;
        this.getCode(coupon_put_id);
    },
})
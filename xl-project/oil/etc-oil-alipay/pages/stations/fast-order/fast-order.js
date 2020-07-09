import { PerferPull, PerferUsed, FastOrderClose } from "../../../assets/url/url";
import { getHttpPost } from '../../../http/http';
import { stationsApi } from '../../../http/api';
import { showLoading, hideLoading, showToast } from "../../../utils/my";
const app = getApp();
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_show_coupon: false,
        order_no: '', //订单编号
        order_status: '', //订单状态
        station_name: '', //油站名称
        station_id: '',
        oil_no: '', //油号
        oil_gun: '', //油枪
        order_amount: '0', //订单金额
        discount_amount: '0', //折扣金额
        payable_amount: '0', //应付金额
        real_amount: '0', //实付款
        coupon_put_id: '', //优惠券投放id
        perferentList: [],
        preferent: 0, //优惠券个数
        available: 0, //可用优惠券个数
        rule_icon: PerferPull,
        finish_icon: PerferUsed,
        close_icon: FastOrderClose,
        coupon_value: '',
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            const details = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                order_no: details.order_no || '',//订单编号
                order_status: details.order_status || '',//订单状态
                station_name: details.station_name || '',//油站名称
                station_id: details.station_id || '',//油站id
                oil_no: details.oil_no || '',//油号
                oil_gun: details.oil_gun || '',//油枪
                order_amount: details.order_amount || '',//订单金额
                discount_amount: details.discount_amount || '',//折扣金额
                payable_amount: details.payable_amount || '',//应付金额
                real_amount:details.payable_amount,//实付款
                balance_amount:details.balance_amount//加油金
            });
        } catch (error) {
            console.log(error);
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
        this.getPerferent();
    },

    onHide() {
        timer && clearTimeout(timer);
    },

    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },
    popupRef(ref) {
        this.popupRef = ref;
    },
    //选择优惠券
    onChangeCoupon() {
        if (this.data.preferent) {
            this.setData({
                is_show_coupon: true
            });
            this.popupRef.fadeIn();
        }
    },

    //关闭优惠券列表
    onCloseClick() {
        this.setData({
            is_show_coupon: false
        });
        this.popupRef.fadeOut();
    },

    //优惠券选择
    onCheckPergerent(item,data) {
        const {
            perferentList,
            order_no
        } = this.data;
        const {
            index,
            status
        } = item;
        this.setData({
            is_show_coupon: false,
            coupon_value: status ? perferentList[index].coupon_value : '',
            coupon_put_id: status ? perferentList[index].coupon_put_id : null,
            perferentList: data || []
        });
        const params = {
            order_no: order_no,
            coupon_put_id: status ? perferentList[index].coupon_put_id : null
        }
        this.getCalculateCoupon(params);
    },

    //优惠券计算
    getCalculateCoupon(params) {
        showLoading("正在加载...");
        getHttpPost(stationsApi.couponCalculate, params, res => {
            hideLoading();
            this.setData({
                real_amount: res.payable_amount,
                balance_amount:res.balance_amount,
            })
        }, err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`)
        });
    },

    //获取优惠券数据
    getPerferent() {
        const params = {
            station_id: this.data.station_id,
            order_amount: this.data.order_amount,
        }
        getHttpPost(stationsApi.couponQuery, params, res => {
            //获取可用的优惠券
            const enabledList = res.data && res.data.filter(item => {
                return item.enabled;
            })
            this.setData({
                preferent: res.data && res.data.length,
                available: enabledList && enabledList.length,
                perferentList: res.data || []
            })
        }, fail => {
            console.log("获取优惠券数据失败");
        });
    },

    //确认支付 下单
    onSubmitClick() {
        const {
            order_no
        } = this.data;
        showLoading("请稍候...");
        const params = {
            order_no: order_no
        };
        getHttpPost(stationsApi.unifiedorder, params, response => {
            hideLoading();
            if (response.need_pay) {
                this.goPay(response.pay_params)
            } else {
                hideLoading();
                showToast("支付成功");
                timer = setTimeout(() => {
                    my.navigateBack({
                        delta: 2
                    })
                }, 1400);
            }
        }, err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });
    },

    //调起支付
    goPay(tradeNO) {
        try {
            my.tradePay({
                tradeNO: tradeNO,
                success() {
                    hideLoading();
                    my.navigateBack({
                        delta: 2
                    })
                },
                fail(err) {
                    console.log(err)
                    hideLoading();
                },
                complete() {

                }
            })
        } catch (err) {
            console.log(err);
            showToast("参数格式错误");
        }

    },
})
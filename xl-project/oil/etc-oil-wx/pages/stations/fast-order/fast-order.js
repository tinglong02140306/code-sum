import { PerferPull, PerferUsed, FastOrderClose } from "../../../assets/url/url";
import {getHttpPost} from '../../../http/http';
import {stationsApi} from '../../../http/api';
const app = getApp();
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // isIphoneX: app.globalData.fix,
        is_show_coupon: false,
        order_no: '',//订单编号
        order_status: '',//订单状态
        station_name: '',//油站名称
        station_id: '',
        oil_no: '',//油号
        oil_gun: '',//油枪
        order_amount: '0',//订单金额
        discount_amount: '0',//折扣金额
        payable_amount: '0',//应付金额
        real_amount: '0',//实付款
        coupon_put_id: '',//优惠券投放id
        balance_amount: '',//加油金
        perferentList: [],
        preferent: 0,//优惠券个数
        available: 0,//可用优惠券个数
        rule_icon: PerferPull,
        finish_icon: PerferUsed,
        close_icon: FastOrderClose,
        coupon_value: '',
        isIphoneX:app.globalData.isIphoneX 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        try {
            const details = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                details:details,
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
            wx.switchTab({url: '/pages/home/index/index'});
        }
        this.getPerferent();
    },

    onHide:function(){
        timer&&clearTimeout(timer);
    },

    //选择优惠券
    onChangeCoupon: function () {
        if (this.data.preferent) {
            this.setData({ is_show_coupon: true });
        }
    },

    //关闭优惠券列表
    onCloseClick: function () {
        this.setData({ is_show_coupon: false });
    },

    //优惠券选择
    onCheckPergerent: function (e) {
        const { perferentList, order_no } = this.data;
        const { index, status } = e.detail;
        this.setData({
            is_show_coupon: false,
            coupon_value: status ? perferentList[index].coupon_value : '',
            coupon_put_id: status ? perferentList[index].coupon_put_id : null
        });
        const params = {
            order_no:order_no,
            coupon_put_id:status ? perferentList[index].coupon_put_id : null
        }
        this.getCalculateCoupon(params);
    },

    //优惠券计算
    getCalculateCoupon: function (params) {
        wx.showLoading({
            title: "正在加载...",
            icon:'none'
        });
        getHttpPost(stationsApi.couponCalculate, params, res => {
            wx.hideLoading();
            this.setData({
                real_amount:res.payable_amount,
                balance_amount:res.balance_amount,
            })
        },err => {
            wx.hideLoading();
            wx.showToast({
                title:`${err.msg}:${err.code}`,
                icon:'none'
            })
        });
    },

    //获取优惠券数据
    getPerferent: function () {
        const params = {
            station_id: this.data.station_id,
            order_amount: this.data.order_amount,
        }
        getHttpPost(stationsApi.couponQuery, params, res => {
          //获取可用的优惠券
          const enabledList = res.data&&res.data.filter(item=>{
            return item.enabled;
          })
          this.setData({
            preferent:res.data&&res.data.length,
            available:enabledList&&enabledList.length,
            perferentList:res.data||[]
          })
        }, fail => {
            console.log("获取优惠券数据失败");
        });
    },

    //确认支付 下单
    onSubmitClick: function () {
        const { order_no } = this.data;
        wx.showLoading({
            title: "请稍候...",
            mask: true
        });
        const params = {order_no: order_no};
        getHttpPost(stationsApi.unifiedorder, params, response => {
            wx.hideLoading();
            if (response.need_pay) {
                this.goPay(response.pay_params)
            }else{
                wx.hideLoading();
                wx.showToast({
                    title: "支付成功",
                    icon: 'none'
                });
                timer = setTimeout(()=>{
                    wx.navigateBack({delta: 2})
                },1400);
            }
        },err => {
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}:${err.code}`,
                icon: 'none'
            });
        });
    },

    //调起支付
    goPay: function (params) {
        const { order_no,real_amount } = this.data;
        const that = this;
        try {
            const data = JSON.parse(params);
            wx.requestPayment(
                {
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function () {
                        let payment_details = {
                            payment_status:'01',
                            order_no:order_no,
                            payment_amount:real_amount,
                            order_type:'GAS'
                        };
                        const details = encodeURIComponent(JSON.stringify(payment_details));
                        wx.navigateTo({url: `/pages/stations/qrcode-result/qrcode-result?details=${details}`})
                        // wx.navigateBack({delta: 2})
                    },
                    fail: function (err) {
                        console.log(err)
                        if (err.errMsg == 'requestPayment:fail cancel'){
                            wx.navigateBack();
                        }
                    },
                    complete: function () {

                    }
                })
        } catch (err) {
            console.log(err);
            wx.showToast({title:"参数格式错误",icon:"none"});
        }
        
    },
})
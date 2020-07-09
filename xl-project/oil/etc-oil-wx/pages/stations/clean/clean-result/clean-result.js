// pages/stations/clean/clean-result/clean-result.js
import {QrcodePaySuccess, QrcodePayFail} from '../../../../assets/url/url';
let details = null;
import {cleanApi} from "../../../../http/api";
import {getHttpPost} from "../../../../http/http";
const app = getApp();

const navigationBarHeight = app.globalData.navigationBarHeight;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    couponList:[],
    status:'01',//01成功 02失败
    order_no:'',
    icon_success:QrcodePaySuccess,
    icon_fail:QrcodePayFail,
  },

  /**
   * 导航栏返回
   */
  onBackClick: function(){
    wx.navigateBack({delta: 9})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      details = JSON.parse(decodeURIComponent(options.params));
      console.log(details);
      this.setData({
        status:details.status,
        order_no:details.order_no,
      });
      this.getCouponList();
    } catch (error) {
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  //重新支付
  onRetryPay:function(){
    wx.navigateBack();
  },

  //查看订单
  onSeeOrder:function(){

    const details = {
      order_type:'WASH',
      order_no:this.data.order_no,
    }
    const params = encodeURIComponent(JSON.stringify(details));
    wx.navigateTo({url: `/pages/mine/order/details/details?details=`+params});
  },

  //返回首页
  onBackHome:function(){
    wx.switchTab({url: '/pages/home/index/index'});
  },

  //查看优惠券
  goCouponClick:function(){
    wx.navigateTo({url: '/pages/mine/coupons/list/list'});
   },

  //优惠券列表查询
  getCouponList:function(){
    const {order_no} = this.data;
    const paramsData = {
      order_no:order_no,
    }
    getHttpPost(cleanApi.couponListByOrder,paramsData,res=> {
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      this.setData({
        couponList:data,
      });
    },err=> {
      wx.hideLoading();
      wx.showToast({title: err.msg, icon: "none"});
    })
  },

  //洗车券包数据处理
  dealResponse:function(data){
    return data&&data.map(item=>{
      // let discount = item.discount_rate.toString().replace('0','').replace('.','');
      // item.discount_rate = discount.replace('0','');
      // item.package_price = keepTwoDecimalFull(item.package_price);
      // item.isSelect = false;
      return item;
    })
  },
})
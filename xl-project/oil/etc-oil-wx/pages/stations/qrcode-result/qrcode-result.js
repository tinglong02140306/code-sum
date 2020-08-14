/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 10:27:30
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-30 10:47:55
 * @Description: 二维码支付结果页面
 */
import {QrcodePaySuccess, QrcodePayFail} from '../../../assets/url/url';
import {getHttpPost} from "../../../http/http";
import {billApi, cleanApi} from "../../../http/api";
let details = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:-1,
    icon_success:QrcodePaySuccess,
    icon_fail:QrcodePayFail,
    couponList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      details = JSON.parse(decodeURIComponent(options.details));
      this.setData({
        status:details.payment_status,
        order_no:details.order_no,
      });
      this.getCouponList();
      if (details.order_type){
        this.getBillDetails(details);
      }
    } catch (error) {
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  //重新支付
  onRetryPay:function(){
    wx.navigateBack();
  },

  //查看订单详情
  onSeeOrder:function(){
    details.from = '1';
    details.order_type = 'GAS';
    // details.logo_url = details.gas_station_logo;
    // details.order_title = details.gas_station_name;
    // details.order_price = details.list_price;
    details.order_no = details.order_no;
    // details.create_time = details.order_create_time;
    // details.order_detail = details.oil_detail;
    // details.order_quantity = details.oil_num;
    // details.total_amount = details.payable_amount;
    // details.discount_amount = details.discount_amount;
    // details.actual_amount = details.payment_amount;
    // details.plate_no = details.plate_no;
    // details.etc_no = details.etc_no;
    const params = encodeURIComponent(JSON.stringify(details));
    wx.navigateTo({url: `/pages/mine/order/details/details?details=${params}`});
  },

  //开具发票 
  onOpenInvoice:function(){
    const params = {
      from:1,
      invoice_total_money:details.payment_amount,
      order_no:details.order_no,
      invoice_detail:details.oil_detail
    };
    console.log('params',params);
    const _details = encodeURIComponent(JSON.stringify(params));
    wx.navigateTo({url: `/pages/mine/invoice/create/create?details=${_details}`});
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
      // const data = this.dealResponse(res.data);
      this.setData({
        couponList:res.data,
      });
    },err=> {
      wx.showToast({title: err.msg, icon: "none"});
    })

  },

  // //洗车券包数据处理
  // dealResponse:function(data){
  //   return data&&data.map(item=>{
  //     // let discount = item.discount_rate.toString().replace('0','').replace('.','');
  //     // item.discount_rate = discount.replace('0','');
  //     // item.package_price = keepTwoDecimalFull(item.package_price);
  //     // item.isSelect = false;
  //     return item;
  //   })
  // },
  /**
   * 账单详情查询
   */
  getBillDetails:function(paramsData){
    const params = {
      order_type:paramsData.order_type,
      order_no:paramsData.order_no,
    }
    getHttpPost(billApi.details,params,res=>{
      console.log('账单详情',res)
      //开具发票内容
      details.oil_detail = res.order_detail

    },err=>{
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

})
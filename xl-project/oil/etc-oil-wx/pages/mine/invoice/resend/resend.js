// pages/mine/invoice/resend/resend.js
import {getHttpPost} from "../../../../http/http";
import {invoiceApi} from "../../../../http/api";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:app.globalData.isIphoneX,
    accept_email:'',//邮箱地址
    bill_order_no:'',//订单号/发票编号

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const params = JSON.parse(decodeURIComponent(options.details));
      this.setData({
        bill_order_no:params.bill_order_no,
      });
    } catch (error) {
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },
  onAcceptEmailClick:function(e){
    const value = e.detail;
    this.setData({
      accept_email:value
    });
  },

  // 提交开票
  onResend:function () {
    const {bill_order_no,accept_email} = this.data;
    let title = "";
    if (!bill_order_no){
      title= "发票号为空";
    }else if (!accept_email){
      title= "请填写邮箱号";
    }
    if(title){
      wx.showToast({
        title:title,
        icon:'none'
      });
    }else{
      this.sendInvoice();
    }
  },

  /**
   * 发送邮件
   */
  sendInvoice:function(){

    const {bill_order_no,accept_email} = this.data;
    const params = {
      bill_order_no:bill_order_no,
      accept_email:accept_email,
    }
    wx.showLoading({
      title:'正在发送...',
      mask:true
    });
    getHttpPost(invoiceApi.invoiceSend,params,res=>{
      wx.hideLoading();
      wx.showToast({
        title:'发送成功',
        icon:'none'
      });
      wx.navigateBack();

    },err=>{
      wx.hideLoading();
      wx.showToast({
        title:err.msg,
        icon:'none'
      });
    });
  },
})
/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 10:27:30
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-30 10:47:55
 * @Description: 二维码支付结果页面
 */
import {QrcodePaySuccess, QrcodePayFail} from '../../../../assets/url/url';
let details = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'01',//01成功 02失败
    icon_success:QrcodePaySuccess,
    icon_fail:QrcodePayFail
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      details = JSON.parse(decodeURIComponent(options.details));
      this.setData({
        status:details.status
      });
    } catch (error) {

    }
  },

  //重新签约
  onRetryPay:function(){
    wx.navigateBack();
  },

  //返回首页
  onBackHome:function(){
    wx.navigateBack({delta: 9});
  },

})
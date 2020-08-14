// pages/stations/clean/clean-notice/clean-notice.js
import {PerferPull, FastOrderUnCheck, FastOrderCheck, FastOrderClose, PerferUsed} from '../../../../assets/url/url'
import {OPENID} from "../../../../constants/global";
import {getHttpPost} from "../../../../http/http";
import {cleanApi} from "../../../../http/api";
const app = getApp();
let params = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    order_no:'',
    washer_id:'',
    isIphoneX: app.globalData.isIphoneX,

  },
  /**
   * 导航栏返回
   */
  onBackClick: function(){
    const pages = getCurrentPages();
    if(pages.length>=2){
      console.log(pages);
      console.log(pages[pages.length-2]);
      const prePage = pages[pages.length-2];
      if(prePage.route=="pages/stations/clean/clean-order/clean-order"){//订单界面
        wx.navigateBack({delta: 2})
      }else if(prePage.route=="pages/stations/clean/park-confirm/park-confirm"){//停车确认界面界面
        wx.navigateBack();
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      params = JSON.parse(decodeURIComponent(options.params));
      this.setData({
        details:params,
        washer_id:params.washer_id,
        order_no:params.order_no,
      });
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    this.getOrder();
  },

  onConfirmClick:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      // wx.navigateTo({url:`/pages/stations/clean/clean-doing/clean-doing`});
      this.onCleanCheck();
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //检查洗车机状态
  onCleanCheck:function(){
    wx.showLoading({
      title: '检查洗车机状态中...',
      icon: 'none',
      mask: true
    })
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.check,paramsData,res=>{
      wx.hideLoading();
      console.log('洗车机状态'+res.washer_status)
      if (res.washer_status == 1){
        wx.showToast({title:'车辆未停好',icon:"none"});
      }else if (res.washer_status == 2){
        wx.showToast({title:'洗车机正忙',icon:"none"});
      }else if (res.washer_status == 3){
        wx.showToast({title:'洗车机维护中',icon:"none"});
      }else {
        this.startWasher();
      }
    },err=>{
      wx.hideLoading();
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //启动洗车
  startWasher: function(){
    wx.showLoading({
      title: '请稍候...',
      icon: 'none',
      mask: true
    })
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {order_no} = this.data;
    const paramsData = {
      order_no:order_no,
    }
    getHttpPost(cleanApi.start,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        const details = encodeURIComponent(JSON.stringify(params));
        wx.navigateTo({url:`/pages/stations/clean/clean-doing/clean-doing?params=${details}`});
      } else {
        wx.hideLoading();
        wx.showToast({title:res.msg,icon:"none"});
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //检查用户在该洗车点的订单信息
  getOrder:function(){
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.getOrder,paramsData,res=>{
      if (res.result_code === "00000") {
        console.log('洗车点的订单信息res.order_status'+res.order_status)

        if (res.order_status === '1'){
          //支付成功<=启动洗车机
          // wx.navigateBack();
        }else if (res.order_status === '2'){
          //消费成功<=洗车中
          // wx.navigateBack();
          this.onBackClick();
        }else {
          //继续执行
          // this.onCleanCheck();
        }
      }
    },err=>{
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

})
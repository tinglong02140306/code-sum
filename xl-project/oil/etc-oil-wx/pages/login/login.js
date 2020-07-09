// pages/login/login.js
import {OPENID, CODE, MOBILE, MARKET_CODE} from '../../constants/global';
import {loginApi} from '../../http/api';
import {getPostPromise} from '../../http/http';
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function (options) {
    this.getCode();
    timer = setInterval(()=>{
      this.getCode();
    },60000*5)
  },

  onUnload:function(){
    clearInterval(timer);
    timer = null;
  },

  getCode:function(){
    wx.login({
      success:res=> {
        wx.setStorageSync(CODE,res.code);
        this.getWxLogin(res.code);
      },
      fail:err=>{
        wx.hideLoading();
        wx.showToast({title:"code获取失败,请重新启动小程序",icon:"none"});
      }
    });
  },

  //微信获取code
  getWxLogin:function(code){
    const params = {js_code:code}
    getPostPromise(loginApi.wxLogin,params).then(res=>{
      wx.hideLoading();
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:'none'});
    })
  },

  //获取手机号权限
  getPhoneNumber:function(e){
    const {encryptedData, iv, errMsg} = e.detail;
    const code = wx.getStorageSync(CODE);
    const {source} = this.data;
    if(errMsg==="getPhoneNumber:ok"){//用户允许获取手机号
      this.setData({show:false});
      this.getLogin(code,encryptedData,iv,source);
    }else{
      this.setData({show:false});
      wx.showModal({
        title: '提示',
        content: '需要授权才能继续,请重新点击并授权',
        showCancel:false,
        success (res) {}
      });
    }
  },

  //登录
  getLogin:function(code,encrypted,iv,source){
    const params = {
      js_code:code,
      encrypted_data:encrypted,
      iv:iv,
      //todo 代理--普通二维码进入
      invite_code:wx.getStorageSync(MARKET_CODE)?wx.getStorageSync(MARKET_CODE):null
    }
    wx.showLoading({title:"登录中...",mask:true});
    getPostPromise(loginApi.userLogin,params).then(res=>{
      wx.hideLoading();
      wx.showToast({title:"登录成功",icon:"none"});
      wx.setStorageSync(OPENID,res.openid);
      wx.setStorageSync(MOBILE,res.mobile);
      //todo 代理--普通二维码进入
      wx.setStorageSync(MARKET_CODE,'');
      clearInterval(timer);
      timer = null;
      wx.navigateBack();
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
      clearInterval(timer);
      timer = null;
      this.getCode();
      timer = setInterval(()=>{
        this.getCode();
      },60000*5)
    });
  },


})
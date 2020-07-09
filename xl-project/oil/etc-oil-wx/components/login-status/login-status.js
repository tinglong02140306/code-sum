/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 09:43:32
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-22 09:53:28
 * @Description: login
 */
import {OPENID,CODE} from '../../constants/global';
import {loginApi} from '../../http/api';
import {getPostPromise} from '../../http/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source:{//点击事件需要携带的数据
      type:Object,
      value:null
    },
    openid:{
      type:String,
      value:"",
      observer:function(newVal){
        this.setData({open_id:newVal});
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    encrypted:null,
    width:0,
    height:0,
    open_id:"",
    show:false
  },

  ready:function(){
    this.createSelectorQuery().select('#content').boundingClientRect((rect)=>{
      if(rect){
        this.setData({
          width:rect.width,
          height:rect.height
        });
      }
    }).exec();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gettap:function(){},

    getClick:function(){
      const {source} = this.data;
      const openid = wx.getStorageSync(OPENID);
      if(openid){//用户已登录
        this.triggerEvent('click',source);
      }else{//用户未登录
        wx.showLoading({title:'正在登录...',icon:"none"})
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
      }
    },
    
    //微信获取code
    getWxLogin:function(code){
      const params = {js_code:code}
      getPostPromise(loginApi.wxLogin,params).then(res=>{
        wx.hideLoading();
        this.setData({show:true});
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
        iv:iv
      }
      wx.showLoading({title:"登录中...",mask:true});
      getPostPromise(loginApi.userLogin,params).then(res=>{
          wx.hideLoading();
          wx.showToast({title:"登录成功",icon:"none"});
          wx.setStorageSync(OPENID,res.openid);
          this.triggerEvent('click',source);
      }).catch(err=>{
          wx.hideLoading();
          if(err.code==="99998"){
            wx.showToast({title:`授权超时，请重新登录`,icon:'none'});
          }else{
            wx.showToast({title:`${err.msg}:${err.code}`,icon:'none'})
          }
      });
    },
  }
})

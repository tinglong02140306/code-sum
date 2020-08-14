// pages/stations/clean/park-confirm/park-confirm.js
import {OPENID, CODE_WASHER, STATIONPAGE,WASHER_ID,FROM_CODE} from "../../../../constants/global";
import {getHttpPost} from "../../../../http/http";
import {cleanApi} from "../../../../http/api";
import {getLocation} from "../../../../utils/location";
import {getUrlParam} from "../../../../utils/util";
let params = null;
const app = getApp();
let location = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    openid:'',
    washer_id:'',//洗车机ID
    details:null,
    center_lng: null,
    center_lat:null,
    isFistShow:false,
  },

  //首次进入
  onHideFirst:function(){
    this.setData({
      isFistShow:false
    })
  },

  //停车确认完毕
  onConfirmClick:function(){
    // this.setData({openid:wx.getStorageSync(OPENID)});
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      // if (wx.getStorageSync(CODE_WASHER)){
      //   this.onCleanClick();
      // }else {
      //   this.getOrder();
      // }
      this.onCleanClick();
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前位置的经纬度信息
    getLocation(true,location=>{
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
    });
    this.setData({isFistShow:true})
    try {
      // console.log('washer_id');
      if (wx.getStorageSync(CODE_WASHER)){
        //扫描小程序码进入首页
        if (options.params){
          params = JSON.parse(decodeURIComponent(options.params));
          this.setData({
            details:params,
            washer_id:params.washer_id
          });
        }else {
          //扫描小程序码进入洗车机
          if(options&&options.scene){
            const scene = decodeURIComponent(options.scene);
            const index = scene.indexOf("=");
            if(index!=-1){

              const washer_id = scene.slice(index+1,scene.length);
              console.log(washer_id);
              this.setData({
                washer_id:washer_id
              });
              wx.setStorageSync(CODE_WASHER, false);
            }
          }
        }
      }else if (wx.getStorageSync(FROM_CODE)){
        //扫描普通二维码进入
        if (wx.getStorageSync(WASHER_ID)){
          this.setData({
            washer_id:wx.getStorageSync(WASHER_ID)
          });
        }else {
          wx.showToast({title: '二维码无效',icon:'none'})
        }
      } else {
        params = JSON.parse(decodeURIComponent(options.params));
        this.setData({
          details:params,
          washer_id:params.washer_id
        });
      }
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  //删除用户在该洗车点的订单缓存
  removeCache:function(){
    console.log('删除用户在该洗车点的订单缓存')
    const {washer_id,details} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.removeCache,paramsData,res=>{
      wx.hideLoading();
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
  },

  //检查用户在该洗车点的订单信息
  getOrder:function(){
    console.log('洗车点的订单信息'+JSON.stringify(this.data.washer_id))
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.getOrder,paramsData,res=>{
      if (res.result_code === "00000") {
        if (res.order_status === '1'){
          //支付成功=>启动洗车机
          const resData = {
            washer_id:paramsData.washer_id,
            order_no:res.order_no,
            // start_time:res.start_time,
          }
          console.log(JSON.stringify(resData))
          const details = encodeURIComponent(JSON.stringify(resData));
          wx.navigateTo({url:`/pages/stations/clean/clean-notice/clean-notice?params=${details}`});
        }else if (res.order_status === '2'){
          //消费成功=>洗车中
          const resData = {
            washer_id:paramsData.washer_id,
            order_no:res.order_no,
            start_time:res.start_time,
          }
          const details = encodeURIComponent(JSON.stringify(resData));
          wx.navigateTo({url:`/pages/stations/clean/clean-doing/clean-doing?params=${details}`});
        }else {
          //继续执行
          this.onCleanCheck();
        }
      }
    },err=>{
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //检查洗车机状态
  onCleanCheck:function(){
    // console.log('res.检查洗车机状态'+JSON.stringify(this.data.washer_id))
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
        this.createOrder();
      }
    },err=>{
      wx.hideLoading();
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //创建订单
  createOrder: function(){
    wx.showLoading({title: '提交订单...', icon: 'none', mask: true});
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.createOrder,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        const resData = {
          washer_id:washer_id,
          order_no:res.order_no,
          station_name:res.station_name,
          order_amount:res.order_amount,
          wash_coupon_count:res.wash_coupon_count,
        }
        wx.setStorageSync(CODE_WASHER, false);
        wx.setStorageSync(FROM_CODE, false);
        wx.setStorageSync(WASHER_ID, '');
        const params = encodeURIComponent(JSON.stringify(resData));
        wx.navigateTo({url:`/pages/stations/clean/clean-order/clean-order?params=${params}`});
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

//检查洗车机距离
  onCleanClick:function(){
    const {washer_id,center_lng,center_lat} = this.data;
    const paramsData = {
      washer_id:washer_id,
      center_lng:center_lng,
      center_lat:center_lat,
    }
    getHttpPost(cleanApi.distance,paramsData,res=>{
      wx.hideLoading();
      this.getOrder();
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      wx.setStorageSync(STATIONPAGE, 1);
      wx.switchTab({url: `/pages/stations/index/index`})
    });
  },
})
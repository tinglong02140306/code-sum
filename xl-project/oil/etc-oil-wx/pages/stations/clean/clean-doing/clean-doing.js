// pages/stations/clean/clean-doing/clean-doing.js
import {OPENID} from "../../../../constants/global";
import {getHttpPost} from "../../../../http/http";
import {cleanApi} from "../../../../http/api";
import {getCurrentDataTime, getDifferenceTime} from "../../../../utils/util";
const app = getApp();
let params = null;
let washerTimer = null;//获取洗车机状态的定时任务
let setTimer = null;//洗车计时定时任务
let stopTimer = null;//洗车8分钟停止任务
const navigationBarHeight = app.globalData.navigationBarHeight+90;
const topHeight = 60;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stopTime:480000,//洗车8分钟
    cleanTime:'08:00',
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0,  // 秒
    animationData: {},
    washer_id:'',
    order_no:'',
    isFinish:false,
    rangeHeight: `${navigationBarHeight}px`,
    // scroll_height:`calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx - 20rpx)`,

  },

  //停止
  onConfirmClick: function (e) {
    // let item = e.detail;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要停止洗车机吗？',
      confirmColor: '#05BA7D',
      success: function (res) {
        if (res.confirm) {
          if (!that.data.isFinish){
            that.stopWasher();
          }
        }
      }
    });
  },

  onBackClick: function(){
    const pages = getCurrentPages();
    if(pages.length>=2){
      const prePage = pages[pages.length-2];
      if(prePage.route=="pages/stations/clean/clean-notice/clean-notice"){//订单界面
        wx.navigateBack({delta: 3})
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
        start_time:params.start_time,
      });
      if (params.start_time){
        this.computationTime(params.start_time);
      }else {
        this.getSetTimer();
        this.getWasherTimer();
      }
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  //计算已经洗车时间
  computationTime:function (start_time){
    const {washer_id,order_no} = this.data;
    let alreadyTime = getDifferenceTime(start_time,getCurrentDataTime());
    console.log('当前时间'+getCurrentDataTime())
    console.log('start_time'+start_time)
    console.log('alreadyTime'+alreadyTime)
    if (alreadyTime[0]||alreadyTime[1]||alreadyTime[2]||alreadyTime[3]||alreadyTime[4]>7){
      //超过8分钟
      const resData = {
        washer_id:washer_id,
        order_no:order_no,
        status:'01',
      }
      this.removeCache();
      const details = encodeURIComponent(JSON.stringify(resData));
      wx.navigateTo({url:`/pages/stations/clean/clean-result/clean-result?params=${details}`});
    }else {
      //8分钟以内 还在洗车
      this.setData({
        hours: alreadyTime[3],   // 时
        minute: alreadyTime[4]<10?'0' + alreadyTime[4]:alreadyTime[4],   // 分
        second: alreadyTime[5]<10?'0' + alreadyTime[5]:alreadyTime[5],  // 秒
        stopTime:480000-alreadyTime[4]*60*1000-alreadyTime[4]*1000,
      })
      this.getSetTimer();
      this.getWasherTimer();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    this.getOrder();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(washerTimer);
    // washerTimer=null;
    // clearInterval(setTimer);
    // setTimer=null;
    // clearInterval(stopTimer);
    // stopTimer=null;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(washerTimer);
    washerTimer=null;
    clearInterval(setTimer);
    setTimer=null;
    clearInterval(stopTimer);
    stopTimer=null;
  },

  /**
   * 每3s获取一次洗车状态
   */
  getWasherTimer:function(){
    // this.onCleanCheck();
    washerTimer&&clearInterval(washerTimer);
    washerTimer=null;
    washerTimer = setInterval(()=>{
      this.onCleanCheck();
    },3000);
  },

  /**
   * 洗车-8分钟计时
   */
  getSetTimer:function(){
    const {washer_id,order_no} = this.data;
    this.setInterval();
    stopTimer&&clearInterval(stopTimer);
    stopTimer=null;
    stopTimer = setTimeout(()=>{
      // 8分钟计时完成
      clearInterval(washerTimer);
      washerTimer=null;
      clearInterval(stopTimer);
      stopTimer=null;
      clearInterval(stopTimer);
      stopTimer=null;
      const resData = {
        washer_id:washer_id,
        order_no:order_no,
        status:'01',
      }
      this.removeCache();
      const details = encodeURIComponent(JSON.stringify(resData));
      wx.navigateTo({url:`/pages/stations/clean/clean-result/clean-result?params=${details}`});
    },this.data.stopTime);
  },

  //检查洗车机状态
  onCleanCheck:function(){
    const {washer_id,order_no} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.check,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        if (res.washer_status !== '2'){
          this.setData({isFinish:true});
          clearInterval(washerTimer);
          washerTimer=null;
          clearInterval(setTimer);
          setTimer=null;
          clearInterval(stopTimer);
          stopTimer=null;
          const resData = {
            washer_id:washer_id,
            order_no:order_no,
            status:'01',
          }
          this.removeCache();
          const details = encodeURIComponent(JSON.stringify(resData));
          wx.navigateTo({url:`/pages/stations/clean/clean-result/clean-result?params=${details}`});
        }
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //停止洗车
  stopWasher: function(){
    wx.showLoading({
      title: '正在停止...',
      icon: 'none',
      mask: true
    })
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {order_no,washer_id} = this.data;
    const paramsData = {
      order_no:order_no,
    }
    getHttpPost(cleanApi.stop,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        this.setData({isFinish:true});
        clearInterval(washerTimer);
        washerTimer=null;
        clearInterval(setTimer);
        setTimer=null;
        clearInterval(stopTimer);
        stopTimer=null;
        const resData = {
          washer_id:washer_id,
          order_no:order_no,
          status:'01',
        }
        this.removeCache();
        const details = encodeURIComponent(JSON.stringify(resData));
        wx.navigateTo({url:`/pages/stations/clean/clean-result/clean-result?params=${details}`});
      } else {
        wx.hideLoading();
        wx.showToast({title:res.msg,icon:"none"});
        const resData = {
          washer_id:washer_id,
          order_no:order_no,
          status:'02',
        }
        const details = encodeURIComponent(JSON.stringify(resData));
        wx.navigateTo({url:`/pages/stations/clean/clean-result/clean-result?params=${details}`});
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //删除用户在该洗车点的订单缓存
  removeCache:function(){
    const {washer_id,order_no} = this.data;
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

  // 计时器
  setInterval: function () {
    const {rangeHeight} = this.data;
    const that = this;
    let second = that.data.second;
    let minute = that.data.minute;
    let hours = that.data.hours;

    let animationData = wx.createAnimation({
      duration: 1000, // 默认为400     动画持续时间，单位ms
      timingFunction: 'ease',
      //transformOrigin: '4px 91px'
    });
        setTimer = setInterval(function () {  // 设置定时器
          second++
          //动画的脚本定义必须每次都重新生成，不能放在循环外
          animationData.translateY(260).step({ duration: 2000 }).translateY(0).step({ duration: 1000 });
      // 更新数据
      that.setData({
        animationData: animationData.export(),
      })

      if (second >= 60) {
        second = 0  //  大于等于60秒归零
        minute++
        if (minute >= 60) {
          minute = 0  //  大于等于60分归零
          hours++
          if (hours < 10) {
            // 少于10补零
            that.setData({
              hours: '0' + hours
            })
          } else {
            that.setData({
              hours: hours
            })
          }
        }
        if (minute < 10) {
          // 少于10补零
          that.setData({
            minute: '0' + minute
          })
        } else {
          that.setData({
            minute: minute
          })
        }
      }
      if (second < 10) {
        // 少于10补零
        that.setData({
          second: '0' + second
        })
      } else {
        that.setData({
          second: second
        })
      }
    }, 1000)
  },
//检查用户在该洗车点的订单信息
  getOrder:function(){
    console.log('洗车点的订单信息'+JSON.stringify(this.data.details))
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.getOrder,paramsData,res=>{
      if (res.result_code === "00000") {
        if (res.order_status === '1'){
          //支付成功<=启动洗车机
          // wx.navigateBack();
        }else if (res.order_status === '2'){
          //消费成功<=洗车中
          // wx.navigateBack();
        }else {
          //继续执行
          // this.onCleanCheck();
          this.onBackClick();
        }
      }
    },err=>{
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
})
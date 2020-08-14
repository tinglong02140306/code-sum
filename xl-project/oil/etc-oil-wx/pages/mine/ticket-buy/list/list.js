// pages/mine/ticket-buy/list/list.js\
import {couponPackageApi,invoiceApi} from '../../../../http/api';
import {getHttpPost} from '../../../../http/http';
import {keepDecimalFull,keepTwoDecimalFull,dateFormat,getDifferTime,formatTimes,GetPercent} from "../../../../utils/util";
import {getLocation} from '../../../../utils/location';

const app = getApp();
let page_num = 1;
const PAGESIZE = 10;
const navigationBarHeight = app.globalData.navigationBarHeight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area_code:'370100',
    is_empty:false,
    card_list:[],
    is_refresh:false,
    show_finish:false,
    load_status:0,//上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher:true,//下拉刷新状态
    status:0,//1:列表为空 2:网络连接失败
    // rush_time:'01:22:31'
    timeLimitCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let card_list = this.data.card_list;
    card_list.map((item)=>{
      clearInterval(item.timer)
    })
    this.setData({card_list:card_list})
    this.getLocationInfo()
  },

  onHide: function () {
    let card_list = this.data.card_list;
    card_list.map((item)=>{
      clearInterval(item.timer)
    })
    this.setData({card_list:card_list})
  },

  /**
   * 点击详情
   */
  onCellClick:function(e){
    const details = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/mine/ticket-buy/details/details?details='+encodeURIComponent(JSON.stringify(details))
    })
  },
  /**
   * 列表查询
   */
  getCouponPackageList:function(){
    wx.showLoading({
      title: '加载中...',
      icon: 'none',
      mask: true
    })
    const params = {
      // page_num:page_num,
      // page_size:PAGESIZE
      area_code:this.data.area_code
    }
    getHttpPost(couponPackageApi.list,params,res=> {
    // getHttpPost(couponPackageApi.list,{},res=> {
      wx.hideLoading();
      // this.dealResponse(res.data);
      const data = this.dealResponse(res.data);
      const list = page_num==1?data:this.data.card_list.concat(data);
      this.setData({
        card_list:list,
        isEmpty:list&&list.length?false:true,
        refresher:false,
        load_status:data.length<PAGESIZE?2:0,
        status:list&&list.length?0:1,
        load_page:2
      });
    },err=> {
      wx.hideLoading();
      wx.showToast({title: err.msg, icon: "none"});
      let status = this.data.card_list == null && err.code == 10 ? 2 : 0;
      this.setData({
        refresher: false,
        status: status,
        load_status: err.code == 10 ? 0 : this.data.load_status
      })
    })
  },

  //下拉刷新
  onRefresh:function(){
    page_num = 1;
    this.setData({refresher:true})
    this.getCouponPackageList();

  },

  //加油上拉加载更多
  onLoadMore:function(){
    page_num++;
    this.setData({load_status:1})
    this.getCouponPackageList();
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    page_num = 1;
    this.getCouponPackageList();
  },

  /**
   * 数据处理
   */
  dealResponse:function(data){
    let current = new Date().getTime() / 1000;

     return  data&&data.map((item,index)=>{
      let discount = item.discount_rate.toString().replace('0','').replace('.','');
      item.discount_rate = discount.replace('0','');
      item.distance_meter = keepDecimalFull(item.distance_meter,1);
      item.package_price = keepTwoDecimalFull(item.package_price);
      item.description = item.description.replace(/[\r\n]/g,"");
      // item.oil_consume_money = keepTwoDecimalFull(item.oil_consume_money);
      // item.percent = GetPercent(item.saled_count,item.total_count);
      item.percent = (item.saled_count/item.total_count)*100;

      // let random = Math.random().toFixed(2) * 10000;

      if (item.time_limit_flag){//限时
        if (item.start_flag){//开始
          // item.leftTime = item.end_time ? getDifferTime(item.end_time) : 0;
          // item.show_time = item.end_time ? formatTimes(item.leftTime) : "00:00:00";
          // if(item.leftTime) timeLimitCount++;
          let random = item.end_time ? getDifferTime(item.end_time) : getDifferTime('23:59:59');
          item.timer = setInterval(() => {
            //截止时间
            let time = current + random;
            time--;
            let now = new Date().getTime();
            let diff = parseInt(time - now / 1000);
            if (diff < 0) {
              let card_list = this.data.card_list;
              clearInterval(item.timer)
              this.setData({card_list})
            } else {
              let date = this.formattime(diff * 1000);
              item.show_time = date;
              this.setData({card_list: data});
            }
          }, 1000)
        }else {
          // item.leftTime = item.start_time ? getDifferTime(item.start_time) : 0;
          // item.show_time = item.start_time ? formatTimes(item.leftTime) : "00:00:00";
          // if(item.leftTime) timeLimitCount++;
          let random = item.start_time ? getDifferTime(item.start_time) : getDifferTime('23:59:59');
          item.timer = setInterval(() => {
            //截止时间
            let time = current + random;
            time--;
            let now = new Date().getTime();
            let diff = parseInt(time - now / 1000);
            if (diff < 0) {
              let card_list = this.data.card_list;
              clearInterval(item.timer)
              this.setData({card_list})
            } else {
              let date = this.formattime(diff * 1000);
              item.show_time = date;
              this.setData({card_list: data});
            }
          }, 1000)
        }
      }
      return item;
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取当前的位置信息
  getLocationInfo:function(){
    location = app.globalData.location;
    if(location){
      const {area_code} = location;
      this.setData({
        area_code:area_code,
      });
      this.getCouponPackageList();
    }else{
      getLocation(true,location=>{
        this.setData({
          area_code:location.area_code,
        });
        app.globalData.location = location;
        this.getCouponPackageList();
      },err=>{
        wx.showToast({
          title:err,
          icon:"none"
        });
      });
    }
  },

  // 时间倒计时
  countDown() {
    let { card_list, timeLimitCount } = this.data,
        step = 1000,
        that = this,
        leftTime = "";
    var timer = setInterval(function () {
      card_list && card_list.map((item, key) => {
        leftTime = item.leftTime;
        if(item.time_limit_flag) {
          if(leftTime > 0) {
            item.leftTime = leftTime - 1;
            item.show_time = formatTimes(item.leftTime);
          } else {
            item.leftTime = 0;
            card_list.splice(key, 1)
          }
        }
        return item;
      });
      let interList = card_list && card_list.filter((item) => {
        return item.time_limit_flag && item.leftTime < 0;
      })
      if(interList.length == timeLimitCount) clearInterval(timer);//清空计时
      that.setData({
        card_list: card_list
      });
    }, step);
  },

  //时间计算处理
  formattime(time) {
    let leave1 = time % (24 * 3600 * 1000) //计算小时
    let hour = Math.floor(leave1 / (3600 * 1000))

    let leave2 = leave1 % (3600 * 1000) //计算分钟
    let minute = Math.floor(leave2 / (60 * 1000))

    let leave3 = leave2 % (60 * 1000) //计算秒
    let second = Math.round(leave3 / 1000) == '60' ? '00' : Math.round(leave3 / 1000)
    return [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
})
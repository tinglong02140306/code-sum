// pages/mine/ticket-buy/details/details.js
import {getHttpPost} from "../../../../http/http";
import {cleanApi, couponPackageApi} from "../../../../http/api";
import {getLocation} from "../../../../utils/location";
import {OPENID, STATIONPAGE} from "../../../../constants/global";
import {getDifferTime, GetPercent, keepDecimalFull, keepTwoDecimalFull} from '../../../../utils/util';
const app = getApp();
let timer = null;
let params = null;
let location = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmptyList:false,
    amount:0,
    details:{},
    clean_list:[],
    clean_data:{},
    center_lng:117.12009,//默认经度
    center_lat:36.65184,//默认纬度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    location = app.globalData.location;
    if(location){
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
      this.setData({load_page_oil:1});
      this.getCleanList();
    }else{
      //获取当前位置的经纬度信息
      getLocation(true,location=>{
        this.setData({
          center_lng:location.longitude,
          center_lat:location.latitude,
        });
        this.getCleanList();
      },err=>{
        wx.showToast({
          title:err,
          icon:"none"
        });
        this.getCleanList();
      });
    }

    try {
      params = JSON.parse(decodeURIComponent(options.details));
      this.setData({details:this.dealResponse(params)});
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  onShow: function () {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
  },

  onHide:function(){
    // timer&&clearTimeout(timer);
    timer&&clearInterval(timer);
  },

  //全部洗车站点
  onAllClick: function(){
    wx.setStorageSync(STATIONPAGE, 1);
    wx.switchTab({url: '/pages/stations/index/index'});
  },

  //洗车机详情
  onDetailsClick: function(){
    const {clean_data} = this.data;
    const details = encodeURIComponent(JSON.stringify(clean_data));
    wx.navigateTo({url:`/pages/stations/clean/clean-details/clean-details?params=${details}`});
  },

  //导航
  onNavigateClick: function(){
    const {clean_data} = this.data;
    wx.openLocation({
      latitude:clean_data.lat_tx,
      longitude:clean_data.lng_tx,
      name:clean_data.washer_name,
      address:clean_data.washer_address
    });
  },

  //购买
  onSubmitClick: function(){
    const { details } = this.data;
    wx.showLoading({
      title: "请稍候...",
      mask: true
    });
    const params = {
      package_id: details.package_id,
      wash_order_no:null,
    };
    getHttpPost(couponPackageApi.order, params, response => {
      wx.hideLoading();
      this.goPay(response.pay_params)

      // if (response.need_pay) {
      //   this.goPay(response.pay_params)
      // }else{
      //   wx.hideLoading();
      //   wx.showToast({
      //     title: "支付成功",
      //     icon: 'none'
      //   });
      //   timer = setTimeout(()=>{
      //     wx.navigateBack({delta: 2})
      //   },1400);
      // }
    },err => {
      wx.hideLoading();
      wx.showToast({
        title: `${err.msg}:${err.code}`,
        icon: 'none'
      });
    });
  },

  //调起支付
  goPay: function (params) {
    const that=this;
    try {
      const data = JSON.parse(params);
      wx.requestPayment(
          {
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function () {
              // wx.navigateBack({delta: 2})
              // wx.navigateBack();
              that.paySuccess();
            },
            fail: function (err) {
              console.log(err)
            },
            complete: function () {

            }
          })
    } catch (err) {
      console.log(err);
      wx.showToast({title:"参数格式错误",icon:"none"});
    }
  },

  //购买完成
  paySuccess:function(){
    wx.showModal({
      title: '购买成功',
      content: '购买成功，优惠券已发放，请前往我的-优惠券查看',
      success (res) {
        if (res.confirm) {
          wx.navigateBack();
        } else if (res.cancel) {
          wx.navigateBack();
        }
      }
    })
  },

  //洗车查询
  getCleanList:function(){
    const {center_lng, center_lat} = this.data;
    const params = {
      page_num:1,
      page_size:1,
      center_lng:center_lng,
      center_lat:center_lat,
      washer_status:null,
      able_parking:null,
    }
    wx.showLoading({title:"正在加载...",mask:true})
    getHttpPost(cleanApi.list,params,res=>{
      wx.hideLoading();
      this.dealNearCleanInfo(res.data&&res.data[0]);
      this.setData({
        amount:res.amount,
        isEmptyList:res.data&&res.data.length?false:true,
      });
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      this.setData({
        isEmptyList:true,
      })
    });
  },

  //处理最近洗车机数据
  dealNearCleanInfo:function(near){
    if(near){
      near.distance_meter = keepDecimalFull(near.distance_meter,1);
      near.washer_price = keepDecimalFull(near.washer_price,0).replace('.','');
      // near.washer_price = keepDecimalFull(near.washer_price,1);
      // console.log('near===='+JSON.stringify(near))
    }
    this.setData({
      clean_list:near,
      clean_data:near,
    });
  },
  /**
   * 数据处理
   */
  dealResponse:function(item){

    let current = new Date().getTime() / 1000;
    if (item.time_limit_flag){//限时
      if (item.start_flag){//开始
        let random = item.end_time ? getDifferTime(item.end_time) : getDifferTime('23:59:59');
        item.timer = setInterval(() => {
          //截止时间
          let time = current + random;
          time--;
          let now = new Date().getTime();
          let diff = parseInt(time - now / 1000);
          if (diff < 0) {
            let details = this.data.details;
            clearInterval(item.timer)
            this.setData({details})
          } else {
            let date = this.formattime(diff * 1000);
            item.show_time = date;
            this.setData({details: item});
          }
        }, 1000)
      }else {
        let random = item.start_time ? getDifferTime(item.start_time) : getDifferTime('23:59:59');
        item.timer = setInterval(() => {
          //截止时间
          let time = current + random;
          time--;
          let now = new Date().getTime();
          let diff = parseInt(time - now / 1000);
          if (diff < 0) {
            let details = this.data.details;
            clearInterval(item.timer)
            this.setData({details})
          } else {
            let date = this.formattime(diff * 1000);
            item.show_time = date;
            this.setData({details: item});
          }
        }, 1000)
      }
    }
    return item;
    // return  data&&data.map((item,index)=>{
    //   let discount = item.discount_rate.toString().replace('0','').replace('.','');
    //   item.discount_rate = discount.replace('0','');
    //   item.distance_meter = keepDecimalFull(item.distance_meter,1);
    //   item.package_price = keepTwoDecimalFull(item.package_price);
    //   item.description = item.description.replace(/[\r\n]/g,"");
    //   // item.oil_consume_money = keepTwoDecimalFull(item.oil_consume_money);
    //   item.percent = GetPercent(item.saled_count,item.total_count);
    //
    //   // let random = Math.random().toFixed(2) * 10000;
    //   return item;
    // })
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
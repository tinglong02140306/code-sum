// pages/home/index/index.js
import {weather} from '../../../constants/weather';
import {getLocation} from '../../../utils/location';
import {cleanApi, homeApi} from '../../../http/api';
import {getHttpPost, getPostPromise} from '../../../http/http';
import {keepDecimalFull, checkUrl} from '../../../utils/util';
import {StationPhotoDefault} from '../../../assets/url/url';
import {OPENID, WEATHER_INFO, WEATHER_TIME} from '../../../constants/global';
const app = getApp();
let location = null;
let page_num_rights = 1;
let page_size_rights = 15;
let OIL_NO = "92#";
let flag = 0;//标志位 网络请求进度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"济南",//默认当前城市
    province:"山东省",
    area_code:'370100',
    center_lng:117.12009,//默认经度
    center_lat:36.65184,//默认纬度
    weathers:null,//天气状况
    gboilPrices:[],//国标油价
    gboilScroll:[],//用于视图展示的国标油价
    banners:[],//轮播图
    banner_current:0,
    near:null,//最近的油站
    nearPrices:[],//最近的油站 所有油品及价格
    nearCurrent:null,//最近的油站 展示的价格
    nearOilType:OIL_NO,//最近的油站 展示的油品类型 默认值
    nearCurrentIndex:0,
    rights:[],//权益
    load_status:0, //刷新控件状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher:false,
    loading:0,//页面状态 1:正在加载... 2:加载完成 3:网络问题
    open_id:"",
    navigationBarHeight:app.globalData.navigationBarHeight,
    icon_default_station:StationPhotoDefault,
    icon_default_wash:'https://oss.etcsd.com/object/69342d074c0c4b40a26cc8ef959e851a'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocationInfo();
  },

  onShow:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({open_id:openid});
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
      const {city, longitude, latitude, province, area_code} = location;
      this.setData({
        city:city,
        area_code:area_code,
        center_lng:longitude,
        center_lat:latitude,
        province:province
      });
      this.setData({loading:1});
      this.getAllInfo();
    }else{
      getLocation(true,location=>{
        this.setData({
          city:location.city,
          area_code:location.area_code,
          center_lng:location.longitude,
          center_lat:location.latitude,
          province:location.province
        });
        app.globalData.location = location;
        this.setData({loading:1});
        this.getAllInfo();
      },err=>{
        wx.showToast({
          title:err,
          icon:"none"
        });
      });
    }
  },

  //油价提醒
  onRemindClick:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['zKGezbrE32Mgqv4EiT2j6wW2WY6afaE7_oLB2JI1qyc'],
      success:res=>{
        console.log(res);
      },
      fail:err=>{
        console.log(err);
      }
    })
  },

  //轮播图点击事件
  onBannerItemClick:function(e){
    const {target_url} = e.currentTarget.dataset.item;
    if(target_url){
      if(!checkUrl(target_url)){//本地路径
        if (target_url == '/pages/stations/index/index'||target_url == '/pages/mine/test/test'){
          wx.switchTab({url: target_url});
        }else {
          if (wx.getStorageSync(OPENID)){
            wx.navigateTo({url: target_url});
          }else {
            wx.navigateTo({url:`/pages/login/login`});
          }
        }
      }
    }
  },

  //banner滚动监听
  onBannersChange:function(e){
    this.setData({banner_current:e.detail.current});
  },

  //改变油品类型
  onOilNoChange:function(e){
    const {value} = e.detail;
    const {nearPrices} = this.data;
    if(nearPrices&&nearPrices.length){
      this.setData({
        nearCurrent:nearPrices[value],
        nearCurrentIndex:value,
        nearOilType:nearPrices[value]&&nearPrices[value].oil_no
      });
    }
  },

  //选择油品类型时 拦截事件 
  onOilNoPicker:function(){},

  //油站详情
  onOilDetailClick:function(){
    const {near,nearOilType} = this.data;
    near.current_oil_no = nearOilType;
    // this.setData({open_id:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      const params = encodeURIComponent(JSON.stringify(near));
      wx.navigateTo({url:`/pages/stations/details/details?params=${params}`});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //立即加油
  onOilClick:function(){
    const {near, nearOilType} = this.data;
    const supports = near.support_payments;
    // this.setData({open_id:wx.getStorageSync(OPENID)});
    near.current_oil_no = nearOilType;
    let details = encodeURIComponent(JSON.stringify(near));
    if (wx.getStorageSync(OPENID)){
      if(supports&&supports.includes("ONE_KEY")){//支持一键加油
        wx.navigateTo({url:`/pages/stations/fast-oil/fast-oil?details=${details}`});
      }else{//二维码加油
        wx.navigateTo({url:`/pages/stations/qrcode/qrcode?params=${details}`});
      }
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }

  },
  //洗车机详情
  onCleanDetailClick:function(){
    const {nearClean} = this.data;
    this.setData({open_id:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      const details = encodeURIComponent(JSON.stringify(nearClean));
      wx.navigateTo({url:`/pages/stations/clean/clean-details/clean-details?params=${details}`});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },
  //立即洗车
  onCleanClick:function(){
    if (wx.getStorageSync(OPENID)){
      this.onCleanCheck();
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //权益 银行优惠 item点击
  onRightItemClick:function(e){
    this.setData({open_id:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      let item = e.currentTarget.dataset.item;
      let url = item.sub_activity_url;//子活动页面url
      const params = encodeURIComponent(JSON.stringify(item));
      if(url){
        wx.navigateTo({url:`/pages/home/rights/rights?params=${params}`})
      }else{//活动暂未上线
        wx.showToast({
          title:"活动即将上线,敬请期待",
          icon:"none"
        })
      }
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //获取国标油价
  getGboilPrice:function(province_name,area_code){
    const params = {
      province_name:province_name,
      area_code:area_code
    }
    getPostPromise(homeApi.gboilprice,params).then(res=>{
      flag++;
      this.dealStatus()
      let array = [];
      const length = Math.ceil(res.data.length/2);
      for(let i=0; i<length; i++){
        const item = res.data.slice(i*2,i*2+2);
        array.push(item);
      }
      this.setData({gboilScroll:array});
    }).catch(err=>{
      flag++;
      this.dealStatus()
      console.log(err);
    });
  },

  //获取当前城市天气信息
  getWeatherInfo:function(city){
    let weatherStr = wx.getStorageSync(WEATHER_INFO);
    let preTime = wx.getStorageSync(WEATHER_TIME)||0;
    let currentTime = new Date().getTime();
    let diff = currentTime - parseFloat(preTime);
    let hours = Math.floor(diff/(3600*1000));
    if(hours>1){//时间间隔大于1小时 再次请求天气
      console.log("时间间隔大于1小时");
      getPostPromise(homeApi.weather,{area_name:city}).then(res=>{
        console.log('res==='+res)
        console.log('res.wash_car_index==='+res.wash_car_index)
        res.sd = res.sd&&res.sd.substring(0,res.sd.length-1);
        // res.color = res.sd<20?"#00A170":res.sd<40?"#88D600":res.sd<60?"#F59F00":res.sd<80?"#FF5311":"#FF0000";
        res.color = res.wash_car_index=='适宜'?"#00A170":res.wash_car_index=='较适宜'?"#88D600":res.wash_car_index=='较不宜'?"#F59F00":res.wash_car_index=='较不适宜'?"#F59F00":res.wash_car_index=='不适宜'?"#FF5311":res.wash_car_index=='不宜'?"#FF0000":"#88D600";
        flag++;
        this.dealStatus();
        this.setData({weathers:res});
        wx.setStorageSync(WEATHER_INFO,JSON.stringify(res));
        wx.setStorageSync(WEATHER_TIME,currentTime);
      }).catch(err=>{
        console.log(`${err.msg}:${err.code}`);
        flag++;
        this.dealStatus();
        this.setData({weathers:weatherStr?JSON.parse(weatherStr):weather});
      });
    }else{
      flag++;
      this.dealStatus();
      this.setData({weathers:weatherStr?JSON.parse(weatherStr):weather});
    }
  },

  //获取轮播图
  getBanners:function(area_code){
    const params = {area_code:area_code,purpose:"WXAPPLET"}
    getPostPromise(homeApi.banner,params).then(res=>{
      flag++;
      this.dealStatus()
      this.setData({banners:res.data||[]});
      console.log(res.data);
    }).catch(err=>{
      flag++;
      this.dealStatus()
      console.log(err);
    });
  },

  //获取最近加油站
  getNearStation:function(center_lng,center_lat){
    const params = {
      page_num:1,
      page_size:1,
      center_lng:center_lng,
      center_lat:center_lat,
      oil_type_name:OIL_NO,
      sort_class:1,
      gasoline_brand:'all',
      source:"WXAPPLET"
    }
    getPostPromise(homeApi.near,params).then(res=>{
      this.dealNearInfo(res.data&&res.data[0]);
      flag++;
      this.dealStatus()
    }).catch(err=>{
      flag++;
      this.dealStatus()
      console.log(err);
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
    });
  },

  //获取最近洗车机
  getNearClean:function(center_lng,center_lat){
    const params = {
      page_num:1,
      page_size:1,
      center_lng:center_lng,
      center_lat:center_lat,
      washer_status:null,
      able_parking:null,
    }
    getPostPromise(cleanApi.list,params).then(res=>{
      this.dealNearCleanInfo(res.data&&res.data[0]);
      flag++;
      this.dealStatus()
    }).catch(err=>{
      flag++;
      this.dealStatus()
      console.log(err);
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
    });
  },

  //获取权益 银行优惠
  getRights:function(area_code){
    const params = {
      page_num:page_num_rights,
      page_size:page_size_rights,
      area_code:area_code
    }
    getPostPromise(homeApi.rights,params).then(res=>{
      flag++;
      this.dealStatus()
      this.setData({
        rights:res.data,
        load_status:res.data&&res.data.length<page_size_rights?2:0
      });
    }).catch(err=>{
      flag++;
      this.dealStatus()
      console.log(err);
    });
  },

  //获取推荐页面所有网络数据
  getAllInfo:function(){
    flag = 0;
    const {center_lng, center_lat,city,area_code,province} = this.data;
    wx.showLoading({title:"正在加载中...",mask:true});
    this.getWeatherInfo(city);
    this.getGboilPrice(province,area_code);
    this.getNearStation(center_lng, center_lat);
    this.getNearClean(center_lng, center_lat);
    this.getBanners(area_code);
    this.getRights(area_code);
  },

  //处理最近洗车机数据
  dealNearCleanInfo:function(near){
    if(near){
      near.distance_meter = keepDecimalFull(near.distance_meter,1);
      near.washer_price = keepDecimalFull(near.washer_price,0).replace('.','');
      // near.washer_price = keepDecimalFull(near.washer_price,1);
      // console.log('near===='+JSON.stringify(near))
      this.setData({
        nearClean:near,
      });
    }
  },

  //处理最近加油站的价格信息
  dealNearInfo:function(near){
    if(near){
      near.distance = keepDecimalFull(near.distance,1);
      near.station_price = near.station_price&&near.station_price.map(item=>{
        item.xl_price = keepDecimalFull(item.xl_price,2);
        item.list_price = item.list_price||item.gb_price||'';
        item.list_price = item.list_price?keepDecimalFull(item.list_price,2):'';
        item.gb_price = keepDecimalFull(item.gb_price,2);
        item.oil_price_difference = item.oil_price_difference>0?keepDecimalFull(item.oil_price_difference,2):"";
        return item;
      });
      let currentObj = near.current_station_price;
      if(currentObj){
        currentObj.xl_price = keepDecimalFull(currentObj.xl_price,2);
        currentObj.list_price = currentObj.list_price||currentObj.gb_price||'';
        currentObj.list_price = currentObj.list_price?keepDecimalFull(currentObj.list_price,2):'';
        currentObj.gb_price = keepDecimalFull(currentObj.gb_price,2);
        currentObj.oil_price_difference = currentObj.oil_price_difference>0?keepDecimalFull(currentObj.oil_price_difference,2):'';
        this.setData({
          nearCurrent:currentObj,
          nearCurrentIndex:this.getOilPrice(OIL_NO,near.station_price).index
        });
      }
      this.setData({
        near:near,
        nearPrices:near.station_price
      });
    }
  },

  //获取油品类型对应的价格及差价信息
  getOilPrice:function(oil_type,prices){
    if(prices){
      for(let i=0; i<prices.length; i++){
        const item = prices[i];
        if(item.oil_no==oil_type){
          item.index = i;
          item.list_price = item.list_price||item.gb_price;
          return item;
        }
      }
    }
    return "";
  },

  //下拉刷新
  onRefresh:function(){
    // page_num_rights = 1;
    // flag = 0;
    // this.getAllInfo();
    getLocation(true,location=>{
      this.setData({
        city:location.city,
        area_code:location.area_code,
        center_lng:location.longitude,
        center_lat:location.latitude,
        province:location.province
      });
      app.globalData.location = location;
      this.setData({loading:1});
      page_num_rights = 1;
      flag = 0;
      this.getAllInfo();
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
    });
  },

  //加载更多 银行优惠信息
  onLoadMore:function(){
    page_num_rights++;
    this.setData({load_status:1});
    this.getRights(this.data.area_code).then(res=>{
      const list = this.data.rights.concat(res.data);
      this.setData({
        rights:list,
        load_status:list.length<page_size_rights?2:0
      });
    },err=>{
      wx.showToast({title:err.msg,icon:"none"});
      this.setData({load_status:0});
    });
  },

  dealStatus:function(){
    if(flag==5){
      wx.hideLoading();
      this.setData({
        loading:2,
        refresher:false
      });
    }
  },
  //立即洗车=》检查洗车机距离
  onCleanCheck:function(){
    wx.showLoading({
      title: '请稍候...',
      icon: 'none',
      mask: true
    })
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {nearClean,center_lng,center_lat} = this.data;
    const paramsData = {
      washer_id:nearClean.washer_id,
      center_lng:center_lng,
      center_lat:center_lat,
    }
    getHttpPost(cleanApi.distance,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        const details = encodeURIComponent(JSON.stringify(nearClean));
        wx.navigateTo({url:`/pages/stations/clean/park-confirm/park-confirm?params=${details}`});
      }
    },err=>{
      wx.hideLoading();
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
})
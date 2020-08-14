// pages/stations/index/index.js
import {getLocation} from '../../../utils/location';
import {stationsApi,cleanApi} from '../../../http/api';
import {getHttpPost, getPostPromise} from '../../../http/http';
import {oils, sort, brands, clean_sort, clean_enable, clean_status, oil_filter_tabs, clear_filter_tabs} from '../constants';
import {keepDecimalFull} from '../../../utils/util';
import {StationToMap} from '../../../assets/url/url.js';
import {OPENID,STATIONPAGE} from '../../../constants/global';
const app = getApp();
let location = null;
let page_num_oil = 1;
const page_size_oil = 15;
let page_num_clean = 1;
const page_size_clean = 15;
const navigationBarHeight = app.globalData.navigationBarHeight;
const tabHeight = 84;
let params = null;

Page({

  /**onMapClick
   * 页面的初始数据
   */
  data: {
    center_lng:117.12009,//默认经度
    center_lat:36.65184,//默认纬度
    oil_type_name:oils[0].id,//加油 油品类型
    oil_sort_class:sort[0].id,//加油 1-距离，2-油价
    oil_brand:brands[0].id,//加油 品牌
    clean_sort_class:clean_sort[0].id,//洗车 1-距离，2-价格
    able_parking:clean_enable[0].id,//洗车 1-全部 2-可停车
    washer_status:clean_status[0].id,//洗车 1-正常，null全部
    station_list:null,//油站列表
    clean_list:null,//洗车列表
    tabs_oil:oil_filter_tabs,//加油筛选条件
    tabs_clean:clear_filter_tabs,//洗车筛选条件
    load_status_oil:0,//刷新控件 油站上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    load_status_clean:0,//刷新控件 洗车上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    load_page_oil:0,//页面加载状态 1:加载中 2:加载完成
    refresher_oil:false,//加油下拉刷新状态
    refresher_clean:false,//洗车下拉刷新状态
    oil_status:0,//1:油站列表为空 2:网络连接失败 
    clean_status:0,//1:洗车列表为空 2:网络连接失败 
    page_type:wx.getStorageSync(STATIONPAGE)||0,//0:加油 1:洗车 2:停车
    // page_type:0,//0:加油 1:洗车 2:停车
    bar_list:["加油","洗车"],
    tab_height:tabHeight,
    icon_station_to_map:StationToMap,
    openid:"",
    drop_down_height:`calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx)`,
    scroll_height:`calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx - 20rpx)`,
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {page_type} = wx.getStorageSync(STATIONPAGE);
    //获取当前位置的经纬度信息
    getLocation(true,location=>{
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
      if (page_type == 1){
        this.setData({load_page_clean:1});
        this.getCleanList();
      }else {
        this.setData({load_page_oil:1});
        this.getStations();
      }
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
      this.getStations();
    });
  },

  onShow:function(){
    let page = wx.getStorageSync(STATIONPAGE);
    this.setData({page_type:page})
    if (page&&this.data.clean_list==null){
      this.setData({load_page_clean:1});
      this.getCleanList();
    }
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
  },

  //0:加油 1:洗车 2:停车
  onMenuClick:function(e){
    this.setData({page_type:e.detail});
    if(e.detail==1&&!this.data.clean_list){
      this.getCleanList();
    }else {
      this.getStations();
    }
  },

  //加油筛选条件
  onOilSelectClick:function(e){
    const data = e.detail;
    this.setData({
      oil_type_name:data[0],
      oil_sort_class:data[1],
      oil_brand:data[2],
      station_list:null,
      load_page_oil:1
    });
    //重置页码
    page_num_oil = 1;
    this.getStations();
  },

  //洗车筛选条件
  onCleanSelectClick:function(e){
    const data = e.detail;
    console.log(e.detail);
    this.setData({
      clean_sort_class:data[0],
      able_parking:data[1],
      washer_status:data[2],
      clean_list:null
    });
    page_num_clean = 1;
    this.getCleanList();
  },

  //搜索
  onSearchClick:function(){
    wx.navigateTo({url:"/pages/stations/search/search"});
  },

  //刷新
  onRefreshClick:function(){
    this.setData({
      tabs_oil:oil_filter_tabs,//加油筛选条件
      tabs_clean:clear_filter_tabs,//洗车筛选条件
      clean_sort_class:clean_sort[0].id,
      able_parking:clean_enable[0].id,
      washer_status:clean_status[0].id,
      clean_list:null
    });
    getLocation(true,location=>{
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
      page_num_clean = 1;
      this.getCleanList();
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
      page_num_clean = 1;
      this.getCleanList();
    });

  },

  //洗车页面的刷新
  onRefreshCleanClick:function(){
    
  },

  //地图模式
  onMapClick:function(){
    const {oil_type_name, oil_brand,page_type} = this.data;
    const filter = {
      oil_type:oil_type_name,
      oil_brand:oil_brand,
      page_type:page_type,
    }
    const params = encodeURIComponent(JSON.stringify(filter));
    wx.navigateTo({url:`/pages/stations/map/map?params=${params}`});
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    const {page_type} = this.data;
    if(page_type==0){
      page_num_oil = 1;
      this.getStations();
    }else{
      page_num_clean = 1;
      this.getCleanList();
    }
  },

  //油站item点击
  onStationClick:function(e){
    console.log(e);
    wx.setStorageSync(STATIONPAGE, 0);
    // this.setData({openid:wx.getStorageSync(OPENID)});

    if (wx.getStorageSync(OPENID)){
      const {oil_type_name} = this.data;
      const item = e.currentTarget.dataset.item;
      item.current_oil_no = oil_type_name;
      const params = encodeURIComponent(JSON.stringify(item));
      wx.navigateTo({url:`/pages/stations/details/details?params=${params}`});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

   //洗车item点击
  onCleanClick:function(e){
    wx.setStorageSync(STATIONPAGE, 1);
    // this.setData({openid:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      const item = e.currentTarget.dataset.item;
      const params = encodeURIComponent(JSON.stringify(item));
      wx.navigateTo({url:`/pages/stations/clean/clean-details/clean-details?params=${params}`});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //立即加油
  onPayClick:function(e){
    wx.setStorageSync(STATIONPAGE, 0);
    const {oil_type_name} = this.data;
    // this.setData({openid:wx.getStorageSync(OPENID)});
    const item = e.currentTarget.dataset.item;
    if (wx.getStorageSync(OPENID)){
      // const station = e.detail;
      const supports = item.support_payments;
      item.current_oil_no = oil_type_name;
      let details = encodeURIComponent(JSON.stringify(item));
      console.log('supports',supports);
      if(supports&&supports.includes("ONE_KEY")){//支持一键加油
        wx.navigateTo({url:`/pages/stations/fast-oil/fast-oil?details=${details}`});
      }else{//二维码加油
        wx.navigateTo({url:`/pages/stations/qrcode/qrcode?params=${details}`});
      }
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //立即洗车
  toCleanClick:function(e){
    if (wx.getStorageSync(OPENID)){
      wx.setStorageSync(STATIONPAGE, 1);
      const item = e.currentTarget.dataset.item;
      this.onCleanCheck(item);
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //导航
  onNavigationClick:function(e){
    const item = e.currentTarget.dataset.item;
    wx.openLocation({
      latitude:item.latitude_tx,
      longitude:item.longitude_tx,
      name:item.name,
      address:item.address
    });
  },
  //洗车导航
  onCleanNavigationClick:function(e){
    const item = e.currentTarget.dataset.item;
    wx.openLocation({
      latitude:item.lat_tx,
      longitude:item.lng_tx,
      name:item.washer_name,
      address:item.washer_address
    });
  },

  //加油下拉刷新
  onOilRefresh:function(){
    getLocation(true,location=>{
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
      page_num_oil = 1;
      this.getStations();
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
      page_num_oil = 1;
      this.getStations();
    });
  },

  //加油上拉加载更多
  onOilLoadMore:function(){
    page_num_oil++;
    this.setData({load_status_oil:1})
    this.getStations();
  },

  //洗车下拉刷新
  onCleanRefresh:function(){
    getLocation(true,location=>{
      this.setData({
        center_lng:location.longitude,
        center_lat:location.latitude,
      });
      page_num_clean = 1;
      this.getCleanList();
    },err=>{
      wx.showToast({
        title:err,
        icon:"none"
      });
      page_num_clean = 1;
      this.getCleanList();
    });
  },

  //洗车上拉加载更多
  onCleanLoadMore:function(){
    page_num_clean++;
    this.setData({load_status_clean:1});
    this.getCleanList();
  },

  //加油油站查询
  getStations:function(){
    wx.setStorageSync(STATIONPAGE, 0);
    console.log(`加油油站查询start:${new Date()}`);
    const {center_lng, center_lat, oil_type_name, oil_sort_class, oil_brand} = this.data;
    const params = {
      page_num:page_num_oil,
      page_size:page_size_oil,
      center_lng:center_lng,
      center_lat:center_lat,
      oil_type_name:oil_type_name,
      sort_class:oil_sort_class,
      gasoline_brand:oil_brand||null,
      source:"WXAPPLET"
    }
    page_num_oil==1&&this.data.station_list==null?wx.showLoading({title:"正在加载...",mask:true}):"";
    getHttpPost(stationsApi.list,params,res=>{
      console.log(`加油油站查询end:${new Date()}`);
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      let list = page_num_oil==1?data:this.data.station_list.concat(data);
      this.setData({
        station_list:list,
        refresher_oil:false,
        load_status_oil:data&&data.length&&data.length<page_size_oil?2:0,
        oil_status:list&&list.length?0:1,
        load_page_oil:2
      });
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      let oil_status = this.data.station_list==null&&err.code==10?2:0;
      this.setData({
        refresher_oil:false,
        oil_status:oil_status,
        load_status_oil:err.code==10?0:this.data.load_status_oil
      })
    });
  },

  //洗车查询
  getCleanList:function(){
    wx.setStorageSync(STATIONPAGE, 1);
    // console.log(`洗车查询start:${new Date()}`);
    // this.setData({clean_status:1,refresher_clean:false});
    // this.setData({clean_status:0,refresher_clean:false,clean_list:[{},{},{},{},{},{}]});
    const {center_lng, center_lat, washer_status, able_parking} = this.data;
    const params = {
      page_num:page_num_clean,
      page_size:page_size_clean,
      center_lng:center_lng,
      center_lat:center_lat,
      washer_status:washer_status,
      able_parking:able_parking,
    }
    page_num_clean==1&&this.data.clean_list==null?wx.showLoading({title:"正在加载...",mask:true}):"";
    getHttpPost(cleanApi.list,params,res=>{
      // console.log(`洗车查询end:${new Date()}`);
      wx.hideLoading();
      const data = this.dealCleanResponse(res.data);
      let list = page_num_clean==1?data:this.data.clean_list.concat(data);
      this.setData({
        clean_list:list,
        refresher_clean:false,
        load_status_clean:data&&data.length&&data.length<page_size_clean?2:0,
        clean_status:list&&list.length?0:1,
        load_page_clean:2
      });
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      let clean_status = this.data.clean_list==null&&err.code==10?2:0;
      this.setData({
        refresher_clean:false,
        clean_status:clean_status,
        load_page_clean:err.code==10?0:this.data.load_page_clean
      })
    });
  },
  /**
   * 数据处理
   */
  dealCleanResponse:function(data){
    return data&&data.map(item=>{
      item.latitude_tx = Number(item.latitude_tx);
      item.longitude_tx = Number(item.longitude_tx);
      item.distance_meter = keepDecimalFull(item.distance_meter,1);
      item.washer_price = keepDecimalFull(item.washer_price,0).replace('.','');
      if (item.hours_begin.substr(0,2)<1 && item.hours_end.substr(0,2)>22){
        item.is_hours = true;
      }else {
        item.is_hours = false;
      }
      return item;
    });
  },

  /**
   * 数据处理
   */
  dealResponse:function(data){
    return data&&data.map(item=>{
      item.latitude_tx = Number(item.latitude_tx);
      item.longitude_tx = Number(item.longitude_tx);
      item.distance = keepDecimalFull(item.distance,1);
      item.station_price = item.station_price&&item.station_price.map(price=>{
        price.xl_price = keepDecimalFull(price.xl_price,2);
        price.list_price = price.list_price||price.gb_price||'';
        price.list_price = price.list_price?keepDecimalFull(price.list_price,2):'';
        price.gb_price = keepDecimalFull(price.gb_price,2);
        price.oil_price_difference = price.oil_price_difference>0?keepDecimalFull(price.oil_price_difference,2):"";
        return price;
      });
      let currentObj = item.current_station_price;
      if(currentObj){
        currentObj.xl_price = keepDecimalFull(currentObj.xl_price,2);
        currentObj.list_price = currentObj.list_price||currentObj.gb_price||'';
        currentObj.list_price = currentObj.list_price?keepDecimalFull(currentObj.list_price,2):'';
        currentObj.gb_price = keepDecimalFull(currentObj.gb_price,2);
        currentObj.oil_price_difference = currentObj.oil_price_difference>0?keepDecimalFull(currentObj.oil_price_difference,2):'';
      }
      item.no_sence = item.support_payments&&item.support_payments.includes("ETC_NO_SENSE");
      return item;
    })
  },

  //获取加油站品牌列表    品牌写死处理
  // getBrands:function(){
  //   wx.showLoading({title:"正在加载...",mask:true});
  //   getPostPromise(stationsApi.brands).then(res=>{
  //     let _brands = this.dealBrands(res.data);
  //     tabs_oil[2] = _brands;
  //     this.setData({
  //       oil_brand:_brands[0].id,
  //       tabs_oil:tabs_oil,
  //     });
  //     this.getStations();
  //   }).catch(err=>{
  //     console.log(`${err.msg}:${err.code}`);
  //     this.getStations();
  //   });
  // },

  //处理返回的品牌数据 全部品牌放在首位 其他放在末尾
  // dealBrands:function(_brands){
  //   _brands.map(item=>{
  //     item.id = item.brand_code;
  //     item.title = item.brand_name;
  //     return item;
  //   });
  //   let other_index = -1;
  //   for(let i=0; i<_brands.length; i++){
  //     if(_brands[i].id == 'default'){
  //       other_index = i;
  //       break;
  //     }
  //   }
  //   let other_obj = other_index!=-1?_brands[other_index]:null;
  //   _brands.splice(other_index,1);
  //   _brands.splice(_brands.length,0,other_obj);
  //   const all_brands = {
  //     id:'all',
  //     title:"全部品牌"
  //   }
  //   _brands.splice(0,0,all_brands);
  //   return _brands;
  // },

  //立即洗车=>检查洗车机距离
  onCleanCheck:function(item){
    wx.showLoading({
      title: '请稍候...',
      icon: 'none',
      mask: true
    })
    this.setData({openid:wx.getStorageSync(OPENID)});
    const {center_lng,center_lat} = this.data;
    const paramsData = {
      washer_id:item.washer_id,
      center_lng:center_lng,
      center_lat:center_lat,
    }
    getHttpPost(cleanApi.distance,paramsData,res=>{
      wx.hideLoading();
      if (res.result_code === "00000") {
        const details = encodeURIComponent(JSON.stringify(item));
        wx.navigateTo({url:`/pages/stations/clean/park-confirm/park-confirm?params=${details}`});
      } else {
        // wx.hideLoading();

      }
    },err=>{
      wx.hideLoading();
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
})
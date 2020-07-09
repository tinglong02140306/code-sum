// pages/stations/search/search.js
import {oils, sort, brands, oil_filter_tabs} from '../constants';
import {stationsApi} from '../../../http/api';
import {getHttpPost} from '../../../http/http';
import {keepDecimalFull, trim} from '../../../utils/util';
import {OPENID} from '../../../constants/global';
const app = getApp();
const navigationBarHeight = app.globalData.navigationBarHeight;
const tabHeight = 84;
const tabs_oil = oil_filter_tabs;
let page_num_oil = 1;
const page_size_oil = 15;
let location = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:"",//搜索内容
    center_lng:117.12009,//默认经度
    center_lat:36.65184,//默认纬度
    oil_type_name:oils[0].id,//加油 油品类型
    oil_sort_class:sort[0].id,//加油 1-距离，2-油价
    oil_brand:brands[0].id,//加油 品牌
    tabs_oil:tabs_oil,//筛选条件
    station_list:null,//油站列表
    load_status_oil:0,//油站上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher_oil:false,//加油下拉刷新状态
    oil_status:0,//1:油站列表为空 2:网络连接失败 
    tab_height:tabHeight,
    openid:"",
    drop_down_height:`calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx)`,
    scroll_height:`calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx - 20rpx)`,
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
    }else{
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
    }
  },

  onShow:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
  },

  //搜索
  onSearch:function(e){
    if(trim(e.detail)){
      this.setData({search:e.detail})
      this.getStations();
    }
  },

  //筛选条件
  onOilSelectClick:function(e){
    const {search} = this.data;
    const data = e.detail;
    this.setData({
      oil_type_name:data[0],
      oil_sort_class:data[1],
      oil_brand:data[2],
      station_list:null
    });
    if(search){
      //重置页码
      page_num_oil = 1;
      this.getStations();
    }
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    page_num_oil = 1;
    this.getStations();
  },

  //油站item点击
  onStationClick:function(e){
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

  //立即加油
  onPayClick:function(e){
    const {oil_type_name} = this.data;
    this.setData({openid:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      const station = e.detail;
      const supports = station.support_payments;
      station.current_oil_no = oil_type_name;
      let details = encodeURIComponent(JSON.stringify(station));
      if(supports&&supports.includes("ONE_KEY")){//支持一键加油
        wx.navigateTo({url:`/pages/stations/fast-oil/fast-oil?details=${details}`});
      }else{//二维码加油
        wx.navigateTo({url:`/pages/stations/qrcode/qrcode?params=${details}`});
      }
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

  //下拉刷新
  onOilRefresh:function(){
    page_num_oil = 1;
    this.getStations();
  },

  //上拉加载更多
  onOilLoadMore:function(){
    page_num_oil++;
    this.setData({load_status_oil:1})
    this.getStations();
  },


  //加油油站查询
  getStations:function(){
    const {center_lng, center_lat, oil_type_name, oil_sort_class, oil_brand,search} = this.data;
    const params = {
      page_num:page_num_oil,
      page_size:page_size_oil,
      center_lng:center_lng,
      center_lat:center_lat,
      oil_type_name:oil_type_name,
      sort_class:oil_sort_class,
      station_name:search,
      gasoline_brand:oil_brand||null,
      source:"WXAPPLET"
    }
    page_num_oil==1&&this.data.station_list==null?wx.showLoading({title:"正在加载...",mask:true}):"";
    getHttpPost(stationsApi.list,params,res=>{
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      const list = page_num_oil==1?data:this.data.station_list.concat(data);
      this.setData({
        station_list:list,
        refresher_oil:false,
        load_status_oil:data&&data.length&&data.length<page_size_oil?2:0,
        oil_status:list&&list.length?0:1
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
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
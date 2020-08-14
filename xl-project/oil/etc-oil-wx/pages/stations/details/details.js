// pages/stations/details/details.js
import {StationPhotoDefault} from '../../../assets/url/url';
import {getCurrentData, keepDecimalFull} from '../../../utils/util';
import {OPENID, STATIONPAGE} from '../../../constants/global'
import {getLocation} from "../../../utils/location";
import {getHttpPost} from "../../../http/http";
import {homeApi} from "../../../http/api";
import {oils} from "../constants";
let Mock = require('../../../utils/mock.js');
let params = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station:null,
    oil_types:[],
    order_list:[],//实时订单
    current_oil_no:"",//当前展示的油品类型
    current_index:0,//当前展示油品类型的index
    current_price:"",//当前展示油品类型的油站价
    current_price_gb:"",//当前展示油品类型的国标价
    current_price_vip:"",//当前展示油品类型的会员价
    openid:"",
    is_support_no_sense:false,//是否支持无感支付
    background_default:StationPhotoDefault,
    isIphoneX:app.globalData.isIphoneX,
    oil_type_name:oils[0].id,//加油 油品类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    try {
      const right = JSON.parse(decodeURIComponent(options.params));

      if (right.from==='right'){
        //权益过来
        //获取当前位置的经纬度信息
        getLocation(true,location=>{
          this.setData({
            center_lng:location.longitude,
            center_lat:location.latitude,
          });
          this.getStations();
        },err=>{
          wx.showToast({title:err, icon:"none"});
          this.getStations();
        });

      }else {
        params = JSON.parse(decodeURIComponent(options.params));
        //列表
        console.log(params)
        this.setData({station:params});
        const current_oil_no = params.current_oil_no;
        const station_price = params.station_price;
        const current_Obj = this.getOilPrice(current_oil_no,station_price);
        console.log('current_obj',current_oil_no,station_price)
        let support_payments = params.support_payments;
        if(current_Obj){
          this.setData({
            oil_types:params.station_price,
            current_oil_no:current_Obj.oil_no,
            current_price:current_Obj.list_price,
            current_price_gb:current_Obj.gb_price,
            current_price_vip:current_Obj.xl_price,
            current_index:current_Obj.index,
            is_support_no_sense:support_payments&&support_payments.includes("ETC_NO_SENSE"),
          });
        }
      }
      this.getOrders();
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  onShow:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
  },

  //修改油品类型
  onOilNoChange:function(e){
    const {value} = e.detail;
    const {oil_types} = this.data;
    if(oil_types&&oil_types.length){
      //选择的油品型号
      const current_oil_no = oil_types[value].oil_no || oil_types[value].oilNo;
      //当前选中的油品型号 所对应得所有价格
      let current_price_obj = this.getOilPrice(current_oil_no,params.station_price);
      this.setData({
        current_oil_no:current_oil_no,
        current_index:value,
        current_price:current_price_obj.list_price||current_price_obj.listPrice,
        current_price_gb:current_price_obj.gb_price||current_price_obj.gbPrice,
        current_price_vip:current_price_obj.xl_price||current_price_obj.xlPrice
      })
    }
  },

  //导航
  onNavigationClick:function(){
    const {station} = this.data;
    wx.openLocation({
      latitude:station.latitude_tx,
      longitude:station.longitude_tx,
      name:station.name,
      address:station.address
    });
  },

  //快捷加油
  onOilClick:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      const {station, current_oil_no} = this.data;
      const supports = station.support_payments;
      params.current_oil_no = current_oil_no;
      let details = encodeURIComponent(JSON.stringify(params));
      this.setData({openid:wx.getStorageSync(OPENID)});
      if(supports&&supports.includes("ONE_KEY")){//支持一键加油
        wx.navigateTo({url:`/pages/stations/fast-oil/fast-oil?details=${details}`});
      }else{//二维码加油
        wx.navigateTo({url:`/pages/stations/qrcode/qrcode?params=${details}`});
      }
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //ETC加油
  onEtcClick:function(){
    let details = encodeURIComponent(JSON.stringify(params));
    wx.navigateTo({
      url:`/pages/stations/etc-pay/etc-pay?params=${details}`
    });
  },

  //获取油品类型对应的价格及差价信息
  getOilPrice:function(oil_type,prices){
    if(prices){
      for(let i=0; i<prices.length; i++){
        const item = prices[i];
        if(item.oil_no==oil_type||item.oilNo==oil_type){
          item.index = i;
          return item;
        }
      }
    }
    return "";
  },

  //图片加载失败
  onImageError:function(e){
    // const index = e.currentTarget.dataset.index;
    // const {order_list} = this.data;
    // order_list[index].img = '/assets/static/default-head.png';
    // this.setData({order_list:order_list});
  },

  //加油油站查询（中航易通）
  getStations:function(){
    const {center_lng, center_lat,oil_type_name} = this.data;
    const paramsData = {
      center_lng:center_lng,
      center_lat:center_lat,
    }

    wx.showLoading({title:"正在加载...",mask:true})
    getHttpPost(homeApi.rightsGetStation,paramsData,res=>{
      wx.hideLoading();
      const data = this.dealResponse(res);
      console.log('res',data);
      params = data;
      this.setData({station:data});
      const current_oil_no = oil_type_name;
      const station_price = data.station_price;
      const current_obj = this.getOilPrice(current_oil_no,station_price);
      console.log('current_obj',this.getOilPrice(current_oil_no,station_price))
      let support_payments = data.support_payments;
      if(current_obj){
        this.setData({
          oil_types:data.station_price,
          current_oil_no:current_obj.oilNo,
          current_price:current_obj.listPrice,
          current_price_gb:current_obj.gbPrice,
          current_price_vip:current_obj.xlPrice,
          current_index:current_obj.index,
          is_support_no_sense:support_payments&&support_payments.includes("ETC_NO_SENSE"),
        });
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
  /**
   * 数据处理
   */
  dealResponse:function(item){
    console.log('item',item);
    item.latitude_tx = Number(item.latitude_tx);
    item.longitude_tx = Number(item.longitude_tx);
    item.distance = keepDecimalFull(item.distance,1);
    item.station_price = item.station_price&&item.station_price.map(price=>{
      price.oil_no = price.oil_no||price.oilNo;
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
  },

  //获取实时订单信息
  getOrders:function(){
    const data = getCurrentData();
    let res = Mock.mock({
      'data|8': [{
          'img': `https://i.picsum.photos/id/@integer(0,1000)/80/80.jpg`,
          'name': '@ctitle(1,1)',
          'time': data,
          'money': '@integer(1,3)',
          'discount': '@float(10, 50, 2, 2)'
      }]  
    });
    const limit = Mock.mock('@integer(2, 6)');
    const list = res.data&&res.data.filter((item,index)=>{
      const interger = item.money;
      item.money = `${interger}00.00`;
      item.discount = `${interger}0.00`;
      return index<limit
    });
    this.setData({order_list:list});
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/mine/pay/vehicle/vehicle.js
import {formatPlateNumber, checkPlateNumber} from "../../../../utils/util";
import {provinces, letters} from '../../../../constants/plate_number';
import {getPostPromise} from '../../../../http/http';
import {etcApi, payApi} from '../../../../http/api';
const app = getApp();
let isIphoneX = app.globalData.isIphoneX;
Page({

 
  /**
   * 页面的初始数据
   */
  data: {
    car_plate_no:'',//车牌号全
    plate_no_index:[0,0],//车牌前缀 [鲁 A]
    car_plate_input:"",//车牌信息 [89056]
    plate_number_list:[],//系统检测到的用户的车牌信息
    car_plate_color:0,//车牌颜色 默认蓝色
    show_pop:false,
    // vehicle_success:true,//微信车主服务开通成功
    isIphoneX:isIphoneX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOwnedList();
  },

  onShow:function(){
    //从微信车主服务返回来 查询车主服务签约结果
    if(app.globalData.fromVehicle){
      const {car_plate_no} = this.data;
      const params = {plate_no:car_plate_no.toUpperCase()};
      app.globalData.fromVehicle = false;
      this.queryVehicleResult(params);
    }
  },

  //车牌号
  onPlateChange:function(e){
    const {plate_header,palte_no,index} = e.detail;
    this.setData({
      car_plate_no:`${plate_header}${palte_no}`,
      plate_no_index:index,
      car_plate_input:palte_no
    });
  },

  //车牌颜色
  onPlateColorChange:function(e){
    this.setData({car_plate_color:e.detail});
  },

  //用户点击 监测到的车牌号
  onItemClick:function(e){
    const item = e.currentTarget.dataset.item;
    let car_plate_no = item.car_plate_no;
    const _province = car_plate_no.substring(0,1);
    const _letter = car_plate_no.substring(1,2);
    const _content = car_plate_no.substring(2,car_plate_no.length);
    let index = [this.getIndex(_province,provinces),this.getIndex(_letter,letters)];
    this.setData({
      plate_no_index:index,
      car_plate_input:_content,
      show_pop:false,
      car_plate_no:item.car_plate_no,
      car_plate_color:item.car_plate_color
    });
  },

  //取消展示监测到的车牌号
  onCancelClick:function(){
    this.setData({show_pop:false});
  },

  //微信车主服务开通成功 返回
  // onBackClick:function(){
  //   wx.navigateBack();
  // },

  //提交
  onNextClick:function(){
    const {car_plate_no} = this.data;
    if(!checkPlateNumber(car_plate_no)){
      wx.showToast({title:"请输入正确的车牌号",icon:'none'});
    }else{
      this.onBindWxVehicle(car_plate_no);
    }
  },

  //用户名下ETC查询
  getOwnedList:function(){
    wx.showLoading({title:"正在加载...",mask:true});
    getPostPromise(etcApi.owned,null).then(res=>{
      wx.hideLoading();
      const list = res.data&&res.data.map(item=>{
        item.plate_number_formate = formatPlateNumber(item.car_plate_no);
        return item;
      });
      this.setData({
        plate_number_list:list,
        show_pop:list&&list.length
      })
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });

  },

  //开通微信车主服务
  onBindWxVehicle:function(plate_no){
    const params = {plate_no:plate_no.toUpperCase()};
    wx.showLoading({title:'正在开通...',mask:true});
    getPostPromise(payApi.sign_vehicle,params).then(res=>{
      if(res.appid){//该车牌还未开通车主服务
        wx.navigateToMiniProgram({
          appId: 'wxbcad394b3d99dac9',
          path: 'pages/route/index',
          extraData: {
            appid: res.appid,
            sub_appid: res.sub_appid,
            mch_id: res.mch_id,
            sub_mch_id: res.sub_mch_id,
            nonce_str: res.nonce_str,
            sign_type: res.sign_type,
            sign:res.sign,
            trade_scene: res.trade_scene,
            openid: res.openid,
            sub_openid: res.openid,
            plate_number: res.plate_number,
          },
          success(res) {
            wx.hideLoading();
          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({title:'调起微信车主服务失败',icon:'none'});
          }
        });
      }else{//该车牌已开通车主服务
        wx.hideLoading();
        wx.showToast({title:`该车牌已开通微信车主服务`,icon:"none"})
      }
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:"none"
      })
    });
  },  

  //微信车主服务签约结果查询
  queryVehicleResult:function(params){
    this.dealPrePage();

    // wx.showLoading({title:"正在查询结果...",mask:true});
    getPostPromise(payApi.query_vehicle,params).then(res=>{
      wx.hideLoading();
      // wx.showToast({title:"签约成功",icon:"none"});
      this.dealPrePage();
    }).catch(err=>{
      // console.log(err)
      wx.hideLoading();
      // wx.showToast({
      //   title:`${err.msg}:${err.code}`,
      //   icon:"none"
      // })
    });
  },

  //微信车主服务签约成功 处理上一个界面的显示
  dealPrePage:function(){
    const pages = getCurrentPages();
    if(pages.length>=2){
      const prePage = pages[pages.length-2];
      if(prePage.route=="pages/stations/qrcode/qrcode"){//二维码界面
        this.timer = setTimeout(()=>{
          clearTimeout(this.timer);
          wx.navigateBack();
        },600);
      }else if(prePage.route=="pages/mine/pay/list/list"){//支付列表界面
        prePage.getPaymentSequence();
        this.timer = setTimeout(()=>{
          clearTimeout(this.timer);
          wx.navigateBack();
        },600);
      }
    }
  },

  getIndex:function(search,data){
    if(data){
      for(let i=0; i<data.length; i++){
        let item = data[i];
        if(search == item){
          return i;
        }
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/mine/etc/bind/bind.js
import {formatPlateNumber, checkPlateNumber} from "../../../../utils/util";
import {provinces, letters} from '../../../../constants/plate_number';
import {getHttpPost, getPostPromise} from '../../../../http/http';
import {etcApi, payApi} from '../../../../http/api';
import {checkETCNo} from '../../../../utils/util';
const app = getApp();
let isIphoneX = app.globalData.isIphoneX;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    etc_card_no:'',//ETC卡号
    car_plate_no:'',//车牌号全
    plate_no_index:[0,0],//车牌前缀 [鲁 A]
    car_plate_input:"",//车牌信息 [89056]
    plate_number_list:[],//系统检测到的用户的车牌信息
    car_plate_color:0,//车牌颜色 默认蓝色
    show:false,
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

  //etc卡号
  onETCChange:function(e){
    const value = e.detail;
    this.setData({etc_card_no:value});
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

  //用户点击监测到的车牌号
  onItemClick:function(e){
    const item = e.currentTarget.dataset.item;
    let car_plate_no = item.car_plate_no;
    const _province = car_plate_no.substring(0,1);
    const _letter = car_plate_no.substring(1,2);
    const _content = car_plate_no.substring(2,car_plate_no.length);
    let index = [this.getIndex(_province,provinces),this.getIndex(_letter,letters)];
    this.setData({
      etc_card_no:item.etc_card_no,
      plate_no_index:index,
      car_plate_input:_content,
      show:false,
      car_plate_no:item.car_plate_no,
      car_plate_color:item.car_plate_color
    });
  },

  //取消展示监测到的车牌号
  onCancelClick:function(){
    this.setData({show:false});
  },

  //提交
  onNextClick:function(){
    const {etc_card_no,car_plate_no} = this.data;
    if(!checkETCNo(etc_card_no)){
      wx.showToast({title:"请输入正确的ETC卡号",icon:'none'});
    }else if(!checkPlateNumber(car_plate_no)){
      wx.showToast({title:"请输入正确的车牌号",icon:'none'});
    }else{
      this.bindETC();
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
        show:list&&list.length
      })
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });

  },

  //绑定ETC
  bindETC:function(){
    wx.showLoading({title:'正在提交...',mask:true});
    const {car_plate_no, car_plate_color, etc_card_no} = this.data;
    const province = checkETCNo(etc_card_no);
    const params = {
      etc_belong_province_code:province,
      etc_card_no:etc_card_no,
      car_plate_no:car_plate_no.toUpperCase(),
      car_plate_color:car_plate_color
    }
    getPostPromise(etcApi.bind,params).then(res=>{
      wx.hideLoading();
      // wx.showToast({title:`绑定成功`,icon:'none'});
      this.dealPay();
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
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
   * 获取用户已开通的支付方式
   * 若无已绑定的支付方式 =>开通完成 否则=>微信车主服务
   */
  dealPay:function(){
    getHttpPost(payApi.exitPayment,null,res=>{
      if (res.exit_payment){
        wx.showToast({title:`绑定成功`,icon:'none'});
        this.timer = setTimeout(()=>{
          const pages = getCurrentPages();
          if(pages.length>=2){
            const prePage = pages[pages.length-2];
            if(prePage.route="pages/mine/etc/list/list"){//刷新ETC列表
              prePage.getCardData();
              wx.navigateBack();
            }
          }
          clearTimeout(this.timer);
        },500);
      }else {
        wx.navigateTo({url: '/pages/mine/pay/list/list'});
        // this.onBindWxVehicle();
      }
    },err=>{
      wx.showToast({title:`${err.msg}:${err.code}`,icon:'none'});
    });
  },
  //开通微信车主服务
  onBindWxVehicle:function(){
    const {car_plate_no} = this.data;
    const params = {plate_no:car_plate_no.toUpperCase()};
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
    this.timer = setTimeout(()=>{
      const pages = getCurrentPages();
      if(pages.length>=2){
        const prePage = pages[pages.length-2];
        if(prePage.route="pages/mine/etc/list/list"){//刷新ETC列表
          prePage.getCardData();
          wx.navigateBack();
        }
      }
      clearTimeout(this.timer);
    },500);
      // else if(prePage.route=="pages/mine/pay/list/list"){//支付列表界面
      //   prePage.getPaymentSequence();
      //   this.timer = setTimeout(()=>{
      //     clearTimeout(this.timer);
      //     wx.navigateBack();
      //   },600);
      // }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
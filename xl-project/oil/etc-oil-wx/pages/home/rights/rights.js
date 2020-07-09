// pages/home/rights/rights.js
import {ActivityCard, ActivityNext, ActivityShare, ActivityService,
  ActivityOpen, ActivityFinish, ActivityMarkLeft, ActivityMarkRight, ActivityNoActivate} from "../../../assets/url/url";
import {checkUrl} from '../../../utils/util';  
import {WHCCB, PSBC, QSBANK, CCB, ZHYD} from './constants';
import {getHttpPost} from "../../../http/http";
import {homeApi} from "../../../http/api";
let Mock = require('../../../utils/mock.js');
let params = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_type:0,//1::h5页面 2:本地页面
    url_h5:"",//h5页面路径
    bankInfo:{},//银行信息
    status:0,//0:权益未领取 1:权益已领取
    user_list:[],
    icon_card:ActivityCard,
    icon_next:ActivityNext,
    icon_share:ActivityShare,
    icon_service:ActivityService,
    icon_open:ActivityOpen,
    icon_finish:ActivityFinish,
    icon_left_mark:ActivityMarkLeft,
    icon_right_mark:ActivityMarkRight,
    icon_no_activate:ActivityNoActivate,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      params = JSON.parse(decodeURIComponent(options.params));
      let url = params.sub_activity_url;
      if(checkUrl(url)){//h5页面
        this.setData({
          url_h5:url,
          page_type:1
        });
      }else{
        this.setData({page_type:2});
        this.dealBank(url);
      }
      this.getUserList();
    } catch (error) {
      console.log(error);
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  dealBank:function(bank_name){
    if(bank_name=="WHCCB"){//威海商行
      this.dealData(WHCCB);
    }else if(bank_name=="PSBC"){//邮储银行
      this.dealData(PSBC);
    }else if(bank_name=="QSBANK"){//齐商银行
      this.dealData(QSBANK);
    }else if(bank_name=="SCCCB"){//建设银行
      this.dealData(CCB);
    }else if(bank_name=="ZHYD"){//中航易通
      console.log('kkk')
      this.dealData(ZHYD);
      this.getRightStatus();
    }else{
      // this.setData({bankInfo:null});
      this.dealData(ZHYD);
      this.getRightStatus();
    }
  },

  dealData:function(bank){
    this.setData({bankInfo:bank,btn_title:bank.btn_title});
    wx.setNavigationBarTitle({title:bank.title});
    wx.setNavigationBarColor({backgroundColor:bank.background_color,frontColor:"#ffffff"});
    wx.setBackgroundColor({backgroundColor: bank.background_color,backgroundColorBottom: '#f8f8f8',});
  },

  //激活权益
  onRightsClick:function(){
    const {status} = this.data;
    if(status==0){
      this.getRights();
    }
  },

  //优惠券领取状态查询
  getRightStatus:function(){
    wx.showLoading({title:"正在加载...",icon:""});
    getHttpPost(homeApi.rightsStatus,null,res=>{
      wx.hideLoading();
      this.setData({status:res.get_status?1:0});
    },err=>{
      wx.hideLoading();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
    });
  },

  //优惠券领取（中航易通）
  getRights:function(){
    wx.showLoading({title:"正在加载...",icon:""});
    getHttpPost(homeApi.rightsGet,null,res=>{
      wx.hideLoading();
      this.setData({status:1});
    },err=>{
      wx.hideLoading();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
    });
  },

  //获取加油优惠权益活动轮播
  getUserList:function(){
    let res = Mock.mock({
      'data|50': [{
          'url': `https://i.picsum.photos/id/@integer(0,1000)/80/80.jpg`,
          'name': '@cname()',
          'amount': '@integer(1,5)0',
      }]  
    })
    this.setData({user_list:res.data});
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {bankInfo} = this.data;
    const _params = encodeURIComponent(JSON.stringify(params));
    return {
      title: `${bankInfo.title}`,
      path: `/pages/home/rights/rights?params=${_params}`
    }
  },
})
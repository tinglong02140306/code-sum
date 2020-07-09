// pages/quick/qrcode/qrcode.js
import {qrApi} from '../../../utils/qrcode';
import {OPENID} from '../../../constants/global';
import {
  QrcodeIcon, QrcodePerfer, QrcodePerferNext, QrcodeNoBackground, QrcodeNoCharge,
  QrcodeStation, QrcodeInvoice, QrcodeWxPayLogo, WePay, CCBLOGO,QrcodeBankPayLogo
} from '../../../assets/url/url';
import {getHttpPost, getPostPromise} from '../../../http/http';
import {qrcodeApi, couponApi, payApi, paymentApi, etcApi} from "../../../http/api";
import {formatPlateNumber, formatSpaceId, isEmpty} from "../../../utils/util";
const app = getApp();
const {screenWidth, isIphoneX, windowHeight} = app.globalData;
let qrcodeTask = null;//获取二维码的Task
let statusTask = null;//获取二维码状态的Task
let resultTask = null;//获取消费结果的Task
let qrcodeTimer = null;//获取二维码的定时任务
let resultCount = 0;//获取消费结果的次数 最大为2次
let rotate = 1;
let preTime = new Date();
let currentTime = new Date();
let qrcodewidth = 235;
let isUnload = false;
let qrcodeLogo = '/assets/static/icon-qrcode-logo.png';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodewidth:235,
    qrCodeContent:null,
    refreshAnimation:null,
    status:0,//1:已开通二维码 2:未开通二维码
    isShowPay:false,
    processing:false,//交易处理中
    preferent:0,//可用优惠券数量
    default_type:"",
    default_pay_icon:"",
    isIphoneX:isIphoneX,
    margin_top:(windowHeight-540)/4,
    qrcode_icon:QrcodeIcon,
    perfer_icon:QrcodePerfer,
    perfer_next_icon:QrcodePerferNext,
    no_bg_icon:QrcodeNoBackground,
    station_icon:QrcodeStation,
    invoice_icon:QrcodeInvoice,
    no_charge:QrcodeNoCharge,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //二维码显示参数
    qrcodewidth = parseInt(screenWidth*0.65);//二维码宽高
    this.setData({qrcodewidth:qrcodewidth});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.dealPay();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    qrcodeTask&&qrcodeTask.abort();
    statusTask&&statusTask.abort();
    resultTask&&resultTask.abort();
    resultCount=0;
    rotate=1;
    clearInterval(qrcodeTimer);
    qrcodeTimer=null;
    //避免在跳转下一个界面时 交易处理中的提示提前消失
    this.timerProcessing=setTimeout(()=>{
      this.setData({processing:false});
      clearTimeout(this.timerProcessing);
    },200);
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(qrcodeTimer);
    qrcodeTimer=null;
    this.setData({processing:false});
    qrcodeTask&&qrcodeTask.abort();
    statusTask&&statusTask.abort();
    resultTask&&resultTask.abort();
    resultCount=0;
    rotate=1;
    wx.hideToast();
    wx.hideLoading();
  },

  //开通加油码
  onOpenQrcode:function(){
    //notice 添加了银联卡支付方式(如果未有ETC信息，调起ETC开通流程，如果已有ETC信息，未有支付信息，调起支付管理。)
    // this.getCardData();(暂时不上线)
    //若用户无已绑定支付方式，跳转支付管理页面，用户自主选择绑定支付方式。
    // wx.navigateTo({url:'/pages/mine/pay/vehicle/vehicle'})
    wx.navigateTo({url: '/pages/mine/pay/list/list'});
  },

  //优惠券
  onPreferentClick:function(){
    wx.navigateTo({url:"/pages/mine/coupons/list/list"});
  },

  //获取优惠券数据
  getPerferent:function(){
    const params = {
      coupon_use_status:1,
      page_num:1,
      page_size:0
    }
    getHttpPost(couponApi.query,params,res=>{
      console.log("获取优惠券数据",res.data);
      const data = res.data&&res.data.filter(item=>{
        return item.coupon_type == 0;
      });
      this.setData({preferent:data&&data.length});
    },fail=>{
      console.log("获取优惠券数据失败");
    });
  },

  /**
   * 获取用户已开通的支付方式 
   * 若无已绑定的支付方式 则显示未开通二维码
   */
  dealPay:function(){
    wx.showLoading({title:"正在获取...",mask:false});
    getHttpPost(paymentApi.paymentList,null,res=>{
      wx.hideLoading();
      let data = res.data;
      if(data&&data.length){
        this.setData({
          default_type:data[0].sign_type===6?`微信支付`:data[0].sign_type===1?data[0].bank_name?data[0].bank_name+data[0].sign_basis.substr(data[0].sign_basis.length - 4):`银行卡${data[0].sign_basis.substr(data[0].sign_basis.length - 4)}`:'',
          default_pay_icon:data[0].sign_type===6?QrcodeWxPayLogo:QrcodeBankPayLogo,
          status:1
        });
        this.getQRCodeTimer();
        this.getPerferent();
      }else{
        this.setData({status:2});
      }
    },err=>{
      console.log(err);
      wx.hideLoading();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:'none'});
    });
  },

  /**
   * 用户手动刷新二维码事件
   * 手动刷新必须限制 防止用户过频的刷新
   * 手动刷新间隔必须大于2s
   */
  onRefreshCode:function(){
    const {qrCodeContent} = this.data;
    if(!this.data.processing){
      currentTime = new Date();
      const diffTime = parseInt(currentTime-preTime)/1000;
      if(diffTime>1){
        this.removeStatus(qrCodeContent);//移除上一个二维码的状态
        this.refreshAnimation();
        this.getQRCodeTimer();
        preTime = currentTime;
      }
    }
  },

  /**
   * 刷新动画
   */
  refreshAnimation:function(){
      let refreshAnimation = wx.createAnimation({
        duration:200,
        timingFunction:'linear'
      });
      refreshAnimation.rotate(rotate*180).step()
      rotate++;
      this.setData({refreshAnimation:refreshAnimation.export()});
  },

  /**
   * 支付方式选择
   */
  onPaymentClick:function(){
    //notify sunmingmao 只有微信车主服务一种支付方式 不需要选择支付方式
    const {processing} = this.data;
    if(!processing){
      wx.navigateTo({url:'/pages/mine/pay/list/list'});
    }else{
      wx.showToast({title:'交易处理中...',icon:'none'});
    }
  },

  /**
   * 合作油站
   */
  onStationClick:function(){
    wx.switchTab({url: '/pages/stations/index/index'});
  },

  /**
   * 电子发票
   */
  onInvoiceClick:function(){
    wx.navigateTo({url:'/pages/mine/invoice/index/index'});
  },

  /**
   * 每60s获取一次二维码
   */
  getQRCodeTimer:function(){
    this.getQRCode();
    qrcodeTimer&&clearInterval(qrcodeTimer);
    qrcodeTimer=null;
    qrcodeTimer = setInterval(()=>{
      this.getQRCode();
    },60000);
  },

  /**
   * 获取二维码
   */
  getQRCode:function(){
    const {qrCodeContent} = this.data;
    //首次获取加油码时显示loading
    if(!qrCodeContent){
      wx.showLoading({
        title:'正在加载...',
        mask:false
      });
    }
    qrcodeTask&&qrcodeTask.abort();
    statusTask&&statusTask.abort();
    resultTask&&resultTask.abort();
    resultCount=0;
    this.setData({processing:false});
    console.log(`二维码获取请求${new Date()}`);
    qrcodeTask = getHttpPost(qrcodeApi.qrcode,null,res=>{
        const qr_code = res.qr_code;
        wx.hideLoading();
        if(qr_code){//二维码获取成功
          console.log(`二维码获取成功${new Date()}`);
          console.log(`二维码获取成功${JSON.stringify(res)}`);
          qrApi.draw(qr_code, "qrcode", qrcodewidth, qrcodewidth, null, qrcodeLogo);
          this.setData({qrCodeContent:qr_code});
          //获取该二维码对应的状态
          this.getQRCodeStatus(qr_code);
        }else{
          wx.showToast({title:"二维码为空",icon:'none'});
        }
    },err=>{
      console.log(`二维码获取失败${JSON.stringify(err)}`);
      if(!qrCodeContent){
        wx.hideLoading();
        if(err.msg!=="request:fail abort"){
          wx.showToast({title:JSON.stringify(err),icon:'none'});
        }
      }else{
        if(err&&err.msg!=="request:fail abort"){//自动断开时 不再请求
          this.getQRCodeTimer();
        }
      }
    });
  },

  /**
   * 获取二维码状态
   */
  getQRCodeStatus:function(qr_code){
    const data = {qr_code:qr_code}
    console.log(`二维码状态获取请求${new Date()}`);
    statusTask = getHttpPost('/wxapplet/qrcode/get-wxapplet-qr-code-status',data,res=>{
      //payment_status:00-支付中，01-支付成功，02-支付失败
      const payment_status = res.payment_status;
      //二维码被扫 终止获取二维码的定时任务 终止获取二维码状态的Task 显示交易处理中 开始获取消费结果
      if(payment_status=="00"){
        this.setData({
          processing:true
        });
        clearInterval(qrcodeTimer);
        qrcodeTimer = null;
        qrcodeTask.abort();
        statusTask.abort();
        this.getConsumeResult(data);
      }
      console.log(`获取二维码状态成功${new Date()}`);
      console.log(`获取二维码状态成功${JSON.stringify(res)}`);
    },err=>{
      console.log(`获取二维码状态失败${new Date()}`);
      console.log(`获取二维码状态失败${JSON.stringify(err)}`);
      if(err&&err.msg!=="request:fail abort"){//自动断开时 不再请求
        if(!isUnload){
          this.getQRCodeTimer();
        }
      }
    });
  },

  /**
   * 获取消费结果
   */
  getConsumeResult:function(data){
    if(resultCount<2){
      resultCount++;
      console.log(`消费结果获取请求${new Date()}`);
      resultTask = getHttpPost('/wxapplet/qrcode/get-wxapplet-qr-code-result',data,res=>{
        console.log(`获取消费结果成功:${JSON.stringify(res)}`);
        console.log(`获取消费结果成功${new Date()}`);
        const payment_details = res;
        resultTask.abort();
        const details = encodeURIComponent(JSON.stringify(payment_details));
        wx.navigateTo({url: `/pages/stations/qrcode-result/qrcode-result?details=${details}`})
      },err=>{
        console.log(`获取消费结果失败:${JSON.stringify(err.msg)}`);
        console.log(`获取消费结果失败${new Date()}`);
        //获取消费结果失败 若resultCount为1 则再次获取消费结果；若resultCount为2 则显示失败 不在获取
        if(resultCount===1){
          this.getConsumeResult(data);
        }else{
          if(err&&err.msg!=="request:fail abort"){//自动断开时 不再请求
            this.getQRCodeTimer();
          }
        }
      });
    }
  },

  /**
   * 二维码意外更改时 告知后端移除上一个二维码状态的监听
   */
  removeStatus:function(qr_code){
    const params = {qr_code:qr_code}
    console.log(`移除二维码状态的监听请求${new Date()}`);
    getHttpPost('/wxapplet/qrcode/remove-wxapplet-qr-code',params,res=>{
      console.log(`移除二维码状态监听${JSON.stringify(res)}`);
    },fail=>{
      console.log(`移除二维码状态监听${JSON.stringify(fail)}`);
    });
  },


  //获取etc列表
  getCardData: function () {
    wx.showLoading({title:"请稍候...",mask:true});
    getHttpPost(etcApi.query,{},res => {
      const data = res.data;
      if (data && data.length) {
        wx.navigateTo({url: '/pages/mine/pay/list/list'});
      } else {
        this.getOwnedList();
      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({
        title: fail.msg,
        icon: 'none'
      });
    })
  },

  //用户名下ETC查询 网络请求
  getOwnedList:function(){
    // wx.showLoading({title:"正在加载...",mask:true});
    getPostPromise(etcApi.owned,null).then(res=>{
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      if (data&&data.length){
        let params = encodeURIComponent(JSON.stringify(data));
        wx.navigateTo({url: `/pages/mine/etc/etc-list/etc-list?params=${params}`});
      }else {
        wx.navigateTo({url: '/pages/mine/etc/bind/bind'});
      }
    }).catch(err=>{
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/mine/etc/bind/bind'
      });
    });
  },

  /**
   * 数据ETC静默查询处理
   */
  dealResponse:function(data){
    return data&&data.map(item=>{
      //处理ETC数据  脱敏、空格
      item.car_plate_no = formatPlateNumber(item.car_plate_no);
      item.etc_card_no_str = formatSpaceId(item.etc_card_no);
      item.etc_card_no_str_before = item.etc_card_no_str.substr(0, 4);
      item.etc_card_no_str_after = item.etc_card_no_str.substr(15, item.etc_card_no_str.length);
      let card_no = item.etc_card_no.substr(0, 2);
      for (let i = 0; i < card_type.length; i++) {
        const item1 = card_type[i];
        if (item1.province_code == card_no) {
          item.card_name=item1.name;
          break;
        }
        item.card_name="未知卡";
      }
      item.select = false;
      if (!isEmpty(item.car_plate_no)&&!isEmpty(item.car_plate_color)&&!isEmpty(item.etc_card_no)&&!isEmpty(item.bank_account)&&!isEmpty(item.bank_card_type)&& !isEmpty(item.user_name) &&!isEmpty(item.mobile)){
        //处理银行卡数据  脱敏、空格
        item.bank_account_before = item.bank_account.substr(0, 6);
        item.bank_account_after = item.bank_account.substr(item.bank_account.length - 4);
        item.etcIsBank = true;
      }else {
        item.etcIsBank = false;
        // item.etcIsBank = true;
      }
      return item;
    })
  },
})
// pages/person/payment/bank-add/bank-add.js
import {checkPlateNumber, isEmpty, checkBankNo, checkIdCard, checkMobile, descentMobile, trim} from '../../../../utils/util';
import {UnionPay, BankSubmitSuccess, EtcSelected, EtcUnSelected} from "../../../../assets/url/url";
import {MOBILE} from "../../../../constants/global";
import {getPostPromise} from "../../../../http/http";
import {payApi} from "../../../../http/api";

const app = getApp();
let mark = "";//bindpay:代表是从快捷支付签约跳转来的
const mobile = wx.getStorageSync(MOBILE);
// const mobile = '18366131338';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank_card_type:-1,//0:借记卡 1:信用卡
    bank_card_type_str:'',
    is_show_modal:false,
    isIphoneX:app.globalData.isIphoneX,
    isStartIdentify:false,
    show_result:false,
    user_real_name:'',//用户姓名
    user_id_card:'',//用户证件号
    user_card_type:'',//用户证件类型
    sign_account_no:'',//签约的账户
    sign_bank_account_type:'',//签约银行卡类型
    sign_source:'',//签约来源
    // bank_reserve_mobile:descentMobile(mobile),//预留手机号
    bank_reserve_mobile:'',//预留手机号
    verify_code:'',//验证码
    bank_id:null,
    band_add_res:null,
    icon_success:BankSubmitSuccess,
    icon_select:EtcSelected,
    icon_unselect:EtcUnSelected,
    params:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.mark){
      mark = options.mark;
    }
    // 2019/10/14 sunmingmao  名下ETC查询，反现该ETC卡下绑定的银行卡信息  该需求暂不做
    if(options.etc_all_info){
      // const etc_all_info = JSON.parse(decodeURIComponent(options.etc_all_info));
      // console.log(etc_all_info);
      // this.setData({
      //   user_real_name:etc_all_info.user_name,
      //   user_id_card:etc_all_info.cert_no,
      //   sign_account_no:etc_all_info.bank_account,
      //   bank_reserve_mobile:etc_all_info.mobile,
      // })
    }
  },

  //银行卡类型选择 Modal展示
  onBankCardTypeClick: function() {
    this.setData({ is_show_modal: true });
  },

  //银行卡类型选择 item点击
  onBandCardItemClick: function(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      bank_card_type: item.id,
      is_show_modal: false,
      bank_card_type_str: item.card
    });
  },

  //银行预留手机号
  onBankMobileInput:function(e){
    this.setData({bank_reserve_mobile:e.detail});
  },

  //获取验证码
  onIdentifyClick: function() {
    const {bank_reserve_mobile} = this.data;
    if(!bank_reserve_mobile){
      wx.showToast({
        title:'请输入银行预留手机号',
        icon:'none'
      });
    }else if(!checkMobile(bank_reserve_mobile)){
      wx.showToast({
        title:'请输入正确的银行预留手机号',
        icon:'none'
      });
    }else{
      this.getVerifyCode(bank_reserve_mobile);
    }
  },

  //银行快捷支付授权委托书
  onProxyClick:function(){
    wx.navigateTo({url:'/pages/agree-authorization/agree-authorization'});
  },

  //是否同意 银行快捷支付授权
  onProxyChange:function(e){
    const value = e.detail.value;
    this.setData({isAgreeProxy:value&&value.length?true:false});
    // let agree = this.data.serverAgree;
    // this.setData({isAgreeProxy:!agree})
  },

  //绑定银行卡 提交验证
  onBindBankClick: function(e) {
    const {isAgreeProxy,bank_card_type} = this.data;
    const {bank_reserve_mobile,sign_account_no,user_id_card,user_real_name,verify_code} = e.detail.value;
    const params = {
      verify_code:verify_code,
      isAgreeProxy:isAgreeProxy,

      customer_name:user_real_name,//用户名
      cert_type:'01',//证件类型
      cert_no:trim(user_id_card),//证件号
      bank_name:null,//银行名称
      bank_code:null,//银行编码
      card_type:bank_card_type,//银行卡类型
      card_no:trim(sign_account_no),//签约银行卡卡号
      card_tel:trim(bank_reserve_mobile),//银行预留手机
      palate_number:null,//车牌号
      palate_color:null,//车牌颜色
      sign_type:'1',//签约类型 0-银联静默模式，1-普通模式
    }
    this.dealBankInfo(params);
  },

  /**
   * 绑定银行卡 数据处理
   */
  dealBankInfo:function(params){
    const {customer_name,cert_no,card_no,card_type,verify_code,isAgreeProxy,card_tel} = params;
    let title = "";
    if(!card_type){
      title='请选择银行卡类型';
    }else if(!card_no){
      title='请输入银行卡卡号';
    }else if (!checkBankNo(card_no)) {
      title='请输入正确的银行卡卡号';
    }else if(!customer_name){
      title='请输入用户姓名';
    }else if(!cert_no){
      title='请输入用户身份证件号'
    }else if (!checkIdCard(cert_no)) {
      title='请输入正确的用户证件号';
    }
    else if(!card_tel){
      title='请输入银行预留手机号';
    }else if (!checkMobile(card_tel)) {
      title='请输入正确的银行预留手机号';
    }
    else if(!verify_code){
      title='请输入验证码';
    }else if(verify_code.length!=6) {
      title='请输入正确的验证码';
    }else if (!isAgreeProxy){
      title='请同意并遵守快捷支付委托书';
    }
    if(title){
      wx.showToast({
        title:title,
        icon:'none'
      });
    }else{
      this.checkCode(params);
    }
  },

  //签约银行 网络请求
  getBindBank:function(params){
    wx.showLoading({
      mask:true,
      title: '正在提交...',
      icon: 'none'
    });
    // const {params} = this.data;
    getPostPromise(payApi.signUnion,params).then(res=>{
      wx.hideLoading();
      wx.showToast({title:"签约成功",icon:"none"});
      const pages = getCurrentPages();
      const prePage = pages[pages.length-2];
      if(prePage.route=='pages/mine/pay/bank-list/bank-list'){
        // prePage.getPaymentList();
        prePage.setData({is_refresh:true});
        wx.navigateBack();
      }
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
  },

  //获取银行预留手机号验证码
  getVerifyCode:function(bank_reserve_mobile){
    const params = {
      mobile:bank_reserve_mobile
    }
    wx.showLoading({title:"正在发送验证码...",mask:true});
    getPostPromise(payApi.verifyCode,params).then(res=>{
      wx.hideLoading();
      wx.showToast({title:"验证码已发送",icon:"none"});
      this.setData({ isStartIdentify: true });
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
  },

  //校验验证码 网络请求
  checkCode:function(params){
    const paramsData = {
      verify_code:params.verify_code,
      mobile:params.card_tel,
    }
    wx.showLoading({title:"正在验证...",mask:true});
    getPostPromise(payApi.checkCode,paramsData).then(res=>{
      wx.hideLoading();
      this.getBindBank(params);
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
  },

  //完成
  completeBack:function (e) {
    wx.navigateBack();
    // const {band_add_res} = this.data;
    // const pages = getCurrentPages();
    // if(pages.length>=2){
    //   if(mark==='bindpay'){//从快捷支付签约跳转来的 
    //     const prePage = pages[pages.length-2];
    //     if(prePage.route=='pages/flow/bind-pay/bind-pay'){
    //       const {sign_account_no,sign_bank_account_type,bank_title_logo,sign_bank_name} = band_add_res;
    //       //0-借记卡，1-信用卡
    //       let bank_no="";
    //       if(sign_account_no&&sign_account_no.length>4){
    //         bank_no = "("+sign_account_no.substring(sign_account_no.length-4,sign_account_no.length)+")";
    //       }
    //       let bank_type = sign_bank_account_type?"信用卡":"借记卡";
    //       prePage.setData({
    //         bank_pay_data:`${sign_bank_name}${bank_type}${bank_no}`,
    //         payWay:0,
    //         bank_id:this.data.bank_id,//银行卡签约成功id
    //         icon_unionpay:bank_title_logo||UnionPay
    //       });
    //       wx.navigateBack();
    //     }
    //   }else{
    //     const prePage = pages[pages.length-2];
    //     if(prePage.route=='pages/person/payment/bank-list/bank-list'){
    //       prePage.setData({is_refresh:true});
    //     }
    //     wx.navigateBack();
    //   }
    // }
  },

})
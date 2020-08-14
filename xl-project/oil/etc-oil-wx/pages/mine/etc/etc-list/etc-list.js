// pages/flow/pay-password/pay-password.js
import {EtcSelected, EtcUnSelected, QrcodeWxPayLogo, VerifyClose} from '../../../../assets/url/url'
import {getHttpPost, getPostPromise} from "../../../../http/http";
import {etcApi,payApi} from "../../../../http/api";
import {
  formatPlateNumber,
  descentMobile,
  trim,
  formatSpaceId,
  isEmpty,
  keepDecimalFull,
  checkETCNo
} from "../../../../utils/util";
import {MOBILE, OPENID} from "../../../../constants/global";
import {SUPPORT_TYPE} from "../../../../constants/etc-type";
const app = getApp();
const mobile = wx.getStorageSync(MOBILE);
// const mobile = '18366131338';
let countTimer = null;
let count = 59;
const card_type = SUPPORT_TYPE;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    etc_list:[],
    item:{},//选中的item
    icon_select:EtcSelected,
    icon_unselect:EtcUnSelected,
    icon_close:VerifyClose,
    buttonStyle:'button-style-disabled',

    mobile:descentMobile(mobile),
    isShowVerify:false,//验证填写
    countText:`${count}秒`,
    isCanClick:false,
    serverAgree:true,
    etcIsSelected:false,//是否选中ETC卡
    etcIsBank:false,//选中卡片是否有银行卡信息
    verify_code:'',//验证码
  },

  onLoad: function (options) {
    try {
      const params = JSON.parse(decodeURIComponent(options.params));
      if (params){
        this.setData({
          etc_list:params,
        });
      }else {
        this.getOwnedList();
      }
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }

  },

  onShow:function(){
    //从微信车主服务返回来 查询车主服务签约结果
    if(app.globalData.fromVehicle){
      const {item} = this.data;
      const params = {plate_no:item.car_plate_no.toUpperCase()};
      app.globalData.fromVehicle = false;
      this.queryVehicleResult(params);
    }
  },

  //输入完成发送验证
  onInput:function(e){
    this.setData({verify_code:e.detail.value})
    const {item} = this.data;
    console.log(item);
    // const  aa = '370481199111068142'
    if (e.detail.value === item.cert_no.substr(12, item.cert_no.length)){
    // if (e.detail.value === aa.substr(12, aa.length)){
      this.bindETC();
    }else {
      wx.showModal({
        title:'校验失败',
        content:'身份证后六位信息校验失败',
        cancelText:'再次验证',
        cancelColor:'#1C1A24',
        confirmText:'自主绑卡',
        confirmColor:'#00A170',
        success:(res)=>{
          if (res.cancel) {
            console.log('再次验证')
          }
          if (res.confirm) {
            console.log('自主绑卡')
            this.setData({isShowVerify:false});
            wx.navigateTo({url:`/pages/mine/pay/bank-add/bank-add`});
          }
        }
      });
    }
  },

  //选择ETC卡
  onItemClick:function(e){
    const {etc_list} = this.data
    let etcData = etc_list;
    let item = e.currentTarget.dataset.item;
    etcData.map(items=>{
      if (items.etc_card_no === item.etc_card_no){
        items.select = !items.select;
        if (items.select){
          this.setData({
            item:items,
            etcIsSelected:true
          })
          if (items.etcIsBank){
            this.setData({etcIsBank:true})
          }else {
            this.setData({etcIsBank:false})
          }
        }else {
          this.setData({etcIsSelected:false})
        }
      }else {
        items.select = false;
      }
      return items;
    })
    this.setData({
      etc_list:etcData
    })
  },

  //自助绑定
  onSelfBandClick:function(){
    wx.navigateTo({
      url: '/pages/mine/etc/bind/bind'
    });
  },


  //关闭验证码
  onCloseClick: function (options) {
    // this.clearTimer();
    this.setData({
      isShowVerify:false
    })
  },

  //勾选同意
  serverAgreeClick:function(){
    let agree = this.data.serverAgree;
    this.setData({serverAgree:!agree})
  },

  //下一步
  onNextClick:function(){
    const {serverAgree,etcIsSelected,etcIsBank} = this.data;
    this.setData({isShowVerify:true})
    if (etcIsSelected){
      if (serverAgree){
        this.bindETC();
        //notice 静默签约暂时不上
        // if (etcIsBank){
        //   //银行卡签约
        // this.setData({isShowVerify:true})
        // }else {
        //   this.bindETC();
        // }
      }else {
        wx.showToast({title:"未同意ETC免密支付协议", icon:"none"});
      }
    }else {
      wx.showToast({title:"请选择ETC卡", icon:"none"});
    }
  },

  /**
   * 获取用户已开通的支付方式
   * 场景scenario1.（绑定返显的ETC时）若已绑定的支付方式 =>开通完成 否则=>  支付管理
   * 场景scenario2.（静默签约失败）若已绑定的支付方式 =>签约失败返回  否则=>  支付管理
   */
  dealPay:function(scenario){
    getHttpPost(payApi.exitPayment,null,res=>{
      if (res.exit_payment){
        if (scenario===1){
          const resData = {status:'01',}
          const params = encodeURIComponent(JSON.stringify(resData));
          wx.navigateTo({url:`/pages/mine/etc/etc-bind-result/etc-bind-result?params=${params}`});
        }else {
          wx.showToast({title:"绑卡成功",icon:"none"});
          wx.navigateBack();
        }
      }else {
        wx.navigateTo({url: '/pages/mine/pay/list/list'});
        // this.onBindWxVehicle();
      }
    },err=>{
      wx.showToast({title:`${err.msg}:${err.code}`,icon:'none'});
    });
  },

  //绑定ETC
  bindETC:function(){
    wx.showLoading({title:'正在提交...',mask:true});
    const {item,etcIsBank} = this.data;
    const province = checkETCNo(item.etc_card_no);
    const params = {
      etc_belong_province_code:province,
      etc_card_no:item.etc_card_no,
      car_plate_no:trim(item.car_plate_no.toUpperCase()),
      car_plate_color:item.car_plate_color
    }
    getPostPromise(etcApi.bind,params).then(res=>{
      wx.hideLoading();
      //静默签约暂不上线
      // if (etcIsBank){
      //   this.signUnion();
      // }else {
      //   this.dealPay(1);
      // }
      wx.showToast({title:`绑定成功`,icon:'none'});
      this.dealPay(1);
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
  },

  //签约银联
  signUnion:function(){
    const {item} = this.data;
    const params = {
      customer_name:item.user_name,//用户名
      cert_type:item.cert_type,//证件类型
      etc_card_no:item.etc_card_no,//etc卡号
      cert_no:item.cert_no,//证件号
      bank_name:item.bank_name?item.bank_name:null,//银行名称
      bank_corp_org:item.bank_corp_org?item.bank_corp_org:null,//银行简称
      card_type:item.bank_card_type,//银行卡类型
      card_no:item.bank_account,//签约银行卡卡号
      card_tel:mobile,//银行预留手机
      palate_number:item.car_plate_no?trim(item.car_plate_no):null,//车牌号
      palate_color:item.car_plate_color,//车牌颜色
      sign_type:'0',//签约类型 0-银联静默模式，1-普通模式
    }
    wx.showLoading({title:"请稍候...",mask:true});
    getPostPromise(payApi.signUnion,params).then(res=>{
      wx.hideLoading();
      wx.showToast({title:"签约成功",icon:"none"});
      const resData = {status:'01',}
      const params = encodeURIComponent(JSON.stringify(resData));
      wx.navigateTo({url:`/pages/mine/etc/etc-bind-result/etc-bind-result?params=${params}`});
    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
      //签约失败 查询是否存在支付方式
      this.dealPay(2);
    });
  },

  //用户名下ETC查询 网络请求
  getOwnedList:function(){
    wx.showLoading({title:"正在加载...",mask:true});
    getPostPromise(etcApi.owned,null).then(res=>{
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      this.setData({
        etc_list:data,
      })

    }).catch(err=>{
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      });
    });
  },

  /**
   * 数据处理
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
      if (!isEmpty(item.car_plate_no)&&!isEmpty(item.car_plate_color)&&!isEmpty(item.etc_card_no)&&!isEmpty(item.bank_account)&&!isEmpty(item.bank_card_type)&& !isEmpty(item.user_name) &&!isEmpty(item.mobile)&&!isEmpty(item.cert_no)){
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

    //开通微信车主服务
  onBindWxVehicle:function(){
    const {item} = this.data;
    const params = {plate_no:item.car_plate_no.toUpperCase()};
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
    // wx.showLoading({title:"正在查询结果...",mask:true});
    getPostPromise(payApi.query_vehicle,params).then(res=>{
      // wx.hideLoading();
      // wx.showToast({title:"签约成功",icon:"none"});
      this.dealPrePage();
    }).catch(err=>{
      // wx.hideLoading();
      wx.showToast({title:"已绑卡",icon:"none"});
      wx.navigateBack();
    });
  },

  //微信车主服务签约成功 处理上一个界面的显示
  dealPrePage:function(){
    this.timer = setTimeout(()=>{
      const resData = {status:'01',}
      const params = encodeURIComponent(JSON.stringify(resData));
      wx.navigateTo({url:`/pages/mine/etc/etc-bind-result/etc-bind-result?params=${params}`});
      clearTimeout(this.timer);
    },500);
  },
})
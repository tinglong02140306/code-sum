// pages/person/payment/bank-list/bank-list.js
// let card_data=[];
import {formatPlateNumber, formatSpaceId, trim} from "../../../../utils/util";
import {getHttpPost, getPostPromise} from "../../../../http/http";
import {paymentApi, payApi, homeApi} from "../../../../http/api";
import {getLocation} from "../../../../utils/location";
import {PersionNext} from "../../../../assets/url/url";
import {OPENID} from "../../../../constants/global";

const app = getApp();
let location = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:app.globalData.isIphoneX,
    click_id:'',
    bank_card_list:[],
    is_empty:false,
    is_refresh:false,
    is_show_modal:false,
    tail_no:'',
    sign_bank_name:'',
    sign_account_type:'',
    area_code:'370100',
    next_icon:PersionNext,
    rightsData:{
      logo_url:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/icon-ZHYT-logo1578985473037.png',
      name:'中航易通加油优惠',
      equit_type:1,
      desc_list:["所有ETC用户都可领取，加油满200减10", "限济南中航易通前屯加油站使用，每人限领一张"]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPaymentList();
    location = app.globalData.location;
    if(location){
      const {area_code} = location;
      this.setData({area_code:area_code});
      this.getRights(area_code);
    }else {
      getLocation(true,location=>{
        this.setData({area_code:location.area_code});
        app.globalData.location = location;
        this.getRights(location.area_code);
      },err=>{
        wx.showToast({
          title:err,
          icon:"none"
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.is_refresh){
      //刷新数据
      this.getPaymentList();
      //刷新上一页界面
      const pages = getCurrentPages();
      if(pages.length>=2){
        const prePage = pages[pages.length-2];
        prePage.setData({
          is_refresh:true,
        });
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (){
    this.getPaymentList();
  },

  //获取权益 银行优惠
  getRights:function(area_code){
    const params = {
      page_num:1,
      page_size:0,
      area_code:area_code
    }
    getPostPromise(homeApi.rights,params).then(res=>{
      this.setData({rights:res.data,});
    }).catch(err=>{
      console.log(err);
    });
  },

  //权益 银行优惠 item点击（仅中航易通）
  onRightItemClick:function(e){
    this.setData({open_id:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      wx.navigateTo({url:`/pages/home/rights/rights`})
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //权益 银行优惠 item点击
  onRightRequestClick:function(e){
    console.log(e)
    this.setData({open_id:wx.getStorageSync(OPENID)});
    if (wx.getStorageSync(OPENID)){
      let item = e.currentTarget.dataset.item;
      const params = encodeURIComponent(JSON.stringify(item));
      wx.navigateTo({url:`/pages/home/rights-request/rights-request?params=${params}`})
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },
  //点击card事件
  onCardClick:function(e){
    // const bank_card_data = JSON.stringify(e.currentTarget.dataset.item);
    // wx.navigateTo({
    //   url: '/pages/person/payment/bank-detail/bank-detail?bank_card_data='+bank_card_data,
    // });
    let item = e.currentTarget.dataset.item;
    this.setData({
      click_id:item.id,
      tail_no:item.sign_account_no,
      sign_bank_name:item.sign_bank_name,
      sign_account_type:item.sign_account_type,
      is_show_modal:true,
    });

  },
  onCardAdd:function(e){
    wx.navigateTo({
      url: '/pages/mine/pay/bank-add/bank-add'
    });
  },

  //支付信息列表
  getPaymentList:function () {
    getHttpPost(paymentApi.paymentList,{},response=> {
      wx.stopPullDownRefresh();
      this.setData({
        is_refresh:false,
      });
      if (response.result_code === "00000") {
        let card_list = [];
        const data = response.data;
        if(data&&data.length){
          //获取银行卡列表
          card_list = data.filter((item)=>{
            return item.sign_type ==1;
          });
           card_list = card_list.map(item=>{
            item.sign_account_before = item.sign_basis.substr(0,6);
            item.sign_account_before = formatSpaceId(item.sign_account_before);
            item.sign_account_no = item.sign_basis.substr(item.sign_basis.length-4);
            return item;
          });
          if (card_list&&card_list.length){
            this.setData({
              is_empty:false,
              bank_card_list:card_list,
            });
          } else {
            this.setData({is_empty:true,});
          }
        }else {
          this.setData({is_empty:true,});
        }
      } else {
        wx.showToast({
          title: response.result_msg,
          icon: 'none'
        });
      }
    }, fail => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title:fail,
        icon:'none'
      });
    })
  },

  //取消
  onCancel:function(){
    this.setData({is_show_modal:false});
  },

  //解绑请求
  unSign:function (e){
    this.setData({is_show_modal:false});
    const params = {
      id: trim(this.data.click_id),
    };
    wx.showLoading({
      mask:true,
      title: '正在解绑...',
      icon: 'none'
    });
    getHttpPost(payApi.UnSignUnion,params,response=> {
      // app.getHttpPost("/wxapplet/payment/unsign", params,response => {
      if (response.result_code === "00000") {
        wx.hideLoading();
        wx.showToast({
          title:"解绑成功",
          icon:'none'
        });
        this.setData({is_refresh:true});
        wx.startPullDownRefresh();
        const pages = getCurrentPages();
        if(pages.length>=2){
          const prePage = pages[pages.length-2];
          if(prePage.route="pages/person/pay/pay"){
            prePage.setData({is_refresh:true});
          }
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: response.result_msg,
          icon: 'none'
        });
      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({
        title:fail,
        icon:'none'
      });

    })
  },

});
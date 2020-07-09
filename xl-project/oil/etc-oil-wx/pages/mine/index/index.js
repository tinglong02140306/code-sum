// pages/mine/index/index.js
import {OPENID} from '../../../constants/global';
import {MineDefaultHead, MineNext, MineCoupons, MineGold, MineEtc, MineOrders, MinePays, MineInvoices} from '../../../assets/url/url';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    icon_default_head:MineDefaultHead,
    icon_next:MineNext,
    icon_coupons:MineCoupons,
    icon_gold:MineGold,
    icon_etc:MineEtc,
    icon_orders:MineOrders,
    icon_pays:MinePays,
    icon_invoices:MineInvoices
  },

  onShow:function(){
    this.setData({openid:wx.getStorageSync(OPENID)});
  },

  /**
   * 切换账号
   */
  onChangeUserClick:function(){
    const {openid} = this.data;
    //已登录状态 切换账号
    if(openid){
      wx.setStorageSync(OPENID, '');
      wx.showModal({
        title:'切换账号',
        content:'确定要切换账号吗？',
        success:(res)=>{
          if (res.confirm) {
            wx.setStorageSync(OPENID, "");
            this.setData({openid:""});
          }
        }
      });
    }else{//未登录状态 登录
      this.dealLogin();
    }
  },

  //我的订单
  onOrdersClick:function() {
    this.dealLogin();
    wx.navigateTo({url: '/pages/mine/order/list/list'});
  },

  //支付管理
  onPaysClick:function() {
    this.dealLogin(); 
    wx.navigateTo({url: '/pages/mine/pay/list/list'});
  },

  //发票抬头管理
  onInvoicesClick:function() {
    this.dealLogin();
    wx.navigateTo({url: '/pages/mine/invoice/index/index'});  
  },

  // etc卡点击
  onCardClick: function () {
    this.dealLogin();
    wx.navigateTo({url: '/pages/mine/etc/list/list'});
  },

  //优惠券
  onCouponsClick:function(e){
    this.dealLogin();
    wx.navigateTo({url: '/pages/mine/coupons/list/list'});
  },

  //加油金
  onCargoClick:function(e){
    this.dealLogin();
    wx.navigateTo({url: '/pages/mine/gold/list/list'});
  },

  //处理登录逻辑
  dealLogin:function() {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid}); 
  }
})
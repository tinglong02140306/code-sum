// pages/person/payment/bank-list/bank-list.js
// let card_data=[];
import {formatPlateNumber, formatSpaceId, trim} from "../../../../utils/util";
import {getHttpPost} from "../../../../http/http";
import {paymentApi,payApi} from "../../../../http/api";

const app = getApp();

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPaymentList();
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
    wx.showLoading({mask:true,});
    getHttpPost(paymentApi.paymentList,{},response=> {
      wx.stopPullDownRefresh();
      wx.hideLoading();
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
      wx.hideLoading();
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
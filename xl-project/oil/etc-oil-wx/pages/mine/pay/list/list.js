// pages/person/pay/pay.js
import {WePay, UnionPay, PersionNext, PayDiscounts, PayMove, CCBLOGO} from "../../../../assets/url/url";
import {getHttpPost} from "../../../../http/http";
import {paymentApi} from "../../../../http/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cell_data: [],
    isWeChat: false,
    isWxVehicle:false,
    isCCB:false,
    isUpdate: false,
    isEmpty: true,
    isShowHint: false,
    is_refresh: false,
    optionList: [],
    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },
    pageInfo: {
      rowHeight: 120,
      scrollHeight: 100,
      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    },
    wx_icon:WePay,
    union_icon:UnionPay,
    next_icon:PersionNext,
    discounts_icon:PayDiscounts,
    move_icon:PayMove,
    icon_ccb:CCBLOGO
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPaymentSequence();
  },

  onShow: function (options) {
    if (this.data.is_refresh){
      this.getPaymentSequence();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.isUpdate) {
      this.verdictPaymentSequence();
    }
  },

  onHide: function () {
    if (this.data.isUpdate) {
      this.verdictPaymentSequence();
    }
  },

  //开通微信车主服务
  signWxVehicle:function(){
    wx.navigateTo({url:`/pages/mine/pay/vehicle/vehicle`});
  },

  //更多银行卡优惠
  onCardMore: function (e) {
    wx.navigateTo({
      url: '/pages/mine/pay/bank-list/bank-list'
    });
  },

  //支付方式排序列表
  getPaymentSequence: function () {
    wx.showLoading({mask: true,title:"正在加载..."});
    getHttpPost(paymentApi.paymentList,{},res=> {
          wx.hideLoading();
          const data = res.data;
          for(let i=0; i<data.length; i++){
            const item = data[i];
            // if(item.sign_status===1){}//0-未签约 1-已签约 2-已解约
            if(item.sign_type==1){//1-银行卡，2-支付宝，3-微信 6:微信车主服务
              item.sign_account_before = item.sign_basis.substr(0, 6);
              item.sign_account_no = item.sign_basis.substr(item.sign_basis.length - 4);
              const type = item.sign_account_type=='0'?"借记卡卡":item.sign_account_type=='1'?"信用卡":'';
              item.title = `${item.bank_name}${type}(${item.sign_account_no})`
              item.bank_title_logo = item.bank_title_logo_url;
            }else if(item.sign_type==3){
              item.bank_title_logo = WePay;
              item.title="微信免密支付";
              this.setData({isWeChat:true});
            }else if(item.sign_type==6){
              item.bank_title_logo = WePay;
              item.title=`微信免密支付`;
              this.setData({isWxVehicle:true});
            }else if(item.sign_type==7){
              item.bank_title_logo = CCBLOGO;
              item.title=`龙支付无感支付(${item.sign_account_no})`;
              this.setData({isCCB:true});
            }
          }
          this.setData({
            isEmpty: !data.length,
            is_refresh: false,
            cell_data: data,
            optionList: data,
          });
        },
        fail => {
          wx.hideLoading();
          wx.showToast({
            title: fail.msg,
            icon: 'none'
          });
        });
  },

  dragStart: function (event) {
    let startIndex = event.target.dataset.index
    // 初始化页面数据
    let pageInfo = this.data.pageInfo
    pageInfo.startY = event.touches[0].clientY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex
    this.setData({
      'movableViewInfo.y': pageInfo.startY - pageInfo.rowHeight
    })
    // 初始化拖动控件数据
    let movableViewInfo = this.data.movableViewInfo
    movableViewInfo.data = this.data.optionList[startIndex]
    movableViewInfo.showClass = "inline"
    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove: function (event) {
    let optionList = this.data.optionList
    let pageInfo = this.data.pageInfo
    // 计算拖拽距离
    let movableViewInfo = this.data.movableViewInfo
    let movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - pageInfo.rowHeight + movedDistance
    // 修改预计放置位置
    let movedIndex = parseInt(movedDistance / (pageInfo.rowHeight / 2))
    let readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    } else if (readyPlaceIndex >= optionList.length) {
      readyPlaceIndex = optionList.length - 1
    }
    if (readyPlaceIndex != pageInfo.selectedIndex) {
      let selectedData = optionList[pageInfo.selectedIndex]
      optionList.splice(pageInfo.selectedIndex, 1)
      optionList.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    this.setData({
      movableViewInfo: movableViewInfo,
      optionList: optionList,
      pageInfo: pageInfo
    })
  },

  dragEnd: function (event) {
    this.setData({
      isUpdate: true,
    });
    // 重置页面数据
    let pageInfo = this.data.pageInfo
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    let movableViewInfo = this.data.movableViewInfo
    movableViewInfo.showClass = 'none'
    this.setData({
      pageInfo: pageInfo,
      movableViewInfo: movableViewInfo
    })
  },

  //判断顺序是否改变
  verdictPaymentSequence: function () {
    let dataArr = this.data.optionList;
    let updateArr = [];
    for (let i = 0; i < dataArr.length; i++) {
      let sign_sequence = i ;
      let id = dataArr[i].id;
      let sign_type = dataArr[i].sign_type;
      let item = {id: id, sign_sequence: sign_sequence,sign_type:sign_type}
      updateArr.push(item);
    }
    const params = updateArr;
    for (let j = 0; j < dataArr.length; j++) {
      if (dataArr[j].sign_sequence != updateArr[j].sign_sequence) {
        this.updatePaymentSequence(params);
      }
    }
  },

  //修改顺序
  updatePaymentSequence: function (params) {
    wx.showLoading({
      mask: true,
      title: '正在保存...',
      icon: 'none'
    });
    getHttpPost(paymentApi.updatePayment,params,res=>{
          wx.hideLoading();
        },
        fail => {
          wx.hideLoading();
          wx.showToast({
            title: fail.msg,
            icon: 'none'
          });
        }
    );
  },

});
// pages/stations/index/index.js
import {billApi} from '../../../../http/api';
import {getHttpPost} from '../../../../http/http';
import {keepDecimalFull,keepTwoDecimalFull,dateFormat} from "../../../../utils/util";
const app = getApp();
let page_num = 1;
const page_size = 10;
const navigationBarHeight = app.globalData.navigationBarHeight;
const tabHeight = 90;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consume_type:0,//0全部 1加油 2洗车
    order_type:null,//null全部 GAS加油,WASH加油,COUPON_PACKAGE券包
    bill_type:0,//0-全部，1-已开票，2-未开票
    showConsume:false,
    isEmptyList:false,
    bill_list:[],
    isShowLoadingMore:false,
    loadingState:'',
    isLoadingFinish:false,
    is_refresh:false,
    show_finish:false,
    load_status:0,//上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher:true,//下拉刷新状态
    status:0,//1:列表为空 2:网络连接失败
    scroll_height:`calc(100vh - ${tabHeight}rpx - 20rpx)`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'正在加载...',
      mask:true
    });
    this.getBillList();
  },

  /**
   * 开具发票
   */
  goInvoice:function(){
    this.setData({
      showConsume:false,
    });
    wx.navigateTo({
      url: '/pages/mine/invoice/index/index'
    })
  },
  /**
   * 点击详情
   */
  onCellClick:function(e){
    const details = e.currentTarget.dataset.item;
    console.log(JSON.stringify(details))
    this.setData({
      showConsume:false,
    });
    wx.navigateTo({
      url: '/pages/mine/order/details/details?details='+encodeURIComponent(JSON.stringify(details))
    })
  },

  /**
   * 选择类型
   */
  showType:function(e){
    const showConsume = this.data.showConsume;
    this.setData({
      showConsume:!showConsume,
    });
    console.log(showConsume)
  },

  /**
   * 消费类型
   */
  onChangeType: function (e) {
    const consume_type = e.currentTarget.dataset.item;
    this.setData({
      // consume_type:consume_type,
      order_type:consume_type,
    });
    this.onRefresh();
  },

  /**
   * 账单查询
   */
  getBillList:function(){
    wx.showLoading({title:"正在加载...",mask:true});
    const {order_type} = this.data;
    const params = {
      page_num:page_num,
      page_size:page_size,
      order_type:order_type,
    }
    console.log('params'+JSON.stringify(params));
    getHttpPost(billApi.list,params,res=>{
      console.log(res);
      wx.stopPullDownRefresh();
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      const list = page_num==1?data:this.data.bill_list.concat(data);
      this.setData({
        bill_list:list,
        isEmptyList:list&&list.length?false:true,
        refresher:false,
        load_status:data.length<page_size?2:0,
        status:list&&list.length?0:1,
        load_page:2
      });

    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
      let status = this.data.bill_list==null&&err.code==10?2:0;
      this.setData({
        refresher:false,
        status:status,
        load_status:err.code==10?0:this.data.load_status
      })
    });
  },

  //下拉刷新
  onRefresh:function(){
    page_num = 1;
    this.setData({refresher:true})

    if (this.data.consume_type === 2){
      this.setData({refresher:false})
    }else {
      this.getBillList();
    }
  },

  //加油上拉加载更多
  onLoadMore:function(){
    page_num++;
    this.setData({load_status:1})
    this.getBillList();
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    page_num = 1;
    this.getBillList();
  },

  /**
   * 数据处理
   */
  dealResponse:function(data){
    return data&&data.map(item=>{
      const m = item.create_time.substr(5,2)
      const d = item.create_time.substr(8,2)
      const ss = item.create_time.substr(10,6)
      item.invoice_create_time_str = m+'月'+ d+'日'+ss;
      item.order_price = keepTwoDecimalFull(item.order_price);
      item.order_quantity = keepTwoDecimalFull(item.order_quantity);
      item.actual_amount = keepTwoDecimalFull(item.actual_amount);
      item.actual_amount_wash = keepDecimalFull(item.order_quantity,0).replace('.','');
      return item;
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
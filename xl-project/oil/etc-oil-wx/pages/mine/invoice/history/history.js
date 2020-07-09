import {formatTime, keepTwoDecimalFull} from '../../../../utils/util';
import {InvoiceItemIcon} from "../../../../assets/url/url"
import {getHttpPost} from "../../../../http/http";
import {invoiceApi} from "../../../../http/api";
const app = getApp();
let page_num = 1;
const PAGESIZE = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice_list:[],
    isEmptyList:false,
    icon_invoice:InvoiceItemIcon,
    isShowLoadingMore:false,
    loadingState:'',
    isLoadingFinish:false,
    is_refresh:false,
    show_finish:false,
    load_status:0,//上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
    refresher:true,//下拉刷新状态
    status:0,//1:列表为空 2:网络连接失败
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page_num = 1;
    // this.setData({invoice_list:data});
    wx.showLoading({
      title:'正在加载...',
      mask:true
    });
    this.getHttpData(page_num);
  },

  onShow:function(){
    if(this.data.is_refresh){
      wx.showLoading({
        title:'正在加载...',
        mask:true
      });
      this.getHttpData(page_num);
      this.setData({is_refresh:false});
    }
  },

  //下拉刷新
  onRefresh:function(){
    page_num = 1;
    this.setData({refresher:true})
    this.getHttpData(page_num);
  },

  //加油上拉加载更多
  onLoadMore:function(){
    page_num++;
    this.setData({load_status:1})
    this.getHttpData(page_num);
  },

  //网络连接失败 重新加载
  onRetryClick:function(){
    page_num = 1;
    this.getHttpData(page_num);
  },

  //item点击 查看详情
  onInvoiceItemClick:function(e){
    const details = e.currentTarget.dataset.item;
    wx.navigateTo({
      url:"/pages/mine/invoice/details/details?details="+encodeURIComponent(JSON.stringify(details))
    });
  },


  //请求发票列表
  getHttpData:function(page_num){
    const params = {
      page_num:page_num,
      page_size:PAGESIZE
    }
    const {invoice_list} = this.data;
    getHttpPost(invoiceApi.historyList,params,res=> {
      wx.hideLoading();
      const data = this.dealResponse(res.data);
      const list = page_num==1?data:this.data.invoice_list.concat(data);
      this.setData({
        invoice_list:list,
        isEmptyList:list&&list.length?false:true,
        refresher:false,
        load_status:data.length<PAGESIZE?2:0,
        status:list&&list.length?0:1,
        load_page:2
      });
    },err=> {
      wx.hideLoading();
      wx.showToast({title: err.msg, icon: "none"});
      let status = this.data.bill_list == null && err.code == 10 ? 2 : 0;
      this.setData({
        refresher: false,
        status: status,
        load_status: err.code == 10 ? 0 : this.data.load_status
      })
    })
  },

  /**
   * 数据处理
   */
  dealResponse:function(data){
    return data&&data.map(item=>{
      const y = item.invoice_create_time.substr(0,4);
      const m = item.invoice_create_time.substr(5,2);
      const d = item.invoice_create_time.substr(8,2);
      const ss = item.invoice_create_time.substr(10,6);
      item.invoice_create_time_str =y+'.'+m+'.'+ d+ss;
      item.invoice_create_time_str_s =y+'.'+m+'.'+ d;
      item.invoice_total_money = keepTwoDecimalFull(item.invoice_total_money);
      return item;
    })
  },

})
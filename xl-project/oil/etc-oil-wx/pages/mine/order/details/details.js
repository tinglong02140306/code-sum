// pages/mine/order/details/details.js
import {keepDecimalFull, keepTwoDecimalFull} from "../../../../utils/util";
import {getHttpPost} from "../../../../http/http";
import {billApi} from "../../../../http/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gas_station_name:'',//加油站名称
    gas_station_address:'',//加油站地址
    logo_url:'',//加油站图片
    order_no:'',//订单号
    order_create_time:'',//下单时间
    oil_detail:'',//油品详情
    oil_type:'',//油品类型
    oil_price:'',//油品单价
    oil_num:'',//油品数量
    gun_no:'',//油枪号
    oil_no:'',//油号
    oil_consume_money:'',//实际金额
    oil_total_money:'',//定单金额
    oil_discount_money:'',//优惠金额
    car_plate_no:'',//车牌号
    etc_card_no:'',//ETC卡号
    details:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const details = JSON.parse(decodeURIComponent(options.details));
      if (details.order_type!=='GAS'){
        this.getBillDetails(details)
      }else {
        this.setData({
          details:details,
          gas_station_name:details.gas_station_name||'',//加油站名称
          gas_station_address:details.gas_station_address||'',//加油站地址
          logo_url:details.logo_url||'',//加油站图片
          order_no:details.order_no||'',//订单号
          order_create_time:details.order_create_time||'',//下单时间
          oil_detail:details.oil_detail||'',//油品详情
          oil_type:details.oil_type||'',//油品类型
          oil_price:details.oil_price||'',//油品单价
          oil_num:details.oil_num||'',//油品数量
          gun_no:details.gun_no||'',//油枪号
          oil_no:details.oil_no||'',//油号
          oil_consume_money:details.oil_consume_money||'',//实际金额
          oil_total_money:details.oil_total_money||'',//定单金额
          oil_discount_money:details.oil_discount_money||'',//优惠金额
          car_plate_no:details.car_plate_no||'',//车牌号
          etc_card_no:details.etc_card_no||'',//etc卡号
        });
      }

    } catch (error) {
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  /**
   * 账单查询
   */
  getBillDetails:function(details){
    wx.showLoading({title:"正在加载...",mask:true});
    const params = {
      order_type:details.order_type,
      order_no:details.order_no,
    }
    console.log('params'+JSON.stringify(params));
    getHttpPost(billApi.details,params,res=>{

      wx.hideLoading();
      const data = this.dealResponse(res);
      this.setData({details:data});

    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  /**
   * 数据处理
   */
  dealResponse:function(item){
    const m = item.create_time.substr(5,2)
    const d = item.create_time.substr(8,2)
    const ss = item.create_time.substr(10,6)
    item.invoice_create_time_str = m+'月'+ d+'日'+ss;
    item.order_price = keepTwoDecimalFull(item.order_price);
    item.order_quantity = keepTwoDecimalFull(item.order_quantity);
    item.actual_amount = keepTwoDecimalFull(item.actual_amount);
    item.actual_amount_wash = keepDecimalFull(item.order_quantity,0).replace('.','');
    return item;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/stations/clean/clean-order/clean-order.js
import {PerferPull, FastOrderUnCheck,FastUnCheck, FastOrderCheck,FastOrderClose, PerferUsed} from '../../../../assets/url/url'
import {getHttpPost} from "../../../../http/http";
import {stationsApi,couponPackageApi,cleanApi} from "../../../../http/api";
import {CODE_WASHER, PAYBACK,OPENID} from "../../../../constants/global";
import {keepTwoDecimalFull} from "../../../../utils/util";
const app = getApp();
let timer = null;
let params = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    washer_id:'19',
    order_no:'',
    station_name:'',
    order_amount:'',
    new_order_amount:'',
    real_amount:'0.00',//最终支付金额
    wash_coupon_count:0,//洗车券数
    clean_buy_check:FastOrderCheck,
    clean_un_check:FastUnCheck,
    FastOrderCheck:FastOrderCheck,
    FastOrderUnCheck:FastUnCheck,
    // FastOrderCheck:'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon-seleced-radio1586867507286.png',
    // FastOrderUnCheck:FastOrderUnCheck,
    close_icon: FastOrderClose,
    perferentList: [],
    preferent: 0,//优惠券个数
    available: 0,//可用优惠券个数
    coupon_put_id:null,
    rule_icon: PerferPull,
    finish_icon: PerferUsed,
    coupon_value: '',
    isIphoneX:app.globalData.isIphoneX,

    packageList:[],//券包列表
    coupon_count:0,//剩余洗车券数
    coupons_select:true,//洗车券选中状态
    // is_show_coupon:true
    package_id:'',//选中的券包
    payBack:false,//支付回调
  },

  //提交订单
  onSubmitClick:function(){
    if (this.data.package_id){
      this.onBuyPackage();
    }else {
      this.submitOrder();
    }
    // wx.navigateTo({url:`/pages/stations/clean/clean-notice/clean-notice`});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCouponPackageList();
    // this.getPerferent();
    try {
      params = JSON.parse(decodeURIComponent(options.params));
      let count = params.wash_coupon_count
      this.setData({
        details:params,
        washer_id:params.washer_id,
        order_no:params.order_no,
        station_name:params.station_name,
        order_amount:params.order_amount,
        wash_coupon_count:params.wash_coupon_count,
        coupon_count:params.wash_coupon_count,
        real_amount:count>0?'0.00':params.order_amount,//最终支付金额
        coupons_select:count>0?true:false,//最终支付金额
      });
      this.getCouponPackageList();
      this.getPerferent();
    } catch (error) {
      console.log(error)
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (!this.data.payBack){
      this.getOrder();//支付成功跳转注意事项页面，返回判断成功状态到上一页面
    }else {
      // if (wx.getStorageSync(PAYBACK)){
      //   wx.navigateBack();
      // }
    }

  },

  onHide:function(){
    timer&&clearTimeout(timer);
  },

  //使用洗车券支付
  onCleanCouponsClick: function(){
    const {coupons_select,coupon_count,packageList,new_order_amount,order_amount,coupon_value} = this.data;
    let select = coupons_select;//洗车券选中状态
    let is_bag = false;//券包选中状态
    packageList.map(item=>{
      if (item.isSelect){
        is_bag = true;
        return false;
      }
    })
    if (coupon_count>0){
      if (!is_bag){
        this.setData({coupons_select:!select})
        if (select){
          this.setData({
            real_amount:coupon_value?new_order_amount?new_order_amount:order_amount:order_amount,
          })
        }else {
          this.setData({
            real_amount:'0.00',
            coupon_value:'',
          })
        }
      }
    }
  },

  //选择洗车券包
  onPackageClick: function(e){
    const {wash_coupon_count,new_order_amount,order_amount,packageList,coupon_value} = this.data
    let packageData = packageList;
    let count = wash_coupon_count;
    let item = e.currentTarget.dataset.item;
    packageData.map(items=>{
      if (items.package_id === item.package_id){
        items.isSelect = !items.isSelect;
        if (items.isSelect == true){
          this.setData({
            coupons_select:true,
            coupon_value:'',
            real_amount:items.package_price,
            coupon_count:wash_coupon_count+items.coupon_count,
            package_id:items.package_id,
          })
        }else {
          if (this.data.coupon_count>0){
            this.setData({
              coupons_select:false,
              coupon_count:wash_coupon_count,
              real_amount:coupon_value?new_order_amount?new_order_amount:order_amount:order_amount,
              package_id:'',
            })
          }
        }
      }else {
        items.isSelect = false;
      }
      return items;
    })
    this.setData({
      packageList:packageData
    })
  },

  //选择优惠券
  onChangeCoupon: function () {
    if (this.data.preferent) {
      this.setData({ is_show_coupon: true });
    }
  },

  //关闭优惠券列表
  onCloseClick: function () {
    this.setData({ is_show_coupon: false });
  },

  //优惠券选择
  onCheckPergerent: function (e) {
    const { perferentList, order_no ,new_order_amount,order_amount} = this.data;
    const { index, status } = e.detail;
    this.setData({
      is_show_coupon: false,
      coupons_select: false,
      coupon_value: status ? perferentList[index].coupon_amt : '',
      coupon_put_id: status ? perferentList[index].coupon_push_id : null
    });
    if (status){
      const params = {
        order_no:order_no,
        coupon_put_id:status ? perferentList[index].coupon_push_id : null
      }
      this.getCalculateCoupon(params);
    }else {
      this.setData({
        real_amount:status?new_order_amount?new_order_amount:order_amount:order_amount,
      })
    }

  },

  //优惠券计算
  getCalculateCoupon: function (params) {
    wx.showLoading({
      title: "正在加载...",
      icon:'none'
    });
    getHttpPost(cleanApi.calculateCoupon, params, res => {
      wx.hideLoading();
      this.setData({
        real_amount:res.payable_amount,
        new_order_amount:res.payable_amount,
      })
    },err => {
      wx.hideLoading();
      wx.showToast({
        title:`${err.msg}:${err.code}`,
        icon:'none'
      })
    });
  },

  //获取优惠券数据
  getPerferent: function () {
    console.log('order_amount=='+this.data.order_amount)
    const params = {
      washer_id: this.data.washer_id,
      payable_amount: this.data.order_amount,
    }
    getHttpPost(cleanApi.couponQuery, params, res => {
      //获取可用的优惠券
      const enabledList = res.data&&res.data.filter(item=>{
        return item.enabled;
      })
      this.setData({
        preferent:res.data&&res.data.length,
        available:enabledList&&enabledList.length,
        perferentList:res.data||[]
      })
    }, fail => {
      console.log("获取优惠券数据失败");
    });
  },

  //提交订单(不选券包)
  submitOrder: function () {
    wx.showLoading({
      title: "支付中...",
      icon:'none'
    });
    const {coupons_select,order_no,coupon_put_id} = this.data;
    const paramsData = {
      order_no:order_no,
      coupon_put_id:coupons_select?null:coupon_put_id,
      use_wash_coupon:coupons_select?true:false,
      // order_payment:coupons_select?'09':'04',//支付宝支付-03，微信支付-04，免单券支付-09
    }
    getHttpPost(cleanApi.submitOrder, paramsData, res => {
      if (res.need_pay) {
        wx.hideLoading();
        this.goPay(res.pay_params)
      }else{
        wx.hideLoading();
        wx.showToast({
          title: "支付成功",
          icon: 'none'
        });
        const details = encodeURIComponent(JSON.stringify(params));
        wx.navigateTo({url:`/pages/stations/clean/clean-notice/clean-notice?params=${details}`});
        //延迟3秒跳转
        // timer = setTimeout(()=>{
        //   const details = encodeURIComponent(JSON.stringify(params));
        //   wx.navigateTo({url:`/pages/stations/clean/clean-notice/clean-notice?params=${details}`});
        // },1000);
      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({
        title: `${fail.msg}`,
        icon: 'none'
      });    });
  },

  //买券包
  onBuyPackage: function(){
    wx.showLoading({
      title: "请稍候...",
      mask: true
    });
    const params = {
      wash_order_no: this.data.order_no,
      package_id: this.data.package_id,
    };
    getHttpPost(couponPackageApi.order, params, response => {
      wx.hideLoading();
      this.goPay(response.pay_params)
      // if (response.need_pay) {
      //   this.goPay(response.pay_params)
      // }else{
      //   wx.hideLoading();
      //   wx.showToast({
      //     title: "支付成功",
      //     icon: 'none'
      //   });
      //   timer = setTimeout(()=>{
      //     wx.navigateBack({delta: 2})
      //   },1400);
      // }
    },err => {
      wx.hideLoading();
      wx.showToast({
        title: `${err.msg}:${err.code}`,
        icon: 'none'
      });
    });
  },
  //调起支付
  goPay: function (paramsData) {
    const that = this;
    try {
      const data = JSON.parse(paramsData);
      wx.requestPayment(
          {
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function () {
              wx.hideLoading();
              const paramsNext = {
                washer_id:that.data.washer_id,
                order_no:that.data.order_no,
              }
              const details = encodeURIComponent(JSON.stringify(paramsNext));
              wx.navigateTo({url:`/pages/stations/clean/clean-notice/clean-notice?params=${details}`});
              },
            fail: function (errMsg) {
              wx.hideLoading();
              // console.log(errMsg.errMsg)
              that.setData({payBack:true})
              if (errMsg.errMsg == 'requestPayment:fail cancel'){
                that.removeCache();
              }
            },
            complete: function (res) {
              that.setData({payBack:true});//支付成功跳转注意事项页面，返回判断成功状态到上一页面
            }
          })
    } catch (err) {
      console.log(err);
      wx.showToast({title:"参数格式错误",icon:"none"});
    }
  },

  //洗车券包列表查询
  getCouponPackageList:function(){
    getHttpPost(couponPackageApi.list,{},res=> {
      wx.hideLoading();
      const data = this.dealPackageResponse(res.data);
      this.setData({
        packageList:data,
      });
    },err=> {
      wx.hideLoading();
      wx.showToast({title: err.msg, icon: "none"});
    })
  },

  //洗车券包数据处理
  dealPackageResponse:function(data){
    return data&&data.map(item=>{
      let discount = item.discount_rate.toString().replace('0','').replace('.','');
      item.discount_rate = discount.replace('0','');
      item.package_price = keepTwoDecimalFull(item.package_price);
      item.isSelect = false;
      return item;
    })
  },

  //删除用户在该洗车点的订单缓存
  removeCache:function(){
    const {washer_id,} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.removeCache,paramsData,res=>{
      this.createOrder();
      wx.hideLoading();
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //创建订单
  createOrder: function(){
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.createOrder,paramsData,res=>{
      if (res.result_code === "00000") {
        this.setData({
          order_no:res.order_no,
          station_name:res.station_name,
          order_amount:res.order_amount,
          wash_coupon_count:res.wash_coupon_count,
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    },err=>{
      wx.hideLoading();
      wx.showToast({title:err.msg,icon:"none"});
    });
  },

  //检查用户在该洗车点的订单信息
  getOrder:function(){
    console.log('洗车点的订单信息'+JSON.stringify(this.data.details))
    const {washer_id} = this.data;
    const paramsData = {
      washer_id:washer_id,
    }
    getHttpPost(cleanApi.getOrder,paramsData,res=>{
      if (res.result_code === "00000") {
        if (res.order_status === '1'){
          //支付成功<=启动洗车机
          wx.navigateBack();
        }else if (res.order_status === '2'){
          //消费成功<=洗车中
          wx.navigateBack();
        }else {
          //继续执行
          // this.onCleanCheck();
        }
      }
    },err=>{
      // this.setData({isShowFar:true,})
      wx.showToast({title:err.msg,icon:"none"});
    });
  },
})
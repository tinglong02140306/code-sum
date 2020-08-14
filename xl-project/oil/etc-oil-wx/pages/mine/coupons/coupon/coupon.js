import {qrApi} from '../../../../utils/qrcode';
import {CouponFail, CouponSuccess} from '../../../../assets/url/url';
import {getHttpPost} from '../../../../http/http';
import {accountApi} from '../../../../http/api';
const app = getApp();
const QR = require('../../../../utils/weapp-qrcode.js')
const {screenWidth, isIphoneX, windowHeight} = app.globalData;
let qrcodewidth = 235;
const SUCCESS = '核销成功';
const FAIL = '核销失败';
let couponTask = null;
let resultCount = 0;//获取消费结果的次数 最大为2次
Page({

  data: {
    code:'',
    result_text:'',
    result_image:'',
    coupon_put_id:'',
    payment_status:'',
    qrcodewidth:235,
    qr_code_image:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //二维码显示参数
    qrcodewidth = parseInt(screenWidth*0.65);//二维码宽高
    this.setData({qrcodewidth:qrcodewidth});

    resultCount = 0;
    const coupon_put_id = options.coupon_put_id||'';
    this.setData({coupon_put_id:coupon_put_id});
    this.getCode(coupon_put_id);
  },

  // 触发下拉刷新时执行
  onPullDownRefresh: function() {
    resultCount = 0;
    const coupon_put_id = this.data.coupon_put_id;
    this.getCode(coupon_put_id);
  },

  //页面隐藏
  onHide:function(){
    resultCount = 0;
    couponTask&&couponTask.abort();
  },

  //页面关闭
  onUnload:function(){
    resultCount = 0;
    couponTask&&couponTask.abort();
  },

  /**
   * 获取提货券码
   */
  getCode:function(coupon_put_id){
    const params = {coupon_put_id:coupon_put_id}
    wx.showLoading({title:'正在获取券码...',mask:true});
    getHttpPost(accountApi.qrcode,params,res=>{
      wx.hideLoading();
      wx.stopPullDownRefresh();
      const qr_code = res.qr_code;
      this.setData({code:qr_code});
      this.drawImg(qr_code);
      //获取该二维码对应的状态
      this.getResult(qr_code);
      // if(qr_code){//二维码获取成功
      //   qrApi.draw(qr_code, "qrcode", qrcodewidth, qrcodewidth, null, null);
      //   this.setData({code:qr_code});
      //   //获取该二维码对应的状态
      //   this.getResult(qr_code);
      // }else {
      //   wx.showToast({title:"二维码为空",icon:'none'});
      // }
      // this.setData({code:qr_code});
      // qrApi.draw(qr_code, "coupon", width, width, null);
      // this.getResult(qr_code);
    },err=>{
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({title:`${err.msg}:${err.code}`,icon:"none"});
    });
  },
  drawImg: function (qr_code) {
    let imgData = QR.drawImg(qr_code, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 410
    })
    this.setData({
      qr_code_image: imgData
    })
  },
  /**
   * 获取核销结果
   */
  getResult:function(qr_code){
    couponTask&&couponTask.abort();
    const params = {qr_code:qr_code}
    if(resultCount<2){
      resultCount++;
      couponTask = getHttpPost(accountApi.qrcode_result,params,res=>{
        console.log(res)
        if(res.payment_status=="01"){
          this.setData({
            result_text:SUCCESS,
            result_image:CouponSuccess,
            payment_status:'01'
          })
          const pages = getCurrentPages();
          if(pages.length>=2){
            const prePage = pages[pages.length-2];
            if(prePage.route="pages/mine/coupons/list/list"){
              prePage.onRefreshCoupon();
              resultCount = 2;
              setTimeout(()=>{
                wx.navigateBack();
              },800);
            }
          }
        }else if(res.payment_status=="02"){
          this.setData({
            result_text:FAIL,
            result_image:CouponFail,
            payment_status:'02'
          })
        }
      },err=>{
        console.log(err)
        if(resultCount===1){
          this.getResult(qr_code);
        }
      })
    }
  },
})
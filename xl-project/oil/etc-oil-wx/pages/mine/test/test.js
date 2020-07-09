// pages/mine/test/test.js
import {MOBILE, OPENID} from '../../../constants/global';
import {MineDefaultHead, MineNext, MineShareH, MineOrdersH, MineContactH, MineInvoicesH,MineEtcAdd} from '../../../assets/url/url';
const DEFAULT_PAGE = 0;
import {formatPlateNumber, formatSpaceId, formatSpacePlate, isEmpty, trim} from "../../../utils/util";
import {getHttpPost,getPostPromise} from "../../../http/http";
import {etcApi,userApi} from "../../../http/api";
import {SUPPORT_TYPE} from "../../../constants/etc-type";

const app = getApp();
const obj = {bind_status: 1, car_plate_color: '',car_plate_no: "",etc_card_no: "",etc_card_no_str: "", is_enough:true}
const card_height_big='height:260rpx';
const card_height_small='height:230rpx';
const card_type = SUPPORT_TYPE;

Page({

  startPageX: 0,
  currentView: DEFAULT_PAGE,
  /**
   * 页面的初始数据
   */
  data: {
    navigationBarHeight:app.globalData.navigationBarHeight+40,
    isIphoneX: app.globalData.isIphoneX,
    openid:'',
    icon_default_head:MineDefaultHead,
    icon_next:MineNext,
    icon_orders:MineOrdersH,
    icon_invoices:MineInvoicesH,
    icon_etc_add:MineEtcAdd,
    icon_contact:MineContactH,
    icon_share:MineShareH,

    unused_coupon_count:0,//未用券数量
    account_balance:'0.00',//加油金余额
    payment_way_count:0,//支付方式
    banners:[{url:'https://oss.etcsd.com/object/7bd6f18a841d4de8b3f27dfc0caf2c26'},{url:'https://oss.etcsd.com/object/7bd6f18a841d4de8b3f27dfc0caf2c26'}],//轮播图

    toView: `card_${DEFAULT_PAGE}`,
    card_list: [],//ETC列表
    isCardEmpty:true,//ETC列表为空
    isEnough:false,//是否满5张ETC
    isEtcRefresh:false,//刷新ETC列表
    isRefresh:false,//个人信息
    show_pop:false,//弹层
    click_type:1,//1:解绑2：启用 3：停用

    card_height:'height:260rpx',
    scroll:false,
    isRefreshCard:false,//ETC列表刷新
    mobile:wx.getStorageSync(MOBILE)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //已登录状态 切换账号
    if(wx.getStorageSync(OPENID)){
      this.getAllInfo();
    }else {
      this.setData({isCardEmpty:true});
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    this.setData({openid:wx.getStorageSync(OPENID)});
    if(wx.getStorageSync(OPENID)){
      this.getAllInfo();
      this.setData({isRefreshCard:true});
    }else {
      this.setData({
        isRefreshCard:false,
        isCardEmpty:true,
        unused_coupon_count:0,//未用券数量
        account_balance:'0.00',//加油金余额
        payment_way_count:0,//支付方式
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
            this.setData({
              openid:"",
              isCardEmpty:true,
              unused_coupon_count:0,//未用券数量
              account_balance:'0.00',//加油金余额
              payment_way_count:0,//支付方式
            });
          }
        }
      });
    }else{//未登录状态 登录
      this.dealLogin();
    }
  },

  //处理登录逻辑
  dealLogin:function() {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      this.getAllInfo();
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //ETC列表滚动监听
  bindScrollStart:function(e){
    if (this.data.isRefreshCard){
      this.setData({
        scroll:true,
        // isRefreshCard:false,
      })
      setTimeout(()=>{
        this.setData({
          isRefreshCard:false,
        });
      },1000);
    }else {
      this.setData({scroll:false})
    }
    // console.log(e.detail)
    if (e.detail.scrollLeft){
    }
  },

  //ETC列表开始滑动
  touchStart(e) {
    this.setData({scroll:true})
    // console.log('touchStart'+JSON.stringify(e))
    this.startPageX = e.changedTouches[0].pageX;
  },
  touchMove(e){
    // console.log('touchMove'+JSON.stringify(e))
  },
  //ETC列表滑动结束
  touchEnd(e) {
    this.setData({scroll:true})
    // console.log('touchEnd'+JSON.stringify(e))
    const {isEnough,card_list} = this.data;
    let arr= card_list;
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    let maxPage = this.data.card_list.length - 1;
    if (isEnough){
      maxPage = this.data.card_list.length ;
    }else {
      maxPage = this.data.card_list.length-1;
    }
    if (Math.abs(moveX) >= 100){
      if (moveX > 0) {
        //右
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
        this.setData({toView: `card_${this.currentView}`});
        arr.map((item,index)=>{
          if (index === this.currentView){
            item.card_height = card_height_big
            this.setData({card_height: card_height_small})
          }else {
            item.card_height = card_height_small
            this.setData({card_height: card_height_big})
          }
          return item;
        })
      } else {
        //左
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
        this.setData({toView: `card_${this.currentView}`});
        arr.map((item,index)=>{
          if (index === this.currentView){
            item.card_height = card_height_big
            this.setData({card_height: card_height_small})
          }else {
            item.card_height = card_height_small
            this.setData({card_height: card_height_big})
          }
        })
      }
    }
    this.setData({card_list: arr})
    // console.log('this.currentView'+this.currentView);

  },

  //券包购买
  goBuyClick:function (){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({
        url: '/pages/mine/ticket-buy/list/list'
      });
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //添加ETC卡
  onEtcAddClick:function (){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      // wx.navigateTo({
      //   url: '/pages/mine/etc/bind/bind'
      // });
      //notice银联接入(暂不上线)
      this.getOwnedList()
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
  },

  //优惠券
  onCouponsClick:function(e){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({url: '/pages/mine/coupons/list/list'});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealLogin();
  },

  //加油金
  onCargoClick:function(e){
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({url: '/pages/mine/gold/list/list'});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealLogin();
  },

  //支付管理
  onPaysClick:function() {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({url: '/pages/mine/pay/list/list'});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealLogin();
  },

  //我的订单
  onOrdersClick:function() {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({url: '/pages/mine/order/list/list'});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealLogin();
  },

  //发票抬头管理
  onInvoicesClick:function() {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      wx.navigateTo({url: '/pages/mine/invoice/index/index'});
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealLogin();
  },

  // etc卡点击
  onETCItemClick: function (e) {
    const openid = wx.getStorageSync(OPENID);
    this.setData({openid:openid});
    if (openid){
      this.setData({
        show_pop:true,
        click_type:1,
      })
      // console.log('sss==='+JSON.stringify(e))
      const item = e.detail;
      this.setData({
        etc_card_no: item.etc_card_no,
      })
    }else {
      wx.navigateTo({url:`/pages/login/login`});
    }
    // this.dealClickData(item);
  },

  //启用停用
  statusChange: function (e){
    const item = e.detail;
    this.setData({
      show_pop:true,
      etc_card_no: item.etc_card_no,
      click_type:item.bind_status===1?3:2,
    })
  },

  //弹框
  onPopClick: function () {
    const {click_type} = this.data;
    if (click_type === 1){
      this.onUnbindClick();
    }else{
      this.etcChangeStatus();
    }
  },

  //取消弹框
  onCancelClick: function () {
    wx.showTabBar();
    this.setData({show_pop:false})
  },

  //获取个人中心页面所有网络数据
  getAllInfo:function(){
    this.getCardData();
    this.getUserData();
  },

  //解绑ETC
  onUnbindClick: function (e) {
    // let item = e.detail;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要解绑此卡吗？',
      confirmColor: '#cf3046',
      success: function (res) {
        if (res.confirm) {
          that.etcUnbind();
        }
      }
    });
  },

  //解绑请求
  etcUnbind: function () {
    const params = {
      etc_card_no: trim(this.data.etc_card_no),
    };
    wx.showLoading({
      title: '正在解绑...',
      icon: 'none',
      mask: true
    })
    getHttpPost(etcApi.unbind,params,res => {
      if (res.result_code === "00000") {
        wx.hideLoading();
        wx.showToast({
          title: "解绑成功",
          icon: 'none'
        });
        this.setData({show_pop:false,isRefreshCard:true})
        wx.showTabBar();
        this.getCardData();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });

      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({
        title: fail,
        icon: 'none'
      });

    })
  },

  //ETC启停用
  etcChangeStatus: function (item) {
    const params = {
      etc_card_no: trim(this.data.etc_card_no),
      enabled: this.data.click_type===2?true:false,
    };
    wx.showLoading({
      title: this.data.click_type===2?'正在启用...':'正在停用...',
      icon: 'none',
      mask: true
    })
    getHttpPost(etcApi.changeStatus,params,res => {
      if (res.result_code === "00000") {
        wx.hideLoading();
        wx.showToast({
          title: this.data.click_type===2?'启用成功':'已停用',
          icon: 'none'
        });
        this.setData({show_pop:false,isRefreshCard:true})
        wx.showTabBar();
        this.getCardData();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });

      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({
        title: fail.msg,
        icon: 'none'
      });

    })
  },

  //获取用户信息
  getUserData: function () {
    getHttpPost(userApi.userInfo,{},res => {
      this.setData({
        isRefresh: false,
        unused_coupon_count:res.unused_coupon_count,
        account_balance:res.account_balance,
        payment_way_count:res.payment_way_count,
      });
    }, fail => {
      wx.showToast({
        title: fail.msg,
        icon: 'none'
      });
    })
  },

  //获取etc列表
  getCardData: function () {
    getHttpPost(etcApi.query,{},res => {
      this.setData({
        isEtcRefresh: false,
      });
      let list = [];
      const data = res.data;
      if (data && data.length) {
        list = data.filter((item,index) => {
          // item.plate_number = formatSpacePlate(item.plate_number);
          item.etc_card_no_str = formatSpaceId(item.etc_card_no);
          item.car_plate_no = formatPlateNumber(item.car_plate_no);
          item.is_enough = false;
          item.is_click = false;
          if (index === 0){
            item.card_height = card_height_big
            this.setData({card_height: card_height_small})
          }else {
            item.card_height = card_height_small
          }
          return item.bind_status == 1 || item.bind_status == 0;
        });
        let arr = list;
        this.setData({
          isCardEmpty: false,
          card_list: arr,
          status:0,
          toView: `card_${DEFAULT_PAGE}`
        });
        if (list.length<5){
          // arr.push(obj);
          this.setData({isEnough:true})
        }else {
          this.setData({isEnough:false})
        }
      } else {
        this.setData({
          isCardEmpty: true,
          status:1,
        });
      }
    }, fail => {
      wx.showToast({
        title: fail.msg,
        icon: 'none'
      });
    })
  },

  //用户名下ETC查询 网络请求
  getOwnedList:function(){
    // wx.showLoading({title:"正在加载...",mask:true});
    getPostPromise(etcApi.owned,null).then(res=>{
      // wx.hideLoading();
      const data = this.dealResponse(res.data);
      if (data&&data.length){
        let params = encodeURIComponent(JSON.stringify(data));
        wx.navigateTo({url: `/pages/mine/etc/etc-list/etc-list?params=${params}`});
      }else {
        wx.navigateTo({
          url: '/pages/mine/etc/bind/bind'
        });
      }
    }).catch(err=>{
      // wx.hideLoading();
      wx.navigateTo({
        url: '/pages/mine/etc/bind/bind'
      });
    });
  },

  /**
   * 数据ETC静默查询处理
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
      if (!isEmpty(item.car_plate_no)&&!isEmpty(item.car_plate_color)&&!isEmpty(item.etc_card_no)&&!isEmpty(item.bank_account)&&!isEmpty(item.bank_card_type)&& !isEmpty(item.user_name) &&!isEmpty(item.mobile)){
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

})
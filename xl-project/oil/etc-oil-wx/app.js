/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 16:10:21
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-22 09:06:26
 * @Description: app
 */
import {login_wx} from "./utils/login"
import {STATIONPAGE,CODE_WASHER,MARKET_CODE} from "./constants/global";
App({
  onLaunch: function (data) {
    this.dealUpdate();
    const res = wx.getSystemInfoSync();
    // console.log(res);
    this.globalData.statusBarHeight = res.statusBarHeight;
    this.globalData.titleBarHeight = res.platform=="android"?48:44;
    this.globalData.navigationBarHeight =  this.globalData.statusBarHeight + this.globalData.titleBarHeight;
    this.globalData.isIphoneX = res.model.includes("iPhone X");
    this.globalData.screenWidth = res.screenWidth;
		this.globalData.screenHeight = res.screenHeight;
		this.globalData.windowHeight = res.windowHeight;
    this.globalData.windowWidth = res.windowWidth;
    wx.setStorageSync(STATIONPAGE, 0);//服务网点初始为加油列表
  },

  onShow:function(res){
    // console.log('res====',res)
    login_wx();
    //场景值1038：从被打开的小程序返回
    if (res&&res.scene === 1038) {
      const {appId} = res.referrerInfo;
      //appId为wxbcad394b3d99dac9：从微信车主小程序跳转回来
      if (appId === 'wxbcad394b3d99dac9') {
        this.globalData.fromVehicle = true;
      }
    }
    if (res.scene === 1047||res.scene === 1048||res.scene === 1049) {
      //扫小程序码进入小程序停车确认页面
      wx.setStorageSync(CODE_WASHER, true);
    }else {
      wx.setStorageSync(CODE_WASHER, false);
    }
    // todo 代理--普通二维码进入
    if (res.scene === 1011||res.scene === 1012||res.scene === 1013) {
      //扫普通二维码码进入小程序授权推广码
        const query = decodeURIComponent(res.query.q);
        const index = query.indexOf("=");
        if(index!=-1){
          const marketCode = query.slice(index+1,query.length);
          wx.setStorageSync(MARKET_CODE, marketCode);
        }
    }else {
      wx.setStorageSync(MARKET_CODE, '');
    }
  },

  globalData: {
    userInfo: null,
    location:null,//当前所在位置的经纬度信息
    statusBarHeight:0,//状态栏高度
    titleBarHeight:0,//标题栏高度
    navigationBarHeight:0,//导航栏高度
    isIphoneX:false,
    screenWidth:375,
		screenHeight:667,
		windowHeight:603,
    windowWidth:375,
    fromVehicle:false//true:从微信车主小程序跳转回来
  },

  //版本更新提示
  dealUpdate:function(){
		if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log("更新:"+res.hasUpdate);
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '温馨提示',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
	},
  
})
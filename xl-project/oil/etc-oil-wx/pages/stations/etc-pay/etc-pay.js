// pages/stations/etc-pay/etc-pay.js
let image01 = '/assets/static/etc-pay11.png';
let image02 = '/assets/static/etc-pay12.png';
let image11 = '/assets/static/etc-pay21.png';
let image12 = '/assets/static/etc-pay22.png';
let image21 = '/assets/static/etc-pay31.png';
let image22 = '/assets/static/etc-pay32.png';
const app = getApp();
let params = null;
const animation = wx.createAnimation({
  duration:200,
  timingFunction:"linear",
  delay:0,
});
let timer1 = null;//定时器
let time_all = 15;//动画总用时时间
let time_every = 5;//动画间隔时间
let index = 0;//当前位置
let video = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_support_no_sense:false,//是否支持无感支付
    animation_move:null,
    index:index,
    controls:false,
    pause:true,
    count:time_every,
    show_background:true,
    first_image:image02,
    second_image:image11,
    third_image:image21,
    url:"http://oss.etcsd.com/gas/videos/etc_wgjy.mp4",
    isIphoneX:app.globalData.isIphoneX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    video = wx.createVideoContext("video");
    try {
      params = JSON.parse(decodeURIComponent(options.params));
      let support_payments = params.support_payments;
      this.setData({is_support_no_sense:support_payments&&support_payments.includes("ETC_NO_SENSE")});
    } catch (error) {
      // wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  onShow:function(){
    this.dealWidth();
  },

  onHide:function(){
    clearInterval(timer1);
    timer1 = null;
  },

  onUnload:function(){
    clearInterval(timer1);
    timer1 = null;
    time_all = 15;
    time_every = 5;
    index = 0;
  },

  onPlay:function(){
    this.setData({controls:true,pause:false});
  },

  onPause:function(){
    this.setData({controls:false,pause:true});
  },

  onEnd:function(){
    this.setData({controls:false,pause:true,show_background:true});
  },

  //播放按钮
  onPlayClick:function(){
    video&&video.play();
    this.setData({controls:true,pause:false,show_background:false});
  },

  //暂停播放
  onPauseClick:function(){
    this.setData({controls:false,pause:true});
  },

  //导航前往
  onNavigationClick:function () {
    const {is_support_no_sense} = this.data;
    if(is_support_no_sense){//支持无感支付
      wx.openLocation({
        latitude:params.latitude_tx,
        longitude:params.longitude_tx,
        name:params.name,
        address:params.address
      });
    }
  },

  dealWidth:function(){
    this.createSelectorQuery().select('#flow').boundingClientRect((rect)=>{
      if(rect){
        this.dealAnimation(rect.width/3);
      }
    }).exec();
  },

  //处理动画
  dealAnimation:function(x){
    timer1 = setInterval(() => {
      time_all--;
      const _count = time_all%time_every;
      this.setData({count:_count==0?time_every:_count});
      if(time_all>=time_every){
        if(_count==0){
          index++;
          this.setData({
            index:index,
            animation_move:animation.translateX(x*index).step().export()
          });
        }
      }else{
        clearInterval(timer1);
        timer1 = null;
      }
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
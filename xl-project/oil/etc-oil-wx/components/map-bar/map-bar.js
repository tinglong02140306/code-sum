// components/map-bar/map-bar.js
const app = getApp();
let titleBarHeight = app.globalData.titleBarHeight;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:["加油","洗车"]
    },
    selected_index:{
      type:Number,
      value:0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:titleBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //返回按钮
    onBackClick:function(){
      // this.triggerEvent('back',e.detail);
      wx.navigateBack();
    },
    onMenuClick:function(e){
      this.triggerEvent('menu',e.detail);
    }
  }
})

// components/station-bar/station-bar.js
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
    onMenuClick:function(e){
      this.triggerEvent('menu',e.detail);
    }
  }
})

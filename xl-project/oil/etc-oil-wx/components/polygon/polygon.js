// pages/activity/component/polygon/polygon.js
const app = getApp();
const width = app.globalData.windowWidth;
const paddingLeft = 4;
const offest = 20;
const height = 50;
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:Number,
      value:0,
      observer:function(newVal){
        this.setData({
          type:newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type:0
  },

  lifetimes:{
    attached:function(){
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabClick:function(e){
      this.setData({type:e.currentTarget.dataset.type})
    }
  }
})

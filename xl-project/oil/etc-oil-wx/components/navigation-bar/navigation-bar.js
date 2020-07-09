// components/navigation-bar/navigation-bar.js
const app = getApp();
const statusBarHeight = app.globalData.statusBarHeight;//状态栏高度
const titleBarHeight = app.globalData.titleBarHeight;//标题栏高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    background_style:{//背景样式
      type:String,
      value:""
    },
    text_style:{//文字样式
      type:String,
      value:"#000000"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleBarStyle:""
  },

  lifetimes:{
    //在组件实例进入页面节点树时执行
    attached: function() {
      this.setData({
        titleBarStyle:`height:${titleBarHeight}px;margin-top:${statusBarHeight}px;color:${this.data.text_style}`
      })
    },
  }
})

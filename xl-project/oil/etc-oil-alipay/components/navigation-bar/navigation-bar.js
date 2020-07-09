// components/navigation-bar/navigation-bar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  props: {
    //背景样式
    background_style:"",
    //文字样式
    text_style:"#000000"
  },

  /**
   * 组件的初始数据
   */
    data: {
        titleBarStyle:""
    },
    didMount() {
        // 状态栏高度 标题栏高度
        const {statusBarHeight, titleBarHeight} = app.globalData;  //状态栏高度
        this.setData({
            titleBarStyle:`height:${titleBarHeight}px;margin-top:${statusBarHeight}px;color:${this.props.text_style}`
        });
    },
})

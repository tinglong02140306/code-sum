// components/status/status.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:Number,
      value:1,//1:列表为空 2:网络连接失败
    },
    url:{
      type:String,
      value:"/assets/static/empty.png"
    },
    text:{
      type:String,
      value:"数据为空哦～"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //重新加载
    onRetryClick:function(){
      this.triggerEvent('retry');
    }
  }
})

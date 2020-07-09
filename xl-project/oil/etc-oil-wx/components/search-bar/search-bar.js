// components/search-bar/search-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    //返回
    onBackClick:function(){
      wx.navigateBack();
    },

    //键盘输入时触发
    onInput:function(e){

    },

    //点击完成按钮时触发
    onConfirm:function(e){
      const {value} = e.detail;
      this.triggerEvent('search',value);
    }
  }
})

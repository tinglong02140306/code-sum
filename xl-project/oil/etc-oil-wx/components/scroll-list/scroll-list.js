/*
 * @Author: sunmingmao
 * @Date: 2020-03-26 14:44:21
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-14 14:47:17
 * @Description: 
 */
// components/scroll-list/scroll-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width:{
      type:String,
      value:"100vw"
    },
    height:{
      type:String,
      value:"100vh"
    },
    refresher_threshold:{//设置自定义下拉刷新阈值
      type:Number,
      value:45
    },
    refresher_default_style:{//设置自定义下拉刷新默认样式
      type:String,
      value:'black'//black | white | none
    },
    refresher_background:{//设置自定义下拉刷新区域背景颜色
      type:String,
      value:'#f8f8f8'
    },
    refresher_triggered:{//当前下拉刷新状态
      type:Boolean,
      value:false
    },
    load_status:{
      type:Number,
      value:0,//0: 已加载完成 1:正在加载中 2:已加载全部
    },
    show_finish:{//是否显示已加载全部
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  lifetimes:{
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下拉刷新被触发
    onRefresh:function(){
      this.triggerEvent('refresh');
    },
    //上拉加载被触发
    onLoadMore:function(){
      if(this.data.load_status!=2){
        this.triggerEvent('loadmore');
      }
    }
  }
})

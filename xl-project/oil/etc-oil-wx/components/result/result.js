/*
 * @Author: sunmingmao
 * @Date: 2020-04-14 11:10:48
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-14 11:20:46
 * @Description: 结果页面
 */
import {QrcodePaySuccess, QrcodePayFail} from '../../assets/url/url';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type:Number,
      value:0//1:成功 2:失败
    },
    success1:{
      type:String,
      value:""
    },
    success2:{
      type:String,
      value:""
    },
    fail:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon_success:QrcodePaySuccess,
    icon_fail:QrcodePayFail
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSuccess1Click:function(){
      this.triggerEvent('success1');
    },

    onSuccess2Click:function(){
      this.triggerEvent('success2');
    },

    onFailClick:function(){
      this.triggerEvent('fail');
    }
  }
})

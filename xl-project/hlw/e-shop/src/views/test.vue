<template>
  
</template>
<script>
import wx from 'weixin-jsapi'
// import * as API from "@/api/affirm";
export default {
  data () {
    return {
      
    }
  },
  mounted () {
    // 这里如果后端要url 是#前面的部分不包括#号
    API.getconfig().then((data) => {
      console.log(wx)
       wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature,// 必填，签名，见附录1
         jsApiList: ['chooseWXPay']
        })
      
  })
},
  methods: {
    click(){   //点击触发
     API.getpay(这里是后端要你传的参数).then((data) => {
        var args = data
        wx.ready(function(){
           wx.chooseWXPay({
             timestamp: args.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
             nonceStr: args.nonceStr, // 支付签名随机串，不长于 32 位
             package: args.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
             signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
             paySign: args.paySign, // 支付签名
             success: function (res) {
                //  这里写成功后的动作 我试过跳转路由好像不灵 或者是执行太快后端处理订单未变化呢 我改成了这个   window.location.href="你所要跳转的页面";
             },
             cancel: function (res) {
                 alert('已取消支付');
             },
             fail: function (res) {
                 alert('购买失败，请重新创建订单')
             }
           });
        });
     }) 
  }
}
}
</script>
<style>

</style>

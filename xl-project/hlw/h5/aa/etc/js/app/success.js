$(function() {
    // 清空本地存储
    util.setLocalInfos(null);
    $('.success-wrap').off('.btn-close').on('click', '.btn-close', function() {
        var ua = navigator.userAgent.toLowerCase();
        if (util.isWeiXin()) {
            WeixinJSBridge.call('closeWindow');
        } else if (util.isAlipay()) {
            AlipayJSBridge.call('closeWebview');
        } else if (ua.indexOf("baidu") != -1) {
            BLightApp.closeWindow();
        } else {
            window.close();
        }
    });

})
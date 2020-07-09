
'use strict';
var Toast = function (config) {
    this.context = config.context == null ? $('body') : config.context; // 上下文
    this.message = config.message; // 显示内容
    this.time = config.time == null ? 3000 : config.time; // 持续时间
    this.left = config.left; // 距容器左边的距离
    this.top = config.top; // 距容器上方的距离
    this.init()
},
    msgEntity;
Toast.prototype = {
    // 初始化显示的位置内容等
    init: function () {
        $("#toastMessage").remove();

        // 设置消息体
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage" class="toast">');
        msgDIV.push('<span>' + this.message + '</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);

        var left = this.left == null ? this.context.width() / 2 - msgEntity.width() / 2 : this.left,
            top = this.top == null ? $(window).height() / 2 - msgEntity.find('span').height() / 2 : this.top;
        msgEntity.css({
            top: top,
            left: left
        });
    },
    //显示动画
    show: function () {
        msgEntity.fadeIn();
    },
    // 隐藏动画
    hide: function () {
        msgEntity.fadeOut(1000);
    }
};
var util = {
    // 判断当前设备是android 还是ios
    phoneOs: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var str = '';
        if (isAndroid) str = "Android"
        if (isIOS) str = "IOS"
    },
    // 判断当前终端设别是否为PC端
    IsPC: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    // 判断是否在支付宝浏览器
    isAlipay: function () {
        var browser = navigator.userAgent.toLowerCase();
        if (browser.match(/Alipay/i) == "alipay") {
            return true;
        } else {
            return false;
        }
    },
    // toast弹出框
    toastHtml: function (msg, opt, left, top) {
        new Toast({
            context: $('body'),
            message: msg
        }, opt, left, top).show();
    },
    // ajax 请求
    ajaxRequest: function (url, data, token, successFun, errorFun, completeFun) {
        console.log(data)
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data || {}),
            contentType: 'application/json;charset=utf-8',
            beforeSend: function (request) {
                if (token) request.setRequestHeader("auth-token", token);
            },
            success: function (res) {
                successFun && successFun(res);
            },
            error: function (res) {
                errorFun && errorFun(res);
            },
            complete: function (XMLHttpRequest, status) {
                completeFun && completeFun(XMLHttpRequest, status)
            }
        });
    }
}
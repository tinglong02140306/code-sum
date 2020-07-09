'use strict';
var Toast = function(config) {
        this.context = config.context == null ? $('body') : config.context; // 上下文
        this.message = config.message; // 显示内容
        // this.left = config.left; // 距容器左边的距离
        // this.top = config.top; // 距容器上方的距离
    },
    msgEntity;
Toast.prototype = {
    // 初始化显示的位置内容等
    init: function() {
        $(".mask").remove();
        // 设置消息体
        var $msgDIV = `<div class="mask">
                        <div id="toastMessage" class="toast">
                            <span>${this.message}</span>
                        </div>
                    </div>`
        $($msgDIV).appendTo(this.context);
        var msgEntity = $('#toastMessage')
        var left = this.left == null ? this.context.width() / 2 - msgEntity.outerWidth() / 2 : this.left,
            top = this.top == null ? $(window).height() / 2 - msgEntity.find('span').outerHeight() / 2 : this.top;
        msgEntity.css({
            top: top,
            left: left
        });
    },
    showToast: function() {
        this.init();
        setTimeout(function() {
            $(".mask").remove();
        }, 2500);
    },
    //显示遮罩
    showMask: function() {
        this.init()
    },
    // 隐藏遮罩
    hideMask: function() {
        $(".mask").remove();
    }
};
var util = {
    // 判断当前设备是android 还是ios
    phoneOs: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var str = '';
        if (isAndroid) str = "Android"
        if (isIOS) str = "IOS"
    },
    // 判断当前终端设别是否为PC端
    IsPC: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"
        ];
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
    isAlipay: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Alipay/i) == "alipay") {
            return true;
        } else {
            return false;
        }
    },
    // 判断是否是微信
    isWeiXin: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    showToast: function(msg) {
        new Toast({
            context: $('body'),
            message: msg
        }).showToast();
    },

    // toast弹出框
    showMask: function(msg) {
        util.OpenMask();
        new Toast({
            context: $('body'),
            message: msg
        }).showMask();
    },
    // 隐藏弹框
    hideMask: function() {
        util.CloseMask();
        new Toast({}).hideMask();
    },
    // ajax 请求
    ajaxRequest: function(url, data, token, successFun, errorFun, completeFun) {
        console.log(data)
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data || {}),
            contentType: 'application/json;charset=utf-8',
            beforeSend: function(request) {
                if (token) request.setRequestHeader("auth-token", token);
            },
            success: function(res) {
                successFun && successFun(res);
            },
            error: function(res) {
                errorFun && errorFun(res);
            },
            complete: function(XMLHttpRequest, status) {
                completeFun && completeFun(XMLHttpRequest, status)
            }
        });
    },
    // form 形式
    ajaxFormRequest: function(url, data, successFun, errorFun, completeFun) {
        console.log(data)
        $.ajax({
            type: 'POST',
            url: url,
            data: data || {},
            success: function(res) {
                successFun && successFun(res);
            },
            error: function(res) {
                errorFun && errorFun(res);
            },
            complete: function(XMLHttpRequest, status) {
                completeFun && completeFun(XMLHttpRequest, status)
            }
        });
    },
    OpenMask: function() {
        document.body.addEventListener('touchmove', util.handler, false);
        document.body.addEventListener('wheel', util.handler, false);
    },
    CloseMask: function() {
        document.body.removeEventListener('touchmove', util.handler, false);
        document.body.removeEventListener('wheel', util.handler, false);
    },
    handler: function() {
        event.preventDefault();
        event.stopPropagation();
    },
    // 获取本地token
    getLocalToken: function() {
        return localStorage.getItem('TOKEN');
    },
    // 设置本地token
    setLocalToken: function(token) {
        localStorage.setItem('TOKEN', token)
    },
    // 获取url 参数值
    getQueryString: function(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        };
        return null;
    },
    pushHistory: function() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    },
    // 关闭h5页面
    closePage: function() {
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
    },
    dealClosePage: function() {
        this.pushHistory();
        this.closePage()
    }
}
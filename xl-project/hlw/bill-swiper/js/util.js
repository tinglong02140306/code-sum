'use strict';
var Toast = function(config) {
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
    init: function() {
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
    show: function() {
        msgEntity.fadeIn();
        setTimeout(function() {
            msgEntity.fadeOut(1000);
        }, 1000);
    }
};
var util = {
    // 判断当前设备是android 还是ios
    phoneOs : function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var str = '';
        if (isAndroid) str = "Android"
        if (isIOS) str = "IOS"
    },
    // 判断当前终端设别是否为PC端
    IsPC : function () {
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
    // ajax 请求
    ajaxRequest: function(url, data, token, successFun, errorFun,completeFun) {
        console.log(data)

        // $.ajax({
        //     type: 'POST',
        //     url: baseUrl + url,
        //     //		                url: '../res/pdlist1.json?pdType='+pdType+'&num='+pageNum+'&size='+pageSize,
        //     dataType: 'json',
        //     beforeSend: function (request) {
        //         request.setRequestHeader("auth-token", '2222222');
        //         // if(token) 
        //         request.setRequestHeader('Access-Control-Allow-Origin', '*');
        //         // request.setRequestHeader("Access-Control-Allow-Origin", "*");
        //     },
        //     success: function (data) {
                
        //     },
        //     error: errorFun
        // });
        $.ajax({
            type: 'POST',
            // timeout: 30000, //超时时间设置，单位毫秒
            url: url,
            data: data || {},
            contentType: 'application/json;charset=utf-8',
            // dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader("auth-token", '2222222');
                // if(token) 
                // request.setRequestHeader('Access-Control-Allow-Origin', '*');
                // request.setRequestHeader("Access-Control-Allow-Origin", "*");
            },
            success: function(res) {
                successFun && successFun(res);
            },
            error: function(res) {
                errorFun && errorFun(res);
            },
            complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
                completeFun && completeFun(XMLHttpRequest, status)
                // console.log(status);
                // if (status === 'timeout') { //超时,status还有success,error等值的情况
                //     common.toast("请求超时");　　　　
                // }　　
            }
        });
    },
    // toast弹出框
    toastHtml : function(msg, opt, left, top) {
        debugger
        new Toast({
            context: $('body'),
            message: msg
        }, opt, left, top).show(); 
    },
    /**
         * 输入框验证  校验是否是必填
         * @param: arr 需要验证的数组
         * @param: obj 表单数据对象
         */
    paramsCheck : function() {
        var result = true;
        for (var i in arr) {
            var value = $.trim(obj[arr[i].key]);
            if (arr[i].required && !value) {
                common.toast(arr[i].title + '不能为空！');
                result = false;
            } else if (arr[i].max && value.length > arr[i].max) {
                common.toast(arr[i].title + '最多不超过' + arr[i].max + '个字符');
                result = false;
            } else if (arr[i].pattern && !(new RegExp(rule[i].pattern).test(value))) {
                common.toast('请输入正确的' + arr[i].title);
                result = false;
            }
        }
        return true;

    }
}
'use strict';
var Toast = function(config) {
        this.context = config.context == null ? $('body') : config.context; // 上下文
        this.message = config.message; // 显示内容
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
        }, 1000);
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
    ajaxRequest: function(url, data, successFun, errorFun, completeFun) {
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
    // json 格式
    ajaxJsonRequest: function(url, data, successFun, errorFun, completeFun) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data || {}),
            contentType: 'application/json;charset=utf-8',
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

    // 获取本地数据存储
    getLocalInfos: function() {
        return JSON.parse(localStorage.getItem('localInfos'))
    },
    // 设置本地数据
    setLocalInfos: function(obj) {
        localStorage.setItem('localInfos', JSON.stringify(obj));
    },
    /**
     * 输入框验证  校验是否是必填
     * @param: arr 需要验证的数组
     * @param: obj 表单数据对象
     */
    inputCheck: function(arr, obj) {
        var result = true;
        for (var i in arr) {
            var value = $.trim(obj[arr[i].key]);
            if (arr[i].required && !value) {
                this.showToast(arr[i].title + '不能为空！');
                result = false;
                return result;
            } else if (value && arr[i].pattern && !(new RegExp(rule[i].pattern).test(value))) {
                this.showToast('请输入正确的' + arr[i].title);
                result = false;
                return result;
            }
        }
        return result;
        // return true;
    },

    isLicensePlate: function(str) {
        return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
    }
}
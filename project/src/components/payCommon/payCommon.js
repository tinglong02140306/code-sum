'use strict';
require("../device/device.js?__inline");
// var fly = require('fly');
var payCommon = module.exports = fly.Component.extend({

    name: 'payCommon',
});
var Toast = function(config) {
    this.context = config.context == null ? $('body') : config.context; // 上下文
    this.message = config.message; // 显示内容
    this.time = config.time == null ? 3000 : config.time; // 持续时间
    this.left = config.left; // 距容器左边的距离
    this.top = config.top; // 距容器上方的距离
    this.init();
}
var msgEntity,
    vcity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

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

payCommon.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

/**
 * 将14位数字字符串转日期格式
 * @param str 14位字符串
 * @return 日期
 */
payCommon.dateFormat = function(str) {
    if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "/" + str.substring(
                4, 6) + "/" + str.substring(6, 8) + " " +
            str.substring(8, 10) + ":" + str.substring(
                10, 12) + ":" + str.substring(12, 14);
        return new Date(st);
    }
};
payCommon.isMobile = function() {
    //平台、设备和操作系统 
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad: false
    };
    //检测平台 
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
    //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面 
    if (system.win || system.mac || system.xll || system.ipad) {
        return false;
    } else {
        return true;
    }
};
// xxxx-xx-xx xx:xx
payCommon.getNowDate = function(str, type) {
    if (str && str.length) {
        var year = str.substring(0, 4),
            month = str.substring(4, 6),
            day = str.substring(6, 8),
            hour = str.substring(8, 10),
            min = str.substring(10, 12),
            result;
        if (type === 'day') {
            result = year + '-' + month + '-' + day;
            return result;
        }
        result = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
        return result;
    }
    return '';
};
/**
 * 将日期格式转成12位数字字符串
 * @param str 日期
 * @return 字符串
 */
payCommon.timeForData = function(time) {
    var year = time.getFullYear().toString();
    var month = (time.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + (time.getMonth() + 1).toString();
    }
    var day = time.getDate().toString();
    if (day.length == 1) {
        day = "0" + time.getDate().toString();
    }
    return year + "-" + month + "-" + day;
};

payCommon.transTime = function(time) {
    var year = time.substring(0, 4),
        month = time.substring(4, 6),
        day = time.substring(6, 8);
    return year + "-" + month + "-" + day;
};
/**
 * 将日期格式转成4位数字字符串
 * @param str 日期
 * @return 字符串
 */
payCommon.timeForHour = function(time) {
    var hour = time.getHours().toString();
    var min = time.getMinutes().toString();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    if (min.length == 1) {
        min = "0" + min;
    }
    return hour + ":" + min;
};

// 计算时间小时和分钟差
payCommon.getTimeRange = function(time2) {
    time2 = time2.substring(0, 12);
    var date1 = new Date(),
        time1 = payCommon.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = payCommon.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime();
    if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            var result = hours + '小时前';
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                var result = minutes + '分钟前';
            } else {
                var result = '刚刚';
            }
            return result;
        }
    } else {
        var result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8);
        return result;
    }
};
//计算列表图片大小
payCommon.getListImgSize = function(basW, ratio) {
    var screenW = window.screen.width,
        dpr = window.devicePixelRatio,
        imgSizeW,
        imgSizeH;
    if (screenW <= 320) {
        imgSizeW = parseInt(basW * 0.89);
        imgSizeH = parseInt(basW * 0.89 * ratio);
    } else if (screenW >= 320 && screenW <= 393) {
        imgSizeW = parseInt(basW * dpr);
        imgSizeH = parseInt(basW * ratio * dpr);
    } else if (screenW >= 393) {
        imgSizeW = parseInt(basW * 1.092 * ratio * dpr);
        imgSizeH = parseInt(basW * 1.092 * ratio * dpr);
    }
    var screenImgSize = '.' + imgSizeW + "_w," + imgSizeH + "_h"; //活动图片比例
    return screenImgSize;
};
// 计算离结束还有多长时间
payCommon.leftTime = function(time2) {
    var date1 = new Date(), //开始时间
        date2 = payCommon.dateFormat(time2), //结束时间
        date3 = date2.getTime() - date1.getTime(), //时间差的毫秒数

        //计算出相差天数
        days = Math.floor(date3 / (24 * 3600 * 1000)),
        //计算出小时数

        leave1 = date3 % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
        hours = Math.floor(leave1 / (3600 * 1000)),
        //计算相差分钟数
        leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
        minutes = Math.floor(leave2 / (60 * 1000)),

        //计算相差秒数
        leave3 = leave2 % (60 * 1000), //计算分钟数后剩余的毫秒数
        seconds = Math.round(leave3 / 1000),

        result = (days + "天 " + hours + "小时 " + minutes + " 分钟");
    return result;
};
// 计算时间小时和分钟差,方式2，当天1h以后显示xx:xx
payCommon.getTimeRangeInHour = function(time2) {
    time2 = time2.substring(0, 12);
    var date1 = new Date(),
        time1 = payCommon.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = payCommon.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime();
    if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            var result = time2.substring(8, 10) + ":" + time2.substring(10, 12);
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                var result = minutes + '分钟前';
            } else {
                var result = '刚刚';
            }
            return result;
        }
    } else {
        var result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8) + " " + time2.substring(8, 10) + ":" + time2.substring(10, 12);
        return result;
    }
};

payCommon.caclNowTime = function(time2, now) {
    now = payCommon.dateFormat(now);
    var time1 = payCommon.timeForData(now).replace("-", "").replace("-", ""),
        date2 = payCommon.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = now.getTime() - date2.getTime();
    if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            var result = time2.substring(8, 10) + ":" + time2.substring(10, 12);
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                var result = minutes + '分钟前';
            } else {
                var result = '刚刚';
            }
            return result;
        }
    } else {
        var result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8) + " " + time2.substring(8, 10) + ":" + time2.substring(10, 12);
        return result;
    }
};

//当天显示xx:xx，否则显示xxxx-xx-xx
payCommon.getTimeDate = function(time3) {
    time3 = time3.substring(0, 12);
    var date1 = new Date(),
        time1 = payCommon.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = payCommon.dateFormat(time3),
        time4 = time3.substring(0, 8),
        date4 = date1.getTime() - date2.getTime();
    if (time4 == time1) {
        var result = time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    } else {
        var result = time3.substring(
            0, 4) + "-" + time3.substring(
            4, 6) + "-" + time3.substring(6, 8);
        return result;
    }
};
//当天显示xx:xx，否则显示xxxx-xx-xx
payCommon.getTimeDateAndSecond = function(time3) {
    time3 = time3.substring(0, 12);
    var date1 = new Date(),
        time1 = payCommon.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = payCommon.dateFormat(time3),
        time4 = time3.substring(0, 8),
        date4 = date1.getTime() - date2.getTime();
    if (time4 == time1) {
        var result = time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    } else {
        var result = time3.substring(
            0, 4) + "-" + time3.substring(
            4, 6) + "-" + time3.substring(6, 8) + " " + time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    }
};
// 计算日期相差的天数
payCommon.calcdate = function(time) {
    var sDate, //存储日期的数组
        oDate1, //数据库中的时间转化
        oDate2, //系统的时间转化
        days, //相差的天数
        result; //结果
    var timeStart = time.substring(
        0, 4) + "-" + time.substring(
        4, 6) + "-" + time.substring(6, 8);

    var timeNow = new Date(); //现在的时间
    timeNow = payCommon.timeForData(timeNow); //将日期转为字符串

    sDate = timeStart.split("-");
    oDate1 = new Date(sDate[1] + '-' + sDate[2] + '-' + sDate[0]);
    nDate = timeNow.split("-");
    oDate2 = new Date(nDate[1] + '-' + nDate[2] + '-' + nDate[0]);

    days = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24);

    switch (days) {
        case 0:
            result = "今天" + time.substring(8, 10) + ":" + time.substring(
                10, 12);
            break;
        case 1:
            result = "昨天" + time.substring(8, 10) + ":" + time.substring(
                10, 12);
            break;
        case 2:
            result = "前天" + time.substring(8, 10) + ":" + time.substring(
                10, 12);
            break;
        default:
            result = sDate[0] + '年' + sDate[1] + '月' + sDate[2] + '日&nbsp' + time.substring(8, 10) + ":" + time.substring(
                10, 12);
            break;
    };
    return result;
};

// 16位字符串处理，将格式转化为本月，2月，2014年12月，今天，2-12，12-12
payCommon.changeMon = function(time) {
    var nowTime = new Date(), //系统的日期
        nowYear = nowTime.getFullYear().toString(), //系统时间的年份
        nowMon = (nowTime.getMonth() + 1).toString(), //系统时间的月份
        nowDay = nowTime.getDate().toString(), //系统时间的日
        time = new Date(time.replace(/-/g, "/")), //所传的日期
        year = time.getFullYear().toString(), //所传的年份
        mon = (time.getMonth() + 1).toString(), //所传的月份
        day = time.getDate().toString(), //所传的日
        hourMin = payCommon.timeForHour(time), //所传的小时和分钟
        result = [];
    if (year == nowYear) {
        if (mon == nowMon) {
            result.push('本月');
            if (day == nowDay) {
                result.push('今天');
            } else {
                result.push(mon + '-' + day);
            }
        } else {
            result.push(mon + '月');
            result.push(mon + '-' + day);
        }
    } else {
        result.push(year + '年' + mon + '月');
        result.push(mon + '-' + day);
    }
    result.push(hourMin);
    return result;
};

// tab切换
payCommon.tab = function(tabNum) {
    $('.head-item').on('click', function() {
        var iCurr = $(this).index();
        $(this).addClass("tab-current").siblings().removeClass("tab-current");
        $('.tab-cont').eq(iCurr).removeClass('hide').siblings('.tab-cont').addClass('hide');
        if (tabNum) {
            tabNum();
        }
    });

};

// ajax请求
payCommon._ajax = function(url, seccessFun, errorFun) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback",
        success: seccessFun,
        error: errorFun
    });
};
//post请求方式
payCommon._post = function(url, data, seccessFun, errorFun, maskFlag) {
    $.ajax({
        type: "post",
        timeout: 30000, //超时时间设置，单位毫秒
        url: url,
        data: data || {},
        beforeSend: function() {
            if (maskFlag === 'noMask') {
                return;
            }
            var mask = document.getElementById('mask');
            if (!mask) {
                $('body').append('<div id="mask" class="mask"><div class="please-hold"><div class="loading"></div><p>加载中...</p></div></div>');
            }
            $('body').on('touchmove', function(e) {
                e.preventDefault();
            });
            $("#mask").show(); // fadeTo第一个参数为速度，第二个为透明度
        },
        success: function(res) {
            seccessFun && seccessFun(res);
        },
        error: function(res) {
            errorFun && errorFun(res);
        },
        complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
            console.log(status);
            $("body").on(' touchend', function() {
                $("body").unbind('touchmove');
            });
            $("#mask").hide();　　　　
            if (status === 'timeout') { //超时,status还有success,error等值的情况
                　　　　　
                payCommon.toast("请求超时");　　　　
            }　　
        }
    });
};
// toast弹出框
payCommon.toast = function(msg, opt, left, top) {

    new Toast({
        context: $('body'),
        message: msg
    }, opt, left, top).show();
};

// 对vm中的data进行赋值，适用于表单赋值
payCommon.setFormData = function(vmData, data) {
    var obj = vmData.toJSON();
    for (var proto in obj) {
        if ((typeof obj[proto] === 'object') && (Object.prototype.toString.call(obj[proto]) != '[object Array]')) {
            this.setFormData(vmData[proto], data[proto]);
        }
        vmData.set(proto, data[proto]);
    }
};

/**
 * 对提交到Android端数据进行封装
 * @param params json格式的map数据
 * @param requestCode 后台接口编码
 * @param type 接口类型(0-请求接口, 1-跳转接口)
 * @param isAuth 是否需要用户登录校验
 * @param jumpUrl 跳转URL
 * @param requestVer 后台接口版本
 * @param isDiag 是否需要遮罩层
 * @param requestMsg 请求hander返回code
 */
payCommon.packData = function(params, requestCode, type, isAuth, jumpUrl, isDiag, requestVer, requestMsg) {
    var request = {};
    request.params = params || {};
    request.requestCode = requestCode || '';
    request.type = type || 0;
    request.isAuth = isAuth || false;
    request.jumpUrl = jumpUrl || '';
    request.isDiag = isDiag || 'false';
    request.requestVer = requestVer || '';
    request.requestMsg = requestMsg || '';
    return request;
};

/**
 * 获取URL中的参数值
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
payCommon.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        var os = payCommon.phoneOs();
        if (os === 'IOS') {
            r[2] = decodeURI(r[2], 'utf-8'); //ios多编译一遍
        }
        return decodeURI(r[2], 'utf-8');
    }
    return '';
};
//处理没有字段名的空数据处理
payCommon.dealEmptyData = function(className) {
    var input = document.getElementsByClassName(className);
    for (var i = 0; i < input.length; i++) {
        var innerText = input[i].innerText;
        if (!innerText.length) {
            input[i].innerText = '-';
        }
    };
};
/**
 * 判断平台
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
payCommon.checkMobilePlatform = function(options) {
    var agent = navigator.userAgent;
    if (agent.indexOf('iflytek_mmp') != -1) {
        return true;
    } else {
        return false;
    }
};
//判断toke是否失效
payCommon.checkToken = function(res) {
    var res = JSON.parse(res);
    if (res.errCode == 20008) {
        croods.customPlugin({
            action: 'UserPlugin.checkToken',
            params: {},
            success: function(res) {}
        });
        payCommon.showTotast('1', '1', res.errMsg + ",请重新登录！");
        payCommon.showTotast('0', '0');
        return false;
    } else {
        return true;
    }
};
//如果是IOS body加20px
payCommon.body20px = function() {
    var ua = payCommon.phoneOs();
    if (ua == 'IOS') {
        $('body').css('margin-top', '20px');
    } else {
        console.log('android');
    }
};
// 判断手机客户端类型
payCommon.phoneOs = function() {
    var os = '';
    if ($.device.isWeixin) {
        os = 'weixin';
    } else if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }
    return os;
};
//验证手机号码
payCommon.checkTel = function(tel) {
    var phoneValidate = /^1[3|4|5|7|8][0-9]{9}$/; // 手机号码的验证phoneValidate
    tel = parseInt(tel);
    if (phoneValidate.test(tel)) {
        return true;
    }
    return false;
};
// 验证15/18身份证
payCommon.checkCard = function(card) {
    card = card.toUpperCase();
    // 是否为空  
    if (card === '') {
        return false;
    }
    // 校验长度，类型  
    if (!payCommon.isCardNo(card)) {
        return false;
    }
    // 检查省份  
    if (!payCommon.checkProvince(card)) {
        return false;
    }
    // 校验生日  
    if (!payCommon.checkBirthday(card)) {
        return false;
    }
    // 检验位的检测  
    if (!payCommon.checkParity(card)) {
        return false;
    }
    return true;
};
// 检查号码是否符合规范，包括长度，类型  
payCommon.isCardNo = function(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
        return false;
    }
    return true;
};
// 取身份证前两位,校验省份  
payCommon.checkProvince = function(card) {
    var province = card.substr(0, 2);
    if (vcity[province] == undefined) {
        return false;
    }
    return true;
};

// 检查生日是否正确  
payCommon.checkBirthday = function(card) {
    var len = card.length;
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
    if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19' + year + '/' + month + '/' + day);
        return payCommon.verifyBirthday('19' + year, month, day, birthday);
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
    if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        return payCommon.verifyBirthday(year, month, day, birthday);
    }
    return false;
};

// 校验日期  
payCommon.verifyBirthday = function(year, month, day, birthday) {
    var now = new Date();
    var now_year = now.getFullYear();
    // 年月日是否合理  
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
        // 判断年份的范围（3岁到100岁之间)  
        var time = now_year - year;
        if (time >= 3 && time <= 100) {
            return true;
        }
        return false;
    }
    return false;
};

// 校验位的检测  
payCommon.checkParity = function(card) {
    // 15位转18位  
    card = payCommon.changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0,
            i, valnum;
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == card.substr(17, 1)) {
            return true;
        }
        return false;
    }
    return false;
};

// 15位转18位身份证号  
payCommon.changeFivteenToEighteen = function(card) {
    if (card.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0,
            i;
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        card += arrCh[cardTemp % 11];
        return card;
    }
    return card;
};

// 序列化表单数据转换成对象
payCommon.paramString2obj = function(serializedParams) {
    var obj = {};

    function evalThem(str) {
        var strAry = new Array();
        strAry = str.split("=");
        // 使用decodeURIComponent解析uri 组件编码
        for (var i = 0; i < strAry.length; i++) {
            strAry[i] = strAry[i].replace(/\+/g, " ");
            strAry[i] = decodeURIComponent(strAry[i]);
        }
        var attributeName = strAry[0];
        var attributeValue = strAry[1].trim();
        // 如果值中包含"="符号，需要合并值
        if (strAry.length > 2) {
            for (var i = 2; i < strAry.length; i++) {
                attributeValue += "=" + strAry[i].trim();
            }
        }
        /*if (!attributeValue) {
            return;
        }*/
        var attriNames = attributeName.split("."),
            curObj = obj;
        for (var i = 0; i < (attriNames.length - 1); i++) {
            curObj[attriNames[i]] ? "" : (curObj[attriNames[i]] = {});
            curObj = curObj[attriNames[i]];
        }
        curObj[attriNames[i]] = attributeValue.trim();
    };
    var properties = serializedParams.split("&");
    for (var i = 0; i < properties.length; i++) {
        // 处理每一个键值对
        evalThem(properties[i]);
    };
    return obj;
};
/**
 * 表单校验  校验是否是必填
 * @param: arr 需要验证的数组
 * @param: obj 表单数据对象
 */
payCommon.formCheck = function(arr, obj) {
    for (var i in arr) {
        var value = $.trim(obj[arr[i].key]);
        if (arr[i].required && !value) {
            payCommon.toast(arr[i].title + '不能为空');
            return false;
        } else if (arr[i].max && value.length > arr[i].max) {
            payCommon.toast(arr[i].title + '最多不超过' + arr[i].max + '个字符');
            return false;
        } else if (arr[i].pattern && !(new RegExp(arr[i].pattern).test(value))) {
            payCommon.toast(arr[i].title + '格式不正确');
            return false;
        } else if (arr[i].type === 'idCard') {
            var flag = payCommon.checkCard(value);
            if (!flag) {
                payCommon.toast('请输入正确的身份证号码');
                return false;
            }
        }
    };
    return true;
};
//请求IOS、ANDROID弹框或遮罩
payCommon.showTotast = function(waitFlag, showFlag, content) {
    var request = {
        waitFlag: waitFlag || '', //0动画等 1toast
        showFlag: showFlag || '', //showFlag 0 隐藏  1 显示
        content: content || '' //toast内容
    }
    croods.customPlugin({
        action: 'WaitViewPlugin.action',
        params: request,
        success: function(res) {}
    });
};
// 表单暂无数据处理
payCommon.dealNoData = function(obj) {
    for (var s in obj) {
        if (!obj[s]) {
            obj[s] = '暂无';
        }
    }
    return obj;
};

// 请求用户信息
payCommon.requestUser = function(callback) {
    var flag = payCommon.checkMobilePlatform();
    if (!flag) {
        // var mess = {
        //     'token':'1f4a41cf915d48078c3aaec8f29328dd'
        // };
        callback();
        return;
    }
    setTimeout(function() {
        croods.customPlugin({
            action: 'UserPlugin.getUser',
            params: {},
            success: function(res) {
                console.log(res);
                /// if (res.token) {
                callback(res);
                // } else {
                //     payCommon.toast("请求用户信息失败!");
                // }
            },
            fail: function(res) {
                console.log(res);
                payCommon.toast("请求用户信息失败!");
            },
            complete: function(res) {
                console.log(res);
            }
        });
    }, 200);
};
//数据请求时遮罩动画
payCommon.mask = function(status) { //status 为true 显示遮罩 ，默认隐藏
    var mask = document.getElementById('mask');
    if (status) {
        if (!mask) {
            $('body').append('<div id="mask" class="mask"><div class="please-hold"><div class="loading"></div><p>加载中...</p></div></div>');
        }
        $('body').on('touchmove', function(e) {
            e.preventDefault();
        });
        $("#mask").show();
        return;
    }
    $("body").on(' touchend', function() {
        $("body").unbind('touchmove');
    });
    $("#mask").hide();

};
//payCommon.body20px();
//
//更换皮肤颜色
// 加载皮肤
payCommon.loadSkin = function() {
    var skinColor = bsdtSkinColor,
        //拥有字体颜色样式元素
        hasBgStyleEle = document.getElementsByClassName('fwdt-skin'),
        // 拥有背景皮肤样式元素
        hasBorderStyleEle = document.getElementsByClassName('fwdt-border'),
        // 拥有边框皮肤样式元素
        hasColorStyleEle = document.getElementsByClassName('fwdt-color'),
        // 拥有字体颜色样式元素
        hasShadowStyleEle = document.getElementsByClassName('fwdt-shadow'),
        // 拥有阴影样式元素
        hasBorderBottomStyleEle = document.getElementsByClassName('fwdt-bottom');
        // 拥有下划线样式元素


    if (hasBgStyleEle.length) {
        for (var i = 0; i < hasBgStyleEle.length; i++) {
            hasBgStyleEle[i].style.backgroundColor = skinColor;
        }
    }

    if (hasBorderStyleEle.length) {
        for (var i = 0; i < hasBorderStyleEle.length; i++) {
            hasBorderStyleEle[i].style.border = '1px solid ' + skinColor;
        }
    }

    if (hasColorStyleEle.length) {
        for (var i = 0; i < hasColorStyleEle.length; i++) {
            hasColorStyleEle[i].style.color = skinColor;
        }
    }

    if (hasShadowStyleEle.length) {
        for (var i = 0; i < hasShadowStyleEle.length; i++) {
            hasShadowStyleEle[i].style.boxShadow = '0 0 1rem' + skinColor;
        }
    }
    if (hasBorderBottomStyleEle.length) {
        for (var i = 0; i < hasBorderBottomStyleEle.length; i++) {
            hasBorderBottomStyleEle[i].style.borderBottom = '0.1rem solid' + skinColor;
        }
    }
};


// croods封装部分

//判断当前JSSDK是否支持指定JS接口
/*payCommon.checkJsApi = function(parms, successFun) {
    croods.checkJsApi({
        jsApiList: parms.jsApiList, // 需要检测的JS接口列表 ['phone', 'sendMessage']
        success: successFun && successFun(res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"phone":true,"sendMessage":true}    }
        }
    });
};*/

//页面关闭
payCommon.pageClose = function(func) {
    croods.pageClose({
        callback: func //可选，页面关闭后执行回调函数名称
    });
};

//页面返回
payCommon.back = function() {
    croods.goBack();
};
//页面退出
payCommon.exit = function() {
    croods.exit();
};

//统一路由请求
payCommon.ajax = function(parms, successFun, failFun, completeFun) {
    croods.ajax({
        method: parms.code, //必填,method编码、具体为统一路由定义32位字符串
        params: parms.params || {}, //请求参数
        success: successFun && successFun(res), //请求成功回调
        fail: failFun && failFun(res), //请求失败回调
        complete: completeFun && completeFun(res) //请求完成回调，不管成功失败都会执行
    });
};
//自定义插件
payCommon.customPlugin = function(parms, successFun) {
    croods.customPlugin({
        action: parms.PluginName + '.' + parms.ActionName, //必填,PluginName为插件名、ActionName为插件内方法
        params: parms.params || {}, //可选,插件需请求参数
        success: successFun && successFun(res) //根据业务实际情况返回
    });
};
//获取网络类型
payCommon.getNetworkType = function(successFun) {
    croods.getNetworkType({
        success: successFun && successFun(res) //”2g”,”3g”,”4g”,”wifi”,”none” 为none表明没有网络}
    });
};
//物理按钮绑定
/*payCommon.bindButton = function(successFun) {
    croods.bindButton({
        //需要绑定的物理
        ["volumedownbutton", //音量上键
            "volumeupbutton", //音量下键
            "searchbutton", //搜索键
            "menubutton", // 菜单键
            "backbutton", //返回键
            "homebutton" //主页键 
        ],
        keycode: ['backbutton'], //必填
        success: successFun && successFun(res)
    })
};
//物理按键解绑
payCommon.unbindButton = function(successFun) {
    croods.unbindButton({
        ["volumedownbutton", //音量上键
            "volumeupbutton", //音量下键
            "searchbutton", //搜索键
            "menubutton", // 菜单键
            "backbutton", //返回键
            "homebutton" //主页键 
        ]
        keycode: ['backbutton'], //必填
            success: successFun && successFun(res)
    })
};*/
//保存接口
payCommon.storageAdd = function(params, successFun, failFun) {
    croods.storage.add({
        params: params || {}, //必填，需要保存的数据信息对象 
        success: successFun && successFun(res), //保存回调对象
        fail: failFun && successFun(res) //失败信息
    });
};
//获取接口
/*payCommon.storageGet = function(key, successFun, failFun) {
    croods.storage.get({
            key: key //必填，需要获取数据key值，多个按逗号分隔key2”       
            success: successFun && successFun(res), //获取成功回调
        },
        fail: failFun && failFun(res) //失败信息
    });
};*/
//获取所有接口
payCommon.storageGetAll = function(successFun, failFun) {
    croods.storage.getAll({
        success: successFun && successFun(res), //成功回调返回所有数据对象
        fail: failFun && failFun(res) //失败信息
    });
};
//删除接口
payCommon.storageRemove = function(key, successFun, failFun) {
    croods.storage.remove({
        key: key, //必填，需要删除数据key值，多个按逗号分隔
        success: successFun && successFun(res), //删除成功回调 
        fail: failFun && failFun(res) //失败信息
    });
};
//删除所有接口
payCommon.storageRemoveAll = function(successFun, failFun) {
    croods.storage.removeAll({
        success: successFun && successFun(res), //删除成功回调 
        fail: failFun && successFun(res) //删除回调数据对象
    });
};
//文件选择
payCommon.chooseFile = function(parms, successFun, failFun) {
    croods.chooseFile({
        path: parms.path, // 可选， 指定查找目录  /sdcard
        reg: parms.reg, //可选，指定查找规则，正则表示 /\.jpg$/
        recursive: parms.recursive || false, //可选，是否递归查找，默认false
        success: successFun && successFun(res),
        //path文件路径,fileName 文件名称,fileType 文件类型 1.文件夹 2.文件
        //fileSize文件大小,modificationDate //最后修改时间
        fail: failFun && failFun(res)
    })
};
//文件打开
payCommon.openFile = function(filePath, successFun, failFun) {
    croods.openFile({
        filePath: filePath, //必填,文件路径
        success: successFun && successFun(res), //文件打开成功
        fail: failFun && failFun(res) //失败信息
    })
};
//文件开始下载
payCommon.startDownload = function(loadPath, successFun, failFun) {
    croods.startDownload({
        url: loadPath, //必填,需要下载的文件路径
        success: function(res) { //请求回调成功
            successFun && successFun(res); //成功信息
            packages.downloadListener(); //此处调用文件下载监听
        },
        fail: failFun && failFun(res) //失败信息
    })
};
//文件下载监听
payCommon.downloadListener = function(successFun, failFun) {
    croods.downloadListener({
        success: successFun && successFun(res),
        //process 下载进度, speed下载速度,size 文件大小，hasDownSize, 已下载大小,path 文件位置
        fail: failFun && failFun(res)
    })
};
//取消文件下载
payCommon.cancelDownload = function() {
    croods.cancelDownload();
};
//文件上传
payCommon.upload = function(parms, successFun, failFun) {
    croods.upload({
        method: parms.code, //统一路由上传接口url
        //表单多个上传以及支持多个文件，name、docs为上传组件名称
        files: parms.files, //['../../xxxxxxx.jpg', '../assets/images/xxxsss.jpg'],
        //["xxxxxxx.doc"]
        //支持表单其他字段,比如
        formData: parms.formData,
        //文件大小限制
        fileSizeLimit: parms.fileSize || 500, //KB
        success: successFun && successFun(res),
        fail: failFun && failFun(res)
    })
};
//拍照接口
payCommon.takePhoto = function(successFun) {
    croods.takePhoto({
        success: successFun && successFun(res) //请求成功回调,返回照片存储路径字符串
    });
};
//选择图片
payCommon.chooseImage = function(parms, successFun, cancelFun) {
    croods.chooseImage({
        count: parms.count || 5, //可选,选择图片数量
        success: parms.successFun && parms.successFun(res), //请求成功回调
        //filePath 路径,imageHeight  高度, imageWidth 宽度
        //modificationate  最后修改时间,fileSize  文件大小,exifInfo  附加信息
        cancel: parms.cancelFun && parms.cancelFun(res) //取消选图回调
    });
};
//打开位置
payCommon.openLocation = function(parms, successFun, failFun) {
    croods.openLocation({
        interval: parms.timer || 5000, //可选,代表每个5S进行一次定位，默认为5000ms
        //经度  lng,  纬度  lat,精度  acc,海拔 alt 
        success: successFun && successFun(res), //请求成功回调  
        fail: failFun && failFun(res) //失败回调
    });
};
//结束定位
payCommon.closeLocation = function() {
    croods.closeLocation();
};
//获取详细地址
payCommon.getLocation = function(parms, successFun, failFun) {
    croods.getLocation({
        lng: parms.lng, //必填，经度
        lat: parms.lat, //必填，纬度
        success: sucessFun && sucessFun(res), //请求成功回调
        //国家 nation,省份 province,市 city,区 district,街道 street,街道号 streetNum
        fail: failFun && failFun(res) //失败回调
    });
};
//开始录音
payCommon.startRecord = function(successFun, failFun) {
    croods.startRecord({
        success: function(res) { //请求成功回调
            successFun && successFun(res); //成功信息
            croods.recordListener(); //此处调用录音监听
        },
        fail: failFun && failFun(res) //失败回调
    });
};
//结束录音
payCommon.stopRecord = function(successFun, failFun) {
    croods.stopRecord({
        success: successFun && successFun(res), //请求成功回调
        fail: failFun && failFun(res) //失败回调
    });
};
//播放录音
payCommon.playVoice = function(filePath, successFun, failFun) {
    croods.playVoice({
        filePath: filePath, //录音存放路径
        success: function(res) { //请求成功回调
            // successFun; //成功播放信息 
            packages.playListener(filePath, successFun, failFun); //此处调用播放监听
        },
        fail: failFun && failFun(res) //失败回调
    });
};
//播放监听
payCommon.playListener = function(filePath, successFun, failFun) {
    croods.playListener({
        filePath: filePath, //文件存放路径
        success: successFun && successFun(res), //请求成功回调
        //当前播放点，单位毫秒 currentPosition
        fail: failFun && failFun(res) //失败回调
    });
};
//结束播放
payCommon.stopVoice = function(successFun, failFun) {
    croods.stopVoice({
        success: successFun && successFun(res), //请求成功回调
        fail: failFun && failFun(res) //失败回调
    });
};
//分享接口
payCommon.sharePlatform = function(parms, successFun) {
    croods.sharePlatform = {
        QQ: 1,
        QZone: 2,
        SinaWeibo: 3,
        WeChatSession: 4,
        WeChatTimeline: 5,
        WeChatFav: 6
    }
    croods.shareType = {
        Text: 0,
        Image: 1,
        WebPage: 2,
        Music: 3,
        Video: 4,
        Apps: 5,
        File: 6
    }
    croods.shareContent({
        platform: parms.sharePlatform, //必填，分享平台ID
        shareParams: { //必填，分享参数
            //必填，分享内容类型
            type: parms.shareType,
            //必填，text是分享文本，所有平台都需要这个字段
            text: parms.text,
            //选填，微信（包括好友、朋友圈收藏）和易信（包括好友和朋友圈）中使用
            url: parms.url,
            //选填，印象笔记、邮箱、信息、微信（好友、朋友圈和收藏）、人人网和QQ空间使用
            title: parms.title,
            //选填，标题的网络链接，仅在人人网和QQ空间使用
            titleUrl: parms.titleUrl,
            //选填，分享此内容的网站名称，仅在QQ空间使用
            site: parms.site,
            //选填，分享此内容的网站地址，仅在QQ空间使用
            siteUrl: parms.siteUrl || '',
            //选填，图片路径，新浪微博、人人网、QQ空间和Linked-In支持此字段
            imageUrl: parms.imageUrl || ''
        },
        success: successFun && successFun(res)
    });
};
//活体检测
/*payCommon.livenessDetect = function(parms, successFun, failFun) {
    croods.livenessDetect({
        //选填，设置认证动作，默认全部（blink-眨眼，mouth-张嘴，yaw-摇头，nod-点头）,
        //如需设置，” blink” 为必填， 其他三个动作可选
        actions: parms.actions //["blink", "mouth", "yaw", "nod"],
        soundNotice: parms.soundNotice || true, //选填，是否声音提醒，默认true
        success: successFun && successFun(res),
        fail: failFun && failFun(res)
    })
};*/

fly.component(payCommon);
module.exports = payCommon;
'use strict';
require("../device/device.js?__inline");
// var fly = require('fly');
var common = module.exports = fly.Component.extend({

    name: 'Common',
});

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

common.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

/**
 * 获取URL中的参数值
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
common.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
};

common.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return '';
}

/**
 * 将14位数字字符串转日期格式
 * @param str 14位字符串
 * @return 日期
 */
common.dateFormat = function(str) {
    if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "/" + str.substring(
                4, 6) + "/" + str.substring(6, 8) + " " +
            str.substring(8, 10) + ":" + str.substring(
                10, 12) + ":" + (str.substring(12, 14) ? str.substring(12, 14) : '00');
        return new Date(st);
    }
};

// xxxx-xx-xx xx:xx
common.getNowDate = function(str) {
    if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "-" + str.substring(
                4, 6) + "-" + str.substring(6, 8) + " " +
            str.substring(8, 10) + ":" + str.substring(
                10, 12);
        return st;
    }
};

/**
 * 将日期格式转成12位数字字符串
 * @param str 日期
 * @return 字符串
 */
common.timeForData = function(time) {
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

common.transTime = function(time) {
    var year = time.substring(0, 4),
        month = time.substring(4, 6),
        day = time.substring(6, 8);
    return year + "-" + month + "-" + day;
};

/**
 * 20180419221500123 --> 2018-04-19 22:15:00:123
 * 2018-04-19 22:15:00:123 --> long
 */
common.time14ToDate = function(time) {
    var dateTime = time.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1/$2/$3 $4:$5:$6");
    return new Date(dateTime).getTime();
};

/**
 * 将日期格式转成4位数字字符串
 * @param str 日期
 * @return 字符串
 */
common.timeForHour = function(time) {
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
common.getTimeRange = function(time2) {
    time2 = time2.substring(0, 12);
    var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = common.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime(),
        result;
    if (time3 == time1) { // 今天
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            result = hours + '小时前';
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                result = minutes + '分钟前';
            } else {
                result = '刚刚';
            }
            return result;
        }
    } else {
        result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8);
        return result;
    }
};

// 资讯详情里，时间显示
common.getZXTimeRange = function(time2) {
    var publishTime = common.time14ToDate(time2) / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,

        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0) {
        return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    } else if (d_hours - date.getHours() >= 0) {
        return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    } else if (d_hours >= 1) {
        return H + ':' + m;
    } else if (d_minutes >= 0) {
        return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
        return '刚刚';
    }
};

//计算列表图片大小
common.getListImgSize = function(basW, ratio) {
    var screenW = window.screen.width,
        ua = navigator.userAgent,
        version = parseFloat(ua.substr(ua.indexOf('Android') + 8, 3)),
        dpr = window.devicePixelRatio,
        imgSizeW,
        imgSizeH;
    if (common.phoneOs() == 'Android' && (version <= 4.4)) {
        dpr = 1;
    }
    if (screenW >= 720) {
        imgSizeW = 45 * dpr * basW;
        imgSizeH = imgSizeW * ratio;
    } else if (screenW <= 320) {
        imgSizeW = 20 * dpr * basW;
        imgSizeH = imgSizeW * ratio;
    } else {
        imgSizeW = screenW / 16 * basW;
        imgSizeH = imgSizeW * ratio;
    }
    var screenImgSize = '_' + parseInt(imgSizeW) + "x" + parseInt(imgSizeH); //活动图片比例
    return screenImgSize;
};

common.setZoomImage = function(ImgD, FitWidth, FitHeight) {
    var image = new Image();
    image.src = ImgD.src;
    image.onload = function() {
        if (image.width > 0 && image.height > 0) {
            if (image.width / image.height >= FitWidth / FitHeight) {
                if (image.width > FitWidth) {
                    ImgD.width = FitWidth;
                    ImgD.height = (image.height * FitWidth) / image.width;
                } else {
                    ImgD.width = image.width;
                    ImgD.height = image.height;
                }
            } else {
                if (image.height > FitHeight) {
                    ImgD.height = FitHeight;
                    ImgD.width = (image.width * FitHeight) / image.height;
                } else {
                    ImgD.width = image.width;
                    ImgD.height = image.height;
                }
            }
        }
        return ImgD;
    };

};

// 计算离结束还有多长时间
common.leftTime = function(time2) {
    var date1 = new Date(), //开始时间
        date2 = common.dateFormat(time2), //结束时间
        date3 = date2.getTime() - date1.getTime(), //时间差的毫秒数

        //计算出相差天数
        days = Math.floor(date3 / (24 * 3600 * 1000)),
        //计算出小时数

        leave1 = date3 % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
        hours = Math.floor(leave1 / (3600 * 1000)),
        //计算相差分钟数
        leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
        minutes = Math.floor(leave2 / (60 * 1000)),

        result = (days + "天 " + hours + "小时 " + minutes + " 分钟");
    return result;
};

// 计算时间小时和分钟差,方式2，当天1h以后显示xx:xx
common.getTimeRangeInHour = function(time2) {
    time2 = time2.substring(0, 12);
    var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = common.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime(),
        result;
    if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            result = time2.substring(8, 10) + ":" + time2.substring(10, 12);
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                result = minutes + '分钟前';
            } else {
                result = '刚刚';
            }
            return result;
        }
    } else {
        result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8) + " " + time2.substring(8, 10) + ":" + time2.substring(10, 12);
        return result;
    }
};

common.caclNowTime = function(time2, now) {
    now = common.dateFormat(now);
    var time1 = common.timeForData(now).replace("-", "").replace("-", ""),
        date2 = common.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = now.getTime() - date2.getTime(),
        result;
    if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
            result = time2.substring(8, 10) + ":" + time2.substring(10, 12);
            return result;
        } else {
            //计算相差分钟数 
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0) {
                result = minutes + '分钟前';
            } else {
                result = '刚刚';
            }
            return result;
        }
    } else {
        result = time2.substring(
            0, 4) + "-" + time2.substring(
            4, 6) + "-" + time2.substring(6, 8) + " " + time2.substring(8, 10) + ":" + time2.substring(10, 12);
        return result;
    }
};

//当天显示xx:xx，否则显示xxxx-xx-xx
common.getTimeDate = function(time3) {
    time3 = time3.substring(0, 12);
    var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        time4 = time3.substring(0, 8),
        result;
    if (time4 == time1) {
        result = time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    } else {
        result = time3.substring(
            0, 4) + "-" + time3.substring(
            4, 6) + "-" + time3.substring(6, 8);
        return result;
    }
};

//当天显示xx:xx，否则显示xxxx-xx-xx
common.getTimeDateAndSecond = function(time3) {
    time3 = time3.substring(0, 12);
    var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        time4 = time3.substring(0, 8),
        result;
    if (time4 == time1) {
        result = time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    } else {
        result = time3.substring(
            0, 4) + "-" + time3.substring(
            4, 6) + "-" + time3.substring(6, 8) + " " + time3.substring(8, 10) + ':' + time3.substring(10, 12);
        return result;
    }
};

// 计算日期相差的天数
common.calcdate = function(time) {
    var sDate, //存储日期的数组
        oDate1, //数据库中的时间转化
        oDate2, //系统的时间转化
        nDate,
        days, //相差的天数
        result; //结果
    var timeStart = time.substring(
        0, 4) + "-" + time.substring(
        4, 6) + "-" + time.substring(6, 8);

    var timeNow = new Date(); //现在的时间
    timeNow = common.timeForData(timeNow); //将日期转为字符串

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


/**
 * 对提交到Android端数据进行封装
 * @param params json格式的map数据
 * @param requestCode 后台接口编码
 * @param type 接口类型(0-请求接口, 1-跳转接口)
 * @param isAuth 是否需要用户登录校验
 * @param jumpUrl 跳转URL
 * @param pageType 从哪个页面跳转
 * @param requestVer 后台接口版本
 * @param isDiag 是否需要遮罩层
 * @param requestMsg 请求hander返回code
 */
common.packData = function(params, requestCode, type, isAuth, jumpUrl, pageType, isDiag, requestVer, requestMsg) {
    var request = {};
    request.params = params || {};
    request.requestCode = requestCode || '';
    request.type = type || 0;
    request.isAuth = isAuth || false;
    request.jumpUrl = jumpUrl || '';
    request.pageType = pageType || '';
    request.isDiag = isDiag || 'false';
    request.requestVer = requestVer || '';
    request.requestMsg = requestMsg || '';
    return request;
}


/**
 * 判断平台
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
common.checkMobilePlatform = function(options) {
    var agent = navigator.userAgent;
    if (agent.indexOf('iflytek_mmp') != -1) {
        return true;
    }
    return false;
};
//判断手机操作系统
common.phoneOs = function() {
    var os = '';
    if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }
    return os;
};
//如果是IOS body加20px
common.body20px = function() {
    var ua = common.phoneOs();
    if (ua == 'IOS') {
        $('body').css('margin-top', '40px');
    }
};

/** 
 * js获取文本显示宽度 
 * @param str: 文本 
 * @return 文本显示宽度   
 */  
common.getTextWidth = function(str) {  
      var w = $('body').append($('<span stlye="display:none;" id="textWidth"/>')).find('#textWidth').html(str).width();  
      $('#textWidth').remove();  
      return w;  
}
//判断toke是否失效
common.checkToken = function(res, callback, i) {
    if ((typeof res) == 'string') {
        res = JSON.parse(res);
    }

    if (res.errCode == 'INVALID_TOKEN') {
        if (i && i <= 3) { // 超过3次不执行回调
            croods.customPlugin({
                action: 'UserPlugin.refreshToken',
                params: {},
                success: function(data) {
                    // if(i && i <= 3) { // 超过3次不执行回调
                    callback && callback(data.token);
                    // }
                }
            });
        } else {
            return false;
        }
    } else {
        // callback(res.token);
        return true;
    }
};

//验证手机号码
common.checkTel = function(tel) {
    var phoneValidate = /^1[3|4|5|7|8][0-9]{9}$/; // 手机号码的验证phoneValidate
    tel = parseInt(tel);
    if (phoneValidate.test(tel)) {
        return true;
    }
    return false;
};

// 验证15/18身份证
common.checkCard = function(card) {
    card = card.toUpperCase();
    // 是否为空  
    if (card === '') {
        return false;
    }
    // 校验长度，类型  
    if (!common.isCardNo(card)) {
        return false;
    }
    // 检查省份  
    if (!common.checkProvince(card)) {
        return false;
    }
    // 校验生日  
    if (!common.checkBirthday(card)) {
        return false;
    }
    // 检验位的检测  
    if (!common.checkParity(card)) {
        return false;
    }
    return true;
};

// 检查号码是否符合规范，包括长度，类型  
common.isCardNo = function(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
        return false;
    }
    return true;
};

// 取身份证前两位,校验省份  
common.checkProvince = function(card) {
    var province = card.substr(0, 2);
    if (vcity[province] == undefined) {
        return false;
    }
    return true;
};

// 检查生日是否正确  
common.checkBirthday = function(card) {
    var len = card.length,
        arr_data,
        year,
        month,
        day,
        birthday;
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
    if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        arr_data = card.match(re_fifteen);
        year = arr_data[2];
        month = arr_data[3];
        day = arr_data[4];
        birthday = new Date('19' + year + '/' + month + '/' + day);
        return common.verifyBirthday('19' + year, month, day, birthday);
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
    if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        arr_data = card.match(re_eighteen);
        year = arr_data[2];
        month = arr_data[3];
        day = arr_data[4];
        birthday = new Date(year + '/' + month + '/' + day);
        return common.verifyBirthday(year, month, day, birthday);
    }
    return false;
};

// 校验日期  
common.verifyBirthday = function(year, month, day, birthday) {
    var now = new Date(),
        now_year = now.getFullYear();
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
common.checkParity = function(card) {
    // 15位转18位  
    card = common.changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
            arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'),
            cardTemp = 0,
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
common.changeFivteenToEighteen = function(card) {
    if (card.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
            arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'),
            cardTemp = 0,
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


/**
 * 请求IOS、ANDROID弹框或遮罩
 * @param  {[type]} waitFlag [description]
 * @param  {[type]} showFlag [description]
 * @param  {[type]} content  [description]
 * 注：传参一定要是字符串，避免ios报错导致进程阻塞
 */
common.showTotast = function(waitFlag, showFlag, content) {
    var request = {
        waitFlag: waitFlag || '', //0动画等 1toast，如果是toast的话，showFlag就无需设置showFlag
        showFlag: showFlag || '', //showFlag 0 隐藏  1 显示
        content: content || '' //toast内容
    }
    croods.customPlugin({
        action: 'WaitViewPlugin.action',
        params: request,
        success: function(res) {}
    });
};
/**
 * toast提示
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
common.toast = function(content) {
    common.showTotast('1', '0', content);
};
// 表单暂无数据处理
common.dealNoData = function(obj) {
    for (var s in obj) {
        if (!obj[s]) {
            obj[s] = '暂无';
        }
    }
    return obj;
};

common.mask = function(status) {
    croods.customPlugin({
        action: 'WaitViewPlugin.action',
        params: {
            waitFlag: '0',
            showFlag: status ? '1' : '0'
        },
        success: function(res) {}
    });
};

/**
 * 无网络情况处理
 * @param $dom 要添加无网络的dom
 * @param fail 无网络情况的回调方法
 * @param ok 有网络情况的回调
 * @return {[type]} [description]
 */
common.noNet = function($dom, fail, ok) {
    croods.getNetworkType({
        success: function(res) { //请求成功回调
            if (res.network == 'none') { //”2g”,”3g”,”4g”,”wifi”,”none” //为none表明没有网络
                if (!$dom.find('.no-net').length) {
                    $dom.append('<div class="no-net top-7"><div class="no-net-img"></div><a class="refresh-btn topic-bg" href="javascript:void(0)">刷新</a><a class="close-btn" href="javascript:void(0)">关闭</a></div>');
                    $dom.on('click', '.refresh-btn', function() {
                        window.location.reload();
                    });
                    $dom.on('click', '.close-btn', function() {
                        croods.pageClose({})
                    });
                }
                fail && fail();
            } else {
                ok && ok();
            }
        }
    });
}

/**
 * 无网络情况提示
 * @param ok 有网络情况的回调
 */
common.noNetToast = function(ok) {
    croods.getNetworkType({
        success: function(res) { //请求成功回调
            if (res.network == 'none') { //”2g”,”3g”,”4g”,”wifi”,”none” //为none表明没有网络
                common.toast('网络无法连接，请检查您的网络');
            } else {
                ok && ok();
            }
        }
    });
}

common.sign = function(obj, callback) {
    croods.customPlugin({
        action: 'RequestSignPlugin.getSignParm',
        params: obj,
        success: function(param) {
            callback && callback(param);
        }
    });
}
/**
 * 开启定位
 * @param {[type]} url [请求的接口]
 * @param {[type]} param [参数]
 * @param {[type]} success [ajax成功调用的方法]
 * @param {[type]} error [ajax失败调用的方法]
 */
common.getOpenLocation = function(params) {
    var params = $.extend({
        getOpenLocationSuccess: function(lng, lat) {},
        getLocationFail: function() {},
        getLocModeFail: function() {},
        openGpsSettingFail: function() {},
        getOpenLocation: function() {}
    }, params);
    /**
     * 开启定位
     */
    croods.openLocation({
        interval: 5000,
        //可选,代表每个5S进行一次定位，默认为5000ms
        success: function(res) { //请求成功回调
            if (res && res.lng && res.lat) { // 成功后有回调并且经纬度存在
                // 关闭定位
                croods.closeLocation();
                params.getOpenLocationSuccess(res.lng, res.lat);
            } else {
                common.toast('请检查定位服务是否打开!');
                return;
            }
        },
        fail: function(res) { //失败回调
            if ((common.phoneOs() == 'Android') && res && ((res.substring(0, 5) == '70033') || (res.substring(0, 5) == '50009'))) {
                /*croods.closeLocation();*/
                common.getLocMode(params);
            } else {
                params.getLocationFail();
                console.log('定位失败');
            }

        }
    });
};
/**
 * 获取定位模式
 * @param {[type]} url [请求的接口]
 * @param {[type]} param [参数]
 * @param {[type]} success [ajax成功调用的方法]
 * @param {[type]} error [ajax失败调用的方法]
 */
common.getLocMode = function(params) {
    croods.customPlugin({
        action: 'GeoSettingPlugin.getLocMode',
        success: function(res) {
            var locMode = res.locMode;
            if (locMode == 1 || locMode == 3) {
                common.toast('如无法定位，请尝试开启网络定位...');
                common.openGpsSetting(params);
            } else if (locMode == 0) {
                // common.toast('你没有开启定位权限，默认定位合肥');
                params.openGpsSettingFail();
            }
        },
        fail: function(msg) {
            /*alert(msg.errorMessage)*/
            params.getLocModeFail();
        }
    });
};
/**
 * 开启定位设置
 * @param {[type]} url [请求的接口]
 * @param {[type]} param [参数]
 * @param {[type]} success [ajax成功调用的方法]
 * @param {[type]} error [ajax失败调用的方法]
 */
common.openGpsSetting = function(params) {
    croods.customPlugin({
        action: 'GeoSettingPlugin.openGpsSetting',
        success: function(res) {
            var locMode = res.locMode;
            if (locMode == 1) {
                params.openGpsSettingFail();
            } else {
                params.getOpenLocation();
            }
        },
        fail: function(msg) {
            params.openGpsSettingFail();
            console.log('定位失败');
        }
    });
};

/**
 * 对象拷贝
 */
common.clone = function(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                util.clone(obj[i]) : obj[i];
        }
    }
    return newobj;
};

// 获取文本字节数
common.getByteLen = function(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
};
common.getLength = function (str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

/** 
     * js截取字符串，中英文都能用 
     * @param str：需要截取的字符串 
     * @param len: 需要截取的长度 
     */
common.cutstr = function(str, len) {
        var str_length = 0,
            str_len = 0,
            str_cut = '';
        
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                // str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
            return str;
        }
    }

// 复制一个数组中元素到另一个数组
common.addAll = function(from, to) {
    for (var i = 0, len = from.length; i < len; i++) {
        to.push(from[i]);
    }
};


// 动画遮罩
common.maskPraise = function(status, dom, index, content) { //status 为true 显示遮罩 ，默认隐藏
    var maskClass = 'mask-praise' + index,
        mask = document.getElementsByClassName(maskClass);
    if (status) {
        if (mask.length <= 0) {
            $(dom).append('<div id="maskPraise" class="mask-praise ' + maskClass + '"><div class="please-hold"><div class="loading"></div></div></div>');
        }
        $(dom).on('touchmove', function(e) {
            e.preventDefault();
        });
        return;
    }
    $(dom).on(' touchend', function() {
        $(dom).unbind('touchmove');
    });
    $('.' + maskClass).remove();
};

// 动画遮罩
common.maskZXPraise = function(status, dom, content) { //status 为true 显示遮罩 ，默认隐藏
    var maskClass = 'mask-praise',
        mask = document.getElementById("maskPraise");

    if (status) {
        if (!mask || mask.length <= 0) {
            $('.' + dom).append('<div id="maskPraise" class="mask-praise"><div class="please-hold"><div class="loading"></div></div></div>');
        }
        $('.' + dom).on('touchmove', function(e) {
            e.preventDefault();
        });
        $("." + maskClass).show();
        return;
    }
    $('.' + dom).on(' touchend', function() {
        $('.' + dom).unbind('touchmove');
    });
    $("." + maskClass).hide();
};

// 警微热点去内容 截断内容 显示表情等内容处理
common.getContent = function(str, maxLength) {
    str = str.replace(/\\/g, '');
    str = str.replace(/\/\//g, 'http://');
    str = str.replace(/\&quot;/g, '"');  // 将&quot;转换成"
    var results = [],
        result = '',
        lastIndex = 0,
        length = 0, // 纯文字长度
        pattern = /<[^>]+>/g, // 闭合标签的情况
        closePattern = /<img[^>]+>/, // img标签的情况
        lastText = '',
        ret,
        notFullFlag = true, // 是否显示全文标志位
        conFlagArr = []; // 结果文本内容和是否显示全文标志位总和
        notFullFlag = '';
    while ((ret = pattern.exec(str)) != null) {
        if (ret.index > lastIndex) { // ret.index  满足条件的字符串在总的字符串中的起始位置
            results.push(str.substring(lastIndex, ret.index));  // 纯文字字段截取
        }
        results.push(ret[0]);  // 标签字段
        lastIndex = pattern.lastIndex; // 
    }
    for (var i = 0; i < results.length; i++) {
        if ((/<[^>]+>/).test(results[i])) {
            if (length < maxLength) {  // 过滤img标签
                result += results[i];
            }else if(!(/<img[^>]+>/).test(results[i])) {
                result += results[i];
            }
        } else {
            var _length = Math.min(maxLength - length, results[i].length);  // 当前截取文字的长度
            result += _length > 0 ? results[i].substring(0, _length) : '';
            length += _length;
            if ((results[i].length + (length - _length)) > maxLength) {
                notFullFlag = false;
                i = results.length;
            } else {
                notFullFlag = true;
            }
        }
    }
    if (length <= maxLength && lastIndex != str.length) {
        lastText = str.substring(lastIndex, str.length);
        var _length = lastText.length;
        length += _length;
        if (length > maxLength) {
            lastText = lastText.substring(0, _length - (length - maxLength));
            notFullFlag = false;
        } else {
            notFullFlag = true;
        }
    }
    // result为空 并且lastIndex 为0、纯文字情况  
    result += lastText == '' ?  '' : lastText;
    // result = result = ''? str : lastText == '' ? result : result + lastText;
    result = !notFullFlag ? result+ '...' : result;
    conFlagArr.push(result);
    conFlagArr.push(notFullFlag);

    return conFlagArr;
};
//post请求方式
common._post = function(url, data, seccessFun, errorFun, maskFlag) {
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
                　　　　　
                common.toast("请求超时");　　　　
            }　　
        }
    });
};
fly.component(common);
module.exports = common;
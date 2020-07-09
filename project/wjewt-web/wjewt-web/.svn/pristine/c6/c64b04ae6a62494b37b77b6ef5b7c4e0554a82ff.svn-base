var util = window.util = {};
var Toast = function(config) {
    this.context = config.context == null ? $('body') : config.context; // 上下文
    this.message = config.message; // 显示内容
    this.time = config.time == null ? 3000 : config.time; // 持续时间
    this.left = config.left; // 距容器左边的距离
    this.top = config.top; // 距容器上方的距离
    this.init();
}
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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
/**
 * 请求IOS、ANDROID弹框或遮罩
 * @param  {[type]} waitFlag [description]
 * @param  {[type]} showFlag [description]
 * @param  {[type]} content  [description]
 * 注：传参一定要是字符串，避免ios报错导致进程阻塞
 */
util.showTotast = function(waitFlag, showFlag, content) {
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
//toast弹出框
/**
 * toast提示
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
util.toast = function(content) {
    util.showTotast('1', '0', content);
};
// toast弹出框
util.toastHtml = function(msg, opt, left, top) {
    new Toast({
        context: $('body'),
        message: msg
    }, opt, left, top).show();
};
// 根据平台判断弹出方式
util.platTypeToast = function(msg, platForm) {
    if(platForm) {
        util.toast(msg);
    }else {
        util.toastHtml(msg,'','','');
    }
}
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
util.packData = function(params, requestCode, type, isAuth, jumpUrl, pageType, isDiag, requestVer, requestMsg) {
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
util.checkMobilePlatform = function(options) {
    var agent = navigator.userAgent;
    if (agent.indexOf('iflytek_mmp') != -1) {
        return true;
    }
    return false;
};
// 是否是手机端
util.isPC = function () {
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
    
};
//判断手机操作系统
util.phoneOs = function() {
    var os = '';
    if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }
    return os;
};

/**
 * 无网络情况处理
 * @param $dom 要添加无网络的dom
 * @param fail 无网络情况的回调方法
 * @param ok 有网络情况的回调
 * @return {[type]} [description]
 */
util.noNet = function($dom, fail, ok) {
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
//判断手机操作系统
util.phoneOs = function() {
    var os = '';
    if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }
    return os;
};

/**
 * 判断平台
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
util.checkMobilePlatform = function(options) {
    var agent = navigator.userAgent;
    if (agent.indexOf('iflytek_mmp') != -1) {
        return true;
    }
    return false;
};

util.getListImgSize = function(basW, ratio) {
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
	var screenImgSize = '_' + imgSizeW + "x" + imgSizeH; //活动图片比例
	return screenImgSize;
};

/**
 * 将14位数字字符串转日期格式
 * @param str 14位字符串
 * @return 日期
 */
util.dateFormat = function(str) {
    if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "/" + str.substring(
                4, 6) + "/" + str.substring(6, 8) + " " +
            str.substring(8, 10) + ":" + str.substring(
                10, 12) + ":" + (str.substring(12, 14) ? str.substring(12, 14) : '00');
        return new Date(st);
    }
};

/**
 * 将日期格式转成12位数字字符串
 * @param str 日期
 * @return 字符串
 */
util.timeForData = function(time) {
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
util.packData = function(params, requestCode, type, isAuth, jumpUrl, pageType, isDiag, requestVer, requestMsg) {
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
};

/**
 *  判断是否是微信端
 */
util.isWeiXin = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
};
/**
 *  判断是否是支付宝
 */
util.isAlipay = function() {
    if(/AlipayClient/.test(window.navigator.userAgent)){
        return true;
    }else{
        return false;
    }
};

/**
 * 获取Cookie
 */
util.getCookie = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return decodeURIComponent(arr[2]);
    }
    else
        return null;
};
/**
 * 请求IOS、ANDROID弹框或遮罩
 * @param  {[type]} waitFlag [description]
 * @param  {[type]} showFlag [description]
 * @param  {[type]} content  [description]
 * 注：传参一定要是字符串，避免ios报错导致进程阻塞
 */
util.showTotast = function(waitFlag, showFlag, content) {
    if(util.checkMobilePlatform()) {
        var request = {
            waitFlag: waitFlag || '', //0动画等 1toast，如果是toast的话，showFlag就无需设置showFlag
            showFlag: showFlag || '', //showFlag 0 隐藏  1 显示
            content: content || '' //toast内容
        }
        croods.customPlugin({
            action: 'WaitViewPlugin.action',
            params: request,
            success: function (res) {
            }
        });
    }
};

/**
 * 将14位数字字符串转日期格式
 * @param str 14位字符串
 * @return 日期
 */
util.dateFormat = function(str) {
    if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "/" + str.substring(
            4, 6) + "/" + str.substring(6, 8) + " " +
            str.substring(8, 10) + ":" + str.substring(
                10, 12) + ":" + (str.substring(12, 14) ? str.substring(12, 14) : '00');
        return new Date(st);
    }
};

// xxxx-xx-xx xx:xx
util.getNowDate = function(str) {
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
util.timeForData = function(time) {
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

util.transTime = function(time) {
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
util.timeForHour = function(time) {
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
util.getTimeRange = function(time2) {
    time2 = time2.replaceAll("-","").replaceAll(":","").replaceAll(" ","").substring(0, 12);
    var date1 = new Date(),
        time1 = util.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = util.dateFormat(time2),
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


//当天显示xx:xx，否则显示xxxx-xx-xx
util.getTimeDate = function(time3) {
    time3 = time3.substring(0, 12);
    var date1 = new Date(),
        time1 = util.timeForData(date1).replace("-", "").replace("-", ""),
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

util.clone  = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
                util.clone(obj[i]) : obj[i];
        }
    }
    return newobj;
}

//判断toke是否失效
//判断toke是否失效
util.checkToken = function(res, callback, i) {
    if (res.errCode == 'INVALID_TOKEN') {
        console.log('token失效');
        croods.customPlugin({
            action: 'UserPlugin.refreshToken',
            params: {},
            success: function(data) {
                if(i && i <= 3) { // 超过3次不执行回调
                    callback && callback(data.token);
                }
                
            }
        });
        return false;
    } else {
        return true;
    }
};
/*util.checkToken = function(res) {
    if (res.errCode == 20008 || res.errCode == 20014) {
        util.showTotast('1', '1', res.errMsg + ",请重新登录！");
        util.showTotast('0', '0');
        croods.customPlugin({
            action: 'UserPlugin.userInvalid',
            params: {},
            success: function(res) {}
        });
        return false;
    } else {
        return true;
    }
};*/
//数据请求时遮罩动画
util.mask = function(status) {
    if(util.checkMobilePlatform()) {
        croods.customPlugin({
            action: 'WaitViewPlugin.action',
            params: {
                waitFlag: '0',
                showFlag: status ? '1' : '0'
            },
            success: function (res) {
            }
        });
    }
};

/**
 * 是否具有class
 * @param  {[type]}  ele       目标元素
 * @param  {[type]}  className 类名
 * @return {Boolean}           true/false
 */
util.hasClass = function(ele, className) {
    return ele && ele.className && ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
},
/**
 * 移除样式
 * @param  {[type]} ele       目标元素
 * @param  {[type]} className 类名
 */
util.removeClass = function(ele, className) {
    if (util.hasClass(ele, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
},
/**
 * 获取ID元素
 * @param  {[type]} idName ID名
 * @return {[type]}        目标元素
 */
util.id = function(idName) {
    return document.getElementById(idName) || null;
}
/**
 * 兄弟元素
 * @param  {[type]} ele 目标元素
 * @return {[type]}     兄弟元素
 */
util.siblings = function(ele) {
    var siblingsList = [],
        allChild = ele.parentNode.children;

    for (var i = 0; i < allChild.length; i++) {
        if (allChild[i] !== ele) {
            siblingsList.push(allChild[i]);
        }
    }
    return siblingsList;
},
/**
 * 获取URL中的参数值
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
util.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return '';
}

util.setCookie = function(name, value, day, domain) {
	var str = name + '=' + value;
	if(day) {
		var date = new Date();
		date.setTime(date.getTime()+ day*24*3600*1000);
		str+=";expires="+date.toGMTString();
	}
	str=domain?str+";domain="+domain : str;
	document.cookie = str;
}
util.getCookie = function(name) {
	var cookieStr=document.cookie;
	if(cookieStr.length>0){
		var start =cookieStr.indexOf(name+"="),
			end = 0;
		if(start>-1){
			start+=name.length+1;
			end = cookieStr.indexOf(";",start);
			if(end===-1){
				end=cookieStr.length;
			}
		}
		return decodeURIComponent(cookieStr.slice(start,end));
	}
	return "";
}
/**
 * 获取URL中的参数值
 * @param  {String} name 参数名
 * @return {String} 参数值，若没有该参数，则返回''
 */
util.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
};
util.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return '';
}
// 警微热点去内容 截断内容 显示表情等内容处理
util.getContent = function(str, maxLength) {
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

/**
 * ajax请求
 * @param {[type]} url [请求的接口]
 * @param {[type]} param [参数]
 * @param {[type]} success [ajax成功调用的方法]
 * @param {[type]} error [ajax失败调用的方法]
 */
util.ajaxRequest = function(url, param, success, error) {
    fly.$.ajax({
        url: url,
        data: param,
        dataType: 'json',
        type: 'POST',
        cache: false,
        success: success,
        error: error
    });
};
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

        /*var left = this.left == null ? this.context.width() / 2 - msgEntity.width() / 2 : this.left,
            top = this.top == null ? $(window).height() / 2 - msgEntity.find('span').height() / 2 : this.top;*/
        var left = this.left == null ? this.context.width() / 2 - msgEntity.outerWidth() / 2 : this.left;
        msgEntity.css({
            bottom: '3rem',
            left: left
        });
        /*msgEntity.css({
            bottom: '3rem',
            left: '50%',
            transform:'translate(-50%,-50%)'
        });*/
    },
    //显示动画
    show: function() {
        msgEntity.fadeIn();
        setTimeout(function() {
            msgEntity.fadeOut(1000);
        }, 1000);
    }
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
    var os = '',
        u = navigator.userAgent,
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid) {
        os = 'Android';
    }else if(isiOS) {
        os = 'IOS';
    }
    return os;
     /*if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }*/
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
};
//判断手机操作系统
/*util.phoneOs = function() {
    var os = '';
    if ($.device.android) {
        os = 'Android';
    } else if ($.device.ios) {
        os = 'IOS';
    }
    return os;
};*/

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
 * 当前时间的时分秒
 * @param 
 * @return 日期
 */
util.currentTimer = function() {
     var date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        timer ;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds; 
    hours = hours < 10 ? '0' + hours : hours; 
    timer = hours + ":" + minutes + ":" + seconds;
    return timer;
    //timer = hours + ":" + minutes;
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


util.getTimeRange = function(time2) {
	time2 = time2.substring(0, 12);
    var date1 = new Date(),
        time1 = util.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = util.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime();
    if (time3 == time1) { // 今天
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

/**
 * 将时间戳日期格式转成14位数字字符串 2017-09-01 11:12:09
 * @param str 日期
 * @return 字符串
 */
util.dateFormatMs = function(dateString) {
    var dates = new Date(dateString),
        year = dates.getFullYear(),
        month = dates.getMonth() + 1,
        day = dates.getDate(),
        hour = dates.getHours(),
        minute = dates.getMinutes(),
        seconds = dates.getSeconds();
    month = month < 10 ? '0'+ month : month;
    day = day < 10 ? '0'+ day : day;
    hour = hour < 10 ? '0'+ hour : hour;
    minute = minute < 10 ? '0'+ minute : minute;
    seconds = seconds < 10 ? '0'+ seconds : seconds;
    return year + '-' + month+ '-' + day+ ' ' + hour+ ":" + minute + ":" + seconds; 

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
util.mask = function(status,content) {
    if(util.checkMobilePlatform()) {
        croods.customPlugin({
            action: 'WaitViewPlugin.action',
            params: {
                waitFlag: '0',
                showFlag: status ? '1' : '0',
                content: content || '' //toast内容
            },
            success: function (res) {
            }
        });
    }
};

//数据请求时遮罩动画
/*util.maskHtml = function(status) { //status 为true 显示遮罩 ，默认隐藏
    var mask = document.getElementById('mask');
    if (status) {
        if (!mask) {
            $('body').append('<div id="mask" class="mask"><div class="please-hold"><div class="loading"></div><img src="'+CONTEXTPATH+'/resource/h5/images/common/waitView.gif" class="img-bg"><p>努力加载中...</p></div></div>');
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

};*/
//数据请求时遮罩动画
util.maskHtml = function(status,content) { //status 为true 显示遮罩 ，默认隐藏
    var mask = document.getElementById('mask');
    if (status) {
        if (!mask && content == '') {
            $('body').append('<div id="mask" class="mask"><div class="please-hold"><div class="loading"></div><p>努力加载中...</p></div></div>');
        }else if(!mask && content){
             $('body').append('<div id="mask" class="mask"><div class="please-hold"><div class="loading"></div><p>' + content + '</p></div></div>');
        }
        if(content) {
           $('#mask').find('p').html(content);
        }else if(mask){
            $('#mask').find('p').html('努力加载中...');
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
};

util.checkDeviceType = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return '3'; // 微信
    }
    if (ua.match(/AlipayClient/i) == 'alipayclient') {
        return '5'; // 支付宝
    }
   
    var userAgentInfo = navigator.userAgent,
        Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"],
        v = 0;
    for ( v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            break;
        }
    }
    if(v >= Agents.length) {
        return  '6'; // PC
    }
    if($.device && $.device.android) {
        return '1'; //Android
    }
    if($.device && $.device.ios) {
        return '2'; // IOS
    }
    return '0';
};

/**
 * 返回刷新上一页面
 */
util.refreshHistory = function(title, callback) {
    var redirect = util.getParam('redirect');
	/*if(util.isWeiXin() && !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){*/
    	util.pushHistory(); 
    	 var bool=false;  
         setTimeout(function(){  
               bool=true;  
         },1000);  
		window.addEventListener("popstate", function(e) {
			if(bool) {
				if(callback) {
					util.pushHistory();
					callback();
					return;
				}
	            if(util.checkMobilePlatform() && redirect) {
	                croods.pageClose();
	                return;
	            }
	            if(util.isWeiXin() && redirect) {
	                return;
	            }
				window.location = document.referrer;
			} else {
				util.pushHistory();
			}
		}, false);  
	/*}*/
};

util.pushHistory = function() {
	var state = {  
	        title: document.title,  
	        url: window.location.href  
	    };  
	window.history.pushState(state, state.title, state.url);  
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
/**
 * 开启定位
 * @param {[type]} url [请求的接口]
 * @param {[type]} param [参数]
 * @param {[type]} success [ajax成功调用的方法]
 * @param {[type]} error [ajax失败调用的方法]
 */
util.getOpenLocation =  function(params) {
    var params = $.extend({
            getOpenLocationSuccess: function(lng,lat) {},
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
        success: function (res) { //请求成功回调
            if(res && res.lng && res.lat) { // 成功后有回调并且经纬度存在
                // 关闭定位
                croods.closeLocation();
                params.getOpenLocationSuccess(res.lng,res.lat);
            }else {
                util.toast('请检查定位服务是否打开!');
                return;
            }
        },
        fail: function (res) { //失败回调
            if((util.phoneOs() == 'Android') && res && ((res.substring(0, 5) == '70033')|| (res.substring(0, 5) == '50009'))) {
                /*croods.closeLocation();*/
                util.getLocMode(params);
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
util.getLocMode = function(params) {
    croods.customPlugin({
        action: 'GeoSettingPlugin.getLocMode',
        success: function(res) {
            var locMode = res.locMode;
            if(locMode == 1) {
                util.toast('如无法定位，请尝试开启网络定位...');
                util.openGpsSetting(params);
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
util.openGpsSetting = function(params) {
    croods.customPlugin({
        action: 'GeoSettingPlugin.openGpsSetting',
        success: function(res) {
            var locMode = res.locMode;
            if(locMode == 1) {
                params.openGpsSettingFail();
            }else {
                params.getOpenLocation();
            }
        },
        fail: function(msg) {
            params.openGpsSettingFail();
            console.log('定位失败');
        }
    });
};

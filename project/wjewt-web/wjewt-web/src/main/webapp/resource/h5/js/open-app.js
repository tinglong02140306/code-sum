$(function(){
	var ID = fly.getQueryString('id'),
	    wbname = getParam('wbname'),
	    weburl = getParam('weburl');
	//实际上就是新建一个iframe的生成器
    var createIframe=(function(){
      var iframe;
        return function(){
            if(iframe){
                return iframe;
            }else{
                iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                return iframe;      
            }
        }
    })();
    /**
	 * 获取URL中的参数值
	 * @param  {String} name 参数名
	 * @return {String} 参数值，若没有该参数，则返回''
	 */
	function getParam(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = location.search.substr(1).match(reg);
	    if (r != null) {
	        return decodeURI(r[2]);
	    }
	    return '';
	};
    function isAndroid() {
    	return navigator.userAgent.match(/Android/i) ? true : false;
    };
    function isIos() {
    	return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    };
    function isWeiXin() {
    	return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ? true : false;
    }
    function isChrome() {
    	return (navigator.userAgent.toLowerCase().indexOf("chrome") > 0) ? true : false;
    }
	/**
	 * 打开APP,判断当前是推荐还是头部的打开
	 */
	function openApp(param) {
		var itemId = param.currentTarget && $(param.currentTarget).data("id");
		var id = itemId||ID;
		var type = $(param.currentTarget).data().type, 
		    url;
		if(type == 'blog') {
			url = '/blog-news-detail.html?id=' + ID + '&wbname=' + wbname + '&weburl=' + weburl;  // 警微热点详情
		}else {
			url = '/news-detail.html?id=' + id;
		}
		var AndroidURL = 'iflyapp://wj.ahga.gov.cn/open/local' + url, // Android schemeURL协议
			IosUrl = 'iflytekewt://wj.ahga.gov.cn/open/local' + url, // ios schemeURL协议
			IosLinkUrl = 'https://wj.ahga.gov.cn/open/local' + url, // ios 通用链接
			downUrl = 'http://wewt.ahga.gov.cn:8082/wjewt/h5/share.do', // 下载页地址
			yybUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bingo.ewtplat&android_schema='+AndroidURL, // 应用宝微下载链接
			openIframe = createIframe();
			if(isWeiXin()) {
	        	window.location.href = yybUrl;
	        	return;
	        }
	    if(isIos()){
	    	var ver = navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/),
	    		version = ver[1].replace(/_/g,".");
	    	version = version.split('.')[0];
	    	if(version >= 9) {
	    		window.location.href = IosLinkUrl;
	    		return;
	    	}
	        //判断是否是ios,具体的判断函数自行百度
	        window.location.href = IosUrl;
	        var loadDateTime = Date.now();
	        setTimeout(function () {
	            var timeOutDateTime = Date.now();
	            if (timeOutDateTime - loadDateTime < 1000) {
	                window.location.href = downUrl;
	            }
	        }, 25);
	    }else if(isAndroid()){
	        //判断是否是android，具体的判断函数自行百度
	        if (isChrome()) {
	            //chrome浏览器用iframe打不开得直接去打开，算一个坑
	            window.location.href = AndroidURL;
	        } else {
	            //抛出你的scheme
	            openIframe.src = AndroidURL;
	        }
	        setTimeout(function () {
	        	if(document.hidden || document.webkitHidden) {
					return;
				}
	            window.location.href = downUrl;
	        }, 500);
	    }else{
	        //主要是给winphone的用户准备的,实际都没测过，现在winphone不好找啊
	        openIframe.src = schemeUrl;
	        setTimeout(function () {
	            window.location.href = downUrl;
	        }, 500);
	    }
	};

	$(document).ready(function () {
        $('#openApp').on('click', openApp);
        if ($(".wrap.city-news li")){
            $('.wrap').off('.city-news li').on('click', '.city-news li',openApp);
        }
    })
});
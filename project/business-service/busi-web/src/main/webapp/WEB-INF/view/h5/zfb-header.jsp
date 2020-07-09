<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<c:if test="${fn:contains(ua, 'AlipayClient')}">
<%-- <header class="topic-bg wx-header clearfix">
	<a class="down-icon fr" href="${appurl}">下载APP</a>
	<a class="user-icon ell fr" href="${wxIndex}">${userName}</a>
</header> --%>
<div id="downWrap" class="down-wrap">
	<a href="${appurl}" class="down-content"></a>
	<i id="deleteIcon" onclick="deleteDown()" class="delete-icon"></i>
</div>
<script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.min.js"></script>
<script>
	
	var	downWrap = document.getElementById('downWrap'),
		showDown = getCookie('showDown');
	if(showDown == '0') {
		downWrap.classList.add('hide');
	} else {
		downWrap.classList.remove('hide');
	}
	function setCookie(name, value, day, domain) {
		var str = name + '=' + value;
		if(day) {
			var date = new Date();
			date.setTime(date.getTime()+ day*24*3600*1000);
			str+=";expires="+date.toGMTString();
		}
		str=domain?str+";domain="+domain : str;
		document.cookie = str;
	}
	function getCookie(name) {
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
	function deleteDown() {
		downWrap.classList.add('hide');
		setCookie('showDown', '0', 0.5/24, window.location.hostname);
	}
	sessionStorage.setItem('username', '${userName}');
// 	var weixinConfig = {
// 		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
// 		    appId: '${weixinConfig.appId}', // 必填，公众号的唯一标识
// 		    timestamp: '${weixinConfig.timestamp}', // 必填，生成签名的时间戳
// 		    nonceStr: '${weixinConfig.nonceStr}', // 必填，生成签名的随机串
// 		    signature: '${weixinConfig.signature}',// 必填，签名，见附录1
// 		    jsApiList: ['checkJsApi', 'getLocation', 'closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
// 		};
// 	wx.config(weixinConfig);
</script>
</c:if>
;
(function(doc, win) {
	function IsPC() {  
       var userAgentInfo = navigator.userAgent;  
       var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
       var flag = true;  
       for (var v = 0; v < Agents.length; v++) {  
           if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
       }  
       return flag;  
	}  
    var dpr, rem, scale,
        docEl = document.documentElement,
        fontEl = document.createElement('style'),
        metaEl = document.querySelector('meta[name="viewport"]'),
        screenWidth = screen.width;
    dpr = win.devicePixelRatio || 1;
    scale = 1 / dpr;
    rem = screenWidth * dpr / 16;
    var deviceWidth = "device-width";
    var ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1) {
        var version = parseFloat(ua.substr(ua.indexOf('Android') + 8, 3));
        // andriod 2.3
        if (version > 4.4 && ua.indexOf('iflytek_mmp') != -1) {
            // 设置viewport，进行缩放，达到高清效果
            // metaEl.setAttribute('content', 'width=' + screen.width + ',initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no' + ',target-densitydpi=device-dpi');
            metaEl.setAttribute('content', 'width=' + screen.width + ',initial-scale=1.0' + ',maximum-scale=1.0' + ',minimum-scale=1.0' + ',user-scalable=no' + ',target-densitydpi=device-dpi' + ',user-scaled=no');
            // andriod 4.4以上
            // 动态写入样式
            docEl.firstElementChild.appendChild(fontEl);
            if (screenWidth >= 720) {
                fontEl.innerHTML = 'html{font-size:' + 45 * dpr + 'px!important;}';
            } else if (screenWidth <= 320) {
                fontEl.innerHTML = 'html{font-size:' + 20 * dpr + 'px!important;}';
            } else {
                // fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
                fontEl.innerHTML = 'html{font-size:' + screenWidth / 16 + 'px!important;}';
            }
        } else {
            // 设置viewport，进行缩放，达到高清效果
            metaEl.setAttribute('content', 'width=' + deviceWidth + ',initial-scale=1.0' + ',maximum-scale=1.0 ' + ',minimum-scale=1.0' + ',user-scalable=no' + ',target-densitydpi=device-dpi');
            // 动态写入样式
            docEl.firstElementChild.appendChild(fontEl);
            if (screenWidth >= 720) {
                fontEl.innerHTML = 'html{font-size:' + 45 + 'px!important;}';
            } else if (screenWidth <= 320) {
                fontEl.innerHTML = 'html{font-size:' + 20 + 'px!important;}';
            } else {
                fontEl.innerHTML = 'html{font-size:' + screenWidth / 16 + 'px!important;}';
            }
        }
        // 其他系统
    } else {
    	
        // 设置viewport，进行缩放，达到高清效果
        metaEl.setAttribute('content', 'width=' + screen.width + ',initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no' + ',target-densitydpi=device-dpi');
        // andriod 4.4以上
        // 动态写入样式
        docEl.firstElementChild.appendChild(fontEl);
        if (screenWidth >= 720) {
            fontEl.innerHTML = 'html{font-size:' + 45 * dpr + 'px!important;}';
        } else if (screenWidth <= 320) {
            fontEl.innerHTML = 'html{font-size:' + 20 * dpr + 'px!important;}';
        } else {
            fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
        }
        if(IsPC()) {
    		fontEl.innerHTML = 'html{font-size:' + 22.5 * dpr + 'px!important;}';
    	}
    }
    docEl.setAttribute('data-dpr', dpr);
})(document, window);
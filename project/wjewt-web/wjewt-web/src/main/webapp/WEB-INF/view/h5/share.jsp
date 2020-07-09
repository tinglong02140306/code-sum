<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="format-detection" content="telephone=no" />
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <script src="${ctx}/resource/js/plugins/flexible/flexible.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/share.css" rel="stylesheet" />
    <title>皖警便民服务e网通</title>
</head>
<body>	
    <div class="download-wrap">
        <div class="download-bg">
            <img class="download-img" src="${ctx}/resource/h5/images/share/download-cont.png"> 
        </div>
        <div class="download-cont clearfix">
            <img class="content-download-logo fl" src="${ctx}/resource/h5/images/share/logo-icon.png">
            <div class="content-download-word fl">
                <p class="content-download-title">皖警便民服务e网通</p>
                <p class="content-download-text">安徽公安便民服务官方app</p>
            </div>
            <div class="content-download-button fr" id="btnDownload" style="position:relative;z-index:1000;cursor: pointer;">立即下载</div>
        </div>
        <div class="share-mask hide">
            <img src="${ctx}/resource/h5/images/share/pic_guide.png">
        </div>
    </div>
    <script>
        var downloadUrl = '',
            os = phoneOs(),
            _mask = document.querySelector('.share-mask');
        isWeixin() ? _mask.style.display = 'block' : _mask.style.display = 'none';
        document.getElementById('btnDownload').addEventListener('click',function (ev) {
            if(os && os == 'IOS'){
                downloadUrl = "https://itunes.apple.com/app/id1191393043";
            }else{
                downloadUrl = "http://wj.ahga.gov.cn/download/ga.apk";
            }
            window.location.href = downloadUrl;
        })
        /**
         * 判断安卓或者IOS系统
         * @returns 系统类型
         */
        function phoneOs() {
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
        }

        /**
         * 判断是否微信环境打开
         * @returns true是 false不是
         */
        function isWeixin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        }
    </script>
</body>
</html>
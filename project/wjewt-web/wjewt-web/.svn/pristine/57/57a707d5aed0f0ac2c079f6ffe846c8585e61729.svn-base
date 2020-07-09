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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/share/share.css" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title></title>
    <style>
    	.share-btn {
		    margin: 0 0 0 2.5%;
		    display: inline-block;
		    width: 12.5%;
		    height: 2.1rem;
		    background: url(${ctx}/resource/h5/images/new-details/share.png) 10% center no-repeat;
		    background-size: 0.68rem 0.73rem;
		}
		iframe {
			position: absolute;
			top: 3rem;
			bottom: 0;
			width: 100%;
			height: calc(100% - 3rem);
			border: none;
		}
    </style>
</head>
<body>
    <div class="wrap">
        <!-- 头部 start -->
        <header>
            <div class="header-item topic-bg">
                <a class="header-back back" href="javascript:void(0)"></a>
                <span class="ell">活动详情</span>
                <!--  <label class="share-collection" data-bind="click: headerMore" href="javascript:void(0)"></label> -->
                <label class="share-btn fr"></label>
            </div>
        </header>
        <!-- 头部 end -->
        <!-- 查询资讯结果 start -->
        <iframe id="wrapper" src="${activityurl}" frameboder="0">
        </iframe>
        <div id="share"></div>
       
    </div>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/activity.js"></script>
</body>
</html>
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
    <link href="${ctx}/resource/h5/css/flow-chart.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title></title>
</head>
<body class="bf">
    <div class="wrap flow-chart-wrap bf">
        <!-- 头部start -->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <a class="header-back back" data-bind="click: back" href="javascript:void(0)"></a>
                <div id="liMarquee" class="title">
                    <div id="itemBanner" class="ell marquee-wrap"></div>
                    <!--   <marquee onMouseOut="this.start()" onMouseOver="this.stop()" data-bind="txet:titleTemp">常用常用到的两个事件</marquee> -->
                </div>
                <!-- <span id="liMarquee" class="title" >办事指南办事指南办事指南办事指南办事指南办事指南</span> -->
            </div>
        </header>
        <!-- 头部end -->

        <!--主要内容-->
        <div id="wrapper" class="flow-chart-wrap top-7 bf ">
            <div class="pinch-zoom">
                <img src="" alt="">
            </div>
        </div>
    </div>


<script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/flow-chart.js"></script>
</body>
</html>
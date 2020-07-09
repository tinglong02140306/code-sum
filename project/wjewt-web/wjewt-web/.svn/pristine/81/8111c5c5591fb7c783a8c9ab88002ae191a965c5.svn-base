<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES"/>
    <meta name="format-detection" content="telephone=no"/>
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="viewport" content="width=device-width"/>
    <title>选择办事区域</title>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/area-selection.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet"/>
</head>
<body>
    <div class="wrap my-car-wrap">  
        <!-- 头部 -->
        <header class="topic-bg hide">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
                <span class="f36 cf title">选择办事区域</span>
            </div>
        </header> 
        <!-- 主要内容 -->
        <div class="content">
            <div class="wrapper">
            </div>
        </div>
    </div>

<script id="areaTmpl" type="text/html">
    <ul>
        {{each $data as item index}}
            <li><a href="javascript:;" class="{{ if index%2 == 0 }} fl {{else}} fr {{/if}}" data-code="{{item.areaCode}}" data-name="{{item.areaName}}" data-url="{{item.detailsUrl}}">{{item.areaName}}</a></li>
        {{/each}}    
    </ul>
    
</script>

    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/area-selection.js"></script>
</body>
</html>
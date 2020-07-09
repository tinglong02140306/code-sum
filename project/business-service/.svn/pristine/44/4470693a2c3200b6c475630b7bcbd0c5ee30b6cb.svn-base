<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/remove-car-details.css" rel="stylesheet" />
    <title>申请详情</title>
</head>
<body>
<div class="wrap index-warp">
    <span class="download-url hide">${FDFS_HTTP}</span>
    <!-- 头部 start-->
    <header class="topic-bg <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">hide</c:if>">
        <div class="header-item topic-bg">
            <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
            <span class="f36 cf title">申请详情</span>
        </div>
    </header>
    <%@ include file="/WEB-INF/view/h5/wx-header.jsp"%>
    <%@ include file="/WEB-INF/view/h5/zfb-header.jsp"%>
    <!-- 头部 end -->
    <!-- 主要内容 start-->
    <div class="content-wrap top-7 <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">top-0</c:if> hide">
        <!-- 时间轴 -->
        <div class="interval-wrap"></div>
        <div class="timer-shaft clearfix">
            <div class="timer-shaft-circle">
                <span class="fl circle circle-apply"></span>
                <span class="fl apply-line"></span>
                <span class="fl circle notice-carowner"></span>
                <span class="fl notice-line no-line"></span>
                <span class="fl circle result-icon"></span>
            </div>
            <div class="fl apply-text">
                <p>提交申请</p>
                <p class="apply-time"></p>
            </div>
            <div class="fl notice-text">
                <p>通知车主</p>
                <p class="notice-time"></p>
            </div>
            <div class="fr result-text">
                <p class="result-label">挪车失败</p>
                <p class="result-time"></p>
            </div>
        </div>
        <div class="interval-wrap"></div>
        <div class="car-info">
            <div class="item car-num clearfix">
                <span class="label fl">车牌号码：</span>
                <span class="value fl"></span>
            </div>
            <div class="item address clearfix">
                <span class="label fl">所在位置：</span>
                <span class="value fl"></span>
            </div>
            <div class="item reason hide clearfix">
                <span class="label fl">挪车原因：</span>
                <span class="value fl"></span>
            </div>
            <div class="car-mes-logo hide">
            </div>
        </div>
        <div class="interval-wrap"></div>
        <div class="remove-evaluate hide">
            <div class="evaluate-title">挪车评价</div>
            <div class="interval"></div>
            <div class="evaluate-content">
                <div class="carowner-attitude">
                    <span class="label">车主态度</span>
                    <span class="value"></span>
                </div>
                 <div class="move-speed">
                    <span class="label">移车速度</span>
                    <span class="value "></span>
                </div>
                <div class="evaluate-text hide">
                    <p class="title">评价内容</p>
                    <p class="content"></p>
                </div>
            </div>
        </div>
        <!-- 时间轴end -->
    </div>
    <!-- 主要内容 end-->

</div>
<!-- 评价模板 -->
<script id="imgTmpl" type="text/html">
    {{each $data as item index}}
     <img class="img-bottom {{if index == $data.length-1}}img-bottom-none{{/if}}" src="{{item.imgUrl}}" alt="img">
    {{/each}}
</script>
<%@ include file="/WEB-INF/view/inc/footer.jsp"%>
<script type="text/javascript" src="${ctx}/resource/h5/js/remove-car-details.js"></script>
</body>
</html>
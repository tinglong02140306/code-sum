<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pre-move-car.css" rel="stylesheet" />
    <title>待挪车</title>
</head>
<body>
    <div class="wrap index-warp">
        <input class="press-time" type="hidden" name="" value="${PRESS_TIME}">
        <input class="server-time" type="hidden" name="" value="${server_timestap}">
        <!-- 头部 start-->
        <div class="top-banner bg-fir-state <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">wx-top-banner</c:if>">
            <div class="header-item topic-bg header-wrap <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">hide</c:if> ">
                <a href="javascript:void(0)" class="header-back" data-bind="click: back"></a>
                <span class="f36 cf title">待挪车</span>
            </div>
	        <%@ include file="/WEB-INF/view/h5/wx-header.jsp"%>
	        <%@ include file="/WEB-INF/view/h5/zfb-header.jsp"%>
            <!-- canvas 定时-->
            <div class="canvas-wrap">
                <div id= "canvasWrapper" class="canvas-wrapper">
                </div>
                <div class="time-explain">
                   <p class="time-text f60 cf"></p>
                   <p class="f30 cf explain-text">正在通知...</p>
                </div>
                <p class="notice-text f26 cf tc">15分钟后可催一催</p>
            </div>

           <!--  催一催第三次提示语 -->
           <div class="prompt-message hide">  <!-- 30分钟后 -->

               <!-- 小安安背景图 -->
                <span class="banner-police"></span>
                <!-- 提示语 -->
                <div class="notice-mes f26 cf">
                    <span>如果车主仍未挪车请您尝试其他方式挪车~</span>
                </div>
           </div>
            <!-- 车牌号 -->
            <p id="carNo" class="car-no hide">
                <span class="sheng"></span>
                <span class="point"></span>
                <span class="number"></span>
            </p> <!-- 车牌：湘J23456 -->
        </div> 
        <!-- 头部 end -->

        <!-- 主要内容 -->
        <div class="content-wrap <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">wx-content-wrap</c:if>">
            <div class="step-list">
            </div>
            <div class="btn-wrap flex">
                <span class="f34 cf btn-blue remove-success flex-one" data-flag="1" data-bind="click: reSuccessEvent">挪车结束</span>
                <span class="f34 cf btn-nouse btn-left flex-one" data-flag="0" data-bind="click: urgeEvent">催一催</span>
            </div>
        </div>
    </div>
    <!-- 待挪车模板start -->
    <script id="messageStepTempl" type="text/html">
    	{{each $data as item index}}
            <div class="step-item"> 
                <span class="step-bg {{if item.state == 0}} step-bg-fir {{else if item.state == 1}} step-bg-fir-line{{else if item.state == 2}} step-bg-next {{else if item.state == 3}} step-bg-end {{else if item.state == 4}}{{/if}}"></span>
                <div class="notice-mode-time {{if item.state == 0 || item.state == 1}} c4c {{else}} c96 {{/if}}">
                    <p class="notice-mode f34">{{item.eventName}}</p>
                    <p class="notice-time f24">{{item.eventTime}}</p>
                </div>
            </div> 
        {{/each}}
    </script>

    <!-- 待挪车模板end -->
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/h5/js/pre-move-car.js?ts=1222"></script>   
</body>
</html>
<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/js/plugins/mescroll/mescroll.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/remove-car-record.css" rel="stylesheet" />
    <title>挪车记录</title>
</head>
<body>
    <div class="wrap index-warp">
        <!-- 头部 start-->
        <header class="topic-bg <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">hide</c:if>">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
                <span class="f36 cf title">挪车记录</span>
            </div>
        </header>
        <!-- 头部 end -->
        <%@ include file="/WEB-INF/view/h5/wx-header.jsp"%>
        <%@ include file="/WEB-INF/view/h5/zfb-header.jsp"%>
        <!-- 主要内容 -->
        <div class="content-wrap top-7 <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">top-0</c:if>">
            <div id="wrapper" class="mescroll content">
                <div class="car-list">
                </div>
            </div> 
        </div>

        <!-- 暂无数据 -->
        <div class="empty top-7 hide">
            <div class="empty-icon"></div>
            <p>未搜索到相关内容</p>
        </div>
    </div>


    <!-- 挪车记录模板start -->
    <script id="carRecordTempl" type="text/html">
	{{each $data as item index}}
        <div class="car-item bf" data-id={{item.id}} data-driverattitude="{{item.driverAttitudeRank}}" data-driverspeed="{{item.driverSpeedRank}}" data-status="{{item.status}}">
            <div class="item-icon"></div>
            <div class="item-instruct">
                <p class="car-no-state">
                    <span class="car-no f34 c65">{{item.carPlateNum}}</span>
                    <span class="car-state f30 ca3">{{item.statusMc}}</span>
                </p>
                {{ if item.applyTime }}
                <p class="date f28 ca3">
                    <span class="date-day">{{item.applyTime}}</span>
                </p>
                {{/if}}
                {{if item.address}}
                <p class="location f28 ca3 ell">{{item.address}}</p>
                {{/if}}
            </div>
        </div>
    {{/each}}
    </script>
    <!-- 挪车记录模板end -->
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/mescroll/mescroll.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/remove-car-record.js"></script>   
</body>
</html>
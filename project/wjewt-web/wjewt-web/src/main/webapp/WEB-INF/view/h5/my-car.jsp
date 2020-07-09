<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <meta charset="UTF-8">
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES"/>
    <meta name="format-detection" content="telephone=no"/>
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="viewport" content="width=device-width"/>
    <title>我的车辆</title>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/my-car.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
</head>
<body>
    <div class="wrap my-car-wrap">  
        <!-- 头部 -->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
                <span class="f36 cf title">我的车辆</span>
            </div>
        </header> 
        <!-- 主要内容 -->
        <div class="my-car-content top-7">
            <div id="carRecord" class="my-car-list">
                   
            </div>
            <div class="my-car-add hide bf tc">
                <div class="add-icon-detail" data-bind="click: addRecordEvent">
                    <p class="add-icon"></p>
                    <p class="add-detail f36 tc cc0">添加车辆 查询违章</p>
                </div>
            </div>
        </div>
    </div>

<script id="carRecordTmpl" type="text/html">
    {{each $data as item index}}
        <div href="javascript:void(0)" class="my-car-record clearfix {{if item.messageNum !==''}} records {{else}} norecords {{/if}}" data-id="{{item.id}}" data-license="{{item.licensePlateNum}}">
            <div class="icon-num fl tc">
                <img class="car-icon tc" src="./public/wcportal/0.0.1/img/service-hall/icon-car.png">
                <p class="car-num f24 cf tc">{{item.licensePlateNum}}</p>
            </div>
            {{if item.messageNum !==''}}
            <div class="record-money-score fl">
                <p class="cf f28 records">
                    <span>{{item.messageNum}}</span>
                    <span>条新的违章记录</span>
                </p> 
                <p class="money-score clearfix">
                    <div class="moneys fl">
                        <p class="moneys-num f32 cf tl">{{item.fkje}}</p>
                        <p class="moneys-txt f24 cf tl">罚款</p>
                    </div>

                    <div class="scores fl">
                        <p class="scores-num f32 cf tl">{{item.wfjfs}}</p>
                        <p class="scores-txt f24 cf tl">扣分</p> 
                    </div>
                </p>
            </div>
            {{else}}
                <div class="no-records cf f28 fl">暂无违章信息</div>
            {{/if}}
        </div>
    {{/each}}
</script>

    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/my-car.js"></script>
</body>
</html>
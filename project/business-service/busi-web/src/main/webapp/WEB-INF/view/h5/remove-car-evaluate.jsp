<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/remove-car-evaluate.css" rel="stylesheet" />
    <title>挪车评价</title>
</head>
<body>
    <div class="wrap index-warp">
        <!-- 头部 start-->
        <header class="topic-bg <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">hide</c:if>">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
                <span class="f36 cf title">挪车评价</span>
            </div>
        </header>
        <%@ include file="/WEB-INF/view/h5/wx-header.jsp"%>
        <%@ include file="/WEB-INF/view/h5/zfb-header.jsp"%>
        <!-- 头部 end -->
        
        <!-- 主要内容 start-->
        <div class="content-wrap top-7 <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">top-0</c:if>">
            <div class="remove-status clearfix">
                <div class="flag1 fl" data-bind="click: successClick" data-index="1">
                    <p class="success-wrap">
                        <span class="success-bg select-success-bg"></span>
                        <i class="seclect-icon"></i>
                    </p>
                    <p class="success-select-label"><span>挪车成功</span></p>
                </div>
                <div class="flag2 fl" data-bind="click: failClick" data-index="0">
                    <p class="fail-wrap">
                        <span class="fail-bg"></span>
                        <i class="seclect-icon fail-type hide"></i>
                    </p>
                    <p class="fail-select-label"><span>挪车失败</span></p>
                </div> 
            </div> 
            <div class="form">
                <div class="form-item owners-attitude clearfix">
                    <div class="item-label fl">车主态度</div>
                    <div class="item-value index1 fr" data-index="0">
                    </div>
                </div>
                <div class="form-item move-speed clearfix">
                    <div class="item-label fl">挪车速度</div>
                    <div class="item-value index2 fr" data-index="1">
                    </div>
                </div>
                <div class="write-evaluate-wrap">
                    <textarea placeholder="我还有想说的……" id="evaluate" cols="5" rows="10" maxlength="200" class="write-evaluate" maxlength="200"></textarea>
                </div>
            </div>
            <div class="submit-evaluate topic-bg" data-bind="click: saveEvaluateClick">提交评价</div>
        </div>
        <!-- 主要内容 end-->
        <div class="evaluate-success mask hide">
            <div class="success-content">
                <div class='success-img'></div>
                <div class="success-tip">感谢评价</div>
            </div>
        </div>
    </div>
     <!-- 评价模板 -->
    <script id="evaluateTempl" type="text/html">
        {{each $data as item index}}
            <div class="type select-click" data-indextype='{{item.code}}'>
               <img src="${ctx}/resource/h5/images/remove-car/icon{{item.code}}{{if item.code =='3'}}_select{{/if}}.png" class="img-type{{item.code}}" alt="">
               <span class="value-style {{if item.code!='3'}}hide-opacity{{/if}}">{{item.name}}</span>
           </div>
        {{/each}}
    </script>
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/h5/js/remove-car-evaluate.js"></script>
</body>
</html>
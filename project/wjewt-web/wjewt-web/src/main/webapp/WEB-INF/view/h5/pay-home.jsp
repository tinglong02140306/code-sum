<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pay-home.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <title>公共缴费</title>
</head>
<body>
    <div class="wrap">
        <input class="config-path" type="hidden" value="${CONFIGPATH}">
        <!-- 头部 -->
        <header>
            <div class="header-item">
                <a class="header-back" data-bind="click: back" href="javascript:void(0)"></a>
                <span class="header-title ell">公共缴费</span>
            </div>
        </header>
        <!-- 头部完 -->
        <div class="home-content top-7">
            <div class="home-scan" data-bind="click: goScanPay">
                <a></a>
                <span>扫一扫</span>
            </div>

            <div class="home-idCode" data-bind="click: goIdCodePay">
                <a></a>
                <span>输入缴款识别码缴费</span>
            </div>
        </div>
    </div>
    <div class="mark">
        <div class="quit">
            <p>确定退出？</p>
            <div>
                <span data-bind="click: sure">确定</span>
                <span data-bind="click: cancel">取消</span>
            </div>
        </div>
    </div>
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/pay-home.js?ts<%=System.currentTimeMillis()%>"></script> 
</body>
</html>
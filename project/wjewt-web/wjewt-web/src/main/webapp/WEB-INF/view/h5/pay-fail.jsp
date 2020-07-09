<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pay-fail.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <title>公共缴费</title>
</head>
<body>
    <div class="wrap">
        <!-- 头部 -->
        <header>
            <div class="header-item">
                <a class="header-back" data-bind="click: back" href="javascript:void(0)"></a>
                <span class="header-title ell">缴费失败</span>
            </div>
        </header>

        <div class="main-wrap top-7">
            <div class="img-content">
                <img src="${ctx}/resource/h5/images/common/pay-fail.png" alt="fail">
            </div>
            <p class="fail-tip">
                很抱歉，支付出现异常，请稍后再试
            </p>
            <div class="pay-btn-content">
                <a href="javascript:void(0)" class="pay-btn" data-bind="click: backReset">
                    返回重试
                </a>
            </div>
        </div>
    </div>
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/h5/js/pay-fail.js?ts<%=System.currentTimeMillis()%>"></script> 
</body>
</html>
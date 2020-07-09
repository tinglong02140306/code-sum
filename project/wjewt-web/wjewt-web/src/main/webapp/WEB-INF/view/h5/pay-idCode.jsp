<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pay-idCode.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <title>公共缴费</title>
</head>
<body>
    <div class="wrap">
        <!-- 头部 -->
        <header>
            <div class="header-item">
                <a class="header-back" data-bind="click: back" href="javascript:void(0)"></a>
                <span class="header-title ell">公共缴费</span>
            </div>
        </header>
        <!-- 头部完 -->

        <div class="idCode-content">
            <input type="text" data-bind="value: idCode" placeholder="请输入20位的缴费识别码" maxlength="20" id="idCode"/>
            <button data-bind="click: submit">确定</button>
        </div>
        <div class="empty top-7 hide">
            <div class="empty-ad"></div>
            <p>暂无缴费数据~</p>
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
    <script type="text/javascript" src="${ctx}/resource/h5/js/pay-idCode.js?ts<%=System.currentTimeMillis()%>"></script> 
</body>
</html>
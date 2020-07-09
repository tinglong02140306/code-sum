<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pay-success.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <title>公共缴费</title>
</head>
<body>
   <div class="wrap">
	    <!-- 头部 -->
	    <!-- <header>
	        <div class="header-item">
	            <a class="header-back" data-bind="click: back" href="javascript:void(0)"></a>
	            <span class="header-title ell">缴费成功</span>
	            <span class="success-btn" data-bind="click: successBtn">完成</span>
	        </div>
	    </header> -->
	    <div class="main-wrap">
	        <div class="img-content">
	            <img src="${ctx}/resource/h5/images/pay/success-logo.png" alt="fail">
	        </div>
	         <p class="pay-success-money">
	           	 ￥<span data-bind="text:payData.amount"></span>
	        </p>
	        <ul class="pay-success-message">
	            <li class="pay-message-item clearfix">
	                <span class="fl">缴费识别码</span>
	                <span class="fr" data-bind="text:payData.pinCode"></span>
	            </li>
	            <li class="pay-message-item clearfix">
	                <span class="fl">缴费方式</span>
	                <span class="fr" data-bind="text:payData.payChannelName"></span>
	            </li>
	            <li class="pay-message-item clearfix">
	                <span class="fl">缴费时间</span>
	                <span class="fr" data-bind="text:payData.tradeTime"></span>
	            </li>
	        </ul>
	    </div>

	    <div class="btn-wrap">
	   		<a href="javascript:;" data-bind="click: successBtn">完成</a>
	    </div>
	</div>
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/pay-success.js?ts<%=System.currentTimeMillis()%>"></script> 
</body>
</html>
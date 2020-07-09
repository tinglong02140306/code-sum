<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/pay-detail.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
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
        <div class="content hide">
            <div class="main-wrap">
                <div class="pay-detail-first">
                    <p class="detail-title">缴款总金额（元）</p>
                    <p class="detail-money" data-bind="text:payData.amt"></p>
                    <p class="detail-message clearfix">
                        <span class="fl">缴款总金额（元）</span>
                        <span class="fr" data-bind="text:payData.amt"></span>
                    </p>
                    <p class="detail-message clearfix">
                        <span class="fl">滞纳金（元）</span>
                        <span class="fr" data-bind="text:payData.delayAmt"></span>
                    </p>
                </div>
                <div class="pay-detail-two">
                    <p class="detail-message clearfix">
                        <span class="fl">缴费识别码</span>
                        <span class="fr" data-bind="text:payData.payCode"></span>
                    </p>
                    <p class="detail-message clearfix">
                        <span class="fl">填制日期</span>
                        <span class="fr" data-bind="text:payData.billDate"></span>
                    </p>
                    <p class="detail-message clearfix">
                        <span class="fl">缴款人（单位）</span>
                        <span class="fr" data-bind="text:payData.payerName"></span>
                    </p>
                </div>
                <div class="pay-list-title">
                    <span class="title-logo"></span>
                    <p>收费详情</p>
                </div>
                <ul class="pay-list" data-template="listTempl" data-bind="source: listData">
                </ul>
            </div>
            <div class="pay-footer clearfix">
                <div class="fl pay-footer-fl">
                    需缴费金额：<span data-bind="text:payData.amt"></span>元
                </div>
                <div class="fr pay-footer-fr" data-bind="click:payBtn">立即缴费</div>
            </div>
        </div>
        <div class="empty top-7 hide">
            <div class="empty-ad"></div>
            <p>暂无缴费数据~</p>
        </div>
      
    </div>
    <script id="listTempl" type="text/html">
        {{each $data as item}}
        <li class="pay-list-item">
            <div class="clearfix">
                <span class="fl">{{item.chgItemName}}</span>
                <span class="fr">{{item.amount}}元</span>
            </div>
            <p>执收单位：<span>{{item.chgAgenName}}</span></p>
        </li>
        {{/each}}
    </script>
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/pay-detail.js?ts<%=System.currentTimeMillis()%>"></script> 
</body>
</html>
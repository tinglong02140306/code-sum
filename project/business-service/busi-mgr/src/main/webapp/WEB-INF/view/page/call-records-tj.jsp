<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html>
<head>
    <title>语音呼叫记录统计</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" href="${ctx}/resources/js/plugins/fly/default.min.css" />
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/site.css" />
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/call-records-tj.css" />
</head>
<body class="f5">
<div class="wrap">
    <div class="title-wrap"><span class="left-icon"></span>语音呼叫记录统计</div>
    <div class="tj-table clearfix">
        <div class="left-hr fl">
           <p class="title">呼入</p>
            <div class="hc-count clearfix">
                <div class="hc-ljhr fl">
                    <p class="ljhr-title">累计呼入</p>
                    <p  class="ljhr-time">0次</p>
                </div>
                <div class="hr-dyhr fr">
                    <p class="dyhr-title">当月呼入</p>
                    <p class="dyhr-time">0次</p>
                </div>
            </div>
        </div>
        <div class="right-hc fl">
            <p class="title">呼出</p>
            <div class="hc-count clearfix">
                <div class="hc-ljhr fl">
                    <p class="ljhr-title">累计呼出</p>
                    <p class="ljhr-time" ><span data-bind="text:total">0</span>次</p>
                </div>
                <div class="hr-dyhr fr">
                    <p class="dyhr-title">当月呼出</p>
                    <p class="dyhr-time"><span data-bind="text:month">0</span>次</p>
                </div>
            </div>
        </div>
    </div>
    <div class="tj-echart clearfix">
        <div id="hrqs">

        </div>
        <div id="hcqs">

        </div>
    </div>
</div>

<script src="${ctx }/resources/js/plugins/require-2.1.11.js"
        data-main="${ctx }/resources/js/apps/call-records-tj.js"></script>
</body>
</html>

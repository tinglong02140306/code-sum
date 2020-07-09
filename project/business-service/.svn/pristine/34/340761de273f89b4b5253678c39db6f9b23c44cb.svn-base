<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html>
<head>
    <title>移车申请管理-查看</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" href="${ctx}/resources/js/plugins/fly/default.min.css" />
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/site.css" />
    <link href="${ctx}/resources/js/plugins/lightbox/css/jquery.lightbox-0.5.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/remove-car-view.css" />
</head>
<body>
<div class="container">
  <!--  基本信息 start -->
    <div class="tab-title">
        <em class="tab-title-label">基本信息</em>
    </div>
    <div class="grid grid-response">
        <table class="grid-table table-detail" cellspacing="0" style="table-layout:fixed; min-width:600px;">
            <thead class="hide">
                <tr>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="bg-grey" title="申请人">申请人</td>
                    <td data-bind="text: applyInfo.applyerName, attr: {title: applyInfo.applyerName}"></td>
                    <td class="bg-grey" title="手机号码">手机号码</td>
                    <td data-bind="text: applyInfo.applyerMobile, attr: {title: applyInfo.applyerMobile}"></td>
                </tr>
                <tr>
                    <td class="bg-grey" title="订单号">申请时间</td>
                    <td data-bind="text: applyInfo.applyTime, attr: {title: applyInfo.applyTime}"></td>
                    <td class="bg-grey" title="车牌颜色">车牌颜色</td>
                    <td data-bind="text: applyInfo.carPlateTypeText, attr: {title: applyInfo.carPlateTypeText}"></td>
                </tr>
                <tr>
                    <td class="bg-grey" title="移动车辆车牌号">移动车辆车牌号</td>
                    <td data-bind="text: applyInfo.carPlateNum, attr: {title: applyInfo.carPlateNum}"></td>
                    <td class="bg-grey" title="移车地点">挪车车地点</td>
                    <td data-bind="text: applyInfo.address, attr: {title: applyInfo.address}"></td>
                </tr>


            </tbody>
        </table>
    </div>

    <div class="grid grid-response grid-pic">
        <table class="grid-table table-detail" cellspacing="0" style="table-layout:fixed; min-width:600px;">
            <thead class="hide">
                <tr>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                </tr>
            </thead>
            <tbody>
                <tr class="lheight" style="height: 120px;">
                    <td width=25% class="bg-grey" title="现场图片">现场图片</td>
                    <td width=75% class="pic-preview-td">
                        <div id="backImg" class="pic-preview clearfix" data-bind="source: picList" data-template="imgTmpl"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!--  基本信息 start -->

    <!-- 挪车评价 start-->
    <div class="tab-title">
        <em class="tab-title-label">挪车评价</em>
    </div>
    <div class="grid grid-response">
        <table class="grid-table table-detail" cellspacing="0" style="table-layout:fixed; min-width:600px;">
            <thead class="hide">
                <tr>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="bg-grey" title="车主态度">车主态度</td>
                    <td data-bind="text: applyInfo.driverAttitudeRankText, attr: {title: applyInfo.driverAttitudeRankText}"></td>
                    <td class="bg-grey bo-border" title="挪车速度">挪车速度</td>
                    <td class="bo-border" data-bind="text: applyInfo.driverSpeedRankText, attr: {title: applyInfo.driverSpeedRankText}"></td>
                </tr>
                <tr>
                    <td class="bg-grey" title="评价内容">评价内容</td>
                    <td width=75%  colspan="3" data-bind="text: applyInfo.evaluateContent, attr: {title: applyInfo.evaluateContent}"></td>
                </tr>
                
            </tbody>
        </table>
    </div>
    <!-- 挪车评价 end-->

    <!-- 挪车评价 start-->
    <div class="tab-title">
        <em class="tab-title-label">挪车信息</em>
    </div>
    <div class="grid grid-response">
        <table class="grid-table table-detail" cellspacing="0" style="table-layout:fixed; min-width:600px;">
            <thead class="hide">
                <tr>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                    <th width=25%></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="bg-grey" title="挪车状态">挪车状态</td>
                    <td data-bind="text: applyInfo.statusMc, attr: {title: applyInfo.statusMc}"></td>
                    <td class="bg-grey bo-border" title="短信送达状态">短信/电话送达状态</td>
                    <td class="bo-border" data-bind="text: applyInfo.msgTelText, attr: {title: applyInfo.msgTelText}"></td>
                </tr>

                <tr>
                    <td class="bg-grey" title="车主姓名">车主姓名</td>
                    <td data-bind="text: applyInfo.driverName, attr: {title: applyInfo.driverName}"></td>
                    <td class="bg-grey bo-border" title="车主手机号码">车主手机号码</td>
                    <td class="bo-border" data-bind="text: applyInfo.driverMobile, attr: {title: applyInfo.driverMobile}"></td>
                </tr>
                <tr>
                    <td class="bg-grey" title="短信内容">短信内容</td>
                    <td width=75% colspan="3"  data-bind="text: msgTask.eventContent, attr: {title: msgTask.eventContent}"></td>  
                </tr>

                
                
            </tbody>
        </table>
    </div>
    <!-- 挪车评价 end-->
</div>
    

<!-- 图片预览 -->
<script id="imgTmpl" type="text/html">
    {{each $data as item index}}
    <a class="img-list" href="{{item.filePath}}" rel="lightbox-backImg">
        <img class="feedback-img" src="{{item.filePath}}" alt="" />
    </a>
    {{/each}}
</script>


<script id="gridTmpl" type="text/html">
    {{each $data as item i}}
    <tr>
        <td><div class="ell" title="{{item.payNo}}">{{item.payNo}}</div></td>
        <td><div class="ell" title="{{item.matterName}}">{{item.matterName}}</div></td>
        <td><div class="ell" title="{{item.payItemName}}">{{item.payItemName}}</div></td>
        <td><div class="ell" title="{{item.payFullMoney}}">{{item.payFullMoney}}</div></td>
        <td><div class="ell" title="{{item.overdueFine}}">{{item.overdueFine}}</div></td>
        <td><div class="ell" title="{{item.payMoney}}">{{item.payMoney}}</div></td>
    </tr>
    {{/each}}
</script>

<script src="${ctx }/resources/js/plugins/require-2.1.11.js"
        data-main="${ctx }/resources/js/apps/remove-car-view.js"></script>
</body>
</html>

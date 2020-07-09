<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>账号管理-查看</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/resources/css/account.css'/>" />
</head>
<body>
    <div class="location">
        <span>账号管理</span>
    </div>
    <div class="container account-container container-frame">
        <!-- 新增、编辑 -->
        <div class="tab-title">
            <em class="tab-title-icon"></em>
            <em class="tab-title-label">账号信息</em>
        </div>
        <form id="accountInfo">
            <div class="col-xs-12">
                <div class="row">
                    <!-- 行政区划 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>行政区划</label>
                            </span>
                            <input name="division" data-role="textbox" data-bind="value: form.division, enabled: viewEnabled" type="text">
                            <!-- <input type="text" data-role="dropdownlist" data-bind="source: divisionSource, value: form.division,enabled: viewEnabled" name="division"> -->
                        </div>
                    </div>
                    <!-- 执收单位 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>执收单位</label>
                            </span>
                            <input name="deptName" data-role="textbox" data-bind="value: form.deptName,enabled: viewEnabled" type="text">
                        </div>
                    </div>
                    <!-- 执收单位代码 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>执收单位代码</label>
                            </span>
                            <input name="deptCode" data-role="textbox" data-bind="value: form.deptCode,enabled: viewEnabled" type="text">
                        </div>
                    </div>
                    <!-- 收费类型 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>收费类型</label>
                            </span>
                            <input type="text" data-role="dropdownlist" data-bind="source: chargeTypeSource, value: form.chargeType,enabled: viewEnabled" name="chargeType">
                        </div>
                    </div>
                    <!-- 账户类型 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>账户类型</label>
                            </span>
                            <input name="accountType" data-role="dropdownlist" data-bind="source: accountTypeSource, value: form.accountType,enabled: viewEnabled" type="text" >
                        </div>
                    </div>
                    <!-- 收费账号 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>收费账号</label>
                            </span>
                            <input name="account" data-role="textbox" data-bind="value: form.account,enabled: viewEnabled" type="text">
                        </div>
                    </div>

                    <!-- 账户名称 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>账户名称</label>
                            </span>
                            <input name="accountName" data-role="textbox" data-bind="value: form.accountName,enabled: viewEnabled" type="text">
                        </div>
                    </div>

                    <!-- 开户银行 -->
                    <div class="col-xs-4" data-bind="visible: bankVis">
                        <div class="form-control">
                            <span class="label">
                                <label>开户银行</label>
                            </span>
                            <input name="bankName" data-role="dropdownlist" data-bind="source: bankNameSource, value: form.bankName,enabled: viewEnabled" type="text" >
                        </div>
                    </div>

                    <!-- 开户行地址 -->
                    <div class="col-xs-8" data-bind="visible: bankVis">
                        <div class="form-control">
                            <span class="label">
                                <label>开户行地址</label>
                            </span>
                            <input name="bankAddr" data-role="textbox" data-bind="value: form.bankAddr,enabled: viewEnabled" type="text">
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <!-- 是否定时启用 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>是否定时启用</label>
                            </span>
                            <div id="intervalEnable" class="siglesel"
                                 data-role="siglesel"
                                 data-multi=false
                                 data-bind="source: intervalEnableSource,value: form.intervalEnable, events:{change: switchEvent}">
                            </div>
                        </div>
                    </div>

                    <!-- 启用时间 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>启用时间</label>
                            </span>
                            <input type="text" data-role="datepicker" data-option-label="请选择启用日期" name="enableTime" data-format="yyyy-MM-dd HH:mm:ss" data-bind="events:{change:changeCall}, value: form.enableTime,enabled: viewEnabled"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <!-- 申请 -->
        <div class="tab-title">
            <em class="tab-title-icon"></em>
            <em class="tab-title-label">申请信息</em>
        </div>
        <div class="col-xs-12 col-xs-mt">
            <div class="row row-label">
                <div class="col-xs-1">申请人：</div>
                <div class="col-xs-2"><span class="ell" data-bind="text: form.applicant,attr:{title: form.applicant}"></span></div>
                <div class="col-xs-1">联系电话：</div>
                <div class="col-xs-2"><span data-bind="text: form.applicantsTel,attr:{title: form.applicantsTel}"></span></div>
                <div class="col-xs-1">申请日期：</div>
                <div class="col-xs-2"><span class="ell" data-bind="text: form.applyTime,attr:{title: form.applyTime}"></span></div>
            </div>
        </div>
       
        <!-- 审核 -->
        <div class="tab-title">
            <em class="tab-title-icon"></em>
            <em class="tab-title-label">审核信息</em>
        </div>
        <div class="col-xs-12 col-xs-mt">
            <div class="row row-label">
                <div class="col-xs-1">审核意见：</div>
                <div class="col-xs-11"><span class="ell" data-bind="text: form.approveNote,attr:{title: form.approveNote}"></span></div>
            </div>
            <div class="row row-label">
                <div class="col-xs-1">审核人：</div>
                <div class="col-xs-2"><span class="ell" data-bind="text: form.approvePerson,attr:{title: form.approvePerson}"></span></div>
                <div class="col-xs-1">联系电话：</div>
                <div class="col-xs-2"><span class="ell" data-bind="text: form.approvePersonTel,attr:{title: form.approvePersonTel}"></span></div>
                <div class="col-xs-1">审核日期：</div>
                <div class="col-xs-2"><span class="ell" data-bind="text: form.approveDate,attr:{title: form.approveDate}"></span></div>
            </div>
        </div>

        <!-- 账号版本 -->
        <div class="tab-title">
            <em class="tab-title-icon"></em>
            <em class="tab-title-label">账号版本</em>
        </div>
        <div class="grid grid-response grid-mt20" style="overflow-x:auto">
            <table class="grid-table grid-table-fixed" cellspacing="0" style="table-layout:fixed; min-width:1024px;">
                <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="100">账号编码</th>
                        <th>收费账号</th>
                        <th>账户名称</th>
                        <th>开户银行</th>
                        <th>收费类型</th>
                        <th>账号类型</th>
                        <th class="account-name" width="100">开户行地址</th>
                        <th>状态</th>
                        <th>申请人</th>
                        <th width="70">申请日期</th>
                        <th>审核人</th>
                        <th width="70">审核日期</th>
                        <th>版本</th>
                    </tr>
                </thead>
                <tbody id="tbodyEmpty" data-bind="source: accountSource" data-template="accountTmpl"></tbody>
            </table>
        </div>
       
        <!-- 按钮 -->
        <div class="col-xs-12">
            <div class="row btns-center">
                <button class="btn btn-base btn-save" data-bind="click: backEvent" type="button" title="返回">返回</button>
            </div>
        </div>
    </div>

<script type="text/html" id="accountTmpl">
    {{each $data as item}}
    <tr>
        <td><div class="ell" title="{{item._index}}">{{item._index}}</div></td>
        <td><div class="ell" title="{{item.accountCode}}">{{item.accountCode}}</div></td>
        <td><div class="ell" title="{{item.account}}">{{item.account}}</div></td>
        <td><div class="ell" title="{{item.accountName}}">{{item.accountName}}</div></td>
        <td><div class="ell" title="{{item.bankName_}}">{{item.bankName_}}</div></td>
        <td><div class="ell" title="{{item.chargeTypeName}}">{{item.chargeTypeName}}</div></td>
        <td><div class="ell" title="{{item.accountTypeName}}">{{item.accountTypeName}}</div></td>
        <td><div class="ell account-name" title="{{item.bankAddr}}">{{item.bankAddr}}</div></td>
        <td><div class="ell" title="{{item.statusName}}">{{item.statusName}}</div></td>
        <td><div class="ell" title="{{item.applicant}}">{{item.applicant}}</div></td>

        <td><div class="ell" title="{{item.applyTime | dateFormatter}}">{{item.applyTime | dateFormatter}}</div></td>
        <td><div class="ell" title="{{item.approvePerson}}">{{item.approvePerson}}</div></td>
        <td><div class="ell" title="{{item.approveDate | dateFormatter}}">{{item.approveDate | dateFormatter}}</div></td>
        <td><div class="ell" title="{{item.version}}">{{item.version}}</div></td>
    </tr>
    {{/each}}
</script>

<script src="${ctx }/resources/js/plugins/require-2.1.11.js" data-main="${ctx }/resources/js/apps/account-manage/account-opt-view.js"></script>
</body>
</html>
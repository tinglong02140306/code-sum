<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>账号管理-新增/编辑/审核</title>
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
                            <input name="division" data-role="textbox" data-bind="value: form.division, enabled: editEnabled" type="text">
                            <!-- <input type="text" data-role="dropdownlist" data-bind="source: divisionSource, value: form.division, enabled: editEnabled" name="division"> -->
                        </div>
                    </div>
                    <!-- 执收单位 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>执收单位</label>
                            </span>
                            <input name="deptName" data-role="textbox" data-bind="value: form.deptName, enabled: editEnabled" type="text">
                        </div>
                    </div>
                    <!-- 执收单位代码 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>执收单位代码</label>
                            </span>
                            <input name="deptCode" data-role="textbox" data-bind="value: form.deptCode, enabled: editEnabled" type="text">
                        </div>
                    </div>
                    <!-- 收费类型 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required">* </i>收费类型</label>
                            </span>
                            <input type="text" data-role="dropdownlist" data-bind="source: chargeTypeSource, value: form.chargeType, enabled: checkEnabled" name="chargeType">
                        </div>
                    </div>
                    <!-- 账户类型 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>账户类型</label>
                            </span>
                            <input name="accountType" data-role="dropdownlist" data-bind="source: accountTypeSource, value: form.accountType, enabled: checkEnabled,events:{change: changeAccountEvent}" type="text" >
                        </div>
                    </div>
                    <!-- 收费账号 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required">* </i>收费账号</label>
                            </span>
                            <input name="account" data-role="textbox" data-bind="value: form.account, enabled: checkEnabled" type="text">
                        </div>
                    </div>

                    <!-- 账户名称 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required">* </i>账户名称</label>
                            </span>
                            <input name="accountName" data-role="textbox" data-bind="value: form.accountName, enabled: checkEnabled" type="text">
                        </div>
                    </div>

                    <!-- 开户银行 -->
                    <div id="bankName" class="col-xs-4" data-bind="visible: bankVis">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required">* </i>开户银行</label>
                            </span>
                            <input name="bankName" data-role="dropdownlist" data-bind="source: bankNameSource, value: form.bankName, enabled: checkEnabled" type="text" >
                        </div>
                    </div>

                    <!-- 开户行地址 -->
                    <div class="col-xs-8" data-bind="visible: bankVis">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required">* </i>开户行地址</label>
                            </span>
                            <input name="bankAddr" data-role="textbox" data-bind="value: form.bankAddr, enabled: checkEnabled" type="text">
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
                                 data-bind="source: intervalEnableSource,value: form.intervalEnable, enabled: checkEnabled, events:{change: switchEvent}">
                            </div>
                        </div>
                    </div>

                    <!-- 启用时间 -->
                    <div id="enableTime" class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label><i class="required" data-bind="visible: timeVis">* </i>启用时间</label>
                            </span>
                            <input type="text" data-role="datepicker" data-option-label="请选择启用日期" name="enableTime" data-format="yyyy-MM-dd HH:mm:ss" data-bind="events:{change:changeCall}, value: form.enableTime, enabled: timingEnabled"/>
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
        <form id="applyInfo">
            <!-- 表单展示区域 -->
            <div class="col-xs-12">
                <div class="row">
                    <!-- 申请人 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>申请人</label>
                            </span>
                            <input name="applicant" data-role="textbox" data-bind="value: form.applicant, enabled: editEnabled" type="text">
                        </div>
                    </div>
                    <!-- 联系电话 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>联系电话</label>
                            </span>
                            <input name="applicantsTel" data-role="textbox" data-bind="value: form.applicantsTel, enabled: checkEnabled" type="text">
                        </div>
                    </div>
                    <!-- 申请日期 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>申请日期</label>
                            </span>
                            <input type="text" data-role="datepicker" name="applyTime" data-format="yyyy-MM-dd" data-bind="events:{change:changeCall}, value: form.applyTime, enabled: checkEnabled"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        
        <!-- 审核 -->
        <div class="tab-title" data-bind="visible: checkVis">
            <em class="tab-title-icon"></em>
            <em class="tab-title-label">审核信息</em>
        </div>
        <form id="checkInfo" data-bind="visible: checkVis">
            <div class="col-xs-12">
                <div class="row">
                    <!-- 审核意见 -->
                    <div class="col-xs-12">
                        <div class="form-control">
                            <span class="label">
                                <label>审核意见</label>
                            </span>
                            <textarea type="text" name="approveNote" data-bind="value: form.approveNote"></textarea>
                        </div>
                    </div>
                    <!-- 审核人 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>审核人</label>
                            </span>
                            <input name="approvePerson" data-role="textbox" data-bind="value: form.approvePerson, enabled: checkEnabled" type="text">
                        </div>
                    </div>
                    <!-- 联系电话 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>联系电话</label>
                            </span>
                            <input name="approvePersonTel" data-role="textbox" data-bind="value: form.approvePersonTel" type="text">
                        </div>
                    </div>
                    <!-- 审核日期 -->
                    <div class="col-xs-4">
                        <div class="form-control">
                            <span class="label">
                                <label>审核日期</label>
                            </span>
                            <input type="text" data-role="datepicker" name="approveDate" data-format="yyyy-MM-dd" data-bind="events:{change:changeCall}, value: form.approveDate, enabled: checkEnabled"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    
        <!-- 按钮组 -->
        <div class="col-xs-12">
            <!-- 新增、编辑 -->
            <div class="row btns-center" data-bind="invisible: checkVis">
                <button class="btn btn-base btn-submit" data-bind="click: submitEvent, enabled: addBtnEnabled" type="button" title="提交">提交</button>
                <button class="btn btn-base btn-save" data-bind="click: saveEvent, enabled: addBtnEnabled" type="button" title="暂存">暂存</button>
            </div>

            <!-- 审核 -->
            <div class="row btns-center" data-bind="visible: checkVis">
                <button class="btn btn-base btn-submit" data-bind="click: passEvent, enabled: checkBtnEnabled" type="button" title="同意">同意</button>
                <button class="btn btn-base btn-save" data-bind="click: backEvent, enabled: checkBtnEnabled" type="button" title="打回">打回</button>
            </div>
        </div>
    </div>
    
    <input type="hidden" value="${user.organization.xzqhId}" name="xzqh">
    <input type="hidden" value="${user.organization.code}" name="code">
    <input type="hidden" value="${user.organization.name}" name="organization">
    <input type="hidden" value="${user.user.name}" name="name">
    <input type="hidden" value="${user.userDetail.mobilePhone}" name="mobilePhone">

<script src="${ctx }/resources/js/plugins/require-2.1.11.js" data-main="${ctx }/resources/js/apps/account-manage/account-opt.js"></script>
</body>
</html>
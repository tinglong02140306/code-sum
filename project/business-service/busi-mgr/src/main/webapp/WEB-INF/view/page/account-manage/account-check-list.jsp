<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>账号审核</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/account.css" />
</head>
<body>
    <div class="location">
        <span>账号审核</span>
    </div>
    <div class="page-wraper container-frame">
        <div class="account-search-area">
            <form id="myform">
                <div class="col-xs-10">
                    <div class="row">
                       <!--  <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>行政区划</label>
                                </span>
                                <input type="text" 
                                data-role="dropdownlist" 
                                name="division"
                                data-option-label="全部"
                                data-bind="source: divisionDate, value: form.division"
                                />
                            </div>
                        </div> -->
                      <!--   <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>执收单位:</label>
                                </span>
                                <input type="text" 
                                data-role="dropdownlist" 
                                name="deptName"
                                data-bind="source: deptNameDate, value: form.deptName"
                                />
                            </div>
                        </div> -->
                        <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>收费类型</label>
                                </span>
                                <input type="text" 
                                data-role="dropdownlist" 
                                name="chargeType"
                                data-option-label="全部"
                                data-bind="source: chargeTypeDate, value: form.chargeType"
                                />
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>收费账号</label>
                                </span>
                                <input type="text" 
                                data-role="textbox" 
                                placeholder="请输入" 
                                name="account"
                                data-bind="value: form.account"
                                />
                            </div>
                        </div>
                    
                        <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>开户银行</label>
                                </span>
                                <input type="text" 
                                data-role="dropdownlist" 
                                name="bankName"
                                data-option-label="全部"
                                data-bind="source: bankNameDate, value: form.bankName"
                                />
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <div class="form-control form-control">
                                <span class="label">
                                    <label>状态</label>
                                </span>
                                <input type="text" 
                                data-role="dropdownlist" 
                                name="status"
                                data-option-label="全部"
                                data-bind="source: statusDate, value: form.status"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="col-xs-2">
                 <button class="btn btn-primary btn-search btn-fr" data-bind="click: searchEvent">搜索</button>
            </div>
        </div>

        <div class="account-search-result">
            <div class="list-title">
                <span class="title">账号管理</span>
                <!-- <button class="add-btn" type="button" data-bind="click: addEvent">新增</button> -->
            </div>
            <div class="grid grid-response"  style="overflow-x:auto">
                <table class="grid-table grid-table-fixed" cellspacing="0" style="table-layout:fixed; min-width:1024px;">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th>账号编码</th>
                            <th>收费账号</th>
                            <th class="account-name">账号名称</th>
                            <th>开户银行</th>
                            <th>收费类型</th>
                            <th>执收单位</th>
                            <th>行政区划</th>
                            <th>版本</th>
                            <th>状态</th>
                            <th width="150">操作</th>
                        </tr>
                    </thead>
                    <tbody id="templateInfo" data-bind="source: gridDataSource" data-template="gridItemFrist"></tbody>
                </table>
            </div>
            <div data-role="pagination" data-show-switch="false" data-bind="source: gridDataSource"></div>
        </div>
    </div>

    <!-- 表格模板 -->
    <script id="gridItemFrist" type="text/html">
        {{each $data as item i}}
        <tr>
            <td><div class="ell" title="{{item._index}}">{{item._index}}</div></td>
            <td><div class="ell" title="{{item.accountCode}}">{{item.accountCode}}</div></td>

            <td><div class="ell" title="{{item.account}}">{{item.account}}</div></td>
            <td><div class="ell account-name" title="{{item.accountName}}">{{item.accountName}}</div></td>
            <td><div class="ell" title="{{item.bankName_}}">{{item.bankName_}}</div></td>
            <td><div class="ell" title="{{item.chargeTypeName}}">{{item.chargeTypeName}}</div></td>
            <td><div class="ell" title="{{item.deptName}}">{{item.deptName}}</div></td>
            <td><div class="ell" title="{{item.division}}">{{item.division}}</div></td>
            <td><div class="ell" title="{{item.version}}">{{item.version}}</div></td>
            <td><div class="ell {{if item.status == '1'}} blue {{else if item.status == '2'}} orange {{else if item.status == '3'}} yellow {{else if item.status == '4'}} green {{else if item.status == '5'}} red {{/if}}" title="{{item.statusName}}">{{item.statusName}}</div></td>
            <td>
                <button class="view-btn" type="button" data-bind="click: viewEvent">查看</button>
                {{if item.status == '1' || item.status == '5'}}
                <button class="check-btn un-btn" type="button" data-bind="click: checkEvent,enabled:false">审核</button>
                {{else if item.status == '3'}}
                <button class="start-btn" type="button" data-bind="click: startEvent">启用</button>
                {{else if item.status == '4'}}
                <button class="start-btn" type="button" data-bind="click: forbidEvent">禁用</button>
                {{else}}
                <button class="check-btn" type="button" data-bind="click: checkEvent">审核</button>
                {{/if}}
            </td>

        </tr>
        {{/each}}
    </script>
    <script src="${ctx }/resources/js/plugins/require-2.1.11.js"
            data-main="${ctx }/resources/js/apps/account-manage/account-check-list.js"></script>
</body>
</html>
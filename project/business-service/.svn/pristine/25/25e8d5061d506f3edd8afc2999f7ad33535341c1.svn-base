<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html>
<head>
    <title>语音呼叫记录</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" href="${ctx}/resources/js/plugins/fly/default.min.css" />
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/site.css" />
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/remove-car-list.css" />
</head>
<body class="f5">
<div class="wrap">
    <div class="location clearfix ">
        <div class="title fl">
            <span class="label">当前位置 :</span>
            <span>业务管理</span>&nbsp;&gt;&nbsp;
            <span>挪车管理</span>&nbsp;&gt;&nbsp;
            <span>语音呼叫记录/span>&nbsp;&gt;&nbsp;

        </div>
        <div class="triangle fl"></div>
    </div>

    <div class="form-div clearfix">
        <form id="queryForm" class="query-form fl">
            <div class="row">
                <div class="col-xs-6">
                    <div class="form-control form-control">
                            <span class="label">
                                <label>挪车车牌</label>
                            </span>
                        <input type="text"
                               data-role="textbox"
                               name="plateNum"
                               data-bind="value:query.plateNum"

                        />
                    </div>
                </div>

                <div class="col-xs-6">
                    <div class="form-control">
                            <span class="label">
                                <label>状态</label>
                            </span>
                        <input type="text"
                               data-role="dropdownlist"
                               name="state"
                               data-option-label="全部"
                               data-text-field="name"
                               data-value-field="code"
                               data-bind="source: statusSource, value: query.state"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-6 ">
                    <div class="date-range form-control">
                            <span class="label">
                                <label>呼叫时间</label>
                            </span>
                        <div class="datapicker-range-wrap">
                            <input id="startDate"
                                   class="col-ml-6"
                                   type="text"
                                   name="beginTime"
                                   data-role="datepicker"
                                   data-format="yyyy-MM-dd HH:mm:ss"
                                   data-max-date="#endDate"
                                   data-bind="value:query.beginTime"
                            />

                            <div class="date-split">&nbsp;-&nbsp;</div>

                            <input id="endDate"
                                   class="col-mr-6"
                                   type="text"
                                   name="endTime"
                                   data-role="datepicker"
                                   data-format="yyyy-MM-dd HH:mm:ss"
                                   data-min-date="#startDate"
                                   data-bind="value:query.endTime"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="form-btn-group fl">
            <a class="btn query-btn" data-bind="click: search">搜索</a>
        </div>
    </div>

    <div class="result-div clearfix">

        <div class="grid"  style="overflow-x:auto">

            <table class="grid-table" cellspacing="0">
                <thead>
                <tr>
                    <th class="first" width="60" field="index">序号</th>
                    <th width="120">挪车车牌</th>
                    <th width="120">申请人账号</th>
                    <th width="120">申请时间</th>
                    <th width="120">呼出时间</th>
                </tr>
                </thead>
                <tbody  id="grid" data-bind="source: gridDataSource" data-template="gridItem" data-item-change="false"> </tbody>
            </table>
        </div>
        <div data-role="pagination" data-show-switch="false" data-bind="source: gridDataSource"></div>
    </div>
</div>


<script id="gridItem" type="text/html">
    {{each $data as item index}}
    <tr class="odd {{if index==($data.length - 1)}}last{{/if}}">
        <td class="ell first" >{{index+1}}</td>
        <td class="ell" title="{{item.plateNum}}" >{{item.plateNum}}</td>
        <td class="ell" title="{{item.applyer}}">{{item.applyer}}</td>
        <td class="ell" title="{{item.applyTime}}">{{item.applyTime}}</td>
        <td class="ell" title="{{item.createTime}}">{{item.createTime}}</td>
    </tr>
    {{/each}}
</script>


<script src="${ctx }/resources/js/plugins/require-2.1.11.js"
        data-main="${ctx }/resources/js/apps/call-records.js"></script>
</body>
</html>

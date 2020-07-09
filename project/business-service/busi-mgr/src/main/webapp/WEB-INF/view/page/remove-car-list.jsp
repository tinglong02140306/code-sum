<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html>
<head>
    <title>移车申请管理</title>
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
                <span>挪车申请管理</span>
            </div>
            <div class="triangle fl"></div>
        </div>

        <div class="form-div clearfix">
            <form id="queryForm" class="query-form fl">
                <div class="row">
                    <div class="col-xs-6">
                        <div class="form-control form-control">
                            <span class="label">
                                <label>申请账号</label>
                            </span>
                            <input type="text" 
                            data-role="textbox" 
                            name="account"
                            data-bind="value:query.applyerMobile"
                            
                            />
                        </div>
                    </div>

                    <div class="col-xs-6">
                        <div class="form-control">
                            <span class="label">
                                <label>挪车状态</label>
                            </span>
                            <input type="text" 
                            data-role="dropdownlist" 
                            name="status"
                            data-option-label="全部"
                            data-text-field="name"
                            data-value-field="code"
                            data-bind="source: statusSource, value: query.status" 
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 ">
                        <div class="date-range form-control">
                            <span class="label">
                                <label>申请时间</label>
                            </span>
                            <div class="datapicker-range-wrap">
                                <input id="startDate"
                                class="col-ml-6"
                                type="text"
                                data-role="datepicker" 
                                data-format="yyyy-MM-dd HH:mm:ss"
                                data-max-date="#endDate"
                                data-bind="value:query.applyTimeBegin"
                                />

                                <div class="date-split">&nbsp;-&nbsp;</div>

                                <input id="endDate"
                                   class="col-mr-6"
                                   type="text" 
                                   data-role="datepicker" 
                                   data-format="yyyy-MM-dd HH:mm:ss"
                                   data-min-date="#startDate"
                                   data-bind="value:query.applyTimeEnd"
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

                <div class="grid-title clearfix">
                    <h2 class="fl">挪车申请列表</h2>
                    <a class="btn add-btn fr" data-bind="click: exportEvent">导出</a>
                </div>

                <table class="grid-table" cellspacing="0">
                    <thead>
                        <tr>
                            <th class="first" width="60" field="index">序号</th>
                            <th width="120">挪车地点</th>
                            <th width="120">申请人账号</th>
                            <th width="120">申请时间</th>
                            <th width="120">完成时间</th>
                            <th width="120">挪车耗时</th>
                            <th width="120" >状态</th>
                            <th width="120" >操作</th>
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
            <td class="ell" title="{{item.address}}" >{{item.address}}</td>
            <td class="ell" title="{{item.applyerMobile}}">{{ if item.applyerMobile }} {{item.applyerMobile}} {{else}} - {{/if}}</td>
            <td class="ell" title="{{ if item.applyTime }} {{item.applyTime}} {{else}} - {{/if}}">{{ if item.applyTime }} {{item.applyTime}} {{else}} - {{/if}}</td>
            <td class="ell" title="{{ if item.lastUpdateTime }} {{item.lastUpdateTime}} {{else}} - {{/if}}">{{ if item.lastUpdateTime }} {{item.lastUpdateTime}} {{else}} - {{/if}}</td>
            <td class="ell" title="{{ if item.spendTime }} {{item.spendTime}} {{else}} - {{/if}} ">{{ if item.spendTime }} {{item.spendTime}} {{else}} - {{/if}}</td>
            <td class="ell" title="{{item.statusMc}}">{{item.statusMc}}</td>
            <td class="ell">
                <a class="op-btn" href="javascript:void(0)" title="查看" data-bind="click: viewEvent" data-id={{item.id}}>查看</a>
            </td>             
        </tr> 
    {{/each}} 
</script>


<script src="${ctx }/resources/js/plugins/require-2.1.11.js"
        data-main="${ctx }/resources/js/apps/remove-car-list.js"></script>
</body>
</html>

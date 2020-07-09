<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
     <title>挪车设置</title>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/meta.jsp"%>
    <%@ include file="/WEB-INF/view/inc/lib.jsp"%>
    <link rel="stylesheet" href="${ctx}/resources/js/plugins/fly/default.min.css" />
    <%--<link rel="stylesheet" href="${ctx}/resources/js/plugins/flyui/1.0.4/css/flyui.min.css" />--%>
    <link href="${ctx}/resources/css/reset.css" rel="stylesheet">
    <link href="${ctx}/resources/css/site.css" rel="stylesheet">
    <link href="${ctx}/resources/css/remove-car-set.css" rel="stylesheet">
</head>
<body>
<div class="wrap  remove-car-set hide">
    <div class="location clearfix ">
        <div class="title fl">
            <span class="label">当前位置 :</span>
            <span>业务管理</span>&nbsp;&gt;&nbsp;
            <span>挪车管理</span>&nbsp;&gt;&nbsp;
            <span>挪车设置</span>
        </div>
        <div class="triangle fl"></div>
    </div>
    <div class="result-div">
        <div class="title-wrap">
            <h2 class="title">挪车设置</h2>
        </div>
        <div class="content">
            <div class="row-item clearfix">
                <div class="label fl"><span>服务启动时间：</span></div>
                <div class="value fl">
                    <span>每日</span>
                    <div class="service-label">
                        <span class="service-begin" ></span>
                        <span>&nbsp;-&nbsp;</span>
                        <span class="service-end"></span> 
                    </div>
                    <div class="service-edit hide">
                        <input class="Wdate" id="serviceBegin" type="text" onClick="WdatePicker({el:this,dateFmt:'HH:mm',maxDate:'#F{$dp.$D(\'serviceEnd\')}'});" data-bind="value: form.SERVICE_BEGIN"/>
                        <span class="interval">&nbsp;-&nbsp;</span>
                        <input class="Wdate" id="serviceEnd" type="text" onClick="WdatePicker({el:this,dateFmt:'HH:mm',minDate:'#F{$dp.$D(\'serviceBegin\')}'});" data-bind="value: form.SERVICE_END"/>
                    </div>

                    <label class="bttn save-btn service-btn" data-index="0" >编辑</label>
                </div>
            </div>
             <div class="row-item tel clearfix">
                <div class="label fl"><span>电话挪车启用时间：</span></div>
                <div class="value fl">
                    <div>
                        <span>每日</span>
                        <div class="tel-label">
                            <span class="tel-begin" ></span>
                            <span>&nbsp;-&nbsp;</span>
                            <span class="tel-end"></span>
                        </div>
                        <div class="tel-edit hide">
                            <input class="Wdate" id="telBegin" type="text" onClick="WdatePicker({el:this,dateFmt:'HH:mm',minDate:'#F{$dp.$D(\'serviceBegin\')}',maxDate:'#F{$dp.$D(\'telEnd\')}'});" data-bind="value: form.TEL_BEGIN"/>
                            <span class="interval">&nbsp;-&nbsp;</span>
                            <input class="Wdate" id="telEnd" type="text" onClick="WdatePicker({el:this,dateFmt:'HH:mm',maxDate:'#F{$dp.$D(\'serviceEnd\')}',minDate:'#F{$dp.$D(\'telBegin\')}'});" data-bind="value: form.TEL_END"/>
                        </div>
                    </div>
                    <label class="bttn save-btn tel-btn" data-index="0" >编辑</label>
                </div>
            </div>
            <div class="row-item clearfix press">
                <div class="label fl"><span>催一催时间间隔：</span></div>
                <div class="value fl">
                    <span>挪车申请发出</span>
                    <div class="press-label">
                        <span class="press-num"></span>
                    </div>
                    <div class="press-edit hide">
                         <input type="text" 
                            data-role="dropdownlist"
                            name="PRESS_TIME"
                            data-index="1" 
                            data-option-label="false"
                            data-bind="value: form.PRESS_TIME, source: pressList"
                            />
                            <span class="minus">分钟</span>
                    </div>
                    <label class="bttn save-btn press-btn" data-index="0">编辑</label>
                </div>
            </div>
             <div class="row-item clearfix press limit">
                <div class="label fl"><span>每日可挪车次数：</span></div>
                <div class="value fl">
                    <span>每日可挪车</span>
                    <div class="limit-label">
                        <span class="limit-num"></span>
                    </div>
                    <div class="limit-edit hide">
                         <input type="text" 
                            data-role="dropdownlist"
                            name="LIMIT_NUM"
                            data-index="0" 
                            data-option-label="false"
                            data-bind="value: form.LIMIT_NUM, source: limitList"
                            />
                            <span class="minus">次</span>
                    </div>
                    <label class="bttn save-btn limit-btn" data-index="0">编辑</label>
                </div>
            </div>
        </div>
    </div> 
    
	
</div>


<script src="${ctx }/resources/js/plugins/require-2.1.11.js"
            data-main="${ctx }/resources/js/apps/remove-car-set.js"></script>
</body>
</html>

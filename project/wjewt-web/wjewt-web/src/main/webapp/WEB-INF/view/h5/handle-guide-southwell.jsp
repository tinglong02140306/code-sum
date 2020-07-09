<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="format-detection" content="telephone=no" />
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/handle-guide-southwell.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title></title>
</head>
<body>
    <div class="wrap handle-guide-wrap">
        <!-- 头部start -->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <a class="header-back back" data-bind="click: back" href="javascript:void(0)"></a>
                <div id="liMarquee" class="title">
                    <div id="itemBanner" class="ell marquee-wrap"></div>
                    <!--<marquee onMouseOut="this.start()" onMouseOver="this.stop()" data-bind="txet:titleTemp">常用常用到的两个事件</marquee> -->
                </div>

                <span class="share-btn hide"></span>
            </div>
        </header>
        <!-- 头部end -->

        <!--主要内容-->
        <div id="wrapper" class="handle-wrap top-7 bf">
        </div>
    </div>

    <!-- 暂无数据 -->
    <div class="empty top-7 hide">
        <div class="empty-ad"></div>
        <p>暂无数据哦~</p>
    </div>
    <!-- 指南详情模版 -->
    <script id="handleTmpl" type="text/html">
        {{if according}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">行使依据</p>
                <p class=" f30 c3 step-items-content">{{according}}</p>
            </div>
        </div>
        {{/if}}

        {{if applyterm}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">受理条件</p>
                <p class=" f30 c3 step-items-content">{{applyterm}}</p>
            </div>
        </div>
        {{/if}}



        {{if infoname && file_path}}
        <div class="step-items-wrap" href="javascript:void(0)" data-path="{{file_path}}" data-infoname="{{infoname}}">
            <div class="step-items">
                <p class="f26 c6 step-items-title">权力运行流程图</p>
                <a class=" f30 c3 step-items-content underline" data-path="{{file_path}}" data-infoname="{{infoname}}">{{infoname}}</a>
            </div>
        </div>
        {{/if}}

        {{if materialLists}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">申请材料</p>
                {{each $data.materialLists as value index}}
                <p class=" f30 c3 step-items-content">{{value}}</p>
                {{/each}}
            </div>
        </div>
        {{/if}}

        {{if procedure}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">办理流程</p>
                <p class=" f30 c3 step-items-content">{{procedure}}</p>
            </div>
        </div>
        {{/if}}

        {{if lawlimitinfo}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">法定期限</p>
                <p class=" f30 c3 step-items-content">{{lawlimitinfo}}</p>
            </div>
        </div>
        {{/if}}

        {{if promisdayinfo}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">承诺办件期限</p>
                <p class=" f30 c3 step-items-content">{{promisdayinfo}}</p>
            </div>
        </div>
        {{/if}}

        {{if chargetype}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">收费标准及依据</p>
                <p class=" f30 c3 step-items-content">{{chargetype}}</p>
            </div>
        </div>
        {{/if}}

        {{if deptname}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">办理部门</p>
                <p class=" f30 c3 step-items-content">{{deptname}}</p>
            </div>
        </div>
        {{/if}}

        {{if accepttime}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">办理时间</p>
                <p class=" f30 c3 step-items-content">{{accepttime}}</p>
            </div>
        </div>
        {{/if}}

        {{if contactphone}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">咨询电话</p>
                <p class=" f30 c3 step-items-content">{{contactphone}}</p>
            </div>
        </div>
        {{/if}}

        {{if monitorcomplain}}
        <div class="step-items-wrap" href="javascript:void(0)">
            <div class="step-items">
                <p class="f26 c6 step-items-title">监督电话</p>
                <p class=" f30 c3 step-items-content">{{monitorcomplain}}</p>
            </div>
        </div>
        {{/if}}
    </script>


<script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/handle-guide-southwell.js"></script>
</body>
</html>

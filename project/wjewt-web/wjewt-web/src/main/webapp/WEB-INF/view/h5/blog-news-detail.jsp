<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES"/>
    <meta name="format-detection" content="telephone=no"/>
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="viewport" content="width=device-width"/>
    <title>皖警便民服务e网通</title>
    <script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.min.js"></script>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/mui-pre-pic/mui.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/mui-pre-pic/mui-preview-pic.css" rel="stylesheet" />
    <!-- <link href="${ctx}/resource/js/plugins/share/share.css" rel="stylesheet" /> -->
    <!-- <link href="${ctx}/resource/h5/share.css" rel="stylesheet" /> -->
    <link href="${ctx}/resource/h5/css/blog-news-detail.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet"/>
</head>
<body>
    <div id="downWrap" class="down-wrap hide">
        <a href="javascript:void(0)" class="down-content"></a>
        <i id="deleteIcon" class="delete-icon"></i>
    </div>

    <div id="wrap" class="wrap bf hide">  
        <!-- 头部 -->
        <header class="topic-bg">
              <div class="header-item topic-bg">
                  <a href="javascript:void(0)" class="header-back" data-bind="click: back"></a>
                  <a href="javascript:void(0)" class="title-pic c2b">
                     <i class=" f28 c2b title">微博正文</i>
                 </a>
              </div>
        </header> 

        <div class="download-cont hide">
            <img class="content-download-logo fl" src="${ctx}/resource/h5/images/share/logo-icon.png">
            <div class="content-download-word fl">
                <p class="content-download-title">皖警便民服务e网通</p>
                <p class="content-download-text">安徽公安便民服务官方app</p>
            </div>
            <a href="javascript:void(0)" id="openApp" class="content-download-button fr" data-type="blog">打开APP</a>
        </div> 
        
        <div class="content bf">
            <div id ="blogContent" class="blog-news-content">
           </div>
        </div>
        <div id="share"></div>
    </div>

    <!-- 暂无数据 -->
    <div id="sorry" class="empty hide ptop">
        <header>
            <div class="header-item topic-bg">
                <a class="header-back back" data-bind="click: back" href="javascript:void(0)"></a>
                <span class="ell">警微热点详情</span>
                <label class="header-share" href="javascript:void(0)"></label>
            </div>
        </header>
        <div class="sorry-warp">
            <div class="empty-ad"></div>
            <p>没有找到您要访问的页面</p>
            <div class="refresh-btn" data-bind="click: refreshClick">刷新</div>
            <div class="close-btn" data-bind="click: back">关闭</div>
        </div>
    </div>
<!-- 警徽热点 -->
<script id="blogTmpl" type="text/html">
    {{each $data as item index}}
        <div class="blog-news-item">
            <!-- 主要内容模块 -->
            <div class="item-content">
                <p class="article-sec f32 c3"></p>
                {{if item.appendixType == 1}} <!--  appendixType 1 图片 2视频 -->
                    <div class="img-list  img-list{{index}} unloaded flex" data-imgarr="{{item.imgList}}">
                        {{each item.appendixList as list i}}
                            <div class="img-item img-item-btom {{if item.appendixList.length == 1}}img-item-one {{else if item.appendixList.length == 4}} img-item-two {{if i%2 == 1 }} img-item-two-mar {{/if}} {{else if item.appendixList.length > 1 && item.appendixList.length != 4}} img-item-three {{if i%3 != 0}} img-item-mar {{/if}} {{/if}}" data-index="{{i}}"><img src="{{list}}" class="lazy" data-original="{{list}}" data-preview-src="" data-preview-group="1"></div>
                        {{/each}}
                    </div>
                 {{else if item.appendixType == 2}}
                    <div class="vedio-unit" data-detailid="{{item.detailsId}}" data-name="{{item.wbName}}">
                        <span></span>
                        <img src="{{item.appendixAddress}}">
                    </div>
                {{/if}}
            </div>
        </div> 
    {{/each}}
</script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.zoom.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.previewimage.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/blog-news-detail.js?t=<%=System.currentTimeMillis()%>"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/open-app.js?t=<%=System.currentTimeMillis()%>"></script>
</body>
</html>
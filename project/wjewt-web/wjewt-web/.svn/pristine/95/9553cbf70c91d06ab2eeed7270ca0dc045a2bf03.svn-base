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
    <title>警微热点-详情</title>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/share/share.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/blog-news-detail.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet"/>
</head>
<body>
    <div id="wrap" class="wrap bf">  
            <!-- 头部 -->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="header-back" data-bind="click: back"></a>
                <a href="javascript:void(0)" class="title-pic">
                   <i class="my-photos hide">
                       <img class="unloaded" src="" alt="">
                   </i>
                   <i class="f28 c2b title" data-bind="text: formData.wbName"></i>
               </a>
            </div>
        </header>   
        
        <div class="content top-7 bf">
            <div id ="blogContent" class="blog-news-content">
           </div>
        </div>
    </div>
    <!-- 暂无数据 -->
    <div class="empty top-7 hide">
        <div class="empty-ad"></div>
        <p>暂无数据~</p>
    </div>
    <share data-bind="source: OP"></share>

    <!-- 警徽热点 -->
    <script id="blogTmpl" type="text/html">
        {{each $data as item index}}
            <div class="blog-news-item">
                <!-- 主要内容模块 -->
                <div class="item-content">
                    <p class="article-sec f32 c3">{{item.content}}</p>
                    {{if item.appendixType == 1}} <!--  appendixType 1 图片 2视频 -->
                        <div class="img-list  img-list{{index}} unloaded flex">
                            {{each item.appendixList as list i}}
                                <div class="img-item img-item-btom {{if item.appendixList.length == 1}}img-item-one {{else if item.appendixList.length > 1 && item.appendixList.length <= 4}} img-item-two {{if i%2 == 1 }} img-item-mar {{/if}} {{else if item.appendixList.length > 4}} img-item-three {{if i%3 != 0}} img-item-mar {{/if}} {{/if}}" ><img class="lazy" data-original="{{list}}"></div>
                            {{/each}}
                        </div>
                    {{else if item.appendixType == 2}}
                        <div class="chimee-container" data-vediourl="{{item.appendixAddress}}">
                            <video tabindex="-1"></video>
                        </div>
                    {{/if}}
                </div>
                <!-- 分享、喜欢、点赞按钮 -->
                <div class="btn-wrap c8e">
                    <!-- 分享图标 -->
                    <a href="javascript:;" class="btn-share f28" data-id="{{item.id}}" data-title="{{item.title}}" data-img="{{item.wbImageUrl}}">
                        <span class="icon"></span>
                        <span class="num">{{item.shareCount}}</span>
                    </a>
                    <!-- 收藏图标 -->
                    <!-- <a href="javascript:;" class="btn-collect f28"  data-id="{{item.id}}" data-collect="{{item.collection}}">
                        <span class="icon"></span>
                        <span class="num">{{item.collectionCount}}</span> 
                    </a> -->
                    <!-- 点赞图标 -->
                    <a href="javascript:;" class="btn-praise f28" data-id="{{item.id}}" data-prise="{{item.prise}}">
                        <span class="icon"></span>
                        <span class="num">{{item.priseCount}}</span>
                    </a>   
                </div>
            </div> 
        {{/each}}
    </script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly_zomm_img.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/blog-news-detail.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/open-app.js"></script>
</body>
</html>
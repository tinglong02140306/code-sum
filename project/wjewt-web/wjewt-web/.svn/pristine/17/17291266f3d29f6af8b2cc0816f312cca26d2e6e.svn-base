<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ include file="/WEB-INF/view/inc/taglibs.jsp" %>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES"/>
    <meta name="format-detection" content="telephone=no"/>
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0"/>
    <script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.min.js"></script>
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet"/>
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet"/>
    <link href="${ctx}/resource/js/plugins/share/share.css" rel="stylesheet"/>
    <link href="${ctx}/resource/h5/css/news-list.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet"/>
    <link href="${ctx}/resource/h5/css/news-detail.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet"/>
    <link href="${ctx}/resource/js/plugins/mescroll/mescroll.min.css?t=<%=System.currentTimeMillis()%>"
          rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title>皖警便民服务e网通</title>
</head>
<body>

<div class="wrap hide">
    <!-- 头部 start -->
    <header>
        <div class="header-item news-top-bg">
            <a class="news-header-back back" data-bind="click: back" href="javascript:void(0)"></a>
            <span class="ell title-text">资讯详情</span>
        </div>
    </header>
    <!-- 头部 end -->
    <div class="download-cont">
        <img class="content-download-logo fl" src="${ctx}/resource/h5/images/share/logo-icon.png">
        <div class="content-download-word fl">
            <p class="content-download-title">皖警便民服务e网通</p>
            <p class="content-download-text">安徽公安便民服务官方app</p>
        </div>
        <a href="javascript:void(0)" id="openApp" class="content-download-button fr">打开APP</a>
    </div>
    <!-- 查询资讯结果 start -->
    <div class="news-view top-7">
        <div id="wrapper">
            <div class="news-area">
                <!-- 资讯详情start -->
                <div class="news-main"></div>
                <!-- 资讯详情end -->

                <!-- 推荐详情-推荐资讯start -->
                <!-- 网警头条 -->
                <div class="home-news" id="relativeContent">
                    <div class="title-wrap clearfix">
                        <div class="title-name fl">相关推荐</div>
                    </div>
                    <div class="home-notify-content">
                        <ul class="news-list city-news">
                        </ul>
                    </div>
                </div>
                <!-- 推荐详情-推荐资讯end -->

                <!-- 评论start -->
                <div class="news-comment hide">
                    <div class="title-wrap clearfix common-border">
                        <div class="title-name fl">评论</div>
                    </div>
                    <div class="home-notify-content">
                        <ul class="news-comment-ul">
                        </ul>
                    </div>
                </div>
                <!-- 评论end -->
            </div>
        </div>
    </div>
</div>
<div id="sorry" class="empty hide ptop">
    <header>
        <div class="header-item">
            <a class="header-back back" data-bind="click: back" href="javascript:void(0)"></a>
            <span class="ell">资讯详情</span>
            <label class="header-share" href="javascript:void(0)"></label>
        </div>
    </header>
    <div class="sorry-warp hide top-7">
        <div class="empty-ad"></div>
        <p>没有找到您要访问的页面</p>
        <div class="refresh-btn" data-bind="click: refreshClick">刷新</div>
        <div class="close-btn" data-bind="click: back">关闭</div>
    </div>
</div>
<!-- 视频弹出层 -->
<div class="vedio-pop"></div>
<!-- 搜索结果模板start -->
<script id="newsDetailTempl" type="text/html">
    <div class="news-title">{{title}}</div>
    <div class="news-item ell clearfix">
        {{if infoSource}}
        <span class="news-item-source ell">来源: {{infoSource}}</span>
        {{/if}}
        {{if releaseDate}}
        <span class="news-item-time">发布时间: {{releaseDate}}</span>
        {{/if}}
    </div>
    {{if multimediaUrl!=''&&multimediaType=='0'}}
    {{if multimediaSource=='0'}}
    <div class="video-content">
        <video class="news-video" src="{{multimediaUrl}}" controls="controls" poster="{{thumbnailUrl}}"></video>
    </div>
    {{else}}
    <div class="video-content line-video">
    </div>
    {{/if}}
    {{else if multimediaUrl!='' && multimediaType=='1'}}
    <div class="video-content">
        {{if multimediaSource=='0'}}
        <audio controls="controls">
            <source src="{{multimediaUrl}}" type="audio/mpeg">
            Your browser does not support the audio tag.
        </audio>
    </div>
    {{else}}
    <a class="jump-url" href="{{multimediaUrl}}">点击跳转音频地址</a>
    {{/if}}
    {{/if}}
    <div class="news-content">{{content}}</div>
    <div class="news-item other">
        {{if address}}
        <p class="address">
            <span class="news-item-source">活动地点: {{address}}</span>
        </p>
        {{/if}}
        {{if hdtime}}
        <p class="address">
            <span class="news-item-source">活动时间: {{hdtime}}</span>
        </p>
        {{/if}}
    </div>
</script>
<!-- 搜索结果模板end -->
<!-- 第三方视频页面 -->
<script id="urlTmpl" type="text/html">
    <div class="full-bg"></div>
    <div class="url-wrapper">
        <iframe src='{{src}}'></iframe>
    </div>
</script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/mescroll/mescroll.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
<script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/news-detail.js?ts<%=System.currentTimeMillis()%>"></script>
<script type="text/javascript" src="${ctx}/resource/h5/js/open-app.js"></script>
</body>
<script id="commentTmpl" type="text/html">
    {{each $data as item index}}
    <li>
        <div class="score-way-content" class="common-border" data-id="{{item.commentId}}" data-title="{{item.fromUser}}"
             data-fromUserName="{{item.fromUserName}}">
            <img src="{{item.fromUserImage}}"
                 onerror="javascript:this.src=CONTEXTPATH+'/resource/h5/images/my/default-photo.png';"
                 class="fl people-first">
            <div class="score-way-detail">
                <span class="comment-nikename f28 c6">{{item.fromUserName}}</span>
                <p class="comment-time f28 c6">{{item.createTime}}</p>
                <p class="comment-content f30 c0 three-ell">{{item.content}}</p>
            </div>
        </div>

        <div class="comment-child {{if item.replyList.length == 0}}hide{{/if}}">
            {{if item.replyList && item.replyList.length != 0}}
            <ul class="comment-child-ul">
                {{each item.replyList as replyitem i}}
                <li>
                    <div class="score-way-item" data-id="{{replyitem.replyId}}" data-title="{{replyitem.fromUser}}"
                         data-fromUserName="{{replyitem.fromUserName}}">
                        <img src="{{replyitem.fromUserImage}}"
                             onerror="javascript:this.src=CONTEXTPATH+'/resource/h5/images/my/default-photo.png';"
                             class="people-second">
                        <div class="score-way-detail">
                            <span class="comment-nikename f26 c6">{{replyitem.fromUserName}}</span>
                            <p class="comment-time f26 c6">{{replyitem.createTime}}</p>
                            <p class="comment-content f28 c0 three-ell">{{replyitem.content}}</p>
                        </div>
                    </div>
                </li>
                {{/each}}
            </ul>
            <P class="child-more-text {{if item.realChildren <= 3}}hide{{/if}}" data-collection="{{item.replyListData}}"
               data-index="{{index}}">查看更多（<span class="child-more-num">{{item.realChildren-3}}</span>）</P>
            {{/if}}
        </div>

    </li>
    {{/each}}

</script>

<!-- 推荐资讯 -->
<script id="notifyTmpl" type="text/html">
    {{each $data as item index}}
    {{if item.tag == 1}}
    <li class="unloaded {{if item.visited}}visited{{/if}}" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}"
        data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
        <a class="news-banner flex type{{item.tag}}" >
            <div class="ul-content flex-one">
                <p class="recommend-ul-theme two-ell">{{item.title}}</p>
                <p class="news-info clearfix"><span class="resource ell fl">{{item.infoSource}}</span><span
                        class="time ell fl">{{item.releaseTime}}</span></p>
            </div>
            <img src="{{item.imgUrl1}}">
        </a>
    </li>
    {{else if item.tag == 0}}
    <li class="unloaded {{if item.visited}}visited{{/if}}" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}"
        data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
        <a class="type{{item.tag}}" href="javascript:void(0)">
            <p class="recommend-ul-theme two-ell">{{item.title}}</p>
            {{if item.content}}<p class="news-content two-ell">{{item.content}}</p>{{/if}}
            <p class="news-info clearfix"><span class="resource ell fl">{{item.infoSource}}</span><span
                    class="time ell fl">{{item.releaseTime}}</span></p>
        </a>
    </li>
    {{else}}
    <li class="unloaded {{if item.visited}}visited{{/if}}" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}"
        data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
        <a class="type{{item.tag}}" href="javascript:void(0)">
            <p class="recommend-ul-theme two-ell">{{item.title}}</p>
            <div class="img-list flex">
                <div class="img-item flex-one"><img src="{{item.imgUrl1}}"></div>
                <div class="img-item flex-one"><img src="{{item.imgUrl2}}"></div>
                <div class="img-item flex-one"><img src="{{item.imgUrl3}}"></div>
            </div>
            <p class="news-info clearfix"><span class="resource ell fl">{{item.infoSource}}</span><span
                    class="time ell fl">{{item.releaseTime}}</span></p>
        </a>
    </li>
    {{/if}}
    {{/each}}
</script>
<script>
    var CONFIG = {
        path: '../resource/h5/',
        appName: '皖警便民服务e网通 ',
        // serviceAddress: 'http://wewt.ahga.gov.cn:8082/wjewt/'
        //serviceAddress: 'http://192.168.57.177:8300/wjewt/'
        serviceAddress: 'http://61.191.24.229:5069/wjewt/'
    };

    CONFIG.newsDetail = CONFIG.serviceAddress + 'h5/news-detail.do';
    CONFIG.shareFile = CONFIG.serviceAddress + 'h5/share.do';
    CONFIG.shareImg = CONFIG.serviceAddress + 'resource/h5/images/share/logo.png';
</script>
</html>
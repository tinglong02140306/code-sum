<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
    <%@ include file="/WEB-INF/view/inc/wx-header.jsp"%>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="format-detection" content="telephone=no" />
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.min.js"></script>
    <link href="${ctx}/resource/js/plugins/mescroll/mescroll.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/swiper/swiper.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/mui-pre-pic/mui.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/mui-pre-pic/mui-preview-pic.css??ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/news-list.css?ts<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title>警网头条</title>
</head>
<body>
    <div class="wrap">
    	<div id="downWrap" class="down-wrap hide">
			<a href="javascript:void(0)" class="down-content"></a>
			<i id="deleteIcon" class="delete-icon"></i>
		</div>
        <!-- 查询资讯结果 start -->
        <div id="wrapper" class="news-view">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <!-- 推荐 -->
                    <div id="recommNews" class="swiper-slide" data-index="0">
                        <div id="wrapper0" class="mescroll recom-wrapper">
                            <!-- recomWrapper wrapper -->
                            <section class="home-news">
                                <div class="home-notify-content">
                                    <ul id="dataList0" class="city-news recom-news news-list">
                                    </ul>
                                    <div class="no-line hide">网络无法连接，请检查您的网络</div>
                                </div>
                            </section>
                        </div>
                        <!-- 暂无数据 -->
                        <div class="empty empty0 top-7 hide">
                            <div class="empty-ad"></div>
                            <p>暂无数据~</p>
                        </div>
                    </div>
                    <!-- 本地 -->
                    <div id="localNews" class="swiper-slide de-tab-graph" data-index="1">
                        <div id="wrapper1" class="mescroll local-wrapper">
                            <!-- localWrapper -->
                            <section class="home-news">
                                <div class="home-notify-content">
                                    <ul id="dataList1" class="city-news local-news news-list">
                                    </ul>
                                    <div class="no-line hide">网络无法连接，请检查您的网络</div>
                                </div>
                            </section>
                        </div>
                        <!-- 暂无数据 -->
                        <div class="empty empty1 top-7 hide">
                            <div class="empty-ad"></div>
                            <p>暂无数据~</p>
                        </div>
                    </div>
                    <!--警微热点-->
                    <div id="blogNews" class="swiper-slide" data-index="2">
                        <div id="wrapper2" class="mescroll blog-wrapper">
                            <div id="dataList2" class="blog-news-content city-news">
                            </div>
                        </div>
                        <!-- 暂无数据 -->
                        <div class="empty empty2 top-7 hide">
                            <div class="empty-ad"></div>
                            <p>暂无数据~</p>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
       <!--  <div class="empty hide">
           <div class="empty-ad"></div>
           <p>暂无数据~</p>
       </div> -->
        <!-- 查询资讯结果 end -->
    </div>
    <!-- 搜索结果模板start -->
    <script id="newsTempl" type="text/html">
	{{each $data as item index}}
    {{if item.tag == 1}}
    <li class="unloaded" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}" data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
        <a class="news-banner flex type{{item.tag}}" data-id="{{item.id}}" href="javascript:void(0)">
            <div class="ul-content flex-one">
                <p class="recommend-ul-theme two-ell">{{item.title}}</p>
                <p class="news-info clearfix"><span class="resource resource-one ell fl">{{item.infoSource}}</span><span class="num num-one fl">{{item.clickCount}}条浏览</span><span class="time ell time-one fl">{{item.releaseDate}}</span></p>
            </div>
            <img class="lazy" data-original="{{item.imgUrl1}}" src="{{item.imgUrl1}}">
        </a>
    </li>
    {{else if item.tag == 0}}
    <li class="unloaded" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}" data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
        <a class="type{{item.tag}}" data-id="{{item.id}}" href="javascript:void(0)">
            <p class="recommend-ul-theme two-ell">{{item.title}}</p>
            {{if item.content}}<p class="news-content two-ell">{{item.content}}</p>{{/if}}
            <p class="news-info clearfix"><span class="resource ell fl">{{item.infoSource}}</span><span class="num fl ell">{{item.clickCount}}条浏览</span><span class="time fl ell">{{item.releaseDate}}</span></p>
        </a>
    </li>
    {{else}}
        <li class="unloaded" data-id="{{item.id}}" data-url="{{item.appLinkUrl}}" data-type="{{item.type}}" data-title="{{item.title}}"
        data-img="{{item.imgUrl1}}">
            <a class="type{{item.tag}}" data-id="{{item.id}}" href="javascript:void(0)">
                <p class="recommend-ul-theme two-ell">{{item.title}}</p>
                <div class="img-list flex">
                    <div class="img-item flex-one"><img class="lazy" data-original="{{item.imgUrl1}}" src="{{item.imgUrl1}}"></div>
                    <div class="img-item flex-one"><img class="lazy" data-original="{{item.imgUrl2}}" src="{{item.imgUrl2}}"></div>
                    <div class="img-item flex-one"><img class="lazy" data-original="{{item.imgUrl3}}" src="{{item.imgUrl3}}"></div>
                </div>
                <p class="news-info clearfix"><span class="resource ell fl">{{item.infoSource}}</span><span class="num fl ell">{{item.clickCount}}条浏览</span><span class="time fl ell">{{item.releaseDate}}</span></p>
            </a>
        </li>
    {{/if}}
    {{/each}}
    </script>
    <!-- 搜索结果模板end -->

    <!-- 警徽热点 start-->
    <script id="blogTmpl" type="text/html">
        {{each $data as item index}}
        <div class="blog-news-item" data-id="{{item.id}}" data-wbname="{{item.wbName}}" data-weburl="{{item.wbImageUrl}}" data-type="{{item.appendixType}}">
            <!-- 主要内容模块 -->
            <div class="item-content" data-id="{{item.id}}" data-wbname="{{item.wbName}}" data-weburl="{{item.wbImageUrl}}">
                <p class="item-header" data-id="{{item.id}}" data-wbname="{{item.wbName}}" data-weburl="{{item.wbImageUrl}}">
                    <img src="{{item.wbImageUrl}}" alt="" class="my-photo">
                    <span class="item-title f28">{{item.wbName}}</span>
                    <span class="item-date f22 c9">{{item.releaseTime}}</span>
                </p>
                <p class="article-sec f32" data-id="{{item.id}}" data-wbname="{{item.wbName}}" data-weburl="{{item.wbImageUrl}}">
                    <span class="c3 content-text content-text{{item.multiple}}">{{item.content}}</span>
                    <span class="full-text {{if item.notFull}} hide {{/if}}" data-id="{{item.id}}" data-wbname="{{item.wbName}}" data-weburl="{{item.wbImageUrl}}">全文</span>
                </p>
                {{if item.appendixType == 1}}
                <!--  appendixType 1 图片 2视频 -->
                <div id="imgList{{item.multiple}}" class="mui-content-padded img-list blog-img-list img-list{{index}} unloaded flex" data-index="{{item.multiple}}" data-imgarr="{{item.imgList}}">
                    {{each item.appendixList as list i}}
                    <div class="img-item img-item-btom {{if item.appendixList.length == 1}}img-item-one {{else if item.appendixList.length == 4}} img-item-two {{if i%2 == 1 }} img-item-two-mar {{/if}} {{else if item.appendixList.length > 1 && item.appendixList.length != 4}} img-item-three {{if i%3 != 0}} img-item-mar {{/if}} {{/if}}" data-index="{{i}}"><img src="{{list}}" data-preview-src="" data-preview-group="{{item.multiple}}"></div>
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
    <!-- 警徽热点 end-->

    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/mescroll/mescroll.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/swiper/swiper.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/gps-convert.js"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=FPTNyn1QvwkNGaX86RGSDAjL">
    </script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.zoom.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/mui-pre-pic/mui.previewimage.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js?ts<%=System.currentTimeMillis()%>"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/news-list.js?ts<%=System.currentTimeMillis()%>"></script>    
</body>
</html>
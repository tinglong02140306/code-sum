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
    <link href="${ctx}/resource/js/plugins/swiper/swiper.min.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/base.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/all.css" rel="stylesheet" />
    <link href="${ctx}/resource/js/plugins/share/share.css" rel="stylesheet" />
    <link href="${ctx}/resource/h5/css/handle-guide.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title></title>
</head>
<body>
<div class="wrap">
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
    <div class="three-layers-content top-7" style="background-color: #FFFFFF">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div id="guide" class="swiper-slide ">
                    <div class="bgcfff pd25">
                        <div id="guide-sltj" class="hide">
                            <div class="c9d">受理条件</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="sltj">
                            </div>
                        </div>
                        <div id="guide-sfsf" class="hide">
                            <div class="c9d mgt5">是否收费</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="sfsf"></div>
                        </div>
                        <div id="guide-sfbz" class="hide">
                            <div class="c9d mgt5">收费标准</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="sfbz"></div>
                        </div>
                        <div id="guide-cnbjsx" class="hide">
                            <div class="c9d mgt5">承诺办结期限</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="cnbjsx"></div>
                        </div>
                        <div id="guide-blxs" class="hide">
                            <div class="c9d mgt5">办理形式</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="blxs"></div>
                        </div>
                        <div id="guideBldd" class="hide">
                            <div class="c9d mgt5">办理地点</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="bldd"></div>
                        </div>
                        <div id="guide-yybl" class="hide">
                            <div class="c9d mgt5">预约办理</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="yybl"></div>
                        </div>
                        <div id="guide-blsj" class="hide">
                            <div class="c9d mgt5">办理时间</div>
                            <div class=" bde5 bd-top-none bd-right-none bd-left-none mgt5" id="blsj"></div>
                        </div>
                        <div id="guide-zxdh" class="hide bd-top-none bd-right-none bd-left-none bde5">
                            <div class="c9d mgt5">咨询电话</div>
                        </div>
                        <div id="guide-jddh" class="hide bde5 bd-top-none bd-right-none bd-left-none">
                            <div class="c9d mgt5">监督电话</div>
                        </div>
                        <div id="guide-wlkd" class="hide">
                            <div class="c9d mgt5">物流快递</div>
                            <a class="mgt5" id="wlkd"></a>
                        </div>
                    </div>
                </div>
                <div id="graph" class="swiper-slide de-tab-graph">
                    <!--必要-->
                    <ul id="materialTempWrap" style="padding-top: 0.5rem"></ul>
                </div>
                <!--办事咨询-->
                <div id="evaluate" class="swiper-slide">
                    <!--常见问题-->
                    <div class="details-sx">
                        <table class="fixed-table-line2">
                            <thead>
                            <tr>
                                <th width=""></th>
                                <th width="100%"></th>
                                <th width=""></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                </td>
                                <td>
                                    <div class="label-module-title " style="color: #4c72ff">常见问题</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <ul id="questionTempWrap"></ul>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</div>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/swiper/swiper.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/handle-guide.js"></script>


</body>
</html>
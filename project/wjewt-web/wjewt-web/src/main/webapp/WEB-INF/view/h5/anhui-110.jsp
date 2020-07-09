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
    <link href="${ctx}/resource/h5/css/anhui-110.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title></title>
</head>
<body>
    <div class="wrap jmhd">
        <div class="top-banner">
            <a class="back" href="javascript:void(0)" data-bind="click: back"></a>
        </div>
        <div class="service-list clearfix">
            <div class="title-wrap ">
                <div class="title-name">报警求助</div>
            </div>
            <div class="call-help-content"></div>
            
               <%-- <a class="service-item" href="javascript:void(0)" data-url="http://jhyj.ahga.gov.cn/eweb/jmt/chat.json" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/call-police.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要报警</p>
                </a>
                <a class="service-item" href="javascript:void(0)" data-url="http://jhyj.ahga.gov.cn/eweb/jmt/alarm.json " >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/self-service-alarm.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">自助报警</p>
                </a>
                <a class="service-item" href="javascript:void(0)" data-url="http://jhyj.ahga.gov.cn/eweb/jmt/chat.json" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/automatic-unlocking.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">自助开锁</p>
                </a>--%>
                
        </div>
        <div class="service-interval interval-f5"></div>
        <div class="service-list service-list-two clearfix">
            <div class="title-wrap ">
                <div class="title-name">江淮义警</div>
            </div>
            <div class="righteous-police"></div>
            <%--<a class="service-item" href="javascript:void(0)" data-url="" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/report.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要举报</p>
            </a>
             <a class="service-item" href="javascript:void(0)" data-url="" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/escape.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要追逃</p>
            </a>
             <a class="service-item" href="javascript:void(0)" data-url="" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/break-case.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要破案</p>
            </a>
             <a class="service-item" href="javascript:void(0)" data-url="" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/is-vigilante.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要当义警</p>
            </a>
             <a class="service-item" href="javascript:void(0)" data-url="" >
                    <div class="home-app-img">
                        <div class="download">
                            <div class="home-tag-holder">
                                <div class="download-progress">
                                    <div class="fliter"></div>
                                    <div class="progress-info">
                                        <p>58%</p>
                                        <div class="progress">
                                            <div class="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <img src="${ctx}/resource/h5/images/anhui-110/contribution.png">
                            </div>
                        </div>
                    </div>
                    <p class="ell">我要贡献</p>
            </a>--%>
           
    </div>
    <!-- app入口模板 -->
    <script id="appTmpl" type="text/html">
        {{each $data as item i}}
        <a class="service-item" href="javascript:void(0)" data-id="{{item.id}}" data-url="{{item.info}}" data-type="{{item.androidDetail.serviceAddrType}}">
            <div class="home-app-img">
                <div class="download">
                    <div class="home-tag-holder">
                        <div class="download-progress">
                            <div class="fliter"></div>
                            <div class="progress-info">
                                <p>58%</p>
                                <div class="progress">
                                    <div class="progress-bar"></div>
                                </div>
                            </div>
                        </div>
                        <img src="{{item.iconUrl}}">
                    </div>
                </div>
            </div>
            <p class="ell">{{item.serviceName}}</p>
        </a>
        {{/each}}
    </script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/share/share.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/anhui-110.js"></script>

</body>
</html>
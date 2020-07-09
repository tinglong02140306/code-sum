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
    <link href="${ctx}/resource/h5/css/index.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" />
    <script type="text/javascript" src="${ctx}/resource/js/plugins/remCacul/remCacul.js"></script>
    <title>智能客服</title>
</head>
<body>	
	<!-- start -->
    <div class="wrap">
    	<!-- 头部start -->
       <header class="topic-bg">
           <div class="header-item topic-bg">
               <a class="header-back back" data-bind="click: back" href="javascript:void(0)"></a>
               <span class="ell">智能客服</span>
           </div>
       </header>
       <!-- 头部end -->
        <section>
            <div id = "wrapper" class="content">
                <div class="content-scroll" data-template="interllignetTmpl"  data-bind="source: listData"></div>
            </div>
        </section>
        <!-- 提示语 start -->
        <p class="tip"><span>您可以用语音进行沟通，比如您可以问</span><span class="topic-fc">“如何办理社保？”</span></p>
        <!-- 提示语 end -->
        <div class="footer-content clearfix">
        	<div class="footer-input-wrapper clearfix">
        		<a class="voice-btn" data-bind="click: voiceClick" href="javascript:void(0)"></a>
        		<input class="footer-input" type="text" />
        		<a class="send-btn" data-bind="click: sendEvent" href="javascript:void(0)">发送</a>
        	</div>
        	<!-- 底部语音 start -->
	        <footer id="container-ios9" class="voice-content hide">
	            <canvas id="myCanvas" class="hide"></canvas>
	            <div class="voice" data-bind="click: startVoice"><p class="box tc">点击说话</p></div>
	            <!-- <div class="voice"><p class="box tc">点击说话</p></div> -->
	            <div class="distinguish-voice hide">
	                <p class="box tc">正在识别</p>
	                <i></i>
	                <div class="rotate-voice"></div>
	            </div>
	            <div class="line hide"></div>
	        </footer>
       		<!-- 底部语音 end -->
        </div>
    </div>
    <!-- 智能客服end -->

    <!-- 智能客服模板satrt -->
    <script id="interllignetTmpl" type="text/html">
        {{each $data as item index}}  
            {{if item.status}}    
                <div class="assistant flex ">
                    <div class="head-picture"></div>
                    <div class="cont">
                        <p>{{#item.content}}</p>
                        {{if item.questionStd && item.moreResult.length}}
                            <a class="jump db two-ell topic-fc" data-questionsid = "{{item.id}}"data-questionstd = "{{item.questionStd}}"data-bind="click:questionClick" href="javascript:void(0);">1.{{item.questionStd}}</a>
                        {{/if}}
                        {{each item.moreResult as value i}}
                            <a class="jump db two-ell topic-fc" data-questionsid = "{{value.id}}" data-questionstd = "{{value.questionStd}}" data-bind="click:questionClick" href="javascript:void(0);">{{i + 2}}.{{value.questionStd}}</a>
                        {{/each}}
                    </div>
                </div>
            {{else}}
                <div class="question clearfix">
                    <img class="head-picture fr" src="{{item.icon}}">
                    <div class="cont clearfix fr">
                        <p>{{item.cont}}</p>
                    </div>
                </div>
            {{/if}}
        {{/each}}
    </script>
    <!-- 智能客服end -->
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly/fly.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/hammer/hammer.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/iScroll.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/util.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/index.js?t=<%=System.currentTimeMillis()%>"></script>
    
</body>
</html>
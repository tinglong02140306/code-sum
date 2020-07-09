<!DOCTYPE html>
<html>
    <%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
    <%@ include file="/WEB-INF/view/inc/taglibs.jsp"%>
<head>
    <%@ include file="/WEB-INF/view/inc/header.jsp"%>
    <link href="${ctx}/resource/h5/css/remove-car-app.css" rel="stylesheet" />
    <title>一键挪车</title>
</head>
<body>
    <!-- 用户ID -->
    <!-- <span class="user-id hide">${userId}</span> -->
    <input type="hidden" class="user-id" value="${userId}" />
    <!-- 图片地址 -->
    <!--  <span class="download-url hide">${FDFS_HTTP}</span> -->
    <input type="hidden" class="download-url" value="${FDFS_HTTP}" />
    <!-- 百度地图 -->
    <div id="l-map" class="hide"></div>
    <!-- 首页 start -->
    <div class="wrap index-warp">
        <!-- 头部 start-->
        <header class="topic-bg <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">hide</c:if>">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: back"></a>
                <span class="f36 cf title">一键挪车</span>
                <label class="bind-car hide" data-bind="click:jmpAddCar">绑定爱车</label>
            </div>
        </header>
        
        <%@ include file="/WEB-INF/view/h5/wx-header.jsp"%>
        <%@ include file="/WEB-INF/view/h5/zfb-header.jsp"%>
        <!-- 头部 end -->
        <!-- 主要内容 -->
        <div class="content top-7 <c:if test="${fn:contains(ua, 'MicroMessenger') || fn:contains(ua, 'AlipayClient')}">top-0</c:if>">
            <!-- form表单 start -->
            <div class="remove-car-form  ">
                <form id="carForm" class="bf">
                    <!-- 车身颜色 -->
                    <div class="car-color-wrap clearfix">
                        <span class="tl in-label fl">车牌颜色</span>
                        <div class="in-value car-color-select fl" data-bind="click: carColorClick" >
                            <span  class="car-color ell">蓝色车牌（小型汽车）</span>
                            <!-- <input type="text" class="car-color ell"  name="carColor" placeholder="蓝色车牌（小型汽车）" value="蓝色车牌（小型汽车）" data-bind=" value: formdata.carColor"> -->
                        </div>   
                    </div>
                    <!-- 车牌号码 -->
                    <div class="car-num-wrap clearfix">
                        <span class="in-label fl">车牌号码</span>
                        <div class="in-value fl">
                            <span class=" fl tl wan-span fl">皖</span>
                            <input type="text" id="target" class="car-num fl"  name="carNum" maxlength="6" data-bind="value: formdata.carPlateNum" placeholder="请输入车牌号码">
                           <!--  <label class="input-label fl hide" data-bind="click: numLabelClick">请输入车牌号码</label> -->
                        </div>
                    </div>
                    <!-- 位置 -->
                    <div class="car-color-wrap clearfix">
                        <span class="tl in-label fl">位　　置</span>
                        <div class="in-value address-bg fl" data-bind="click: addressClick">
                            <span  class="car-color address ell">定位中...</span>
                            <!-- <input type="text" class="car-color address ell"  name="address" placeholder="科大讯飞" data-bind=" value: formdata.address"> -->
                        </div>
                    </div>
                    <!-- 挪车原因 -->
                    <div class="remove-car-reason  clearfix">
                        <p class="in-label">挪车原因</p>
                        <div class="reason" data-template="removeReasonTempl" data-bind="source: reasonData">
                           <!--  <span class="item-reason">您爱车挡道,请挪车</span>
                           <span class="item-reason item-reason-select">您的车窗灯未关</span>
                           <span class="item-reason">您违规停车，请挪车</span>
                           <span class="item-reason item-reason-select second-reason">急需挪车，请速来</span> -->
                        </div>
                    </div>
                </form>
                <div class="separate-warp"></div>
                <!-- 现场照片 -->
                <div class="add-picture-wrap bf clearfix">
                    <div class="picture-tip">
                        <span class="tl in-label fl">现场照片</span>
                        <div class="in-value fl"><span class="tip">最多上传3张照片</span></div>
                    </div>
                    <div class="attachment-div fl">
                        <div class="span3" id="uploadDiv">
                            <div class="upload-add" id="uploadPhoto" style="position: relative">
                                <input type="file"  accept="image/*" id="upload-plus" class="upload-plus-input" multiple="multiple"/>
                                <i class="icon-plus" style="position: relative"></i>  <!-- data-flag="0" data-bind="click: uploadPicClick" -->
                            </div>
                            <input type="hidden" id="pics" value="">
                        </div>
                    </div>
                </div>
                <div class="notice-type clearfix">
                    <div class="notice-label fl">通知方式</div>
                    <div class="notice-value fl hide">
                        <div class="sms-wrap sms-wrap-select fl"><span class="sms sms-select fl">短信</span><!-- <i class="sms-icon"></i> --></div>
                        <div class="tel-wrap  fl" data-bind="click: telNoticeClick" data-flag="0"><span class="tel  fl">语音电话</span></div>
                    </div>
               </div> 
                <div class="apply-btn save-apply" data-bind="click: isSaveRemoveApplyClick" >
                    <span>发起挪车</span> 
                    <span class="is-last hide">(今天还可以发起<span class="apply-num">${applyNumber}</span>次)</span>
                </div>
                <div class="bottom">
                    <div class="bottom-tip">
                        <span class="remove-record" data-bind="click: recordBtnClick">挪车记录</span>
                        <span class="remove-instructe" data-bind="click: descriptionBtnClick">挪车说明</span>
                    </div>
                </div>
            </div>
        </div>
         <!-- 车牌颜色选择弹框 -->
        <div class="license-color-wrap mask hide" data-bind="click: carColorClick">
            <div class="license-list-item" >
                <p class="license-title" data-bind="click: stopLicenseListHide">请选择车牌颜色</p> 
                <div class="license-content" data-bind ="source: carColorData" data-template="licenseColorTmp">
                </div>
            </div>
        </div>
        <!-- 使用说明 start-->
        <div class="remove-car-description mask hide">
            <div class="description-wrap">
                <div class="description-title">挪车说明</div>
                <div class="description-content">
                    <p class="description-item">不会泄露用户信息给挡车车主,请放心使用；</p>
                    <p class="description-item">支持挪皖籍车辆；</p>
                    <p class="description-item">每天最多挪<span class='limit-num'>${LIMIT_NUM}</span>次车；</p>
                    <p class="description-item"><span class="service-begin hide">${SERVICE_BEGIN}</span><span class="service-end hide">${SERVICE_END}</span>语音通知服务时间<span class="tel_begin">${TEL_BEGIN}</span>到<span class="tel_end">${TEL_END}</span></p>
                    <div class="description-btn" data-index="1" data-bind="click: descriptionBtnClick">我知道了</div>
                </div>
            </div>
        </div>
        <!-- 使用说明 end-->
         <!-- 联系不到车主 start-->
        <div class="relative-driver-wrap mask hide">
             <div class="sure-tip">
                <p class='sure-tip-title'>联系不到车主，请尝试其他挪车方式</p>
                <div class="driver-btn" data-index="2" data-bind="click: driverBtnClick">我知道了</div>
            </div>
        </div>
        <!-- 不在服务时间内 start-->
          <!-- <div class="service-timer-tip mask">
            <div class="description-wrap">
                <div class="description-title">当前时间段不在服务时间范围内(服务时间为每天${SERVICE_BEGIN}-${SERVICE_END})</div>
                <div class="description-content">
                    <div class="description-btn" data-index="2">我知道了</div>
                </div>
            </div>
                  </div>   -->
        <!-- 不在服务时间内 end-->
        <!--确认挪车申请 -->
        <div class="sure-tip-wrap mask hide">
            <div class="sure-tip">
                <p class='sure-tip-title'>请核对车牌号码是<span class="car-info"></span>吗？</p>
                <div class="sure-btn clearfix">
                    <span class="sure-tip-cancle fl" data-index='1' data-bind="click: saveRemoveApplyClick">取消</span>
                    <span class="sure-tip-confirm topic-bg fr" data-index='2' data-bind="click: saveRemoveApplyClick">确认</span>
                </div>
            </div>
        </div> 
        <!-- 取消挪车 -->
        <div class="remove-cancle-wrap mask hide">
            <div class="sure-tip">
                <p class='sure-tip-title'>确认取消挪车吗？</p>
                <div class="sure-btn clearfix">
                    <span class="remove-cancle  fl" data-index="1" data-bind="click: isCancleRCClick">继续挪车</span>
                    <span class="remove-cancle-confirm  topic-bg fr" data-index='2' data-bind="click: isCancleRCClick">取消挪车</span>
                </div>
            </div>
        </div>
         <!-- 删除图片 -->
        <div class="delete-picture-wrap mask hide">
            <div class="delete-picture">
                <p class='sure-tip-title'>确认删除当前图片吗？</p>
                <div class="delete-btn clearfix">
                    <span class="delete-cancle  fl">取消</span>
                    <span class="delete-confirm topic-bg fr">删除</span>
                </div>
            </div>
        </div>
    </div>
    <!-- 首页 end -->
    <!-- 附近页面 start-->
    <div class="wrap nearby-address-wrap hide">
        <!-- 头部 start-->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <a href="javascript:void(0)" class="arrow-left header-back" data-bind="click: nearbyAddressBack"></a>
                <span class="f36 cf title">位置</span>
                <label class="search-btn" data-bind="click:searchAddressClick"></label>
            </div>
        </header>
        <!-- 头部 end -->
        <!-- 附近内容 start -->
        <div class="nearby-address top-7 bf">
            <div class="nearby-content bf">
            </div>
        </div>
        <!-- 附近内容 end -->
    </div>
    <!-- 附近页面 end -->
    <!-- 搜索页面 start -->
    <div class="wrap search-address-wrap hide">
        <!-- 头部 start-->
        <header class="topic-bg">
            <div class="header-item topic-bg">
                <div class="search-wrap">
                    <input type="text" class="keywords" placeholder="请输入地址关键字"></input>
                   <!--  <label class="serach-label" data-bind="click: searchLabelClick">请输入地址关键字</label> -->
                    <label class="clear-keyword hide" data-bind="click: clearKeyword"></label>
                </div>
                <div class="cancle-search-btn" data-bind="click:cancleSearchClick">取消</div>
            </div>
        </header>
        <!-- 头部 end -->
        <div class="search-address top-7 bf">
            <div class="search-content bf">
            </div>
        </div>
        <!-- 搜索内容 start -->
        <div class="empty top-7 hide">
            <div class="empty-icon"></div>
            <p>未搜索到相关内容</p>
        </div> 
        <!-- 搜索内容 end -->
    </div>
    <!-- 搜索页面 end -->
    <!-- 挪车原因start -->
    <script id="removeReasonTempl" type="text/html">
        {{each $data as item index}}
            <span class="item-reason {{if index%2!=0}} second-reason {{/if}} " data-bind="click: reaonSelectClick" data-value="{{item.code}}" data-name="{{item.name}}">
                {{item.name}}
            </span>
        {{/each}}
    </script>
    <!-- 挪车原因start end -->
    <!-- 车牌颜色 start -->
    <script id="licenseColorTmp" type="text/html">
        {{each $data as item index}}
            <div class="license-item clearfix" data-value="{{item.code}}" data-title="{{item.name}}" data-bind="click: selectLicenseColorClick"> 
                <span class="ell fl">{{item.name}}</span>
                <i class="{{if item.code=='02'}}color-select{{/if}} fr"></i>
            </div>
        {{/each}}
    </script>
    <!-- 车牌颜色 end -->
     <!-- 附近位置 start -->
    <script id="nearbyAddressTmp" type="text/html">
        {{each $data as item index}}
            <div class="item-list" data-pointx={{item.point.lng}} data-pointy={{item.point.lat}} data-title={{item.title}}>
                <p class="address-title ell" >{{item.title}}</p>
                <p class="address-details ell">{{item.address}}</p>
            </div>
        {{/each}}
    </script>
    <!-- 附近位置 end -->
    <%@ include file="/WEB-INF/view/inc/footer.jsp"%>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/fly_zomm_img.min.js"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v2.0&ak=pVgVGOsuOChYF1YvoMm8diXT2S8hbFuE&s=1"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/gps-convert.js"></script>
    <!-- <script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.min.js"></script> -->
    <script type="text/javascript" src="${ctx}/resource/js/plugins/lrzpicture/dist/lrz.bundle.js"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/lrzpicture/lrzpicture.js?ts=222223"></script>
    <script type="text/javascript" src="${ctx}/resource/js/plugins/device/device.js"></script>
    <script type="text/javascript" src="${ctx}/resource/h5/js/remove-car-app.js?ts=1111"></script>
</body>
</html>
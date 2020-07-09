/**
 * @author tinglong
 * @time 2018-04-03
 * @description 警微热点-详情
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'share',
        'common'
    ],
    function(remCacul,share, common) {

    var TOKEN = "", // 用户token
        DEVICE = "", // 设备号
        AID = "", // 区域ID
        id = common.getQueryString('id'),  // 热点详情id
        wbName = common.getParam('wbname'),
        weburl = common.getQueryString('weburl'),
        OS = common.phoneOs(), // 终端类型
        NEWSIMG = common.getListImgSize(111, 0.75),
        platForm = common.checkMobilePlatform(),   
        shareListFlag = true, // 标记是否渲染分享列表
        collectIndex = 1,
        praiseIndex = 1,
        requestNewsIndex = 1,
        headerHeight = $('.topic-bg').outerHeight(),  // 子头部高度
        // saveImgBtnFlag = true, // 保存图片 防止用户多次点击
        OBJ = {
            shareType: croods.shareType.WebPage,
            shareText: "",
            url: CONFIG.shareFile,
            title: CONFIG.appName,
            site: CONFIG.appName,
            titleUrl: CONFIG.shareFile,
            siteUrl: CONFIG.shareFile,
            imageUrl: CONFIG.shareImg //服务器上的图片
        },
        options = [{
            icon: "qq",
            platform: "QQ",
            type: 1
        }, {
            icon: "qzone",
            type: 2,
            platform: "QQ空间"
        }, {
            icon: "session",
            type: 4,
            platform: "微信"
        }, {
            icon: "timeline",
            type: 5,
            platform: "朋友圈"
        }],
        path = 'http://61.191.24.229:5069/',  // 图片视频路径
        vm = window.vm = fly.observable({
            formData: {},
            // 返回
            back: function() {
                var shareDom = document.getElementsByClassName('share')[0],
                    shareMask = shareDom.handler.mask.className;
                if (shareMask.indexOf('show') > -1) {
                    $('.mask').removeClass('show');
                    $(".sheet").css({
                        "transform": "translate3d(0,100%,0)",
                        "-webkit-transform": "translate3d(0,100%,0)",
                    });
                } else {
                    croods.pageClose({});
                }
            },
            // 分享平台类型
            OP: [],
        }),
        renderEvent = {
            // 渲染警微热点详情
            renderBlogNews: function(data) {
                for(var arr in data) {
                    vm.formData.set(arr, data[arr]);
                }
                // 数据格式处理
                data.shareCount = data.shareCount > 9999 ? '9999+' : data.shareCount;
                data.collectionCount = data.collectionCount > 9999 ? '9999+' : data.collectionCount;
                data.priseCount = data.priseCount > 9999 ? '9999+' : data.priseCount;

                if(data.appendixType == 1) {
                    // 图片预览 图片格式转换
                    var imgList = [];
                    for(var j = 0; j < data.appendixList.length; j++) {
                        if(!!data.appendixList[j]) {
                            var gifFlag =  data.appendixList[j].indexOf('gif');  // 是否为动图标志位
                            if(gifFlag <= -1) {
                                data.appendixList[j] = CONFIG.viewPath + data.appendixList[j];
                            }
                            imgList.push(data.appendixList[j]);
                        } 
                    }
                    imgList = JSON.stringify(imgList);
                    data.appendixList = $.parseJSON(imgList);
                    data.imgList = imgList;  // 容错处理
                }else if(data.appendixType == 2) {  // 视频播放
                    data.appendixAddress = CONFIG.viewPath + data.appendixAddress;  
                }

                // 模板渲染
                var arrData = [];
                    arrData.push(data);
                var tmpl = fly.template('blogTmpl', arrData);
                $('.content').append(tmpl);
                
                // 设置主要内容高度、头部颜色渐变
                eventHandle.setConHeight();
                eventHandle.headChange();

                // 警微热点内容行间距微调
                if(OS == 'IOS') {
                    $('.article-sec, .article-sec .content-text').addClass('blog-con-line');
                }
                var context = arrData[0].content.replace(/\\/g, ''),
                    context = context.replace(/\/\//g, 'http://');
                $('.article-sec').html(context);
                var content = $('.article-sec').text();

                if(data.appendixType == 1) {
                    // 图片预览
                    mui.previewImage({  
                        header: '',
                        footer: '<span class="mui-preview-indicator"></span><div class="mui-preview-btn save-logo">保存</div>'
                    }); // 插件预览
                }
                CONFIG.shareFile = CONFIG.BlogDetail + '?id=' + id;
                CONFIG.shareFile = encodeURI(CONFIG.shareFile);
              
                OBJ = {
                    shareType: croods.shareType.WebPage,
                    shareText: content.replace(/(^\s*)|(\s*$)/g, "").substr(0, 30),  // 去除资讯内容的空格
                    url: CONFIG.shareFile,  // 警微热点id
                    title: data.wbName,
                    site:  data.wbName,
                    titleUrl: CONFIG.shareFile,  // 警微热点id
                    siteUrl: CONFIG.shareFile,  // 警微热点id
                    imageUrl: data.wbImageUrl ? data.wbImageUrl : CONFIG.shareImg
                };

                $('img').off('error').on('error', function() {  // 图片error处理
                    $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                });
                // 懒加载
                $("img.lazy", $("#blogContent .item-content .unloaded")).lazyload({
                    container: $('#blogContent'),
                    threshold: 200,
                    placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAYAAAA3d5OIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5NDFERjlDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5NDFERkFDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDk0MURGN0MyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDk0MURGOEMyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsaTlT0AAAToSURBVHja7N1LbttWFIBh6mFbsOVOu4yiC+mwaYpuIcvxDooCDZpZVpJlJAOP6rdll0cQU1doLFq694o0vw8g0jhpIjP6zXMpUh6dn59XT/xQb+/q7ad6+74CtvW53j7W21m9fWo+OFoFN6m3P+rtF/sJkntfb7/V22K6+oDYIJ9oa1xvb8arMVJskNfP0dp4tWYD8nsXwb21H6CI5Ug5tx+giO/G9gGUIzgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHggMEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOBAcIDgQHAgOEBwIDhAcCA4QHAgOBAcsKupXdB/t7e3y22xWFSj0aiaTCbVbDZb/ojgSOji4qK6u7v7+vPHx8fq4eFh+bHj4+Pq8PDQTjJSksL19fV/Ylt3eXm5POohOBK4ublJ8nsQHBvEkSvGx03u7+/tLMGB4OjTP9x4vDwjuYkzlYIjgYitzRnIo6MjO0twpLDptbb49enUKz9d4l+j50e5+Xy+PBMZL3zH62/NGBmxHRwc2EmCI3V0EVdszVnLNms7BEeC+LCGAwQHghukWHvFFSHNSQ+s4cgkLkCOrRFnFuMqf+sxRzgyxxbi6v+45QbBkVCEtR5bI8bLb/0aguOFYq0W96ptOvo9d68bgqOlGBnb3FoTUeY8keJkTXlOmhR2dXXV+i7sCCLiPD09Tf444lKweCxN+E7WOMK9ynXbS+/AjjgjjNSPI46eT4+y8bHUfw+C6/S67Vuai5NzP47m3b8QXK81o2GbdVuKUXSX9WP8PdZ0ghvMuu25aNfHwJdq8y5e8ecbLQXXWynHtF3Wcy95HLGeM1oKrndynPDYJuBtHofRUnCDW7ftMhruOoo2/x+C64XcL1q3jXmX9WO8KO6NZAXXefEkzX1ZVpuXGVKsH+MSM6Ol4DorjgqlzvI990J6HNVSjIRGS8F1et1W+skZca+/nXmzfkz5RcRoKbjOiSf5Psav9ZMiOdaPqV54FxxJxFpnX984I+Jqjmg5149GS8F1Zt227xtG4zFEEDnXj3GEc2Os4Pbq6dFl30pcHRLBGS0Ftze7Xt/Y188ZwRX3f2cIh8BoKbjitrmZ9DXZ50kiwQ1w3WasGuY4LbjCcl6U3McvPEZLwWVftzlL968Yq42WgsvCe34YLQVXSI6bSV/TaGnfCM66rfDR32gpuGQjk3vCjJaCK3RSwHv8Gy0FZ93W2dHSFyjBbb1uw2gpOOu2zn+xciWO4Frzvdl2581kBdeK7z6ajjeTFdyzunQz6WsZLZ10EpzFvtFScF0Yf1wpYbQUXKGvwt53Me9o6ayl4L6u2zwZ8vNmsoJbclFyOb5PwcCD85Zv5UfLoZ+1HHRwRpz9jJaCg1JPuPGwn3LTIX/yJycnxso1o9Eo2587mUyq2WwmuMF+8tNpNZ/PVYaREgQHCA4EBwgOBAeCAwQHggMEB4IDwQGCA8EBggPBAYIDwYHgAMGB4ADBgeBAcIDgQHCA4EBwgOBAcCA4QHAgOEBwIDgQHCA4EBwgOBAcCM4uAMGB4ADBQa+C+9tugCI+R3B/2g9QxMcI7sx+gCLOIrhP9faXfQFZfYjWmpMmv9bbe/sEsogD2tv4jya4xeoDP9bb7/X2xT6CnXxZtRRNvVk1Vv0jwABSdjl9DH5YIgAAAABJRU5ErkJggg=="
                });
                $("#blogContent .item-content .unloaded").removeClass('unloaded');
            },
            // 头部内容显然
            renderHeaderContent: function() {
                // 头部内容渲染
                $('.my-photos')[weburl ? 'removeClass' : 'addClass']('hide');
                $('.title')[wbName ? 'removeClass' : 'addClass']('hide');
                $('.my-photos img').attr('src', weburl);
                $('.title').html(wbName);
            }
        },
        eventHandle = {
            
            // 分享点击事件
            shareClick: function(e) {
                croods.getNetworkType({
                    success: function(res) { //请求成功回调
                        if (res.network == 'none') {
                            common.toast('网络无法连接，请检查您的网络');
                        } else {
                            if (shareListFlag) {
                                vm.set('OP', options);
                                shareListFlag = false;
                            }
                            
                            eventHandle.callShare(this);
                        }
                    }
                });
                e.stopPropagation();
            },
            // 绑定物理返回键
            bindbutton: function() {
                croods.bindButton({
                    keycode: ['backbutton'],
                    success: function(res) {
                        var shareDom = document.getElementsByClassName('share')[0],
                            shareMask = shareDom.handler.mask.className;
                        if (shareMask.indexOf('show') > -1) {
                            $('.mask').removeClass('show');
                            $('.share').addClass('d-none');
                            $(".sheet").css({
                                "transform": "translate3d(0,100%,0)",
                                "-webkit-transform": "translate3d(0,100%,0)",
                            });
                        } else {
                            croods.pageClose({});
                        }
                    }
                });
            },
            /**
             * 分享模块点击
             */
            callShare: function(that) {
                that.shareDom = document.getElementsByClassName('share')[0];
                that.share = that.shareDom.handler;
                $('.shareset').removeClass('hide');
                that.share.show();
                that.share.shareFun(OBJ, function() {
                    common.toast('分享成功');
                });
                requestEvent.requestShareCount();
            },
            // 收藏点击事件
            collectClick: function(e) { // false 未收藏  true 已收藏  用户需要登录  点赞和分享不需要用户登录
                var self = $(e.currentTarget),
                    collectFlag = vm.formData.get('collection'),  // vm.formData.get('prise')
                    request = common.packData({}, '', '1', '', ''),
                    code;
                    if (collectFlag == false) { //未收藏
                        code = '5f22f7a03b89447eba15ad12849bbc79';
                    } else { //已收藏
                        code = 'ebf9c5e93faa499d9daf914f5c80bf3d'; 
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                croods.customPlugin({
                                    action: 'UserPlugin.isLogin',
                                    params: request,
                                    success: function(res) {
                                        TOKEN = res.token ?  res.token : '';
                                        croods.ajax({
                                            method: code,
                                            params: {
                                                token: TOKEN,
                                                resIds: id, // 警微热点id  收藏id
                                                resId: id  // 取消收藏id
                                            },
                                            //请求参数
                                            success: function(res) { //请求成功回调
                                                if (common.checkToken(res, function(newToken) {
                                                   TOKEN = newToken;
                                                   eventHandle.collectClick(e);
                                                   collectIndex++;
                                                }, collectIndex)) { 
                                                    res = $.parseJSON(res);
                                                    if (res.flag) {
                                                        if (collectFlag == false) {
                                                            vm.formData.set('collection', true);
                                                            $('.btn-collect .num').html(res.data);
                                                            $('.btn-collect .icon').addClass('collected');
                                                            $('.btn-collect .icon').removeClass('uncollected');
                                                            common.toast('已添加到我的收藏');
                                                        } else {
                                                            vm.formData.set('collection', false);
                                                            $('.btn-collect .num').html(res.data);
                                                            $('.btn-collect .icon').addClass('uncollected');
                                                            $('.btn-collect .icon').removeClass('collected');
                                                            common.toast('取消收藏');
                                                        }
                                                    } else {
                                                        if (collectFlag) {
                                                            common.toast('收藏失败');
                                                        } else {
                                                            common.toast('取消收藏失败');
                                                        }
                                                    }
                                                }
                                                
                                            },
                                            fail: function(res) { //请求失败回调
                                                if (collectFlag) {
                                                    common.toast('收藏失败');
                                                } else {
                                                    common.toast('取消收藏失败');
                                                }
                                            },
                                            complete: function(res) {
                                                if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                    common.toast('网络无法连接，请检查您的网络');
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                e.stopPropagation();
            },
            // 点赞点击事件
            praiseClick: function(e) {  // false 未点赞 true 已点赞
                var priseFlag = vm.formData.get('prise'),
                    self = $(e.currentTarget),
                    // index = self.data().index,
                    dom = $('body');
                if (platForm) {
                    var obj = {
                        objId: id, // 警微热点ID
                        deviceId: DEVICE, // 设备ID
                        token: TOKEN, // 用户登录的TOKEN
                        osType: OS // 终端类型IOS Android
                    },
                    code;

                    if (priseFlag == 'false') { //未点赞
                        eventHandle.praiseAnimate(dom, 0);
                        code = '3140ce2df226465ca46260b7b6a4431d';
                    } else { //已点赞
                        code = '93f0150736934e958f51b19e929ee46c';
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.ajax({
                                    method: code,
                                    params: obj,
                                    //请求参数
                                    success: function(res) { //请求成功回调
                                        // common.maskPraise(false);
                                        if (common.checkToken(res, function(newToken) {
                                            TOKEN = newToken;
                                            eventHandle.praiseClick(e);
                                            praiseIndex++;
                                        }, praiseIndex)) {
                                            res = $.parseJSON(res);
                                            if (res.flag) {
                                                var data = res.data;
                                                if (priseFlag == 'false') {
                                                    if (data != 0) {
                                                        // priseFlag = 'true';
                                                        vm.formData.set('prise', 'true');
                                                        $('.btn-praise .num').html(data);
                                                        $('.btn-praise .icon').addClass('praised');
                                                        $('.btn-praise .icon').removeClass('unpraised');
                                                    } else {
                                                        common.toast('点赞失败！');
                                                    }
                                                } else {
                                                    if (data != -1) {
                                                        // priseFlag = 'false';       
                                                        vm.formData.set('prise', 'false');
                                                        $('.btn-praise .num').html(data);
                                                        $('.btn-praise .icon').addClass('unpraised');
                                                        $('.btn-praise .icon').removeClass('praised');
                                                    } else {
                                                        common.toast('取消点赞失败！');
                                                    }
                                                }
                                            } else {
                                                if (priseFlag) {
                                                   common.toast('取消点赞失败！');
                                                } else {
                                                   common.toast('点赞失败！');
                                                }
                                            }
                                        }
                                    },
                                    fail: function(res) { //请求失败回调
                                        // common.maskPraise(false);
                                       if (priseFlag) {
                                           common.toast('取消点赞失败！');
                                        } else {
                                           common.toast('点赞失败！');
                                        }
                                    },
                                    complete: function(res) {
                                        // common.maskPraise(false);
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                            common.toast('网络无法连接，请检查您的网络');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                e.stopPropagation();
            },
            // 点赞动画加载
            praiseAnimate: function(dom, index) {
                croods.getNetworkType({
                    success: function(res) { //请求成功回调
                        if (res.network != 'none') { 
                            common.maskPraise(true, dom, index);
                            setTimeout(function(){
                                common.maskPraise(false, dom, index);
                            }, 1000);
                        } 
                    }
                });
            },
            //图片预览
            imgPreviewClick: function(e) {
                e.stopPropagation();  // 阻止事件冒泡
            },
            // 图片保存点击事件
            imgSaveClick: function(e) {
                var $this = $(this),
                    downLoadUrl = $this.parents().find('.mui-preview-footer').siblings().find('.mui-active').find('img').attr('src');
                var REQUEST = common.packData({
                    "downLoadUrl": downLoadUrl,
                 }, "", "1", false, "");
                croods.customPlugin({
                    action: 'CustomImagePlugin.downloadImage',
                    params: REQUEST,
                    success: function(res) {
                        alert('保存成功！');
                    }
                });
            },
            // 视频点击事件
            vedioPlayClick: function(e) {
                var $this = $(e.currentTarget),
                    detailId = $this.data().detailid,
                    name = $this.data().name,
                    poster = $this.data().poster;
                var url = 'video-paly.html?id=' + detailId + '&title=' + name + '&poster=' + poster;
                    eventHandle.originalReturn(url);
                e.stopPropagation();
            },
            // 原生地址跳转 第三方
            originThirdSerReUrl: function(returnUrl) {
                var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });
            },
            // 本地页面跳转-原生
            originalReturn: function(url) {
                var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=' + url); // 对接口请求数据封装
                $(this).addClass('visited');
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },

            // 设置主要内容的高度
            setConHeight: function() {
                var conHeight = document.body.clientHeight  - $('.interval').outerHeight(),
                    conItemHeight = conHeight - $('.btn-wrap').outerHeight();
                $('.blog-news-content').css({'height': conItemHeight});
            },
            // 头部上拉下拉滚动 渐变
            headChange: function() {
                $('#blogContent').scroll(function(e) {
                    var scrollTop = $('#blogContent').scrollTop(),
                        offsetTop = $('.item-content').offset().top,
                        subTop = $('.item-header').outerHeight(),
                        opacity = (offsetTop >= headerHeight) ? (offsetTop -headerHeight)/subTop : 0,   //  大 - 小 
                        opacitys = (scrollTop <= subTop) ? scrollTop/subTop : 1;  // 小 - 大
                        opacity = opacity > 1 ? 1 : opacity;
                        if(opacitys > 0.8) {
                            opacitys = 1;
                            opacity = 0;
                        }else if(opacity > 0.8){
                            opacitys = 0;
                            opacity = 1;
                        }
                        $('.title-text').css({'opacity': opacity});
                        $('.title-pic').css({'opacity': opacitys});  
                    e.stopPropagation();
                });
            }
        },
        requestEvent = {  // 数据请求模块

            requestBlogData: function() {
                common.mask(true);
                var param = {
                    id: id,  // 详情id
                    deviceId: DEVICE, // 设备ID
                    token: TOKEN, // 用户登录的TOKEN
                };
                croods.ajax({
                    method: 'c1627d00a2b6469ba250ee6fa39679ad',
                    params: {
                        id: id,  // 详情id
                        deviceId: DEVICE, // 设备ID
                        token: TOKEN, // 用户登录的TOKEN
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        if(common.checkToken(res, function(newToken) {
                            TOKEN = newToken;
                            requestEvent.requestBlogData();
                            requestNewsIndex++;
                        }, requestNewsIndex)) {
                             common.mask(false);
                            res = JSON.parse(res);
                            var data = res.data;
                            
                            if (data && res.flag) {
                                renderEvent.renderBlogNews(data);
                                $('.content').removeClass('hide');
                                $('.empty').addClass('hide');
                            } else {
                                $('.content').addClass('hide');
                                $('.empty').removeClass('hide');
                            }
                        }
                       
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        common.mask(false);
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });
            },
            // 分享计数请求接口
            requestShareCount: function() {
                croods.ajax({
                    method: 'ed01ad526eb043519c0d656f53e416db',
                    params: {
                        resId: id  // 警微热点id
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        res = $.parseJSON(res);
                        if(res.flag) {
                            $('.btn-share .num').html(res.data);
                        }else {
                            common.toast('数据请求失败！');
                        }
                    },
                    fail: function(res) { //请求失败回调
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            common.toast('网络无法连接，请检查您的网络');
                        }
                    }
                });
            },
            /**
             * 获取设备id
             */
            getDevice: function() {
                croods.customPlugin({
                    action: 'UserPlugin.getDevice',
                    params: {},
                    success: function(data) {
                        if(data.deviceId) {
                            DEVICE = data.deviceId;
                            requestEvent.requestBlogData();
                        }  
                    }
                });
            },
            // 获取用户信息 和区域信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                    $('.content').css({
                        'position' : 'absolute',
                        'margin-top' : '0',
                        'height' : 'calc(100% - 3rem)'
                    });
                    $('.title-text').css({'opacity' : '0'});
                    $('.title-pic').css({'opacity' : '1'});
                },function() {
                    $('.content').css({
                        'position' : 'static',
                        'height' : 'auto'
                    });
                    $('.title-text').css({'opacity' : '1'});
                    $('.title-pic').css({'opacity' : '0'});
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',  // 用户信息接口
                        params: {},
                        success: function(res) {
                            TOKEN = res.token ? res.token: '';
                            eventHandle.bindbutton();
                            requestEvent.getDevice();
                            
                        }
                    });
                });
            }
        },
        addEvent = function() {
            var $this = $('.wrap');
            // 分享按钮点击事件
            $this.off('.btn-wrap .btn-share').on('click','.btn-wrap .btn-share',eventHandle.shareClick);

            // 收藏按钮点击事件
            $this.off('.btn-wrap .btn-collect').on('click','.btn-wrap .btn-collect',eventHandle.collectClick);

            // 点赞按钮点击事件
            $this.off('.btn-wrap .btn-praise').on('click','.btn-wrap .btn-praise',eventHandle.praiseClick); 

            // 图片预览点击事件
            $this.off('.img-list .img-item').on('click','.img-list .img-item',eventHandle.imgPreviewClick);  

            // 视频点击事件
            $this.off('.vedio-unit').on('click','.vedio-unit',eventHandle.vedioPlayClick);
           
            // 图片保存点击事件
            $(document).on('click', '.save-logo', eventHandle.imgSaveClick);

            $('img').off('error').on('error', function() {  // 图片error处理
                $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
            });
        };
    fly.bind(document.body,vm);
    $(function(){
        fly.template.config('escape', false);  // xxs是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
        renderEvent.renderHeaderContent();
        addEvent();
        requestEvent.getUserInfo();
    }); 
});

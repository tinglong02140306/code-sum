'use strict';
$(function(){
    // 页面初始化时创建页面
    var TOKEN = "", // 用户token
        DEVICE = "", // 设备号
        OS = util.phoneOs(), // 终端类型 
        id = util.getQueryString('id'),  // 热点详情id 
        jumpPlatType = util.getQueryString('jumpPlatType'),  // 是否访问分享的资讯/警微热点 1 不是
        platForm = util.checkMobilePlatform(),   
        isPC = util.isPC(),
        vm = window.vm = fly.observable({
            formData: {
                shareCount: '',  // 分享数
                priseCount: '',  // 点赞数
                prise: ''  // 是否点赞过标志位 
            },
            // 返回
            back: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1);
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

                if(data.appendixType == 1) {
                    // 图片预览 图片格式转换
                    var imgList = [];
                    for(var j = 0; j < data.appendixList.length; j++) {
                        if(!!data.appendixList[j]) {  // 普通png、jpg图片是部分地址需拼接，gif是完整地址不需要拼接
                            var gifFlag =  data.appendixList[j].indexOf('gif');  // 是否为动图标志位
                            if(gifFlag <= -1) {
                                data.appendixList[j] = CONFIG.path + data.appendixList[j];
                            }
                            imgList.push(data.appendixList[j]);
                        } 
                    }
                    imgList = JSON.stringify(imgList);
                    data.imgList = imgList;  // 容错处理
                }else if(data.appendixType == 2) {  // 视频播放
                    data.appendixAddress = CONFIG.path + data.appendixAddress;  
                }

                // 模板数据渲染 
                var arrData = [];
                    arrData.push(data);
                var tmpl = fly.template('blogTmpl', arrData);
                $('.blog-news-content').append(tmpl);
                var content = arrData[0].content.replace(/\\/g, '');
                $('.article-sec').html(content);
                
                content = $('.article-sec').text();
                
                // 图片error处理
                $('img, .img-item img').off('error').on('error', function() {  
                    $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
                });

                if(!isPC) {
                    mui.previewImage();  // 图片预览
                }
            }
        },
        eventHandle = {
            // 绑定物理返回键
            bindbutton: function() {
                if(platForm) {
                    // 绑定手机物理返回键
                    croods.bindButton({
                        keycode: ['backbutton'],
                        success: function(res) {
                            var shareDom = document.getElementsByClassName('share')[0];  
                            if ($(shareDom).find('.mask').hasClass('show')) {
                                $(shareDom).find('.mask').removeClass('show');
                                $('.mask-share').removeClass('show');
                                $('.share').addClass('d-none');
                                $(".sheet").css({
                                    "transform": "translate3d(0,100%,0)",
                                    "-webkit-transform": "translate3d(0,100%,0)",
                                });
                            } else {
                                platForm ? croods.pageClose({}) : window.history.back(-1);
                            }
                        }
                    });
                }
            },
            //图片预览
            imgPreviewClick: function(e) {
                e.stopPropagation();  // 阻止事件冒泡
            },
            // 视频点击事件
            vedioPlayClick: function(e) {
                var $this = $(e.currentTarget),
                    detailId = $this.data().detailid,
                    name = $this.data().name;
                util.mask(true);
                fly.$.ajax({
                    url: CONTEXTPATH + '/content/getVideoUrlBySbm',
                    data: {
                        sbm: detailId
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    success: function (res) {
                        util.mask(false);
                        window.location.href = res;  
                    },
                    error: function(){
                        util.mask(false);
                        util.toast('数据请求失败！');
                    }
                });
                e.stopPropagation();
            }
        },
        requestEvent = {  // 数据请求模块
            requestBlogData: function() {
                util.mask(true);
                $.ajax({
                    url: CONTEXTPATH + '/content/getWbContentById',
                    type: "POST",
                    data: {
                        id: id
                    },
                    dataType: "json",
                    success: function(res) {
                        util.mask(false);
                        // console.log(id);
                        // alert(JSON.stringify(res));
                        var data = res.data;
                        if (data && res.flag) {
                            renderEvent.renderBlogNews(data);
                            $('.wrap').removeClass('hide');
                            $('.empty').addClass('hide');
                        } else {
                            $('.wrap').addClass('hide');
                            $('#sorry').removeClass('hide');
                            if(platForm) {
                                $('.sorry-warp').css('top', '3rem');
                            }else {
                                $('.sorry-warp').css('top','0rem');
                            }
                            $('.empty').css('backgroundColor','#f5f5f5');
                        }
                    },
                    error: function(err) {
                        util.mask(false);
                        util.toast('数据请求失败！');
                    }
                });
            },
        },
        addEvent = function() {
            var $this = $('.wrap'); 

            // 图片预览点击事件
            $this.off('.img-list .img-item').on('click','.img-list .img-item',eventHandle.imgPreviewClick); 

            // 视频点击事件
            $this.off('.vedio-unit').on('click','.vedio-unit',eventHandle.vedioPlayClick);
        };


    fly.bind(document.body,vm);
    addEvent();
    if (platForm) {
        $('header').removeClass('hide');
        $('.close-btn').removeClass('hide'); // 隐藏关闭按钮
        util.noNet($('.wrap'), function() {
            $('.wrap').addClass('hide');
            $('#no-net').removeClass('hide');
        }, function() {
            $('.wrap').removeClass('hide');
            $('.content').css('top', '2.1rem');
            $('.download-code').addClass('hide');
        });
        $('.download-cont').addClass('hide');
    } else {
        /*$('.content').css('top', '3rem');
        if (!isPC) {
            $('.download-cont').removeClass('hide');
            $('header').addClass('hide');
        } else {
            $('.download-cont').addClass('hide');
            $('header').removeClass('hide');
            renderEvent.renderHeaderContent();  // pc端
        }*/
        
        if(jumpPlatType == '1') {
            $('.download-cont').addClass('hide');
            $('header').removeClass('hide');
            $('.content').css('top', '2.1rem');
        }else if(!jumpPlatType){
            if(isPC) {
                $('.download-cont').addClass('hide');
                $('header').removeClass('hide');
                $('.content').css('top', '2.1rem');
            }else if(!isPC) {
                $('.download-cont').removeClass('hide');
                $('header').addClass('hide');
                $('.content').css('top', '3rem');
            }   
        } 
    }
    requestEvent.requestBlogData();

    // 支付宝、微信端隐藏头部
    if(util.isWeiXin() || util.isAlipay()) {
        $('.content').css('top', '0rem');
        $('header').addClass('hide');
    }


    if (util.isWeiXin()) {
        var downWrap = $('#downWrap'),
            showDown = util.getCookie('showDown');
        if (showDown == '0') {
            downWrap.addClass('hide');
        } else {
            downWrap.removeClass('hide');
        }

        $('#downWrap .down-content').on('click', function() {
            window.location.href = APPDOWNURL;
        });

        $('#downWrap .delete-icon').on('click', function() {
            $('#downWrap').addClass('hide');
            util.setCookie('showDown', '0', 0.5 / 24, window.location.hostname);
        });
    }
}); 
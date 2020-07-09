/**
 * @author hmxue
 * @time 2017-11-10
 * @description 资讯详情模板
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'share',
        'remCacul',
        'slider'
    ],
    function(common, share, remCacul, slider) {
        // 页面初始化时创建页面
        var ID = common.getQueryString('id'), //id
            jumpType = common.getQueryString('jumpType'),
            winHeight = $(window).height(),
            maxContentLen = 54,
            maxContentLen2 = 108,
            showContentlen = 100,
            DEVICE = '', //设备号
            isCollection = false, // 是否收藏
            isLike = false, // 是否点赞
            isZXComment = true, // 是否是对咨讯评论
            getNewsIndex = 1, // 获取资讯判断Token失效问题
            collectionIndex = 1, // 收藏判断Token失效问题
            likeIndex = 1, // 点赞判断Token失效问题
            commentIndex = 1, // 评论判断Token失效问题
            TOKEN = '',
            mescroll,   // 上拉加载
            flag = true, // 标记是否渲染分享列表
            OS = common.phoneOs(),
            platForm = common.checkMobilePlatform(),
            clickDom,           // 点击的评论项
            toCommentId = '',
            userId = '',        // 当前用户的id
            userName = '',      // 当前用户名
            userImage = '',     // 当前用户头像
            fromUser = '',      // 评论人id
            fromUserName = '',  // 评论人昵称
            //platForm = true,
            OBJ = {},
            CPAGE = 1, // 评论当前页
            commentList = [],   // 评论列表
            submitContent = {}, // 最近一次评论实体
            commentTop = 0,     // 评论列表的top值，方便滑动的
            timeout = 0,
            clientX1,
            clientY1,
            clientX2,
            clientY2,
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
            vm = window.vm = fly.observable({
                operationVisibleFlag: false,
                OP1: [],
                OP2: [],
                OP3: [],
                OPS: [],
                back: function() {
                   /* if(jumpType == '1') {
                        window.history.back(-1);
                        return;
                    }
                    platForm ? croods.pageClose({}) : window.history.back(-1);*/
                    var shareDom = document.getElementsByClassName('share')[0],
                        shareMask = shareDom.handler.mask.className;
                    if (shareMask.indexOf('show') > -1) {
                        $(shareDom.handler.mask).removeClass('show');
                        $('.mask-share').removeClass('show');
                        $('.share').addClass('d-none');
                        $(".sheet").css({
                            "transform": "translate3d(0,100%,0)",
                            "-webkit-transform": "translate3d(0,100%,0)",
                        });
                    } else {
                        //  if(jumpType == '1') {
                        //     window.history.back(-1);
                        //     return;
                        // }
                        croods.pageClose({});
                    }
                },
                refreshClick: function() {
                    window.location.reload();
                },
                headerMore: function(e) {
                    var dom = $('.share-bomb-mask');
                    if (dom.hasClass('hide')) {
                        dom.removeClass('hide');
                    } else {
                        dom.addClass('hide');
                    }
                },
                cancel: function() {
                    $('.mark').addClass('hide');
                    $('.common-mask').addClass('hide');
                },
                /**
                 * 删除个人评论
                 */
                deleteComment: function(data) {
                        var obj = {
                                replyId: toCommentId,   // 评论内容
                                token: TOKEN,       // 用户登录的TOKEN
                                osType: OS,         // 终端类型IOS Android
                            };

                        croods.getNetworkType({
                            success: function(res) { //请求成功回调
                                if (res.network == 'none') { 
                                    common.toast('网络无法连接，请检查您的网络');
                                }else {
                                    croods.ajax({
                                        method: "db35c653a70546298a407c2ab96b77f1",
                                        params: obj,
                                        //请求参数
                                        success: function(res) { //请求成功回调
                                            // 删除成功后要更新列表
                                            clickDom.parent().remove();
                                            $('.comment-handle').addClass('hide');
                                            $('.common-mask').addClass('hide');
                                            $('.mark').addClass('hide');
                                            common.toast('删除成功！');
                                        },
                                        fail: function(res) { //请求失败回调
                                            $('.comment-handle').addClass('hide');
                                            $('.common-mask').addClass('hide');
                                            $('.mark').addClass('hide');
                                            common.toast('删除失败！');
                                        },
                                        complete: function(res) {
                                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                common.toast('网络无法连接，请检查您的网络');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                },
            }),
            /**
             * 渲染模块
             */
            renderEvent = {
                /**
                 * 加载当前滚动条
                 */
                renderScroll: function() {
                    mescroll = window.mescroll = new MeScroll('wrapper', {
                        down: {
                            isLock: true,
                            use: false
                        },
                        up: { // 上拉配置
                            noMoreSize: 10,
                            htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                            callback: function(page, mescroll) {
                                CPAGE = page.num;
                                // 请求评论列表
                                requestEvent.checkAndRequestCommet();
                            },
                            page: {
                                size: 10
                            },
                        }
                    });
                },

                /**
                 * 获取资讯
                 */
                getNews: function(Token) {
                    common.mask(true);
                    if(Token) {
                        TOKEN = Token; // 新Token赋值
                    }
                    croods.ajax({
                        method: '52136b94db1f46859e6e7b7c1da573a9',
                        params: {
                            'id': ID, // 资讯ID
                            'deviceId': DEVICE,
                            'token': TOKEN,
                            'osType': OS
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            common.mask(false);
                            if (common.checkToken(res, function(newToken) {
                                renderEvent.getNews(newToken);
                                getNewsIndex++;
                            }, getNewsIndex)) {
                                res = $.parseJSON(res);
                                if (!res || res.flag === false || !res.data) {
                                    $('.wrap').hide();
                                    $('#sorry').removeClass('hide');
                                    return false;
                                }
                                $('.wrap').removeClass('hide');
                                var data = res.data;
                                var content = data.content; // 富文本内容
                                data.content = ''; // 解决富文本直接渲染会把标签渲染出来

                                if (data.multimediaSource == '1' && data.multimediaType == "0") {
                                    data.thumbnailUrl = CONFIG.path + 'img/common/video-default.png'
                                }
                                data.releaseDate = common.getTimeDate(data.releaseDate); // 时间格式化
                                var tmpl = fly.template('newsDetailTempl', data);
                                data.prise ? $('.zx-zan').addClass('zx-zan-select') : $('.zx-zan').addClass('zx-zan-unselect');
                                isLike = data.prise;
                                $('.zx-zan').attr('data-parise', data.prise);
                                if (data.collection) {
                                    $('.collection-btn').css({
                                        background: "url('" + CONFIG.path + "/img/news-detail/already_collection2.png') center center no-repeat",
                                        backgroundSize: '0.75rem 0.71rem'
                                    });
                                } else {
                                    $('.collection-btn').css({
                                        background: "url('" + CONFIG.path + "/img/news-detail/collection2.png') center center no-repeat",
                                        backgroundSize: '0.75rem 0.71rem'
                                    });
                                }
                                isCollection = data.collection;
                                $('.collection-btn').attr('data-collection', data.collection);
                                $('.news-main').html(tmpl);
                                if(data.infoSource == '中国警察网') {
                                    content = content.replace('&nbsp;&nbsp;&nbsp;', '');
                                    var list = content.split('<br>'),
                                        str = '';
                                    for(var i = 0, len = list.length; i < len; i++) {
                                        if(list[i].indexOf('<img') > 0) {
                                            list[i] = $.trim(list[i]);
                                        }
                                        if($.trim(list[i])) {
                                            if(i == 0 || i == len-1) {
                                                str = str + list[i];
                                            } else {
                                                str = str + '<div>' + list[i] + '</div>';
                                            }
                                        }
                                    }
                                    content = str;
                                }

                                $('.news-content').html(content);
                                $(".news-content img").off('error').on('error', function() {
                                    $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                                    $(this).css('width','100%');
                                });
                                var showPriseCount = data.priseCount > 9999 ? '9999+' : data.priseCount;
                                $('.zx-zan').html(showPriseCount);
                                // $('.like').removeClass('hide');
                                $('.operation').hide();
                                if (data.multimediaSource == '1' && data.multimediaType == "0") {
                                    // if(OS === 'IOS'){
                                    //     source = '<a href="'+ data.multimediaUrl + '" class="a-link">'+ data.multimediaUrl + '</a>';
                                    // }else{
                                    //    source = '<iframe src=' + data.multimediaUrl + ' frameborder=0 "allowfullscreen"></iframe>';
                                    // }
                                    var source = '<img class="link-img" src="' + CONFIG.path + 'img/common/video-default.png" /><img class="play" src="' + CONFIG.path + 'img/common/play.png" data-linkurl="' + data.multimediaUrl + '" />';
                                    $('.video-content').html(source);
                                }
                                if (data.isComment == '1') {
                                    $('.news-comment').removeClass('hide');
                                    $('.comment-input-unselect').removeClass('hide');
                                } else {
                                    $('.news-comment').addClass('hide');
                                    $('.comment-input-unselect').addClass('hide');
                                    $('.news-view').css('bottom', 0);
                                }
                                OBJ = {
                                    shareType: croods.shareType.WebPage,
                                    shareText: $('.news-content').text().replace(/(^\s*)|(\s*$)/g, "").substr(0, 30),
                                    url: CONFIG.newsDetail + '?id=' + ID,
                                    title: data.title,
                                    site: data.title,
                                    titleUrl: CONFIG.newsDetail + '?id=' + ID,
                                    siteUrl: CONFIG.newsDetail + '?id=' + ID,
                                    imageUrl: data.imgUrl1 ? data.imgUrl1 : CONFIG.shareImg
                                };
                                // 初始化滚动条
                                renderEvent.renderScroll();
                                mescroll.triggerUpScroll();
                            }
                        },
                        fail: function(res) { //请求失败回调
                            common.mask(false);
                            $('.wrap').hide();
                            $('#sorry').removeClass('hide');
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                common.toast('网络无法连接，请检查您的网络');
                            }
                        }
                    });

                },
                /**
                 * 渲染推荐资讯
                 * @param {[object]} [data] [列表数据][最多五条]
                 */
                renderNews: function(data) {
                    // if (CPAGE == 1) {
                    //     $(".city-news").empty();
                    // }
                    if (!$.isEmptyObject(data)) {
                        var list = data;
                        for (var i = 0, len = list.length; i < len; i++) {
                            var obj = list[i],
                                imgUrl1 = obj.imgUrl1, // 资讯图片1
                                imgUrl2 = obj.imgUrl2, // 资讯图片2
                                imgUrl3 = obj.imgUrl3; // 资讯图片3
                            // if (obj.clickCount) {
                            //     if (obj.clickCount > 9999) {
                            //         obj.clickCount = '9999+';
                            //     }
                            // } else {
                            //     obj.clickCount = 0;
                            // }
                            obj.releaseTime = common.getTimeRange(obj.releaseTime);
                            if (imgUrl1 && imgUrl2 && imgUrl3) {
                                obj.tag = 3;
                                obj.imgUrl1 = imgUrl1 + common.getListImgSize(4.8*2, 0.75) + '?crosscache=1';
                                obj.imgUrl2 = imgUrl2 + common.getListImgSize(4.8*2, 0.75) + '?crosscache=1';
                                obj.imgUrl3 = imgUrl3 + common.getListImgSize(4.8*2, 0.75) + '?crosscache=1';
                            } else if (imgUrl1 || imgUrl2 || imgUrl3) {
                                obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + common.getListImgSize(4.7*2, 0.75) + '?crosscache=1';
                                obj.tag = 1;
                            } else {
                                obj.tag = 0;
                            }
                        }
                        var tmpl = fly.template('notifyTmpl', list);
                        $(".city-news").append(tmpl);

                        $("img.lazy", $(".city-news li.unloaded")).lazyload({
                            container: $("#wrapper"),
                            threshold: 400,
                            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAYAAAA3d5OIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5NDFERjlDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5NDFERkFDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDk0MURGN0MyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDk0MURGOEMyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsaTlT0AAAToSURBVHja7N1LbttWFIBh6mFbsOVOu4yiC+mwaYpuIcvxDooCDZpZVpJlJAOP6rdll0cQU1doLFq694o0vw8g0jhpIjP6zXMpUh6dn59XT/xQb+/q7ad6+74CtvW53j7W21m9fWo+OFoFN6m3P+rtF/sJkntfb7/V22K6+oDYIJ9oa1xvb8arMVJskNfP0dp4tWYD8nsXwb21H6CI5Ug5tx+giO/G9gGUIzgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHggMEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOBAcIDgQHAgOEBwIDhAcCA4QHAgOBAcsKupXdB/t7e3y22xWFSj0aiaTCbVbDZb/ojgSOji4qK6u7v7+vPHx8fq4eFh+bHj4+Pq8PDQTjJSksL19fV/Ylt3eXm5POohOBK4ublJ8nsQHBvEkSvGx03u7+/tLMGB4OjTP9x4vDwjuYkzlYIjgYitzRnIo6MjO0twpLDptbb49enUKz9d4l+j50e5+Xy+PBMZL3zH62/NGBmxHRwc2EmCI3V0EVdszVnLNms7BEeC+LCGAwQHghukWHvFFSHNSQ+s4cgkLkCOrRFnFuMqf+sxRzgyxxbi6v+45QbBkVCEtR5bI8bLb/0aguOFYq0W96ptOvo9d68bgqOlGBnb3FoTUeY8keJkTXlOmhR2dXXV+i7sCCLiPD09Tf444lKweCxN+E7WOMK9ynXbS+/AjjgjjNSPI46eT4+y8bHUfw+C6/S67Vuai5NzP47m3b8QXK81o2GbdVuKUXSX9WP8PdZ0ghvMuu25aNfHwJdq8y5e8ecbLQXXWynHtF3Wcy95HLGeM1oKrndynPDYJuBtHofRUnCDW7ftMhruOoo2/x+C64XcL1q3jXmX9WO8KO6NZAXXefEkzX1ZVpuXGVKsH+MSM6Ol4DorjgqlzvI990J6HNVSjIRGS8F1et1W+skZca+/nXmzfkz5RcRoKbjOiSf5Psav9ZMiOdaPqV54FxxJxFpnX984I+Jqjmg5149GS8F1Zt227xtG4zFEEDnXj3GEc2Os4Pbq6dFl30pcHRLBGS0Ftze7Xt/Y188ZwRX3f2cIh8BoKbjitrmZ9DXZ50kiwQ1w3WasGuY4LbjCcl6U3McvPEZLwWVftzlL968Yq42WgsvCe34YLQVXSI6bSV/TaGnfCM66rfDR32gpuGQjk3vCjJaCK3RSwHv8Gy0FZ93W2dHSFyjBbb1uw2gpOOu2zn+xciWO4Frzvdl2581kBdeK7z6ajjeTFdyzunQz6WsZLZ10EpzFvtFScF0Yf1wpYbQUXKGvwt53Me9o6ayl4L6u2zwZ8vNmsoJbclFyOb5PwcCD85Zv5UfLoZ+1HHRwRpz9jJaCg1JPuPGwn3LTIX/yJycnxso1o9Eo2587mUyq2WwmuMF+8tNpNZ/PVYaREgQHCA4EBwgOBAeCAwQHggMEB4IDwQGCA8EBggPBAYIDwYHgAMGB4ADBgeBAcIDgQHCA4EBwgOBAcCA4QHAgOEBwIDgQHCA4EBwgOBAcCM4uAMGB4ADBQa+C+9tugCI+R3B/2g9QxMcI7sx+gCLOIrhP9faXfQFZfYjWmpMmv9bbe/sEsogD2tv4jya4xeoDP9bb7/X2xT6CnXxZtRRNvVk1Vv0jwABSdjl9DH5YIgAAAABJRU5ErkJggg=="
                        });
                        $(".city-news li").removeClass('unloaded');

                        // 去除最后个下划线
                        var len = $(".city-news").children().length;
                        $(".news-banner").eq(len-1).css('background','none');
                    } else {
                        $('.home-news').addClass('hide');
                    }
                },
                /**
                 * 渲染评论列表
                 */
                renderComment: function(data) {
                    if (!$.isEmptyObject(data) && data.rows.length > 0) {
                        var dataList = common.clone(data.rows);
                        common.addAll(dataList, commentList);
                        var showlist = dataHandle.commentDataHandle(data.rows),
                            showUl = $(".news-comment-ul");

                        var tmpl = fly.template('commentTmpl', showlist);
                        showUl.append(tmpl);
                        if (data.total > 999) {
                            $('.info-comment-num').children()[1].innerHTML = '999+';
                        } else {
                            $('.info-comment-num').children()[1].innerHTML = data.total;
                        }
                        // 去除最后个下划线
                        var len = showUl.children().length;
                        showUl.children().eq(len-1).removeClass('common-border');
                    }
                }
            },
            /**
             * 请求模块
             */
            requestEvent = {
                /**
                 * 获取用户ID
                 */
                getUserId: function(callback) {
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(data) {
                            requestEvent.initUserData(data);
                            callback && callback();
                        }
                    });
                },
                /**
                 * 用户数据初始化
                 */
                initUserData: function(data) {
                    data.token ? TOKEN = data.token : TOKEN = '';
                    data.id ? userId = data.id : userId = '';
                    data.nickname ? userName = data.nickname : userName = '';
                    data.pictureUrl ? userImage = data.pictureUrl : userImage = '';
                },
                /**
                 * 获取设备id
                 */
                getDevice: function(callback) {
                    croods.customPlugin({
                        action: 'UserPlugin.getDevice',
                        params: {},
                        success: function(data) {
                            DEVICE = data.deviceId;
                            callback && callback();
                        }
                    });
                },

                /**
                 * 获取相关资讯数据
                 */
                requestNewData: function() {
                    croods.ajax({
                        method: '22fe9b533be04bfe88b070eaef5fa1b7',
                        params: {
                            cid: ID
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            res = JSON.parse(res);
                            var data = res.data;
                            if (data && data.length > 0) {
                                for(var i = 0; i < data.length; i++) {
                                    var content = data[i].content;
                                    if(content) {
                                        data[i].content = content.replace(/(^\s*)|(\s*$)/g,"");
                                    }
                                }
                                renderEvent.renderNews(data);
                            } else {
                                $('.home-news').addClass('hide');
                            }
                        },
                        fail: function(res) { //请求失败回调
                            $('.home-news').addClass('hide');
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                $('.home-news').addClass('hide');
                            }
                        }
                    });
                },
                /**
                 * 评论需要登录
                 */
                checkAndRequestCommet: function() {
                    if (navigator.userAgent.indexOf('iflytek_mmp') < 0) {
                        // 非讯飞平台不请求评论数据
                        return;
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                requestEvent.requestCommetList();
                            }
                        }
                    });
                },
                /**
                 * 获取评论列表数据
                 */
                requestCommetList: function() {
                    croods.ajax({
                        method: 'fef0e7d6abe64fbe9716c9651148540b',
                        params: {
                            currentPageNo: CPAGE,
                            majorId: ID, //资讯id
                            pageSize: "10",
                            token: TOKEN,
                            deviceId: DEVICE,
                            osType: OS
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            res = JSON.parse(res);
                            var data = res.data;
                            if (data && data.rows) {
                                if ((CPAGE == 1) && (data.rows.length == 0)) {
                                    $('.news-comment').addClass('hide');
                                    mescroll.endErr();
                                    return;
                                } 
                                $('.news-comment').removeClass('hide');
                                
                                mescroll.endByPage(data.rows.length, data.totalPageCount);
                                renderEvent.renderComment(data);
                            } else {
                                if(CPAGE == 1) {
                                    $('.news-comment').addClass('hide');
                                }
                                mescroll.endSuccess();
                            }
                        },
                        fail: function(res) { //请求失败回调
                            mescroll.endErr();
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                mescroll.endErr();
                            }
                        }
                    });                    
                }
            },
            eventHandle = {
                touchMoveEvent: function(e) {
                    var self = $(this);
                    clientX1 = e.originalEvent.touches[0].clientX;
                    clientY1 = e.originalEvent.touches[0].clientY;

                    timeout = setTimeout(function(e){  
                        var text = self.innerText;
                        var input = self.parent().next();
                        input.value = text; // 修改文本框的内容
                        input.select(); // 选中文本
                        document.execCommand("copy"); // 执行浏览器复制命令

                    }, 800);  //长按时间超过800ms，则执行传入的方法  
                },
                longPressEnd: function(e) {
                    var self = $(this);
                    clientX2 = e.originalEvent.touches[0].clientX;
                    clientY2 = e.originalEvent.touches[0].clientY;

                    var x1 = (clientX1 == clientX2),
                        y1 = (clientY1 == clientY2);
                        if(!x1 || !y1) {
                            clearTimeout(timeout);
                        }
                },
                longPress: function(e) {
                    clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法 
                },
                /**
                 * 收藏事件
                 */
                collectionClickEvent: function() {
                    var code,
                        obj;
                    if (isCollection == false) { //未收藏
                        code = '5f22f7a03b89447eba15ad12849bbc79';
                        obj = {
                            token: TOKEN,
                            resId: ID
                        };
                    } else { //已收藏
                        code = 'ebf9c5e93faa499d9daf914f5c80bf3d';
                        obj = {
                            token: TOKEN,
                            resIds: ID
                        };
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                croods.customPlugin({
                                    action: 'UserPlugin.isLogin',
                                    params: common.packData({}, '', '1', '', ''),
                                    success: function(res) {
                                        croods.ajax({
                                            method: code,
                                            params: obj,
                                            //请求参数
                                            success: function(res) { //请求成功回调
                                                if (common.checkToken(res, function(newToken) {
                                                   TOKEN = newToken;
                                                   eventHandle.collectionClickEvent(newToken);
                                                   collectionIndex++;
                                                }, collectionIndex)) {
                                                    res = $.parseJSON(res);
                                                    if (res.flag) {
                                                        if (isCollection == false) {
                                                            isCollection = true;
                                                            $('.collection-btn').attr('data-collection', 'true');
                                                            $('.collection-btn').css({
                                                                background: "url('" + CONFIG.path + "/img/news-detail/already_collection2.png') center center no-repeat",
                                                                backgroundSize: '0.75rem 0.71rem'
                                                            });
                                                            common.toast('已添加到我的收藏');
                                                        } else {
                                                            isCollection = false;
                                                            $('.collection-btn').attr('data-collection', 'false');
                                                            $('.collection-btn').css({
                                                                background: "url('" + CONFIG.path + "/img/news-detail/collection2.png') center center no-repeat",
                                                                backgroundSize: '0.75rem 0.71rem'
                                                            });
                                                        }
                                                    } else {
                                                        if (isCollection) {
                                                            common.toast('收藏失败');
                                                        } else {
                                                            common.toast('取消收藏失败');
                                                        }
                                                    }
                                                }
                                            },
                                            fail: function(res) { //请求失败回调
                                                if (isCollection) {
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
                    
                },
                /**
                 * 隐藏头部分享和收藏按钮
                 */
                hideHeaderMoreClickEvent: function(e) {
                    $(e.currentTarget).addClass('hide');
                },
                /**
                 * 分享事件
                 */
                shareClickEvent: function(e) {
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
             
                                if(flag) {
                                    vm.set('OP', options);
                                    flag = false;
                                }
                                eventHandle.callShare(this, e);
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
                },
                /**
                 * 资讯点赞
                 */
                likeClickEvent: function() {
                    if (platForm) {
                        // common.mask(true);
                        // $('.invisible-mask').show();
                        //$('.blank').show();
                        var obj = {
                                objId: ID, // 资讯ID
                                deviceId: DEVICE, // 设备ID
                                token: TOKEN, // 用户登录的TOKEN
                                osType: OS // 终端类型IOS Android
                            },
                            code,
                            dom = $(this).parent()[0].className.split(' ')[1];

                        if (isLike == false) { //未点赞
                            code = '3140ce2df226465ca46260b7b6a4431d';
                            $('.mask-praise').removeClass('hide');
                            setTimeout(function(){
                                $('.mask-praise').addClass('hide');
                            }, 1000);
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
                                            if (common.checkToken(res, function(newToken) {
                                                TOKEN = newToken;
                                                eventHandle.likeClickEvent();
                                                likeIndex++;
                                            }, likeIndex)) {
                                                res = $.parseJSON(res);
                                                if (res.flag) {
                                                    var data = res.data;
                                                    if (isLike == false) {
                                                        if (data != 0) {
                                                            isLike = true;
                                                            $('.zx-zan').attr('data-parise', 'true');
                                                            $('.zx-zan').addClass('zx-zan-select');
                                                            $('.zx-zan').removeClass('zx-zan-unselect');
                                                            
                                                            if (data > 9999) {
                                                                data = '9999+';
                                                            }
                                                            $('.zx-zan').html(data);
                                                            //common.toast('点赞成功！');
                                                        } else {
                                                            common.toast('点赞失败！');
                                                        }
                                                    } else {
                                                        if (data != -1) {
                                                            isLike = false;
                                                            $('.zx-zan').attr('data-parise', 'false');
                                                            $('.zx-zan').removeClass('zx-zan-select');
                                                            $('.zx-zan').addClass('zx-zan-unselect');
                                                            
                                                            if (data > 9999) {
                                                                data = '9999+';
                                                            }
                                                            $('.zx-zan').html(data);
                                                            //common.toast('取消点赞！');
                                                        } else {
                                                            common.toast('取消点赞失败！');
                                                        }
                                                    }
                                                } else {
                                                    if (isLike) {
                                                       common.toast('取消点赞失败！');
                                                    } else {
                                                       common.toast('点赞失败！');
                                                    }
                                                }
                                            } else {
                                                likeIndex = 1;
                                            }
                                        },
                                        fail: function(res) { //请求失败回调
                                           if (parise) {
                                               common.toast('取消点赞失败！');
                                            } else {
                                               common.toast('点赞失败！');
                                            }
                                        },
                                        complete: function(res) {
                                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                common.toast('网络无法连接，请检查您的网络');
                                            }
                                            /*if (res.status === 'TIMEOUT') {
                                                common.toast(res.message);
                                            }*/
                                        }
                                    });
                                }
                            }
                        });
                    }
                },
                /**
                 * 评论点赞
                 */
                commentZanClick: function(e) {
                    var isLike = false,
                        zanDom = $(this).children().eq(1),
                        code = '',
                        major = zanDom.data('id'),
                        obj = {
                                objId: major, // 评论ID
                                deviceId: DEVICE, // 设备ID
                                token: TOKEN, // 用户登录的TOKEN
                                osType: OS // 终端类型IOS Android
                            };
                        
                    // 未点赞状态，点击请求点赞接口
                    if (zanDom.hasClass('icon-comment-unzan')) {
                        isLike = false;
                        code = "3140ce2df226465ca46260b7b6a4431d";
                    } else {
                        isLike = true;
                        code = "93f0150736934e958f51b19e929ee46c";
                    }

                    croods.getNetworkType({
                            success: function(res) { //请求成功回调
                                if (res.network == 'none') { 
                                    common.toast('网络无法连接，请检查您的网络');
                                } else {
                                    croods.ajax({
                                        method: code,
                                        params: obj,
                                        //请求参数
                                        success: function(res) { //请求成功回调
                                            res = $.parseJSON(res);
                                            if (res.flag) {
                                                var data = res.data;
                                                if (isLike == false) {
                                                    if (data != 0) {
                                                        zanDom.removeClass('icon-comment-unzan');
                                                        zanDom.addClass('icon-comment-zaned');
                                                        zanDom.prev()[0].innerHTML = data;
                                                        if (zanDom.prev().hasClass('hide')) {
                                                            zanDom.prev().removeClass('hide');
                                                        }
                                                        //common.toast('点赞成功！');
                                                    } else {
                                                        common.toast('点赞失败！');
                                                    }
                                                } else {
                                                    if (data != -1) {
                                                        zanDom.removeClass('icon-comment-zaned');
                                                        zanDom.addClass('icon-comment-unzan');
                                                        zanDom.prev()[0].innerHTML = data;
                                                        // 数字为0的时候不显示
                                                        if (data == 0) {
                                                            zanDom.prev().addClass('hide');
                                                        }
                                                        //common.toast('取消点赞！');
                                                    } else {
                                                        common.toast('取消点赞失败！');
                                                    }
                                                }
                                            } else {
                                                if (isLike) {
                                                    common.toast('取消点赞失败！');
                                                } else {
                                                    common.toast('点赞失败！');
                                                }
                                            }
                                        },
                                        fail: function(res) { //请求失败回调
                                           if (isLike) {
                                               common.toast('取消点赞失败！');
                                            } else {
                                               common.toast('点赞失败！');
                                            }
                                        },
                                        complete: function(res) {
                                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                common.toast('网络无法连接，请检查您的网络');
                                            }
                                        }
                                    });
                                }
                            }
                        });

                    e.stopPropagation();
                },
                /**
                 * 评论提交
                 */
                 submitComment: function(e) {
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.customPlugin({
                                    action: 'UserPlugin.isLogin',
                                    params: common.packData({}, '', '1', '', ''),
                                    success: function(res) {
                                        // requestEvent.initUserData(res);
                                        requestEvent.getUserId(function() {
                                            var parm = {};
                                            if(isZXComment) {
                                                parm.majorId = ID;
                                                parm.toCommentId = "";
                                            } else {
                                                parm.majorId = "";
                                                parm.toCommentId = toCommentId;
                                            }
                                            eventHandle.submitCommentByType(parm);
                                        });
                                    }
                                });
                            }
                        }
                    });
                    e.stopPropagation();
                },

                /**
                 * 组装数据后评论提交
                 */
                submitCommentByType: function(data) {
                    var content = $('.input-comment-select').val(),
                        majorId = data.majorId,
                        toCommentId = data.toCommentId,
                        obj = {
                                content: content,   // 评论内容
                                token: TOKEN,       // 用户登录的TOKEN
                                osType: OS,         // 终端类型IOS Android
                                majorId: ID,        // 资讯id
                                isAdmin: "0",       // 是否是管理员
                                toCommentId: toCommentId     // 评论ID
                            };
                    submitContent = obj;
                    if (!content) {
                        common.toast('评论内容不能为空！');
                        return;
                    }
                        croods.getNetworkType({
                            success: function(res) { //请求成功回调
                                if (res.network == 'none') { 
                                    common.toast('网络无法连接，请检查您的网络');
                                }else {
                                    croods.ajax({
                                        method: "c3baa62576294992ba3c049cf4d49392",
                                        params: obj,
                                        //请求参数
                                        success: function(res) { //请求成功回调
                                            if (common.checkToken(res, function(newToken) {
                                                eventHandle.submitComment();
                                                commentIndex++;
                                                TOKEN = newToken;
                                            }, commentIndex)) {
                                                isZXComment = true;
                                                $('.input-comment-select').val('');
                                                common.toast('评论提交成功！');
                                                // eventHandle.addToCommentList();
                                            }
                                        },
                                        fail: function(res) { //请求失败回调
                                            isZXComment = true;
                                            common.toast('评论提交失败！');
                                        },
                                        complete: function(res) {
                                            isZXComment = true;
                                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                common.toast('网络无法连接，请检查您的网络');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                },
                /**
                 * 删除确认
                 */
                deleteCommentConfirm: function() {
                    var handleDom = $('.comment-handle');
                    if (!handleDom.hasClass('hide')) {
                        handleDom.addClass('hide');
                    }
                    $('.mark').removeClass('hide');
                },
                
                /**
                 * 遮罩消失
                 */
                dismissMask: function() {
                    $('.common-mask').addClass('hide');
                    $('.comment-handle').addClass('hide');
                },
                /**
                 * 未评论时的点击评论右侧
                 */
                commentScroll: function(data) {
                    commentTop = $('.news-main').height() + $('.home-news').height() + $('.header-item').height();
                    $('.info-comment-num').addClass('hide');
                    $('.info-comment-zan').removeClass('hide');
                    mescroll.scrollTo(commentTop);
                },
                /**
                 * 未评论时的点击评论右侧(全文)
                 */
                scrollToTop: function(data) {
                    $('.info-comment-zan').addClass('hide');
                    $('.info-comment-num').removeClass('hide');
                    mescroll.scrollTo(0);
                },
                /**
                 * 网警头条列表项点击事件
                 */
                newsClick: function() {
                    var id = $(this).data('id'),
                        request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=news-detail.html?id=' + id); // 对接口请求数据封装
                    $(this).addClass('visited');
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: request,
                        success: function(res) {}
                    });
                },
                /**
                 * 评论列表项点击事件
                 */
                commentListClick: function(e) {
                    clickDom = $(this);
                    toCommentId = $(this).data('id');
                    fromUser = $(this).data('title');
                    // key只能是小写
                    fromUserName = $(this).data('fromusername');
                    isZXComment = false;
                    if (fromUser && fromUser == userId) {
                        $('.common-mask').removeClass('hide');
                        $('.comment-handle').removeClass('hide');
                        // input默认字更改
                        $('.input-comment-select').attr('placeholder',"写下你的评论...");
                    } else {
                        eventHandle.showCommentInput();
                        $('.input-comment-select').attr('placeholder',"回复"+fromUserName+"的评论");
                    }
                    e.stopPropagation();
                },
                /**
                 * 点击回复
                 */
                handleReply: function() {
                    $('.comment-handle').addClass('hide');
                    $('.common-mask').addClass('hide');
                    eventHandle.showCommentInput();
                },
                getCommentFocus: function() {
                    isZXComment = true;
                    eventHandle.showCommentInput();
                    $('.input-comment-select').attr('placeholder',"写下你的评论...");
                },
                /**
                 * 显示真正的评论输入框
                 */
                showCommentInput: function() {
                    $('.comment-input-select').removeClass('hide');
                    $('.comment-input-unselect').addClass('hide');
                    $('.input-comment-select').focus();
                    $('.comment-input').blur();
                },
                /**
                 * 隐藏真正的评论输入框
                 */
                hideCommentInput: function() {
                    $('.comment-input-unselect').removeClass('hide');
                    $('.comment-input-select').addClass('hide');
                },
                /**
                 * 新增评论后，刷新列表
                 */
                addToCommentList: function() {
                    var defaultp = './public/wcportal/0.0.1/img/my/default-photo.png',
                        imgerr = "javascript:this.src=" + defaultp + ";";
                    $(".news-comment-ul").before("<div class='score-way-content common-border add-commnet'><img src="+userImage+" onerror="+imgerr+" class='fl people-first'/><div class='score-way-detail'><span class='comment-nikename f28 c6'>"+userName+"</span><span class='icon-comment-num f28 fr c6'>待审核</span><p class='comment-time f28 c6'>刚刚</p><p class='comment-content f30 c0 three-ell'>"+submitContent.content+"</p></div></div>");
                },
                /**
                 * 点击内容中的全文
                 */
                contentMore: function(e) {
                    var index = $(this).parent().data('index'),
                        childIndex = $(this).parent().data('childindex'),
                        realContent = '';
                    if (childIndex || childIndex == 0) {
                        childIndex = $(this).closest('li').index();
                        index = $(this).closest('.comment-parent').index();

                        var replyitem = commentList[index].replyList[childIndex];
                        realContent = "回复" + replyitem.toUserName + "：" + replyitem.content;

                    } else {
                        index = $(this).closest('li').index();
                        realContent = commentList[index].content;
                    }
                    $(this).prev().html(realContent);
                    $(this).addClass('hide');
                    $(this).next().removeClass('hide');
                    e.stopPropagation();
                },
                /**
                 * 点击内容中的收起
                 */
                contentPack: function(e) {
                    var index = $(this).parent().data('index'),
                        childIndex = $(this).parent().data('childindex'),
                        realContent = '',
                        showContent = '';
                    if (childIndex || childIndex == 0) {
                        childIndex = $(this).closest('li').index();
                        index = $(this).closest('.comment-parent').index();

                        var replyitem = commentList[index].replyList[childIndex],
                            head = "回复" + replyitem.toUserName + "：",
                            contentlen = common.getLength(head);
                        showContent = head + common.cutstr(replyitem.content, showContentlen-contentlen) + '...';
                    } else {
                        index = $(this).closest('li').index();
                        realContent = commentList[index].content;
                        // if (realContent.length > maxContentLen) {
                            showContent = common.cutstr(realContent, showContentlen) + '...';
                        // }
                    }
                    
                    $(this).prev().prev().html(showContent);
                    $(this).addClass('hide');
                    $(this).prev().removeClass('hide');
                    e.stopPropagation();
                },
                /**
                 * 展示更多的评论回复
                 */
                addToReplyComment: function(e) {
                    var all = $(this).data('collection'),
                        index = $(this).closest('li').index();
                    var replyDom = $(this).parent().children().eq(0), // ul元素
                        addList = dataHandle.getMoreReply(index, all),
                        defaultimg = './public/wcportal/0.0.1/img/my/default-photo.png',
                        imgerr = "javascript:this.src="+defaultimg+";",
                        moreCount = 0;
                    for (var i = 0, len = addList.length; i < len; i++) {
                        var replyitem = common.clone(addList[i]),
                            showCount = '',
                            icon;
                        if (replyitem.map.priseCount > 0) {
                            showCount = replyitem.map.priseCount;
                        }
                        if (replyitem.map.isPrise == "0") {
                            icon = 'icon-comment-unzan';
                        } else {
                            icon = 'icon-comment-zaned';
                        }
                        // 头像处理
                        if (!replyitem.fromUserImage) {
                            replyitem.fromUserImage = defaultimg;
                        }
                        replyitem.createTime = common.getZXTimeRange(replyitem.createTime);
                        var head = "回复" + replyitem.toUserName + "：",
                            headlen = common.getLength(head),
                            moreshow = '';
                            if (common.getLength(replyitem.content) > maxContentLen2) {
                                var showContent = head + common.cutstr(replyitem.content, showContentlen-headlen) + '...';
                                replyitem.content = showContent;
                                replyitem.contentMore = true;
                                moreshow = '';
                            } else {
                                replyitem.content = "回复" + replyitem.toUserName + "：" + replyitem.content;
                                replyitem.contentMore = false;
                                moreshow = 'hide';
                            }

                        all.push(replyitem);
                        replyDom.append("<li><div class='score-way-item' data-id="+replyitem.replyId+" data-title="+replyitem.fromUser+" data-fromUserName="+replyitem.fromUserName+"><img src="+replyitem.fromUserImage+" onerror="+imgerr+" class='people-second'><div class='score-way-detail'><span class='comment-nikename f26 c6'>"+replyitem.fromUserName+"</span><div class='comment-zan-div'><span class='icon-comment-num f26 fr c6'>"+showCount+"</span><span class='icon-comment "+icon+" fr' data-id="+replyitem.replyId+"></span></div><p class='comment-time f26 c6'>"+replyitem.createTime+"</p><p class='f28 c0' data-index=1 data-childindex=1><span class='comment-content'>"+replyitem.content+"</span><span class='content-more "+moreshow+"'>全文</span><span class='content-pack hide'>收起</span></p></div></div></li>");
                        $(".people-second").off('error').on('error', function() {
                            $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                        });
                    }
                    moreCount = commentList[index].replyList.length - replyDom.children().length;
                    if (moreCount <= 0) {
                        $(this).hide();
                    } else {
                        $(this).children().eq(0).html(moreCount)
                    }
                    $(this).attr('data-collection', all);
                    e.stopPropagation();
                },

            },
            /**
             * 数据处理
             */
            dataHandle = {
                /**
                 * 处理回复数据
                 */
                handleAddReplyData: function(data) {

                },
                /**
                 * 处理评论列表一手数据
                 */
                commentDataHandle: function(data) {
                    var showlist = new Array();
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        showlist.push(item);
                        showlist[i].realChildren = item.replyList.length;

                        // 设置只显示三行，多了显示“全文”
                        // var contentlen = item.content.length;
                        // if (contentlen > maxContentLen) {
                        //     var showContent = item.content.substring(0, maxContentLen) + '...';
                        //     showlist[i].content = showContent;
                        //     showlist[i].contentMore = true;
                        // } else {
                        //     showlist[i].contentMore = false;
                        // }

                        if (common.getLength(item.content) > maxContentLen2) {
                            var showContent = common.cutstr(item.content, showContentlen) + '...';
                            showlist[i].content = showContent;
                            showlist[i].contentMore = true;
                        } else {
                            showlist[i].contentMore = false;
                        }

                        if (item.replyList && item.replyList.length > 3) {
                            showlist[i].replyList = item.replyList.slice(0, 3);
                        }
                        showlist[i].replyListArr = JSON.stringify(item.replyList);
                        // 修改时间显示
                        showlist[i].createTime = common.getZXTimeRange(item.createTime);
                        // 修改文本显示
                        for (var j = 0, replylen = item.replyList.length; j < replylen; j++) {
                            // 修改时间显示
                            showlist[i].replyList[j].createTime = common.getZXTimeRange(item.replyList[j].createTime);
                            // 设置只显示三行，多了显示“全文”
                            // var len2 = item.fromUserName.length + 3,
                            //     contentlen = item.replyList[j].content.length + len2;
                            // if (contentlen > maxContentLen) {
                            //     var showContent = "回复" + item.fromUserName + "：" + item.replyList[j].content.substring(0, maxContentLen-len2) + '...';
                            //     showlist[i].replyList[j].content = showContent;
                            //     showlist[i].replyList[j].contentMore = true;
                            // } else {
                            //     showlist[i].replyList[j].content = "回复" + item.fromUserName + "：" + item.replyList[j].content;
                            //     showlist[i].replyList[j].contentMore = false;
                            // }

                            var head = "回复" + item.fromUserName + "：",
                                headlen = common.getLength(head);
                            if (common.getLength(item.replyList[j].content) > maxContentLen2) {
                                var showContent = head + common.cutstr(item.replyList[j].content, showContentlen-headlen) + '...';
                                showlist[i].replyList[j].content = showContent;
                                showlist[i].replyList[j].contentMore = true;
                            } else {
                                showlist[i].replyList[j].content = head + item.replyList[j].content;
                                showlist[i].replyList[j].contentMore = false;
                            }
                        }
                    }
                    return showlist;
                },
                /**
                 * 点击更多，获取额外十条数据
                 */
                getMoreReply: function(index, data) {
                    var len = data.length,
                        showLen = commentList[index].replyList.length,
                        moreList;
                    if (showLen - len > 10) {
                        moreList = commentList[index].replyList.slice(len, len+10);
                    } else {
                        moreList = commentList[index].replyList.slice(len, showLen);
                    }
                    return moreList;
                },
            },
            addEvent = function() {
                // 点击遮罩 隐藏分享、收藏按钮
                // $('.wrap').off('.share-bomb-mask').on('click','.share-bomb-mask',eventHandle.hideHeaderMoreClickEvent);

                // 资讯点赞
                $('.wrap').off('.zx-zan').on('click', '.zx-zan', eventHandle.likeClickEvent);

                // 分享点击
                $('.header-item').off('.share-btn').on('click', '.share-btn', eventHandle.shareClickEvent);

                // 收藏点击
                $('.header-item').off('.collection-btn').on('click', '.collection-btn', eventHandle.collectionClickEvent);

                // 视频播放点击事件
                $('.wrap').off('img.play').on('click', 'img.play', function(e) {
                    $('.vedio-pop').empty();
                    var data = {};
                    data.src = '<iframe src=' + $(this).attr('data-linkurl') + ' frameborder=0 "allowfullscreen"></iframe>';
                    var tmpl = fly.template('urlTmpl', data);
                    $('.vedio-pop').append(tmpl);
                    $('.url-wrapper').html(data.src);
                    croods.customPlugin({
                        action: 'VotePlugin.noticePlay',
                        params: {},
                        success: function(data) {}
                    });
                });

                // 点击阴影部分消失
                $('.vedio-pop').off('.full-bg').on('click', '.full-bg', function() {
                    $(this).parent().empty();
                });

                // 推荐资讯列表点击
                $('.wrap').off('.city-news li').on('click', '.city-news li', eventHandle.newsClick);

                // 评论列表点击、 评论子列表点击
                $('.wrap').off('.news-comment-ul .score-way-content, .comment-child-ul .score-way-item').on('click', '.news-comment-ul .score-way-content, .comment-child-ul .score-way-item', eventHandle.commentListClick);
                // 评论子列表点击
                // $('.wrap').off('.comment-child-ul .score-way-content').on('click', '.comment-child-ul .score-way-content', eventHandle.commentListClick);
                // 长按删除touch事件
                // $('.wrap').off('.comment-content').on('touchstart','.comment-content', eventHandle.longPress);
                // // touchmove事件
                // $('.wrap').off('.comment-content').on('touchmove','.comment-content', eventHandle.touchMoveEvent);
                // // 长按结束
                // $('.wrap').off('.comment-content').on('touchend','.comment-content', eventHandle.longPressEnd);


                
                // 评论列表中点赞点击
                $('.wrap').off('li .comment-zan-div').on('click', 'li .comment-zan-div', eventHandle.commentZanClick);

                // 评论输入框（软键盘显示）
                $('.wrap').off('.comment-input').on('focus', '.comment-input', eventHandle.getCommentFocus);
                // 评论输入框（软键盘消失）
                $('.wrap').off('.input-comment-select').on('blur', '.input-comment-select', eventHandle.hideCommentInput);
                // 提交评论
                $('.wrap').off('.comment-submit').on('touchend', '.comment-submit', eventHandle.submitComment);
                // 操作回复
                $('.wrap').off('.handle-reply').on('click', '.handle-reply', eventHandle.handleReply);
                // 操作删除
                $('.wrap').off('.handle-delete').on('click', '.handle-delete', eventHandle.deleteCommentConfirm);
                // 遮罩点击
                $('.wrap').off('.common-mask').on('click', '.common-mask', eventHandle.dismissMask);
                // 未评论时的点击评论右侧（评论）
                $('.wrap').off('.info-comment-num').on('click', '.info-comment-num', eventHandle.commentScroll);
                // 未评论时的点击评论右侧（全文）
                $('.wrap').off('.info-comment-zan').on('click', '.info-comment-zan', eventHandle.scrollToTop);
                // 点击加载更多
                $('.wrap').off('.child-more-text').on('click', '.child-more-text', eventHandle.addToReplyComment);
                // 评论内容中的“全文”
                $('.wrap').off('.content-more').on('click', '.content-more', eventHandle.contentMore);
                // 评论内容中的“收起”
                $('.wrap').off('.content-pack').on('click', '.content-pack', eventHandle.contentPack);
                
                
                // 软键盘消失监听
                $(window).resize(function(){
                   var thisHeight = $(this).height();
                    if(winHeight - thisHeight > 50){
                         //当软键盘弹出，在这里面操作
                    }else{
                        //当软键盘收起，在此处操作
                        $('.comment-input-unselect').removeClass('hide');
                        $('.comment-input-select').addClass('hide');
                    }
                });

                if (OS == 'IOS') {
                    var timer = null;
                    $('.input-comment-select').on('focus', function() {
                        clearInterval(timer);
                        var index = 0;
                        timer = setInterval(function() {
                            if(index>5) {
                                $('body').scrollTop(100000);
                                clearInterval(timer);
                            }
                            index++;
                        }, 50)
                    })
                }
                
                
            },
            init = function() {
                //platForm = false //测试

                requestEvent.getDevice(function() {
                    requestEvent.getUserId(function() {
                        renderEvent.getNews(TOKEN);
                        
                    });
                });

                requestEvent.requestNewData();


                // 绑定手机物理返回键
                croods.bindButton({
                    keycode: ['backbutton'],
                    success: function(res) {
                        var shareDom = document.getElementsByClassName('share')[0],
                            shareMask = shareDom.handler.mask.className,
                            handleDom = $('.comment-handle'),
                            markDisplay = $('.mark');
                        if (shareMask.indexOf('show') > -1) {
                            $(shareDom.handler.mask).removeClass('show');
                            $('.mask-share').removeClass('show');
                            $('.share').addClass('d-none');
                            $(".sheet").css({
                                "transform": "translate3d(0,100%,0)",
                                "-webkit-transform": "translate3d(0,100%,0)",
                            });
                        } else if (!handleDom.hasClass('hide')){
                            handleDom.addClass('hide');
                            $('.common-mask').addClass('hide');
                        } else if (!markDisplay.hasClass('hide')){
                            markDisplay.addClass('hide'); 
                        } else {
                            //  if(jumpType == '1') {
                            //     window.history.back(-1);
                            //     return;
                            // }
                            croods.pageClose({});
                        }
                    }
                });
                

                $('.zx-zan').removeClass('hide');
                $('.share-btn').removeClass('hide');

            };
        fly.bind(document.body, vm);
        common.noNet($('.wrap'), function() {
            $('#wrapper').addClass('hide');
            $('.zx-zan').addClass('hide');
            $('.share-btn').addClass('hide');
            $('.wrap').removeClass('hide');
        }, function() {
            // 初始化
            init();  
        });

        // 绑定点击事件
        addEvent();
    });
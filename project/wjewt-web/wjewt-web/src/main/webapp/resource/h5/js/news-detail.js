'use strict';
$(function () {
    // 页面初始化时创建页面
    var ID = fly.getQueryString('id'), //id
        jumpType = fly.getQueryString('jumpType'),
        jumpPlatType = fly.getQueryString('jumpPlatType'),  // 判断微信公众号还是分享
        winHeight = $(window).height(),
        DEVICE = '', //设备号
        isCollection = false, // 是否收藏
        isLike = false, // 是否点赞
        TOKEN = '',
        mescroll,   // 上拉加载
        flag = true, // 标记是否渲染分享列表
        OS = util.phoneOs(),
        isPC = util.isPC(),
        platForm = util.checkMobilePlatform(),
        OBJ = {},
        CPAGE = 1, // 评论当前页
        commentList = [],   // 评论列表
        commentTop = 0,     // 评论列表的top值，方便滑动的
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
            back: function () {
                platForm ? croods.pageClose({}) : window.history.back(-1);
            },
            refreshClick: function () {
                window.location.reload();
            },
            headerMore: function (e) {
                var dom = $('.share-bomb-mask');
                if (dom.hasClass('hide')) {
                    dom.removeClass('hide');
                } else {
                    dom.addClass('hide');
                }
            }
        }),
        /**
         * 渲染模块
         */
        renderEvent = {
            /**
             * 加载当前滚动条
             */
            renderScroll: function () {
                mescroll = window.mescroll = new MeScroll('wrapper', {
                    down: {
                        isLock: true,
                        use: false
                    },
                    up: { // 上拉配置
                        noMoreSize: 10,
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        callback: function (page, mescroll) {
                            CPAGE = page.num;
                            // 请求评论列表
                            requestEvent.requestCommetList();
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
            getNews: function (Token) {
                util.mask(true);
                if (Token) {
                    TOKEN = Token; // 新Token赋值
                }
                fly.$.ajax({
                    url: CONTEXTPATH + '/content/getContentDetail.do',
                    data: {
                        'id': ID, // 资讯ID
                        'token': TOKEN,
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    //请求参数
                    success: function (res) { //请求成功回调
                        util.mask(false);
                        if (!res || res.flag === false || !res.data) {
                            $('.wrap').hide();
                            $('#sorry').removeClass('hide');
                            return false;
                        }
                        $('.wrap').removeClass('hide');
                        var data = res.data;
                        var content = data.content; // 富文本内容
                        data.content = ''; // 解决富文本直接渲染会把标签渲染出来
                        document.title = data.title;    // 设置H5标题

                        if (data.multimediaSource == '1' && data.multimediaType == "0") {
                            data.thumbnailUrl = CONFIG.path + 'images/common/video-default.png'
                        }
                        data.releaseDate = util.getTimeDate(data.releaseDate); // 时间格式化
                        var tmpl = fly.template('newsDetailTempl', data);
                        data.prise ? $('.zx-zan').attr('src', CONFIG.path + 'images/news-detail/icon_zan_select.png') : $('.zx-zan').attr('src', CONFIG.path + 'images/news-detail/icon_zan.png');
                        isLike = data.prise;
                        $('.zx-zan').attr('data-parise', data.prise);
                        if (data.collection) {
                            $('.collection-btn').css({
                                background: "url('" + CONFIG.path + "images/news-detail/already_collection2.png') center center no-repeat",
                                backgroundSize: '0.75rem 0.71rem'
                            });
                        } else {
                            $('.collection-btn').css({
                                background: "url('" + CONFIG.path + "images/news-detail/collection2.png') center center no-repeat",
                                backgroundSize: '0.75rem 0.71rem'
                            });
                        }
                        isCollection = data.collection;
                        $('.collection-btn').attr('data-collection', data.collection);
                        $('.news-main').html(tmpl);
                        if (data.infoSource == '中国警察网') {
                            content = content.replace('&nbsp;&nbsp;&nbsp;', '');
                            var list = content.split('<br>'),
                                str = '';
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i].indexOf('<img') > 0) {
                                    list[i] = $.trim(list[i]);
                                }
                                if ($.trim(list[i])) {
                                    if (i == 0 || i == len - 1) {
                                        str = str + list[i];
                                    } else {
                                        str = str + '<div>' + list[i] + '</div>';
                                    }
                                }
                            }
                            content = str;
                        }

                        $('.news-content').html(content);
                        $(".news-content img").off('error').on('error', function () {
                            $(this).attr('src', CONFIG.path + 'images/home/list-default.png');
                            $(this).css('width', '100%');
                        });
                        $('.zx-zan').html(data.priseCount);
                        // $('.like').removeClass('hide');
                        $('.operation').hide();
                        if (data.multimediaSource == '1' && data.multimediaType == "0") {
                            // if(OS === 'IOS'){
                            //     source = '<a href="'+ data.multimediaUrl + '" class="a-link">'+ data.multimediaUrl + '</a>';
                            // }else{
                            //    source = '<iframe src=' + data.multimediaUrl + ' frameborder=0 "allowfullscreen"></iframe>';
                            // }
                            var source = '<img class="link-img" src="' + CONFIG.path + 'images/common/video-default.png" /><img class="play" src="' + CONFIG.path + 'images/common/play.png" data-linkurl="' + data.multimediaUrl + '" />';
                            $('.video-content').html(source);
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
                    },
                    fail: function (res) { //请求失败回调
                        util.mask(false);
                        $('.wrap').hide();
                        $('#sorry').removeClass('hide');
                    },
                    complete: function (res) {
                        util.mask(false);
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            // util.toast('网络无法连接，请检查您的网络');
                            mescroll.endErr();
                        }
                    }
                });

            },
            /**
             * 渲染推荐资讯
             * @param {[object]} [data] [列表数据][最多五条]
             */
            renderNews: function (data) {
                if (!$.isEmptyObject(data) && data != [] && data.length && data.length > 0) {
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
                        obj.releaseTime = util.getTimeRange(obj.releaseTime);
                        if (imgUrl1 && imgUrl2 && imgUrl3) {
                            obj.tag = 3;
                            obj.imgUrl1 = imgUrl1 + util.getListImgSize(28 * 2, 0.75) + '?crosscache=1';
                            obj.imgUrl2 = imgUrl2 + util.getListImgSize(28 * 2, 0.75) + '?crosscache=1';
                            obj.imgUrl3 = imgUrl3 + util.getListImgSize(28 * 2, 0.75) + '?crosscache=1';
                        } else if (imgUrl1 || imgUrl2 || imgUrl3) {
                            obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + util.getListImgSize(28 * 2, 0.75) + '?crosscache=1';
                            obj.tag = 1;
                        } else {
                            obj.tag = 0;
                        }
                    }
                    var tmpl = fly.template('notifyTmpl', list);
                    $(".city-news").append(tmpl);
                    // $("img.lazy", $(".city-news li.unloaded")).lazyload({
                    //     container: $("#wrapper"),
                    //     threshold: 400,
                    //     placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAYAAAA3d5OIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5NDFERjlDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5NDFERkFDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDk0MURGN0MyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDk0MURGOEMyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsaTlT0AAAToSURBVHja7N1LbttWFIBh6mFbsOVOu4yiC+mwaYpuIcvxDooCDZpZVpJlJAOP6rdll0cQU1doLFq694o0vw8g0jhpIjP6zXMpUh6dn59XT/xQb+/q7ad6+74CtvW53j7W21m9fWo+OFoFN6m3P+rtF/sJkntfb7/V22K6+oDYIJ9oa1xvb8arMVJskNfP0dp4tWYD8nsXwb21H6CI5Ug5tx+giO/G9gGUIzgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHggMEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOBAcIDgQHAgOEBwIDhAcCA4QHAgOBAcsKupXdB/t7e3y22xWFSj0aiaTCbVbDZb/ojgSOji4qK6u7v7+vPHx8fq4eFh+bHj4+Pq8PDQTjJSksL19fV/Ylt3eXm5POohOBK4ublJ8nsQHBvEkSvGx03u7+/tLMGB4OjTP9x4vDwjuYkzlYIjgYitzRnIo6MjO0twpLDptbb49enUKz9d4l+j50e5+Xy+PBMZL3zH62/NGBmxHRwc2EmCI3V0EVdszVnLNms7BEeC+LCGAwQHghukWHvFFSHNSQ+s4cgkLkCOrRFnFuMqf+sxRzgyxxbi6v+45QbBkVCEtR5bI8bLb/0aguOFYq0W96ptOvo9d68bgqOlGBnb3FoTUeY8keJkTXlOmhR2dXXV+i7sCCLiPD09Tf444lKweCxN+E7WOMK9ynXbS+/AjjgjjNSPI46eT4+y8bHUfw+C6/S67Vuai5NzP47m3b8QXK81o2GbdVuKUXSX9WP8PdZ0ghvMuu25aNfHwJdq8y5e8ecbLQXXWynHtF3Wcy95HLGeM1oKrndynPDYJuBtHofRUnCDW7ftMhruOoo2/x+C64XcL1q3jXmX9WO8KO6NZAXXefEkzX1ZVpuXGVKsH+MSM6Ol4DorjgqlzvI990J6HNVSjIRGS8F1et1W+skZca+/nXmzfkz5RcRoKbjOiSf5Psav9ZMiOdaPqV54FxxJxFpnX984I+Jqjmg5149GS8F1Zt227xtG4zFEEDnXj3GEc2Os4Pbq6dFl30pcHRLBGS0Ftze7Xt/Y188ZwRX3f2cIh8BoKbjitrmZ9DXZ50kiwQ1w3WasGuY4LbjCcl6U3McvPEZLwWVftzlL968Yq42WgsvCe34YLQVXSI6bSV/TaGnfCM66rfDR32gpuGQjk3vCjJaCK3RSwHv8Gy0FZ93W2dHSFyjBbb1uw2gpOOu2zn+xciWO4Frzvdl2581kBdeK7z6ajjeTFdyzunQz6WsZLZ10EpzFvtFScF0Yf1wpYbQUXKGvwt53Me9o6ayl4L6u2zwZ8vNmsoJbclFyOb5PwcCD85Zv5UfLoZ+1HHRwRpz9jJaCg1JPuPGwn3LTIX/yJycnxso1o9Eo2587mUyq2WwmuMF+8tNpNZ/PVYaREgQHCA4EBwgOBAeCAwQHggMEB4IDwQGCA8EBggPBAYIDwYHgAMGB4ADBgeBAcIDgQHCA4EBwgOBAcCA4QHAgOEBwIDgQHCA4EBwgOBAcCM4uAMGB4ADBQa+C+9tugCI+R3B/2g9QxMcI7sx+gCLOIrhP9faXfQFZfYjWmpMmv9bbe/sEsogD2tv4jya4xeoDP9bb7/X2xT6CnXxZtRRNvVk1Vv0jwABSdjl9DH5YIgAAAABJRU5ErkJggg=="
                    // });
                    // $(".city-news li").removeClass('unloaded');
                } else {
                    $("#relativeContent").css("display", "none");
                }
            },
            /**
             * 渲染评论列表
             */
            renderComment: function (data) {
                if (!$.isEmptyObject(data)) {
                    commentList = data.rows;
                    var showlist = util.clone(data.rows);
                    dataHandle.commentDataHandle(showlist);

                    var tmpl = fly.template('commentTmpl', showlist);
                    $(".news-comment-ul").append(tmpl);
                    $(".city-news li").removeClass('unloaded');
                }
                commentTop = $('.news-comment').offset().top;
            }
        },
        /**
         * 请求模块
         */
        requestEvent = {
            /**
             * 获取相关资讯数据
             */
            requestNewData: function () {
                fly.$.ajax({
                    url: CONTEXTPATH + "/content/listRelativeContent.do",
                    data: {
                        cid: ID
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    //请求参数
                    success: function (res) { //请求成功回调
                        // res = JSON.parse(res);
                        if (res) {
                            for (var i = 0; i < res.length; i++) {
                                var content = res[i].content;
                                if (content) {
                                    res[i].content = content.replace(/(^\s*)|(\s*$)/g, "");
                                }
                            }
                            renderEvent.renderNews(res);
                        } else {
                        }
                    },
                    fail: function (res) { //请求失败回调
                        // mescroll.endErr();
                        // renderEvent.renderHeader();
                    },
                    complete: function (res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            // if (notifyData) {
                            //     if (CPAGE == 2) {
                            //         $('.empty-news').addClass('hide');
                            //         $('.no-line').removeClass('hide');
                            //     }
                            // } else { // 首次启动
                            //     $(".city-news").empty();
                            //     $('.empty-news').removeClass('hide');
                            // }
                            // mescroll.endErr();
                            // renderEvent.renderHeader();
                        }
                    }
                });
            },
            /**
             * 获取评论列表数据
             */
            requestCommetList: function () {
                fly.$.ajax({
                    url: CONTEXTPATH + '/content/getCommentCheckPage.do',
                    data: {
                        currentPageNo: CPAGE,
                        majorId: ID, //资讯id
                        pageSize: "10",
                        token: TOKEN,
                        deviceId: DEVICE,
                        osType: OS
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    //请求参数
                    success: function (res) { //请求成功回调
                        if (res && res.rows) {
                            for (var i = 0; i < res.rows.length; i++) {
                                var content = res.rows[i].content;
                                if (content) {
                                    res.rows[i].content = content.replace(/(^\s*)|(\s*$)/g, "");
                                }
                            }
                            if ((CPAGE == 1) && (res.rows.length == 0)) {
                                $('.news-comment').addClass('hide');
                            } else {
                                $('.news-comment').removeClass('hide');
                            }
                            mescroll.endByPage(res.rows.length, res.total);
                            renderEvent.renderComment(res);
                        } else {
                            if (CPAGE == 1) {
                                $('.news-comment').addClass('hide');
                            }
                            mescroll.endSuccess();
                        }
                    },
                    fail: function (res) { //请求失败回调
                        mescroll.endErr();
                    },
                    complete: function (res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            mescroll.endErr();
                        }
                    }
                });
            },
        },

        eventHandle = {
            /**
             * 展示更多的评论回复
             */
            addToReplyComment: function () {
                var index = $(this).data('index'),
                    all = $(this).data('collection');
                var replyDom = $(this).parent().children().eq(0), // ul元素
                    addList = dataHandle.getMoreReply(index, all),
                    imgerr = "javascript:this.src='" + CONTEXTPATH + "/resource/h5/images/my/default-photo.png';",
                    moreCount = 0;
                for (var i = 0, len = addList.length; i < len; i++) {
                    var replyitem = addList[i];
                    replyitem.createTime = util.getTimeRange(replyitem.createTime);
                    all.push(replyitem);
                    replyDom.append("<li><div class='score-way-item' data-id=" + replyitem.replyId + " data-title=" + replyitem.fromUser + " data-fromUserName=" + replyitem.fromUserName + "><img src='" + replyitem.fromUserImage + "' onerror=" + imgerr + " class='people-second'><div class='score-way-detail'><span class='comment-nikename f26 c6'>" + replyitem.fromUserName + "</span><p class='comment-time f26 c6'>" + replyitem.createTime + "</p><p class='comment-content f28 c0 three-ell'>" + replyitem.content + "</p></div></div></li>");
                }
                moreCount = commentList[index].replyList.length - replyDom.children().length;
                if (moreCount <= 0) {
                    $(this).hide();
                } else {
                    $(this).children().eq(0).html(moreCount)
                }
                $(this).attr('data-collection', all);

            },
            /**
             * 网警头条列表项点击事件
             */
            newsClick: function () {
                var id = $(this).data('id');
                $(this).addClass('visited');
                window.location.href = CONTEXTPATH + "/h5/news-detail.do?id=" + id;
            }
        },
        /**
         * 数据处理
         */
        dataHandle = {
            commentDataHandle: function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    item.realChildren = item.replyList.length;
                    if (item.replyList && item.replyList.length > 3) {
                        item.replyList = item.replyList.slice(0, 3);
                    }
                    item.replyListData = JSON.stringify(item.replyList);
                    // 修改时间显示
                    item.createTime = util.getTimeRange(item.createTime);
                    // 修改时间显示
                    for (var j = 0, replylen = item.replyList.length; j < replylen; j++) {
                        item.replyList[j].createTime = util.getTimeRange(item.replyList[j].createTime);
                    }
                }
            },
            getMoreReply: function (index, data) {
                var len = data.length,
                    showLen = commentList[index].replyList.length,
                    moreList;
                if (showLen - len > 10) {
                    moreList = commentList.slice(len, len + 10);
                } else {
                    moreList = commentList.slice(len, showLen);
                }
                return moreList;
            }
        },
        addEvent = function () {
            // 点击遮罩 隐藏分享、收藏按钮
            // $('.wrap').off('.share-bomb-mask').on('click','.share-bomb-mask',eventHandle.hideHeaderMoreClickEvent);

            // 资讯点赞
            // $('.wrap').off('.zx-zan').on('click', '.zx-zan', eventHandle.likeClickEvent);

            // 分享点击
            // $('.header-item').off('.share-btn').on('click', '.share-btn', eventHandle.shareClickEvent);

            // 收藏点击
            // $('.header-item').off('.collection-btn').on('click', '.collection-btn', eventHandle.collectionClickEvent);

            // // 视频播放点击事件
            // $('.wrap').off('img.play').on('click', 'img.play', function (e) {
            //     $('.vedio-pop').empty();
            //     var data = {};
            //     data.src = '<iframe src=' + $(this).attr('data-linkurl') + ' frameborder=0 "allowfullscreen"></iframe>';
            //     var tmpl = fly.template('urlTmpl', data);
            //     $('.vedio-pop').append(tmpl);
            //     $('.url-wrapper').html(data.src);
            //     croods.customPlugin({
            //         action: 'VotePlugin.noticePlay',
            //         params: {},
            //         success: function (data) {
            //         }
            //     });
            // });

            // // 点击阴影部分消失
            // $('.vedio-pop').off('.full-bg').on('click', '.full-bg', function () {
            //     $(this).parent().empty();
            // });

            // 推荐资讯列表点击
            // $('.wrap').off('.city-news li').on('click', '.city-news li', eventHandle.newsClick);

            // 评论列表点击、 评论子列表点击
            // $('.wrap').off('.news-comment-ul .score-way-content, .comment-child-ul .score-way-item').on('click', '.news-comment-ul .score-way-content, .comment-child-ul .score-way-item', eventHandle.commentListClick);
            // 评论子列表点击
            // $('.wrap').off('.comment-child-ul .score-way-content').on('click', '.comment-child-ul .score-way-content', eventHandle.commentListClick);

            // 评论列表中点赞点击
            // $('.wrap').off('li .icon-comment').on('click', 'li .icon-comment', eventHandle.commentZanClick);

            // 评论输入框（软键盘显示）
            // $('.wrap').off('.comment-input').on('focus', '.comment-input', eventHandle.getCommentFocus);
            // 评论输入框（软键盘消失）
            // $('.wrap').off('.input-comment-select').on('blur', '.input-comment-select', eventHandle.hideCommentInput);
            // 提交评论
            // $('.wrap').off('.comment-submit').on('touchend', '.comment-submit', eventHandle.submitComment);
            // 操作回复
            // $('.wrap').off('.handle-reply').on('click', '.handle-reply', eventHandle.handleReply);
            // 操作删除
            // $('.wrap').off('.handle-delete').on('click', '.handle-delete', eventHandle.deleteComment);
            // 未评论时的点击评论右侧（评论）
            // $('.wrap').off('.info-comment-num').on('click', '.info-comment-num', eventHandle.commentScroll);
            // 未评论时的点击评论右侧（全文）
            // $('.wrap').off('.info-comment-zan').on('click', '.info-comment-zan', eventHandle.scrollToTop);
            // 点击加载更多
            $('.wrap').off('.child-more-text').on('click', '.child-more-text', eventHandle.addToReplyComment);


            // 软键盘消失监听
            $(window).resize(function () {
                var thisHeight = $(this).height();
                if (winHeight - thisHeight > 50) {
                    //当软键盘弹出，在这里面操作

                } else {
                    //当软键盘收起，在此处操作
                    $('.comment-input-unselect').removeClass('hide');
                    $('.comment-input-select').addClass('hide');
                }
            });
        },
        init = function () {
            //platForm = false //测试
            renderEvent.getNews(TOKEN);
            requestEvent.requestNewData();
            // requestEvent.requestCommetList();
            // // 初始化滚动条
            // renderEvent.renderScroll();
        };
    fly.bind(document.body, vm);

    if (platForm) {
        $('header').removeClass('hide');
        $('.close-btn').removeClass('hide'); // 隐藏关闭按钮
        util.noNet($('.wrap'), function () {
            $('.wrap').addClass('hide');
            $('#no-net').removeClass('hide');
        }, function () {
            $('.news-view').css('top', '3rem');
            //$('.like').css('paddingBottom','0.8rem');
            $('.download-code').addClass('hide');
            // 初始化
            init();
        });
        $('.download-cont').addClass('hide');
        $('.news-view').css('top', '0');
    } else {
        if (jumpPlatType == '1' || util.isPC()) {
            $('.download-cont').addClass('hide');
            $('.news-view').css('top', '0');
        } else {
            $('.download-cont').removeClass('hide');
            $('.news-view').css('top', '3rem');
        }
        $('header').addClass('hide');
        //$('.like').css('paddingBottom','7.14rem');
        init();
    }
    // 绑定点击事件
    addEvent();

    // 支付宝、微信端
    if(util.isWeiXin() || util.isAlipay()) {
        $('.news-view').removeClass('top-7');
    }

    if (util.isWeiXin()) {
        var downWrap = $('#downWrap'),
            showDown = util.getCookie('showDown');
        if (showDown == '0') {
            downWrap.addClass('hide');
        } else {
            downWrap.removeClass('hide');
        }

        $('#downWrap .down-content').on('click', function () {
            window.location.href = APPDOWNURL;
        });

        $('#downWrap .delete-icon').on('click', function () {
            $('#downWrap').addClass('hide');
            util.setCookie('showDown', '0', 0.5 / 24, window.location.hostname);
        });
    }
    // pc端和微信端都要去除头部
    if (util.isPC() || util.isWeiXin()) {
        $('.news-view').removeClass('top-7');
    }
});
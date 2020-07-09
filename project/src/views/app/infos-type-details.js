/**
 * @author tinglong
 * @time 2017-11-08
 * @description 消息
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        fly.template.config('escape',false);
        var typeCode = 'XTTZ', // 消息类型
            title = '消息',
            TOKEN = "", // 用户token
            isRead = common.getQueryString('isRead'), // 1消息未读， 0消息已读
            platForm = common.checkMobilePlatform(),
            INDEX = 1,
            itemId,  // 消息详情id
            mescroll, // 上拉加载，下拉刷新
            timeout = 0,
            clientX1,
            clientY1,
            clientX2,
            clientY2,
            viewUrl = [], // 查看详情地址
            enterFlag = true,  // 判断页面是否首次进入页面
            vm = window.vm = fly.observable({
                // 返回按钮
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }
            });
            fly.bind(document.body,vm);

        var renderEvent = {  // 数据渲染模块
            /**
             * 加载当前滚动条
             */
            renderScroll: function() {
                mescroll = window.mescroll = new MeScroll('wrapper', {
                    down: {
                        onMoving: function(mescroll, rate, downHight) {
                        }
                    },
                    up: { // 上拉配置
                        noMoreSize: 15,
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        callback: function(page, mescroll) {
                            // 先判断网络情况、请求并渲染消息详情数据
                            requestEvent.judegeNetState(page);
                        },
                        page: {
                            size: 15
                        }
                    }
                });
            },
            /**
             * 渲染消息详情
             */
            renderMessageDetail: function(page, token) {
                if(enterFlag) {
                    common.mask(true);
                    enterFlag = false;
                }
                if(token) {
                    TOKEN = token;
                }
                croods.ajax({
                    method: 'b0767bedc3a747acb1662983ad26d135',
                    params: {
                        token: TOKEN,
                        typeCode: typeCode,
                        currentPageNo: page.num,
                        pageSize: 15,
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        // common.mask(false);
                        if (common.checkToken(res, function(newToken) {
                            renderEvent.renderMessageDetail(page, newToken);
                            INDEX++;
                        }, INDEX)) {
                            res = JSON.parse(res);
                            var data = res.data;
                            if(data && data.rows && data.rows.length) {
                                // 时间格式转换
                                var date = new Date(),
                                    fullYear = date.getFullYear(),
                                    urlSwitch;  // 查看详情地址转换
                                if(page.num == 1) {
                                    viewUrl = [];
                                }
                                for(var i = 0; i < data.rows.length; i++) {
                                    var obj = data.rows[i];
                                    if(obj.extend) {
                                        var extend = fly.evalJSON(obj.extend);
                                        obj.extendgoPath = extend.goPath;
                                        obj.extendtype = extend.type;
                                        obj.extendurl = extend.url;
                                    }
                                    urlSwitch = {};
                                    if((data.rows[i].sendDate).substring(0,4) == fullYear) {
                                        data.rows[i].sendDate = (data.rows[i].sendDate).substring(5,16);
                                    }else {
                                        data.rows[i].sendDate = (data.rows[i].sendDate).substring(0,16);
                                    }

                                   // if(data.rows[i].goPath) {
                                        // 查看详情地址转换
                                        urlSwitch.isAddHeader = '1';  // 是否有头部
                                        urlSwitch.serviceAddr = data.rows[i].goPath;
                                        urlSwitch.serviceName = data.rows[i].title;
                                        // data.rows[i].goPath = JSON.stringify(urlSwitch);
                                        viewUrl.push(JSON.stringify(urlSwitch));
                                   // }
                                   
                                }
                                $('.infos-type-details-content').removeClass('hide');
                                $('.empty').addClass('hide');

                                var tmpl = fly.template('infoDetailTmpl', data.rows);
                                if(page.num == 1) {
                                    $(".info-type-wrap").empty();
                                }
                                $(".info-type-wrap").append(tmpl);

                                mescroll.endByPage(data.rows.length, data.totalPageCount);
                                if(isRead == 1) {
                                    // 将消息置为已读
                                    requestEvent.readMessage();
                                    isRead = 0;
                                }
                            }else {
                                if(page.num == 1) {
                                    $('.infos-type-details-content').addClass('hide');
                                    $('.empty').removeClass('hide');
                                }
                                mescroll.endByPage(0, 0);
                            }  

                        }

                        
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
                        mescroll.endByPage(0, 0);
                        // common.toast('数据加载失败！');
                    },
                    complete: function(res) {
                        common.mask(false);
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });
            }
        };
        var requestEvent = {  // 数据请求模块
            // 消息项删除
            deleteMessageDetail: function(e) {
                // 添加阻止默认事件
                var deleteItem = $('.info-type-wrap .infos-details-item');
                // common.mask(true);
                croods.getNetworkType({
                    success: function(res) { //请求成功回调
                        common.mask(false);
                        if (res.network == 'none') { 
                            common.toast('网络无法连接，请检查您的网络');
                        }else {
                            croods.ajax({
                                method: '3a3dc562382f4737907a0498b982fa3f',
                                params: {
                                    msgIds: itemId
                                },
                                //请求参数
                                success: function(res) { //请求成功回调
                                    // common.mask(false);
                                    res = $.parseJSON(res);
                                    if(res.flag) {
                                        console.log(res);
                                        common.toast('删除成功！');
                                        deleteItem.each(function(i, item) { // 移出已经选中的资讯
                                            if ($(item).find('.delete-select').length) {
                                                // console.log($(item).hasClass('delete-select'));
                                                item.remove();
                                            }
                                        });
                                        $('.set-mask').hide();
                                        $('.btn-mask-delete').hide();
                                        $('body').css('height', '100%');
                                        $('.set-mask').css('height', '100%');
                                        $('.btn-mask-delete').css('top', '50%');
                                        eventHandle.CloseMask();

                                    }else {
                                        common.toast('删除失败！');
                                    } 
                                },
                                fail: function(res) { //请求失败回调
                                    // common.mask(false);
                                    common.toast('删除失败！');
                                },
                                complete: function(res) {
                                    // common.mask(false);
                                    if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                        common.toast('网络无法连接，请检查您的网络');
                                    }
                                }
                            }); 
                        }
                    }
                });   
            },

            // 判断网络情况
            judegeNetState: function(page) {
                    common.noNet($('.wrap'), function() {  // 展示无网络图片 
                        $('.set-mask').hide();
                        $('.btn-mask-delete').hide();
                        mescroll.endErr();
                        $('.no-line').removeClass('hide');
                        $('.no-net').addClass('hide');  // 无网络状态页
                        $('.infos-type-details-content').removeClass('hide');  // 内容列表页
                        common.toast('网络无法连接，请检查您的网络');
                    },function() {
                        $('.no-line').addClass('hide');
                        $('.no-net').addClass('hide');  // 无网络状态页
                        $('.infos-type-details-content').removeClass('hide');
                        renderEvent.renderMessageDetail(page);
                    });
            },

            // 将消息置为已读
            readMessage: function() {
                croods.ajax({
                    method: '1ced3d897c524feabcf7ed39464f82c8',
                    params: {
                        token: TOKEN,
                        typeCode: ''
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
                        // common.toast('数据加载失败！');
                    }
            });
            }
        };
        /**
         * 事件添加
         */
        var addEvent = function() {
            var self = $('.infos-type-details-wrap');

            // 长按删除touch事件
            self.off('.info-type-wrap .item-title-content').on('touchstart','.info-type-wrap .item-title-content', eventHandle.longPress);

            // touchmove事件
            self.off('.info-type-wrap .item-title-content').on('touchmove','.info-type-wrap .item-title-content', eventHandle.touchMoveEvent);
            
            // 长按结束
            self.off('.info-type-wrap .item-title-content').on('touchend','.info-type-wrap .item-title-content', eventHandle.longPressEnd);


            // 删除选中项 点击事件
            $('.wraps').off('.btn-mask-delete').on('click', '.btn-mask-delete', requestEvent.deleteMessageDetail);

            // 隐藏弹出层
            $('.wraps').off('.set-mask').on('click', '.set-mask', eventHandle.hideMaskEvent);

            // 消息查看详情跳转
            self.off('.info-type-wrap .view-detail').on('click','.info-type-wrap .view-detail', eventHandle.viewDetailClick);
            
        };
        /**
         * 事件处理
         */
        var eventHandle = {

            // 长按删除
            longPress: function(e) {
                var self = $(this);
                    self.addClass('delete-select');
                    // index = self.parent().parent().find('.item-title-content').index();
                    itemId = self.attr('data-id');
                    clientX1 = e.originalEvent.touches[0].clientX;
                    clientY1 = e.originalEvent.touches[0].clientY;
                    // console.log("touchstart");
                    // console.log(clientX1);
                    // console.log(clientY1);

                timeout = setTimeout(function(e){  
                    $('.set-mask').show();
                    $('.btn-mask-delete').show();
                    eventHandle.OpenMask();
                    eventHandle.setMaskHeight();

                }, 800);  //长按时间超过800ms，则执行传入的方法   
            },
            // touchmove
            touchMoveEvent: function(e) {
                var self = $(this);
                // console.log("touchmove");
                // console.log(clientX2);
                // console.log(clientY2);
                clientX2 = e.originalEvent.touches[0].clientX;
                clientY2 = e.originalEvent.touches[0].clientY;

                var x1 = (clientX1 == clientX2),
                    y1 = (clientY1 == clientY2);
                    if(!x1 || !y1) {
                        $('.set-mask').hide();
                        $('.btn-mask-delete').hide();
                        self.removeClass('delete-select');
                        console.log('移除');
                        clearTimeout(timeout);
                    }
            },
            // 长按结束
            longPressEnd: function(e) {
                clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法 
            },
            // 隐藏删除层
            hideMaskEvent: function(e) {
                var deleteItems = $('.info-type-wrap .infos-details-item').find('.delete-select');
                    deleteItems.removeClass('delete-select');

                $('.set-mask').hide();
                $('.btn-mask-delete').hide();
                $('body').css('height', '100%');
                $('.set-mask').css('height', '100%');
                $('.btn-mask-delete').css('top', '50%');
                eventHandle.CloseMask();
                // $('body').css('overflow', 'auto');
            },

            OpenMask: function() {
                document.body.addEventListener('touchmove', eventHandle.handler, false);
                document.body.addEventListener('wheel', eventHandle.handler, false);
            },
    
            CloseMask: function() {
                document.body.removeEventListener('touchmove', eventHandle.handler, false);
                document.body.removeEventListener('wheel', eventHandle.handler, false);
            },

            handler: function () {
                event.preventDefault();
                event.stopPropagation();
            },

            // 消息查看详情跳转
            viewDetailClick: function() {
                var goPath = $(this).data('gopath'),
                    type = $(this).data('type').toString(),
                    url = $(this).data('url');
                var request = common.packData({
                    obj: fly.toJSON({'extend': fly.toJSON({'goPath': goPath, 'type': type, 'url': url})})
                }); // 对接口请求数据封装
                croods.customPlugin({
                    action: 'SystemNoticePlugin.newsMore',
                    params: request,
                    success: function(res) {}
                });
                /*var self = $(this),
                    index = self.index('.view-detail'),
                    url = viewUrl[index],
                    type = 'html';
                    REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + type + "@Third@url=" + url);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });*/

                // var request = common.packData({
                //         obj: JSON.stringify(url)
                //     }); // 对接口请求数据封装


                // croods.customPlugin({
                //     action: 'systemNoticePlugin.newsMore',
                //     params: request,
                //     success: function(res) {}
                // });

            },

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                },function() {
                    $('.infos-type-details-content').removeClass('hide');
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(res) {
                            if (res.token) {
                                console.log(res);
                                TOKEN = res.token;
                                if (!mescroll) {
                                    // 初始化滚动条
                                    renderEvent.renderScroll();
                                } else {
                                    mescroll.triggerUpScroll();
                                }

                            } else {
                                TOKEN = '';
                            }
                        }
                    });
                });

            },

            // 计算消息遮罩的高度 、设置按钮位置等
            setMaskHeight: function() {
                var cheight,   // 可视窗口高度
                    sheight,   // 滚动窗口高度
                    bheight,   // body窗口高度
                    zheight,   // 遮罩的高度
                    dheight,   // 删除按钮的高度
                    stheight,  // 网页被卷去的高
                    theight;  // 删除按钮距离页面的top距离
                zheight = $('.set-mask').height();
                dheight = $('.btn-mask-delete').height();
                stheight = document.body.scrollTop;
                cheight = document.body.clientHeight;
                sheight = document.body.scrollHeight;

                theight = (zheight - dheight)/2 + stheight;
                $('.btn-mask-delete').css('top', theight);

                bheight = (cheight > sheight)? cheight: sheight;
                $('body').css('height', bheight);
                $('.set-mask').css('height', bheight);    
            }
        };

        $(function(){
            $('.title').text(title);
            addEvent();
            eventHandle.getUserInfo();
        }); 
    });

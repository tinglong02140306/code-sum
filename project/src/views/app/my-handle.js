/**
 * @author hmxue
 * @time 2017-11-09
 * @description 我的办理
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'remCacul'
    ],
    function(common, remCacul) {
        var platForm = common.checkMobilePlatform(),
            main = {},
            INDEX = 1,
            TOKEN = '',
            mescroll,
            vm = window.vm = fly({
                // 返回事件
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }

            }),
            renderEvent = { 
                /**
                 * 初始化下拉加载
                */
                initScroll: function() {
                    mescroll = window.mescroll = new MeScroll("wrapper", {
                        down: {
                            isLock: true,
                            use: false
                        },
                        up: {
                            callback: function(page) {
                                renderEvent.getHandleData(page);
                            },
                            htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                            noMoreSize: 15,
                            page: {
                                size: 15
                            }
                        }
                    });
                },
                /**
                 * 渲染数据模块
                */
                getHandleData: function(page, token){
                    if(token) {
                        TOKEN = token;
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                mescroll.endErr();
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                if (page.num == 1) {
                                    common.mask(true);
                                }
                                croods.ajax({
                                    method: 'efe0d7a89851419ea929a544773745aa',
                                    params:  {
                                        currentPageNo: page.num,
                                        pageSize: 15,
                                        token: TOKEN
                                    },
                                    success: function(res) { //请求成功回调
                                        if (page.num == 1) {
                                            common.mask(false);
                                        }
                                        if (common.checkToken(res, function(newToken) {
                                            renderEvent.getHandleData(page, newToken);
                                            INDEX++;
                                        }, INDEX)) {
                                            res = $.parseJSON(res);
                                            if(res.flag) {
                                                var data = res.data;
                                                if (data && data.rows && data.rows.length) {
                                                    var urlSwitch,
                                                        rows = data.rows;
                                                    for(var i = 0,len = rows.length;i<len;i++) {
                                                        urlSwitch = {};
                                                        if(rows[i].actionParam) {
                                                            urlSwitch.isAddHeader = '1';  // 是否有头部
                                                            urlSwitch.serviceAddr = rows[i].actionParam;
                                                            urlSwitch.serviceName = rows[i].typeName;
                                                            rows[i].actionParam = JSON.stringify(urlSwitch);
                                                        }
                                                        rows[i].createdDate = common.getNowDate(rows[i].createdDate);
                                                    }
                                                    var tmp = fly.template('handleTmpl',rows);
                                                    $('.handle-result').append(tmp);
                                                    mescroll.endByPage(data.rows.length, data.totalPageCount);
                                                }else {
                                                    mescroll.endByPage(0,0);
                                                    if (page.num == 1) { 
                                                        $('.empty').removeClass('hide');
                                                        $('.handle-wrap').addClass('hide'); 
                                                    } 
                                                }
                                            }else {
                                                mescroll.endErr();
                                                if (page.num == 1) { 
                                                    $('.empty').removeClass('hide');
                                                    $('.handle-wrap').addClass('hide'); 
                                                } 
                                                common.toast('服务端错误！');
                                            }
                                        }

                                    },
                                    fail: function(res) { //请求失败回调
                                        mescroll.endErr();
                                        if (page.num == 1) { 
                                            common.mask(false);
                                            $('.empty').removeClass('hide');
                                            $('.handle-wrap').addClass('hide'); 
                                        } 
                                        common.toast('请求数据失败');
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
                }
            },
            requestData = {
                /**
                 * 获取用户信息
                 */
                getUserId: function() {
                    common.noNet($('.wrap'), function() {
                        $('#wrapper').addClass('hide');
                        common.toast('网络无法连接，请检查您的网络');
                    },function() {
                        croods.customPlugin({
                            action: 'UserPlugin.getUser',
                            params: {},
                            success: function(data) {
                                data.token ? TOKEN = data.token : TOKEN = '';
                                // 请求收藏数据并渲染
                                renderEvent.initScroll();
                                mescroll.triggerUpScroll();
                            }
                        });
                    });
                },
            },
            eventHandle = {
                handleClickEvent: function() {
                    var $this = $(this),
                        url = JSON.stringify($this.data('actionparam')),
                        type = 'html';
                    var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + type + "@Third@url=" + url);
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: REQUEST,
                        success: function(res) {}
                    });
                   /* croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                
                            }
                        }
                    });*/

                }
            };
            main.init = function() {
                // 获取用户TOKEN
                requestData.getUserId();

                // 我的办件列表点击
                $('.handle-ul').off('.handle-item').on('click','.handle-item',eventHandle.handleClickEvent);
            };
                
            
      

        fly.bind(document.body, vm);
        main.init(); // 绑定点击事件
      
    });
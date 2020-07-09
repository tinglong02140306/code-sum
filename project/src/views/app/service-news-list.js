/**
 * @author yaoding
 * @time 2017-11-20
 * @description 服务资讯列表
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'remCacul',
    ],
    function(common, remCacul) {

        var ALIAS = common.getQueryString('alias'),
            detailUrl = '',
            mescroll,
            ZCJD = [], // 政策解读数据
            renderEvent = { // 渲染数据模块
                /**
                 * 初始化下拉加载
                 */
                initScroll: function() {
                    mescroll = window.mescroll = new MeScroll("wrapper", {
                        down: {
                            /*onMoving: function() {}*/
                        },
                        up: {
                            callback: function(page) {
                                if (ALIAS == 'JFTS') {
                                    requestData.getJFTS(page);
                                }
                                if (ALIAS == 'ZCJD') {
                                    requestData.getZCJD(page);
                                }

                            },
                            htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                            noMoreSize: 15,
                            page: {
                                size: 15
                            }
                        }
                    });
                },
                renderData: function(data) {
                    if (!$.isEmptyObject(data)) {
                        var list = data.rows,
                            tmpl = fly.template('notifyTmpl', list);
                        $(".news-list").append(tmpl);
                    }
                }

            },
            requestData = {
                getJFTS: function(page) {
                   
                    $('.empty').addClass('hide');
                    if (page.num == 1) {
                        common.mask(true);
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                mescroll.endErr();
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.ajax({
                                    method: 'f7a449f8951a483aac69eadc73989b19',
                                    params: {
                                        currentPageNo: page.num,
                                        pageSize: 15
                                    },
                                    success: function(res) {
                                        if (page.num == 1) {
                                            common.mask(false);
                                            $(".news-list").empty();
                                        }
                                        res = $.parseJSON(res);
                                        var data = res.data;
                                        if (data && data.rows && data.rows.length) {
                                            renderEvent.renderData(data);
                                            mescroll.endByPage(data.rows.length, data.total);
                                        } else {
                                            mescroll.endByPage(0, 1);
                                            if (page.num == 1) {
                                                $('.empty').removeClass('hide');
                                            }
                                        }
                                    },
                                    fail: function() {
                                        
                                    },
                                    complete: function(res) {
                                        if (page.num == 1) {
                                            common.mask(false);
                                        }
                                        if (res.code === 70002) {
                                            mescroll.endErr();
                                            common.toast('网络无法连接，请检查您的网络');
                                        }
                                    }
                                });
                            }
                        }
                    });
                },
                getZCJD: function(page) {
                    $('.empty').addClass('hide');
                    if (page.num == 1) {
                        common.mask(true);
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                mescroll.endErr();
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.ajax({
                                    method: '686d12c9819048fda88abae333209abc',
                                    params: {
                                        currentPageNo: page.num,
                                        pageSize: 15
                                    },
                                    success: function(res) {
                                        if (page.num == 1) {
                                            common.mask(false);
                                            ZCJD = [];
                                            $(".news-list").empty();
                                        }
                                        res = $.parseJSON(res);
                                        var data = res.data;
                                        if (data && data.length) {
                                            for (var i = 0, len = data.length; i < len; i++) {
                                                ZCJD.push(data[i]);
                                                var publishTime = data[i].publishTime;
                                                if (publishTime) {
                                                    data[i].releaseDate = publishTime.substr(0, publishTime.length - 3);
                                                }
                                            }
                                            var tmpl = fly.template('zcjdTmpl', data);
                                            $(".news-list").append(tmpl);
                                            mescroll.endSuccess(data.length);
                                        } else {
                                            mescroll.endByPage(0, 1);
                                            if (page.num == 1) {
                                                $('.empty').removeClass('hide');
                                            }
                                        }
                                    },
                                    fail: function() {
                                        
                                    },
                                    complete: function(res) {
                                        if (page.num == 1) {
                                            common.mask(false);
                                        }
                                        if (res.code === 70002) {
                                            mescroll.endErr();
                                            common.toast('网络无法连接，请检查您的网络');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            };

        common.noNet($('.wrap'), function() {
            $('.no-net').removeClass('top-7');
            $('#wrapper').addClass('hide');
        }, function() {
            renderEvent.initScroll();
        });
        

        $('.news-list').off('.item').on('click', '.item', function() {
            if (ALIAS == 'JFTS') {
                detailUrl = 'police-tips-detail';
            }
            if (ALIAS == 'ZCJD') {
                detailUrl = 'political-interpretation-detail';
                localStorage.setItem('zcjd', fly.toJSON(ZCJD[$(this).index()]));
            }
            var id = $(this).data('id'),
                request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=' + detailUrl + '.html?id=' + id); // 对接口请求数据封装
            croods.customPlugin({
                action: 'CIPRoutePlugin.action',
                params: request,
                success: function(res) {}
            });
        });

    });
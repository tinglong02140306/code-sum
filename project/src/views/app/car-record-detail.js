/**
 * @author tinglong
 * @time 2017-11-08
 * @description 我的车辆详情页
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        var TOKEN = "", // 用户token
            OS = common.phoneOs(), // 终端类型
            ID = common.getQueryString('id'), // 详情id
            licensePlateNum = common.getParam('licensePlateNum'), // 用户车牌号
            INDEX = 1,
            vm = window.vm = fly.observable({
                delete: function() {
                    $('.mark').show();
                    eventhandle.OpenMask();
                    // $('.wrap').css('overflow', 'hidden');
                },
                back: function() {
                    window.history.back(-1);
                },
                sure: function() {
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                croods.ajax({
                                    method: '61f1bf43448b4f48a6d92157a7b5d527',
                                    params: {
                                        token: TOKEN,
                                        osType: OS,
                                        id: ID
                                    },
                                    //请求参数
                                    success: function(res) { //请求成功回调
                                        if (common.checkToken(res)) {
                                            common.toast('删除成功！');
                                            window.location.href = './public/wcportal/0.0.1/page/my-car.html';
                                        }
                                        eventhandle.CloseMask();
                                        // $('.wrap').css('overflow', '');
                                    },
                                    fail: function(res) { //请求失败回调
                                        $('.mark').hide();
                                        common.toast('删除失败！');
                                    },
                                    complete: function(res) {
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                            common.toast(res.message);
                                        }
                                    }
                                });
                            }
                        }
                    });

                },
                cancel: function() {
                    $('.mark').hide();
                    eventhandle.CloseMask();
                    // $('.wrap').css('overflow', '');
                }
            });


        var renderEvent = { // 数据渲染模块
            // 获取车辆信息列表
            rendCarRecord: function(token) {
                if (token) {
                    TOKEN = token;
                }
                common.mask(true);
                console.log(TOKEN);
                console.log(ID);
                croods.ajax({
                    method: '3f1bd11a7578476da357cb82fb79d962',
                    params: {
                        token: TOKEN,
                        osType: OS,
                        id: ID // 车辆ID
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);
                        if (common.checkToken(res, function(newToken) {
                                renderEvent.rendCarRecord(newToken);
                                INDEX++;
                            }, INDEX)) {
                            var res1 = JSON.parse(res),
                                data = res1.data;
                            if(res1.flag) {
                                $('.empty-data').addClass('hide');
                                if (data && data.length) {
                                    $('.record-detail-content').removeClass('hide');
                                    $('.empty-record').addClass('hide');
                                } else {
                                    $('.record-detail-content').addClass('hide');
                                    $('.empty-record').removeClass('hide');
                                }
                                var tmpl = fly.template('carDetailTmpl', data);
                                $(".record-detail-item").append(tmpl);

                            }else {
                                $('.empty-data').removeClass('hide');
                                common.toast(res1.errMsg);
                            }
                            
                        }
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
                        common.toast('数据加载失败！');
                    },
                    complete: function(res) {
                        common.mask(false);
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            common.toast('网络无法连接，请检查您的网络');
                        }
                    }
                });
            }
        };
        var eventhandle = {
            handler: function(event) {
                event.preventDefault();
                event.stopPropagation();
            },
            OpenMask: function() {
                document.body.addEventListener('touchmove', eventhandle.handler, false); // false 为触发冒泡事件
            },
            CloseMask: function() {
                document.body.removeEventListener('touchmove', eventhandle.handler, false);
            }
        };
        fly.bind(document.body, vm);

        $(function() {
            $('.title').text(licensePlateNum);
            common.noNet($('.wrap'), function() {
                $('.record-detail-content').addClass('hide');
                $('.btn-delete').addClass('hide');
                common.toast('网络无法连接，请检查您的网络');
            }, function() {
                croods.customPlugin({
                    action: 'UserPlugin.getUser',
                    params: {},
                    success: function(res) {
                        if (res.token) {
                            TOKEN = res.token;
                            console.log(res);
                            renderEvent.rendCarRecord();
                        } else {
                            TOKEN = '';
                        }
                    }
                });
            });
        });
    });
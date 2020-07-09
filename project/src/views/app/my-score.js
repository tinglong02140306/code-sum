/**
 * @author tinglong
 * @time 2017-01-03
 * @description 我的积分
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {

        var TOKEN = "", // 用户token
            /*USERID = "", // 用户id*/
            checkIndex = 1, // 判断token失效次数
            platForm = common.checkMobilePlatform(),
            vm = window.vm = fly.observable({
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                },
                // 跳转到积分详情页
                viewDetailEvent: function() {
                    var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=score-record.html'); // 对接口请求数据封装
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: request,
                        success: function(res) {}
                    });
                   /* window.location.href = './public/wcportal/0.0.1/page/score-record.html';*/
                }
                
            });
        var renderEvent = {

            // 渲染日常积分赚取方式
            renderScoreWayData: function(data) {
                $(".score-way-contents").empty();
                var tmpl = fly.template('scoreWayTmpl', data);
                $(".score-way-contents").append(tmpl);
            }

        },
        requestEvent = {  // 数据请求模块

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                    $('.content').addClass('hide');
                    $('.top-banner').addClass('hide');
                    $('body').removeClass('bf');
                    $('body').addClass('bg-grey');

                },function() {
                    $('.content').removeClass('hide');
                    $('.top-banner').removeClass('hide');
                    $('body').addClass('bf');
                    $('body').removeClass('bg-grey');
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(res) {
                            if (res.token) {  
                                /*USERID = res.id;*/
                                TOKEN = res.token;
                                // 请求积分总数
                                requestEvent.getScoreData();
                            } else {
                                /*USERID = '';*/
                                TOKEN = '';
                            }
                        }
                    });
                });
            },
            // 获取总积分数据、日常赚取积分方式
            getScoreData: function() {
                common.mask(true);  // 添加遮罩
                croods.ajax({
                    method: '77d83ba47fba452d8fff79f16e56668c',
                    params: {
                        token: TOKEN
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);  // 去除遮罩
                        if (common.checkToken(res, function(newToken) {
                            checkIndex++;
                        }, checkIndex)) {
                            res = JSON.parse(res);
                            var data = res.data;
                            
                            $('.content').removeClass('hide');
                            $('.top-banner').removeClass('hide');
                            $('.empty').addClass('hide');
                            $('body').addClass('bf');
                            $('body').removeClass('bg-grey');

                            /*if(data.total > 9999) {
                                data.total = '9999+';
                            }*/
                            // 渲染我的积分总数
                            $('.num-detail').text(data.total);

                            // 渲染日常积分赚取方式
                            renderEvent.renderScoreWayData(data.list);
                        }
                        
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);  // 去除遮罩
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                }); 
            }
        };

        fly.bind(document.body,vm);
        requestEvent.getUserInfo(); 
    });

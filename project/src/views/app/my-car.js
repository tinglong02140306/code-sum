/**
 * @author tinglong
 * @time 2017-11-08
 * @description 资讯详情
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        var TOKEN = "", // 用户token
            USERID = "", // 用户ID
            id = "",  // 违章记录id
            license,  // 车牌号
            OS = common.phoneOs(), // 终端类型
            INDEX = 1,
            platForm = common.checkMobilePlatform(),
            vm = window.vm = fly.observable({
                // 添加车辆查询违章按钮
                addRecordEvent: function() {
                   /* var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=add-car.html?id=' + USERID); // 对接口请求数据封装
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: request,
                        success: function(res) {}
                    });*/
                    window.location.href = './public/wcportal/0.0.1/page/add-car.html?id=' + USERID;
                },
                // 返回
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                    // window.location.href = './public/wcportal/0.0.1/page/my.html';
                }
                
            });
            
        // 数据渲染模块
        var renderEvent = {
            /**
             * 渲染违章信息详情
             */
            renderCarInfo: function(token) {
                if(token) {
                    TOKEN = token;
                }
                /*common.mask(true);*/
                croods.ajax({
                    method: 'afc06ad8a9dc4f259f967d398ce0d83e',
                    params: {
                        token: TOKEN,
                        osType: OS,
                        userId: USERID
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        /*common.mask(false);*/
                        if (common.checkToken(res, function(newToken) {
                            renderEvent.renderCarInfo(newToken);
                            INDEX++;
                        }, INDEX)) {
                            var res1 = JSON.parse(res),
                                data = res1.data;
                            var tmpl = fly.template('carRecordTmpl', data);
                            $(".my-car-list").append(tmpl);
                        }
                    },
                    fail: function(res) { //请求失败回调
                        /*common.mask(false);*/
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        /*common.mask(false);*/
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });
            }
        };

        /**
         * 事件添加
         */
        var addEvent = function() {
            var self = $('.wrap');
            // 头部返回按钮
            self.off('.my-car-record').on('click','.my-car-record', eventHandle.carDetailEvent);
        };
        /**
         * 事件处理
         */
        var eventHandle = { 
            // 获取详情页id
            carDetailEvent: function(e) {
                var self = $(this);
                id = self.attr('data-id');
                license = self.attr('data-license');
               /* var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=car-record-detail.html?id=' + id + '&licensePlateNum=' + license); // 对接口请求数据封装
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });*/
                window.location.href = './public/wcportal/0.0.1/page/car-record-detail.html?id=' + id + '&licensePlateNum=' + license;
            }
        };
        fly.bind(document.body,vm);
        $(function(){
            addEvent();
            common.noNet($('.wrap'), function() {
                $('.my-car-content').addClass('hide');
                common.toast('网络无法连接，请检查您的网络');
            },function() {
                $('.my-car-add').removeClass('hide');
                croods.customPlugin({
                    action: 'UserPlugin.getUser',
                    params: {},
                    success: function(res) {
                        if (res.token) {
                            TOKEN = res.token;

                            if (res.id) {
                                USERID = res.id;
                                renderEvent.renderCarInfo();
                            } else {
                                USERID = '';
                            }
                            
                        } else {
                            TOKEN = '';
                        }
                    }
                });
            });
            
        }); 
    });

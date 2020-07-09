/**
 * @author tinglong
 * @time 2017-11-08
 * @description 办事大厅首页
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'remCacul'
    ],
    function(common, remCacul) {
        var platForm = common.checkMobilePlatform(),
            vm = fly.observable({
                // 返回按钮
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }
            });
        fly.bind(document.body, vm);

        // 渲染模块
        /*var renderEvent = {

            // 渲染热门办事数据
            renderHotWork: function(data) {
                $(".list-all").empty();
                var tmpl = fly.template('hotWorkTmpl', data);
                $(".list-all").append(tmpl);
            }

        };*/

        // 请求数据模块
        var requestEvent = {
            /**
             * 获取办事分类数据并渲染数据
             */
            requestHotWorkData: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                    $('.work-type').addClass('hide');
                }, function() {
                    // common.mask(true);
                    $('.work-type').removeClass('hide');
                    croods.ajax({
                        method: '50ac8f3ea27d4fb2a2193466760a1cd7',
                        params: {},
                        //请求参数
                        success: function(res) { //请求成功回调
                            // common.mask(false);
                            // if (common.checkToken(res)) {
                            res = JSON.parse(res);
                            var data = res.data;
                            if (data && data.length) {
                                for (var i = 0; i < data.length; i++) {
                                    data[i].code = $.trim(data[i].code);
                                }
                            }
                            var tmpl = fly.template('workTypeTmpl', data);
                            $('#workType').html(tmpl);
                            // }
                        },
                        fail: function(res) { //请求失败回调
                            // common.mask(false);
                            common.toast('数据请求失败！');
                        },
                        complete: function(res) {
                            // common.mask(false);
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message);
                            }
                        }
                    });
                });
            }

        };
        /**
         * 事件添加
         */
        var addEvent = function() {
            var self = $('.wrap');
            // 跳转到列表页
            self.off('.arrow-left').on('click', '#workType a', eventHandle.returnEvent);
        };
        /**
         * 事件处理
         */
        var eventHandle = {
            // 跳转到列表页
            returnEvent: function(e) {
                var self = $(this),
                    id = self.attr("data-id"),
                    code = self.attr("data-code"),
                    name = self.attr("data-typename"),
                    type = self.data().type,
                    url,
                    type,
                    REQUEST,
                    request;
                if(type == 'jmhd') {
                    url = JSON.stringify({
                        authType: '2',
                        id: '2c9f819e616532d50161654781600017',
                        installPackageName: '',
                        isAddHeader: '0',
                        packageName: '',
                        serviceAddr: 'service-police.html?name=警民互动',
                        serviceAddrType: '4',
                        serviceId: '2c9f819e5fc403e7015fc4169c82001b',
                        serviceJoinType: '1',
                        serviceName: '警民互动',
                        serviceVersion: '1',
                        startPage: '1',
                        versionName: '1'
                    });
                    type = 'local';
                }else {
                    url = JSON.stringify({
                        isAddHeader: '1',
                        serviceAddr: 'service-classification-list.html?id=' + id + '&code=' + code,
                        serviceName: name
                    });
                    type = 'local';
                }
                REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@local@Third@url=" + url);
                request = common.packData({}, '', '1', '', '');

                croods.customPlugin({
                    action: 'UserPlugin.isLogin',
                    params: request,
                    success: function(res) {
                        croods.customPlugin({
                            action: 'CIPRoutePlugin.action',
                            params: REQUEST,
                            success: function(res) {}
                        });
                    }
                });
            }
        };
        $(function() {
            addEvent();
            requestEvent.requestHotWorkData();
        });
    });
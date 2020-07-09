/**
 * @author tinglong
 * @time 2018-06-01
 * @description 
 */
'use strict';
$(function() {
    var REQUEST;
    var main = {},
        TOKEN = "", // 用户token
        platForm =  util.checkMobilePlatform(),
        CONFIGPATH = $('.config-path').val(),
        vm = window.vm = fly.observable({
            // 扫码缴费
            goScanPay:function(e){
                if(platForm) {
                    croods.customPlugin({
                        action: 'QRCodePlugin.scanCode',  // 原生扫描功能插件
                        params: {},
                        success: function(res) { 
                            res = res.result;
                            croods.ajax({
                                method: '4916d843ad754268942a5e7b9461c0f8',
                                params: {
                                    content: res
                                },
                                //请求参数
                                success: function(data) { //请求成功回调
                                    data = typeof data == 'string' ? $.parseJSON(data) : data;
                                    if(data.data) {
                                        var returnUrl = JSON.stringify({
                                            'isAddHeader': '0',
                                            'serviceAddr': data.data,
                                            'serviceName': ''
                                        });
                                        main.originThirdSerReUrl(returnUrl);
                                    }else {
                                        util.platTypeToast(res.errorMessage,platForm);
                                    }
                                    
                                },
                                fail: function(data) { //请求失败回调
                                    util.platTypeToast('数据请求失败',platForm);
                                },
                                complete: function(data) {
                                    // util.platTypeToast('数据请求失败',platForm);
                                }
                            });
                        }
                    });

                }else {
                    util.platTypeToast('请在客户端打开',platForm);
                }
            },
            // 输入缴款识别码缴费
            goIdCodePay:function(e){
                window.location.href = CONFIGPATH + 'wjewt/h5/pay-idCode.do';
            },
            // 返回
            back: function() {
                $('.mark').show();
            },
            // 确定
            sure: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1); 
                // croods.pageClose({});
                /*window.history.go(-1);*/
            },
            // 取消
            cancel: function() {
                $('.mark').hide();
            }
        });

        // 原生地址跳转 第三方
        main.originThirdSerReUrl = function(returnUrl) {
            var REQUEST = util.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
            croods.customPlugin({
                action: 'CIPRoutePlugin.action',
                params: REQUEST,
                success: function(res) {}
            });
        };
    fly.bind(document.body, vm);
});
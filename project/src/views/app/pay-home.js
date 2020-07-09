/**
 * @author myfan2
 * @time 2018-05-15
 * @description 公共缴费
 */
/*'use strict';*/
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        var REQUEST;
        var main = {},
            TOKEN = "", // 用户token
            vm = window.vm = fly.observable({
                goScanPay:function(){
                },
                goIdCodePay:function(){
                },
                back: function() {
                    $('.mark').show();
                },
                sure: function() {
                    croods.pageClose({});
                    /*window.history.go(-1);*/
                },
                cancel: function() {
                    $('.mark').hide();
                }
            });
        main.getUserInfo = function() {
            croods.customPlugin({
                action: 'UserPlugin.getUser',
                params: {},
                success: function(res) {
                    console.log(res);
                    if (res.token) {
                        TOKEN = res.token;
                    };
                }
            })
        };

        // 绑定手机物理返回键
        croods.bindButton({
            keycode: ['backbutton'],
            success: function(res) {
                vm.back();
            }
        });

        fly.bind(document.body, vm);

        $(function() {
            main.getUserInfo();
        });

    });
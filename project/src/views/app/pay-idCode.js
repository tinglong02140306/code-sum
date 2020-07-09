/**
 * @author myfan2
 * @time 2018-05-15
 * @description 公共缴费
 */
/*'use strict';*/
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'payCommon'
    ],
    function(remCacul, common) {
        var serverUrl = 'http://172.31.1.30:28080', // 现网
            interfaceCode = "4c3cf2bff27b49e4bfcbed0056ce6d19"; //接口编码
        var main = {},
            TOKEN = "", // 用户token
            vm = window.vm = fly.observable({
                idCode:"",
                submit:function(){
                    if(vm.idCode.length!=20){
                        common.toast("请输入20位的缴费识别码");
                        return;
                    }

                    //添加遮盖
                    /*common.mask(true);*/

                    var obj={
                        pinCode:vm.idCode
                    };
                    var dataString=JSON.stringify(obj);
                    common._post(MSERVERURL, {
                        'a': APPLY_ID,  //项目编码
                        'm': interfaceCode,  //接口编码
                        'p': dataString
                    }, function(res) {
                        console.log(res);
                        if(res.s=='1'){
                            window.location.href="pay-detail?data="+escape(res.r);
                        }else{
                            common.toast("缴费识别码错误");
                            return;
                        }
                    }, function(res) {
                        console.log(res);
                        common.toast("请求失败");
                        return;
                    });
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

        main.back=function(){
            // 绑定手机物理返回键
            croods.bindButton({
                keycode: ['backbutton'],
                success: function(res) {
                    vm.back();
                }
            });
        }


        fly.bind(document.body, vm);
        
        $(function() {
            main.back();
            // main.getUserInfo();
        });

    });
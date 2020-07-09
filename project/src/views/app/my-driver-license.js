/**
 * @author tinglong
 * @time 2017-01-05
 * @description 我的驾照
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {

        var TOKEN = "", // 用户token
            USERID = "", // 用户id
            checkIndex = 1, // 判断token失效次数
            platForm = common.checkMobilePlatform(),
            pickSelectIndex = '0', // 发证机关选中下表
            picker,
            driverId,
            OS = common.phoneOs(), // 判断操作系统
            /*rule = [{
                'key': 'DABH',
                'title': '档案编号',
                'max': 20,
                'required': true,
                'pattern': /^[0-9]{12}$/,
                'flagCard': false
            }],*/
            vm = window.vm = fly.observable({
                driverNumText: '',  // 驾驶证号
                docNumText: '',  // 档案编号
                carType: {
                    text: '皖A-合肥',
                    value: 'A'
                },
                
                // 返回按钮
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }
                
            });

        var eventHandle = {

            // 车辆类型
            pickerEvent: function(array) {
                picker = new Picker({
                    data: [array],
                    selectedIndex: [pickSelectIndex],
                    title: '选择发证机关'

                });
                picker.on('picker.select', function(selectedVal, selectedIndex) {
                    vm.carType.set('text', array[selectedIndex[0]].text);
                    vm.carType.set('value', array[selectedIndex[0]].value);
                });

                picker.on('picker.change', function (e, index, selectIndex) {
                    if(OS == 'Android') {
                        var num = 3.4+ index*0.025;
                        $('.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll').css('marginTop', num + 'rem');
                    }
                });

                $('.wrap').on('click', "#picker", function() {
                    picker.show();
                 });

            },

            // 拇指轮弹框显示
           /* pickerShowEvent: function() {
                picker.show();
            },*/


            // input输入框监听、按钮是否可用
            inputMonitorEvent: function() {
                var JSZH = $.trim($('input[name=JSZH]').val()),
                    DABH = $.trim($('input[name=DABH]').val());
                if(JSZH && DABH) {
                    $('.bg-grey').addClass('hide');
                    $('.bg-bind').removeClass('hide');
                   /* $('.btn-bind').removeClass('bg-grey');
                    $('.btn-bind').addClass('bg-bind');*/

                    // $('#button').removeAttr("disabled"); // 移除disabled属性
                }else {
                    $('.bg-grey').removeClass('hide');
                    $('.bg-bind').addClass('hide');
                    /*$('.btn-bind').addClass('bg-grey');
                    $('.btn-bind').removeClass('bg-bind');*/
                    // $('#button').attr('disabled',"true");  // 添加disabled属性 
                }
            },
            // 驾照绑定
            bindEvent: function() {
                var docNo = $.trim(vm.docNumText);
                if(!common.checkCard(vm.driverNumText)) {
                    common.toast('驾驶证号输入不正确');
                    return;
                }

                if(!new RegExp(/^[0-9]{12}$/).test(docNo)) {
                    common.toast('档案编号输入不正确');
                    return;
                }

                common.mask(true);
                croods.ajax({
                    method: '38388365f253487fa7ac7f351a9a07ac',
                    params: {
                        userId: USERID,
                        licenseNumber: vm.driverNumText,  // 驾驶证号
                        archivalCoding: vm.docNumText,   // 档案编号
                        issuingOrgan: vm.carType.value  // 车辆类型value
                    },
                    success: function(res) {
                        common.mask(false);
                        if(res) {
                            if (common.checkToken(res, function(newToken) {
                                checkIndex++;
                            }, checkIndex)) {
                                res = $.parseJSON(res);
                                if(res.flag) {
                                    if(res.data) {
                                        eventHandle.judgeFirBind();  // 判断是否绑定过
                                        driverId = res.data;
                                        window.location.href = './public/wcportal/0.0.1/page/license-information.html?driverId=' + driverId;
                                    }else {
                                        common.toast('您输入的信息不正确，请修改确认后再操作');
                                    }
                                }else {
                                    common.toast(res.errMsg);
                                    return;
                                }
                                
                            }
                        }else {
                            common.toast(res.errMsg);
                        }
                    },
                    fail: function(res) {
                        common.mask(false);
                        /*common.toast('绑定失败！');*/
                    },
                    complete: function(res) {
                        common.mask(false);
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });   
            },

            // 判断是否是首次绑定 
            judgeFirBind: function(licenseNumber) {
                croods.ajax({
                    method: '0f81dc9db9f0426484388fc7f8bad329',
                    params: {
                        /*licenseNumber: licenseNumber,  // 驾驶证号*/
                        token: TOKEN
                    },
                    success: function(res) {
                        if(res) {
                            if (common.checkToken(res, function(newToken) {
                                checkIndex++;
                            }, checkIndex)) {
                                res = $.parseJSON(res);
                                if(res.data) {
                                   scoreToast();  // 仅仅第一次绑定才加分
                                }else {
                                    window.location.href = './public/wcportal/0.0.1/page/license-information.html?driverId=' + driverId;
                                }
                            }
                        }
                    },
                    fail: function(res) {
                        /*common.toast('绑定失败！');*/
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                }); 
            }
            
        },
        requestEvent = {  // 数据请求模块

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                },function() {
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(res) {
                            if (res.id) {
                                USERID = res.id;
                                TOKEN = res.token;

                                // 选择发证机关数据获取与渲染
                                requestEvent.getScoreData();  
                            } else {
                                USERID = '';
                                TOKEN = '';
                            }
                        }
                    });
                });
            },

            // 获取发证机关数据
            getScoreData: function() {
                croods.ajax({
                    method: '71bc87a06d7f434e874e09b78a5f9795',
                    params: {},
                    //请求参数
                    success: function(res) { 
                        if (common.checkToken(res, function(newToken) {
                            checkIndex++;
                        }, checkIndex)) {
                            res = JSON.parse(res);
                            var data = res.data,
                                result = [],
                                item = {};
                            for(var i = 0; i < data.length; i++) {
                                item = {};
                                item.text = data[i].name;
                                item.value = data[i].code;
                                result.push(item);
                            }

                            // 渲染发证机关数据
                            eventHandle.pickerEvent(result);
                        }
                    },
                    fail: function(res) { //请求失败回调
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                }); 
            }
        },
        addEvent = function() {
            var $this =  $('.wrap');

            // input输入框监听
            $this.off('input').on('input propertychange','input',eventHandle.inputMonitorEvent);

            // 驾照绑定
            $('.wrap').off('.btn-wrap .bg-bind').on('click','.btn-wrap .bg-bind',eventHandle.bindEvent);
            
            // 拇指轮弹框显示
           /* $('.wrap').on('click', "#picker",eventHandle.pickerShowEvent);*/
        },
        // 原生积分弹框请求
        scoreToast = function() {

            var REQUEST = common.packData({
                            "content": '成功绑定爱车',
                            "number": '10',
                        }, "", "1", false, "");

            croods.customPlugin({
                action: 'IntegralPlugin.toast',
                params: REQUEST,
                success: function(res) {}
            });
            window.location.href = './public/wcportal/0.0.1/page/license-information.html?driverId=' + driverId;
        };
        

        fly.bind(document.body,vm);
        addEvent();
        requestEvent.getUserInfo();   // 获取用户信息
        
    });

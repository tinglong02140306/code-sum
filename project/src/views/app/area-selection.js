/**
 * @author tinglong
 * @time 2018-03-12
 * @description 办事项区域选择
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        var TOKEN = "", // 用户token
            ID = '', // 详情ID
            checkIndex = 1,
            vm = window.vm = fly.observable({
                hpzl: '', // 车辆类型字典值
                hpzlTxt: '', // 车辆类型文本值
                /**
                 * 保存并查询按钮
                 */
                saveSearchEvent: function() {
                    $('.in-value input').blur();
                    var licensePlateNumTxt = $.trim($('input[name="licensePlateNum"]').val()).toLocaleUpperCase(), //车牌号码
                        frameNumTxt = $.trim($('input[name="frameNum"]').val()).toLocaleUpperCase(), // 车架号
                        licensePlateNumTxts = licensePlateNumTxt,  // '皖' +
                        data = {
                            licensePlateNumTxts: licensePlateNumTxts, // 车牌号码
                            frameNum: frameNumTxt,
                            hpzlTxt: vm.hpzlTxt
                        };
                    if (licensePlateNumTxt === '') {
                        common.toast('车牌号码不能为空');
                        return;
                    }
                    /*if(!(new RegExp(rule[0].pattern).test(data.licensePlateNumTxts)) && !(new RegExp(rule[3].pattern).test(data.licensePlateNumTxts)) && !(new RegExp(rule[4].pattern).test(data.licensePlateNumTxts))){
                        //请输入正确的车牌号码
                        common.toast('请输入正确的车牌号码');
                        return;
                    }*/
                    // 车辆类型验证
                    if (!inputCheck(rule, data)) {
                        return;
                    }
                    // 保存车辆类型参数
                    dto = {
                        token: TOKEN,
                        isUse: '0', // 是否别绑定改过 0未绑定  1已绑定
                        licensePlateNum: licensePlateNumTxts, // 车牌号
                        frameNum: frameNumTxt, // 车架号
                        hpzl: vm.hpzl // 车辆类型
                    };
                    // 判断此车辆是否已经绑定
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                vm.checkIsBind();
                            }
                        }
                    });
                },
                checkIsBind: function(token) {
                    if (token) {
                        TOKEN = token;
                        dto.token = token;
                    }
                    common.mask(true);
                    croods.ajax({
                        method: '1580be6a24e440fe94e5f04728a8707a',
                        params: {
                            token: TOKEN,
                            licensePlateNum: dto.licensePlateNum, // 车牌号
                            frameNum: dto.frameNum, // 车架号
                            hpzl: vm.hpzl // 车辆类型
                        },
                        success: function(res) {
                            common.mask(false);
                            if (res) {
                                if (common.checkToken(res, function(newToken) {
                                        vm.checkIsBind(newToken);
                                        checkIndex++;
                                    }, checkIndex)) {
                                    res = $.parseJSON(res);
                                    if (res.flag) {
                                        switch (res.data) {
                                            case '0': // 未被绑定过
                                                vm.sureSaveCarInfo(dto.licensePlateNum);
                                                break;
                                            case '1': // 自己绑定过该车辆
                                                var message = '您已绑定该车辆，请重新输入！';
                                                common.toast(message);
                                                break;
                                            case '2': // 别人绑定过该车辆
                                                dto.isUse = '1';
                                                $('.mark').show();
                                                break;
                                            default:
                                                common.toast('服务端错误！');
                                                break;
                                        }
                                    } else {
                                        common.toast(res.errMsg);
                                    }
                                }
                            } else {
                                common.toast('请求数据失败!');
                            }

                        },
                        fail: function(res) {
                            common.mask(false);
                            common.toast('保存失败！');
                        },
                        complete: function(res) {
                            common.mask(false);
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message);
                            }
                        }
                    });
                },
                /**
                 * 返回按钮
                 */
                back: function() {
                    if ($('.wrap').hasClass('hide')) { // 车辆类型界面
                        $('.car-type-wrap').addClass('hide');
                        $('.wrap').removeClass('hide');
                    } else {
                        window.history.back(-1);
                    }
                },
                /**
                 * 取消覆盖绑定的车辆
                 */
                cancel: function() {
                    $('.mark').hide();
                },
                /**
                 * 车辆信息页面和车辆类型页面的切换
                 */
                carTypeClick: function(e) {
                    var index = $(e.currentTarget).data('index')
                    if (index == '1') {
                        if (!vm.hpzl) {
                            common.toast('暂无车辆类型！');
                            return;
                        }
                        $('.car-type-wrap').removeClass('hide');
                        $('.wrap').addClass('hide');

                    } else {
                        $('.car-type-wrap').addClass('hide');
                        $('.wrap').removeClass('hide');
                    }

                },
                /**
                 * 确定保存车辆信息
                 */
                sureSaveCarInfo: function(licensePlateNum) {
                    common.mask(true);
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                croods.ajax({
                                    method: '4bb3c564447f439b81f3a280cefeda1c',
                                    params: dto,
                                    //请求参数
                                    success: function(res) { //请求成功回调
                                        common.mask(false);
                                        if (common.checkToken(res)) {
                                            if (res) {
                                                var res1 = $.parseJSON(res);
                                                if (res1 && res1.flag) {
                                                    $('.mark').hide();
                                                    ID = res1.data;
                                                    // 获取积分提醒
                                                    eventHandle.judgeFirBind(licensePlateNum);
                                                    
                                                    // 车辆保存并查询按钮
                                                    

                                                } else {
                                                    common.toast(res1.errMsg);
                                                }
                                            } else {
                                                common.toast('请求数据失败！');

                                            }
                                        }

                                    },
                                    fail: function(res) { //请求失败回调
                                        common.mask(false);
                                        common.toast('保存失败！');
                                    },
                                    complete: function(res) {
                                        common.mask(false);
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                            common.toast('网络无法连接，请检查您的网络');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }),
            /**
             * 请求数据模块
             */
            requestHandle = {
                /**
                 * 请求亳州区域选择
                 */
                getTypeData: function() {
                    croods.ajax({
                        method: 'b60636f00513409dba9a69a5e82aa223',
                        params: {
                            datatype: 'CLLX'
                        },
                        success: function(res) {
                            if (common.checkToken(res)) {
                                res = $.parseJSON(res);
                                if (res && res.flag && res.data && res.data.length) {
                                    var data = res.data;
                                    var tmpl = fly.template('typeTempl', data);
                                    $(".type-cont").append(tmpl);
                                } else {
                                    common.toast('请求数据失败！');
                                }
                            }
                        },
                        fail: function(res) {
                            common.toast('服务端错误！');
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message);
                            }
                        }
                    });
                }
            },
            /**
             * 车辆信息页面和车辆类型页面的切换
             */
            eventHandle = {
                /**
                 * 获取用户信息
                 */
                getUserInfo: function() {
                    common.noNet($('.wrap'), function() {
                        $('.car-add-content').addClass('hide');
                        common.toast('网络无法连接，请检查您的网络');
                    }, function() {
                        $('.car-add-content').removeClass('hide');
                        requestHandle.getTypeData();
                        croods.customPlugin({
                            action: 'UserPlugin.getUser',
                            params: {},
                            success: function(res) {
                                if (res.token) {
                                    TOKEN = res.token;
                                    console.log(res);
                                } else {
                                    TOKEN = '';
                                }
                            }
                        });
                    });
                },

                // 区域选择
                areaSelectClick: function(e) {
                    var $this = $(e.currentTarget);
                }
            };

       
        /**
         * 添加事件
         */
        var addEvent = function() {
            // 车辆类型点击
            $('.wrap').off('.wrapper a').on('click', '.wrapper a', eventHandle.areaSelectClick);
        };
        
        fly.bind(document.body, vm);
        eventHandle.getUserInfo();
        addEvent();
    });
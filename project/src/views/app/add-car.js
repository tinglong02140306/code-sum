/**
 * @author tinglong
 * @time 2017-11-08
 * @description 我的车辆添加
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
            dto = {}, // 保存车辆信息参数对象
            rule = [{
                    'key': 'licensePlateNumTxts',
                    'title': '车牌号码',
                    'required': true,
                    'pattern': /^[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$|^[A-Z]{1}[D|F]{1}[A-Z0-9]{1}[0-9]{4}$|^[A-Z]{1}[0-9]{5}[D|F]{1}$/  // 'pattern': /^[皖A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                }, {
                    'key': 'frameNum',
                    'title': '车架号',
                    'required': true,
                    'pattern': /^[a-zA-Z0-9]{0,6}$/
                },
                {
                    'key': 'hpzlTxt',
                    'title': '车辆类型',
                    'required': true,
                }/*,
                {
                    'key': 'licensePlateNumTxts',
                    'title': '车牌号码',
                    'required': true,
                    'pattern': /^[A-Z]{1}[D|F]{1}[A-Z0-9]{1}[0-9]{4}$/
                },
                {
                    'key': 'licensePlateNumTxts',
                    'title': '车牌号码',
                    'required': true,
                    'pattern': /^[A-Z]{1}[0-9]{5}[D|F]{1}$/
                }*/
            ],
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
                 * 请求车辆类型
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
                                    for (var i = 0, length = data.length; i < length; i++) {
                                        // 默认小型车辆
                                        if (data[i].value == '02') {
                                            vm.hpzl = data[i].value; // 车辆类型字典值
                                            vm.hpzlTxt = data[i].text; // 车辆类型文本值
                                            break;
                                        }
                                    }
                                    /* // 若没有小型车辆 02 则默认显示第一个字典值
                                     if(data.length && !vm.hpzl && !vm.hpzlTxt) {
                                         vm.hpzl = data[0].value; // 车辆类型字典值
                                         vm.hpzlTxt = data[0].text; // 车辆类型文本值
                                     }*/
                                    var tmpl = fly.template('typeTempl', data);
                                    $(".type-cont").append(tmpl);
                                    // 若没有小型车辆 02 则默认显示第一个字典值
                                    if (data.length && !vm.hpzl && !vm.hpzlTxt) {
                                        $($('.type-cont .item')[0]).addClass('select')
                                        vm.hpzl = data[0].value; // 车辆类型字典值
                                        vm.hpzlTxt = data[0].text; // 车辆类型文本值
                                    }
                                    $('.car-type .car-text').text(vm.hpzlTxt);

                                    
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
                 * 车辆类型点击
                 */
                carTypeSelectClick: function(e) {
                    var $this = $(e.currentTarget),
                        value = $this.data('value');
                    if (vm.hpzl != value) {
                        vm.hpzl = $this.data('value'), // 车辆类型字典值
                            vm.hpzlTxt = $this.data('text'); // 车辆类型文本值
                        $('.type-cont .item').removeClass('select'); // 移除之前选择的车辆
                        $this.addClass('select');
                        $('.car-type .car-text').text(vm.hpzlTxt);
                        setTimeout(function() {
                            $('.car-type-wrap').addClass('hide');
                            $('.wrap').removeClass('hide');
                        }, 400);

                    }
                },
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
                // 判断是否是首次绑定 
                judgeFirBind: function(licensePlateNum) {
                    croods.ajax({
                        method: 'c961aab358624d94872ffc85f2c201e0',
                        params: {
                            token: TOKEN,
                            licensePlateNum: licensePlateNum  // 车牌号
                        },
                        success: function(res) {
                            if(res) {
                                if (common.checkToken(res, function(newToken) {
                                    checkIndex++;
                                }, checkIndex)) {
                                    res = $.parseJSON(res);
                                    console.log(res.data+'');
                                    if(res.data) {
                                       scoreToast();  // 仅仅第一次绑定才加分
                                    }else {
                                        common.toast('绑定成功！');
                                        window.location.href = './public/wcportal/0.0.1/page/car-record-detail.html?id=' + ID + '&licensePlateNum=' + dto.licensePlateNum;
                                    }
                                    console.log(res.data);
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
            };

        /**
         * 输入框验证  校验是否是必填
         * @param: arr 需要验证的数组
         * @param: obj 表单数据对象
         */
        var inputCheck = function(arr, obj) {
            var result = true;
            for (var i in arr) {
                var value = $.trim(obj[arr[i].key]);
                if (arr[i].required && !value) {
                    common.toast(arr[i].title + '不能为空！');
                    result = false;
                } else if (arr[i].max && value.length > arr[i].max) {
                    common.toast(arr[i].title + '最多不超过' + arr[i].max + '个字符');
                    result = false;
                } else if (arr[i].pattern && !(new RegExp(rule[i].pattern).test(value))) {
                    common.toast('请输入正确的' + arr[i].title);
                    result = false;
                }
                // 结果错误 输入框赋值为空
                if (!result) {
                    if (arr[i].key == 'licensePlateNumTxts') {
                        $('input[name="licensePlateNum"]').val('');
                    } else {
                        $('input[name=' + arr[i].key + ']').val('');
                    }
                    return false;
                }
            }
            return true;
        };
        /**
         * 添加事件
         */
        var addEvent = function() {
            // 车辆类型点击
            $('.car-type-wrap').off('.type-cont .item').on('click', '.type-cont .item', eventHandle.carTypeSelectClick);
        };
        
        // 原生积分弹框请求
        var scoreToast = function() {

            var REQUEST = common.packData({
                            "content": '成功绑定爱车',
                            "number": '10',
                        }, "", "1", false, "");

            croods.customPlugin({
                action: 'IntegralPlugin.toast',
                params: REQUEST,
                success: function(res) {}
            });
            window.location.href = './public/wcportal/0.0.1/page/car-record-detail.html?id=' + ID + '&licensePlateNum=' + dto.licensePlateNum;
        };

        fly.bind(document.body, vm);
        $('.mark').hide();
        // 绑定手机物理返回键
        croods.bindButton({
            keycode: ['backbutton'],
            success: function(res) {
                var markDisplay = $('.mark').css('display');
                if (markDisplay == 'none') {
                    if ($('.wrap').hasClass('hide')) {
                        $('.car-type-wrap').addClass('hide');
                        $('.wrap').removeClass('hide');
                    } else {
                        window.history.back(-1);
                    }
                } else {
                    $('.mark').hide();
                }

            }
        });
        $(function() {
            eventHandle.getUserInfo();
            addEvent();
        });

    });
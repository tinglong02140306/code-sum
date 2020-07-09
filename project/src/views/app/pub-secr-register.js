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
        var sendSmsTime = 0,   // 请求验证码次数 为5次  每次120s
            startTime = 120, // 倒计时开始时间，开始为120s
            timerItem, // 120定时器
            sendType,  // 0 代表前5次 1 代表第6次
            agreeFlag = '1',  // 协议选择标志
            rule = [{
                'key': 'phone',
                'title': '手机号',
                'required': true,
                'pattern': /^1[3|4|5|7|8][0-9]{9}$/ // 手机号验证规则
            }, {
                'key': 'password',
                'title': '密码',
                'required': true,
                'pattern': /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,14}$/ // 手机号验证规则
            }, {
                'key': 'username',
                'title': '用户名',
                'required': true,
                'pattern': /^[a-zA-Z]{1}[0-9a-zA-Z\_]{3,19}$/ // 用户名

            }, {
                'key': 'cardNum',
                'title': '证件号码',
                'required': true
            }, {
                'key': 'name',
                'title': '姓名',
                'required': true
            }, {
                'key': 'nation',
                'title': '民族',
                'required': true
            }],

            vm = window.vm = fly.observable({
                form: {
                    phone: '',  // 手机号码  
                    verifyCode: '', // 短信验证码
                    password: '', // 密码
                    username: '',  // 用户名
                    cardNum: '', // 证件号码
                    name: '', // 姓名
                    nation: '汉族', // 民族
                    nationValue: '', // 民族value
                    inviteCode: ''  // 邀请码
                },
                // 发送验证码点击事件
                sendSmsNumClick: function(e) {
                    var self = $(e.currentTarget),
                        flag = self.data('flag'); // 为1时按钮可点击  0 时不可点击
                    if (flag == '0') {
                        return;
                    }
                    
                    var phone = vm.form.get('phone');

                    if(common.checkTel(phone)) {  // 手机号验证通过
                        croods.ajax({  // 请求验证码接口
                            method: '150e9fa6ad164f01b66f661d205c6f13',
                            params: {
                                phone: phone,   // 手机号
                                type: 'REGISTER'   
                            },
                            success: function(res) {
                                var res = $.parseJSON(res),
                                    data = res.data;
                                if (res.flag) {

                                    $('.c-down-text').attr('data-flag', '0');
                                    sendSmsTime ++;  //  请求验证码次数 为5次

                                    if(sendSmsTime < 6) {  // 最多请求5次 第6次需等15分钟之后
                                        startTime = 120;
                                        sendType = '0';
                                        $('.time-distr').text('重新发送(');
                                        $('.time-down-text').removeClass('hide');
                                        $('.bracket').removeClass('hide');
                                        $('.time-down-text').text('120');
                                        $('.bracket').text(')');
                                    }else {
                                        common.toast('您发送验证码太频繁了，请15分钟后再试');
                                        startTime = 900;
                                        sendType = '1';
                                    }
                                    eventHandle.timerStart(startTime,sendType);
                                } else {
                                    common.toast('请求数据失败！');
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
                    }else {
                        common.toast('请输入正确的手机号');
                    }
                },
                // 民族选择跳转页面
                nationSelClick: function(e) {
                    var nationText = vm.form.get('nation');
                    if(nationText.length < 0) {
                        common.toast('暂无民族数据类型！');
                        return;
                    }
                    $('.content').addClass('hide');
                    $('.nation-content').removeClass('hide');
                },
                // 协议点击事件
                agreeClick: function(e) {
                    var self = $(e.currentTarget),
                        flag = self.data('flag');
                    if(flag == '1') {  // 1 表示选中 0 表示不选
                        $('.agree-flag').removeClass('right-f');
                        self.data('flag', '0');
                        agreeFlag = '0';
                    }else if(flag == '0') {
                        $('.agree-flag').addClass('right-f');
                        self.data('flag', '1');
                        agreeFlag = '1';
                    }
                    // 实时监听按钮是否可用
                    eventHandle.inputMonitorEvent();
                },

                // 密码显示和隐藏
                keyShowHideClick: function(e) {
                    var self = $(e.currentTarget),
                        flag = self.data('flag');
                    if (flag == '1') { // 1 显示密码 0 隐藏密码  默认隐藏密码
                        $('#hidePass').addClass('hide');
                        $('#showPass').removeClass('hide');
                        $('.icon-key').addClass('icon-hide-key');
                        $('.icon-key').removeClass('icon-show-key');
                        self.data('flag', '0');
                    } else if (flag == '0') {
                        $('#hidePass').removeClass('hide');
                        $('#showPass').addClass('hide');
                        $('.icon-key').addClass('icon-hide-key');
                        $('.icon-key').removeClass('icon-show-key');
                        self.data('flag', '1');
                    }
                },

                // 立即注册按钮
                regClick: function() {
                    var dataParam = {};
                        dataParam.phone = $.trim(vm.form.get('phone')); // 手机号
                        dataParam.verifyCode = $.trim(vm.form.get('verifyCode')); // 验证码
                        dataParam.password = $.trim(vm.form.get('password')); // 密码
                        dataParam.username = $.trim(vm.form.get('username'));  // 验证码
                        dataParam.cardNum = $.trim(vm.form.get('cardNum'));  // 证件号
                        dataParam.name = $.trim(vm.form.get('name'));  // 姓名
                        dataParam.nationValue = $.trim(vm.form.get('nationValue')); // 民族
                    if(eventHandle.inputCheck(rule,dataParam)) {
                        return;
                    }
                }
            }),
            /**
             * 请求数据模块
             */
            requestHandle = {
                /**
                 * 请求民族列表数据
                 */
                getNationTypeData: function() {
                    croods.ajax({
                        method: 'b60636f00513409dba9a69a5e82aa223',
                        params: {
                            datatype: 'NATION'
                        },
                        success: function(res) {
                            var res = $.parseJSON(res),
                                data = res.data;
                            if(data && res.flag) {
                                var tmpl = fly.template('nationTmpl', data);
                                $(".nation-content").append(tmpl);

                                // 民族默认选择第一项
                                vm.form.set('nation', data[0].text);
                                vm.form.set('nationValue', data[0].value);

                            }else {
                                common.toast('请求数据失败！');
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
                //区域选择点击事件
                nationItemClick: function() {
                    var $this = $(this),
                        text = $this.data('text'),
                        value = $this.data('value');
                    vm.form.set('nation', text);
                    vm.form.set('nationValue', value);
                    setTimeout(function(){
                        $('.content').removeClass('hide');
                        $('.nation-content').addClass('hide');
                    }, 400);
                },
                // 倒计时
                countDown: function() {
                    if (startTime > 0) {
                        if(sendSmsTime <= 5) { // 倒计时开始时  按钮不可点击
                            $('.c-down-text').attr('data-flag', '0');
                        }
                        startTime--;
                    }else if(startTime == 0) {
                        $('.time-distr').text('重新发送');
                        $('.time-down-text').addClass('hide');
                        $('.bracket').addClass('hide');

                        if(sendSmsTime <= 5) { // 倒计时结束时 按钮可点击
                            $('.c-down-text').attr('data-flag', '1');
                        }
                        if(sendType == '1') {
                            sendSmsTime = 1;  // 5次轮回重新开始
                        }

                        // 开始是 发送验证码(未点击时)
                        // 点击一次后 重新发送（XX）s  按钮不可点击
                        // 
                        return;  // 对应倒计时数不渲染
                    }

                    $('.time-down-text').text(startTime);  
                },
                // 时间计时 1s一次
                timerStart: function(startTime, sendType) {
                    timerItem = setInterval(function() {
                        if(startTime == 0) {  // 当120S计时结束后 清除定时
                            clearInterVal(timerItem);
                        }
                        eventHandle.countDown(startTime, sendType);
                    }, 1000);
                },
                // 输入框实时监听、判断按钮是否可用
                inputMonitorEvent: function() {
                    var valFlag = eventHandle.judgeAllInVal();
                    if(valFlag && agreeFlag == '1') {
                        $('.btn-wrap a').addClass('use');
                        $('.btn-wrap a').removeClass('unuse');
                        $('.btn-wrap a').attr('data-flag', '1');
                    }else {
                        $('.btn-wrap a').removeClass('use');
                        $('.btn-wrap a').addClass('unuse');
                        $('.btn-wrap a').attr('data-flag', '0');
                    }
                },
                // 判断input框是否全部有值
                judgeAllInVal: function() {
                    var phone = $.trim($('input[name=phone]').val()),
                        verifyCode = $.trim($('input[name=verifyCode]').val()),
                        password = $.trim($('input[name=password]').val()), 
                        username = $.trim($('input[name=username]').val()),
                        cardNum = $.trim($('input[name=cardNum]').val()),
                        name = $.trim($('input[name=name]').val()),
                        nation = $.trim(vm.form.get('nation'));
                    var ValFlag = !!(phone && verifyCode && password && username && cardNum && name && nation);
                    if(ValFlag) {
                        return true;
                    }else {
                        return false;
                    }
                },
                /**
                 * 输入框验证  校验是否是必填
                 * @param: arr 需要验证的数组
                 * @param: obj 表单数据对象
                 */ 
                inputCheck: function(arr, obj) {
                    var result = true;
                    for (var i in arr) {

                        var value = $.trim(obj[arr[i].key]);
                        if(arr[i].key == 'cardNum') { // 3
                            if(!common.checkCard(vm.form.get('cardNum'))) {  // 进行证件号验证 单独处理
                                common.toast('请输入正确的身份证号');
                                result = false;
                                return false;
                            }
                        }
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
                    }
                    return result;
                }
            };

            var addEvent = function() {
                var self = $('.wrap');
                // 民族选择点击事件
                self.off('.nation-content a').on('click', '.nation-content a', eventHandle.nationItemClick);
                // input输入框监听
                self.off('input').on('input propertychange','input',eventHandle.inputMonitorEvent);

            };
        fly.bind(document.body, vm);
        addEvent();
        requestHandle.getNationTypeData();
    });
/**
 * @author hmxue
 * @time 2018-01-17
 * @description 挪车设置
 */
require.config(requireConfig);
define(['jquery',
    'fly',
    'common',
    'message',
    'util',
    'datePicker'
], function ($, fly, common, message, util, datePicker) {
	 var vm = fly.observable({
        form: {
            TEL_BEGIN: '', // 语音服务开始时间
            TEL_END: '', // 语音服务结束时间
            PRESS_TIME: '', // 催一催间隔
            LIMIT_NUM: '', // 每日可移车次数
            SERVICE_BEGIN: '', // 服务开始时间
            SERVICE_END: '' // 服务结束时间
        },
        limitList: fly.dataSource ({
            data: [{
                value:'1',
                text:'1',
            },
            {
                value:'2',
                text:'2',
            },{
                value:'3',
                text:'3',
            },{
                value:'4',
                text:'4',
            },{
                value:'5',
                text:'5',
            },{
                value:'6',
                text:'6',
            },{
                value:'7',
                text:'7',
            },{
                value:'8',
                text:'8',
            },{
                value:'9',
                text:'9',
            },{
                value:'10',
                text:'10',
            }]
        }),
        pressList: fly.dataSource({
           data: [{
                value:'5',
                text:'5',
            },
            {
                value:'10',
                text:'10',
            },{
                value:'15',
                text:'15',
            }
            ,{
                value:'20',
                text:'20',
            }
            ,{
                value:'30',
                text:'30',
            }] 
        })
    });
    var requestEvent = {
        requestSetDate: function() {
            util.mask();
            fly.$.ajax({
                url: CONTEXTPATH + '/sys/configs',
                data: {},
                dataType: 'json',
                type: 'POST',
                cache: false,
                success: function (res) {
                    util.removeMask();
                    if(res && res.flag) {
                        var data = res.data;
                        for(var i=0,len=data.length;i<len;i++) {
                            var tmp = data[i];
                            switch(tmp.key) {
                                case 'SERVICE_BEGIN':
                                    $('.service-begin').html(tmp.value);
                                    vm.form.set('SERVICE_BEGIN',tmp.value);
                                    break;
                                case 'SERVICE_END':
                                    $('.service-end').html(tmp.value);
                                    vm.form.set('SERVICE_END',tmp.value);
                                    break;
                                case 'LIMIT_NUM':
                                    // $('.limit-num').html(tmp.value + '次');
                                     $('.limit-num').html(tmp.value + '次');
                                    vm.form.set('LIMIT_NUM',tmp.value);
                                    break;
                                case 'PRESS_TIME':
                                    $('.press-num').html(tmp.value + '分钟');
                                    vm.form.set('PRESS_TIME',tmp.value);
                                    break;
                                case 'TEL_BEGIN':
                                    $('.tel-begin').html(tmp.value);
                                    vm.form.set('TEL_BEGIN',tmp.value);
                                    break;
                                case 'TEL_END':
                                    $('.tel-end').html(tmp.value);
                                    vm.form.set('TEL_END',tmp.value);
                                    break;
                            }

                        }
                        $('.wrap').removeClass('hide');
                    }else {

                    }
                },
                error: function(res) {
                    util.removeMask();
                }
            });
        },
        // 获取每日可以申请的次数
        requestGetLimitData: function() {

        },
        // 获取催一催的时间间隔
        requestGetPressData: function() {
            var data = [{
                value:'15分钟',
                name:'15分钟',
            },
            {
                value:'20分钟',
                name:'20分钟',
            },{
                value:'25分钟',
                name:'25分钟',
            }];

        }
    },
    eventHandle = {
        // 可挪车次数点击事件
        limitBtnCLick: function() {
            var text = $(this).text();
            if(text == '编辑') {
                $(this).text('保存');
                $('.limit-label').addClass('hide');
                $('.limit-btn').addClass('mr');
                $('.limit-edit').removeClass('hide');
            }else {
                var  param = {
                    'LIMIT_NUM':vm.form.LIMIT_NUM
                };
                util.mask();
                fly.$.ajax({
                    url: CONTEXTPATH + '/sys/setConfig',
                    data: param,
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (res) {
                        util.removeMask();
                        if(res && res.flag) {
                            util.tip('保存成功！','success');
                            $('.limit-num').html(vm.form.LIMIT_NUM+'次');
                            $('.limit-btn').text('编辑');
                            $('.limit-label').removeClass('hide');
                            $('.limit-edit').addClass('hide');
                            $('.limit-btn').removeClass('mr');
                        }else {
                            util.tip('保存失败！','warning');
                        }
                        
                    },
                    error: function() {
                        util.tip('服务端错误！','warning');
                    }
                });
            }
        },
        // 催一催间隔点击事件
        pressBtnCLick: function() {
            var text = $(this).text();
            if(text == '编辑') {
                $(this).text('保存');
                $('.press-label').addClass('hide');
                $('.press-btn').addClass('mr');
                $('.press-edit').removeClass('hide');
            }else {
                var  param = {
                    'PRESS_TIME':vm.form.PRESS_TIME
                };
                util.mask();
                fly.$.ajax({
                    url: CONTEXTPATH + '/sys/setConfig',
                    data: param,
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (res) {
                        util.removeMask();
                        if(res && res.flag) {
                            util.tip('保存成功！','success');
                             $('.press-num').html(vm.form.PRESS_TIME+'分钟');
                            $('.press-btn').text('编辑');
                            $('.press-label').removeClass('hide');
                            $('.press-btn').removeClass('mr');
                            $('.press-edit').addClass('hide');
                        }else {
                            util.tip('保存失败！','warning');
                        }
                        
                    },
                    error: function() {
                        util.tip('服务端错误！','warning');
                    }
                });
            }
        },
        // 服务时间点击事件
        serviceBtnCLick: function() {
            var text = $(this).text(),
                telText = $('.tel-btn').text();
            if(text == '编辑') {
                if(telText != '编辑') {
                    return;
                }
                $('.tel-btn').addClass('huise');
                $(this).text('保存');
                $('.service-label').addClass('hide');
                $('.service-edit').removeClass('hide');
            }else {
                var serviceBegin = $('#serviceBegin').val(),
                    serviceEnd = $('#serviceEnd').val();
                if(!serviceBegin || !serviceBegin) {
                    util.tip('开始时间或结束时间不能为空！','warning');
                    return;
                }
                if(serviceEnd < vm.form.TEL_END || serviceEnd < vm.form.TEL_BEGIN) {
                    util.tip('服务时间必须超过语音启动时间！','warning');
                    return;
                }
                util.mask();
                fly.$.ajax({
                    url: CONTEXTPATH + '/sys/setConfig',
                    data: {'SERVICE_BEGIN':serviceBegin,'SERVICE_END':serviceEnd},
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (res) {
                        util.removeMask();
                        if(res && res.flag) {
                            $('.tel-btn').removeClass('huise');
                            vm.form.set('SERVICE_BEGIN',serviceBegin);
                            vm.form.set('SERVICE_END',serviceEnd);

                            $('.service-begin').html(serviceBegin);
                            $('.service-end').html(serviceEnd);
                            util.tip('保存成功！','success');
                            $('.service-btn').text('编辑');
                            $('.service-label').removeClass('hide');
                            $('.service-edit').addClass('hide');
                        }else {
                            util.tip('保存失败！','warning');
                        }
                        
                    },
                    error: function() {
                        util.tip('服务端错误！','warning');
                    }
                });
            }
        },
         // 语音服务时间
        telBtnCLick: function() {
            var text = $(this).text(),
                serviceTest = $('.service-btn').text();
            if(text == '编辑') {
                if(serviceTest != '编辑') {
                    return;
                }
                $('.service-btn').addClass('huise');
                $(this).text('保存');
                $('.tel-label').addClass('hide');
                $('.tel-edit').removeClass('hide');
            }else {
                var telBegin = $('#telBegin').val(),
                    telEnd = $('#telEnd').val();
                if(!telBegin || !telEnd) {
                    util.tip('开始时间或结束时间不能为空！','warning');
                    return;
                }
                util.mask();
                fly.$.ajax({
                    url: CONTEXTPATH + '/sys/setConfig',
                    data: {'TEL_BEGIN':telBegin,'TEL_END':telEnd},
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function (res) {
                        util.removeMask();
                        if(res && res.flag) {
                            $('.service-btn').removeClass('huise');
                            vm.form.set('TEL_BEGIN',telBegin);
                            vm.form.set('TEL_END',telEnd);
                            $('.tel-begin').html(telBegin);
                            $('.tel-end').html(telEnd);
                            util.tip('保存成功！','success');
                            $('.tel-btn').text('编辑');
                            $('.tel-label').removeClass('hide');
                            $('.tel-edit').addClass('hide');
                        }else {
                            util.tip('保存失败！','warning');
                        }
                        
                    },
                    error: function() {
                        util.tip('服务端错误！','warning');
                    }
                });
            }
        }
    },
    init = function() {
        requestEvent.requestSetDate(); //查询所有配置项
    },
    addEvent = function() {
        // 可挪车次数点击事件
        $('.wrap').off('.limit-btn').on('click','.limit-btn', eventHandle.limitBtnCLick);
        // 催一催间隔点击事件
        $('.wrap').off('.press-btn').on('click','.press-btn', eventHandle.pressBtnCLick);
        // 服务时间点击事件
        $('.wrap').off('.service-btn').on('click','.service-btn', eventHandle.serviceBtnCLick);
        // 语音服务时间点击事件
        $('.wrap').off('.tel-btn').on('click','.tel-btn',eventHandle.telBtnCLick);
    };
	fly.bind('body', vm);
    init();
    addEvent();
});
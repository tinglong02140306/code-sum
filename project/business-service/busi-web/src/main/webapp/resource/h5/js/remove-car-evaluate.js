/**
 * @author hmxue
 * @time 2018-01-12
 * @description 挪车评价
 */
'use strict';
$(function() {
    if(util.phoneOs() == 'IOS') {
        $('header').addClass('ios-header');
    }
	util.refreshHistory('挪车评价');
    var platForm = util.checkMobilePlatform(),
        ID = fly.getQueryString('id'), // 挪车记录ID
        removeflag = true,// 评价按钮是否可点击
        vm = window.vm = fly.observable({
            // 参数
            param: {
                id: ID, // 挪车记录ID
                status: '2', // 2挪车完成 3挪车失败
                driverAttitudeRank:'3', // 车主态度默认满意
                driverSpeedRank: '3', // 挪车速度 默认满意
                evaluateContent: '' // 评价内容
            },
            // 返回事件
            back: function() {
                window.history.back(-1);
            },
            // 挪车成功 
            successClick:function(e) {
                var $this = $(e.currentTarget),
                    index = $this.data('index');
                if(index == '1') { // 挪车成功已选标志
                    return;
                }else {
                    $('.success-wrap .success-bg').addClass('select-success-bg'); // 成功标志添加选中图片
                    $('.success-wrap .success-bg').css('border','2px solid #4c72ff'); // 成功标志添加蓝色边框
                    $('.success-wrap .seclect-icon').removeClass('hide'); // 蓝色对号显示
                    $('.success-select-label span').css('color','#4c72ff'); // 挪车成功字样为蓝色

                    $('.fail-wrap .fail-bg').removeClass('fail-select-bg'); // 失败标志添加未选择图片
                    $('.fail-wrap .fail-bg').css('border','2px solid #d4d4d4'); // 失败标志添加灰色边框
                    $('.fail-wrap .seclect-icon').addClass('hide'); // 蓝色对号隐藏
                    $('.fail-select-label span').css('color','#3d3d3d'); // 挪车失败字样为灰色
                    vm.param.set('status','2'); // 挪车成功
                    $this.data().index = '1'; // 挪车成功不可点
                    $('.flag2').data().index = '0'; // 挪车失败可点
                }
            },
            // 挪车失败
            failClick: function(e) {
                var $this = $(e.currentTarget),
                    index = $this.data('index');
                if(index == '1') { // 挪车失败已选标志
                    return;
                }else {
                    $('.fail-wrap .fail-bg').addClass('fail-select-bg'); // 失败标志添加选中图片
                    $('.fail-wrap .fail-bg').css('border','2px solid #4c72ff'); // 失败标志添加蓝色边框
                    $('.fail-wrap .seclect-icon').removeClass('hide'); // 蓝色对号显示
                    $('.fail-select-label span').css('color','#4c72ff'); // 挪车失败字样为蓝色

                    $('.success-wrap .success-bg').removeClass('select-success-bg'); // 成功标志添加未选择图片
                    $('.success-wrap .success-bg').css('border','2px solid #d4d4d4'); // 成功标志添加灰色边框
                    $('.success-wrap .seclect-icon').addClass('hide'); // 蓝色对号隐藏
                    $('.success-select-label span').css('color','#3d3d3d'); // 挪车失败字样为灰色
                    vm.param.set('status','3'); // 挪车失败
                    $this.data().index = '1'; // 挪车失败不可点
                    $('.flag1').data().index = '0'; // 挪车成功可点
                } 
            },
            // 评价信息点击事件
            saveEvaluateClick: function(e) {
                if(!removeflag) {
                    return;
                }
                removeflag = false; // 评价按钮不可点击
                $('#evaluate').blur();
                var setTimeoutData = 300; // 解决键盘弹出 页面混乱问题
                if(util.phoneOs() == 'IOS') {
                    setTimeoutData = 500;
                }
                setTimeout(function() { // 解决键盘弹出 页面混乱问题
                    var content = $('.write-evaluate').val(),
                        url = CONTEXTPATH + '/apply/evaluate',
                        data = vm.param.toJSON();
                        data.evaluateContent = content,
                    util.ajaxRequest(url,data,function(res) {
                          if(res && res.flag) {
                                eventHandle.toastCenter($('.success-content')); // 感谢评价框居中
                                $('.evaluate-success').removeClass('hide'); // 感谢评价弹框显示
                                setTimeout(function() {
                                   window.location.href = CONTEXTPATH + '/h5/remove-car-app';
                                }, 1500);
                        }else {
                              removeflag = true; // 评价按钮可以点击
                            if(platForm) {
                                util.toast('提交评价失败！');
                            }else {
                                util.toastHtml('提交评价失败！','','','');
                            }
                        }
                    }, function (res) {
                        removeflag = true; // 评价按钮可以点击
                        if(platForm) {
                            util.toast('提交评价失败！');
                        }else {
                            util.toastHtml('提交评价失败！','','','');
                        }
                    });
                },setTimeoutData);
            },

        }),
        // 请求数据模块
        requestEvent = {
            getEvaluateData: function() {
                var url = CONTEXTPATH + '/dict/type',
                    param = {type:'EVALUATE_LEVEL'};
                util.ajaxRequest(url,param,function(res) {
                    if(res && res.flag) {
                        var tmp = fly.template('evaluateTempl', res.data);
                        $('.item-value').html(tmp); // 车主态度 挪车速度
                    }
                });
            }
        },
        eventHandle = {
            // 车主态度 挪车速度 实际点击事件
            selectClick: function(e) {
                var index = $(this).parent('.item-value').data('index'), // 0 车主态度 1 挪车速度
                    indexType = $(this).data('indextype'), // 1 吐槽 2 中评 3 满意
                    flag = '.owners-attitude'; // 1车主态度 2挪车速度
                if(index == '0') {
                    if(vm.param.driverAttitudeRank == indexType) { // 点击车主态度已经选中的评价，不做操作
                        return;
                    }
                    vm.param.driverAttitudeRank = indexType;
                    flag = '.owners-attitude';
                }else {
                    if(vm.param.driverSpeedRank == indexType) { // 点击挪车速度已经选中的评价，不做操作
                        return;
                    }
                    vm.param.set('driverSpeedRank',indexType);
                    flag = '.move-speed';
                }
                var hasSelect = $(flag + ' .img-type'+indexType).hasClass('select-type'); // 该ITEM是否已经选中
                if(hasSelect) {
                    $(flag).find('span').removeClass('hide-opacity'); // 所有评价字样（吐槽、中评、好评）显示
                    $(flag).find('img').removeClass('select-type'); 
                    $(this).find('span').addClass('hide-opacity'); // 该评价字样（吐槽、中评、好评）显示
                    $(this).find('img').addClass('select-type');
                    $(flag + ' .img-type1').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon1_select.png');
                    $(flag + ' .img-type2').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon2_select.png');
                    $(flag + ' .img-type3').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon3_select.png');
                    $(flag + ' .img-type'+indexType).removeClass('select-type');
                    $(flag + ' .img-type'+indexType).attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon' + indexType +'.png');
                }else {
                    $(flag).find('span').addClass('hide-opacity');
                    $(flag).find('img').removeClass('select-type');
                    $(this).find('span').removeClass('hide-opacity');
                    $(this).find('img').addClass('select-type');
                    $(flag + ' .img-type'+indexType).addClass('select-type');
                    $(flag + ' .img-type1').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon1.png');
                    $(flag + ' .img-type2').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon2.png');
                    $(flag + ' .img-type3').attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon3.png');
                    $(flag + ' .img-type'+indexType).attr('src',CONTEXTPATH + '/resource/h5/images/remove-car/icon' + indexType +'_select.png');
                }
            },
            // 弹框居中
            toastCenter: function($this) {
                $this.css({ 
                    position: "absolute", 
                    top: ($('.mask').height() - $this.outerHeight())/2 
                }); 
            }
        };
    var init = function() {
        // 评价字典值
        requestEvent.getEvaluateData();
    }
    var addEvent = function() {
        var $this = $('.wrap');
        // 车主态度 挪车速度 实际点击事件
        $this.off('.item-value .type').on('click','.item-value .type', eventHandle.selectClick);
    }
    fly.bind(document.body, vm);
    init(); // 初始化
    addEvent(); // 添加事件

});
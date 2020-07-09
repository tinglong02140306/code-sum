/**
 * @author hmxue
 * @time 2018-01-13
 * @description 挪车评价
 */
'use strict';
$(function() {
    var platForm = util.checkMobilePlatform(),
        ID = fly.getQueryString('id'), // 挪车记录ID
        vm = window.vm = fly.observable({
            // 返回事件
            back: function() {
                window.history.back(-1);
            }
        }),
        // 请求数据模块
        requestEvent = {
            // 请求申请挪车基本信息
            requestApplayDetails: function() {
                if(platForm) {
                    util.mask(true);
                }else {
                    util.maskHtml(true,'');
                }
                var url = CONTEXTPATH + '/apply/detail',
                    param = {id: ID}; // 申请ID
                util.ajaxRequest(url,param,function(res) {
                    if(platForm) {
                            util.mask(false);
                        }else {
                            util.maskHtml(false,'');
                        }
                        if(res && res.flag){
                            var data = res.data,
                                task = data.tasks, // 通知信息（短信、电话）
                                applyInfo = data.applyInfo; // 挪车信息
                            if(data) {
                                if(applyInfo.applyTime) {
                                    eventHandle.tranTime(applyInfo.applyTime,'1'); // 申请时间
                                }
                                if(applyInfo.lastUpdateTime){
                                    eventHandle.tranTime(applyInfo.lastUpdateTime,'3'); // 挪车时间
                                }
                                if(applyInfo.status == '2') { // 挪车完成 2取消挪车
                                    $('.result-icon').addClass('result-success');
                                    $('.result-label').html('挪车成功');
                                }
                                if(task && task.eventTime) { // 通知车主是否成功
                                    $('.notice-line').removeClass('no-line');
                                    eventHandle.tranTime(task.eventTime,'2'); //通知车主
                                    $('.notice-carowner').addClass('notice-sucess');
                                }
                                $('.content-wrap').removeClass('hide'); // 内容渲染完后显示dom 防止默认值闪现
                                $('.car-num .value').html(applyInfo.carPlateNum); // 车牌号码
                                $('.address .value').html(applyInfo.address); // 所在位置
                                if(applyInfo.reasonText) { // 挪车原因
                                    $('.reason .value').html(applyInfo.reasonText);
                                    $('.reason').removeClass('hide');
                                }
                                if(applyInfo.pictures) { // 现场图片
                                    var downloadUrl = $('.download-url').html(),
                                        pictures = applyInfo.pictures.split(','),
                                        data = [],
                                        urlObj = {};
                                    for(var i=0,len = pictures.length;i < len;i++ ) {
                                        urlObj = {};
                                        urlObj.imgUrl = downloadUrl + pictures[i];
                                        data.push(urlObj);
                                    }
                                    var tmpl = fly.template('imgTmpl',data);
                                    $('.car-mes-logo').html(tmpl);
                                    $('.car-mes-logo').removeClass('hide');
                                    $(".car-mes-logo img").off('error').on('error', function() {
                                        $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
                                        $(this).css('minWidth','100%');
                                    }); // 默认图片
                                }
                                if(applyInfo.driverAttitudeRank == '1') { // 车主态度 吐槽
                                    $('.carowner-attitude .value').addClass('pj-low');  
                                }else if(applyInfo.driverAttitudeRank == '2') { // 车主态度中评 默认好评
                                    $('.carowner-attitude .value').addClass('pj-center');
                                }
                                $('.carowner-attitude .value').html(applyInfo.driverAttitudeRankText); // 车主态度值
                                if(applyInfo.driverSpeedRank == '1') { // 挪车速度 吐槽
                                    $('.move-speed .value').addClass('pj-low');  
                                }else if(applyInfo.driverSpeedRank == '2') { // 挪车速度 中评 默认好评
                                    $('.move-speed .value').addClass('pj-center');
                                }
                                $('.move-speed .value').html(applyInfo.driverSpeedRankText); // 挪车速度值
                                $('.remove-evaluate').removeClass('hide');
                                if(applyInfo.evaluateContent) { // 评价内容
                                    $('.evaluate-text .content').html(applyInfo.evaluateContent);
                                    $('.evaluate-text').removeClass('hide');
                                }else {
                                    $('.move-speed').css('borderBottom','none'); // 无挪车评价 车主态度下面的线不显示
                                }
                            }

                        }else {
                            if(platForm) {
                                util.toast('请求数据失败！');
                            }else {
                                util.toastHtml('请求数据失败！','','','');
                            }
                        }
                },function(res) {
                    if(platForm) {
                        util.mask(false);
                        util.toast('请求数据失败！');
                    }else {
                        util.maskHtml(false,'');
                        util.toastHtml('请求数据失败！','','','');
                    }
                });
            },
            // 请求申请挪车的评价信息
            requestEvaluateData: function() {

            }
        },
        eventHandle = {
            // 时间转换
            tranTime: function(timer,type) {
                var date = new Date(timer),
                    month = date.getMonth() + 1, // 月
                    day = date.getDate(), // 日
                    hour = date.getHours(), // 时
                    minutes = date.getMinutes(); // 分
                hour = hour<10?'0'+hour:hour;
                minutes = minutes<10?'0'+minutes:minutes;
                switch(type) {
                case '1': 
                    $('.apply-time').html(month + '月' + day + '日' + " " + hour + ":" + minutes);
                    break;
                case '2': 
                    $('.notice-time').html(month + '月' + day + '日' + " " + hour + ":" + minutes);
                    break;
                case '3':
                    $('.result-time').html(month + '月' + day + '日' + " " + hour + ":" + minutes);
                    break;
                }
            }
        };
    var init = function() {
        requestEvent.requestApplayDetails(); // 请求申请详情数据
        //requestEvent.requestEvaluateData();
    }
    fly.bind(document.body, vm);
    init(); // 初始化
});
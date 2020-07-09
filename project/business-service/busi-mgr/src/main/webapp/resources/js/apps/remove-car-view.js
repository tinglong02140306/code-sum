require.config(requireConfig);
define(['jquery',
    'fly',
    'common',
    'message',
    'util',
    'lightbox'
], function ($, fly, common, message, util, lightbox) {
    var id = fly.utils.getQueryString('id'),  // 详情id
        vm = window.vm = fly.observable({
            // 申请信息
            applyInfo: {
                applyerName: '',  // 申请人
                applyerMobile: '', // 手机号码
                applyTime: '',  // 申请时间
                carPlateTypeText: '',// 车牌颜色
                carPlateNum: '', // 移动车辆车牌号
                address: '',    // 移车地点
                evaluateContent: '', // 挪车评价
                driverAttitudeRankText: '',// 车主态度
                driverSpeedRankText: '', // 挪车速度
                statusMc: '', // 挪车状态
                driverName: '',// 车主姓名
                driverMobile: '',// 车主手机号码
                msgTelText: ''  // 电话短信文本状态
            },
            // 短信信息
            msgTask: {
                evaluateContent: '', // 评价内容
                eventName: '', // 短信送达状态文本值
                eventStatus: '', // 短信送达状态 1成功 2 失败
                eventContent: '' // 短信内容
            },
            // 电话通知情况
            telTask: {
                eventStatus: '',  // 电话接通状态 1成功 2未成功
                eventStatusMc: ''  // 文本值
            },
            picList: fly.dataSource({ // 图片预览
                data: []
            })
        }),

        // 获取数据
        getDetail = function() {
            util.mask();
            common.ajaxRequest(CONTEXTPATH + '/apply/detail', {
                id: id
            }, function(res) {
                if (res.flag) {
                    var data = res.data;
                    if(data && data.applyInfo && data.applyInfo.applyTime) {
                        data.applyInfo.applyTime = dateChange(data.applyInfo.applyTime);
                    }

                    if(data && data.msgTask && data.msgTask.eventStatus) {
                        if(data.msgTask.eventStatus == 1) {
                            data.applyInfo.msgTelText = '发送成功';
                        }else if(data.msgTask.eventStatus == 2) {
                            data.applyInfo.msgTelText = '发送失败';
                        }
                    }
                    if(data && data.telTask && data.telTask.eventStatus) {
                        if(data.telTask.eventStatus == 1) {
                            data.applyInfo.msgTelText += '/电话已接听';
                        }else if(data.telTask.eventStatus == 2) {
                            data.applyInfo.msgTelText += '/电话未接听';
                        }
                    }
                    
                    // 图片格式处理
                    if(data && data.applyInfo && data.applyInfo.pictures) {
                        var picListArr = data.applyInfo.pictures.split(','),
                            picListData = [];
                        for(var i = 0; i < picListArr.length; i++) {
                            var item = {};
                            item.filePath = FDFS_HTTP + picListArr[i];
                            picListData.push(item);
                        }
                        vm.picList.data(picListData);
                        // lishtBox插件执行
                        $("#backImg a").lightBox();   
                    }
                    
                    vm.set('applyInfo', data.applyInfo);
                    vm.set('msgTask', data.msgTask);
                    vm.set('telTask', data.telTask);

                } else {
                    util.tip('数据请求失败', 'danger');
                }
                util.removeMask();

            }, function(res) {
                util.tip('数据请求失败', 'danger');
                util.removeMask();
        }),

        // 时间格式转换
        dateChange = function(dateString) {
            var dates = new Date(dateString),
                year = dates.getFullYear(),
                month = dates.getMonth() + 1,
                day = dates.getDate(),
                hour = dates.getHours(),
                minute = dates.getMinutes(),
                seconds = dates.getSeconds();
            month = month < 10 ? '0'+ month : month;
            day = day < 10 ? '0'+ day : day;
            hour = hour < 10 ? '0'+ hour : hour;
            minute = minute < 10 ? '0'+ minute : minute;
            seconds = seconds < 10 ? '0'+ seconds : seconds;
            return year + '-' + month+ '-' + day+ ' ' + hour+ ":" + minute; 
        };
        

     /*   var data = [{
            filePath: 'http://192.168.58.134:8888/group1/M00/5A/61/wKg6hlnMS2OALf_TAAC-egpudDQ.201709'
        }];
        vm.attachmentList.data(data);
        // lishtBox插件执行
        $("#backImg a").lightBox(); */  
    };

    fly.bind(document.body, vm);
    // 详情初始化
    getDetail();

});
require.config(requireConfig);
define(['jquery',
    'fly',
    'common',
    'message',
    'util'
], function ($, fly, common, message, util) {
    var vm = window.vm = fly.observable ({
        query: {
            applyerMobile: '',  // 申请账号
            status: '',  // 挪车状态
            applyTimeBegin: '',  // 开始时间
            applyTimeEnd: ''   // 结束时间
        },
        // 挪车状态
        statusSource: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/dict/type?type=MOVE_STATUS',
                dataFilter: function(result, type) {
                    var result = fly.evalJSON(result).data; // 转换成json对象
                    return fly.toJSON(result); // 转换成json字符串
                }
            }
        }),

        //搜索
        search: function(e) {
            var data = vm.query.toJSON();
            if(data.applyerMobile.length > 20) {
                util.tip('申请账号最多只能输入20个字符', 'warning');
                return false;
            }
            vm.gridDataSource.filter(vm.query.toJSON());
        },

        // 表格数据
        gridDataSource: fly.dataSource({

            read: {
                url: CONTEXTPATH + '/apply/page',
                type: 'post',
                dataType: 'json',
                dataFilter: function(result, type) {
                    result = fly.evalJSON(result); // 转换成JSON对象
                    if (result.flag) {
                        for(var i = 0; i < result.data.rows.length; i++) {
                            result.data.rows[i].applyTime = dateChange(result.data.rows[i].applyTime);
                            result.data.rows[i].lastUpdateTime = dateChange(result.data.rows[i].lastUpdateTime);
                        }
                        retData = {
                            total: result.data.total,
                            rows: result.data.rows
                        }
                    } else {
                        retData = {
                            total: 0,
                            rows: []
                        }
                    }

                    $('.grid-table').next().remove();
                    
                    return fly.toJSON(retData); // 转换成JSON 
                }
            },

            // 每页显示数据条数 
            pageSize: 10
        }).bind('empty', function() {
            // 数据源为空
            $('#grid').empty();
            $('.grid-table').after('<div class="empty-data"></div>');
        }).bind('requestStart', function() {
            util.mask();
        }).bind('requestEnd', function() {
            util.removeMask();
        }),



        // 导出
        exportEvent: function() {
            var param = vm.query.toJSON();
            window.location.href = CONTEXTPATH+'/apply/export?applyerMobile='+ param.applyerMobile +'&status='+ param.status +'&applyTimeBegin='+ param.applyTimeBegin + '&startTime=' + param.startTime+ '&applyTimeEnd=' + param.applyTimeEnd;
        },

        // 查看详情
        viewEvent: function(e) {
            var self = $(e.currentTarget),
                id = self.data().id;
            fly.top.fly.dialog({
                id: 'viewDetail',
                title: '查看',
                url: CONTEXTPATH + '/page/remove-car-view?id=' + id,
                padding: '0',
                width: "900px", // 设置宽度
                height: "500px", // 设置高度
                cancel: true,
                cancelValue: '关闭',
                close: function() {
                }
            });

        }

        }),
        // 时间格式转换
        dateChange = function(dateString) {
            if(dateString) {
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
            }else {
                return '';
            }
           
        };

    fly.bind('body', vm);

});
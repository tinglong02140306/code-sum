require.config(requireConfig);
define(['jquery',
    'fly',
    'common',
    'message',
    'util',
    'echarts'
], function ($, fly, common, message, util,echarts) {
    var option = {
            title: {
                text: '呼入趋势'
            },
        xAxis: {
            type: 'category',
            data: [0]
        },
        yAxis: {
            type: 'value',
            name:'呼入量',
            nameTextStyle:{
                fontSize:13
            }
        },
        series: [{
            data: [],
            type: 'line'
        }]
    },
    option2 = {
        title: {
            text: '呼出趋势'
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name:'呼出量',
            nameTextStyle:{
                fontSize:13
            }
        },
        series: [{
            data: [],
            type: 'line'
        }]
    },
    xArr = [], seriesData = [];

    var vm = window.vm = fly.observable ({
        total:0,
        month:0
        });
    function requestData(){
        util.mask();
        fly.$.ajax({
            url: CONTEXTPATH + '/voiceRecord/static',
            dataType: 'json',
            type: 'POST',
            cache: false,
            success: function (res) {
                util.removeMask();
                if(res && res.flag) {
                    vm.set("total",res.data.total);
                    vm.set("month",res.data.month);
                    xArr = [], seriesData = [];
                    var data = res.data.dataCount;
                    for (var i = 0 ; i < data.length; i++){
                        xArr.push(data[i].countDate);
                        seriesData.push(data[i].countNum);
                    }
                    if(xArr.length > 0){
                        option.xAxis.data = option2.xAxis.data = xArr;
                    }
                    if(seriesData.length > 0){
                        option2.series[0].data = seriesData;
                    }
                    initEchart();
                }
            },
            error: function(res) {
                util.removeMask();
            }
        });
    }
    function initEchart(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('hrqs'));
        // 基于准备好的dom，初始化echarts实例
        var myChart2 = echarts.init(document.getElementById('hcqs'));
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart2.setOption(option2);

    }
    requestData();
    fly.bind('body', vm);

});
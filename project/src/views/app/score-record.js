/**
 * @author tinglong
 * @time 2017-01-03
 * @description 积分记录
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {

        var TOKEN = "", // 用户token
            /*USERID = "", // 用户id*/
            checkIndex = 1, // 判断token失效次数
            mescroll, // 上拉加载，下拉刷新
            CPAGE = 1,
            analysisCharts,
            option,
            analysisData = [],
            REM = $(window).width() / 16, //echarts 适用移动端的 rem 计算
            platForm = common.checkMobilePlatform(),
            vm = window.vm = fly.observable({
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }
            });
            

        var initCharts = function() {
            analysisCharts = echarts.init(document.getElementById('analysisCharts'));
            // 图标自适应
            $(window).resize(function() {
                analysisCharts.resize();
            });

            option = { 
                title: {
                    text: '总计',
                    subtext: '',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: .58 * REM, // 26
                        color: '#444'
                    },
                    subtextStyle: {
                        fontSize: .76 * REM, // 34
                        color: '#000'
                    }
                },
                color: ['#4c72ff','#4fc88a','#ffb43e','#f17954'],
                series: [
                    {
                        type:'pie',
                        radius: ['50%', '80%'],
                        center: ['50%', '55%'],
                        label: {
                            normal: {
                                position: 'outside',
                                formatter: "{b}: {c}",
                                textStyle: {
                                    fontSize: .44 * REM,  //20
                                    color: '#444'
                                }
                            }
                        },
                        data:analysisData,
                        hoverAnimation: false,
                    }
                ]
            };
        };

        var renderEvent = {

            // 渲染积分图表数据
            renderChartData: function(analysisData, chartTotal) {
                option.title.subtext = chartTotal;
                option.series[0].data = analysisData;
                analysisCharts && analysisCharts.clear && analysisCharts.clear();
                analysisCharts.setOption(option);
            },

            /**
             * 加载当前滚动条
             */
            renderScroll: function() {
                mescroll = window.mescroll = new MeScroll('wrapper', {
                    down: {
                        use: false
                    },
                    up: { // 上拉配置
                        noMoreSize: 20,
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        callback: function(page, mescroll) {
                            CPAGE = page.num;  // 当前页

                            // 判断网络状态、请求数据
                            eventHandle.judegeNetState(page);
                        
                        },
                        page: {
                            size: 20
                        }
                    }
                });
            },

            // 渲染积分详情列表数据
            renderListData: function(data) {
                if(CPAGE == 1) {
                    $(".analysis-list").empty();
                }
                var tmpl = fly.template('analysisTmpl', data);
                $(".analysis-list").append(tmpl);
            }

        },
        eventHandle = {
            // 判断网络情况
            judegeNetState: function(page) {
                common.noNet($('.wrap'), function() {  // 展示无网络图片
                    mescroll.endErr();
                    $('.no-line').removeClass('hide');
                   /* $('.no-net').addClass('hide');  // 无网络状态页*/
                    /*$('.analysis-list').removeClass('hide');  // 内容列表页*/
                    common.toast('网络无法连接，请检查您的网络');
                },function() {
                    $('.no-line').addClass('hide');
                    /*$('.no-net').addClass('hide');  // 无网络状态页*/
                   /* $('.analysis-list').removeClass('hide');*/
                    requestEvent.getListData(page);
                });
            }
        },
        requestEvent = {  // 数据请求模块

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                    $('.content').addClass('hide');  // 主体内容
                    $('body').removeClass('bf');
                    $('body').addClass('bg-grey');
                },function() {
                    $('.content').removeClass('hide'); // 主体内容
                    $('body').addClass('bf');
                    $('body').removeClass('bg-grey');
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(res) {
                            if (res.token) {  
                                /*USERID = res.id;*/
                                TOKEN = res.token;
                                if (!mescroll) {
                                    // 初始化滚动条
                                    renderEvent.renderScroll();
                                }
                                mescroll.triggerUpScroll();
                                
                                // 图标数据请求
                                requestEvent.getChartsData();
                            } else {
                                /*USERID = '';*/
                                TOKEN = '';
                            }
                        }
                    });
                });
            },
            // 获取图标数据
            getChartsData: function() {
                common.mask(true);  // 添加遮罩
                croods.ajax({
                    method: '8c233ef800f5479eb291da8c7202213d',
                    params: {
                        token: TOKEN
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);  // 去除遮罩

                        if (common.checkToken(res, function(newToken) {
                            checkIndex++;
                        }, checkIndex)) {
                            res = JSON.parse(res);
                            var data = res.data;
                            var itemData = {},
                                chartTotal;  // 图表数据总数
                            // 将图表数据置空
                            analysisData = [];

                            if(data && data.list && data.list.length) {
                                for(var i = 0; i < data.list.length; i++) {
                                    itemData = {};
                                    itemData.name = data.list[i].name;
                                    itemData.value = data.list[i].integral;
                                    if(res.data.list[i].integral > 0) {
                                        analysisData.push(itemData);
                                    }
                                }
                                chartTotal = data.total;
                            }

                            // 渲染图表数据
                            renderEvent.renderChartData(analysisData, chartTotal);
                        }

                        
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);  // 去除遮罩
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                }); 
            },
            // 获取列表数据
            getListData: function(page) {
                common.mask(true);  // 添加遮罩
                croods.ajax({
                    method: '67612adc734d4ffc884aecea77cd8690',
                    params: {
                        currentPageNo: page.num,
                        pageSize: 20,
                        token: TOKEN
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);  // 去除遮罩
                        
                        if (common.checkToken(res, function(newToken) {
                            checkIndex++;
                        }, checkIndex)) {
                            res = JSON.parse(res);
                            var data = res.data,
                                timeArray;
                                console.log(data);

                            if (data && data.rows && data.rows.length) {
                                $('.analysis-list').removeClass('hide');
                                $('.empty').addClass('hide'); 
                                for(var i = 0; i < data.rows.length; i++) {
                                    data.rows[i].integralNumber = '+' + data.rows[i].integralNumber;

                                    // 时间格式转换
                                    timeArray = data.rows[i].createTime.split(' ');
                                    data.rows[i].createTime = timeArray[0];
                                    data.rows[i].time = timeArray[1].substring(0,5);
                                }

                                mescroll.endByPage(data.rows.length, data.totalPageCount);

                                // 渲染积分详情列表数据
                                renderEvent.renderListData(data.rows);

                            } else {
                                mescroll.endSuccess();
                                $('.analysis-list').addClass('hide');
                                $('.empty').removeClass('hide');
                            }
                        }
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);  // 去除遮罩
                        mescroll.endErr();
                        common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                }); 
            }
        };

        fly.bind(document.body,vm);
        
        initCharts();
        requestEvent.getUserInfo();
    });

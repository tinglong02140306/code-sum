/**
 * @author tinglong
 * @time 2017-01-05
 * @description 我的驾照
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {

        var checkIndex = 1, // 判断token失效次数
            driverId = common.getParam('driverId'),  // 驾照id
            analysisCharts,
            option,
            placeHolderStyle, // echarts公共样式
            vm = window.vm = fly.observable({
                // 驾驶人信息
                driverInfo: {},
                // 返回事件
                back: function() {
                    window.history.back(-1);
                },
                // 解除绑定事件(弹框显示按钮)
                delBindEvent: function() {
                    $('.mark').show();
                    eventHandle.OpenMask();
                },
                // 暂不解除事件
                cancelEvent: function() {
                    $('.mark').hide();
                    eventHandle.CloseMask();
                },
                // 解除绑定
                sureClick: function() {
                    croods.ajax({
                        method: '6d76c3505c5f41bca572ec99cc7247b7',
                        params: {
                            id: driverId  // 驾照id
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            if (common.checkToken(res, function(newToken) {
                                checkIndex++;
                            }, checkIndex)) {
                                res = JSON.parse(res);
                                if(res.flag) {
                                    // common.toast('解除绑定成功!');  
                                    window.location.href = './public/wcportal/0.0.1/page/my-driver-license.html';
                                }else {
                                    common.toast('解除绑定失败!');
                                    $('.mark').hide();
                                    eventHandle.CloseMask();
                                }
                                
                            }  
                        },
                        fail: function(res) { //请求失败回调
                            common.toast('数据请求失败！');
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message); 
                            }
                        }
                    }); 

                }
            });
            
        var initCharts = function(total, score) {
            analysisCharts = echarts.init(document.getElementById('analysisCharts'));
            // 图标自适应
            $(window).resize(function() {
                analysisCharts.resize();
            });

            // echarts公共样式
            placeHolderStyle = {
                normal: {
                    label: {
                        show: false,
                        position: "center"
                    },
                    labelLine: {
                        show: false
                    },
                    color: "#eaeaea",
                    borderColor: "#eaeaea",
                    borderWidth: 0
                },
                emphasis: {
                    color: "#eaeaea",
                    borderColor: "#eaeaea",
                    borderWidth: 0
                }
            };
            option = {
                color: ['#eaeaea'],
                series: [{
                    type: 'pie',
                    radius: [59, 60],
                    grid: {
                        top: '20%',
                        bottom: '20%',
                        left: "20%",
                        right: "20%"
                    },
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: score,
                        name: '',
                        itemStyle: {
                            normal: {
                                borderWidth: 5, // 有颜色值区域的宽度
                                shadowBlur: 100,
                                shadowColor: 'rgba(0, 0, 0, 0)', //边框阴影
                                borderColor: new echarts.graphic.LinearGradient(  // border颜色渐变
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#7756ed'},
                                        {offset: 0.5, color: '#6868f2'},
                                        {offset: 1, color: '#4493fe'}
                                    ]
                                )
                            }
                        }
                    }, {
                        value: total,
                        name: '',
                        itemStyle: placeHolderStyle
                    }],
                    hoverAnimation: false
                }]
            };

            analysisCharts.setOption(option);
        };

        var eventHandle = {

            OpenMask: function() {
                document.body.addEventListener('touchmove', eventHandle.handler, false);
            },
            CloseMask: function() {
                document.body.removeEventListener('touchmove', eventHandle.handler, false);
            },
            handler: function () {
                event.preventDefault();
                event.stopPropagation();
            }
            
        },
        requestEvent = {  // 数据请求模块

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                },function() {
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',
                        params: {},
                        success: function(res) {
                            if (res.id) {
                                // 请求驾驶员相关信息
                                requestEvent.getDriversInfo();
                            }
                        }
                    });
                });
            },

            // 获取驾驶员相关信息
            getDriversInfo: function() {
                common.mask(true);
                croods.ajax({
                    method: '418935dcb8e94b2180db569f765e6584',
                    params: {
                        id: driverId  // 驾照id
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        common.mask(false);
                        if (common.checkToken(res, function(newToken) {
                            checkIndex++;
                        }, checkIndex)) {
                            res = JSON.parse(res);
                            var data = res.data;

                            // 驾照号、档案编号格式转换
                            var drNo = data.licenseNumber,
                                docNo = data.archivalCoding;
                            data.licenseNumber = drNo.substring(0, 4) + '***' + drNo.substring(drNo.length-4, drNo.length);
                            data.archivalCoding = docNo.substring(0, 4) + '***' + docNo.substring(docNo.length-4, docNo.length);
                            
                            // 驾驶证状态样式修改
                            if(data.licenseStatus == '正常') {
                                $('.jszss').addClass('jszzt-normal');
                            }
                            
                            vm.set('driverInfo', data);

                            // 图例数据渲染
                            var score, 
                                total = 12;
                            score = data.cumulativeIntegral;
                            total = total - score;

                            initCharts(total, score);
                        }
                        
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
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
        requestEvent.getUserInfo(); 
    });

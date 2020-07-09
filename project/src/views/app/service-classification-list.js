/**
 * @author hmxue
 * @time 2017-11-09
 * @description 警营提示详情页
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'remCacul'
    ],
    function(common, remCacul) {
        var projectType = common.getParam('code'),
            title = common.getParam('name'),
            OS = common.phoneOs(), // 终端类型
            terminalType, // 终端类型编码值
            TOKEN, // 用户唯一标识符
            CNAME = '',
            inputVal = '',
            mescroll, // 上拉刷新 下拉加载
            AID = '', // 区域ID
            CPAGE = 1, // 当前页码
            workUrl = [], // 办事项url地址跳转数据
            maskFlag = false, // 是否需要加遮罩
            vm = window.vm = fly({
                // 清除搜索框
                clearClickEvent: function() {
                    inputVal = '';
                    $('.search-input input').val('');
                    $('.btn-delete').addClass('hide');
                    $('.search-input label').removeClass('hide');
                    $('.search-input input').blur();
                    mescroll.resetUpScroll();
                }
            });
        var renderEvent = {
            /**
             * 初始化下拉加载
             */
            initScroll: function() {
                mescroll = window.mescroll = new MeScroll("wrapper", {
                    down: {
                        use: false
                    },
                    up: {
                        callback: function(page, mescroll) {
                            CPAGE = page.num;
                            handleEvent.judgeNetState(page);
                        },
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        noMoreSize: 20,
                        page: {
                            size: 20
                        }
                    }
                });
            },
            /**
             * 渲染当前市
             * @param {[object]} [data] [列表数据]
             */
            renderCurrentCity: function(data) {
                if (data.areaName.length > 8) {
                    data.areaName = data.areaName.substring(0, 8) + '...';
                }
                $('.area-name').text(data.areaName);
                AID = data.areaId;
                //AID = '40288ba85fb3f50f015fb406863a0004';
                //AREAALIAS = 'hefei';
                if (data.nowLevel >= 2) {
                    //区域是县,则传countyName，否则为空
                    if (data.countyName.indexOf('县') > 0) {
                        CNAME = data.countyName;
                    } else {
                        CNAME = "";
                    }
                } else {
                    CNAME = data.areaName;
                }
            },
        };
        var requestEvent = {

            // 获取区域名
            requestAreaName: function() {
                common.noNet($('.wrap'), function() {
                    $('.search').addClass('hide');
                    $('.no-net').removeClass('top-7');
                    common.toast('网络无法连接，请检查您的网络');
                }, function() {
                    $('.search').removeClass('hide');
                    croods.customPlugin({
                        action: 'UserPlugin.getData',
                        params: {},
                        success: function(res) {
                            if (res.areaCode) {
                                renderEvent.renderCurrentCity(res);
                                renderEvent.initScroll();
                                mescroll.triggerUpScroll();
                            }
                        },
                        fail: function() {
                            common.toast('数据加载失败！');
                        },
                        complete: function(res) {
                            common.mask(false);
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message);
                            }
                        }
                    });
                });
            },
            // 按办事项警种分类数据渲染
            getRequestData: function(page) {
                if (maskFlag) {
                    common.mask(true);
                }

                croods.ajax({
                    method: '6d1862be4ed8460da47883c99a296b35',
                    params: {
                        pageSize: 20,
                        areaCode: AID, // 区域ID
                        terminalType: terminalType, // 终端类型 IOS android
                        currentPageNo: CPAGE, // 当前页面
                        projectName: inputVal, // 关键词
                        projectType: projectType // 警种类型
                    },

                    //请求参数
                    success: function(res) { //请求成功回调
                        if (CPAGE == 1) {
                            $('.matter-result').empty();
                            workUrl = [];
                        }
                        common.mask(false);
                        maskFlag = false;
                        console.log(res);

                        res = $.parseJSON(res);
                        var data = res.data;
                        if (data && data.rows && data.rows.length) {
                            console.log(data.rows);

                            // 跳转地址转换
                            var urlSwitch = {};
                            for (var i = 0; i < data.rows.length; i++) {
                                urlSwitch = {};
                                // 查看详情地址转换// 查看详情地址转换
                                if (data.rows[i].projectYwType == '1' || data.rows[i].projectYwType == '2') {
                                    urlSwitch.isAddHeader = '1'; // 是否有头部
                                } else {
                                    urlSwitch.isAddHeader = '0'; // 是否有头部
                                }
                                urlSwitch.serviceAddr = data.rows[i].deatilUrl;
                                urlSwitch.serviceName = data.rows[i].projectName;
                                workUrl.push(JSON.stringify(urlSwitch));
                            }
                            console.log(workUrl);
                            $('.empty').addClass('hide');
                            $('.result-veiw').removeClass('hide');

                            var tmpl = fly.template('resultTempl', data.rows);
                            $('.matter-result').append(tmpl);
                            if (CNAME == '安徽') {
                                $('.list-wrap .matter-name').addClass('matter-name-anhui');
                            }
                            mescroll.endByPage(data.rows.length, data.totalPageCount);
                        } else {
                            if (CPAGE == 1) {
                                $('.empty').removeClass('hide');
                                $('.result-veiw').addClass('hide');
                            }
                            mescroll.endByPage(0, 0);
                        }
                    },
                    fail: function(res) { //请求失败回调
                        common.mask(false);
                        maskFlag = false;
                        mescroll.endErr();
                        common.toast('请求数据失败');
                    },
                    complete: function(res) {
                        common.mask(false);
                        maskFlag = false;
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message);
                        }
                    }
                });
            }
        };

        var handleEvent = {
            /**
             * 隐藏、显示输入框上的label标签
             */
            hideLabelEvent: function() {
                $('.search-input input').focus();
            },
            /**
             * 区域点击事件
             */
            areaClick: function() {
                croods.customPlugin({
                    action: 'BsdtPlugin.clickArea',
                    params: {},
                    success: function(res) {

                    }
                });
            },
            // 原生地址跳转
            originReUrl: function(type, returnUrl) {
                // 增加办事外联的标识，让Android端弹遮罩层
                var obj = {};
                obj.bsdtDialog = true;
                croods.customPlugin({
                    action: 'StoragePlugin.add',
                    params: obj,
                    success: function(res) {}
                });

                var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + type + "@Third@url=" + returnUrl);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });

            },
            // 第三方url地址跳转
            returnUrlEvent: function(e) {
                var self = $(this),
                    returnId = self.attr('data-id'),
                    returntype = self.attr('data-type'),
                    pid = self.attr('data-pid'),
                    type = 'html',
                    index = self.index(),
                    returnUrl = workUrl[index],
                    pname = self.attr('data-projectname');
                if (returntype == '3' && returnId) { // 为指南
                    handleEvent.originReUrl(type, returnUrl);
                } else if (returntype == '1' || returntype == '2') { // 为查询、可办理
                    var tmpData = self.data();
                    croods.customPlugin({
                        action: 'UserPlugin.isLogin',
                        params: common.packData({}, '', '1', '', ''),
                        success: function(res) {
                            if (projectType == '909d19d4-e889-4b9c-80d0-e9be5c4d28b4') {  // 交管 需要登录
                                croods.customPlugin({
                                    action: 'UserPlugin.getUser',
                                    params: {},
                                    success: function(data) {
                                        data.token ? TOKEN = data.token : TOKEN = '';
                                        croods.ajax({
                                            method: '929988ece52742d5b401ff0236058111',
                                            params: {
                                                name: tmpData.projectname, // 事项名称
                                                appId: tmpData.id // 事项ID
                                            },
                                            //请求参数
                                            success: function(res) { //请求成功回调
                                                var returnUrlParse = JSON.parse(returnUrl);
                                                returnUrlParse.serviceAddr += '&access_token=' + TOKEN;
                                                returnUrl = JSON.stringify(returnUrlParse);
                                                handleEvent.originReUrl(type, returnUrl);
                                            },
                                            fail: function(res) {
                                                var returnUrlParse = JSON.parse(returnUrl);
                                                returnUrlParse.serviceAddr += '&access_token=' + TOKEN;
                                                returnUrl = JSON.stringify(returnUrlParse);
                                                handleEvent.originReUrl(type, returnUrl);

                                            },
                                            complete: function(res) {
                                                if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                                    common.toast(res.message);
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                croods.ajax({
                                    method: '929988ece52742d5b401ff0236058111',
                                    params: {
                                        name: tmpData.projectname, // 事项名称
                                        appId: tmpData.id // 事项ID
                                    },
                                    //请求参数
                                    success: function(res) { //请求成功回调
                                        handleEvent.originReUrl(type, returnUrl);
                                    },
                                    fail: function(res) {
                                        handleEvent.originReUrl(type, returnUrl);

                                    },
                                    complete: function(res) {
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                            common.toast(res.message);
                                        }
                                    }
                                });
                            }

                        }
                    });
                }
               /* }*/
            },
            // 实时动态获取输入框的值
            realTimeDynIn: function() {
                var value = $('.search-input input').val();
                if (value != inputVal && value != '') {
                    $('.search-input label').addClass('hide');
                    $('.btn-delete').removeClass('hide'); //清空收搜框显示
                    inputVal = value;
                    mescroll.resetUpScroll();
                }
                if (value === '' && value != inputVal) {
                    $('.search-input label').removeClass('hide');
                    inputVal = value;
                    $('.btn-delete').addClass('hide'); //清空收搜框显示
                    mescroll.resetUpScroll();
                }
            },
            // 判断网络情况
            judgeNetState: function(page) {
                common.noNet($('.wrap'), function() { // 展示无网络图片
                    if (page.num == 1) {
                        $(".matter-result").empty(); // 清空数据
                        $('.no-line').addClass('hide');
                        $('.no-net').removeClass('hide'); // 无网络状态页
                        $('.result-veiw').addClass('hide'); // 内容列表页
                        // $('.empty').addClass('hide');  // 无数据状态也
                    } else {
                        mescroll.endErr();
                        $('.no-line').removeClass('hide');
                        $('.no-net').addClass('hide'); // 无网络状态页
                        $('.result-veiw').removeClass('hide'); // 内容列表页
                        common.toast('网络无法连接，请检查您的网络');
                    }
                }, function() {
                    if (page.num == 1) {
                        $(".info-type-wrap").empty(); // 清空数据
                    }
                    $('.no-line').addClass('hide');
                    $('.no-net').addClass('hide'); // 无网络状态页
                    $('.result-veiw').removeClass('hide');
                    requestEvent.getRequestData(page);
                });
            }
        };

        var addEvent = function() {
            var $this = $('.wrap');

            // 区域切换
            $this.off('.area-name').on('click', '.area-name', handleEvent.areaClick);

            // 第三方url地址跳转
            $this.off('.matter-result li').on('click', '.matter-result li', handleEvent.returnUrlEvent);

            // 实时动态获取文本值
            $this.off('.search input').on('input propertychange', '.search input', handleEvent.realTimeDynIn);
            // 隐藏、显示输入框上的label标签
            $this.off('.search label').on('click', '.search label', handleEvent.hideLabelEvent);
        };


        fly.bind(document.body, vm);
        $(function() {
            // alert('sss');
            window.AreaRefresh = function(res) {
                CNAME = res.areaName;
                AID = res.areaId;

                $('.area-name').html(CNAME);

                maskFlag = true;

                // 请求数据
                mescroll.resetUpScroll();
            };
            // 判断终端类型
            if (OS == 'web') {
                terminalType = 1;
            } else if (OS == 'Android') {
                terminalType = 2;
            } else if (OS == 'IOS') {
                terminalType = 3;
            } else if (OS == 'H5') {
                terminalType = 4;
            } else if (OS == '微信') {
                terminalType = 5;
            }

            $('.page-title').text(title);
            addEvent();
            requestEvent.requestAreaName(); // 获取当前位置
        });
    });
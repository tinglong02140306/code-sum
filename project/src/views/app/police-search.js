/**
 * @author tinglong
 * @time 2017-11-08
 * @description 搜索
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'common'
    ],
    function(remCacul, common) {
        fly.template.config('escape', false);
        var AID = "", // 区域ID
            TOKEN, // 唯一标识符
            serviceUrl = [],
            OS = common.phoneOs(), // 终端类型
            searchTypeTxt = common.getParam('searchTypeTxt'), // 搜索分类文本值
            searchKey = '', // 输入文本值获取
            hisRecordData = [], // 历史记录数据
            platForm = common.checkMobilePlatform(),
            preValues, // 输入框上一次的值 点击详情时获取
            vm = window.vm = fly.observable({
                // 返回按钮
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                },

                delHisEvent: function() {
                    $('.mark').show();
                },
                // 清空历史记录按钮
                sure: function() {
                    $('.search-history').addClass('hide');
                    hisRecordData = [];
                    localStorage.setItem('hisRecordData', JSON.stringify(hisRecordData));
                    common.toast('删除成功!');
                    $('.mark').hide();
                },
                cancel: function() {
                    $('.mark').hide();
                },
                // 清空文本内容按钮
                deleteEvent: function() {
                    $('.search-input input').val('');
                    $('.btn-delete').addClass('hide');
                    searchTypeTxt = '';

                    $('.content-type-history').removeClass('hide'); // 分类、历史页 
                    $('.content-result').addClass('hide'); // 搜索结果列表页
                    $('.empty').addClass('hide');
                    $('.no-net').addClass('hide');

                    // 输入框label显示与隐藏
                    $('.search-input label').removeClass('hide');
                    $('.search-input label').text('搜索服务项、办事项、资讯');
                    $('.search-input label').attr('data-flag', '1');
                    $('.search-input input').blur();

                    eventHandle.initHistoryData(); // 初始化历史记录

                },
                //点击更多点击事件
                moreEvent: function() {
                    var typeText = event.target.dataset.typetext;
                    // 根据text值跳转到另一个页面
                    var url = JSON.stringify({
                            'isAddHeader': '0',
                            'serviceAddr': 'police-search-type.html?searchTypeTxt=' + typeText + '&searchKey=' + searchKey + '&aid=' + AID,
                            'serviceName': ''
                        }),
                        REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@local@Third@url=" + url);
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: REQUEST,
                        success: function(res) {}
                    });
                }
            });

        fly.bind(document.body, vm);

        var renderEvent = {

            // 资讯数据渲染模块  
            renderNewsInfo: function(data) {
                $(".city-news").empty();
                if (!$.isEmptyObject(data)) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        var obj = data[i],
                            imgUrl;
                        if (data[i].iconUrl) {
                            imgUrl = data[i].iconUrl.split(',');

                            var img1 = imgUrl[0], // 资讯图片1
                                img2 = imgUrl[1], // 资讯图片1
                                img3 = imgUrl[2]; // 资讯图片3
                            obj.imgUrl1 = img1;
                            obj.imgUrl2 = img2;
                            obj.imgUrl3 = img3;

                            obj.tag = 0;
                            if (img1 && img2 && img3) {
                                obj.tag = 3;
                                obj.imgUrl1 = img1 + common.getListImgSize(4.8 * 2, 0.75);
                                obj.imgUrl2 = img2 + common.getListImgSize(4.8 * 2, 0.75);
                                obj.imgUrl3 = img3 + common.getListImgSize(4.8 * 2, 0.75);
                            } else if (img1 || img2 || img3) {
                                obj.imgUrl1 = (img1 || img2 || img3) + common.getListImgSize(4.7 * 2, 0.75);
                                obj.tag = 1;
                            } else {
                                obj.imgUrl1 = '';
                                obj.tag = 0;
                            }
                        } else {
                            obj.imgUrl1 = '';
                            obj.tag = 0;
                        }

                        if (obj.releaseTime) {
                            obj.releaseTime = obj.releaseTime.substring(0, 10)
                        }
                    }
                }
                var tmpl = fly.template('newsInfoTmpl', data);
                $(".city-news").append(tmpl);

                $('.home-notify-content .new-details img').off('error').on('error', function() {
                    $(this).attr('src', CONFIG.path + 'img/home/owl-default.png');
                });
            },

            // 服务项数据渲染
            renderServiceInfo: function(data) {
                $(".service-list-detailss").empty();
                serviceUrl = [];
                for (var i = 0; i < data.length; i++) {
                    serviceUrl.push(JSON.stringify(data[i]));
                }
                var tmpl = fly.template('serviceInfoTmpl', data);
                $(".service-list-detailss").append(tmpl);

                $('.service-list-detailss .service-link img').off('error').on('error', function() {
                    $(this).attr('src', CONFIG.path + 'img/home/owl-default.png');
                });
            },

            // 办事项数据渲染
            renderWorkInfo: function(data) {
                $(".work-list-detailss").empty();
                var tmpl = fly.template('workInfoTmpl', data);
                $(".work-list-detailss").append(tmpl);
            }

        };
        var requestEvent = { // 数据请求模块

            // 搜索统计(包括服务、办事、资讯)
            requestInfosData: function() {
                $('#serviceItem .more').addClass('hide');
                $('#WorksItem .more').addClass('hide');
                $('.home-news .more').addClass('hide');
                croods.ajax({
                    method: '7866c55d674d4b5f83f76e0739c762a5',
                    params: {
                        osType: OS,
                        condition: searchKey, // 搜索条件
                        areaId: AID,
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        console.log(searchKey);

                        var res1 = JSON.parse(res),
                            queryContentData, // 资讯内容
                            queryItemData, // 办事项内容
                            queryServiceData; // 服务项内容
                        if (res1 && res1.data && res1.data.queryContent && res1.data.queryContent.rows) {
                            queryContentData = res1.data.queryContent.rows; // 资讯内容
                        }
                        if (res1 && res1.data && res1.data.queryItem && res1.data.queryItem.rows) {
                            queryItemData = res1.data.queryItem.rows; // 办事项内容
                        }
                        if (res1 && res1.data && res1.data.queryService && res1.data.queryService.rows) {
                            queryServiceData = res1.data.queryService.rows; // 办事项内容
                        }
                        console.log(queryContentData);
                        console.log(queryItemData);
                        console.log(queryServiceData);

                        if ((queryContentData && queryContentData.length) || (queryItemData && queryItemData.length) || (queryServiceData && queryServiceData.length)) {
                            $('.empty').addClass('hide');
                        } else {
                            $('.empty').removeClass('hide');
                            $('.content-result').addClass('hide'); // 内容列表页
                            $('.content-type-history').addClass('hide'); // 分类、历史页
                        }

                        if (queryContentData && queryContentData.length) { // 资讯内容
                            if (res1.data.queryContent.total > 3) {
                                $('.home-news .more').removeClass('hide');
                            }
                            $('.home-news').removeClass('hide');

                            // 渲染资讯数据
                            renderEvent.renderNewsInfo(queryContentData);
                        } else {
                            $('.home-news').addClass('hide');

                        }

                        if (queryItemData && queryItemData.length) { // 办事项内容
                            if (res1.data.queryItem.total > 3) {
                                $('#WorksItem .more').removeClass('hide');
                            }
                            $('#WorksItem').removeClass('hide');
                            
                            renderEvent.renderWorkInfo(queryItemData);// 渲染事项数据
                        } else {
                            $('#WorksItem').addClass('hide');

                        }

                        if (queryServiceData && queryServiceData.length) { // 服务项内容
                            if (res1.data.queryService.total > 3) {
                                $('#serviceItem .more').removeClass('hide');
                            }
                            $('#serviceItem').removeClass('hide');


                            // 渲染服务数据
                            renderEvent.renderServiceInfo(queryServiceData);
                        } else {
                            $('#serviceItem').addClass('hide');

                        }
                    },
                    fail: function(res) { //请求失败回调
                        // common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message);
                        }
                    }
                });
            }
        };
        /**
         * 事件添加
         */
        var addEvent = function() {
            var self = $('.wrap');

            // 实时动态获取输入框文本值
            self.off('.search-input input').on('input propertychange', '.search-input input', eventHandle.realTimeDynIn);


            // 点击服务事项跳转到详情页
            self.off('.service-link').on('click', '.service-link', eventHandle.appClick);

            // 点击办事项跳转到详情页
            self.off('.work-list-detailss').on('click', '.work-list-detailss a', eventHandle.returnWorkDetail);

            // 点击资讯跳转到详情页
            self.off('.new-details').on('click', '.new-details', eventHandle.newsDetailsEvent);

            // 搜索分类事件点击
            self.off('.details a').on('click', '.details a', eventHandle.searchTypeEvent);

            // 点击搜索历史关键词
            self.off('.search-history .key').on('click', '.search-history .key', eventHandle.searchHistoryEvent);

            // 隐藏、显示输入框上的label标签
            self.off('.search-input label').on('click', '.search-input label', eventHandle.hideLabelEvent);

        };
        /**
         * 事件处理
         */
        var eventHandle = {

            // 隐藏、显示输入框上的label标签
            hideLabelEvent: function() {
                $('.search-input input').focus();
            },
            /**
             * 服务点击事件
             */
            appClick: function() {
                eventHandle.saveHistoryData(); //存历史记录
                var index = $(this).attr('data-index'),
                    type = $(this).attr('data-type'),
                    linkUrl = serviceUrl[index],
                    jumpType;
                switch (type) {
                    case '1':
                        jumpType = "app";
                        break;
                    case '2':
                        jumpType = "h5zip";
                        break;
                    case '3':
                        jumpType = "html";
                        break;
                    default:
                        jumpType = "local";
                }

                var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + linkUrl);
                $(this).addClass('visited');
                if (type != undefined) {
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: REQUEST,
                        success: function(res) {}
                    });
                }
            },
            /**
             * 资讯点击
             */
            newsDetailsEvent: function() {
                eventHandle.saveHistoryData(); //存历史记录
                var id = $(this).data('id');
                var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=news-detail.html?id=' + id); // 对接口请求数据封装
                $(this).addClass('visited');
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },
            /*
             * 办事项跳转到详情页
             */
            returnWorkDetail: function() {
                eventHandle.saveHistoryData(); //存历史记录
                var self = $(this),
                    returntype = self.attr('data-type'), // 
                    returnId = self.attr('data-id'),
                    name = self.attr('data-projectname'),
                    deatilUrl = self.attr('data-url'),
                    isAddHeader; // 是否有头部
                var REQUEST = common.packData({}, '', '1', '', '');

                croods.customPlugin({
                    action: 'UserPlugin.isLogin',
                    params: REQUEST,
                    success: function(res) {
                       croods.customPlugin({
                            action: 'UserPlugin.getUser',
                            params: {},
                            success: function(data) {
                                TOKEN = data.token ? data.token: '';
                                if (returntype == '1' || returntype == '2') { // 查询、可办理
                                    isAddHeader = '1'; // 有头部
                                } else if (returntype == '3') {
                                    isAddHeader = '0'; // 没头部
                                }
                                var jFlag = (deatilUrl).indexOf('/app/convertAddr') > -1, // 含次字符串的都是交管办事项
                                    accFlag = (deatilUrl).indexOf('access_token') == -1;
                                if (jFlag && accFlag) {
                                    deatilUrl = deatilUrl + '&access_token=' + TOKEN;
                                }
                                var returnUrl = JSON.stringify({
                                    'isAddHeader': isAddHeader,
                                    'serviceAddr': deatilUrl,
                                    'serviceName': name
                                });

                                self.addClass('visited'); // 办事项被点击后置灰
                                if (returntype == '1' || returntype == '2' || (returntype == '3' && returnId)) {
                                    eventHandle.regionSwitch(returnUrl); // 原生页面跳转
                                }
                            }
                        });
                    }
                });
                
                    
            },
            // 原生页面跳转
            regionSwitch: function(returnUrl) {
                var request = common.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },
            // 搜索分类事件点击
            searchTypeEvent: function() {
                var self = $(this);
                searchTypeTxt = self.text();

                // 根据text值跳转到另一个页面
                var url = JSON.stringify({
                        'isAddHeader': '0',
                        'serviceAddr': 'police-search-type.html?searchTypeTxt=' + searchTypeTxt,
                        'serviceName': ''
                    }),
                    REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@local@Third@url=" + url);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });
            },
            // 点击搜索历史关键词
            searchHistoryEvent: function() {
                var self = $(this);
                searchKey = $.trim(self.text());
                $('.search-input input').val(searchKey);
                eventHandle.realTimeDynIn();

            },

            // 实时动态获取输入框的值
            realTimeDynIn: function() {
                var currValue = $('.search-input input').val(); // 获取当前输入值

                if (currValue) {
                    // 输入框label显示与隐藏
                    $('.search-input label').addClass('hide');
                    $('.search-input input').focus();
                } else {
                    // 输入框label显示与隐藏
                    $('.search-input label').removeClass('hide');
                    $('.search-input label').text('搜索服务项、办事项、资讯');
                    searchKey = currValue;
                    $('.content-type-history').removeClass('hide'); // 分类、历史页
                    $('.content-result').addClass('hide'); // 搜索结果列表页
                    $('.no-net').addClass('hide'); // 无网络页面
                    $('.btn-delete').addClass('hide'); // 输入框删除按钮
                    $('.empty').addClass('hide'); // 暂无数据页面 
                }
                currValue = $.trim(currValue);
                if (currValue) {
                    $('.content-type-history').addClass('hide'); // 历史页
                    $('.content-result').addClass('hide'); // 搜索结果列表页
                    $('.btn-delete').removeClass('hide');
                    common.noNet($('.wrap'), function() {
                        searchKey = currValue;
                        $('.content-result').addClass('hide'); // 内容列表页
                        $('.content-type-history').addClass('hide'); // 分类、历史页
                        $('.no-net').removeClass('hide');
                        common.toast('网络无法连接，请检查您的网络');
                    }, function() {
                        console.log('搜索');
                        searchKey = currValue;
                        $('.content-result').removeClass('hide'); // 内容列表页
                        $('.content-type-history').addClass('hide'); // 分类、历史页
                        $('.no-net').addClass('hide'); // 无网络页
                        requestEvent.requestInfosData();
                    });
                }
            },

            // 获取历史记录
            saveHistoryData: function() {
                searchKey = $.trim($('.search-input input').val());
                $('.search-history').removeClass('hide');
                var obj = {
                    key: ''
                };
                hisRecordData = JSON.parse(localStorage.getItem('hisRecordData'));
                if (searchKey && searchKey != preValues) {
                    preValues = searchKey;
                    if (!(hisRecordData && hisRecordData.length)) {
                        obj.key = searchKey;
                        hisRecordData = [];
                        hisRecordData.unshift(obj.key);
                    } else if (hisRecordData.length < 6) {
                        $.each(hisRecordData, function(i, item) {
                            if (item == searchKey) {
                                hisRecordData.splice(i, 1);
                            }
                        });
                        obj.key = searchKey;
                        hisRecordData.unshift(obj.key);
                    } else if (hisRecordData.length >= 6) {
                        $.each(hisRecordData, function(i, item) {
                            if (item == searchKey) {
                                hisRecordData.splice(i, 1);
                            }
                        });
                        if (hisRecordData.length > 5) {
                            hisRecordData = hisRecordData.slice(0, 5);
                        }
                        obj.key = searchKey;
                        hisRecordData.unshift(searchKey);
                    }
                }


                localStorage.setItem('hisRecordData', JSON.stringify(hisRecordData));
                hisRecordData = JSON.parse(localStorage.getItem('hisRecordData'));
                if (hisRecordData && hisRecordData.length) {
                    $('.search-history').removeClass('hide');
                } else {
                    $('.search-history').addClass('hide');
                }

                $("#hisRecord").empty();
                var tmpl = fly.template('hisRecordTmpl', hisRecordData);
                $("#hisRecord").html(tmpl);
                if (hisRecordData && hisRecordData.length % 2) {
                    $('#hisRecord').append('<a href="javascript:void(0)" class="ell key"></a>');
                }
            },

            // 初始化历史记录
            initHistoryData: function() {
                hisRecordData = JSON.parse(localStorage.getItem('hisRecordData'));
                if (hisRecordData && hisRecordData.length) {
                    $('.search-history').removeClass('hide');
                } else {
                    $('.search-history').addClass('hide');
                }
                $("#hisRecord").empty();
                var tmpl = fly.template('hisRecordTmpl', hisRecordData);
                $("#hisRecord").html(tmpl);
                if (hisRecordData && hisRecordData.length % 2) {
                    $('#hisRecord').append('<a href="javascript:void(0)" class="ell key"></a>');
                }
            },

            // 获取用户信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                }, function() {
                    $('.content-type-history').removeClass('hide');
                    $('.empty').addClass('hide');
                    $('.no-net').addClass('hide');

                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getData',
                        params: {},
                        success: function(data) {
                            if (data.areaId) {
                                AID = data.areaId;
                                if ($('.search-input input').val()) {
                                    eventHandle.realTimeDynIn();
                                }
                            } else {
                                AID = '';
                            }
                        },
                        fail: function() {
                            // common.toast('数据加载失败！');
                        }
                    });
                });
            }

            // 默认触发input框
            // focusClickEvent: function() {
            //     $('input').focus();
            // }
        };
        $(function() {
            addEvent();
            eventHandle.initHistoryData();
            eventHandle.getUserInfo();
            /* eventHandle.focusClickEvent();*/
            if ($('.search-input input').val()) {
                // 输入框label显示与隐藏
                $('.search-input label').addClass('hide');
            } else {
                // 输入框label显示与隐藏
                $('.search-input label').removeClass('hide');
                $('.search-input label').text('搜索服务项、办事项、资讯');
            }

            window.onload = function() {
                var oInp = document.getElementById("target");
                if (oInp.autofocus != true) {
                    setTimeout(function() {
                        oInp.focus();
                    }, 500);

                }
            };

        });
    });
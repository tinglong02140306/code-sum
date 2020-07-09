/**
 * @author hmxue
 * @time 2017-12-27
 * @description 办事指南
 */
'use strict';
$(function () {
    fly.template.config('escape',false);
    var ID =  fly.getQueryString('id'), //id
        title = util.getParam('title'), // 标题名
        flag = true, // 标记是否渲染分享列表
        OS = util.phoneOs(),
        platForm = util.checkMobilePlatform(),
        SYSTIME,
        flag = true,
        vm = window.vm = fly({
            OP: [],
            // 返回事件
            back: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1);  // 用android的方法打开 就用android方法关闭
            },
            refreshClick: function() {
                window.location.reload();
            }

        });
        //渲染数据模块
        var renderEvent = {
            // 详情数据请求与渲染
            detailRequestRender: function() {
                util.mask(true);
               /* util.noNet($('.wrap'), function () {
                    $('.search').addClass('hide');
                    util.toast('网络无法连接，请检查您的网络');
                }, function () {*/
                    $('.search').removeClass('hide');
                    fly.$.ajax({
                        url: CONTEXTPATH + '/guide/getGuideDetailsById.do',
                        data: {
                            uuid: ID
                        },
                        dataType: 'json',
                        type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                        cache: false,
                        success: function (data) {
                            util.mask(false);
                            var materialLists = []; // 申请材料
                            if (data) {
                                if(data.procedure) {
                                    var result = data.procedure,
                                        results;
                                    results = result.split('-');
                                    data.procedure = results.join('→');
                                    if(data.materialList && data.materialList.length) {
                                        materialLists = [];

                                        for(var i = 0; i < data.materialList.length; i++) {
                                            var j = i+1,
                                                k = j.toString();
                                            materialLists.push(k + '.'+data.materialList[i]['material'+k]);
                                        }
                                        data.materialLists = materialLists;
                                    }
                                }
                                $('.empty').addClass('hide');
                                $('.handle-wrap').removeClass('hide');
                                var tmpl = fly.template('handleTmpl',data);
                                $('.handle-wrap').html(tmpl);
                            } else {
                                $('.empty').removeClass('hide');
                                $('.handle-wrap').addClass('hide');
                            }
                        },
                        error: function () {
                            util.mask(false);
                            util.toast('请求数据失败');
                        }
                    });
               /* });*/
            }
        },
        eventHandle = {
            // 跳转到流程图页面
            returnChart: function() {
                var self = $(this),
                    url = self.attr('data-path'),
                    title = self.attr('data-infoname');
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { // 提示无网络提示语
                                util.toast('网络无法连接，请检查您的网络');
                            }else {
                                if(platForm) {
                                    var urlSwitch = {};
                                    urlSwitch.isAddHeader = '0';
                                    urlSwitch.serviceAddr = SHAREADDRESS + '/h5/flow-chart.do?url=' + url + '&title=' + title;
                                    urlSwitch.serviceName = title;
                                    var REQUEST = util.packData({}, "", 1, false, "ct://ThirdService@" + 'html' + "@Third@url=" + JSON.stringify(urlSwitch));
                                    croods.customPlugin({
                                        action: 'CIPRoutePlugin.action',
                                        params: REQUEST,
                                        success: function(res) {}
                                    });
                                } else {
                                    window.location.href = CONTEXTPATH + '/h5/flow-chart.do?url=' + url + '&title=' + title;
                                }

                            }
                    }
                    });
                   // window.location.href = CONTEXTPATH + '/h5/flow-chart.do?url=' + url + '&title=' + title;
            },
            initMarquee: function (id) {
                var marqueeWrap = document.querySelector('div.marquee-wrap'),
                    fragment = document.createDocumentFragment('div'),
                    marqueeContentWrap = document.createElement('div'),
                    marqueeContent = document.createElement('div'),
                    marqueeContentCopy = document.createElement('div'),

                    text = marqueeWrap.innerText,
                    speed = 30,
                    marqueeHandler,
                    marqueeInterval;

                marqueeContentWrap.className = 'marquee-content-wrap';
                marqueeContent.className = 'marquee-content';
                marqueeContent.innerText = text;
                marqueeContentCopy.className = 'marquee-content-copy';
                marqueeContentCopy.innerText = text;

                marqueeContentWrap.appendChild(marqueeContent);
                marqueeContentWrap.appendChild(marqueeContentCopy);

                fragment.appendChild(marqueeContentWrap);

                marqueeWrap.innerHTML = '';
                marqueeWrap.appendChild(fragment);

                marqueeContentCopy.innerHTML = marqueeContent.innerHTML;
                marqueeHandler = function () {
                    if (marqueeContentCopy.offsetWidth - marqueeWrap.scrollLeft <= 0) {
                        marqueeWrap.scrollLeft -= marqueeContentCopy.offsetWidth;
                    } else {
                        marqueeWrap.scrollLeft++;
                    }
                };

                marqueeInterval = setInterval(marqueeHandler, speed);
                //
                // marqueeWrap.addEventListener('mouseover', function () {
                //     clearInterval(marqueeInterval);
                // }, false);
                // marqueeWrap.addEventListener('mouseout', function () {
                //     marqueeInterval = setInterval(marqueeHandler, speed);
                // }, false);
            },

            getTextWidth: function (id, text) {
                var elem = id ? document.getElementById(id) : document.body,
                    text = text ? text : elem.innerHTML,
                    pre = document.createElement('pre'),
                    body = document.body,
                    style, width;

                style = window.getComputedStyle(elem, null);
                pre.innerHTML = text;
                pre.style.whiteSpace = 'nowrap';
                pre.style.position = 'absolute';
                pre.style.zIndex = '-99999';
                pre.style.font = style.getPropertyValue('font');
                body.appendChild(pre);
                width = pre.offsetWidth;
                body.removeChild(pre);
                return width;
            }
        };
    var addEvent = function() {
        var self = $('.wrap');

        // 跳转到流程图页面
        self.off('.underline').on('click','.underline', eventHandle.returnChart);
    };
    fly.bind(document.body, vm);

    $(function() {
        addEvent();
        renderEvent.detailRequestRender();
        var itemBanner = document.getElementById('itemBanner');
        $('#itemBanner').text(title);
        if (itemBanner.offsetWidth < eventHandle.getTextWidth('itemBanner', title)) {
            eventHandle.initMarquee();
        }
    });

});
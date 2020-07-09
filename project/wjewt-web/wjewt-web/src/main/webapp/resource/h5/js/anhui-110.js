/**
 * @author hmxue
 * @time 2017-01-08
 * @description 安徽110
 */
'use strict';
$(function() {
    var platForm = util.checkMobilePlatform(),
        name =  fly.getQueryString('name'),
        OS = util.phoneOs(),
        AID = '',
        vm = window.vm = fly({
            // 返回事件
            back: function () {
                platForm ? croods.pageClose({}) : window.history.back(-1);
            }
        });
    /**
     * 请求数据模块
     */
    var requestHandle = {
        /**
         * 报警协助数据请求
         */
        requestCallHelp: function() {
            //AID="0a79565ad65f4e2ab236b5438e7d7731";
            fly.$.ajax({
                url: CONTEXTPATH + '/service/getChannelServiceList.do',
                type: 'GET',
                data: {
                    areaId: AID, // 区域ID
                    osType: OS,
                    name: '报警求助'
                },
                success: function (res) {
                    if (res && (res.status === 'TIMEOUT')) {
                        util.toast(res.message);
                        return;
                    }
                    if (!res || res.flag === false || !res.data) {
                        util.toast('请求数据失败！');
                        return;
                    }
                    var   data = res.data;
                    for (var i = 0, len = data.length; i < len; i++) {
                        data[i].info = JSON.stringify(data[i].androidDetail);
                    }
                    var requestTmpl = fly.template('appTmpl', data);
                    $(".call-help-content").html(requestTmpl);
                },
                error: function(){
                    util.toast('请求数据失败！');

                }
            });
        },
        /**
         * 江淮义警数据请求
         */
       requestAnhui110: function () {
           //AID="0a79565ad65f4e2ab236b5438e7d7731";
           fly.$.ajax({
               url: CONTEXTPATH + '/service/getChannelServiceList.do',
               type: 'GET',
               data: {
                   areaId: AID, // 区域ID
                   osType: OS,
                   name: '江淮义警'
               },
               success: function (res) {
                   /*var res1 = fly.evalJSON(res),*/
                   if (res && (res.status === 'TIMEOUT')) {
                       util.toast(res.message);
                       return;
                   }
                   if (!res || res.flag === false || !res.data) {
                       util.toast('请求数据失败！');
                       return;
                   }
                   var   data = res.data;
                   for (var i = 0, len = data.length; i < len; i++) {
                       data[i].info = JSON.stringify(data[i].androidDetail);
                   }
                   var requestTmpl = fly.template('appTmpl', data);
                   $(".righteous-police").html(requestTmpl);
               },
               error: function(){
                   util.toast('请求数据失败！');

               }
           });

       }
    }
     /**
        * 事件处理模块
        */
    var eventHandle = {
        serviceClick: function (e) {
            var linkUrl = $(this).attr('data-url'),
                type = $(this).attr('data-type'),
                id = $(this).attr('data-id'),
                jumpType;
            if (type == "1") {
                jumpType = "app";
            } else if (type == "2") {
                jumpType = "h5zip";
            } else if (type == "3") {
                jumpType = "html";
            } else {
                jumpType = "local";
            }
            var REQUEST = util.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + linkUrl);
            if (type != undefined) {
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });
            }
        }
    };
    var  init = function() {
        // item绑定点击事件
        $('.service-list').off('.service-item').on('click', '.service-item',eventHandle.serviceClick);
    };
    fly.bind(document.body, vm);
    init();
    if(platForm) {
        croods.customPlugin({
            action: 'UserPlugin.getData',
            params: {},
            success: function(data) {
                AID = data.areaId; // 区域编码
                requestHandle.requestCallHelp(); // 请求报警求组数据
                requestHandle.requestAnhui110(); // 请求江淮义警数据
            },
            fail: function() {
                requestHandle.requestCallHelp(); // 请求报警求组数据
                requestHandle.requestAnhui110(); // 请求江淮义警数据
            }
        });
    }else {
        requestHandle.requestCallHelp(); // 请求江淮义警数据
        requestHandle.requestAnhui110(); // 请求江淮义警数据
    }

});
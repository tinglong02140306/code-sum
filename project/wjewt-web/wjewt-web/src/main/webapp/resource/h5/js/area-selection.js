/**
 * @author tinglong
 * @time 2018-03-12
 * @description 办事项区域选择
 */
'use strict';
var ID = util.getParam('id'), // 详情ID   util.getParam('id')  'a92bf7d2db654d448499ac57bb3dbf89'
    Name = util.getParam('name'),
    platForm = util.checkMobilePlatform(),
    OS = util.phoneOs(),  // 判断机型
    vm = window.vm = fly({
        // 返回事件
        back: function() {
            platForm ? croods.pageClose({}) : window.history.back(-1);  // 用android的方法打开 就用android方法关闭
        }
    }),
    /**
     * 请求数据模块
     */
    requestHandle = {
        /**
         * 请求亳州区域选择
         */
        getAreaData: function() {
            croods.ajax({
                method: '15394e4dee724dc0a1cdc4fb1c633b05',
                params: {
                    projectId: ID
                },
                success: function(res) {
                        res = $.parseJSON(res);
                        if (res && res.flag && res.data && res.data.length) {
                            var data = res.data;
                            var tmpl = fly.template('areaTmpl', data);
                            $(".wrapper").append(tmpl);
                        } else {
                            util.toast('请求数据失败！');
                        }
                  
                },
                fail: function(res) {
                    util.toast('服务端错误！');
                },
                complete: function(res) {
                    if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                        util.toast(res.message);
                    }
                }
            });
        }
    },
    /**
     * 车辆信息页面和车辆类型页面的切换
     */
    eventHandle = {

        // 区域选择
        areaSelectClick: function(e) {
            var $this = $(e.currentTarget),
                code = $this.data('code'),
                url = $this.data('url'),
                type = 'html',
                reUrl = {};
            reUrl.isAddHeader = '1';
            reUrl.serviceAddr = url;
            reUrl.serviceName = Name;

            if(OS == 'IOS') {
                eventHandle.isAuthIos(type, JSON.stringify(reUrl)); // 判断是否实名认证 
            }else if(OS == 'Android') {
                reUrl.authType = '3';
                eventHandle.originReUrl(type, JSON.stringify(reUrl)); // 判断是否实名认证 
            }
        },
        // 原生地址跳转
        originReUrl: function(type, returnUrl) {
            var REQUEST = util.packData({}, "", 1, false, "ct://ThirdService@" + type + "@Third@url=" + returnUrl);
            croods.customPlugin({
                action: 'CIPRoutePlugin.action',
                params: REQUEST,
                success: function(res) {}
            });
        },

        // ios下判断是否实名认证
        isAuthIos: function(type, returnUrl) {
            var request = util.packData({}, '', '1', '', '');
            croods.customPlugin({
                action: 'UserPlugin.isAuth',
                params: request,
                success: function(res) {
                    eventHandle.originReUrl(type, returnUrl);  // 实名认证就跳转到办事项区域选择页
                }
            });
        }

    };
/**
 * 添加事件
 */
var addEvent = function() {
    // 车辆类型点击
    $('.wrap').off('.wrapper li a').on('click', '.wrapper li a', eventHandle.areaSelectClick);
};
;(function() {
    fly.bind(document.body, vm);
    requestHandle.getAreaData();
    addEvent();
})();


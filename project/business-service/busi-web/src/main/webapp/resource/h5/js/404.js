/**
 * @author hmxue
 * @time 2018-01-22
 * @description 404
 */
'use strict';
$(function(){
    var platForm = util.checkMobilePlatform(),
        vm = window.vm = fly.observable({
        refreshClick: function () {
            window.location.reload();
        },
        back: function () {
            if(util.isWeiXin()) { // 微信关闭
                wx.closeWindow();
                return;
            }
            platForm ? croods.pageClose({}) : window.history.back(-1); // 皖警平台关闭页面，否则刷新
            /*window.history.back(-1);*/
        }
    });
    fly.bind(document.body, vm); 

});

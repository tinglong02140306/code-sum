/**
 * @author tinglong
 * @time 2018-4-23
 * @description 视频播放
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'share',
        'common'
    ],
function(remCacul, share, common) {
    var platForm = common.checkMobilePlatform(),
        detailId = common.getQueryString('id'),  // 视频播放地址
        poster = common.getQueryString('poster'),  // 视频播放的首帧图片地址
        title = common.getParam('title'),  // 视频播放地址
        vm = window.vm = fly.observable({
            // 返回
            back: function() {
            	platForm ? croods.pageClose({}) : window.history.back(-1);
            	
            }
        });
        var requestVedioSrc = function() {
            common.mask(true);
            croods.ajax({
                method: '581f0805f1a14429a2999bd419e507a6', // 2fe8839e9ecf47fc9b427875f085b5be  原来的：b59d7aa875264769a5e9b4efe3080b9e
                params: {
                    sbm: detailId
                },
                //请求参数
                success: function(res) { //请求成功回调
                    common.mask(false);
                    res = $.parseJSON(res).data;
                    if(!!res) {
                        $('video').attr('src', res);
                    }else {
                        common.toast('数据请求失败');
                    }
                },
                fail: function(res) { //请求失败回调
                    common.mask(false);
                    common.toast('数据请求失败！');
                },
                complete: function(res) {
                    common.mask(false);
                    if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                        common.toast(res.message);
                    }
                }
            });

        };

    $(function() {
        fly.bind(document.body, vm);
        $('.title').text(title);
        $('video').attr('poster', poster);
        requestVedioSrc();
    });
});
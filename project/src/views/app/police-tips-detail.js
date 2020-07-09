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
        var platForm = common.checkMobilePlatform(),
            id = common.getQueryString('id'),
            vm = window.vm = fly({
                // 刷新页面
                refreshClick: function() {
                    window.location.reload();
                },
                // 返回事件
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }

            }),
            requestEvent = {
                getRequestData: function() {
                    common.mask(true);
                    croods.ajax({
                        method: '7cad11119b454c74a98b1ff9aaf308fd',
                        params: {
                            aid: id
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            common.mask(false);
                            res = $.parseJSON(res);
                            if (!res || res.flag === false || !res.data) {
                                $('.wrap').hide();
                                $('#sorry').removeClass('hide');
                                return false;
                            }
                            var data = res.data;
                            $('.police-tip-title').html(data.title);
                            $('.police-tip-datetime').html(data.dateline);
                            $('.police-tip-content').html(data.content);
                            $(".police-tip-content img").off('error').on('error', function() {
                                $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                            });
                        },
                         fail: function(res) { //请求失败回调
                            common.mask(false);
                            $('.wrap').hide();
                            $('#sorry').removeClass('hide');
                            common.toast('请求数据失败');
                        },
                        complete: function(res) {
                            if (res.status === 'TIMEOUT') {
                                common.toast(res.message);
                            }
                        }
                    });
                 }
             };
        fly.bind(document.body, vm);
        common.noNet($('.wrap'), function() {
            $('#wrapper').addClass('hide');
        }, function() {
            $('#wrapper').removeClass('hide');
            requestEvent.getRequestData(); // 请求警营提示详情数据
        });
       // eventHandle.init(); // 绑定点击事件
      
    });
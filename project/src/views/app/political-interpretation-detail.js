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
                    var data = localStorage.getItem('zcjd');
                    if (!data) {
                        $('.wrap').hide();
                        $('#sorry').removeClass('hide');
                        return false;
                    }
                    data = fly.evalJSON(data);
                    $('#fdept').text(data.fdept);
                    var publishTime = data.publishTime;
                    if(publishTime) {
                        publishTime = publishTime.substr(0, 4) + '年' + publishTime.substr(5, 2) + '月' + publishTime.substr(8, 2) + '日';
                    }
                    $('#publishTime').text(publishTime);
                    $('.content').html(data.reactionContent);
                    $('.page-title').text(data.solicitTitle);
                    $('.interpretation-content').html(data.replyContent);
                    $(".content img").off('error').on('error', function() {
                        $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                    });
                    $(".interpretation-content img").off('error').on('error', function() {
                        $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                    });
                }
            };
        fly.bind(document.body, vm);
        common.noNet($('.wrap'), function() {
            $('#wrapper').addClass('hide');
        }, function() {
            $('#wrapper').removeClass('hide');
            requestEvent.getRequestData(); // 请求政策解读详情数据
        });
        // eventHandle.init(); // 绑定点击事件

    });
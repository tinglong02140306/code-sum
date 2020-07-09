/**
 * @author leiran
 * @time 2016-08-23
 * @description 用户协议
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common'
    ],
    function(common) {

        // 页面初始化时创建页面
        var vm = window.vm = fly({
                appName: CONFIG.appName,

                // 关于我们信息数据源
                aboutList: fly.dataSource({
                    data: []
                }),
                back: function() {
                    croods.pageClose({});
                }
            });
        fly.bind(document.body, vm);
    });
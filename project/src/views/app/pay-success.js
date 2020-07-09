/**
 * @author qijiang
 * @time 2018-05-16
 * @description 缴费成功
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
    'payCommon'
], function(common) {
    var main = {},
        queryText = fly.getQueryString('queryText'),
        querySign = fly.getQueryString('querySign'),
        vm = window.vm = fly({
            payData: {

            },
            back: function() {
                // if (flagPlat) {
                //     croods.pageClose({});
                //     return;
                // }
                window.history.back(-1);
            },
            successBtn: function() {
                debugger
            }
        });

    main.initDetail = function() {
        var obj = {
            queryText: 11,
            querySign: 11
        };
        common._post(MSERVERURL, {
            'a': APPLY_ID, //项目编码
            'm': 'ee86e49137bb41389eb324a27976f35e', //接口编码
            'p': JSON.stringify(obj)
        }, function(res) {
            if (res.s == '1') {
                var data = JSON.parse(res.r).data;
                vm.set('payData', data);
            } else {
                common.toast("缴费识别码错误");
                return;
            }
        }, function(res) {
            common.toast("请求失败");
            return;
        });
    }

    main.init = function() {
        main.initDetail();
    };

    fly.bind(document.body, vm);

    main.init();
});
/**
 * @author qijiang
 * @time 2018-05-16
 * @description 缴费详情
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
    'payCommon'
], function(common) {
    var main = {},
        payData = fly.getQueryString('data'),
        payCode = fly.getQueryString('payCode'),
        platForm = common.checkMobilePlatform(),
        vm = window.vm = fly({
            payData: {

            },
            listData: fly.dataSource({
                data: []
            }),
            back: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1);
                // if (flagPlat) {
                //     croods.pageClose({});
                //     return;
                // }
                // window.history.back(-1);
            },
            payBtn: function() {
                var obj = {
                    pinCode: vm.payData.payCode
                };
                common._post(MSERVERURL, {
                    'a': APPLY_ID,
                    'm': '1bf11c58ab8e4a4a8996d8f5df5e53c2',
                    'p': JSON.stringify(obj)
                }, function(res) {
                    var data = JSON.parse(res.r).data;
                    window.location.href = data;
                }, function(res) {
                    common.toast('服务请求失败');
                    return;
                })
            }
        });


    main.initData = function() {
        if (payData) {
            payData = JSON.parse(payData);
            vm.set('payData', payData.data);
            vm.listData.data(payData.data.payInfoList);
        }
    };
    main.initDetail = function() {
        var obj = {
            pinCode: payCode
        };
        common._post(MSERVERURL, {
            'a': APPLY_ID, //项目编码
            'm': '4c3cf2bff27b49e4bfcbed0056ce6d19', //接口编码
            'p': JSON.stringify(obj)
        }, function(res) {
            if (res.s == '1') {
                payData = JSON.parse(res.r);
                vm.set('payData', payData.data);
                vm.listData.data(payData.data.payInfoList);
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
        if (payCode) {
            main.initDetail();
        } else {
            main.initData();
        }
    };

    fly.bind(document.body, vm);

    main.init();
});
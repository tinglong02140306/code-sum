/**
 * @author tinglong
 * @time 2018-06-01
 * @description 公共缴费
 */
'use strict';
$(function() {
    var main = {},
        payData = fly.getQueryString('data'),
        pinCode = fly.getQueryString('pinCode'),
        platForm = util.checkMobilePlatform(),
        vm = window.vm = fly({
            payData: {

            },
            listData: fly.dataSource({
                data: []
            }),
            back: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1);
            },
            // 获取缴费url
            payBtn: function() {
                var obj = {
                    pinCode: pinCode,
                    payType: 2   // 2代表手机端
                };
                util.ajaxRequest(CONTEXTPATH + '/newPay/doPay', obj, function(res) {
                	res = typeof res == 'string' ? JSON.parse(res) : res;
                	if (!res.errorMessage) {
                        if(platForm) {
                        	var isAddHeader;
                        	if(res.redirectURL.indexOf('pay-success') > -1) {
                        		isAddHeader = '0';
                        	}else {
                        		isAddHeader = '1';
                        	}
                            var returnUrl = JSON.stringify({
                                'isAddHeader': isAddHeader,
                                'serviceAddr': res.redirectURL,
                                'serviceName': '公共缴费'
                            });
                            main.originThirdSerReUrl(returnUrl);
                        }else {
                            window.location.href = res.redirectURL;
                        }
                		
                	}else {
                        util.platTypeToast(res.errorMessage,platForm);
                	}
                   
                }, function(res) {
                	res = typeof res == 'string' ? JSON.parse(res) : res;
                	util.platTypeToast(res.errorMessage,platForm);
                    return;
                });
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
                pinCode: pinCode
            };
            // 查询缴费信息
            util.ajaxRequest(CONTEXTPATH + '/newPay/queryPrePayInfo', obj, function(res) {
            	res = typeof res == 'string' ? JSON.parse(res) : res;
                if (!res.errorMessage) {
                    $('.content').removeClass('hide');
                    $('.empty').addClass('hide');
                    payData = res.payInfoList;
                    vm.set('payData', res);
                    vm.listData.data(payData);

                } else {
                    $('.content').addClass('hide');
                    $('.empty').removeClass('hide');
                	util.platTypeToast(res.errorMessage,platForm);
                    return;
                }
            }, function(res) {
            	res = typeof res == 'string' ? JSON.parse(res) : res;
            	util.platTypeToast(res.errorMessage,platForm);
                return;
            });
        };
        // 原生跳转第三方地址
        main.originThirdSerReUrl = function(returnUrl) {
            var REQUEST = util.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
            croods.customPlugin({
                action: 'CIPRoutePlugin.action',
                params: REQUEST,
                success: function(res) {}
            });
        },
        main.init = function() {
            if (pinCode) {
                main.initDetail();
            } else {
                main.initData();
            }
        };
    fly.bind(document.body, vm);
    main.init();
});
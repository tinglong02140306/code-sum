/**
 * @author tinglong
 * @time 2018-06-01
 * @description 
 */
'use strict';
$(function() {
    var platForm =  util.checkMobilePlatform(),
        main = {},
        pinCode = fly.getQueryString('pinCode'),
        vm = window.vm = fly({
            // 完成
            successBtn: function() {
                if(platForm) {
	            	main.orginReturnDetail();
	            }else {
	            	window.history.back(-1);
	            }
            }
        });

    main.initDetail = function() {
        var obj = {
            pinCode: pinCode   // 缴款识别码
        };
        util.ajaxRequest(CONTEXTPATH + '/newPay/cashier', obj, function(res) {
        	res = typeof res == 'string' ? JSON.parse(res) : res;
        	if (!res.errorMessage) {
        		vm.set('payData', res);
            } else {
            	window.location.href = CONTEXTPATH + '/h5/pay-fail.do';
            	util.platTypeToast(res.errorMessage,platForm);
                return;
            }
        }, function(res) {
        	res = typeof res == 'string' ? JSON.parse(res) : res;
            util.platTypeToast(res.errorMessage,platForm);
            return;
        });
    };
    // 跳转到APP首页
    main.orginReturnDetail = function() {
    	var request = util.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=home.html'); // 对接口请求数据封装
		croods.customPlugin({
			action: 'CIPRoutePlugin.action',
			params: request,
			success: function(res) {}
		});
    	
    };
    
    main.init = function() {
        main.initDetail();
    };
    fly.bind(document.body, vm);
    main.init();
});
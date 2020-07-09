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
            back: function() {
                /*if(platForm) {
                	main.orginReturnDetail();
                }else {*/
            	window.history.back(-1);
                // } 
            },
            // 返回重试
            backReset: function() {
               /* if(platForm) {
	            	main.orginReturnDetail();
	            }else {*/
            	window.history.back(-1);
	            // }
            }
        });
    fly.bind(document.body, vm);
});
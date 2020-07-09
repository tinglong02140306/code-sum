/**
 * @author tinglong
 * @time 2018-06-01
 * @description 
 */
'use strict';
var main = {},
    TOKEN = "", // 用户token
    platForm =  util.checkMobilePlatform(),
    vm = window.vm = fly.observable({
        idCode:"",
        submit:function(){
            if(vm.idCode.length!=20){
                util.toast("请输入20位的缴费识别码");
                return;
            }
            var obj = {
                pinCode:vm.idCode
            };
            var dataString=JSON.stringify(obj);
            util.ajaxRequest(CONTEXTPATH + '/newPay/queryPrePayInfo', obj, function(res) {

                if (!res.errorMessage) {
                    window.location.href = "pay-detail.do?pinCode=" + res.payCode;
                } else {
                    $('.idCode-content').addClass('hide');
                    $('.empty').removeClass('hide');
                    util.platTypeToast(res.errorMessage,platForm);
                    return;
                }
            }, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                util.platTypeToast(res.errorMessage,platForm);
                return;
            });
        },
        back: function() {
            $('.mark').show();
        },
        sure: function() {
            platForm ? croods.pageClose({}) : window.history.back(-1); 
            // croods.pageClose({});
            /*window.history.go(-1);*/
        },
        cancel: function() {
            $('.mark').hide();
        }
    });
    fly.bind(document.body, vm);
$(function() {
    $('.idCode-content').removeClass('hide');
    $('.empty').addClass('hide');

});
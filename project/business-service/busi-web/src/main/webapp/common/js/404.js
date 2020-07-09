/**
 * @author hmxue
 * @time 2018-01-22
 * @description 404
 */
'use strict';
$(function(){
    var vm = window.vm = fly.observable({
        refreshClick: function () {
            window.location.reload();
        },
        back: function () {
            window.history.back(-1);
        }
    });
    fly.bind(document.body, vm); 

});

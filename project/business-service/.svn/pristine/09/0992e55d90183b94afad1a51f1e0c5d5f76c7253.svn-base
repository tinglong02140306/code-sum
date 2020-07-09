/**
 * @author hmxue
 * @time 2017-01-08
 * @description 安徽110
 */
'use strict';
$(function() {
    var lng = 0,
        lat = 0;
// 百度地图API功能
    var init = function () {
        // 获取当前位置
        croods.openLocation({
            interval: 5000,
            //可选,代表每个5S进行一次定位，默认为5000ms
            success: function(res) { //请求成功回调
                if($('.position').html() !='') {
                    croods.closeLocation();
                    return;
                }
                var gpsPoint = new BMap.Point(res.lng, res.lat);
                BMap.Convertor.translate(gpsPoint, 0, function (point) {
                    lng = point.lng;
                    lat = point.lat;
                    console.log(lng,lat);

                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(point, function (rs) {
                        var addComp = rs.addressComponents;
                        $('.position').html(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                        //util.toast('您的位置：'+rs.point.lng+','+rs.point.lat);
                    });
                });
            },
            fail: function(res) { //失败回调
            }
        });
    };
    var eventHandle = {
        /*关键字搜索*/
        searchAddress: function () {
            var value = $('.input-wrap input').val();
            if(value) {
                var map = new BMap.Map("l-map");
                var mPoint = new BMap.Point(lng, lat);/* lng lat  117.1506778819 31.83788761027*/
                console.log(lng,lat);
                map.centerAndZoom(mPoint, 16);
                var options = {
                    renderOptions:{map: map},
                    onSearchComplete: function (data) {
                        if ($(".input-wrap input").val() == "") {
                            return;
                        }
                        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                            var resultData = data.yr;

                          /*  var resultData= [];
                            for (var i = 0; i < data.getCurrentNumPois(); i ++){
                                resultData.push({title:data.getPoi(i).title,address: data.getPoi(i).address});
                            }*/
                            var tmpl = fly.template('urlTmpl', resultData);
                            $(".search-result").html(tmpl);

                        } else {
                            $(".search-result").html("<div class='Without'>没有找到相关位置!</div>");
                        }
                    }
                }
                var local = new BMap.LocalSearch(map, options);
                local.search(value);
            }
        }
    };
    var addEvent = function () {
        $('.wrap').off('.input-wrap input').on('input propertychange','.input-wrap input',eventHandle.searchAddress);
    }
    init();
   // addEvent();
    eventHandle.searchNearByAddress();
});
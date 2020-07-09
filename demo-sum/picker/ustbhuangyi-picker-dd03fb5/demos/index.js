'use strict';

var pickSelectIndex = '0',
    eventHandle = {
        pickerEvent: function() {
            var array = [{
                "text": "大型汽车",
                "value": "01"
            }, {
                "text": "小型汽车",
                "value": "02"
            }, {
                "text": "使馆汽车",
                "value": "03"
            }, {
                "text": "领馆汽车",
                "value": "04"
            }, {
                "text": "境外汽车",
                "value": "05"
            }, {
                "text": "外籍汽车",
                "value": "06"
            }, {
                "text": "普通摩托车",
                "value": "07"
            }, {
                "text": "轻便摩托车",
                "value": "08"
            }, {
                "text": "使馆摩托车",
                "value": "09"
            }, {
                "text": "领馆摩托车",
                "value": "10"
            }];
                    
            var picker = new Picker({
                data: [array],
                selectedIndex: [pickSelectIndex],
                title: '选择发证机关'

            });
            picker.on('picker.select', function(selectedVal, selectedIndex) {
                $('#picker').text(array[selectedIndex[0]].text);
               /* vm.carType.set('text', array[selectedIndex[0]].text);
                vm.carType.set('value', array[selectedIndex[0]].value);*/
            });
            $('body').on('click', "#picker", function() {
                picker.show();
             });
        }
    };

$(function() {   
    eventHandle.pickerEvent();                  
});
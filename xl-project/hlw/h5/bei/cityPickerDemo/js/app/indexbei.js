var pickerExtend;
var addEvent = function() {
        var $this = $('.wrap');
        // 地区级联点击事件
        // $this.off('#trigger').on('click', '#trigger', handleEvent.selectCityEvt);
        // 车牌颜色选取点击事件
        // $this.off('#picker').on('click', '#picker', handleEvent.SelectCpysEvt);
        // 车牌号信息删除
        $this.off('.car-item .icon-del').on('click', '.car-item .icon-del', handleEvent.carNoDelEvt);

        // 添加车辆信息
        $this.off('.btn-add-car').on('click', '.btn-add-car', handleEvent.addCarNoEvt);

        // 地区级联点击
        $this.off('#trigger').on('click', '#trigger', handleEvent.showSelAreaEvt);

        var $that = $('.area-cascade-wrap');
        $that.off('.cancel').on('click', '.cancel', handleEvent.selCancelEvt);
        $that.off('.ensure').on('click', '.ensure', handleEvent.selsureEvt);

    },
    // 事件处理
    handleEvent = {
        // 城市数据初始化
        initCityPicker: function(cityData) {
            pickerExtend = new PickerExtend({
                trigger: '#trigger',
                title: '区域选择',
                wheels: [{
                    data: cityData
                }],
                position: [0, 0, 0, 0], //初始化定位
                keyMap: {
                    id: 'code',
                    value: 'name',
                    childs: 'children'
                        // id: 'divisionCode',
                        // value: 'divisionName',
                        // childs: 'children'
                },
                callback: function(indexArr, data) {
                    console.log(data); //返回选中的json数据
                }
            });
        },
        // 车牌颜色数据初始化
        initPicker: function() {
            var array = [{
                value: '01',
                text: '蓝色'
            }]
            picker = new Picker({
                data: [array],
                selectedIndex: [0],
                title: '车牌颜色'

            });
            picker.on('picker.select', function(selectedVal, selectedIndex) {

            });
            picker.on('picker.change', function(e, index, selectIndex) {
                if (OS == 'Android') {
                    var num = 3.4 + index * 0.025;
                    $('.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll').css('marginTop', num + 'rem');
                }
            });

            // $('.wrap').on('click', "#picker", function () {
            //     picker.show();
            // });
        },
        // 城市选择
        selectCityEvt: function() {
            pickerExtend.show()
        },
        // 车牌颜色
        SelectCpysEvt: function() {
            picker.show();
        },


        showSelAreaEvt: function() {
            $('.area-cascade-wrap').address('show')

        },
        selCancelEvt: function() {

        },
        selsureEvt: function() {

        },
        // 车牌信息删除
        carNoDelEvt: function() {
            var param,
                token;
            util.ajaxRequest('/isp/alipay/service/bills', param, token, function(res) {
                var data = res.data;
                if (res.code == '0000') {

                } else {
                    // util.toastDialog(res.message);
                }
                // util.hideMask();
            }, function(res) {
                // util.toastDialog(res.message)
            })
        },
        // 添加车辆点击事件
        addCarNoEvt: function() {
            window.location.href = './handle-etc.html';
        },


        // 信息校验
        checkInfos: function() {
            var recipName = $('.recip-name').val(),
                tel = $('.tel').val(),
                area = $('.area').val(),
                address = $('.detail-address').val(),
                param = {};
            // 姓名的限制  32 字符
            // 地址的限制   64字符
            if (!recipName) {

            }
            param = {
                    recipName: recipName,
                    tel: tel,
                    area: area + address
                }
                // 提交收件人信息
            requestEvent.submitMsgInfos(param)

        }
    },
    requestEvent = {
        // 获取车牌信息
        getCarNoInfos: function() {
            util.ajaxRequest('/isp/alipay/service/bills', param, token, function(res) {
                var data = res.data;
                if (res.code == '0000') {

                } else {
                    // util.toastDialog(res.message);
                }
                // util.hideMask();
            }, function(res) {
                // util.toastDialog(res.message)
            })
        },

        // 提交收件人信息
        submitMsgInfos: function() {
            util.ajaxRequest('/isp/alipay/service/bills', param, token, function(res) {
                var data = res.data;
                if (res.code == '0000') {

                } else {
                    // util.toastDialog(res.message);
                }
                // util.hideMask();
            }, function(res) {
                // util.toastDialog(res.message)
            })

        }

    },
    renderData = {
        renderAreaData: function(data) {
            var $html = ``;
            for (var i = 0; i < data.length; i++) {
                $html += `<span data-code="${data[i].divisionCode}">${data[i].divisionName}</span>`
            }
            $('.select-wrap').empty().append($html)
        }

    }
$(function() {
    addEvent();
    renderData.renderAreaData(cityData)
        // handleEvent.initCityPicker(cityData);
        // handleEvent.initPicker();
        // /^[1][3,4,5,6,7,8,9][0-9]{9}$/   手机号校验
        //  /^[鲁A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/  车牌号校验
        // pattern.test(str)
        // [京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}
})
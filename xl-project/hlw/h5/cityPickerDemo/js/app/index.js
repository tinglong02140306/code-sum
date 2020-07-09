var pickerExtend;
var addEvent = function() {
        var $this = $('.wrap');
        // 车牌号信息删除
        $this.off('.car-item .icon-del').on('click', '.car-item .icon-del', handleEvent.carNoDelEvt);

        // 添加车辆信息
        $this.off('.btn-add-car').on('click', '.btn-add-car', handleEvent.addCarNoEvt);

        // 地区级联点击
        $this.off('#trigger').on('click', '#trigger', handleEvent.showSelAreaEvt);

        var $that = $('.area-cascade-wrap');
        $that.off('.cancel').on('click', '.cancel', handleEvent.selCancelEvt);
        $that.off('.ensure').on('click', '.ensure', handleEvent.selsureEvt);

        // 区域选择级联
        $that.off('.select-wrap span').on('click', '.select-wrap .span', handleEvent.areaClickEvt);
        // select-wrap

    },
    // 事件处理
    handleEvent = {
        // 显示区域下拉框
        showSelAreaEvt: function() {
            $('.area-cascade-wrap').addClass('show');
        },
        // 区域下拉框取消
        selCancelEvt: function() {
            $('.area-cascade-wrap').removeClass('show');
        },
        // 区域下拉框确定
        selsureEvt: function() {
            $('.area-cascade-wrap').removeClass('show');
        },

        // 车牌信息删除 物理删除
        carNoDelEvt: function(e) {
            $(this).remove();
        },
        // 添加车辆点击事件
        addCarNoEvt: function() {
            window.location.href = './handle-etc.html';
        },
        areaClickEvt: function(e) {
            var $this = $(this),
                code = $(e.currentTarget).data('code');

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

        },

        getAreaInfo: function() {
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
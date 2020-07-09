var localInfos,
    curActiveCode = '',
    rule = [{
        'key': 'receiver',
        'title': '收件人姓名',
        'required': true,
    }, {
        'key': 'mobile',
        'title': '手机号',
        'required': true,
        'pattern': /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
    }, {
        'key': 'agent_code',
        'title': '营销人员代码',
        'pattern': /^\d{10}$/,
    }, {
        'key': 'province',
        'title': '省',
        'required': true,
    }, {
        'key': 'city',
        'title': '市',
        'required': true,
    }, {
        'key': 'area',
        'title': '区县',
        'required': true,
    }, {
        'key': 'address',
        'title': '详细地址',
        'required': true,
    }];
var addEvent = function() {
        var $this = $('.wrap');
        // 车牌号信息删除
        $this.off('.car-item .icon-del').on('click', '.car-item .icon-del', handleEvent.carNoDelEvt);

        // 添加车辆信息
        $this.off('.btn-add-car').on('click', '.btn-add-car', handleEvent.addCarNoEvt);

        // 地区级联点击
        $this.off('#trigger').on('click', '#trigger', handleEvent.showSelAreaEvt);
        // 信息输入框  blur 事件监听
        $this.off('.recipient-info-wrap .item').on('blur', '.recipient-info-wrap .item', handleEvent.infoBlurEvt);

        // 提交收件信息

        $this.off('.btn-submit').on('click', '.btn-submit', handleEvent.submitEvt);

        var $that = $('.area-cascade-wrap');
        $that.off('.cancel').on('click', '.cancel', handleEvent.selCancelEvt);
        $that.off('.ensure').on('click', '.ensure', handleEvent.selsureEvt);

        // 区域选择级联
        $that.off('.select-wrap .item').on('click', '.select-wrap .item', handleEvent.areaClickEvt);
        // 已选择区域点击事件
        $that.off('.selected-wrap .item').on('click', '.selected-wrap .item', handleEvent.areaSelClickEvt);

    },
    // 事件处理
    handleEvent = {
        // 信息失焦 缓存 数据
        infoBlurEvt: function(e) {
            var $this = $(this),
                data = localInfos.userInfo,
                key = $this.data('name');
            data[key] = $this.val();
            util.setLocalInfos(localInfos);
        },

        // 显示区域下拉框
        showSelAreaEvt: function() {
            // pickerExtend.show();
            $('.area-cascade-wrap').addClass('show');
            $('body').addClass('no-scroll');
            $('#trigger').blur();
        },
        // 区域下拉框取消
        selCancelEvt: function() {
            $('.area-cascade-wrap').removeClass('show');
            $('body').removeClass('no-scroll')
        },
        // 区域下拉框确定
        selsureEvt: function() {
            var data = localInfos,
                areaArr = data.selectedArea,
                userInfo = data.userInfo;
            $('.area-cascade-wrap').removeClass('show');
            $('body').removeClass('no-scroll');
            $('#trigger').val(data.selectedArea.join(''));

            userInfo.specificAddr = data.selectedArea.join('');
            // 清空数据
            userInfo.province = '';
            userInfo.city = '';
            userInfo.area = '';
            userInfo.town = '';
            // if(areaArr.length)
            for (var i = 0; i < areaArr.length; i++) {
                if (i == 0) userInfo.province = areaArr[i];
                if (i == 1) userInfo.city = areaArr[i];
                if (i == 2) userInfo.area = areaArr[i];
                if (i == 3) userInfo.town = areaArr[i];
            }
        },

        // 车牌信息删除 物理删除
        carNoDelEvt: function(e) {
            var $this = $(this),
                index = $this.data('index');
            $(this).parent().remove();
            localInfos.vehicleInfoList.splice(index, 1);
            util.setLocalInfos(localInfos);
        },
        // 添加车辆点击事件
        addCarNoEvt: function() {
            if (localInfos.vehicleInfoList.length == 20) {
                util.showToast('最多添加20辆！')
                return;
            }
            window.location.href = './add-car-no.html';
        },
        // 区域向点击事件
        areaClickEvt: function(e) {
            var $this = $(this),
                target = $(e.currentTarget),
                code = target.data('code'),
                name = target.data('name'),
                level = target.data('level'),
                data = localInfos.selectedAreaCode,
                dataArr = localInfos.selectedArea;

            if (level == data.length) {
                data.splice(level - 1, 1, { name: name, code: code });
                dataArr.splice(level - 1, 1, name);
            } else if (level > data.length) {
                data.push({ name: name, code: code });
                dataArr.push(name)
            } else if (level < data.length) {
                data.splice(level - 1, data.length - level + 1, { name: name, code: code });
                dataArr.splice(level - 1, dataArr.length - level + 1, name);
            }
            console.log(dataArr)
                // 渲染
            $('#trigger').val(dataArr.join(' '));
            // 保存数据
            util.setLocalInfos(localInfos);
            renderData.renderSelectArea();

            $this.addClass('select-active').siblings().removeClass('select-active');
            if (level < 4) requestEvent.getAreaInfo(code);
        },
        // 已选择区域点击事件
        areaSelClickEvt: function(e) {
            var $this = $(this),
                target = $(e.currentTarget),
                code = '',
                level = target.data('level'),
                data = localInfos.selectedAreaCode;
            curActiveCode = target.data('code');
            if (level > 1) {
                code = data[level - 2].code;
            } else if (level == 0 && data.length > 0) { // 请选择像
                code = data[data.length - 1].code;
            } else if (level == 1 || (level == 0 && data.length == 0)) {
                code = ''
            }
            $this.addClass('active').siblings().removeClass('active');
            if (level < 4) requestEvent.getAreaInfo(code);

        },

        // 信息校验
        checkInfos: function() {
            var param = {};
            // 提交收件人信息
            requestEvent.submitMsgInfos(param)

        },
        // 提交收件人信息
        submitEvt: function() {
            requestEvent.submitMsgInfos();
        },
        // 创建本地物理存储对象格式
        createLocdataFormate: function() {
            var obj = {
                vehicleInfoList: [],
                userInfo: {
                    receiver: '', // 收件人姓名
                    mobile: '',
                    province: '',
                    city: '',
                    area: '',
                    town: '',
                    specificAddr: '',
                    address: '', // 详细地址
                    agent_code: '', // 营销人员代码
                },
                selectedArea: [],
                selectedAreaCode: [],
                lastedAreaList: []
            }
            var curObj = JSON.parse(localStorage.getItem('localInfos'));
            if (curObj == null) {
                localInfos = obj;
            } else {
                localInfos = curObj;
            }
            util.setLocalInfos(localInfos);

            // 渲染初始信息
            renderData.renderDataAll();
        }
    },
    requestEvent = {
        // 提交收件人信息
        submitMsgInfos: function() {
            var param = Object.assign({}, { vehicleInfoList: localInfos.vehicleInfoList }, localInfos.userInfo);
            if (localInfos.vehicleInfoList.length == 0) {
                util.showToast('至少添加一辆车辆信息!');
                return;
            }
            if (!util.inputCheck(rule, localInfos.userInfo)) return;

            util.ajaxJsonRequest('/truck/etc/collect/address', param, function(res) {
                var data = res.data;
                if (res.code == '0000') {
                    window.location.href = './success.html';
                } else {
                    util.showToast(res.message);
                }
            }, function(res) {
                util.showToast(res.message)
            })

        },
        // 获取区域列表数据
        getAreaInfo: function(code) {
            if (!code) {
                renderData.renderAreaData(cityData)
            } else {
                util.ajaxRequest('/truck/etc/area/query', { divisionId: code }, function(res) {
                    var data = res.data;
                    if (res.code == '0000') {
                        if (data.divisionsList.length > 0) renderData.renderAreaData(data.divisionsList)
                    } else {
                        renderData.renderAreaData(null)
                            // util.showToast(res.message);
                    }
                }, function(res) {
                    // util.showToast(res.message)
                })
            }
        }

    },
    renderData = {
        renderDataAll: function() {
            var data = localInfos;
            renderData.renderSelectArea();
            renderData.renderCarNoInfos(data.vehicleInfoList);
            renderData.renderReceiverInfos(data.userInfo)

        },
        // 渲染区域已选择模块
        renderSelectArea: function() {
            var data = localInfos.selectedAreaCode;
            var $html = ``;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $html += `<div class="item ${i == 3 ? 'active' : ''}" data-level="${i + 1}" data-name="${data[i].name}" data-code="${data[i].code}">${data[i].name}</div>`
                }
                if (data.length < 4) $html += '<div class="item active" data-code="" data-level="0">请选择</div>';

            } else {
                $html = '<div class="item active" data-code="" data-level="0">请选择</div>';

            }
            $('.selected-wrap').empty().append($html);
            var code = $('.selected-wrap .active').prev().data('code');
            curActiveCode = $('.selected-wrap .active').data('code');
            requestEvent.getAreaInfo(code);

        },
        // 渲染区域待渲染模块
        renderAreaData: function(data) {
            var $html = ``;
            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $html += `<div class="item ${data[i].divisionCode == curActiveCode ? 'select-active' : ''}" data-name="${data[i].divisionName}" data-level="${data[i].divisionLevel - 1}" data-code="${data[i].divisionCode}">
                                <span>${data[i].divisionName}</span>
                                <i></i>
                            </div>`

                }
            } else {
                $html += `<div class="item">
                            <span>暂无选择</span>
                            <i></i>
                        </div>`
            }

            $('.select-wrap').empty().append($html)
        },

        // 渲染车辆
        renderCarNoInfos: function(data) {
            var $html = ``;
            for (var i = 0; i < data.length; i++) {
                // &nbsp;&nbsp;  0-蓝牌；1-黄牌；4-渐变绿；
                $html += `<div class="car-item ${data[i].plate_color == 0 ? 'bg-blue' : (data[i].plate_color == 1 ? 'bg-yellow' : 'bg-green')}" data-col="${data[i].plate_color}">
                            <span class="car-no f30 cf">${data[i].plate_no}</span>
                            <span class="icon-del" data-index="${i}"></span>
                        </div>`
            }
            $('.carno-wrap').empty().append($html);
        },

        // 渲染收货人信息
        renderReceiverInfos: function(data) {
            for (var key in data) {
                $(`input[data-name=${key}]`).val(data[key]);
                if (key == 'specificAddr') $('#trigger').val(data[key])
            }
        }
    };
$(function() {
    addEvent();
    handleEvent.createLocdataFormate()
})
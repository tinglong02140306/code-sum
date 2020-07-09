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
    }],
    pickerExtend;
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
    },
    // 事件处理
    handleEvent = {
        // 城市数据初始化 handleEvent.initCityPicker
        initCityPicker: function(position) {
            pickerExtend = new PickerExtend({
                trigger: '#trigger',
                title: '区域选择',
                wheels: [{
                    data: cityData
                }],
                position: position, //初始化定位
                keyMap: {
                    id: 'code',
                    value: 'name',
                    childs: 'children'
                },
                callback: function(indexArr, data) {
                    var nameArr = [],
                        userInfo = localInfos.userInfo;
                    for (var i = 0; i < data.length; i++) {
                        nameArr.push(data[i].name);
                        if (i == 0) userInfo.province = data[i].name;
                        if (i == 1) userInfo.city = data[i].name;
                        if (i == 2) userInfo.area = data[i].name;
                        if (i == 3) userInfo.town = data[i].name;
                    }
                    $('#trigger').val(nameArr.join(''));
                    localInfos.position = indexArr;
                    localInfos.selectedAreaStr = nameArr.join(''),
                        // console.log(data); //返回选中的json数据
                        // console.log(indexArr)
                        util.setLocalInfos(localInfos);
                    // console.log(localStorage.getItem('localInfos'))
                }
            });
        },
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
            pickerExtend.show();
            $('#trigger').blur();
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
                position: [0, 0, 0, 0],
                selectedAreaStr: '',
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
            util.showMask('加载中...')
            util.ajaxJsonRequest('/truck/etc/collect/address', param, function(res) {
                var data = res.data;
                if (res.code == '0000') {
                    window.location.href = './success.html';
                } else {
                    util.showToast(res.message);
                }
                util.hideMask();
            }, function(res) {
                util.showToast(res.message);
                util.hideMask()
            });
        }
    },
    renderData = {
        renderDataAll: function() {
            var data = localInfos;
            renderData.renderSelectArea();
            renderData.renderCarNoInfos(data.vehicleInfoList);
            renderData.renderReceiverInfos(data.userInfo);
            handleEvent.initCityPicker(localInfos.position);
        },
        // 渲染区域已选择模块
        renderSelectArea: function() {
            handleEvent.initCityPicker(localInfos.position);
            $('#trigger').val(localInfos.selectedAreaStr);
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
            }
        }
    };
$(function() {
    addEvent();
    handleEvent.createLocdataFormate();
})
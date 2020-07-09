/**
 * @author hmxue
 * @time 2018-01-10
 * @description 一键挪车首页
 */
'use strict';
$(function() {
    $('.input-label').addClass('hide');
    util.refreshHistory('一键挪车', function() {
        if(searchPage == '2') { // 首页
            $('.car-num').blur(); // 车牌号码失焦点
            renderEvent.toastCenter($('.remove-cancle-wrap .sure-tip')); // 将弹框居中显示
            $('.remove-cancle-wrap').removeClass('hide'); // 确认退出框弹出
        }else if(searchPage =='1') { // 搜索页面
            searchPage = 0, // 位置附近页面
            $('.serach-label').removeClass('hide'); // 搜索页面的提示label显示
            $('.nearby-address-wrap').removeClass('hide'); // 附近页面显示
            $('.search-content').html(''); // 将搜索结果情况
            $('.keywords').val(''); // 搜索关键字情况
            $('.clear-keyword').addClass('hide'); // 清空按钮隐藏
            $('.search-address-wrap').addClass('hide'); // 搜索页面隐藏
        }else if(searchPage =='0') { // 附件页面
            searchPage = '2'; //首页
            $('.nearby-address-wrap').addClass('hide'); // 附近页面隐藏
            $('.index-warp').removeClass( 'hide'); // 首页显示
        }   

    });
    var platForm = util.checkMobilePlatform(), // 判断是否是当前平台
        phoneOs = util.phoneOs(), // 判断是IOS还是Android
        saveflag = true, // 保存是否可点击
        baiduPostionTimer = 0, // 调用百度次数
        serverTimeBig = '23:59', // 服务时间的最大时间
        setTimeoutData = '300', // 当软键盘弹起时，需要增加延时，否则弹回不居中
        userID = '', // 用户ID,
        map = '', // 百度地图容器
        serviceBegin = '', // 服务时间开始
        serviceEnd = '', // 服务时间结束时间
        telBegin = $('.tel_begin').html(), // 语音开始时间
        telEnd = $('.tel_end').html(), // 语音开始时间
        baiduSearch ='', // 百度关键字搜索
        serviceBegin = $('.service-begin').html(), // 服务开始时间
        serviceEnd = $('.service-end').html(), // 服务结束时间
        limitNum = parseInt($('.limit-num').html()), // 可申请次数总数
        applyNum = parseInt($('.apply-num').html()), // 已申请次数
        residueNum = limitNum - applyNum, // 剩余申请次数
        $pics= $("#pics"), // 图片dom
        $uploadDiv = $("#uploadDiv"), // 图片上传DOM
        searchPage = 2, // 1 位置附近页面 1 搜索页面 2首页
        rule = [{
            'key': 'carPlateNum',
            'title': '车牌号码',
            'required': true,
            'pattern': /^[皖A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        },
        {
            'key': 'carPlateNum',
            'title': '车牌号码',
            'required': true,
            'pattern': /^[皖]{1}[A-Z]{1}[D|F]{1}[A-Z0-9]{1}[0-9]{4}$|^[皖]{1}[A-Z]{1}[0-9]{5}[D|F]{1}$/ // 新能
        }],
        option = {
            $pics: $pics,//保存图片路径,逗号隔开
            uploadsize: 0, // 已上传图片初始值
            downloadUrl: $('.download-url').val(),//下载图片url，默认使用框架方法
            deleteTemplate: '<div class="photoIcon" style="position:absolute;right:-0.22rem;top:-0.6rem;width: 0.74rem;height:0.74rem">' +
                '<svg class="icon" aria-hidden="true"> ' +
                '<use xlink:href="#icon-shanchu">' +
                '</use></svg></div>' //删除按钮模板
        },
        vm = window.vm = fly.observable({
            formdata: {
                pictures: '', // 图片路径
                pointX:0, // 经度
                pointY: 0 , // 纬度
                smsOrNot: '1', // 是否发送短信 0是 1否
                telOrNot: '0', // 是否打电话 0是 1否
                carPlateNum: '', // 车牌号码
                carPlateType: '02', // 车牌颜色字典值
                carColorName: '蓝色车牌(小型汽车)', // 车牌颜色名称
                address: '', // 位置
                reasonType: '', // 挪车原因字典值
                reasonText: '' // 挪车原因名称
            },
            //车辆类型数据
            carColorData: fly.dataSource({ 
                data: []
            }),
            //挪车原因数据
            reasonData: fly.dataSource({
                data: []
            }),
            // 电话通知选择点击
            telNoticeClick: function(e) {
                var $this = $(e.currentTarget);
                if($(e.currentTarget).data('flag') == '1') { // 如果标志为1 电话通知不可点击
                    return;
                }
                if($this.hasClass('tel-wrap-select')) { // 已选择
                    vm.formdata.set('telOrNot','0'); // 取消电话挪车
                    $this.removeClass('tel-wrap-select');
                    $this.find('span').removeClass('tel-select');
                }else { // 未选择
                    vm.formdata.set('telOrNot','1'); // 电话挪车选中
                    $this.addClass('tel-wrap-select');
                    $this.find('span').addClass('tel-select');
                }
            },
            // 附近位置返回
            nearbyAddressBack: function() {
                $('.index-warp').removeClass('hide'); // 首页显示
                $('.nearby-address-wrap').addClass('hide'); // 附近页面隐藏
            },
            // 首页返回事件
            back: function() {
                $('.car-num').blur();
                setTimeout(function(){ // 解决键盘弹出DOM混乱
                    renderEvent.toastCenter($('.remove-cancle-wrap .sure-tip')); // 弹框居中显示
                    $('.remove-cancle-wrap').removeClass('hide');  // 是否确认取消挪车
                },setTimeoutData);
            },
            // 阻止事件冒泡事件
            stopLicenseListHide: function(e){
                e.stopPropagation(); // 组织冒泡事件
            },
            jmpAddCar: function(e) { // 跳转到绑定车辆页面
                if(platForm) {
                    var request = util.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=my-car.html'); // 对接口请求数据封装
                        croods.customPlugin({
                            action: 'CIPRoutePlugin.action',
                            params: request,
                            success: function(res) {}
                    });
                }
            },
            // 位置点击事件 并获取附近10个位置
            addressClick: function(e) {
                var map = new BMap.Map("l-map"),
                    mPoint = new BMap.Point(vm.formdata.pointX, vm.formdata.pointY);
                map.centerAndZoom(mPoint, 16);
                var mOption = {
                    poiRadius: 1000,           //半径为1000米内的POI,默认100米
                    numPois: 10                //列举出50个POI,默认10个
                }
                var myGeo = new BMap.Geocoder();        //创建地址解析实例
                map.addOverlay(new BMap.Circle(mPoint, 500));        //添加一个圆形覆盖物
                myGeo.getLocation(mPoint,
                    function mCallback(data) {
                        searchPage = '0'; // 位置附近页面
                        var surroundingPois = data.surroundingPois,
                            tmp = fly.template("nearbyAddressTmp",surroundingPois);
                            $('.nearby-content').html(tmp); // 渲染数据
                            $('.index-warp').addClass('hide');
                            $('.nearby-address-wrap').removeClass('hide');
                            // 定位位置点击事件
                            $('.nearby-address-wrap').off('.nearby-content .item-list').on('click','.nearby-content .item-list', eventHandle.addressSureClick);
                    }, mOption
                );
            },
            // 关键字位置搜索
            searchAddressClick: function() {
                searchPage = 1; // 搜索页面
                renderEvent.keywordsSearchAddressBaidu();
                $('.nearby-address-wrap').addClass('hide');
                $('.search-address-wrap').removeClass('hide');
                /*$('.search-content').html('');*/
                $('.keywords').focus();                
            },
            // 清除搜索关键字
            clearKeyword: function() {
                $('.search-wrap input').val('');
                $('.serach-label').removeClass('hide');
                $('.clear-keyword').addClass('hide');
                $('.car-num').focus();
            },
            // 搜索页面的取消事件
            cancleSearchClick: function() {
                searchPage = 0, // 不是搜索页面
                $('.serach-label').removeClass('hide');
                $('.nearby-address-wrap').removeClass('hide');
                $('.search-content').html('');
                $('.keywords').val('');
                $('.clear-keyword').addClass('hide');
                $('.search-address-wrap').addClass('hide');
            },
            numLabelClick: function() {
                $('.car-num').focus();
            },
            searchLabelClick: function() {
                $('.keywords').focus();
            }, 
            // 车牌颜色选择事件弹框显示
            carColorClick: function(e) {
                if($('.license-color-wrap').hasClass('hide')) {
                    $('.license-color-wrap').removeClass('hide');
                    eventHandle.closeStopPropagation();
                }else {
                    eventHandle.openStopPropagation();
                    $('.license-color-wrap').addClass('hide');
                }
                
            },
            //车牌颜色选择事件
            selectLicenseColorClick: function(e) {
                e.stopPropagation();
                var $this = $(e.currentTarget),
                    value = $this.data('value'), // 车牌颜色的字典值
                    title = $this.data('title'); // 车牌颜色名称
                $('.index-warp .license-item i').removeClass('color-select');
                $this.find('i').addClass('color-select');
                vm.formdata.set('carPlateType',value); // 车身颜色字典值
                vm.formdata.set('carColorName',title); // 车身颜色txt值
                if(value == '52' || value == '99') { // 绿色车牌和其他车牌 车牌号码可以输入7位
                    $('.car-num').attr('maxlength','7');
                }else if(value == '01' || value =='02') { // 蓝色车牌 黄色车牌 车牌号码可以输入6位
                    $('.car-num').attr('maxlength','6');
                }
                $('.car-color-select span').text(title);
                setTimeout(function() {
                    $('.license-color-wrap').addClass('hide');
                    $('.car-num').focus(); // 车牌号码获取焦点
                }, 400);
            },
            reaonSelectClick: function(e) {
                var $this = $(e.currentTarget),
                    value = $this.data('value'),
                    title = $this.data('name');
                if($this.hasClass('item-reason-select')) {
                    $this.removeClass('item-reason-select');
                    vm.formdata.set('reasonType','');
                    vm.formdata.set('reasonText','');
                    return;
                }
                vm.formdata.set('reasonType',value);
                vm.formdata.set('reasonText',title);
                $('.item-reason').removeClass('item-reason-select');
                $this.addClass('item-reason-select');
            },
            // 是否发起挪车
            isSaveRemoveApplyClick: function() {
                if(!$('.apply-btn').hasClass('may-save-apply')) { // 存在必选项为填写
                    return;
                }
                var data = vm.formdata.toJSON();
               /* if((data.address.indexOf('定位中') > -1) || data.pointX =='0' || data.pointY =='0' || data.address =='') {
                    return;
                }*/
                $('.car-num').blur();
                if(!requestEvent.isServiceTimer()) { // 不在服务时间内
                    var msg = '当前时间段不在服务时间范围内(服务提供时间为每天'+ serviceBegin +'-' + serviceEnd +')';
                    renderEvent.platFormToast(msg);
                    return;
                }
                if(residueNum <= 0) {
                    var msg = '您的手机号今天已经有'+limitNum+'次挪车申请记录，今天不能再申请挪车了喔~';
                    renderEvent.platFormToast(msg);
                    return;
                }
                
                var msg = '请输入正确的车牌号码';
                data.carPlateNum = '皖' + data.carPlateNum.toUpperCase();
                if(data.carPlateType == '01' ||data.carPlateType == '02') { // 之前的8位车牌号码的判断
                    if(!(new RegExp(rule[0].pattern).test(data.carPlateNum ))){
                        //请输入正确的车牌号码
                        renderEvent.platFormToast(msg);
                        return;
                    }
                }else if(data.carPlateType == '52'){ // 新能源车牌号码判断  && !(new RegExp(rule[2].pattern).test(data.carPlateNum ))
                    if(!(new RegExp(rule[1].pattern).test(data.carPlateNum ))){
                        //请输入正确的车牌号码
                        renderEvent.platFormToast(msg);
                        return;
                    }
                }else if( data.carPlateType == '99') {
                    if(!(new RegExp(rule[0].pattern).test(data.carPlateNum )) && !(new RegExp(rule[1].pattern).test(data.carPlateNum ))){
                        //请输入正确的车牌号码
                        renderEvent.platFormToast(msg);
                        return;
                    }
                }
                $('.sure-tip-title .car-info').html(data.carPlateNum);
                setTimeout(function(){
                    renderEvent.toastCenter($('.sure-tip'));
                    $('.sure-tip-wrap').removeClass('hide');
                },setTimeoutData);
            },
            // 发起挪车
            saveRemoveApplyClick: function(e) {
                var index = $(e.currentTarget).data('index');
                if(index == '1') {
                    $('.sure-tip-wrap').addClass('hide');
                   // saveflag = true; // 发起挪车可点
                }else {
                    /*if(!saveflag) {
                        return;
                    }*/
                    $('.car-num').blur();
                    var imgs = $('.photoDiv img'),
                        pictureUrl = [],
                        url = CONTEXTPATH + '/apply/submit',
                        data = vm.formdata.toJSON();
                    for(var i=0,len = imgs.length;i < len; i++) {
                        pictureUrl.push($(imgs[i]).attr('id'));
                    }
                    // 发起挪车
                    data.pictures = pictureUrl.join(',');
                    data.carPlateNum = '皖' + data.carPlateNum.toUpperCase();
                    if(platForm) {
                        util.mask(true);
                    }else {
                        util.maskHtml(true,'');
                    }
                    var apllyPlateform = util.checkDeviceType(); // 判断终端类型
                    data.apllyPlateform = apllyPlateform;
                    data.address = $('.address').html();
                    util.ajaxRequest(url,data,function(res) {
                        if(platForm) {
                            util.mask(false);
                        }else {
                            util.maskHtml(false,'');
                        }
                        $('.sure-tip-wrap').addClass('hide');
                        if(res && res.flag) {
                            var id = res.data;
                            var carType = vm.formdata.get('carPlateType'); // 车身颜色字典值 02 蓝色； 01 黄色； 52 绿色；99其它
                            window.location.href = CONTEXTPATH + '/h5/pre-move-car?id=' + id;
                        }else {
                            //saveflag = true;
                            if(res.message.indexOf('联系不到车主')>-1) {
                                setTimeout(function(){
                                   renderEvent.toastCenter($('.relative-driver-wrap .sure-tip'));
                                   $('.relative-driver-wrap').removeClass('hide');
                                },setTimeoutData);
                                //window.location.href = CONTEXTPATH + '/h5/pre-move-car?message=' +res.message;
                                return;
                            }
                            renderEvent.platFormToast(res.message);
                        }
                    },function() {
                        //saveflag = true;
                        if(platForm) {
                            util.mask(false);
                            util.toast('服务端错误！');
                        }else {
                            util.maskHtml(false,'');
                            util.toastHtml('服务端错误！','','','');
                        }
                    });
                }
            },
            // 挪车说明点击事件
            descriptionBtnClick: function() {
                if($('.remove-car-description').hasClass('hide')){
                    $('.car-num').blur();
                    setTimeout(function() {
                        renderEvent.toastCenter($('.description-wrap'));
                        $('.remove-car-description').removeClass('hide'); 
                    },setTimeoutData)
                }else {
                    $('.remove-car-description').addClass('hide');
                }
            },
            // 联系车主我知道了点击事件 
            driverBtnClick: function() {
                $('.relative-driver-wrap').addClass('hide');
            },
            // 挪车记录点击事件
            recordBtnClick: function() {
                window.location.href = CONTEXTPATH + '/h5/remove-car-record';
            },
            //是否取消挪车 
            isCancleRCClick: function(e) {
                var index = $(e.currentTarget).data('index');
                if(index == '1') {
                    $('.remove-cancle-wrap').addClass('hide');
                }else {
                    if(util.isWeiXin()) { // 微信关闭
                        wx.closeWindow();
                        return;
                    } else if(util.isAlipay()) { // 关闭支付宝浏览器
                        ap.popWindow();
                        return;
                    }
                    platForm ? croods.pageClose({}) : window.location.reload(); // 皖警平台关闭页面，否则刷新
                }
            },

            // ORC车牌图片上传点击事件
            orcEvt: function () {
                croods.customPlugin({
                    action: 'CustomPlugin.scanOcr',
                    success: function (res) {
                        if(res) {
                            requestEvent.ocrRequestData(res.base64);
                        }
                    },
                    fail: function (msg) {
                    }
                }); 
            }
        }),
        renderEvent = {
            /**
             * 初始化图片上传
             */
            uploadPhoto: function(res) {
                var downloadUrl = $('.download-url').val(); // 图片的访问路径
                //相关图片
                $("#uploadPhoto").lrzPicture({id:"upload-plus",$pics : $pics,$uploadDiv : $uploadDiv,size: 3,cache : true,downloadUrl:downloadUrl});
            },
            // 百度地图定位 便于第三方接入
            bindLocationEventBaiduThird: function() {
                try {
                    baiduPostionTimer++;
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (data) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            if (data.accuracy == null) {
                                // 用户拒绝地理位置授权
                                renderEvent.platFormToast('请检查定位服务是否打开!');
                            }
                            //省+市+区
                            var address=data.address.province + data.address.city + data.address.district;
                            //街道+号牌
                            var streetinfo = data.address.street + data.address.street_number;
                            if (!streetinfo){
                                $(".address").html(address);
                                vm.formdata.set('address',address);
                            }else{
                                $(".address").html(streetinfo);
                                vm.formdata.set('address',streetinfo);
                            }
                            vm.formdata.set('pointX',data.point.lng.toString()); // 经度
                            vm.formdata.set('pointY',data.point.lat.toString()); // 纬度
                            eventHandle.isClick(); // 判断是否可以发起挪车
                        }else  {
                            //定位失败请刷新重试
                        }
                    },{enableHighAccuracy: true});
                }catch (e) {
                    if(vm.formdata.pointX != 0) {
                        renderEvent.ReslocalAddress(vm.formdata.pointX,vm.formdata.pointY);
                    }else {
                        if(baiduPostionTimer <=3 ) {
                            renderEvent.bindLocationEventBaiduThird();
                        }else {
                            renderEvent.platFormToast('定位失败！');
                        }
                       
                    }
                }
            },
            // 使用croods 进行精确定位
            bindLocationEventBaidu: function() {
                util.getOpenLocation({
                    getOpenLocationSuccess: function(lng,lat) {
                        var gpsPoint = new BMap.Point(lng,lat);
                        BMap.GPSConvertor.translate(gpsPoint, 0, function (point) { // 将GSP定位转换成百度地图的经度纬度
                            renderEvent.getLocation(point); // 你地址解析
                        }); 
                    },
                    getLocationFail: function() {
                        renderEvent.bindLocationEventBaiduThird();
                    },
                    getLocModeFail: function() {
                        renderEvent.bindLocationEventBaiduThird();
                    },
                    openGpsSettingFail: function() {
                        renderEvent.bindLocationEventBaiduThird();
                    },
                    getOpenLocation: function(){
                        util.getOpenLocation({
                            getOpenLocationSuccess: function(lng,lat) {
                                var gpsPoint = new BMap.Point(lng,lat);
                                BMap.GPSConvertor.translate(gpsPoint, 0, function (point) { // 将GSP定位转换成百度地图的经度纬度
                                    renderEvent.getLocation(point); // 你地址解析
                                }); 
                            },
                            getLocationFail: function() {
                                renderEvent.bindLocationEventBaiduThird();
                            },
                            getLocModeFail: function() {
                                renderEvent.bindLocationEventBaiduThird();
                            },
                            openGpsSettingFail: function() {
                                renderEvent.bindLocationEventBaiduThird();
                            },
                            getOpenLocation: function(){

                            }
                        });
                    }
                });
            },
            // 逆地址解析
            getLocation: function(point) {
                var geoc = new BMap.Geocoder();
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents,
                        streetinfo = addComp.street + addComp.streetNumber;
                    if($('.address').html().indexOf('定位中...') <=-1 && $('.address')) {
                        eventHandle.isClick(); // 是否可以发起挪车
                        return;
                    }
                    if (!streetinfo){
                        $(".address").html(rs.address);
                        vm.formdata.set('address',rs.address);
                    }else{
                        $(".address").html(streetinfo);
                        vm.formdata.set('address',streetinfo);
                    }
                    vm.formdata.set('pointX',point.lng.toString()); // 经度
                    vm.formdata.set('pointY',point.lat.toString()); // 纬度
                    eventHandle.isClick(); // 是否可以发起挪车
                });
            },
            // 重新定位
            ReslocalAddress: function(lng,lat){
                var map = new BMap.Map("l-map");
                var mPoint = new BMap.Point(lng, lat);
                map.centerAndZoom(mPoint, 16);
                var mOption = {
                    poiRadius: 500,           //半径为1000米内的POI,默认100米
                    numPois: 10                //列举出50个POI,默认10个
                }
                var myGeo = new BMap.Geocoder();                 //创建地址解析实例
                map.addOverlay(new BMap.Circle(mPoint, 500));        //添加一个圆形覆盖物
                myGeo.getLocation(mPoint,
                    function mCallback(data) {
                        if(data.surroundingPois.length>0){
                            var streetinfo = data.surroundingPois[0].address;
                            $(".address").text(streetinfo);
                            vm.formdata.set('address',streetinfo);
                            vm.formdata.set('pointX',data.point.lng.toString()); // 经度
                            vm.formdata.set('pointY',data.point.lat.toString()); // 纬度
                            eventHandle.isClick(); // 判断是否可以发起挪车
                        }
                    }, mOption
                );
            },
            // 百度地图关键字搜索
            keywordsSearchAddressBaidu: function() {
                // 百度地图API功能
                var map = new BMap.Map("l-map");        
                map.centerAndZoom(new BMap.Point(vm.formdata.pointX,vm.formdata.pointY), 11);
                var options = { 
                    onSearchComplete: function(results){ // 搜索完成之后的回调函数
                        if(!results || !results.getCurrentNumPois()) { // 查询不到位置显示暂无数据
                            $('.search-content').html("");
                            $('.search-address-wrap .empty').removeClass('hide'); // 暂无数据
                            return;
                        }
                        // 判断状态是否正确
                        if (baiduSearch.getStatus() == BMAP_STATUS_SUCCESS){
                            var data = [];
                            for (var i = 0; i < results.getCurrentNumPois(); i ++){
                                data.push(results.getPoi(i)); // 获取地理位置数据
                            }
                            var tmp = fly.template("nearbyAddressTmp",data); // 渲染数据
                            $('.search-content').html(tmp);
                            $('.search-address-wrap .empty').addClass('hide');
                            // 定位位置点击事件
                            $('.search-address-wrap').off('.search-content .item-list').on('click','.search-content .item-list', eventHandle.addressSureClick)
                        }
                    }
                };
                baiduSearch = new BMap.LocalSearch(map, options); // 百度地图关键字搜索
            },
            // 弹框居中
            toastCenter: function($this) {
                $this.css({ 
                    position: "absolute", 
                    top: ($('.mask').height() - $this.outerHeight())/2 
                }); 
            },
            // 根据平台进行提示
            platFormToast: function(msg) {
                if(platForm) {
                    util.toast(msg);
                }else {
                    util.toastHtml(msg,'','','');
                }
            }
        },

        requestEvent = {
            /**
             * 请求车牌颜色
             */
            getLicensePlateColor: function() {
                var url = CONTEXTPATH + '/dict/type',
                    param = {type: 'PLATE_TYPE'};
                util.ajaxRequest(url,param,function(res){
                    if(res && res.flag) {
                        vm.carColorData.data(res.data);
                        eventHandle.isClick(); // 判断是否可以发起挪车
                    }else {
                        renderEvent.platFormToast('请求数据失败！');
                    }
                });
            },
            /**
             * 请求挪车原因
             */
            getRemoveReason: function() {
                var url = CONTEXTPATH + '/dict/type',
                    param = {type: 'REASON_TYPE'};
                util.ajaxRequest(url,param,function(res){
                    if(res && res.flag) {
                        vm.reasonData.data(res.data); // 挪车原因数据源
                        eventHandle.descriptionWrapPosition(); // 判断底部是否是fixed布局
                    }else {
                        eventHandle.descriptionWrapPosition(); // 判断底部是否是fixed布局
                        renderEvent.platFormToast('请求数据失败！');
                    }
                },function(res) {eventHandle.descriptionWrapPosition(); // 判断底部是否是fixed布局
                });
            },
            // 是否是第一次进入该服务
            isFirst: function() {
                var userID = $('.user-id').val(), // 获得用户ID
                    localUserID = localStorage.getItem('userID_'+ userID); 
                if(!localUserID) { // 判断该用户是否在第一次打开
                    localStorage.setItem('userID_'+userID,true);
                    renderEvent.toastCenter($('.description-wrap')); // 第一次打开弹出使用说明
                    $('.remove-car-description').removeClass('hide');

                }
            },
            // 是否是在在服务时间内
            isServiceTimer: function() {
                var timer = util.currentTimer().substring(0,5); // 获取当前的时分秒
                if((timer < serviceBegin) || (timer > serviceEnd)) { // 判断是否在服务时间以内
                    return false;
                }
                return true;

            },
            // 语音通知是否可以选 
            noticeTel: function() {
                var timer = util.currentTimer().substring(0,5); // 获取当前的时分秒
                if((timer < serviceBegin) || (timer > serviceEnd)) { // 如果不在服务时间以内短信、电话通知不可选置灰
                    $('.notice-type .sms-wrap').removeClass('sms-wrap-select');
                    $('.notice-type .sms').removeClass('sms-select');
                    $('.notice-value').removeClass('hide');
                    $('.notice-type .tel-wrap').data().flag = '1'; // 电话通知按钮不可选
                    return;
                }
                if((timer < telBegin) || (timer > telEnd)) { // 不在电话服务时间以内电话通知按钮置灰
                    // 语音通知不可以选
                    $('.notice-type .tel-wrap').data().flag = '1';
                    
                }else {
                    // 语音通知可以选择
                    vm.formdata.set('telOrNot','1');
                    $('.notice-type .tel-wrap').addClass('tel-wrap-select');
                    $('.notice-type .tel').addClass('tel-select');
                }
                $('.notice-value').removeClass('hide');
            },

            // OCR接口请求
            ocrRequestData: function(base64) {
                if(base64) {
                    util.maskHtml(true, '读取中,请稍后...');
                    util.ajaxRequest(CONTEXTPATH + '/ocrscan',{
                        photo: encodeURI(base64),
                    },function(res){
                        res = typeof res == 'string' ?  $.parseJSON(res) : res;
                        util.maskHtml(false, '');
                        if (res.flag) {
                            if(res.data) {
                                vm.formdata.set('carPlateNum', res.data);
                            }
                        } else {
                            renderEvent.platFormToast(res.message || '车牌数据解析失败！');
                        }
                    }, function(res) {
                        util.maskHtml(false, '');
                        renderEvent.platFormToast(res.message || '车牌数据解析失败！');

                    });
                }else {
                    renderEvent.platFormToast(res.message || '车牌数据解析失败！');
                }
            }
        },
        eventHandle = {
            /**
             * 底部挪车说明样式
             */
            descriptionWrapPosition: function() {
                var wHeight = parseInt($('body').outerHeight()),
                    content = parseInt($('.remove-car-form').outerHeight())+57;
                if((content - wHeight) <=0) { // 判断内容是否超过1屏 如果超过 底部使用说明流动布局
                    $('.bottom-tip').css('position','fixed'); // 不超过1屏 fixed布局 计算高度后改成流动布局
                    $('.bottom-tip').css('paddingBottom','0rem'); 
                    var paddingTop  = $('.bottom-tip').offset().top - $('.bottom').offset().top;
                    $('.bottom').css('paddingTop',paddingTop);
                    $('.bottom-tip').css('position','static'); // 为了解决IOS键盘弹出 fixed失效问题
                }
                $('.bottom-tip').removeClass('hide');
            },
            /**
             * 监听发起移车申请按钮是否可点击
             */
            isClick: function() {
                var value = $('.car-num').val(),
                    data = vm.formdata.toJSON(),
                    $applyBtn = $('.apply-btn'); // 获取按钮DOM && data.pointX !='0' && data.pointY !='0'
                // 判断发起挪车按钮是否可点（必选项都已选择）
                if (value && $('.car-color').html() && !($('.address').html().indexOf('定位中') > -1)) {
                    vm.formdata.carPlateNum = value;
                    $applyBtn.addClass('may-save-apply'); // 可点
                } else {
                    $applyBtn.removeClass('may-save-apply'); // 不可点
                };
            },
            // 定位位置选择事件
            addressSureClick: function(e) {
                vm.formdata.set('pointY',$(this).data('pointy')); // 获取当前点击位置的经度
                vm.formdata.set('pointX',$(this).data('pointx')); // 获取当前点击位置的纬度
                var address = $(this).data('title'); // 获取当前地理位置名称
                $('.index-warp .address').html(address); 
                vm.formdata.set('address',address); // 用于提交参数赋值
                eventHandle.isClick(); // 判断发起挪车按钮是否可点击
                setTimeout(function() {
                   if(searchPage == 0) { // 附近位置页面
                        $('.nearby-address-wrap').addClass('hide'); // 附近页面隐藏
                        $('.nearby-content').html(""); // 清空内容
                   }else { // 搜索页面
                        $('.search-address-wrap').addClass('hide'); // 搜索页面隐藏
                        $('.serach-label').removeClass('hide');
                        $('.keywords').val(''); // 清空搜索输入关键字
                        $('.search-content').html(""); // 清空内容
                        $('.clear-keyword').addClass('hide');
                   }
                   $('.index-warp').removeClass('hide'); // 首页显示
                   searchPage = '2'; // 设置页面标志为首页
                }, 400);

            },
            // 图片预览
            photoView: function() {
                if(platForm) {  // 使用croods进行预览图片
                    var url,
                        URL = [],
                        result,
                        position,
                        deleteFlag;
                    url = $(this).attr('src'); // 当前图片URL
                    if(url){
                        URL.push(url); 
                    }
                    result = JSON.stringify(URL);
                    position = '1'; // 当前是1张图片
                    deleteFlag = "false"; // 没有删除标志
                    var REQUEST = util.packData({
                        "url": result,
                        "position": position,
                        "deleteFlag":deleteFlag
                    }, "", "1", false, "");
                    croods.customPlugin({
                        action: 'CustomImagePlugin.BigImage',
                        params: REQUEST,
                        success: function(res) {}
                    });
                }else {
                    $('.photoDiv').FlyZommImg(); // 插件预览
                }
            },
            // 实时搜索
            realSearchInput: function() {
                var keywords = $('.search-wrap .keywords').val(); // 获取输入框内容
                if(keywords) {
                    $('.serach-label').addClass('hide');
                    $('.clear-keyword').removeClass('hide'); // 清空按钮显示
                }else {
                    $('.serach-label').removeClass('hide');
                    $('.clear-keyword').addClass('hide'); // 清空按钮隐藏
                }
                baiduSearch.search(keywords); // 搜索
            },
            // 阻止冒泡事件
            handler : function (event) {
                event.preventDefault();
                event.stopPropagation();
            },
            openStopPropagation: function() {
                document.body.addEventListener('touchmove',eventHandle.handler,false);  // false 为触发冒泡事件
            },
            closeStopPropagation: function() {
                document.body.removeEventListener('touchmove',eventHandle.handler,false);
            },
            // 支付宝与其他图片上传的处理
            uploadPicWay: function() {
                if(util.isAlipay()) {
                    if($('#upload-plus').length > 0) {
                        $('#upload-plus').remove();
                    }
                    $('.icon-plus').attr('id', 'iconPlus');
                }else {
                    if($('#upload-plus').length == 0) {
                        var html = '<input type="file"  accept="image/*" id="upload-plus" class="upload-plus-input" multiple="multiple"/>';
                        $(html).insertBefore($('.icon-plus'));
                    }
                    $('.icon-plus').attr('id', '');
                    renderEvent.uploadPhoto(); // 初始化图片上传
                }
            },
            // 支付宝上传图片点击事件
            uploadPicClick: function() {
                AlipayJSBridge.call('photo', {
                    dataType: 'dataURL',
                    imageFormat: 'jpg',
                    quality: 75,
                    multimediaConfig: { // 可选，仅当该项被配置时，图片被传输至 APMultimedia
                        compress: 2, // 可选，默认为4。 0-低质量，1-中质量，2-高质量，3-不压缩，4-根据网络情况自动选择
                        business: "multiMedia" // 可选，默认为“NebulaBiz”
                    }
                }, function(result) {
                   /* alert(JSON.stringify(result));*/
                    if(result.dataURL) {
                        var msg = '上传中';
                        util.maskHtml(true, msg);
                        var file = result.fileURL,  // 图片的绝对路径
                            fileArr = file.split('/'),
                            len = fileArr.length,
                            fileName = fileArr[len -1], // 图片名
                            dataUrl = result.dataURL;   // 图片base64位地址

                        eventHandle.uploadPhotoAjax(fileName, dataUrl); // 图片上传
                    }
                });
            },
            // 图片上传
            uploadPhotoAjax: function(fileName, dataUrl) {
                //遮罩层
                if(option.uploadsize >= 3 ){
                    var msg = '最多上传三张图片!';
                    util.toastHtml(msg,'','','');
                    return;
                }
                $.ajax({
                    url: CONTEXTPATH+ '/file/uploadbase64',
                    type: 'POST',
                    data: {
                        fileName: fileName,
                        data: dataUrl
                    },
                    beforeSend: function(){
                        /*var msg = '上传中';
                        util.maskHtml(true, msg);*/
                    },
                    success: function (res) {
                        util.maskHtml(false,'');
                        if (!res.flag) {
                            var msg = res.message || '图片上传失败！';
                            util.toastHtml(msg,'','','');
                            return;
                        }
                       // 显示图片
                       var ts = res.data;
                       eventHandle.showPhoto(ts,true);
                    },
                    error: function() {
                        var msg = '图片上传失败!';
                        util.maskHtml(false,'');
                        util.toastHtml(msg,'','','');
                    }
                }); 
            },

            // 显示图片
            showPhoto: function(filePath,save) {
                option.uploadsize++;
                var filePathId = filePath.replace(/\/|\./g, ""), // 去空格
                    html = '<div class="span3 photoDiv" style="position:relative" id="' + filePathId + '">' +
                    '<img   style="width:3.04rem;height:2.88rem;border: 1px solid #e5e5e5;" src="' + option.downloadUrl + filePath + '" id="' + filePath + '"/>' +
                    '<div class="' + filePathId + '"  param="' + filePath + '">' +
                    option.deleteTemplate + '</div>' +
                    '</div>';

                $(html).insertBefore($uploadDiv);

                //保存图片路径
                if (save) {
                    option.$pics.val(option.$pics.val() == "" ? filePath : option.$pics.val() + "," + filePath);
                }
                //点击删除
                $("." + filePathId).on("click", function() {

                    eventHandle.deletePhone($(this).attr("param"), $(this).attr("class"));
                });
                eventHandle.checkPhotoSize(eventHandle); // 限制上传图片数量

                $(".photoDiv img").off('error').on('error', function() {
                    $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
                }); // 默认图片
            },
            //删除图片
            deletePhone : function(filePath,filePathId){
                var timeoutData = 300 ;
                if(util.phoneOs() == 'IOS') {
                    timeoutData = 500;
                }
                $('.car-num').blur();
                $('.delete-picture-wrap').off('click','.delete-confirm').on('click','.delete-confirm',function(e) {
                    option.uploadsize--;
                    $uploadDiv.show();
                    $("#"+filePathId).remove();
                    var reger=new RegExp("^" + filePath + ",|,"+filePath+"|"+filePath,"gm");
                    option.$pics.val(option.$pics.val().replace(reger,""));
                    $('.delete-picture-wrap').addClass('hide');
                    fly.$.ajax({
                        url: CONTEXTPATH + '/file/remove',
                        data: {
                            path:filePath
                        },
                        dataType: 'json',
                        type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                        cache: false,
                        success: function (res) {
                        
                        },
                        error: function(res) {
                        }
                    });
                });
                $('.delete-picture-wrap').off('click','.delete-cancle').on('click','.delete-cancle',function(e) {
                    $('.delete-picture-wrap').addClass('hide');
                });
                setTimeout(function(){
                    $('.delete-picture').css({ 
                        position: "absolute", 
                        top: ($('.mask').height() - $('.delete-picture').outerHeight())/2 
                    }); 
                    $('.delete-picture-wrap').removeClass('hide');
                },timeoutData);
            },
            //限制图片数量
            checkPhotoSize : function(obj){
                if(option.uploadsize >= 3) {
                    $uploadDiv.hide();
                }
            },
            // 根据版本
            getAppVersion: function() {
                croods.customPlugin({
                    action: 'myPlugin.getMessage',
                    success: function (res) {
                        res = typeof res == 'string' ? $.parseJSON(res) : res;
                        if(res.version >= '2.3.5') {
                            $('.icon-camera').removeClass('hides');
                        }
                    },
                    fail: function (msg) {
                    }
                }); 
            }
        };
    // 初始化
    var init = function() {
        
        if(platForm) {
            eventHandle.getAppVersion();
        }
        serviceEnd = $('.service-end').html();
        if(serviceEnd == serverTimeBig) { // 若服务时间为23:59 则显示24点
            $('.service-end').html('24:00');
        }
        if($('.tel_end').html() == serverTimeBig) {
            $('.tel_end').html('24:00');
        }
        if(residueNum == 1) { // 今天申请剩余次数为1的的时提示
            $('.apply-num').html(residueNum);
            $('.is-last').removeClass('hide');
        }
        requestEvent.noticeTel(); // 是否在允许通知
        requestEvent.isFirst(); // 判断是否是第一次进入改APP
        requestEvent.getLicensePlateColor(); // 请求车牌颜色
        requestEvent.getRemoveReason(); // 请求挪车原因
        /*renderEvent.uploadPhoto(); // 初始化图片上传*/
        eventHandle.uploadPicWay();
        if(platForm) {
           /* setTimeout(function() {
                renderEvent.bindLocationEventBaidu(); // 使用croods 进行精确定位
            },1000);*/
            renderEvent.bindLocationEventBaidu(); // 使用croods 进行精确定位
            $('.bind-car').removeClass('hide'); // 是否有绑定爱车
        }else {
            if(util.isWeiXin()) { // 微信定位
                wx.ready(function() {
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var ggPoint = new BMap.Point(res.longitude, res.latitude),
                                pointArr = [];
                            pointArr.push(ggPoint);
                            new BMap.Convertor().translate(pointArr, 1, 5, function(data) { // 转成百度地图坐标
                                renderEvent.getLocation(data.points[0]); // 你地址解析
                            });
                        },
                        cancel: function (res) {
                            //用户拒绝授权获取地理位置
                            renderEvent.bindLocationEventBaiduThird(); // 调用百度定位
                        },
                        fail: function() {
                            // todo 调用百度地图定位
                            renderEvent.bindLocationEventBaiduThird(); // 调用百度定位
                        }
                    });
                })
                wx.error(function() {
                    renderEvent.bindLocationEventBaiduThird(); // 调用百度定位
                });
            } else if(util.isAlipay()) { // 支付宝定位
                ap.getLocation({
                    success: function(res) {
                        var ggPoint = new BMap.Point(res.longitude, res.latitude),
                            pointArr = [];
                        pointArr.push(ggPoint);
                        new BMap.Convertor().translate(pointArr, 3, 5, function(data) { // 转成百度地图坐标
                            renderEvent.getLocation(data.points[0]); // 逆地址解析
                        });
                    },
                    fail: function(res) {
                        renderEvent.bindLocationEventBaiduThird(); // 调用百度定位
                    }
                });
            } else {
                renderEvent.bindLocationEventBaiduThird();
                //renderEvent.bindLocationEventBaiduThird(); // 百度地图定位 便于第三方接入
            }
        }
        if(phoneOs == 'IOS') {
            setTimeoutData = 500;
        }
    }
    // 添加事件
    var addEvent = function() {
        var $indexWarp = $('.index-warp');
        // 监听输入框内容变化状态
        $indexWarp.off('.car-num').on('input propertychange','.car-num',eventHandle.isClick);
        // 搜索关键字input事件
        $('.search-address-wrap').off('.search-wrap .keywords').on('input propertychange','.search-wrap .keywords',eventHandle.realSearchInput);
        // 图片预览
        $indexWarp.off('.photoDiv img').on('click','.photoDiv img',eventHandle.photoView);

        // 支付宝点击事件
        $indexWarp.off('#iconPlus').on('click', '#iconPlus', eventHandle.uploadPicClick);
    }
    fly.bind(document.body, vm);
    init(); // 初始化
    addEvent();  
});
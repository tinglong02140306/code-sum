/*
 * @Description: 良田高拍仪驱动
 */
;(function () {
    var dataformat = {
        /**
         * yyyy-MM-dd HH:mm:ss
         */
        FORMAT_NORMAL: "yyyy-MM-dd hh:mm:ss",

        /**
         * yyyy-MM-dd
         */
        FORMAT_SHORT: "yyyy-MM-dd",

        /**
         * yyyyMMddhhmmss
         */
        FORMAT_NO_SIGN: "yyyyMMddhhmmss",

        /**
         *  时间格式化
         *  @param date 时间
         *  @param format 格式
         *  @return 格式化时间
         */
        format: function (date, format) {
            var nd = new Date(date);

            var o = {
                "M+": nd.getMonth() + 1, // month
                "d+": nd.getDate(), // day
                "h+": nd.getHours(), // hour
                "m+": nd.getMinutes(), // minute
                "s+": nd.getSeconds(), // second
                "q+": Math.floor((nd.getMonth() + 3) / 3), // quarter
                "S": nd.getMilliseconds()
            };

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (nd.getFullYear() +
                    "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length ==
                        1 ? o[k] : ("00" + o[k]).substr(("" + o[k])
                            .length));
                }
            }
            return format;
        },

        /**
         *  解析时间字符串
         *  @param str 时间字符串
         *  @param format 解析格式
         *  @return 时间对象
         */
        parseDateComplex: function (str, format) {
            var nd = new Date();
            var realDate = "yyyy/MM/dd hh:mm:ss";
            var o = {
                "M+": nd.getMonth() + 1, // month
                "d+": nd.getDate(), // day
                "h+": 0, // hour
                "m+": 0, // minute
                "s+": 0 // second
            };

            var index = format.search(/(y+)/);
            if (index > -1) {
                var len = RegExp.$1.length;
                var year = (nd.getFullYear() + "").substr(0, 4 -
                    len) + str.substr(index, len);
                realDate = realDate.replace(/(y+)/, year);
            }

            for (var k in o) {
                var reg = new RegExp("(" + k + ")");
                var regIndex = format.search(reg);
                var ret = "";
                if (regIndex > -1) {
                    ret = str.substr(regIndex, RegExp.$1.length);
                } else {
                    ret = o[k] + "";
                }
                ret = ("00" + ret).substr(ret.length);
                realDate = realDate.replace(reg, ret);
            }
            return new Date(realDate);
        },

        /**
         *  解析时间字符串(简化版)
         *  @param str 简化时间字符串
         *  @return 时间对象
         */
        parseDate: function (str) {
            if (arguments.length == 2) {
                return this.parseDateComplex(arguments[0],
                    arguments[1]);
            }
            if (str && str != "") {
                var st = str.substring(0, 4) + "/" + str.substring(
                        4, 6) + "/" + str.substring(6, 8) + " " +
                    str.substring(8, 10) + ":" + str.substring(10,
                        12) + ":" + str.substring(12, 14);
                return new Date(st);
            }
        },

        /**
         *  改变时间格式
         *  @param str 时间字符串
         *  @param fromFmt 当前时间格式
         *  @param toFmt 变化后时间格式
         *  @return  变化格式后时间字符串
         */
        formatDateComplex: function (str, fromFmt, toFmt) {
            return this.format(this.parseDateComplex(str, fromFmt),
                toFmt);
        },

        /**
         *  改变时间格式(简化版)
         *  @param str 简化时间字符串
         *  @param toFmt 变化后时间格式
         *  @return 格式化时间
         */
        formatDate: function (str, toFmt) {
            if (arguments.length == 3) {
                return this.formatDateComplex(arguments[0],
                    arguments[1], arguments[2]);
            }
            return this.format(this.parseDate(str), toFmt);
        },

        /**
         *  短时间格式
         *  @param str 标准时间字符串
         *  @return 简化时间字符串
         */
        dateToShortStr: function (str) {
            return str.replace(/[\s\-\:]/g, "");
        },

        /**
         *  开始时间格式
         *  @param str 时间字符串
         *  @return 开始时间字符串
         */
        dateToStartStr: function (str) {
            var ret = this.dateToShortStr(str) + "000000";
            return ret;
        },

        /**
         *  结束时间格式
         *  @param str 时间字符串
         *  @return 结束时间字符串
         */
        dateToEndStr: function (str) {
            var ret = this.dateToShortStr(str) + "235959";
            return ret;
        },

        /**
         *  时间增加天数
         *  @param date 时间
         *  @param days 增加天数
         *  @return 增加天数后时间
         */
        addDayToDate: function (date, days) {
            var nd = new Date(date);
            nd.setDate(nd.getDate() + days);
            return nd;
        },

        /**
         *  时间增加小时
         *  @param date 时间
         *  @param hours 增加小时数
         *  @return 增加小时后时间
         */
        addHoursToDate: function (date, hours) {
            var nd = new Date(date);
            nd.setHours(nd.getHours() + parseInt(hours));
            return nd;
        },

        /**
         *  计算两个时间的天数差
         *  @param d1 时间1
         *  @param d2 时间2
         *  @return 天数差
         */
        dateDiff: function (d1, d2) {
            var time = d2.getTime() - d1.getTime();
            var days = parseInt(time / (1000 * 60 * 60 * 24));
            return days;
        }
    }

    var liangtianS620A3R = function (options) {
        this.defaultOpts = {
            viewfinderTemp: {
                elementTag: 'object',
                attrList: [{
                    name: 'classid',
                    value: 'clsid:090457CB-DF21-41EB-84BB-39AAFC9E271A'
                }, {
                    name: 'codebase',
                    value: '*.cab#version=1,0,0,1'
                }]
            },
            viewfinder: {
                mount: 'view',
                id: 'ScanCtrl',
                width: 660,
                height: 400
            }
        }

        this.options = $.extend(true, {}, this.defaultOpts, options);
    }

    liangtianS620A3R.prototype = {
        constructor: liangtianS620A3R,
        init: function () {
            this.create();
        },
        create: function () {
            var opt = this.options,
                $mount = document.getElementById(opt.viewfinder.mount),
                $tempViewfinder = opt.viewfinderTemp.attrList;
            $tempViewfinder = $tempViewfinder.concat([{
                name: 'width',
                value: opt.viewfinder.width
            }, {
                name: 'id',
                value: opt.viewfinder.id
            }, {
                name: 'height',
                value: opt.viewfinder.height
            }])

            //挂载取景器DOM
            var tmpView = document.createElement(opt.viewfinderTemp.elementTag);

            for (var i = 0; i < $tempViewfinder.length; i++) {
                tmpView.setAttribute($tempViewfinder[i].name, $tempViewfinder[i].value);
            }
            // for(var i = 0; i < $mountC.length; i++) {
            //     $($mountC[i]).append(tmpView);
            // }

            $mount.appendChild(tmpView);

        },
        /**
         * 获取身份证信息
         * @return {Object}
         */
        getIdCardInfo: function () {
            var obj = document.getElementById(this.options.viewfinder.id),
                isActive = obj.IDCardRecognize();

            if (isActive) {
                var info = {
                    name: obj.GetIDCardName(),
                    nation: obj.GetIDCardNation(),
                    gender: obj.GetIDCardSex(),
                    born: obj.GetIDCardBorn(),
                    addr: obj.GetIDCardAddr(),
                    cardNo: obj.GetIDCardNo(),
                    certOrg: obj.GetIDCardPolice(),
                    cardActive: obj.GetIDCardActive()
                }
                return info;
            } else {
                return null;
            }
        },
        /**
         * 打开摄像头
         * @return 
         */
        startPreview: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            // ScanCtrl.StartPreviewEx();
            // setTimeout(function() {
            //     getData && getData();
            // },500);
            return ScanCtrl.StartPreviewEx();
        },
        /**
         * 关闭摄像头
         * @return 
         */
        stopPreview: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.StopPreviewEx();
        },
        /**
         * 切换摄像头
         * @return {String} 激活的摄像头编号
         */
        toggleDev: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            var iDevIndex = ScanCtrl.GetCurDevIndex();
            if (iDevIndex != -1) {
                var count = ScanCtrl.GetDeviceCount(),
                    target = 0;

                if (iDevIndex < count - 1) {
                    target = iDevIndex + 1;
                }
                ScanCtrl.SetCurDev(target);
                return ScanCtrl.GetDevName(target);
            }
        },
        /**
         * 打开设备属性（通过系统弹出框）
         * @return 
         */
        showDevInfoByDialog: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.Property();
        },
        /**
         * 放大
         * @return 
         */
        zoomIn: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetZoomIn();
        },
        /**
         * 缩小
         * @return 
         */
        zoomOut: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetZoomOut();
        },
        /**
         * 拍照
         * @return {String} base64图像数据
         */
        takePicBase64: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id),
                // EThumbnails = document.getElementById(this.options.prevView.id),
                fileName = dataformat.format(new Date(), 'yyyyMMddhhmmssS') + ".jpg",
                path = "D:\\" + fileName,
                flag,
                base64;
        
            base64 = ScanCtrl.ScanBase64(path)

            if(base64){
                return {
                    path: path,
                    base64: base64,
                    fileName: fileName
                }
            }else {
                return false;
            }
        },
        autoCrop: function (isOpen) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetRotateCrop(isOpen);
        },
        /**
         * 删除背景颜色--修改（新增）
         * @param {interger} 颜色索引值
         */
        DelBackColor: function (isDel) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.DelBackColor(isDel);
        },
        /**
         * 获取当前摄像头ID--修改（新增）
         * @return {String} 摄像头id
         */
        curDevPIDVID: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurDevPIDVID();
        },
        /**
         * 获取当前摄像头索引值--修改（新增）
         * @return {Integer} 摄像头索引
         */
        curDevIndex: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurDevIndex();
        },
        /**
         * 设置当前摄像头--修改（新增）
         * @param {interger} 摄像头索引
         * @return
         */
        curDev: function (index) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetCurDev(index);
        },
        /**
         * 获取当前摄像头使用的分辨率索引--修改（新增）
         * @return {integer} 索引值
         */
        curResolutionIndex: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurResolutionIndex();
        },
        /**
         * 获取设备分辨率等级--修改（新增）
         * @return {integer} 等级
         */
        resolutionCount: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetResolutionCount();
        },
        /**
         * 获取摄像头分辨率的宽度--修改（新增）
         * @param {interger} 摄像头索引
         * @return {integer} 等级
         */
        resolutionWidth: function (index) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetResolutionWidth(index);
        },
        /**
         * 获取摄像头分辨率的高度--修改（新增）
         * @param {interger} 摄像头索引
         * @return {integer} 等级
         */
        resolutionHeight: function (index) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetResolutionHeight(index);
        },
        /**
         * 设置分辨率--修改（新增）
         * @param {interger} 摄像头索引
         */
        resolution: function (val) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetResolution(val);
        },
        /**
         * 获取尺寸索引--修改（新增）
         * @return {integer} 尺寸索引
         */
        curScanSizeIndex: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurScanSizeIndex();
        },
        /**
         * 获取尺寸种类--修改（新增）
         * @return {integer} 尺寸种类数
         */
        scanSizeCount: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetScanSizeCount();
        },
        /**
         * 获取尺寸名称--修改（新增）
         * @param {interger} 尺寸索引值
         * @return {integer} 对应的名称
         */
        scanSizeName: function (index) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetScanSizeName(index);
        },
        /**
         * 设置扫描尺寸--修改（新增）
         * @param {interger} 尺寸值
         */
        scanSize: function (val) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetScanSize(val);
        },
        /**
         * 获取旋转角度--修改（新增）
         * @return {integer} 旋转角度种类数
         */
        curRotateAngle: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurRotateAngle();
        },
        /**
         * 设置扫描旋转角度--修改（新增）
         * @param {interger} 旋转角度
         */
        videoRotate: function (val) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetVideoRotate(val);
        },
        /**
         * 获取当前颜色--修改（新增）
         * @return {integer} 当前颜色索引
         */
        curColor: function () {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            return ScanCtrl.GetCurColor();
        },
        /**
         * 设置颜色--修改（新增）
         * @param {interger} 颜色索引值
         */
        videoColor: function (val) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.SetVideoColor(val);
        },
        /**
         * 删除背景颜色--修改（新增）
         * @param {interger} 颜色索引值
         */
        delBackColor: function (isCheck) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.DelBackColor(isCheck);
        },
        /**
         * --修改（新增）
         * @param {interger} 值
         */
        enableDateRecord:function (val) {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id);
            ScanCtrl.EnableDateRecord(val);
        },
        getSelRotateData: function() {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id),
                initRotate = ScanCtrl.GetCurRotateAngle(),
                data = [];
            if(initRotate != -1 || true) {
                data = [{
                    label: '0',
                    value: '0'
                }, {
                    label: '90',
                    value: '1'
                }, {
                    label: '180',
                    value: '2'
                }, {
                    label: '270',
                    value: '3'
                }];
            }
            return data;
        },
        getSelResData: function() {
            var ScanCtrl = document.getElementById(this.options.viewfinder.id),
                data = [];
                // initRes = ScanCtrl.GetCurResolutionIndex(),
            for (var i = 0, count = ScanCtrl.GetResolutionCount(); i < count; i++) {
                w = ScanCtrl.GetResolutionWidth(i);
                h = ScanCtrl.GetResolutionHeight(i);
                str = w.toString() + "x" + h.toString();
                data.push({
                    label: str,
                    value: i
                });
                // if (i == initRes) {
                //     that.gpyConfig.curResW = w;
                //     that.gpyConfig.curResH = h;
                // }
            }
            return data;
        },
    }

    window.hspDeviceList.liangtianS620A3R = function (options) {
        return new liangtianS620A3R(options);
    }
})();
/*
 * @Author: chongxuan 
 * @Date: 2018-09-25 12:13:43 
 * @Description: 科密G2000高拍仪驱动
 */

;(function(){
    var zoomVal = 1;
    var iVideo;
    var Kemi = function (options) {
        this.defaultOpts = {
            viewfinderTemp: {
                elementTag: 'object',
                attrList: [{
                    name: 'classid',
                    value: 'clsid:8CAA584A-AC84-445B-89D6-D4BD455EAF96'
                }]
            },
            viewfinder: {
                mount: 'view1',
                id: 'iVideo',
                width: 660,
                height: 400
            }
        }
        this.options = $.extend(true, {}, this.defaultOpts, options);
        
    }
    
    Kemi.prototype = {
        constructor: Kemi,
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
    
            $mount.appendChild(tmpView);
    
            iVideo = document.getElementById(this.options.viewfinder.id);

        },
        /**
         * 打开摄像头
         * @return 
         */
        startPreview: function () {
            var result = iVideo.OpenDevices();
            iVideo.SetImageFormat('png')
        },
        /**
         * 关闭摄像头
         * @return 
         */
        stopPreview: function () {
            var res = iVideo.CloseDevices();
        },
        /**
         * 切换摄像头
         * @return {null}
         */
        toggleDev: function () {
            return iVideo.ToggleDevice();
        },
        /**
         * 打开设备属性（通过系统弹出框）
         * @return 
         */
        showDevInfoByDialog: function () {
            return iVideo.OpenPropertyPage();
        },
        /**
         * 放大
         * @return 
         */
        zoomIn: function () {
            return iVideo.Zoom(zoomVal += 100);
        },
        /**
         * 缩小
         * @return 
         */
        zoomOut: function () {
            return iVideo.Zoom(zoomVal -= 100);
            if (zoomVal <= 0) {
                zoomVal = 0;
            }
        },
        /**
         * 拍照
         * @return {String} base64图像数据
         */
        takePicBase64: function () {
            var getSnap = iVideo.GetSnap(),
                result = {};
            if (getSnap) {
                var path = "D:\\kemicache"+new Date().getTime()+".jpg";
                result.base64 = iVideo.GetSnapBase64();
                iVideo.SaveSnap(path, 80);
                result.path = path;
            } else {
                result = false;
            }
            return result;
        },
        /**
         * 纠偏裁边
         * @param  {Number} mode {0:不纠正,1：智能纠正,2：手动裁剪}
         */
        setCropMode: function (mode) {
            return iVideo.SetCropMode(mode);
        },
        /**
         * 智能裁边
         * @param {Boolean} isOpen
         * @return 
         */
        autoCrop: function (isOpen) {
            return this.setCropMode(isOpen ? 1 : 0);
        },
        /**
         * 颜色模式
         * @param  {Number} mode {0:彩色,1：灰度,2：黑白}
         */
        setColorMode: function(mode){
            return iVideo.SetColorMode(mode);;
        }
    }
    
    window.hspDeviceList.kemi = function (options) {
        return new Kemi(options);
    }
 })();

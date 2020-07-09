/*
 * @Author: chongxuan 
 * @Date: 2018-09-25 12:13:43 
 * @Description: 华视读卡器
 */
;(function(){
    var Huashi = function (options) {
        this.defaultOpts = {
            temp: {
                elementTag: 'object',
                attrList: [{
                    name: 'type',
                    value: 'application/cert-reader'
                },{
                    name: 'name',
                    value: 'CertCtl'
                }]
            },
            mount: "certReade",
            id: "CertCtl",
            width: 0,
            height: 0
        }
        this.options = $.extend(true, {}, this.defaultOpts, options);
    }
    
    Huashi.prototype = {
        constructor: Huashi,
        init: function () {
            this.create();
        },
        create: function () {
            var opt = this.options,
                $mount = document.getElementById(opt.mount),
    
                $temp = opt.temp.attrList.concat([{
                    name: 'width',
                    value: opt.width
                }, {
                    name: 'id',
                    value: opt.id
                }, {
                    name: 'height',
                    value: opt.height
                }])
    
            //挂载DOM
            var tmpEl = document.createElement(opt.temp.elementTag);
    
            for (var i = 0; i < $temp.length; i++) {
                tmpEl.setAttribute($temp[i].name, $temp[i].value);
            }
    
            $mount.appendChild(tmpEl);
    
        },
        /**
         * 获取身份证信息
         * @return {Object}
         */
        getIdCardInfo: function () {
            var obj = document.getElementById(this.options.id);
            var status = $.parseJSON(obj.getStatus());
            
            if(status.errorMsg == '设备未连接'){
                obj.connect();
            }
            
            var result = $.parseJSON(obj.readCert());
            
            if(result.resultFlag != "-1"){
                
                var info = {
                    name: result.resultContent.partyName,
                    nation: result.resultContent.nation,
                    gender: result.resultContent.gender,
                    born: result.resultContent.bornDay,
                    addr: result.resultContent.certAddress,
                    cardNo: result.resultContent.certNumber,
                    certOrg: result.resultContent.certOrg,
                    cardActive: result.resultContent.expDate + '-' + result.resultContent.effDate
                }
                return info;
            }else {
                return null;
            }
        }
    }
    window.hspDeviceList.huashi = function (options) {
        if(!options){
            var options = {}
        }
        return new Huashi(options);
    }
    })();
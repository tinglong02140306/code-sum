(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {
    var common = {};
    //用户登录超时时操作
    (common.globalAjaxSetup = function() {
        var win = fly.top || window;
        var appUrl = encodeURIComponent(win.location.href);
        var loginUrlRes = '&service=' + (appUrl.indexOf('jsessionid') > -1 ? appUrl.substr(0, appUrl.indexOf('jsessionid')) : appUrl);
        $.ajaxSetup({
            type: 'POST',
            complete: function(xhr, status) {
                if (!xhr.responseText){
                    return;
                } else {
                    var res = xhr.responseText;
                    res = eval('(' + res + ')');
                    if (res.status == false && res.msg == 'SESSION_OUT') {
                        // fly.top.fly.tip({
                        //     content: message.get('SESSION_OUT'),
                        //     css: 'danger'
                        // });

                        if (!fly.top.userName) {
                            fly.top.util.tip(message.get('PELEASE_LOGIN'));
                            return false;
                        }
                        setTimeout(function() {
                            win.location.href = res.data.url + loginUrlRes;
                        }, 800);
                    }
                }
            }
        });
    })();

    /**
     * [setEllClass 给grid的表格]
     * @param {[String]} col [宽度]
     * @param {[String]} col [名称]
     * @param {[object]} row [行对象]
     */
    common.setEllClass = function(width) {
        return function(col, row) {
            var data = row[col];

            if (data.toString().length > 0) {
                data = data.toString().replace(/"/g, "'");
            } else {
                data = '-';
            }
            return ("<div class='ell' title=\"{data}\" style=\"width:" + width + "px\">{data}</div>").replace(/{data}/g, data);
        };
    };

    /**
     * 设置表格按钮
     * @param {[type]} url [请求的接口]
     * @param {[type]} param [参数]
     * @param {[type]} success [ajax成功调用的方法]
     * @param {[type]} error [ajax失败调用的方法]
     */
    common.ajaxRequest = function(url, param, success, error) {
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            //dataType: "json",  //by ddqian2 让AJAX自己去识别类别
            success: success,
            error: error
        });
    };


    /**
     * dialog对话框
     * @param {[type]} content [显示的内容]
     * @param {[type]} okCb [确定是执行的方法]
     * @param {[type]} cancelCb [取消时执行的方法]
     */
    common.sysConfirm = function(content, okCb, cancelCb) {
        var d = fly.top.fly.dialog({
            id: "sysconfirm",
            content: content,
            width: 200,
            padding: '15px 20px',
            title: "系统提示",
            okValue: '确定',
            cancelValue: "取消",
            ok: okCb,
            cancel: true
        });

        return d;
    };

    /**
     * [getNowFormatDate 获取当前日期并格式化]
     * @return {[type]} [当前日期 yyyy-MM-dd hh:mm:ss]
     */
    common.getNowFormatDate = function() {
        var date = new Date();
        var seperator1 = '-';
        var seperator2 = ':';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        // var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    };

    /**
     * [getQuarterByMonth 根据月份获取季度]
     * @param  {[type]} month [月份]
     * @return {[type]}       [description]
     */
    common.getQuarterByMonth = function(month) {
        return Math.floor((month % 3 == 0 ? (month / 3) : (month / 3 + 1)))
    };

    common.getDateString = function(date) {
        var str = '';
        str = date.replaceAll('-', '');
        str = str.replaceAll(':', '');
        str = str.replaceAll(' ', '');

        return str;
    };

    /**
     * 将14位数字字符串转日期格式
     * @param str 14位字符串
     * @return 日期
     */
    common.dateToNum = function(str) {
        return str.replace(/[^0-9]/g, '');
    };

    /**
     * [获取到对象数组中的属性生成字符串数组 ]
     * @param  {[object]} data [数据对象]
     * @param  {[String]} name [需要处理的属性]
     * @return {[Srray]}      [返回字符串数组]
     */
    common.getDataArrayByName = function(data, name) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
            array.push(data[i][name]);
        };
        return array;
    };

    // 获取url中的中文值
    common.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return '';
    };

    /**
     * 移出遮罩
     * @return {[type]} [description]
     */
    common.removeMask = function() {
        if (fly.top.$('.fly-mask').length) {
            util.removeMask();
        }
    };

    // 获取元素位置
    common.getElemPos = function(obj) {
        var pos = {
            "top": 0,
            "left": 0
        };
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                pos.top += obj.offsetTop;
                pos.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        } else if (obj.x) {
            pos.left += obj.x;
        } else if (obj.x) {
            pos.top += obj.y;
        }
        return {
            x: pos.left,
            y: pos.top
        };
    }

    // replaceAll
    String.prototype.replaceAll = function(oldV, newV) {
        var reg = new RegExp(oldV, 'g');
        return this.replace(reg, newV);
    }

    // HTML CODE 替换
    common.HTMLCodeReplace = function(dataObj) {
        var codeMap = {
            "&lt;": "<",
            "&gt;": ">",
            "&#40;": "(",
            "&#41;": ")",
            "&#39;": "'"
        }; //特殊字符MAP

        // 循环遍历内容
        for (var i = 0; i < dataObj.length; i++) {
            var item = dataObj[i];

            // 取值
            var $inputObj = $('[name="' + item + '"]'),
                val = $inputObj.val();

            // 替换全部CODE
            for (var code in codeMap) {
                val = val.replaceAll(code, codeMap[code]);
            }

            // 替换
            $inputObj.val(val);
        }
    }

    /**
     *判断是否安装flash
     *
     */
    common.getFlashInfo = function() {
        var swf, data = {};
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //ie
            try {
                var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                // alert("已安装插件"); 
                if (swf) {
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    // 
                    if (flashVersion > 11) {
                        data.flashVersion = true;
                        data.flag = true;
                        return data;
                    } else {
                        data.flashVersion = false;
                        data.flag = true;
                        return data;
                    }

                } else {
                    data.flashVersion = false;
                    data.flag = false;
                    return data;
                }
            } catch (e) {
                // alert("没有安装插件"); 
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
        //chrome firefox
        if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
            swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                //alert("已安装插件");
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
                if (flashVersion > 11) {
                    data.flashVersion = true;
                    data.flag = true;
                    return data;
                } else {
                    data.flashVersion = false;
                    data.flag = true;
                    return data;
                }

            } else {
                //alert("没有安装插件");
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
    };

    // 暂无数据
    // @param: emptyObj: 空数据需要添加到的DOMID (string)
    common.addEmpty = function(emptyObj) {

        var $emptyObj = $("#" + emptyObj),
            $prevObj = $emptyObj.prev(),
            _objHeight = $emptyObj.height(),
            _marginTopH = _objHeight / 2 - 25, // 25px:暂无数据的高度 / 2
            htmlObj = [
                '<div class="emptyData">',
                '    <table class="wp-100">',
                '        <tbody>',
                '            <tr>',
                '                <td>',
                '                    <div class="emptyData-container">',
                '                        <div class="emptyData-left empty-wrap"></div>',
                '                        <div class="emptyData-right empty-wrap">暂无数据~</div>',
                '                    </div>',
                '                </td>',
                '            </tr>',
                '        </tbody>',
                '    </table>',
                '</div>'
            ].join('');

        $emptyObj.empty().append(htmlObj);

        if ($prevObj && $prevObj.length) {
            $emptyObj.css({
                'width': $prevObj.width()
            });
            $prevObj.css({
                "overflow-x": "visible"
            });
        }

        // 修改高度、宽度
        $emptyObj.find('.emptyData-container').css('padding-top', _marginTopH);
    };

    Array.prototype.sum = function() {

        var temp = 0;

        for (var i = 0, len = this.length; i < len; i++) {
            temp += this[i] >> 0;
        }
        return temp;
    };

    common.getFormatterTime = function(str) {
        var newStr = '';

        newStr = str.replaceAll(':', '');
        newStr = newStr.replaceAll('-', '');
        newStr = newStr.replaceAll(' ', '');

        return newStr;
    };

    common.dateFormatter = function() {
        // 时间的格式处理 
        fly.template.helper('dateFormatter', function(str) {
            if (!str) {
                return '-';
            }
            var newStr = '';
            if (str.length == 12) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12);
            } else if (str.length == 8) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
            } else if (str.length == 14) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) + ':' + str.substring(12, 14);
            }
            return newStr;
        });
    };
    common.dateFormatterLen = function(str) {
        if (!str) {
            return '-';
        }
        var newStr = '';
        if (str.length == 12) {
            newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + '：' + str.substring(10, 12);
        } else if (str.length == 8) {
            newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
        } else if (str.length == 14) {
            newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12) + ':' + str.substring(12, 14);
        }
        return newStr;
    };
    // 帮扶日志的展开和关闭 
    common.logShowAndHideFun = function() {
        fly.template.helper('logIntroFormatter', function(str) {
            if (str.length > 248) {
                return str.substring(0, 248) + '...';
            }
            return str;
        });

        fly.template.helper('showBtnFormatter', function(str) {
            if (str.length > 248) {
                return '';
            } else {
                return 'hide';
            }
        });

        // 帮扶日志的展开和关闭 
        $('#helpLogWrap').on('click', '.log-show', function() {
            var $this = $(this),
                $closeDom = $this.closest('.log-intro'),
                allArticle = $closeDom.attr('title'),
                flag = $this.hasClass('log-open');
            if (flag) {
                $closeDom.find('.log-article').text(allArticle);
                $this.addClass('log-close').removeClass('log-open').attr('title', '收起').text('收起');
            } else {
                var newArticle = allArticle.length > 248 ? (allArticle.substring(0, 248) + '...') : allArticle;
                $closeDom.find('.log-article').text(newArticle);
                $this.addClass('log-open').removeClass('log-close').attr('title', '展开').text('展开');
            }
        });
    };

    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     */
    common.setGridEmpty = function(num) {
        var emptyDom = '<tr><td colspan="' + num + '"><div class="empty-show">没有数据</div></td></tr>';
        $('.grid').find('tbody').html(emptyDom);
    };

    /**
     * [setListGridEmpty 设置数据展示]
     * @param {[type]} num       [列数]
     * @param {[type]} className [class名]
     */
    common.setListGridEmpty = function(num, className) {
        var emptyDom = '<tr><td colspan="' + num + '"><div class="empty-show">没有数据</div></td></tr>';
        $('.' + className).find('tbody').html(emptyDom);
    };

    //  8位数的当前时间 年月日
    common.toDateTime = function() {
        var myDate = new Date(),
            year = myDate.getFullYear(),
            month = myDate.getMonth() > 8 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1),
            date = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate(),
            dateTime = year + month + date + '';
        return dateTime;
    };

    // 身份证校验
    common.checkIdcard = function(num) {
        num = num.toUpperCase();
        var curDate = new Date(),
            cjrNum = '',
            cjrReg = new RegExp('^[0-9]*$');
        // 未输入时，不做规则校验
        if (num.length == 0) {
            return true;
        }
        // 说明是残疾人证  后两位保证是数字就行了
        if (num.length == 17) {
            cjrNum = num.substr(15, 2);
            num = num.substring(0, 15);

            if (!cjrReg.test(cjrNum)) {
                return false;
            }
        }
        if (num.length == 20) {
            cjrNum = num.substr(18, 2);
            num = num.substring(0, 18);

            if (!cjrReg.test(cjrNum)) {
                return false;
            }
        }

        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
            return false;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                // alert('输入的身份证号里出生日期不对！');
                return false;
            } else {
                //将15位身份证转成18位
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            // 身份证出生日期不能大于当前日期，否者无效
            var isBig = (curDate.getFullYear() < Number(arrSplit[2])) ||
                ((curDate.getFullYear() == Number(arrSplit[2])) && ((curDate.getMonth() + 1) < Number(arrSplit[3]))) || ((curDate.getFullYear() == Number(arrSplit[2])) && ((curDate.getMonth() + 1) == Number(arrSplit[3])) && (curDate.getDate() < Number(arrSplit[4])));
            if (isBig) {
                return false;
            }

            //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                // alert('输入的身份证号里出生日期不对！');
                return false;
            } else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    // alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    /**
     * [validCharacterLength 校验字符的长度]
     * @param  {[type]} str    [要校验的字符串]
     * @param  {[type]} maxLen [最大长度]
     * @return {[type]}        [true，false]
     */
    common.validCharacterLength = function(str, maxLen) {
        var strl = 0;
        var l = str.length;
        for (var i = 0; i < l; i++) {
            //全角字符,占两个字符
            if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255) {
                strl = strl + 2;
            } else {
                strl++;
            }
        }
        if (strl > maxLen) {
            return false;
        } else {
            return true;
        }
    };

    // 贫困户，贫困村，贫困县数值input框校验
    // 1.整数：12位
    // 2.小数：12位整数部分，4位小数部分
    common.validNumberLength = function(str) {
        // 大于12位的整数
        if (str.length > 12 && str.indexOf('.') == -1) {
            return false;
        } else {
            // 大于12位的小数,小于12位的小数
            if (str.indexOf('.') !== -1) {
                // 整数部分长度小于12
                if (str.split('.')[0].length > 12) {
                    return false;
                } else {
                    if (str.split('.')[0].length > 1 && str.split('.')[0].indexOf('0') == 0) {
                        return false;
                    }
                }
                // 小数
                if (str.split('.')[1].length > 4) {
                    return false;
                } else {
                    return true;
                }
                // 小于12位的整数
            } else {
                if (str.length > 1 && str.indexOf('0') == 0) {
                    return false;
                } else {
                   return true; 
                }
            }
        }
    };

    common.fomatNum = function(str) {
        str = str.toString();
        if (str.length > 1){
            if (str[0] === '0') {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     *
     *  id: 查找的id
     */
    common.setCustomizeGridEmpty = function(id) {
        var emptyDom = '<div class="empty-show"></div>';
        $('.grid').find('#' + id).html(emptyDom);
    };

    common.setEmptyShow = function(id, column) {
        var emptyDom = '<td colspan="' + column + '"><div class="empty-show-box"></div></td>';

        $('#' + id).html(emptyDom);
    };
    common.setBarEmptyShow = function(id) {
        var emptyDom ='<div class="empty-show-box center"></div>';

        $('#' + id).html(emptyDom);
    };
    common.getAddress = function() {
        var dataObj = {
            // 省默认值
            provinceValue:'340000000000',
            // 省的数据源
            province: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do?sjbm=0',
                    dataType: 'json'
                },
                server: true

            }),

            distSource: function(){
                return fly.dataSource({
                    read: {
                        url: CONTEXTPATH + '/dict/getAddress.do',
                        dataType: 'json'
                    },
                    server: true
                });
            }
        };
        return dataObj;
    };

    common.generateMixed = function(n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    common.permissionCode = [];
    common.permission = function(){
        //权限控制，根据请求的head读权限
        //查看权限--query
        //解除结对--untwinning
        //结对--twinning
        //删除--delete
        //编辑--edit
        //新增--add
        //脱贫--outpoverty --户
        //返贫--inpoverty  --户
        //出列--fallout --村
        //脱帽--offhats --县
        /**
       var codes = []; 
        $.ajax({
            type: 'HEAD', // 获取头信息，type=HEAD即可
            url : window.location.href,
            complete: function( xhr,data ){
                var codesArr = [];
                //如果common.permissionCode为空，表示页面是从菜单初次进来，则解析菜单对应的权限；
                //如果不为空，表示是其他的url进入，比如刷新列表数据等，这种情况不需要再读权限，直接从初始权限中取
                if(!common.permissionCode.length){
                    var codes = xhr.getResponseHeader('operationCodes')
                            .replace("[","")
                            .replace("]","")
                            .replace(" ","");
                    codesArr = codes.split(",");

                    $.each(codesArr, function(i,item){
                        item = item.replace(/\s+/g,"").replace(" ","");
                        common.permissionCode.push(""+$.trim(item));
                        
                    });
                    //dom中已存在的按钮直接控制
                    roleHideButton(codesArr);
                    //DOMSubtreeModified事件是监听grid-table列表内的数据变化时，操作按钮
                    $(".grid-table").on('DOMSubtreeModified' , function(){  
                        roleHideButton(codesArr);    
                    });
                }
            }
        });
        function roleHideButton(arr){
            $.each(arr, function(i,item){
                $(".js-permission-" + $.trim(item)).show();
            })
        }
        **/
    };

    /**
     * [setVmValue observable赋值]
     * @param  {[type]} obj [定义的observable名称]
     * @param  {[type]} data [传入赋值对象]
     * @2016-10-13 by xinfan
     */
    common.setVmValue = function(obj,data){
        for(var i = 0; i < data.length; i++){
            obj.set(data[i].name,data[i].value);
        }
    };

    /**
     * 弹框的方法
     * @param  {[String]} dialogId    [弹框的id]
     * @param  {[String]} dialogTitle [弹框的标题]
     * @param  {[String]} dialogUrl   [弹框的地址]
     * @param  {[Array]} dialogParam [弹框的参数（传参）]
     */
    common.statOpenDialog = function(dialogId, dialogTitle, dialogUrl, dialogParam, w, h) {
        $('body').addClass('dialog-open');
        fly.top.fly.dialog({
            dialogParam: dialogParam, // 参数
            id: dialogId, // dialog ID
            title: dialogTitle, // 标题
            url: dialogUrl, // URL
            width: w, // 宽度 不支持百分比
            height: h, // 高度 不支持百分比
            close: function() {
                $('body').removeClass('dialog-open');
            }
        });
    };
    
    common.openFullWindow = function(url, name, openType) {
        var redirectUrl = url;
        var width = screen.availWidth - 10;
        var height = screen.availHeight - 50;
        var szFeatures = "top=0,";
        szFeatures += "left=0,";
        szFeatures += "width=" + width + ",";
        szFeatures += "height=" + height + ",";
        szFeatures += "directories=no,";
        szFeatures += "status=no,toolbar=no,location=no,";
        szFeatures += "menubar=yes,";
        szFeatures += "scrollbars=yes,";
        szFeatures += "resizable=yes"; // channelmode
        szFeatures += "fullscreen=yes";
        if (openType) {
            window.open(redirectUrl, openType, szFeatures);
        } else {
            window.open(redirectUrl, '_blank', szFeatures); 
        }
    };

    //小数转百分数
    common.toPercent = function(obj, n) {
        n = n || 2;
        return (Math.round(obj * Math.pow(10, n + 2)) / Math.pow(10, n) ).toFixed(n) + '%';
    };

    //构建地图点详情html
    common.buildTemplate = function() {
        var template =
            '<div class="info-point">' +
                '<p><span>部件名称：</span><strong></strong>' +
                '<p><span>主管单位地址：</span><strong></strong>' +
                '<p><span>所处地址：</span><strong></strong>'
            '</div>'
        return template;
    };

    //删除数组
    common.removeArray = function(data, arrayData){
        if(arrayData == '') return false;
        for (var i = 0; i < data.length; i++){
            for (var j = 0; j < arrayData.length; j++){
                if(data[i] == arrayData[j]){
                    data.splice(i,1);
                    common.removeArray(data,arrayData);
                    return data;
                }
            }
        }
    }
    window.common = common;
    return common;
}));

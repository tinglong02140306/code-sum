/**
 * @Author: sunmingmao
 * @Date: 2020-03-26 15:42:07
 * @LastEditors: longting
 * @LastEditTime: 2020-04-03 08:41:43
 * @Description: 工具类
 */

/**
 * @description: 保留小数点后n位，不够补零
 * @param num {String||Number} 需要转换的数字
 * @param n {Number} 小数点后n位
 * @return: 拥有小数点后n位
 */
export const keepDecimalFull = (num, n) => {
    let result = parseFloat(num);
    if (isNaN(result)) {
        return false;
    }
    let pow = Math.pow(10, n);
    result = Math.round(num * pow) / pow;
    let s_x = result.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + n) {
        s_x += '0';
    }
    return s_x;
}


/**
 * @description: 校验金额是否正确
 * @param {string} money
 * @return: 
 */
export const checkMoney = money => {
    const reg = /^[0-9]{1,}(?:.[0-9]{0,2})?$/
    return reg.test(money)
}


/**
 * @description: 校验链接是否是以http https 开头的
 * @param {*} url
 */
export const checkUrl = url => {
    const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    return reg.test(url)
}

/**
 * @description: 获取当前日期 yyyy-mm-dd
 */
export const getCurrentData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const data = `${year}-${month}-${day}`
    return data;
}

/**
 * @description: 获取当前日期 yyyy-mm-dd HH:mm:ss
 */
export const getCurrentDataTime = () => {
    const date = new Date();
    console.log('new Date()', new Date())
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    const data = `${year}-${month}-${day} ${h}:${m}:${s}`
    return data;
}

export const trim = str => {
    return str === 0 || str === "" || str ? str.toString().replace(/\s+/g, "") : null
}
/**
 * @description: 计算与当前时间差距
 *   @param yyyy-mm-dd HH:mm:ss 格式
 *   返回数组
 */
export const getDifferenceTime = (time1, time2) => {
    // var time1 = new Date(time1);    //转换为中国标准时间
    // var time2 = new Date(time2);
    // let time = time1.replace('-','/')
    let new_time1 = new Date(time1.replace(/-/g, '/')).getTime(); //转换为时间戳(ios不能解析'-')
    let new_time2 = new Date(time2.replace(/-/g, '/')).getTime();
    let runTime = (new_time2 - new_time1) / 1000; //开始得出时间差,然后计算
    console.log('time1', time1.replace(/-/g, '/'))
    console.log('new Date(time1),', new Date(time2))
    console.log('new_time1', new_time2)
    console.log('runTime', runTime)
    let year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    let month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    let day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    let hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    let minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    let second = runTime;
    // return year+'年,'+month+'月,'+day+'天,'+hour+'小时,'+minute+'分,'+second+"秒";
    return [year, month, day, hour, minute, second];
}

/**
 * @description:校验车牌号
 * @param  {string} plateNumber [车牌号,必须为大写]
 * @return {boolean} [车牌号是否合法]
 */
export const checkPlateNumber = plateNumber => {
    if (plateNumber) {
        const plate = plateNumber.toUpperCase()
        const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
        const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
        if (plate.length === 7) {
            return creg.test(plate);
        } else if (plate.length === 8) {
            return xreg.test(plate);
        } else {
            return false;
        }
    }
    return false;
}

/**
 * @description:将车牌号转为 鲁A 89075 格式
 * @param {*} plateNumber 
 */
export const formatPlateNumber = plateNumber => {
    if (!checkPlateNumber(plateNumber)) {
        return;
    }
    return plateNumber.substring(0, 2) + " " + plateNumber.substring(2, plateNumber.length);
}

/**
 * 校验ETC卡号是否正确
 * @param {} etc_card_no
 * @return {string} 返回该ETC卡所属的省份代码
 */
import {
    SUPPORT_TYPE
} from '../components/etc-input/constants'
export const checkETCNo = etc_card_no => {
    etc_card_no = trim(etc_card_no);
    if (!etc_card_no || etc_card_no.length !== 20) {
        return ''
    }
    if (SUPPORT_TYPE) {
        const province = etc_card_no.substr(0, 2);
        for (let i = 0; i < SUPPORT_TYPE.length; i++) {
            const item = SUPPORT_TYPE[i];
            if (item.province_code === province) {
                return province;
            }
        }
        return '';
    }
    return '';
}

/* 转化时间格式
 * @param {*} time  2018-02-01 12:05:10 转为  2018-02-01
 */
export const formatTime = (time) => {
    const reg = /^(\d{4})-(\d{1,2})-(\d{1,2}).*/;
    const result = reg.test(time);
    return result ? time.replace(reg, "$1-$2-$3") : ""
}

export const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

/**
 * 保留小数点后两位，不够补零
 * @param {} num
 */
export const keepTwoDecimalFull = (num) => {
    let result = parseFloat(num);
    if (isNaN(result)) {
        return '0.00';
    }
    result = Math.round(num * 100) / 100;
    if (result < 0) {
        return '0.00'
    }
    let s_x = result.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}
/**
 * [formatSpaceId 给id号每四位加空格]
 * @author sunmingmao
 * @Date   2018-12-04T16:02:04+0800
 * @param  {string}                 id [需要加空格的id号]
 * @return {string}                    [加完空格的id号]
 */
export const formatSpaceId = (id) => {
    return id ? id.toString().replace(/(.{4})/g, '$1 ') : null
}
export const formatSpacePlate = (id) => {
    return id ? id.toString().replace(/(.{2})/g, '$1 ') : null
}
/**
 * [checkBankNo 校验银行卡号，只做位数校验]
 * @author sunmingmao
 * @Date   2018-12-04T16:07:44+0800
 * @param  {string}                 bankNo [银行卡号]
 * @return {Boolean}                        [银行卡号是否合法]
 */
export const checkBankNo = (bankNo) => {
    return bankNo && bankNo.length > 0
}
/**
 * [checkMobile 校验手机号]
 * @author sunmingmao
 * @DateTime 2018-12-04T15:43:27+0800
 * @param    {string}           mobile [手机号】
 * @return   {boolean}                 [手机号是否合法]
 */
export const checkMobile = (mobile) => {
    const ph = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    const mb = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|147)\d{8}$/g;
    return ph.test(mobile) || mb.test(mobile)
}

/**
 * [uuid 生成随机字符串 作为唯一标识]
 * @author longting
 * @DateTime 2020-06-02
 * @return   {string}      [生成随机字符串 作为唯一标识]
 */
export const uuid = () => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


/**
 * [获取普通二维码传过来的参数]
 * @author longting
 * @DateTime 2020-07-17
 * @return   {string}      [返回参数值]
 */
export const getQueryString = (url, name) => {
    // url ->  'id=1222&old=12'
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) {
        return r[2]
        // return unescape(r[2]);     //  英文情况下
    }
    return '';
}

/**
 * [时间格式转换 1天 23:39:10 leftTime 秒单位]
 * @author longting
 * @DateTime 2020-07-27
 * @return   {string}      [返回参数值]
 */
export const formatTimes = (leftTime) => {
    let days = parseInt(leftTime / 60 / 60 / 24), //计算剩余的天数 
        hours = parseInt(leftTime / 60 / 60 % 24), //计算剩余的小时 
        min = parseInt(leftTime / 60 % 60),//计算剩余的分钟 
        sec = parseInt(leftTime % 60);//计算剩余的秒数 
    let timeStr = days > 0 ? days + '天 ' : "";
    timeStr = timeStr + addZone(hours) + ':' + addZone(min) + ':' + addZone(sec)
    return timeStr;
}
/**
 * [获取倒计时时间差]
 * @author longting
 * @DateTime 100 s
 * @return   {string}      [返回参数值]
 */
export const getDifferTime = (time) => {
    let endTime = getCurrentDate() + ' ' + time,    
        curTime = getCurrentTime();
    console.log(endTime, curTime);
    let differTime = (new Date(endTime).getTime() - new Date(curTime).getTime()) / 1000;
    console.log(differTime)
    return differTime;
}

/**
 * 获取当前时间 2020-07-27
 */
export const getCurrentDate = () => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = myDate.getMonth() + 1;
    const date = myDate.getDate();
    return `${year}-${addZone(month)}-${addZone(date)}`
}

/**
 * 获取当前时间 2020-07-27 08:30
 */
export const getCurrentTime = () => {
    let myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        date = myDate.getDate(),
        hour = myDate.getHours(),
        min = myDate.getMinutes();
    return `${year}-${addZone(month)}-${addZone(date)} ${addZone(hour)}:${addZone(min)}`
}
export const addZone = (str) => {
    let newTime = "0" + str;
    return newTime.substring(newTime.length - 2, newTime.length);
}


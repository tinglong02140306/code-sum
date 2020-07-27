import XLSX from 'xlsx'
import moment from 'moment';
/**
 * 导入xlsx文件
 * @param file  需要导入的xlsx文件，支持xlsx及xls格式
 * @param multiSheet true:允许读取多个sheet  false:只允许读取一个sheet
 * @param headData xlsx表头信息，比对导入的数据格式是否正确
 * @param success 回调函数，表示xlsx文件解析成功，返回解析后的数据
 * @param fail 回调函数，表示xlsx文件解析失败，返回错误信息
 * @constructor
 */
const XLSXLead = (file, headData, multiSheet, success, fail) => {
    const fileReader = new FileReader();
    const rABS = !!fileReader.readAsBinaryString;//将文件读取为二进制字符串
    let sheetAll = [];
    let isError = false;
    fileReader.onload = (e) => {//文件读取完成
        const data = e.target.result;
        const wb = XLSX.read(data, { type: rABS ? 'binary' : 'array' }); //XLSX将文件读取为指定格式
        if (wb && wb.SheetNames) {
            if (multiSheet) {//多个sheet
                for (let i = 0; i < wb.SheetNames.length; i++) {
                    const sheetName = wb.SheetNames[i];//获取SheetName
                    const sheet = wb.Sheets[sheetName];//获取该SheetName下的内容
                    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });//将内容转为json，第一行为标题栏
                    const sheetTitles = sheetData && sheetData.splice(0, 1);//获取该sheet表的头部
                    const isRightSheetTitles = checkXLSXHead(headData, sheetTitles);
                    if (isRightSheetTitles) {
                        sheetAll = sheetAll.concat(sheetData);
                    } else {
                        isError = true;
                        fail(`${sheetName}格式错误!`);
                        break;
                    }
                }
            } else {//单个sheet
                const sheetName = wb && wb.SheetNames && wb.SheetNames[0];//获取第一个sheet
                const sheet = wb.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });//将内容转为json，第一行为标题栏
                const sheetTitles = sheetData && sheetData.splice(0, 1);//获取该sheet表的头部
                const isRightSheetTitles = checkXLSXHead(headData, sheetTitles);
                if (isRightSheetTitles) {
                    sheetAll = sheetAll.concat(sheetData);
                } else {
                    isError = true;
                    fail(`${sheetName}格式错误!`);
                }
            }
            if (!isError) success(sheetAll)
        } else {
            fail("导入文件格式错误!");
        }
    }
    if (rABS) fileReader.readAsBinaryString(file); else fileReader.readAsArrayBuffer(file);
}



/**
 * 校验导入的xlsx的表头是否符合指定格式
 * @param provideHead : 指定的表头格式
 * @param fileHead :  读取的文件的表头格式
 */
const checkXLSXHead = (provideHead, fileHead) => {
    return provideHead && fileHead && provideHead.toString() === fileHead.toString()
}

/**
 *XLSX返回的数据为value的数组，该方法将value数组转换为json数据
 * @param key:[] json中的可以
 * @param value: [] xlsx的返回值
 */
const sheetToJson = (key, value) => {
    if (key && value) {
        const jsonData = [];
        value && value.map(valueItem => {
            const jsonItem = {};
            key && valueItem && key.map((keyItem, index) => {
                jsonItem[keyItem] = valueItem[index];
            });
            jsonData.push(jsonItem);
        });
        return jsonData;
    } else {
        throw new Error('参数不能为空')
    }
}

/**
 * 导出xlsx文件
 * @param sheetData 需要导出的数据
 * @param sheetName 导出的sheet名字
 * @param fileName 导出的file名字
 * @constructor
 */
const XLSXExport = (sheetData, sheetName, fileName) => {
    console.log(sheetData);

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`)
}

/**
 * 导出CSV文件
 * @param sheetData 需要导出的数据
 * @param sheetName 导出的sheet名字
 * @param fileName 导出的file名字
 * @constructor
 */
const CSVExport = (sheetData, sheetName, fileName) => {
    console.log(sheetData);

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.csv`)
}

/**
 * 将json数据转为xlsx能识别的数据类型
 * @param titles
 * @param jsonTitle
 * @param data
 * @returns {Array}
 */
const jsonToSheet = (titles, jsonTitle, data) => {
    if (titles && jsonTitle && data) {
        const sheetData = [];
        sheetData.push(titles);
        data && data.map(item => {
            const sheetItem = [];
            jsonTitle && jsonTitle.map(title => {
                sheetItem.push(item[title]);
            });
            sheetData.push(sheetItem);
        });
        return sheetData;
    } else {
        throw new Error('参数不完整!')
    }
}

/**
 * 判断输入的是否为money
 * @param {} money
 */
const isMoney = (money) => {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (reg.test(money)) {
        return true
    } else {
        return false
    }
}

/**
 * 将对像转为 id:price&id:price
 */
const oilIdSplit = (oilID) => {
    let oil_id_split = '';
    if (oilID) {
        for (const key in oilID) {
            if (oilID.hasOwnProperty(key)) {
                const id = oilID[key];
                if (id) oil_id_split = oil_id_split + `${key}:${id}&`;
            }
        }
        return oil_id_split.length ? oil_id_split.slice(0, oil_id_split.length - 1) : '';
    }
    return oil_id_split;
}

/**
 * 将id:price&id:price 转为json对象
 * @param {*} oilIDStr
 */
const oilIdJson = (oilIDStr) => {
    const oilId = {};
    if (oilIDStr) {
        const arr = oilIDStr.split('&');
        for (const item of arr) {
            const objArr = item.split(':');
            oilId[objArr[0]] = objArr[1]
        }
    }

    return oilId;
}

/**
 * 将moment对象转为string 2019-09-09 00:00:00
 * @param {*} moment
 */
const formatTime = (moment, isDay) => {
    if (moment) {
        const time = new Date(moment);
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const date = time.getDate();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        return isDay ? `${year}-${add0(month)}-${add0(date)}` : `${year}-${add0(month)}-${add0(date)} ${add0(hours)}:${add0(minutes)}:${add0(seconds)}`
    }
    return null;
}

/**
 * 将string转为moment对象
 * @param {} str
 */
const stringToMoment = (str, format) => {
    return moment(str, format).isValid() ? moment(str, format) : null
}

/**
 * 对 月 日  时 分 秒  如0-9 则前面加0
 */
const add0 = (str) => {
    let newTime = "0" + str;
    return newTime.substring(newTime.length - 2, newTime.length);
}

/**
 * 获取当前时间
 */
const getCurrentDate = () => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = myDate.getMonth() + 1;
    const date = myDate.getDate();
    return `${year}-${add0(month)}-${add0(date)}`
}

/**
 * 获取当前前7天
 */
const getCurrentWeekDate = () => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = myDate.getMonth() + 1;
    const date = myDate.getDate();
    const newDate = date - 6;
    return `${year}-${add0(month)}-${newDate}`
}
/**
 * 获取当前后20天
 */
const getCurAfterDate = () => {
    const myDate = new Date();
    const dateAfter = new Date(myDate);
    dateAfter.setDate(myDate.getDate() + 20)
    const year = dateAfter.getFullYear();
    const month = dateAfter.getMonth() + 1;
    const date = dateAfter.getDate();
    return `${year}-${add0(month)}-${add0(date)}`
}

/**
 * 获取当前月的第一天
 */
const getCurrentFirstDate = () => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = myDate.getMonth() + 1;
    return `${year}-${add0(month)}-01`
}

/**
 * 两个日期间隔多少天
 * @param {} start 
 * @param {} end 
 */
const getDifferDate = (start, end) => {
    const startDay = new Date(start).getTime();
    const endDay = new Date(end).getTime();
    let day = 0;
    if (startDay === endDay) {
        day = 0;
    } else if (startDay > endDay) {
        day = (startDay - endDay) / 1000 / 60 / 60 / 24;
    } else if (endDay > startDay) {
        day = (endDay - startDay) / 1000 / 60 / 60 / 24;
    }
    return day;
}
/**
 * c车牌号j校验
 */
function isVehicleNumber(str) {
    return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
}

// 判断是否为手机号
function isPoneAvailable(pone) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}
// 判断是否为电话号码
function isTelAvailable(tel) {
    let myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!myreg.test(tel)) {
        return false;
    } else {
        return true;
    }
}

//拆分数组
function chunk(arr, size) {

    let arr2 = [];
    for (let i = 0; i < arr.length; i = i + size) {
        arr2.push(arr.slice(i, i + size));
    }
    return arr2;
}
//油站品牌tree设置
function addTreeKeyBrand(dataSource) {
    let array = [];
    array = dataSource;
    let childrenArray = [];
    for (let i = 0; i < array.length; i++) {
        let obj = {};
        obj.key = array[i].id;
        obj.title = array[i].name;
        childrenArray.push(obj);
    }
    let treeData = [];
    let treeObject = { title: "全部", key: "all", children: [] };
    treeObject.children = childrenArray;
    treeData = treeData.concat(treeObject);
    return treeData;
}

//省份tree设置
function addTreeProvence(dataSource) {
    let array = [];
    array = dataSource;
    let childrenArray = [];
    for (let i = 0; i < array.length; i++) {
        let obj = {};
        obj.key = array[i].code;
        obj.title = array[i].value;
        childrenArray.push(obj);
    }
    let treeData = [];
    let treeObject = { title: "全部", key: "all", children: [] };
    treeObject.children = childrenArray;
    treeData = treeData.concat(treeObject);
    return treeData;
}


export {
    XLSXLead,
    sheetToJson,
    XLSXExport,
    CSVExport,
    jsonToSheet,
    isMoney,
    oilIdSplit,
    oilIdJson,
    formatTime,
    stringToMoment,
    getCurrentDate,
    getCurAfterDate,
    getCurrentFirstDate,
    getDifferDate,
    isVehicleNumber,
    isPoneAvailable,
    isTelAvailable,
    getCurrentWeekDate,
    chunk,
    addTreeKeyBrand,
    addTreeProvence,
}
/*
 * @Author: sunmingmao
 * @Date: 2020-05-07 14:02:17
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-07 14:09:57
 * @Description: 时间工具类
 */

/**
 * @description: 获取当前月的第一天日期
 * @param {type} 
 * @return: 
 */
export const getCurrentMonthFirst = () => {
    const date = new Date();
    date.setDate(1);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}


/**
 * @description: 获取当天日期
 * @param {type} 
 * @return: 
 */
export const getCurrentDate = () => {
    const date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}
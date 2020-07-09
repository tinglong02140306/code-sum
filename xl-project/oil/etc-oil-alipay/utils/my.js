/*
 * @Author: longting
 * @Date: 2020-05-18 10:56:10
 * @LastEditors: longting
 * @LastEditTime: 2020-05-18 10:58:05
 * @Description: 支付宝小程序 api封装
 */ 
/**
 * [getStorage 获取本地存储]
 * @author longting
 * @DateTime 2020-05-18
 * @param    {string}           key [key值]
 * @return   {string}          [无值返回null]
 */
export const getStorage = (key) => {
    let {data: val} = my.getStorageSync({key: key});
    return val;
}
/**
 * [setStorage 设置本地存储]
 * @author longting
 * @DateTime 2020-05-18
 * @param    {string}           key [key值]
 * @param    {string}           va [value值]
 */
export const setStorage = (key, val) => {
    my.setStorageSync({
        key: key,
        data: val
    });
}

export const showLoading = (msg = "加载中···") => {
    my.showLoading({
        content: msg
    });
};

export const hideLoading = () => {
    my.hideLoading();
};

export const showToast = (msg = "加载中···", duration = 2000, icon = "none") => {
    my.showToast({
        content: msg,
        type: icon,
        duration: duration
    });
};

import baseUrl from './url.config';
import {OPENID} from '../constants/global.js';
import { showToast } from '../utils/my';
import { uuid } from '../utils/util';


/**
 * @description: post请求
 * @param url:请求地址 
 * @param params:请求参数
 * @param success:成功回调 
 * @param fail:失败回调 
 * @return null
 */
export const getHttpPost = (url, params, success, fail) => {
    let curTime = JSON.stringify(new Date().getTime());
    return my.request({
            url: baseUrl + url,
            data: params,
            headers: {
                'content-type':'application/json',  //默认值
                'Access-Control-Allow-Origin': '*',
                'TOKEN': my.getStorageSync({ key: OPENID }).data,
                'NONCE': uuid(),
                'TIMESTAMP': curTime  // 时间戳 毫秒级 13位
            },
            dataType: params.dataType || "json",
            method: 'post',
            timeout: 60000,
            success: (res) => {
                dealResponse(res, success, fail);
            },
            fail: (res) => {
                const err = {
                    msg: res.errorMessage,
                    code: 10
                }
                fail(err);
            }
        });
}

/**
 * 返回Promise
 * @param url:请求地址 
 * @param params:请求参数 
 */
export const getPostPromise = (url, params) => {
    return new Promise((resolve, reject) => {
        let curTime = JSON.stringify(new Date().getTime());
        if(my.canIUse("request")) {
            my.request({
                url: baseUrl + url,
                data: params,
                headers: {
                    'content-type':'application/json',  //默认值
                    'Access-Control-Allow-Origin': '*',
                    'TOKEN': my.getStorageSync({ key: OPENID }).data,
                    'NONCE': uuid(),
                    'TIMESTAMP': curTime  // 时间戳 毫秒级 13位
                },
                dataType: params.dataType || "json",
                method: 'post',
                timeout: 60000,
                success: (res) => {
                    dealResponse(res, resolve, reject);
                },
                fail: (res) => {
                    const err = {
                        msg: res.errorMessage,
                        code: 10
                    }
                    reject(err);
                }
            });
        } else {
            my.httpRequest({
                url: baseUrl + url,
                data: params,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    'TOKEN': my.getStorageSync({ key: OPENID }).data,
                    'NONCE': uuid(),
                    'TIMESTAMP': curTime  // 时间戳 毫秒级 13位
                },
                method: 'post',
                timeout: 60000,
				success: res => {
					dealResponse(res, resolve, reject);
				},
				fail: res => {
                    const err = {
                        msg: res.errorMessage,
                        code: 10
                    }
                    reject(err);
				}
			});
        }
    });
}

const dealResponse = (res, success, fail) => {
    if (res.status == 200) {
        if (res.data) {
            //响应成功
            if (res.data.response_code === "0000") {
                //业务处理成功
                if (res.data.result_code === "00000") {
                    success(res.data);
                } else if (res.data.result_code === "50001") { //登录过期
                    showToast("用户登录过期,请重新登录");
                    my.setStorageSync({ key: OPENID, data: '' });
                    my.setStorageSync({ key: 'avatar', data: ''});
                    my.setStorageSync({ key: 'nickName', data: ''});
                    my.switchTab({url: '/pages/home/index/index'});
                } else {
                    //业务处理失败
                    const err = {
                        msg: res.data.result_msg,
                        code: res.data.result_code
                    }
                    fail(err);
                }
            } else {
                //响应失败
                const err = {
                    msg: res.data.response_msg,
                    code: res.data.response_code
                }
                fail(err);
                setTimeout(function(){ 
                    my.hideLoading();
                },800)
            }
        } else {
            const err = {
                msg: "响应主体为空",
                code: ""
            }
            fail(err);
            setTimeout(function(){ 
                my.hideLoading();
            },800)
        }
    } else {
        const err = {
            msg: "网络连接失败",
            code: res.statusCode
        }
        fail(err);
        setTimeout(function(){ 
            my.hideLoading();
        },800)
    }
}
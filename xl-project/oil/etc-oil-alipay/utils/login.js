/*
 * @Author: sunmingmao
 * @Date: 2020-03-26 14:12:52
 * @LastEditors: longting
 * @LastEditTime: 2020-05-18 11:02:15
 * @Description: 登录逻辑处理
 */
import { loginApi } from '../http/api';
import { getPostPromise } from '../http/http';
import { CODE, OPENID } from '../constants/global';
import { showLoading, hideLoading, showToast } from './my';

/**
 * @description: 用户登录
 * @param {code} 用户登录凭证 微信端
 * @param {encrypted} 加密的用户信息
 * @param {iv} 加密算法的初始向量
 * @return: 
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        const code = my.getStorageSync({
            key: CODE
        }).data;
        const params = {}
        getPostPromise(loginApi.auth, params).then(res => {
            hideLoading();
            my.setStorageSync({
                key: OPENID,
                data: res.openid
            });
            resolve(res.openid);
            getAuthCode();
        }).catch(err => {
            getAuthCode();
            hideLoading();
            reject(`${err.msg}:${err.code}`);
        });
    });
}
// 支付宝登录 获取code
export const getAuthCode = () => {
    my.getAuthCode({
        scopes: "auth_base",
        success: res => {
            my.setStorageSync({
                key: CODE,
                data: res.authCode
            });
        },
        fail: (error) => {
            showToast("请授权小程序获取您的基本信息");
        }
    });
}
// 获取用户信息
// export const getOpenUserInfo = () => {
//     return new Promise((resolve, reject) => {
//         my.getOpenUserInfo({
//             success: res => resolve(JSON.parse(res.response).response),
//             fail: err => reject({
//                 message: "请授权小程序获取您的基本信息"
//             })
//         });
//     });
// }

export const getOpenUserInfo = () => {
    return new Promise((resolve, reject) => {
        my.getPhoneNumber({
            success: res => {
                resolve(JSON.parse(res.response).response)
                my.alert({
                    content: 'longting111'+ JSON.stringify(res)
                })
            },
            fail: err => reject({
                message: "请授权小程序获取您的基本信息"
            })
        });
    });
}
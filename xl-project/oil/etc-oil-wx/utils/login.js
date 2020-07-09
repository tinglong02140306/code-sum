/*
 * @Author: sunmingmao
 * @Date: 2020-03-26 14:12:52
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-27 09:03:13
 * @Description: 
 */
import {loginApi} from '../http/api';
import {getPostPromise} from '../http/http';
import {CODE, OPENID} from '../constants/global';

/**
 * @description: 用户登录
 * @param {code} 用户登录凭证 微信端
 * @param {encrypted} 加密的用户信息
 * @param {iv} 加密算法的初始向量
 * @return: 
 */
export const login = (encrypted, iv) => {
    return new Promise((resolve, reject)=>{
        const code = wx.getStorageSync(CODE);
        const params = {
            js_code:code,
            encrypted_data:encrypted,
            iv:iv
        }
        getPostPromise(loginApi.auth,params).then(res=>{
            wx.hideLoading();
            wx.setStorageSync(OPENID,res.openid);
            resolve(res.openid);
            login_wx();
        }).catch(err=>{
            login_wx();
            wx.hideLoading();
            reject(`${err.msg}:${err.code}`);
        });
    });
}

//微信登录 获取code
export const login_wx = () => {
    wx.login({
        success:res=> {
          console.log("code:"+res.code);
          wx.setStorageSync(CODE,res.code);
        },
        fail:err=>{
            wx.showToast({title:"code获取失败,请重新启动小程序",icon:"none"});
        }
    });
}


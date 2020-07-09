import Taro from '@tarojs/taro'
import {BASE_URL} from '../base/url'

const ACTION_MIDDLEWARE_HTTP = 'ACTION_MIDDLEWARE_HTTP' 

export const createAction = payload => {
    return {
        type:'ACTION_MIDDLEWARE_HTTP',
        payload:payload
    }
}

/**
 * 中间件
 * @param {} store 
 */
export const httpMiddleware =  store => next => action => {

    if(action.type !== ACTION_MIDDLEWARE_HTTP){
        return next(action)
    }
    const {url, method='POST',  params={}, success, fail} = action.payload

    return httpRequest(BASE_URL, url, params, method, success, fail)
}
 
/**
 * 网络请求
 * @param {*} base 
 * @param {*} url 
 * @param {*} params 
 * @param {*} method 
 * @param {*} success 
 * @param {*} fail 
 */
export const httpRequest = (base, url, params={}, method='POST', success, fail) => {
    console.log(params)
    return Taro.request({
        url:`${base}${url}`,
        data:params,
        method:method,
        header: {
            'Content-Type': 'application/json'
        },
    }).then(res=>{
        console.log(res)
        dealResponse(res,success,fail)
    }).catch(res=>{
        console.log(res)
        dealResponse(res,success,fail)
    });
}
    
const dealResponse = (response,success,fail) => {
    let errMsg = "";
    if(response){
        if (response.statusCode==200) {
            if(response.data){
                if (response.data.response_code === "0000") { //响应成功
                    if (response.data.result_code === "50001") { //登录过期
                        Taro.showToast({title: '登录过期',icon: 'none'})
                    } else if (response.data.result_code === "00000") { //业务处理成功
                        success(response.data);
                    } else { //业务处理失败
                        errMsg = response.data.result_msg;
                        fail(errMsg,response.data.result_code);
                    }
                } else { //响应失败
                    errMsg = response.data.response_msg;
                    fail(errMsg);
                }
            }else{
                errMsg="响应数据错误";
                fail(errMsg);
            }
        } else {
             errMsg = "网络连接失败,错误码:" + response.statusCode;
            fail(errMsg);
        }
    }else{
        errMsg = "无响应";
        fail(errMsg);
    }
}
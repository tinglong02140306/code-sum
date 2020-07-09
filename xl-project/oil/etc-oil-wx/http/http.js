import baseUrl from './url.config';
import {OPENID} from '../constants/global';

/**
 * @description: post请求
 * @param url:请求地址 
 * @param params:请求参数
 * @param success:成功回调 
 * @param fail:失败回调 
 * @return null
 */
export const getHttpPost = (url,params,success,fail) =>{
	console.log(baseUrl+url);
    return wx.request({
        url: baseUrl + url,
        data: params,
        header: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'token': wx.getStorageSync(OPENID)
        },
		method: 'POST',
		timeout:60000,
        success: (res) => {
			console.log(params);
			console.log(res);
            dealResponse(res,success,fail);
        },
        fail: (res) => {
			console.log(res);
            const err = {
				msg:res.errMsg,
				code:10
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
export const getPostPromise = (url,params) =>{
	console.log(baseUrl+url);
	return new Promise((resolve, reject)=> {
		wx.request({
			url: baseUrl + url,
			data: params,
			header: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
				'token': wx.getStorageSync(OPENID)
			},
			method: 'POST',
			timeout:60000,
			success: (res) => {
				console.log(params);
				console.log(res);
				dealResponse(res,resolve,reject);
			},
			fail: (res) => {
				console.log(res);
				const err = {
					msg:res.errMsg,
					code:10
				}
				reject(err);
			}
		});
    });
}

const dealResponse = (res,success,fail) => {
	if (res.statusCode==200) {
		if(res.data){
			//响应成功
			if (res.data.response_code === "0000") { 
				//业务处理成功
				if (res.data.result_code === "00000") { 
					success(res.data);
				}else if(res.data.result_code === "50001"){//登录过期
					wx.showToast({title:"用户登录过期,请重新登录",icon:"none"});
					wx.setStorageSync(OPENID,"");
					wx.switchTab({url: '/pages/home/index/index'});
				}else{
					//业务处理失败
					const err = {
						msg:res.data.result_msg,
						code:res.data.result_code
					}
					fail(err);
				}
			}else{
				//响应失败
				const err = {
					msg:res.data.response_msg,
					code:res.data.response_code
				}
				fail(err);
			}
		}else{
			const err = {
				msg:"响应主体为空",
				code:""
			}
			fail(err);
		}
	}else{
		const err = {
			msg:"网络连接失败",
			code:res.statusCode
		}
		fail(err);
	}
}
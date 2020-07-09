import axios from 'axios';
import HomeStore from "../store/home/home";
import baseUrl from '../url.config';

axios.defaults.baseURL = baseUrl;

const formatData = (res,success,fail)=>{
    console.log(res);
    if (res.status===200){// HTTP 状态码
        const data = res.data;
        if (data){
            if (data.response_code==='0000'){
                if (data.result_code==='00000'){
                    HomeStore.setIsTokenOut(false);
                    success(data);
                } else {
                    data.result_code==='50001'&&HomeStore.setIsTokenOut(true);
                    fail(`${data.result_msg}`,`${data.result_code}`);
                }
            } else {
                fail(`${data.response_msg}`);
            }
        } else {
            fail(`服务器返回数据失败`);
        }
    } else {
        fail(`连接失败,错误码:${res.status}`);
    }
}

export default {
    baseUrl:baseUrl,
    post:(url,data,success,fail) =>{
        // console.log(data)
        axios({
            url:url,
            data:data,
            method: 'post',
            timeout: url ==='/website/stat/consume-flow-download'?180000:60000,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res=>{
            formatData(res,success,fail)
        }).catch(()=>{
            fail(`网络请求失败`);
        })
    },
    postFile:(url,data,success,fail)=>{
        // console.log(data)
        axios.create({withCredentials: true})({
            method: 'post',
            url,
            baseURL: baseUrl,
            data: data,
            timeout: 60000,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res=> {
            formatData(res,success,fail)
        }
        ).catch(()=>{
            fail(`网络请求失败`);
        });
    },
    get:(url,success,fail)=>{
        axios({
            url:url,
            method: 'get',
            timeout: 60000,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res=>{
            formatData(res,success,fail)
        }).catch(()=>{
            fail(`网络请求失败`);
        })
    },
    postBaseUrl(baseUrl, url, data) {
        return  axios.create({withCredentials: true})({
            method: 'post',
            url,
            baseURL: baseUrl,
            data: data,
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            },
        }).then(
            (response) => {
                return response.data
            }
        );
    }
}
import unit from '../api/index'
// 配置文件
import urlConfig from '@/api/url.config'
// api
const api = {
    /**
     * 行政区划
     * @param  {Object} params 参数对象
     * @return {Object}        结果集
     */
    xzqh(url, APPLY_ID, params, success, fail) {
        let param = {
            lxjp: 'xzqh',
        };
        param = Object.assign({}, param, params);
        let obj = {
            'a': APPLY_ID,
            'm': 'f6d1b1dd59244f3aa0219092bd328f53',
            'p': JSON.stringify(param)
        };
        const res = unit.ajaxMerPost(url, obj, success, fail)
    },
    /**
     * 是否登录、获取用户信息
     * bengbu-字典项
     * @param  {Object} params 参数对象
     * @return {Object}        结果集
     */
    async bengBuDictList(params) {
        let param = {
                lxjp: 'xzqh',
            },
            obj = Object.assign({}, param, params)
        const res = await unit.ajaxPost(urlConfig.bengbu_wzcx, $qs.stringify(obj))
        return res.data
    },
    /**
     * 是否登录
     * @param  {Object} params 参数对象
     * @return {Object}        结果集
     */
    isLogin(url, APPLY_ID, params, success, fail) {
        let param = {
            xzqh: '340000000000',
        };
        param = Object.assign({}, param, params);
        let obj = {
            'a': APPLY_ID,
            'm': '91209183f2714e7e8769f2e9ed15a72e',
            'p': JSON.stringify(param)
        };
        const res = unit.ajaxMerPost(url, obj, success, fail)
    },
}

export default api
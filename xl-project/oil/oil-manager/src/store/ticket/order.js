/*
 * @Author: sunmingmao
 * @Date: 2020-05-12 13:37:20
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-14 10:09:06
 * @Description: 券包订单
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";

class TickerBagOrderStore {

    //分页
    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    //Table加载状态
    @observable loading = false;
    @action setLoading(isShow) {
        this.loading = isShow;
    }

    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/coupon/package/order/query', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.list = data;
            let pagination = {
                total: res.amount,
                pageSize: params.page_size,
                current: params.page_num,
                showQuickJumper: true,
                showTotal: () => `总共 ${res.amount} 条数据`
            };
            this.setPagination(pagination);
        }, err => {
            this.loading = false;
            message.error(err);
        });
    }

    //Table加载状态
    @observable loadingExport = false;
    @action setLoadingExport(isShow) {
        this.loadingExport = isShow;
    }

    //下载loading
    @observable loadingDownLoad = false;
    @action setLoadingDownLoad(loadingDownLoad) {
        this.loadingDownLoad = loadingDownLoad;
    }

    //导出订单
    @action exportOrder(params, callback) {
        this.loadingExport = true;
        http.post('/website/coupon/package/order/export', params, res => {
            this.export_file_name = res.file_name;
            const washOrder = {
                file_name: res.file_name,
                time: new Date().getTime()
            }
            localStorage.setItem("TICKER_BAG_ORDER", JSON.stringify(washOrder))
            callback();
        }, err => {
            this.loadingExport = false;
            message.error(err);
        });
    }

    //下载订单
    @action downloadOrder(file_name, callback) {
        const params = {
            file_name: file_name
        };
        this.loadingDownLoad = true;
        http.post('/website/coupon/package/order/download', params, res => {
            this.loadingDownLoad = false;
            callback(res.file_url);
        }, err => {
            this.loadingDownLoad = false;
            message.error(err);
        });
    }

    //查询券包
    @observable act_list = [];
    @action queryBag() {
        http.post('/website/coupon/package/query', null, res => {
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.act_list = data;
        }, err => {
            console.log(err);
        });
    }

}

export default TickerBagOrderStore;
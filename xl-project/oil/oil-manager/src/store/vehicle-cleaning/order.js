/*
 * @Author: sunmingmao
 * @Date: 2020-04-27 08:57:13
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-19 14:53:48
 * @Description: 
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";

class VehicleOrderStore {

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

    //导出loading
    @observable loadingExport = false;
    @action setLoadingExport(loadingExport) {
        this.loadingExport = loadingExport;
    }

    //下载loading
    @observable loadingDownLoad = false;
    @action setLoadingDownLoad(loadingDownLoad) {
        this.loadingDownLoad = loadingDownLoad;
    }

    //退款
    @action orderRefund(order_no, callback) {
        const params = {
            order_no: order_no
        };
        http.post('/website/wash/order-refund', params, res => {
            message.info("退款成功");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //导出订单
    @observable export_file_name = "";
    @action exportOrder(params, callback) {
        this.loadingExport = true;
        http.post('/website/wash/export-order', params, res => {
            this.loadingExport = false;
            this.export_file_name = res.file_name;
            const washOrder = {
                file_name: res.file_name,
                time: new Date().getTime()
            }
            localStorage.setItem("WASH_ORDER", JSON.stringify(washOrder))
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
        http.post('/website/wash/download-order', params, res => {
            this.loadingDownLoad = false;
            callback(res.file_url);
        }, err => {
            this.loadingDownLoad = false;
            message.error(err);
        });
    }

    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/wash/query-order', params, res => {
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
}

export default VehicleOrderStore;
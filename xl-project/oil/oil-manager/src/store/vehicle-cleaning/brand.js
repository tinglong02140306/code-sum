/*
 * @Author: sunmingmao
 * @Date: 2020-04-26 14:40:49
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-19 10:14:00
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

class VehicleBrandStore {

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

    //modal中 提交状态
    @observable modalLoading = false;
    @action setModalLoading(isShow) {
        this.modalLoading = isShow;
    }

    //新增
    @action add(values, callback) {
        this.modalLoading = true;
        let formData = new FormData();
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key] !== undefined ? values[key] : null);
            }
        }
        http.postFile("/website/wash/add-washer-brand", formData, res => {
            message.info("品牌添加成功");
            this.modalLoading = false;
            callback();
        }, err => {
            this.modalLoading = false;
            message.error(err);
            callback();
        });
    }

    //删除
    @action delete(id, callback) {
        const params = {
            id: id
        }
        http.post('/website/wash/remove-washer-brand', params, res => {
            message.info("品牌删除成功");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //修改
    @action update(values, callback) {
        this.modalLoading = true;
        let formData = new FormData();
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key] !== undefined ? values[key] : null);
            }
        }
        http.postFile('/website/wash/update-washer-brand', formData, res => {
            this.modalLoading = false;
            message.info("品牌修改成功");
            callback();
        }, err => {
            this.modalLoading = false;
            message.error(err);
            callback();
        });
    }

    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/wash/query-washer-brand', params, res => {
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

export default VehicleBrandStore;
/*
 * @Author: sunmingmao
 * @Date: 2020-04-27 08:57:06
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-19 10:14:14
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

class VehicleInfoStore {


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

    //同步洗车机
    @action syncWasher(callback) {
        this.loading = true;
        http.post('/website/wash/sync-washer', null, res => {
            callback();
            this.loading = false;
            message.info("洗车机同步成功");
        }, err => {
            this.loading = false;
            message.error(err);
        });
    }

    @action add(values, callback) {
        this.modalLoading = true;
        let formData = new FormData();
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key] !== undefined ? values[key] : null);
            }
        }
        http.postFile('/website/wash/add-washer', formData, res => {
            this.modalLoading = false;
            message.info("新增成功");
            callback();
        }, err => {
            this.modalLoading = false;
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
        http.postFile('/website/wash/update-washer', formData, res => {
            this.modalLoading = false;
            message.info("修改成功");
            callback();
        }, err => {
            this.modalLoading = false;
            message.error(err);
        });
    }

    //生成二维码
    @action generateWasherQrcode(id, callback) {
        this.loading = true;
        const params = {
            id: id
        };
        http.post('/website/wash/generate-qr', params, res => {
            callback();
        }, err => {
            message.error(err);
        });
    }

    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/wash/query-washer', params, res => {
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

    //列表
    @observable brandList = [];
    @action queryBrand() {
        const params = {
            page_num: 1,
            page_size: 0
        }
        http.post('/website/wash/query-washer-brand', params, res => {
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.brandList = data;
        }, err => {
            console.log(err);
        });
    }
}

export default VehicleInfoStore;
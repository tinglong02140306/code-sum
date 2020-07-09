/*
 * @Author: sunmingmao
 * @Date: 2020-04-15 14:19:48
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-17 09:44:19
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

class StaticStore {

    //分页
    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable loading = false;
    @action setLoading(isShow) {
        this.loading = isShow;
    }

    //添加静态资源loading
    @observable addLoading = false;
    @action setAddLoading(isShow) {
        this.addLoading = isShow;
    }

    //添加静态资源
    @action addStatic(values, callback) {
        console.log(JSON.stringify(values))
        this.addLoading = true;
        let formData = new FormData();
        formData.append('resourceName', values.resourceName);
        formData.append('resourceType', values.resourceType.valueOf());
        if (values.resourceUrl){
            formData.append('resourceUrl', values.resourceUrl);
        }
        if (values.file){
            formData.append('file', values.file);
        }
        http.postFile("/website/resource/add-static-resource", formData, res => {
            this.addLoading = false;
            callback(true);
        }, err => {
            this.addLoading = false;
            message.error(err);
            callback(false);
        });
    }

    @action deleteStatic(id, callback) {
        const params = {
            id: id
        }
        http.post('/website/resource/remove-static-resource', params, res => {
            message.info("文件删除成功");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //推广码列表
    @observable staticList = [];
    @action queryStatic(page_num, page_size, resource_name) {
        this.loading = true;
        const params = {
            page_num: page_num,
            page_size: page_size,
            resource_name: resource_name || null,
        }
        http.post('/website/resource/query-static-resource', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.staticList = data;
            let pagination = {
                total: res.amount,
                pageSize: page_size,
                current: page_num,
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

export default StaticStore;
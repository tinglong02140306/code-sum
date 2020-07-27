/*
 * @Author: sunmingmao
 * @Date: 2020-05-10 10:15:02
 * @LastEditTime: 2020-05-14 09:50:48
 * @LastEditors: sunmingmao
 * @Description: 
 * @FilePath: /oil-manager/src/store/ticket/bag.js
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";

class TickerBagStore {

    //修改的优惠券实体
    @observable record = {};
    @action setRecord(record) {
        this.record = record;
    }

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

    //查询活动（券包）
    @observable act_list = [];
    @action queryAct(callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/query-package-act', null, res => {
            setTimeout(() => {
                this.loadingAdd = false;
            })

            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.act_list = data;
            callback && callback();
        }, err => {
            this.loadingAdd = false;
            console.log(err);
        });
    }

    //增加洗车券包 加载状态
    @observable loadingAdd = false;
    @action setLoadingAdd(isShow) {
        this.loadingAdd = isShow;
    }

    //增加洗车券包
    @action addBag(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/package/add', params, res => {
            this.loadingAdd = false;
            message.info("洗车券包添加成功");
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //更新洗车券包
    @action updateBag(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/package/update', params, res => {
            this.loadingAdd = false;
            message.info("洗车券包更新成功");
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }
    // 上下架券包
    @action offOnSelfBag(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/package/update-coupon-package-status', params, res => {
            this.loadingAdd = false;
            message.info("洗车券包更新成功");
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //删除洗车券包
    @action deleteBag(id, callback) {
        const params = {
            id: id
        }
        http.post('/website/coupon/package/remove', params, res => {
            message.info("洗车券包删除成功");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/coupon/package/query', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                item.instruction = item.instruction.replace("<BR>", "\n");
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

export default TickerBagStore;
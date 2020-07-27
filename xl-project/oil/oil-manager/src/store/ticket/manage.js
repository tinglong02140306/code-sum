/*
 * @Author: sunmingmao
 * @Date: 2020-05-08 14:28:03
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-13 15:45:19
 * @Description: 优惠券管理
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";

class TickerManageStore {

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

    // drawer分页
    @observable detailPagination = {};
    @action setDetailPagination(detailPagination) {
        this.detailPagination = detailPagination;
    }

    //Table加载状态
    @observable loading = false;
    @action setLoading(isShow) {
        this.loading = isShow;
    }

    //修改优惠券状态
    @action changeStatus(id, target_status, callback) {
        const params = {
            id: id,
            target_status: target_status
        }
        http.post('/website/coupon/change-coupon-status', params, res => {
            message.info("优惠券状态已修改成功");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //增加优惠券 加载状态
    @observable loadingAdd = false;
    @action setLoadingAdd(isShow) {
        this.loadingAdd = isShow;
    }

    //增加优惠券
    @action addCoupon(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/add-coupon', params, res => {
            message.info("优惠券添加成功");
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //修改优惠券
    @action updateCoupon(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/update-coupon', params, res => {
            message.info("优惠券修改成功");
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }
    // 撤销优惠券
    @action revokeCoupon(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/update-coupon', params, res => {
            message.info("优惠券撤销成功");
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }



    //列表
    @observable list = [];
    @action query(params) {
        this.loading = true;
        http.post('/website/coupon/query-coupon', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                item.coupon_desc = item.coupon_desc.replace("<BR>", "\n");
                item.ponits = item.station_data && item.station_data.map(i => {
                    const obj = {};
                    obj.title = Object.keys(i)[0];
                    obj.key = i[obj.title];
                    return obj;
                });
                return item
            })
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


    // drawer明细列表
    @observable detailList = [];
    @action detailQuery(params) {
        this.loading = true;
        http.post('/website/coupon/query-push', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map((item, index) => {
                item.key = index;
                return item
            })
            this.detailList = data;
            let pagination = {
                total: res.amount,
                pageSize: params.page_size,
                current: params.page_num,
                showQuickJumper: true,
                showTotal: () => `总共 ${res.amount} 条数据`
            };
            this.setDetailPagination(pagination);
        }, err => {
            this.loading = false;
            message.error(err);
        });
    }

}

export default TickerManageStore;
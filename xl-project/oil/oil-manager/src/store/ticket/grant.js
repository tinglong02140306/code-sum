/*
 * @Author: sunmingmao
 * @Date: 2020-05-10 10:05:23
 * @LastEditTime: 2020-05-21 11:26:41
 * @LastEditors: sunmingmao
 * @Description: 
 * @FilePath: /oil-manager/src/store/ticket/grant.js
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";

class TickerGrantStore {

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


    //创建发放活动 加载状态
    @observable loadingAdd = false;
    @action setLoadingAdd(isShow) {
        this.loadingAdd = isShow;
    }

    //修改优惠券发放状态
    @action changeStatus(id, target_status, callback) {
        const params = {
            id: id,
            target_status: target_status
        }
        http.post('/website/coupon/change-act-status', params, res => {
            message.info("优惠券发放状态已修改");
            callback();
        }, err => {
            message.error(err);
        });
    }

    //修改
    @action update(params, callback) {
        this.loadingAdd = true;
        http.post('/website/coupon/update-act', params, res => {
            message.info("活动修改成功");
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
        http.post('/website/coupon/query-act', params, res => {
            this.loading = false;
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
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

    //查询优惠券
    @observable coupons = [];
    @action getCoupons() {
        const params = {
            page_num: 1,
            page_size: 0
        }
        http.post('/website/coupon/query-coupon', params, res => {
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                return item;
            });
            this.coupons = data;
        }, err => {
            message.error(err);
        });
    }

    //生成券码
    @observable pushCdkey(params, callback) {
        const values = {
            act_name: params.act_name,
            coupon_id: params.coupon_id,
            coupon_count: params.coupon_count
        }
        this.loadingAdd = true;
        http.post('/website/coupon/push-cdkey', values, res => {
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //下载券码
    @observable downloadCdkey(id, callback) {
        const params = {
            id: id
        }
        http.post('/website/coupon/download-cdkey', params, res => {
            callback(res.file_url);
        }, err => {
            message.error(err);
        });
    }

    //指定发放
    @observable pushAim(params, callback) {
        const values = {
            act_name: params.act_name,
            coupon_id: params.coupon_id,
            push_count: params.push_count,
            mobile_array: params.mobile_array,
        }
        this.loadingAdd = true;
        http.post('/website/coupon/push-aim', values, res => {
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //指定发放 批量
    @observable pushAimBatch(params, callback) {
        const values = {
            actName: params.act_name,
            couponId: params.coupon_id,
            pushCount: params.push_count,
            file: params.file,
        }
        let formData = new FormData();
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key] !== undefined ? values[key] : null);
            }
        }
        this.loadingAdd = true;
        http.postFile('/website/coupon/push-aim-batch', formData, res => {
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //消费发放
    @observable pushConsume(params, callback) {
        const values = {
            act_name: params.act_name,
            station_type: params.station_type,
            station_array: params.station_array,
            oil_type: params.oil_type,
            start_date: params.start_date,
            end_date: params.end_date,
            limit_dates: params.limit_dates,
        }
        console.log('params:', JSON.stringify(params));
        this.loadingAdd = true;
        http.post('/website/coupon/push-consume', values, res => {
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //系统发放
    @observable pushSystem(params, callback) {
        const values = {
            act_name: params.act_name,
            coupon_id: params.coupon_id,
            coupon_count: params.coupon_count,
            limit_cnt: params.limit_cnt
        }
        this.loadingAdd = true;
        http.post('/website/coupon/push-sys', values, res => {
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }
}

export default TickerGrantStore;
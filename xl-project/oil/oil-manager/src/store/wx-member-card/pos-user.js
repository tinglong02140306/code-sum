import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {formatData} from "../../utils/formatDate";
import {message} from "antd";
import {trim} from "../../utils/trim";
class PosUserStore {


    @observable isShowLoading = false;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }
    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable dataList = [];//小票用户查询
    @action getPosUserList(terminal_id,consume_date,serial_num) {
        const params = {
            consume_date: isEmpty(consume_date) ? null : formatData(consume_date),
            terminal_id: isEmpty(terminal_id)?null:trim(terminal_id),
            serial_num: isEmpty(serial_num)?null:trim(serial_num),

        };
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }

        http.post('/website/wechat-membercard/pos-user-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = 20;
            pagination.hideOnSinglePage = true;
            pagination.showQuickJumper = true;
            response.data&&response.data.map((item,index)=>{item.key=index});
            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }



}

export default PosUserStore;
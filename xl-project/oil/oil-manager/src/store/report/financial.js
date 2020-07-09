import {observable, action} from 'mobx';
import {isEmpty} from '../../utils/isEmpty';
import http from "../../http/http";
import {formatData} from "../../utils/formatDate";
import {message} from "antd";

class Financial {

    @observable isShowLoading = false;

    @action setIsShowFinancialLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable financialList = [];
    @action getFinancialList(account_date, page_size) {
        this.setIsShowFinancialLoading(true);
        const reqData = {
            bill_date: isEmpty(account_date) ? null : formatData(account_date)
        };
        http.post("/website/stat/get-account-check-list",reqData,response=>{
            this.setIsShowFinancialLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.showQuickJumper = true;
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{item.key=index})
            this.financialList = response.data
        },err=>{
            message.error(err);
            this.setIsShowFinancialLoading(false);
        });
    }
}

export default Financial;
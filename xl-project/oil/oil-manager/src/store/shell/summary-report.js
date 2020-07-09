import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {formatData} from "../../utils/formatDate";
import {message} from "antd";
class SummaryReportStore {


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


    @observable isShowExportLoading = false;

    @observable setIsShowExportLoading(isShowExportSomeLoading) {
        this.isShowExportLoading = isShowExportSomeLoading;
    }

    @observable dataList = [];//壳牌销售汇总报表
    @action getConsumeSumList(page_num, page_size, start_date, end_date) {
        this.pageSize = page_size;
        const params = {
            page_num: page_num,
            page_size: page_size,
            start_date: isEmpty(start_date) ? null : formatData(start_date),
            end_date: isEmpty(end_date) ? null : formatData(end_date),

        };
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }

        http.post('/website/shell/consume-sum-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{item.key=index});
            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }



}

export default SummaryReportStore;
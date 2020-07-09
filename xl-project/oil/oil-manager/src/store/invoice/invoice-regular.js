import http from '../../http/http';
import {isEmpty} from "../../utils/isEmpty";
import {observable, action} from 'mobx';
import {message} from 'antd';
import {formatData} from "../../utils/formatDate";

class InvoiceRegularStore {

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

    @observable page_num = 0;
    @action setPageNum(page_num) {
        this.page_num = page_num;
    }

    @observable params = null;
    @action setParams(params){
        this.params = params;
    }

    @observable isShowResult = false;
    @action setIsShowResult(isShowResult) {
        this.isShowResult = isShowResult;
    }

    @observable apply_url = '';

    //列表查询
    @observable dataList = [];
    @action getInvoiceQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/invoice/invoice-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = params.page_size;
            pagination.current = params.page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //发票冲红
    @action invoiceWriteOff(order_no) {
        this.setIsShowLoading(true);
        http.post('/website/invoice/invoice-write-off',{order_no:order_no},response=>{
            this.setIsShowLoading(false);
            message.info('冲红成功');
            this.apply_url = response.apply_url;
            this.setIsShowResult(true);
        },err=>{
            this.setIsShowLoading(false);
            message.error(err);
        });
    }
}

export default InvoiceRegularStore;
import {observable, action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';
import {isEmpty} from "../../utils/isEmpty";
import {formatData} from "../../utils/formatDate";

class ShellPriceStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading =isShowLoading;
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    @observable pageSize = 10;
    @action setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    @observable priceList = null;
    @action getPriceList(page_num,page_size,start_date,end_date){
        this.setIsShowLoading(true);
        const params = {
            page_num:page_num,
            page_size:page_size,
            start_date: isEmpty(start_date) ? null : formatData(start_date),
            end_date: isEmpty(end_date) ? null : formatData(end_date),

        }
        http.post('/website/shell/oil-price-file-update-failed-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.pageSize;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.priceList = response.data;
        },err=>{
            this.setIsShowLoading(false);
            message.error(err);
        });  
    }


}

export default ShellPriceStore; 

import {observable,action} from 'mobx';
import {isEmpty} from '../../utils/isEmpty';
import http from "../../http/http";
import {formatData} from "../../utils/formatDate";
import {message} from 'antd';
class ReportStore {

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable isShowTableLoading=false;
    @action setIsShowTableLoading(isShowTableLoading){
        this.isShowTableLoading = isShowTableLoading;
    }

    @observable reportObject ={};
    @action setReportObject(reportObject){
        this.reportObject = reportObject;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable reportList=[];
    @action getReportList(page_num,page_size,start_date,end_date,terminal_id,bill_status){
        this.setIsShowTableLoading(true);
        const  reqData = {
            page_num:page_num,
            page_size:page_size,
            start_date:isEmpty(start_date)?null:formatData(start_date),
            end_date:isEmpty(end_date)?null:formatData(end_date),
            terminal_id:isEmpty(terminal_id)?null:terminal_id,
            bill_status:isEmpty(bill_status)?null:bill_status,
        };

        http.post('/website/shell/consume-record-query',reqData,response=>{
            this.setIsShowTableLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize =page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.id});
            this.reportList=response.data;
        },err=>{
            message.error(err);
            this.setIsShowTableLoading(false);
        });
    }
}

export default ReportStore;
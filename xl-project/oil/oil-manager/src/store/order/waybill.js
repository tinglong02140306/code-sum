import {observable,action} from 'mobx';
import {isEmpty} from '../../utils/isEmpty';
import http from "../../http/http";
import {formatData} from "../../utils/formatDate";
import {message} from 'antd';

class WaybillStore {

    @observable isShowWaybillDialog= false;
    @action setIsShowWaybillDialog(isShowWaybillDialog){
        this.isShowWaybillDialog = isShowWaybillDialog;
    }

    @observable isShowWaybillLoading=false;
    @action setIsShowWaybillLoading(isShowWaybillLoading){
        this.isShowWaybillLoading = isShowWaybillLoading;
    }

    @observable waybillObject ={};
    @action setOrderWaybillObject(waybillObject){
        this.waybillObject = waybillObject;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable waybillList=[];
    @action getWaybillList(page_num,page_size,start_date,end_date,org_id,
                         user_id,out_user_id,bill_no){
        this.setIsShowWaybillLoading(true);
        const  reqData = {
            page_num:page_num,
            page_size:page_size,
            start_date:isEmpty(start_date)?null:formatData(start_date),
            end_date:isEmpty(end_date)?null:formatData(end_date),
            user_id:isEmpty(user_id)?null:user_id,
            out_user_id:isEmpty(out_user_id)?null:out_user_id,
            org_id:isEmpty(org_id)?null:org_id,
            bill_no:isEmpty(bill_no)?null:bill_no,

        };

        console.log('/website/stat/waybill-query');
        http.post('/website/stat/waybill-query',reqData,response=>{
            this.setIsShowWaybillLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize =page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.bill_no});
            this.waybillList=response.data;
        },err=>{
            message.error(err);
            this.setIsShowWaybillLoading(false);
        });
    }
}

export default WaybillStore;
import {observable, action} from 'mobx';
import http from "../../http/http";
import {trim} from "../../utils/trim";
import {isEmpty} from "../../utils/isEmpty";
import {formatData} from "../../utils/formatDate";
import {message} from 'antd';
class ChildrenStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable isShowDialog = false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }
    @observable isShowOrderDialog = false;
    @action setIsShowOrderDialog(isShowOrderDialog){
        this.isShowOrderDialog = isShowOrderDialog;
    }

    @observable childrenOrderItem = {};
    @action setChildrenOrderItem(childrenOrderItem) {
        this.childrenOrderItem = childrenOrderItem;
    }

    @observable childrenItem = {};
    @action setChildrenItem(childrenItem) {
        this.childrenItem = childrenItem;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable childrenList=[];
    @observable orderList=[];
    @action getChildrenList(page_num,page_size,start_date,end_date,partner_id,
                            org_id,sub_order_no,sub_card_id,out_user_id,out_sub_order_no){
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
            start_date:isEmpty(start_date)?null:formatData(start_date),
            end_date:isEmpty(end_date)?null:formatData(end_date),
            partner_id: isEmpty(partner_id)?null:partner_id,
            org_id: isEmpty(org_id)?null:trim(org_id),
            // user_id: isEmpty(user_id)?null:trim(user_id),
            sub_order_no: isEmpty(sub_order_no)?null:sub_order_no,
            sub_card_id: isEmpty(sub_card_id)?null:trim(sub_card_id),
            out_user_id: isEmpty(out_user_id)?null:out_user_id,
            out_sub_order_no: isEmpty(out_sub_order_no)?null:out_sub_order_no
        };
        this.setIsShowLoading(true);
        http.post('/website/stat/consume-sub-flow-query',reqData,response=>{
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key = item.sub_order_no});
            this.childrenList=response.data;
            this.setIsShowLoading(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }
}

export default ChildrenStore;
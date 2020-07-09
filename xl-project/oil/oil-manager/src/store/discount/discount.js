import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
import {formatData} from "../../utils/formatDate";
class discountStore {
    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable discountObject ={};
    @action setDiscountObject(discountObject){
        this.discountObject = discountObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }

    @observable image_url = "";
    @action setImageUrl(image_url) {
        this.image_url = image_url;
        this.setIsCanPreview(true);
    }
    @observable isCanPreview = false;
    @action setIsCanPreview(isCanPreview) {
        this.isCanPreview = isCanPreview;
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

    //列表查询
    @observable discountDataList = [];
    @action getDiscountQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/discount/discount_query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = this.page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });

            this.discountDataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //增加
    @action AddDiscount(name,discount_rate,amount,investor) {
        this.setIsShowSubmitLoading(true);
        const params = {
            name:isEmpty(name)?null:name,
            discount_rate:isEmpty(discount_rate)?null:discount_rate,
            amount:isEmpty(amount)?null:amount,
            // investor:isEmpty(investor)?null:investor,
        };
        http.post('/website/discount/discount_add',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getDiscountQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //修改
    @action updateDiscount(id,name,discount_rate,amount,investor) {
        this.setIsShowSubmitLoading(true);
        const params = {
            // start_date:isEmpty(start_date)?null:formatData(start_date),
            id:isEmpty(id)?null:id,
            name:isEmpty(name)?'':name,
            discount_rate:isEmpty(discount_rate)?'':discount_rate,
            amount:isEmpty(amount)?'':amount,
            // investor:isEmpty(investor)?'':investor,
        };
        http.post('/website/discount/discount_update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getDiscountQuery(this.params);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteDiscount(id){
        this.setIsShowLoading(true);
        http.post('/website/discount/discount_delete',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getDiscountQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

    //状态变更
    @action statusChange(id,target_flag){
        this.setIsShowLoading(true);
        http.post('/website/discount/discount_status_change',{id:id,target_flag:target_flag},response=>{
            this.setIsShowLoading(false);
            message.info("操作成功");
            this.getDiscountQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

}

export default discountStore;
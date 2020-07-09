import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
import {formatData} from "../../utils/formatDate";
class CompanyStore {


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

    @observable companyObject ={};
    @action setCompanyObject(companyObject){
        this.companyObject = companyObject;
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
    @observable dataList = [];
    @action getCompanyQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/gasstation/company-query',params,response=>{
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

            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //增加
    @action AddCompany(name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key) {
        this.setIsShowSubmitLoading(true);
        const params = {
            name:isEmpty(name)?null:name,
            address:isEmpty(address)?null:address,
            contact_person:isEmpty(contact_person)?null:contact_person,
            contact_phone:isEmpty(contact_phone)?null:contact_phone,
            xl_merchant_id:isEmpty(xl_merchant_id)?null:xl_merchant_id,
            app_id:isEmpty(app_id)?'':app_id,
            secret_key:isEmpty(secret_key)?'':secret_key,
        };
        http.post('/website/gasstation/company-add',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getCompanyQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //修改
    @action updateCompany(id,name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key) {
        this.setIsShowSubmitLoading(true);
        const params = {
            // start_date:isEmpty(start_date)?null:formatData(start_date),
            id:isEmpty(id)?null:id,
            name:isEmpty(name)?'':name,
            address:isEmpty(address)?'':address,
            contact_person:isEmpty(contact_person)?'':contact_person,
            contact_phone:isEmpty(contact_phone)?'':contact_phone,
            xl_merchant_id:isEmpty(xl_merchant_id)?'':xl_merchant_id,
            app_id:isEmpty(app_id)?'':app_id,
            secret_key:isEmpty(secret_key)?'':secret_key,
        };
        http.post('/website/gasstation/company-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getCompanyQuery(this.params);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteCompany(id){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/company-remove',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getCompanyQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

}

export default CompanyStore;
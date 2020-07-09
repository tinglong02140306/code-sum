import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
class BrandStore {
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

    @observable brandObject ={};
    @action setBrandObject(brandObject){
        this.brandObject = brandObject;
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

    @observable dataList = [];
    @action getBrandQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/gasstation/brand-query',params,response=>{
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
    @action addBrand(name,code,logo_base64,map_icon_base64) {
        this.setIsShowSubmitLoading(true);
        const params = {
            name:isEmpty(name)?null:name,
            code:isEmpty(code)?null:code,
            logo_base64:isEmpty(logo_base64)?null:logo_base64,
            map_icon_base64:isEmpty(map_icon_base64)?null:map_icon_base64,
        };
        console.log(params);
        http.post('/website/gasstation/brand-add',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getBrandQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //修改
    @action updateBrand(id,name,code,logo_base64,map_icon_base64) {
        this.setIsShowSubmitLoading(true);
        console.log('id'+id);
        const params = {
            // start_date:isEmpty(start_date)?null:formatData(start_date),
            // id:isEmpty(id)?null:id,
            id:id,
            name:isEmpty(name)?null:name,
            code:isEmpty(code)?null:code,
            logo_base64:isEmpty(logo_base64)?null:logo_base64,
            map_icon_base64:isEmpty(map_icon_base64)?null:map_icon_base64,
        };
        http.post('/website/gasstation/brand-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getBrandQuery(this.params);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteBrand(id){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/brand-remove',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getBrandQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

}

export default BrandStore;
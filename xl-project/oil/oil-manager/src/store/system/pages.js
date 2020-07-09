import {observable, action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';

class PagesStore {

    @observable systemItemPage = {};
    @action setSystemItemPage(systemItemPage){
        this.systemItemPage = systemItemPage;
    }

    @observable pagesList = [];

    @action getPagesList(page_num) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
        };

        http.post('/website/webpage/web-page-query',reqData,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.total=response.amount;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{
                item.key = item.id
            });
            this.pagesList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //删除页面
    @action deletePagesList(id){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
        };
        http.post('/website/webpage/web-page-remove',reqData,response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.setIsShowDialog(false);
            this.getPagesList(1);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //添加页面
    @action getAddPages(pageName,pageValue) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_name: pageName,
            page_value: pageValue,
        };
        http.post('/website/webpage/web-page-add',reqData,response=>{
            this.setIsShowLoading(false);
            message.info("添加成功");
            this.getPagesList(1);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @action getUpdatePage(id,pageName,pageValue){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
            page_name: pageName,
            page_value: pageValue,
        };
        http.post('/website/webpage/web-page-update',reqData,response=>{
            message.info("修改成功");
            this.getPagesList(1);
            this.setIsShowDialog(false);
            this.setIsShowLoading(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable isShowLoading = true;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable isShowDialog = false;

    @action setIsShowDialog(isShowDialog, type) {
        this.isShowDialog = isShowDialog;
        this.type = type;
    }

    @observable isShowCheckDialog = false;

    @action setIsShowCheckDialog(isShowCheckDialog) {
        this.isShowCheckDialog = isShowCheckDialog;
    }

    @observable isShowCheckLoading = false;

    @action setIsShowCheckLoading(isShowCheckLoading) {
        this.isShowCheckLoading = isShowCheckLoading;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

}

export default PagesStore;
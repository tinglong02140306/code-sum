import http from "../../http/http";
import {action, observable} from "mobx";
import {message} from "antd/lib/index";

class InviteStore {

    @observable isShowInviteLoading=false;
    @action setIsShowInviteLoading(isShowInviteLoading){
        this.isShowInviteLoading = isShowInviteLoading;
    }

    @observable isShowInviteDialog= false;
    @action setIsShowInviteDialog(isShowInviteDialog){
        this.isShowInviteDialog = isShowInviteDialog;
    }


    @observable inviteObject ={};
    @action setOrderInviteObject(inviteObject){
        this.inviteObject = inviteObject;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable inviter_qrcode_url = "";
    @action setInviterQrcodeUrl(inviter_qrcode_url) {
        this.inviter_qrcode_url = inviter_qrcode_url;
        this.setIsCanPreview(true);
    }
    @observable isCanPreview = false;
    @action setIsCanPreview(isCanPreview) {
        this.isCanPreview = isCanPreview;
    }


    //推广码列表
    @observable inviteList=[];
    @action getInviteList(page_num,page_size){
        this.setIsShowInviteLoading(true);
        this.setPageSize(page_size);

        const  reqData = {
            page_num:page_num,
            page_size:page_size
        };
        http.post('/website/wxapplet/invoice-code-list',reqData,response=>{
            this.setIsShowInviteLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize =page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.inviter_id});
            this.inviteList=response.data;
        },err=>{
            message.error(err);
            this.setIsShowInviteLoading(false);
        });
    }
    //生成推广码
    @action getPromotionCode(inviter_id,inviter_code) {
        if (!this.isShowInviteLoading) {
            this.setIsShowInviteLoading(true);
        }
        const reqData = {
            inviter_id: inviter_id,
            inviter_code: inviter_code,
        };
        http.post('/website/wxapplet/create-qr-code',reqData,()=>{
            this.setIsShowInviteLoading(false);
            message.info("操作成功");
            this.getInviteList(1,this.page_size);
            this.setIsShowInviteDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowInviteLoading(false);
        });
    }

}

export default InviteStore;
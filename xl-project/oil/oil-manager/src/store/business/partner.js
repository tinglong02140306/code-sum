import {observable, action} from 'mobx';
import http from "../../http/http";
import {trim} from "../../utils/trim";
import {message} from 'antd';
import Store from '../store';


class Partner{

    constructor(){
        this.store = new Store();
    }

    //是否显示loading 列表请求
    @observable isShowLoading = true;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable isShowRiskDialog = false;

    @action setIsShowRiskDialog(isShowRiskDialog) {
        this.isShowRiskDialog = isShowRiskDialog;
    }

    @observable isAddRiskLoading = false;

    @action setIsAddRiskLoading(isAddRiskLoading) {
        this.isAddRiskLoading = isAddRiskLoading;
    }

    //type : 1 修改  2 查看
    @observable partnerItem = "";

    @action showPartnerItem(partnerItem) {
        this.partnerItem = partnerItem;
    }

    //展开或关闭 修改 查看dialog
    @observable isDialogVisible = false;
    //type : 1 修改  2 查看 3 新增
    @observable typeDialog = 0;

    @action changeDialogVisible(typeDialog, isDialogVisible) {
        this.isDialogVisible = isDialogVisible;
        this.typeDialog = typeDialog;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @action getAddRiskAmount(partner_id, risk_amount_add) {
        this.setIsAddRiskLoading(true);
        const reqDate = {
            partner_id: partner_id,
            risk_amount: risk_amount_add
        };
        http.post("/website/partner/top-risk-amount-update",reqDate,()=>{
            this.setIsAddRiskLoading(false);
            this.setIsShowRiskDialog(false);
            message.info("风控金额增加成功");
            this.getDataList(1);
        },(err)=>{
            this.setIsAddRiskLoading(false);
            message.info(err);
        });
    }

    @action getResetRiskAmount(partner_id) {
        this.setIsShowLoading(true);
        const reqDate = {partner_id: partner_id,};
        http.post("/website/partner/top-risk-amount-reset",reqDate,()=>{
            this.setIsAddRiskLoading(false);
            this.setIsShowRiskDialog(false);
            message.info("风控金额恢复成功");
            this.getDataList(1);
        },(err)=>{
            this.setIsShowLoading(false);
            message.info(err);
        });
    }

    //请求数据列表
    @observable dataList = [];
    @action getDataList(page_num) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
        };
        http.post("/website/partner/top-query", reqData, (response) => {
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.size = 'small';
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key = item.partner_id});
            this.dataList = response.data
            this.setIsShowLoading(false);
        }, (err) => {
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //submit loading  包含修改 新增
    @observable isSubmitLoading = false;

    @action setSubmitLoading(isSubmitLoading) {
        this.isSubmitLoading = isSubmitLoading;
    }

    //合作方信息(一级企业)录入
    @action getAdd(partner_name, partner_legal_entity, partner_mobile, partner_address, partner_tax_no, partner_link_name,
                   partner_link_mobile, partner_mode, oil_limit, allow_consume_cancel, partner_cert_img_base64,
                   single_consume_limit, risk_amount, risk_amount_warn_scale,partner_type,nick_name) {
        this.setSubmitLoading(true);
        const data = {
            partner_name: trim(partner_name),
            partner_legal_entity: trim(partner_legal_entity),
            partner_mobile: trim(partner_mobile),
            partner_address: trim(partner_address),
            partner_tax_no: trim(partner_tax_no),
            partner_link_name: trim(partner_link_name),
            partner_link_mobile: trim(partner_link_mobile),
            partner_mode: partner_mode,
            oil_limit: oil_limit,
            allow_consume_cancel: allow_consume_cancel,
            partner_cert_img_base64: partner_cert_img_base64,
            single_consume_limit: single_consume_limit,
            risk_amount_warn_scale: risk_amount_warn_scale,
            risk_amount: risk_amount,
            partner_type:partner_type,
            nick_name:nick_name,
        };
        http.post("/website/partner/top-save",data,()=>{
            message.info("信息录入成功");
            this.setSubmitLoading(false);
            this.changeDialogVisible(this.typeDialog, false);
            this.getDataList(1);
        },err=>{
            message.error(err);
            this.setSubmitLoading(false);
            this.changeDialogVisible(this.typeDialog, false);
        });
    }

    @action getUpdate(partner_id, partner_name, partner_legal_entity, partner_mobile, partner_address, partner_tax_no, partner_link_name,
                      partner_link_mobile, partner_mode, oil_limit, allow_consume_cancel, partner_cert_img_base64, single_consume_limit, risk_amount_warn_scale,partner_type,nick_name,risk_amount) {
        this.setSubmitLoading(true);
        const reqData = {
            partner_id: partner_id,
            partner_name: trim(partner_name),
            partner_legal_entity: trim(partner_legal_entity),
            partner_mobile: partner_mobile,
            partner_address: trim(partner_address),
            partner_tax_no: partner_tax_no,
            partner_link_name: trim(partner_link_name),
            partner_link_mobile: partner_link_mobile,
            partner_mode: partner_mode,
            oil_limit: oil_limit,
            allow_consume_cancel: allow_consume_cancel,
            partner_cert_img_base64: partner_cert_img_base64,
            risk_amount_warn_scale: risk_amount_warn_scale,
            single_consume_limit: single_consume_limit,
            partner_type:partner_type,
            nick_name:nick_name,
            risk_amount:risk_amount,
        };

        http.post("/website/partner/top-update",reqData,()=>{
            this.setSubmitLoading(false);
            this.changeDialogVisible(this.typeDialog, false);
            message.info("信息修改成功");
            this.getDataList(1);
        },err=>{
            message.error(err);
            this.setSubmitLoading(false);
            this.changeDialogVisible(this.typeDialog, false);
        });

    }

    @action getOpenAccount(partner_id) {
        this.setIsShowLoading(true);
        const reqData = {partner_id: partner_id}
        http.post("/website/partner/top-open-account",reqData,()=>{
            this.setIsShowLoading(false);
            message.info("开户成功");
            this.getDataList(1);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

}

export default new Partner();
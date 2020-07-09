import {observable, action} from 'mobx';
import http from "../../http/http";
import {isEmpty} from "../../utils/isEmpty";
import {trim} from "../../utils/trim";
import {message} from 'antd';
import Store from '../store';

class Organization extends Store{

    @observable partner_id = "";
    @observable org_id = "";
    @observable invoice_type = "";
    @observable org_name = "";
    @observable org_legal_entity = "";
    @observable org_mobile = "";
    @observable org_link_name = "";
    @observable org_link_mobile = "";
    @observable org_tax_no = "";

    @action setSearchInfo(org_id, partner_id, invoice_type, org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no) {
        this.partner_id = partner_id;
        this.org_id = org_id;
        this.invoice_type = invoice_type;
        this.org_name = org_name;
        this.org_legal_entity = org_legal_entity;
        this.org_link_name = org_link_name;
        this.org_link_mobile = org_link_mobile;
        this.org_tax_no = org_tax_no;
    }

    @observable isShowCheckDialog = false;

    @action setIsShowCheckDialog(isShowCheckDialog) {
        this.isShowCheckDialog = isShowCheckDialog;
    }

    @observable isCheckLoading = false;

    @action setIsCheckLoading(isCheckLoading) {
        this.isCheckLoading = isCheckLoading;
    }

    @observable organizationObject = {};

    @action setOrganizationObject(organizationObject) {
        this.organizationObject = organizationObject;
    }

    @observable isShowDialog = false;
    @observable type = 1; //1:修改 2:增加 3:查看
    @action setIsShowDialog(isShowDialog, type) {
        this.isShowDialog = isShowDialog;
        this.type = type;
    }

    @observable isShowLoading = false;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable isSubmitLoading = false;

    @action setIsSubmitLoading(isSubmitLoading) {
        this.isSubmitLoading = isSubmitLoading;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }


    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable partnerList = [];

    @action getPartnerList() {
        const reqData = {
            page_num: 1,
            page_size: 999
        }
        http.post("/website/partner/top-query", reqData, response => {
            this.partnerList = response.data;
        }, err => {
            message.error(err)
        });
    }

    @observable organizationList = [];

    @action getOrganizationList(page_num, org_id, partner_id, invoice_type,
                                org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no) {
        this.setSearchInfo(partner_id, invoice_type, org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no);
        this.setIsShowLoading(true);
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
            org_id: isEmpty(org_id) ? null : trim(org_id),
            partner_id: isEmpty(partner_id) ? null : trim(partner_id),
            invoice_type: isEmpty(invoice_type) ? null : invoice_type,
            org_name: isEmpty(org_name) ? null : trim(org_name),
            org_legal_entity: isEmpty(org_legal_entity) ? null : trim(org_legal_entity),
            org_mobile: isEmpty(org_mobile) ? null : org_mobile,
            org_link_name: isEmpty(org_link_name) ? null : trim(org_link_name),
            org_link_mobile: isEmpty(org_link_mobile) ? null : org_link_mobile,
            org_tax_no: isEmpty(org_tax_no) ? null : org_tax_no
        };

        http.post("/website/partner/org-query", reqData, response => {
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.org_id});
            this.organizationList = response.data;
            this.setIsShowLoading(false);
        }, err => {
            message.error(err);
            this.setIsShowLoading(false);
        });
    }


    @action getAddUser(partner_id, invoice_type, org_name, org_address, org_legal_entity, org_mobile,
                       org_link_name, org_link_mobile, org_tax_no, org_cert_img_base64, org_bank_name, org_back_account_id, invoice_amtlmt) {
        this.setIsSubmitLoading(true);
        const reqData = {
            partner_id: partner_id,
            invoice_type: invoice_type,
            org_name: trim(org_name),
            org_address: trim(org_address),
            org_legal_entity: trim(org_legal_entity),
            org_mobile: org_mobile,
            org_link_name: trim(org_link_name),
            org_link_mobile: trim(org_link_mobile),
            org_tax_no: org_tax_no,
            org_cert_img_base64: org_cert_img_base64,
            org_bank_name: trim(org_bank_name),
            org_bank_account_id: org_back_account_id,
            invoice_amtlmt: invoice_amtlmt
        };

        http.post("/website/partner/org-save",reqData,()=>{
            message.info("添加成功");
            this.setIsSubmitLoading(false);
            this.setIsShowDialog(false, this.type);
            this.getOrganizationList(1, this.org_id, this.partner_id, this.invoice_type, this.org_name, this.org_legal_entity,
                this.org_mobile, this.org_link_name, this.org_link_mobile, this.org_tax_no);
        },err=>{
            message.error(err);
            this.setIsSubmitLoading(false);
        });
    }

    @action getUpdateUser(org_id, invoice_type, org_name, org_address, org_legal_entity, org_mobile,
                          org_link_name, org_link_mobile, org_tax_no, org_cert_img_base64, org_bank_name, org_bank_account_id, invoice_amtlmt) {
        this.setIsSubmitLoading(true);
        const reqData = {
            org_id: org_id,
            invoice_type: invoice_type,
            org_name: trim(org_name),
            org_address: trim(org_address),
            org_legal_entity: trim(org_legal_entity),
            org_mobile: org_mobile,
            org_link_name: trim(org_link_name),
            org_link_mobile: org_link_mobile,
            org_tax_no: org_tax_no,
            org_cert_img_base64: org_cert_img_base64,
            org_bank_name: trim(org_bank_name),
            org_bank_account_id: org_bank_account_id,
            invoice_amtlmt: invoice_amtlmt
        };
        http.post("/website/partner/org-update",reqData,()=>{
            message.info("修改成功");
            this.setIsSubmitLoading(false);
            this.setIsShowDialog(false, this.type);
            this.getOrganizationList(1, this.org_id, this.partner_id, this.invoice_type, this.org_name, this.org_legal_entity,
                this.org_mobile, this.org_link_name, this.org_link_mobile, this.org_tax_no);
        },err=>{
            message.info(err);
            this.setIsSubmitLoading(false);
        });
    }

    //审核
    @action getSubmitCheck(org_id, audit_status, audit_status_msg) {
        this.setIsCheckLoading(true);
        const reqData = {
            org_id: org_id,
            audit_status: audit_status,
            audit_status_msg: trim(audit_status_msg)
        };

        http.post("/website/partner/org-audit",reqData,()=>{
            message.info("审核成功");
            this.setIsCheckLoading(false);
            this.setIsShowCheckDialog(false);
            this.getOrganizationList(1, this.org_id, this.partner_id, this.invoice_type, this.org_name, this.org_legal_entity,
                this.org_mobile, this.org_link_name, this.org_link_mobile, this.org_tax_no);
        },err=>{
            message.error(err);
            this.setIsCheckLoading(false);
            this.setIsShowCheckDialog(false);
        });
    }

}

export default Organization;
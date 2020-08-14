import React from 'react';
import {Input, Modal, Select, Icon, Button} from 'antd';
import {observer, inject} from 'mobx-react';
import "./OrganizationDialog.scss";
import {isPhoneRight} from "../../utils/mobile";
import {isEmpty} from "../../utils/isEmpty";
import {isRightTax} from "../../utils/isRightTax";
import {getFixed} from "../../utils/getFixed";
import {isRangeNum} from "../../utils/isRangeNum";
import {isSpecialChart} from "../../utils/isSpecialChart";

@inject("organization")
@observer
class OrganizationDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            org_id: "",
            partner_id: "",
            invoice_type: 0,
            org_name: "",
            org_address: "",
            org_legal_entity: "",
            org_mobile: "",
            org_link_name: "",
            org_link_mobile: "",
            org_tax_no: "",
            org_cert_img_url: "",
            org_bank_name: "",
            org_bank_account_id: "",
            audit_status: "",
            audit_status_msg: "",
            isFirst: true,
            isEmptyOrgId: false,
            isEmptyPartnerId: false,
            isEmptyOrgName: false,
            isEmptyOrgAddress: false,
            isEmptyOrgLegalEntity: false,
            isEmptyOrgMobile: false,
            isEmptyOrgLinkName: false,
            isEmptyOrgLinkMobile: false,
            isEmptyOrgTax: false,
            isEmptyOrgBankName: false,
            isEmptyOrgBackId: false,
            isCanPreview: false,
            isVisiblePre: "hidden",
            isEmptyImage: false,
            isImageHint: "请添加三证合一照片",
            org_image_base64: "",
            invoice_amtlmt: "",
            isEmptyInvoiceAmtlmt: false
        }
    }

    componentDidMount() {
        const {organizationObject, type} = this.props.organization;
        if (type !== 2) {
            this.setState({
                org_id: organizationObject.org_id,
                partner_id: organizationObject.partner_id,
                org_name: organizationObject.org_name,
                org_address: organizationObject.org_address,
                org_legal_entity: organizationObject.org_legal_entity,
                org_mobile: organizationObject.org_mobile,
                org_link_name: organizationObject.org_link_name,
                org_link_mobile: organizationObject.org_link_mobile,
                org_tax_no: organizationObject.org_tax_no,
                org_cert_img_url: organizationObject.org_cert_img_url,
                org_bank_name: organizationObject.org_bank_name,
                org_bank_account_id: organizationObject.org_bank_account_id,
                audit_status: organizationObject.audit_status,
                audit_status_msg: organizationObject.audit_status_msg,
                invoice_type: organizationObject.invoice_type,
                invoice_amtlmt: organizationObject.invoice_amtlmt
            });
        }
    }

    onChangePartnerId = (e) => {
        this.setState({partner_id: e});
    }

    onChangeOrgId = (e) => {
        this.setState({org_id: e.target.value});
    }

    onChangeOrgName = (e) => {
        this.setState({org_name: e.target.value});
    }

    onChangeOrgAddress = (e) => {
        this.setState({org_address: e.target.value});
    }

    onChangeOrgLegalEntity = (e) => {
        this.setState({org_legal_entity: e.target.value});
    }

    onChangeOrgMobile = (e) => {
        this.setState({org_mobile: e.target.value});
    }

    onChangeOrgLinkName = (e) => {
        this.setState({org_link_name: e.target.value});
    }

    onChangeOrgLinkMobile = (e) => {
        this.setState({org_link_mobile: e.target.value});
    }

    onChangeOrgTax = (e) => {
        this.setState({org_tax_no: e.target.value});
    }

    onChangeOrgBankName = (e) => {
        this.setState({org_bank_name: e.target.value});
    }

    onChangeOrgBackId = (e) => {
        this.setState({org_bank_account_id: e.target.value});
    }

    onCancel = () => {
        this.props.organization.setIsShowDialog(false);
    }

    onChangeInvoiceType = (value) => {
        this.setState({invoice_type: value});
    }

    onChangeInvoiceAmtlmt = (e) => {
        this.setState({invoice_amtlmt: e.target.value});
    }
    //校验

    check = (org_id, org_name, org_mobile, org_address, org_tax_no,
             org_link_name, org_link_mobile, org_bank_name, org_legal_entity, org_cert_img_url,
             org_bank_account_id, partner_id, org_image_base64, invoice_amtlmt) => {
        this.setState({
            isEmptyPartnerId: isEmpty(partner_id),
            isEmptyOrgName: isSpecialChart(org_name),
            isEmptyOrgLegalEntity: isSpecialChart(org_legal_entity),
            isEmptyOrgMobile: !isPhoneRight(org_mobile),
            isEmptyOrgAddress: isSpecialChart(org_address),
            isEmptyOrgTax: !isRightTax(org_tax_no),
            isEmptyOrgBankName: isSpecialChart(org_bank_name),
            isEmptyOrgBackId: isSpecialChart(org_bank_account_id),
            isEmptyOrgLinkName: isSpecialChart(org_link_name),
            isEmptyOrgLinkMobile: !isPhoneRight(org_link_mobile),
            // isEmptyImage: isEmpty(org_image_base64) && isEmpty(org_cert_img_url),
            isEmptyInvoiceAmtlmt: !isRangeNum(invoice_amtlmt,5000000.00)
        });
    }
    //提交
    onSubmitOrganization = () => {
        const {
            org_id, org_name, org_mobile, org_address, org_tax_no,
            org_link_name, org_link_mobile, org_bank_name, org_legal_entity, invoice_amtlmt,
            org_bank_account_id, partner_id, invoice_type, org_image_base64, org_cert_img_url
        } = this.state;
        if (!isSpecialChart(org_name)
            && !isSpecialChart(org_address)
            && !isSpecialChart(org_legal_entity)
            && isPhoneRight(org_mobile)
            && isRightTax(org_tax_no)
            && !isSpecialChart(org_link_name)
            && isPhoneRight(org_link_mobile)
            && !isSpecialChart(org_bank_name)
            && !isSpecialChart(org_bank_account_id)
            && isRangeNum(invoice_amtlmt,5000000.00))
            // && (!isEmpty(org_image_base64) || !isEmpty(org_cert_img_url)))
        {
            if (this.props.organization.type === 2) {//增加
                this.props.organization.getAddUser(partner_id, invoice_type, org_name, org_address, org_legal_entity,
                    org_mobile, org_link_name, org_link_mobile, org_tax_no, org_image_base64, org_bank_name, org_bank_account_id, getFixed(invoice_amtlmt));
            } else {//修改
                if (!isEmpty(org_id)) {
                    this.props.organization.getUpdateUser(org_id, invoice_type, org_name, org_address, org_legal_entity,
                        org_mobile, org_link_name, org_link_mobile, org_tax_no, org_image_base64, org_bank_name, org_bank_account_id, getFixed(invoice_amtlmt));
                }
            }
        } else {
            this.check(org_id, org_name, org_mobile, org_address, org_tax_no,
                org_link_name, org_link_mobile, org_bank_name, org_legal_entity,org_cert_img_url,
                org_bank_account_id, partner_id, org_image_base64, invoice_amtlmt);
        }
    }

    getTitle(type) {
        let title = "";
        switch (type) {
            case 1:
                title = "修改信息";
                break
            case 2:
                title = "录入信息";
                break
            case 3:
                title = "查看信息";
                break
            default:

                break
        }
        return title;
    }


    handleCancel = () => {
        this.setState({isCanPreview: false});
    }

    onChangeImage = (e) => {
        const reader = new FileReader();
        const allowImgFileSize = 1024 * 1024 * 5; //上传图片最大值(单位字节)超过5M上传失败
        const file = e.target.files[0];
        const url = this.getObjectURL(file);
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                if (allowImgFileSize !== 0 && allowImgFileSize < reader.result.length) {
                    this.setState({
                        isEmptyImage: true,
                        isImageHint: "照片大小不能超过5M",
                        org_image_base64: ""
                    });
                    return;
                } else {
                    this.setState({
                        isEmptyImage: false,
                        org_image_base64: reader.result,
                        org_cert_img_url: url
                    });
                }
            }
        } else {
            this.setState({
                isEmptyImage: true,
                isImageHint: "照片格式错误",
                org_cert_img_url: ""
            });
        }
    }

    getObjectURL = (file) => {
        let url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    //鼠标放上 显示覆盖层
    onMouseUp = () => {
        if (!isEmpty(this.state.org_cert_img_url)) {
            this.setState({isVisiblePre: "visible"});
        }
    }
    //鼠标移开 移除覆盖层
    onMouseLeave = () => {
        this.setState({isVisiblePre: "hidden"});
    }

    //预览图片
    onPreviewImage = () => {
        this.setState({isCanPreview: true});
    }
    //删除图片
    onDeleteImage = () => {
        this.setState({org_cert_img_url: ""});
    }


    render() {
        const {
            org_id, org_name, org_mobile, org_address, org_tax_no,
            org_link_name, org_link_mobile, org_bank_name, org_legal_entity,
            org_bank_account_id, org_cert_img_url, partner_id, invoice_type, invoice_amtlmt,
            isEmptyPartnerId, isEmptyOrgId, isEmptyOrgMobile,
            isEmptyOrgTax, isEmptyOrgName, isEmptyOrgAddress, isEmptyOrgLinkName, isEmptyOrgBackId,
            isEmptyOrgBankName, isEmptyOrgLegalEntity, isEmptyOrgLinkMobile, isEmptyImage, isEmptyInvoiceAmtlmt
        } = this.state;
        //1:修改 2:增加 3:查看
        const {type, isShowDialog, isSubmitLoading, partnerList} = this.props.organization;
        const title = this.getTitle(type);
        return (
            <Modal
                width={800}
                title={title}
                onCancel={this.onCancel}
                visible={isShowDialog}
                footer={type === 3 ? [
                    <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>] : [
                    <Button key="back" onClick={this.onCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={isSubmitLoading}
                            onClick={this.onSubmitOrganization}>提交</Button>]}>
                <div className="organization-dialog-container">
                    <div className="organization-dialog-container-left">
                        <div className="organization-dialog-item-container"
                             style={{display: type !== 1 ? "visible" : "none"}}>
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>合作方ID:
                                </div>
                                <Select defaultValue={partner_id}
                                        style={{width: 230}}
                                        value={partner_id}
                                        disabled={type === 3 ? true : false}
                                        onChange={this.onChangePartnerId}>
                                    {partnerList !== null ? partnerList.map((number) =>
                                        <Select.Option value={number.partner_id}
                                                       key={number.partner_id}>{number.partner_id}</Select.Option>
                                    ) : ""}
                                </Select>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyPartnerId ? "visible" : "hidden"}}>请选择合作方ID
                            </div>
                        </div>
                        <div className="organization-dialog-item-container"
                             style={{display: type === 3 ? "block" : "none"}}>
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>机构方ID:
                                </div>
                                <Input
                                    style={{width: 230}}
                                    value={org_id}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgId}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgId ? "visible" : "hidden"}}>请输入机构方ID(不包含特殊字符)
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>名称:
                                </div>
                                <Input.TextArea
                                    style={{width: 230}}
                                    value={org_name}
                                    maxLength={100}
                                    autosize={{minRows: 1}}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgName}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgName ? "visible" : "hidden"}}>请输入名称(不包含特殊字符)
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>法人:
                                </div>
                                <Input style={{width: 230}}
                                       value={org_legal_entity}
                                       maxLength={50}
                                       disabled={type === 3 ? true : false}
                                       onChange={this.onChangeOrgLegalEntity}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgLegalEntity ? "visible" : "hidden"}}>请输入法人(不包含特殊字符)
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>电话:
                                </div>
                                <Input
                                    style={{width: 230}}
                                    value={org_mobile}
                                    maxLength={15}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgMobile}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgMobile ? "visible" : "hidden"}}>请输入正确的电话
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>税号:
                                </div>
                                <Input
                                    style={{width: 230}}
                                    value={org_tax_no}
                                    maxLength={20}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgTax}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgTax ? "visible" : "hidden"}}>请输入税号(不包含特殊字符)
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>开户行名称:
                                </div>
                                <Input.TextArea
                                    autosize={{minRows: 1}}
                                    style={{width: 230}}
                                    value={org_bank_name}
                                    maxLength={30}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgBankName}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgBankName ? "visible" : "hidden"}}>请输入开户行名称(不包含特殊字符)
                            </div>
                        </div>
                        <div className="organization-dialog-item-container">

                            <div className="organization-dialog-item-input-special">
                                <div className="organization-dialog-item-input-special-hint">
                                    <span>*</span>开户账号:
                                </div>
                                <Input
                                    style={{width: 230}}
                                    value={org_bank_account_id}
                                    maxLength={50}
                                    disabled={type === 3 ? true : false}
                                    onChange={this.onChangeOrgBackId}/>
                            </div>
                            <div className="organization-dialog-item-hint"
                                 style={{visibility: isEmptyOrgBackId ? "visible" : "hidden"}}>请输入开户账号(不包含特殊字符)
                            </div>
                        </div>

                    </div>
                    <div className="organization-dialog-center"/>
                    <div className="organization-dialog-container-left">
                        <div className="organization-dialog-item-container">
                            <div className="organization-dialog-item-container">
                                <div className="organization-dialog-item-input-special">
                                    <div className="organization-dialog-item-input-special-hint">
                                        <span>*</span>联系人姓名:
                                    </div>
                                    <Input
                                        style={{width: 230}}
                                        value={org_link_name}
                                        maxLength={50}
                                        disabled={type === 3 ? true : false}
                                        onChange={this.onChangeOrgLinkName}/>
                                </div>
                                <div className="organization-dialog-item-hint"
                                     style={{visibility: isEmptyOrgLinkName ? "visible" : "hidden"}}>请输入联系人姓名(不包含特殊字符)
                                </div>
                            </div>
                            <div className="organization-dialog-item-container">
                                <div className="organization-dialog-item-input-special">
                                    <div className="organization-dialog-item-input-special-hint">
                                        <span>*</span>联系人电话:
                                    </div>
                                    <Input
                                        style={{width: 230}}
                                        value={org_link_mobile}
                                        maxLength={15}
                                        disabled={type === 3 ? true : false}
                                        onChange={this.onChangeOrgLinkMobile}/>
                                </div>
                                <div className="organization-dialog-item-hint"
                                     style={{visibility: isEmptyOrgLinkMobile ? "visible" : "hidden"}}>请输入联系人电话
                                </div>
                            </div>
                            <div className="organization-dialog-item-container">
                                <div className="organization-dialog-item-input-special">
                                    <div className="organization-dialog-item-input-special-hint">
                                        <span>*</span>发票限额:
                                    </div>
                                    <Input
                                        style={{width: 230}}
                                        value={invoice_amtlmt}
                                        placeholder="上限5000000.00"
                                        disabled={type === 3 ? true : false}
                                        onChange={this.onChangeInvoiceAmtlmt}/>
                                </div>
                                <div className="organization-dialog-item-hint"
                                     style={{visibility: isEmptyInvoiceAmtlmt ? "visible" : "hidden"}}>请输入发票限额,上限5000000.00
                                </div>
                            </div>
                            <div className="organization-dialog-right-item">
                                <div className="organization-dialog-item-input-special">
                                    <div className="organization-dialog-item-input-special-hint">
                                        <span>*</span>发票类型:
                                    </div>
                                    <Select style={{width: 230}}
                                            onChange={this.onChangeInvoiceType}
                                            value={invoice_type}
                                            disabled={type === 3 ? true : false}>
                                        <Select.Option value={0}>不开票</Select.Option>
                                        <Select.Option value={1}>专票</Select.Option>
                                        <Select.Option value={2}>普票</Select.Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="organization-dialog-item-container">
                                <div className="organization-dialog-item-input-special">
                                    <div className="organization-dialog-item-input-special-hint">
                                        <span>*</span>地址:
                                    </div>
                                    <Input.TextArea
                                        style={{width: 230}}
                                        value={org_address}
                                        autosize={{minRows: 2}}
                                        placeholder="最多200字"
                                        maxLength={200}
                                        disabled={type === 3 ? true : false}
                                        onChange={this.onChangeOrgAddress}/>
                                </div>
                                <div className="organization-dialog-item-hint"
                                     style={{visibility: isEmptyOrgAddress ? "visible" : "hidden"}}>请输入地址(不包含特殊字符)
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default OrganizationDialog;

// <div className="organization-image-container">
//     <div className="organization-image-item">
//         <div className="organization-image-hint">
//             <span>*</span>三证合一照片&nbsp;:
//         </div>
//         <div className="organization-dialog-upload"
//              onMouseOver={this.onMouseUp}
//              onMouseOut={this.onMouseLeave}>
//             <div className="organization-content">
//                 <div className="organization-hint"
//                      style={{visibility: isEmpty(org_cert_img_url) ? "visible" : "hidden"}}>
//                     <Icon type="plus"/>
//                     上传
//                 </div>
//                 <div className="organization-image-div">
//                     <img src={org_cert_img_url}
//                          style={{visibility: !isEmpty(org_cert_img_url) ? "visible" : "hidden"}}
//                          alt="三证合一照片" className="upload-image"/>
//                     <div className="organization-overlay"
//                          style={{visibility: this.state.isVisiblePre}}>
//                         <div onClick={this.onPreviewImage}><Icon type="eye-o"
//                                                                  style={{color: "#fff"}}/>
//                         </div>
//                         <div onClick={this.onDeleteImage}
//                              style={{display: type !== 3 ? "block" : "none"}}>
//                             <Icon type="delete"
//                                   style={{color: "#fff"}}/></div>
//                     </div>
//                 </div>
//             </div>
//             <input className="organization-input"
//                    type="file"
//                    multiple="multiple"
//                    value=""
//                    onChange={this.onChangeImage}
//                    style={{display: isEmpty(org_cert_img_url) ? "block" : "none"}}
//                    accept="image/png, image/jpeg, image/gif, image/jpg"/>
//             <Modal visible={this.state.isCanPreview} footer={null}
//                    onCancel={this.handleCancel}>
//                 <img alt="example" style={{width: '100%'}} src={org_cert_img_url}/>
//             </Modal>
//         </div>
//     </div>
//     <div className="organization-image-empty-hint"
//          style={{visibility: isEmptyImage ? "visible" : "hidden"}}>
{/*        <span>{this.state.isImageHint}</span></div>*/}
{/*</div>*/}
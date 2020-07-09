import React from 'react';
import { Input, Modal, Select, Radio, Icon, Button } from 'antd';
import { observer, inject } from 'mobx-react';
import "./PartnerDialog.scss";
import { isEmpty } from "../../utils/isEmpty";
import { isPhoneRight } from "../../utils/mobile";
import { isRightTax } from "../../utils/isRightTax";
import { isRange } from "../../utils/isRange";
import { getFixed } from "../../utils/getFixed";
import { isRangeNum } from "../../utils/isRangeNum";
import { isSpecialChart } from "../../utils/isSpecialChart";
import { isNumber } from "../../utils/isNumber";

@inject("partner")
@observer
class PartnerDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            partner_id: "",
            partner_name: "",
            partner_mobile: "",
            partner_address: "",
            partner_tax_no: "",
            partner_link_name: "",
            partner_legal_entity: "",
            partner_cert_img_url: "",
            single_consume_limit: "",
            risk_amount: "",
            risk_amount_warn_scale: "",
            partner_mode: 1,
            oil_limit: 0,
            partner_link_mobile: "",
            isCanCancel: true,
            isFirst: true,
            isEmptyPartnerId: false,
            isEmptyPartnerName: false,
            isEmptyPartnerMobile: false,
            isEmptyPartnerAddress: false,
            isEmptyPartnerTax: false,
            isEmptyPartnerLinkName: false,
            isEmptyPartnerLegal: false,
            isEmptyPartnerLinkMobile: false,
            isEmptySingleConsumeLimit: false,
            isEmptyRiskAmountLimit: false,
            isEmptyRiskAmountWarnScale: false,
            isCanPreview: false,
            isVisiblePre: "hidden",
            isEmptyImage: false,
            isImageHint: "请添加三证合一照片",
            partner_image_base64: "",
            partner_type: '0',
            nick_name: "",
        };
    }

    componentDidMount() {
        const { partnerItem } = this.props.partner;
        if (this.props.partner.typeDialog !== 3) {
            this.setState({
                partner_id: partnerItem.partner_id,
                partner_name: partnerItem.partner_name,
                partner_mobile: partnerItem.partner_mobile,
                partner_address: partnerItem.partner_address,
                partner_tax_no: partnerItem.partner_tax_no,
                partner_link_name: partnerItem.partner_link_name,
                partner_legal_entity: partnerItem.partner_legal_entity,
                partner_cert_img_url: partnerItem.partner_cert_img_url,
                partner_mode: partnerItem.partner_mode,
                oil_limit: partnerItem.oil_limit,
                isCanCancel: partnerItem.allow_consume_cancel,
                partner_link_mobile: partnerItem.partner_link_mobile,
                single_consume_limit: parseFloat(partnerItem.single_consume_limit).toFixed(2),
                risk_amount_warn_scale: partnerItem.risk_amount_warn_scale,
                risk_amount: parseFloat(partnerItem.risk_amount).toFixed(2),
                partner_type: partnerItem.partner_type,
                nick_name: partnerItem.nick_name
            });
        }
    }

    getTitle = (typeDialog) => {
        let title = "";
        switch (typeDialog) {
            case 1:
                title = "修改信息";
                break
            case 2:
                title = "查看信息";
                break
            default:
                title = "合作方信息录入";
        }
        return title;
    }

    onCancel = () => {
        this.props.partner.changeDialogVisible(this.props.partner.typeDialog, false);
    }

    //提交
    onSubmit = () => {
        const { typeDialog } = this.props.partner;
        const {
            partner_id, partner_name, partner_mobile, partner_address, partner_tax_no, partner_cert_img_url,
            partner_link_name, partner_legal_entity, partner_mode, oil_limit, partner_link_mobile, partner_image_base64, isCanCancel,
            single_consume_limit, risk_amount, risk_amount_warn_scale, partner_type, nick_name
        } = this.state;
        if (typeDialog === 3) { //新增
            if (!isSpecialChart(partner_name)
                && !isSpecialChart(partner_legal_entity)
                && isPhoneRight(partner_mobile)
                && isPhoneRight(partner_link_mobile)
                && !isSpecialChart(partner_address)
                && isRightTax(partner_tax_no)
                && !isSpecialChart(partner_link_name)
                // && isRangeNum(single_consume_limit, 9999.99)
                // && isRangeNum(risk_amount, 99999999.99)
                && !isNaN(single_consume_limit)
                && !isNaN(risk_amount)
                && isRange(risk_amount_warn_scale)
                && !isEmpty(partner_image_base64)) {
                this.props.partner.getAdd(partner_name, partner_legal_entity, partner_mobile, partner_address,
                    partner_tax_no, partner_link_name, partner_link_mobile, partner_mode, oil_limit,
                    isCanCancel, partner_image_base64, getFixed(single_consume_limit), getFixed(risk_amount), getFixed(risk_amount_warn_scale), partner_type, nick_name);

            } else {
                this.preCheck(partner_name, partner_legal_entity, partner_mobile, partner_address, partner_tax_no, partner_link_name,
                    partner_link_mobile, partner_image_base64, single_consume_limit, risk_amount_warn_scale, risk_amount, partner_cert_img_url);
            }
        } else {
            if (!isSpecialChart(partner_name)
                && !isSpecialChart(partner_legal_entity)
                && isPhoneRight(partner_mobile)
                && isPhoneRight(partner_link_mobile)
                && !isSpecialChart(partner_address)
                && isRightTax(partner_tax_no)
                && !isSpecialChart(partner_link_name)
                // && isRangeNum(single_consume_limit, 9999.99)
                && !isNaN(single_consume_limit)
                && !isNaN(risk_amount)
                && isRange(risk_amount_warn_scale)
                && (!isEmpty(partner_cert_img_url) || !isEmpty(partner_image_base64))) {
                this.props.partner.getUpdate(partner_id, partner_name, partner_legal_entity, partner_mobile, partner_address,
                    partner_tax_no, partner_link_name, partner_link_mobile, partner_mode, oil_limit, isCanCancel, partner_image_base64,
                    getFixed(single_consume_limit), getFixed(risk_amount_warn_scale), partner_type, nick_name, getFixed(risk_amount))
            } else {
                this.preCheck(partner_name, partner_legal_entity, partner_mobile, partner_address, partner_tax_no, partner_link_name,
                    partner_link_mobile, partner_image_base64, single_consume_limit, risk_amount_warn_scale, risk_amount, partner_cert_img_url);
            }
        }
    }

    //提交前的校验
    preCheck = (partner_name, partner_legal_entity, partner_mobile, partner_address, partner_tax_no,
        partner_link_name, partner_link_mobile, partner_image_base64, single_consume_limit,
        risk_amount_warn_scale, risk_amount, partner_cert_img_url) => {
        this.setState({ isEmptyPartnerName: isSpecialChart(partner_name) ? true : false });
        this.setState({ isEmptyPartnerLegal: isSpecialChart(partner_legal_entity) ? true : false });
        this.setState({ isEmptyPartnerMobile: !isPhoneRight(partner_mobile) ? true : false });
        this.setState({ isEmptyPartnerAddress: isSpecialChart(partner_address) ? true : false });
        this.setState({ isEmptyPartnerTax: !isRightTax(partner_tax_no) ? true : false });
        this.setState({ isEmptyPartnerLinkName: isSpecialChart(partner_link_name) ? true : false });
        this.setState({ isEmptyPartnerLinkMobile: !isPhoneRight(partner_link_mobile) ? true : false });
        this.setState({ isEmptyImage: isEmpty(partner_image_base64) && isEmpty(partner_cert_img_url) ? true : false });
        // this.setState({isEmptySingleConsumeLimit: isRangeNum(single_consume_limit, 9999.99) ? false : true});
        // this.setState({isEmptyRiskAmountLimit: isRangeNum(risk_amount, 99999999.99) ? false : true});
        this.setState({ isEmptySingleConsumeLimit: !isNaN(single_consume_limit) ? false : true });
        this.setState({ isEmptyRiskAmountLimit: !isNaN(risk_amount) ? false : true });
        this.setState({ isEmptyRiskAmountWarnScale: isRange(risk_amount_warn_scale) ? false : true });
        const { typeDialog } = this.props.partner;
        // if (typeDialog !== 2) {
        //     // this.setState({isEmptyRiskAmountLimit: isRangeNum(risk_amount, 99999999.99) ? false : true});
        //     this.setState({isEmptyRiskAmountLimit: !isNaN(risk_amount) ? false : true});
        // }
    }

    //名称
    onChangePartnerName = (e) => {
        this.setState({ partner_name: e.target.value });
    }
    //昵称
    onChangeNickName = (e) => {
        this.setState({ nick_name: e.target.value });
    }

    // 法人
    onChangePartnerLegalEntity = (e) => {
        this.setState({ partner_legal_entity: e.target.value });
    }
    // 电话
    onChangePartnerMobile = (e) => {
        this.setState({ partner_mobile: e.target.value });
    }
    //地址
    onChangePartnerAddress = (e) => {
        this.setState({ partner_address: e.target.value });
    }
    //税号
    onChangePartnerTax = (e) => {
        this.setState({ partner_tax_no: e.target.value });
    }
    //联系人姓名
    onChangePartnerLinkName = (e) => {
        this.setState({ partner_link_name: e.target.value });
    }
    //联系人手机号
    onChangePartnerLinkMobile = (e) => {
        this.setState({ partner_link_mobile: e.target.value });
    }
    //合作方模式
    onChangeMode = (value) => {
        this.setState({ partner_mode: value });
    }
    //油品限制
    onChangeOil = (value) => {
        this.setState({ oil_limit: value });
    }
    //合作方类型
    onPartnerTypeChange = (value) => {
        this.setState({ partner_type: value });
    }
    //single_consume_limit 单笔限制金额
    onChangeSingleConsumeLimit = (e) => {
        this.setState({ single_consume_limit: e.target.value });
    }

    //risk_amount_limit 风控金额上限
    onChangeRiskAmountLimit = (e) => {
        this.setState({ risk_amount: e.target.value });
    }
    //risk_amount_warn_scale 风控预警比列
    onChangeRiskAmountWarnScale = (e) => {
        this.setState({ risk_amount_warn_scale: e.target.value });
    }

    onChangeCancel = (e) => {
        if (e.target.value === 1) {
            this.setState({ isCanCancel: true });
        } else {
            this.setState({ isCanCancel: false });
        }
    }

    handleCancel = () => {
        this.setState({ isCanPreview: false });
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
                        partner_image_base64: ""
                    });
                    return;
                } else {
                    this.setState({
                        isEmptyImage: false,
                        partner_image_base64: reader.result,
                        partner_cert_img_url: url
                    });
                }
            }
        } else {
            this.setState({
                isEmptyImage: true,
                isImageHint: "照片格式错误",
                partner_image_base64: ""
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
        if (!isEmpty(this.state.partner_cert_img_url)) {
            this.setState({ isVisiblePre: "visible" });
        }
    }
    //鼠标移开 移除覆盖层
    onMouseLeave = () => {
        this.setState({ isVisiblePre: "hidden" });
    }

    //预览图片
    onPreviewImage = () => {
        this.setState({ isCanPreview: true });
    }
    //删除图片
    onDeleteImage = () => {
        this.setState({ partner_cert_img_url: "" }, () => {
        });
    }

    render() {
        const { partner_type,
            partner_id, single_consume_limit, risk_amount, risk_amount_warn_scale,
            partner_name, partner_mobile, partner_address, partner_tax_no,
            partner_link_name, partner_legal_entity, partner_mode, oil_limit, partner_link_mobile,
            isEmptyPartnerName, isEmptyPartnerMobile, isEmptyPartnerAddress, isEmptyPartnerTax,
            isEmptyPartnerLinkName, isEmptyPartnerLegal, isEmptyPartnerLinkMobile, isEmptyImage,
            isEmptyRiskAmountLimit, isEmptyRiskAmountWarnScale, isEmptySingleConsumeLimit, nick_name
        } = this.state;
        const { typeDialog, partnerItem, isSubmitLoading } = this.props.partner;
        const title = this.getTitle(typeDialog);
        const isCanUpdata = isEmpty(partnerItem.xlcore_user_id);
        return (<Modal
            title={title}
            width={820}
            onCancel={this.onCancel}
            visible={this.props.partner.isDialogVisible}
            footer={typeDialog === 2 ? [
                <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>] : [
                    <Button key="back" onClick={this.onCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={isSubmitLoading}
                        onClick={this.onSubmit}>提交</Button>]}>
            <div className="partner-dialog-container">
                <div className="partner-dialog-left">
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint">
                                <span>*</span>名称:
                            </div>
                            <Input.TextArea
                                style={{ width: 250 }}
                                value={partner_name}
                                maxLength={100}
                                autosize={{ minRows: 1 }}
                                onChange={this.onChangePartnerName}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerName ? "visible" : "hidden" }}>请输入名称(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint">
                                昵称:
                            </div>
                            <Input.TextArea
                                style={{ width: 250 }}
                                value={nick_name}
                                maxLength={100}
                                autosize={{ minRows: 1 }}
                                onChange={this.onChangeNickName}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: "hidden" }}>请输入名称(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="partner-dialog-input-hint">
                                <span>*</span>类型:
                            </div>
                            <Select
                                value={partner_type}
                                onChange={this.onPartnerTypeChange}
                                style={{ margin: 0, width: 250 }}
                                disabled={typeDialog === 2 ? true : false}>
                                <Select.Option value={"0"}>油企</Select.Option>
                                <Select.Option value={"1"}>无车承运人</Select.Option>
                                <Select.Option value={"2"}>导流平台</Select.Option>
                            </Select>
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: "hidden" }}>请输入地址(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint">
                                <span>*</span>法人:
                            </div>
                            <Input
                                value={partner_legal_entity}
                                style={{ width: 250 }}
                                maxLength={50}
                                onChange={this.onChangePartnerLegalEntity}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerLegal ? "visible" : "hidden" }}>请输入法人(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint">
                                <span>*</span>税号:
                            </div>
                            <Input
                                value={partner_tax_no}
                                style={{ width: 250 }}
                                maxLength={20}
                                onChange={this.onChangePartnerTax}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerTax ? "visible" : "hidden" }}>请输入税号(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint">
                                <span>*</span>电话:
                            </div>
                            <Input
                                value={partner_mobile}
                                style={{ width: 250 }}
                                maxLength={15}
                                onChange={this.onChangePartnerMobile}
                                disabled={typeDialog === 2 ? true : false} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerMobile ? "visible" : "hidden" }}>请输入正确的电话</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint"><span>*</span>联系人姓名:</div>
                            <Input
                                value={partner_link_name}
                                style={{ width: 250 }}
                                maxLength={50}
                                onChange={this.onChangePartnerLinkName}
                                disabled={typeDialog === 2 ? true : false} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerLinkName ? "visible" : "hidden" }}>请输入联系人姓名(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div className="partner-dialog-input-container">
                            <div className="partner-dialog-input-hint"><span>*</span>联系人手机:</div>
                            <Input
                                value={partner_link_mobile}
                                style={{ width: 250 }}
                                maxLength={15}
                                onChange={this.onChangePartnerLinkMobile}
                                disabled={typeDialog === 2 ? true : false} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerLinkMobile ? "visible" : "hidden" }}>请输入联系人手机</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="partner-dialog-input-hint">
                                <span>*</span>模式:
                            </div>
                            <Select
                                value={partner_mode}
                                style={{ margin: 0, width: 250 }}
                                onChange={this.onChangeMode}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true}>
                                <Select.Option value={1}>拆单</Select.Option>
                                <Select.Option value={2}>不拆单</Select.Option>
                            </Select>
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: "hidden" }}>请输入地址(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="partner-dialog-input-hint">
                                <span>*</span>油品:
                            </div>
                            <Select
                                value={oil_limit}
                                onChange={this.onChangeOil}
                                style={{ margin: 0, width: 250 }}
                                disabled={typeDialog === 2 ? true : false}>
                                <Select.Option value={1}>汽油</Select.Option>
                                <Select.Option value={2}>柴油</Select.Option>
                                <Select.Option value={0}>汽油柴油</Select.Option>
                            </Select>
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: "hidden" }}>请输入地址(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div className="partner-dialog-input-item">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="partner-dialog-input-hint">
                                <span>*</span>地址:
                            </div>
                            <Input.TextArea
                                value={partner_address}
                                style={{ width: 250 }}
                                autosize={{ minRows: 2 }}
                                placeholder="最多200字"
                                maxLength={200}
                                onChange={this.onChangePartnerAddress}
                                disabled={typeDialog === 2 ? true : false} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyPartnerAddress ? "visible" : "hidden" }}>请输入地址(不包含特殊字符)</span>
                        </div>
                    </div>
                </div>
                <div className="partner-dialog-center">
                </div>
                <div className="partner-dialog-left">
                    <div className="partner-dialog-input-item" style={{ display: typeDialog === 2 ? "block" : "none" }}>
                        <div className="partner-dialog-right-item">
                            <div className="partner-dialog-right-hint">
                                <span>*</span>合作方ID:
                            </div>
                            <Input
                                style={{ width: 250 }}
                                value={partner_id}
                                onChange={this.onChangePartnerName}
                                disabled={typeDialog !== 2 && isCanUpdata ? false : true} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: "hidden" }}>请输入名称(不包含特殊字符)</span>
                        </div>
                    </div>
                    <div>
                        <div className="partner-dialog-right-item">
                            <div className="partner-dialog-right-hint">
                                <span>*</span>单笔限制金额&nbsp;:
                            </div>
                            <Input
                                value={single_consume_limit}
                                style={{ width: 250 }}
                                placeholder="上限9999.99"
                                disabled={typeDialog === 2 ? true : false}
                                onChange={this.onChangeSingleConsumeLimit} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span
                                style={{ visibility: isEmptySingleConsumeLimit ? "visible" : "hidden" }}>请输入单笔限制金额,上限9999.99</span>
                        </div>
                    </div>
                    {/*<div style={{display: typeDialog !== 1 ? "block" : "none"}}>*/}
                    <div>
                        <div className="partner-dialog-right-item">
                            <div className="partner-dialog-right-hint">
                                <span>*</span>风控金额&nbsp;:
                            </div>
                            <Input
                                value={risk_amount}
                                style={{ width: 250 }}
                                placeholder="上限99999999.99"
                                disabled={typeDialog === 2 ? true : false}
                                onChange={this.onChangeRiskAmountLimit} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyRiskAmountLimit ? "visible" : "hidden" }}>请输入风控金额上限,上限99999999.99</span>
                        </div>
                    </div>
                    <div>
                        <div className="partner-dialog-right-item">
                            <div className="partner-dialog-right-hint">
                                <span>*</span>风控预警比例&nbsp;:
                            </div>
                            <Input
                                value={risk_amount_warn_scale}
                                style={{ width: 250 }}
                                placeholder="范围 0.01-1"
                                disabled={typeDialog === 2 ? true : false}
                                onChange={this.onChangeRiskAmountWarnScale} />
                        </div>
                        <div className="partner-dialog-input-empty">
                            <span style={{ visibility: isEmptyRiskAmountWarnScale ? "visible" : "hidden" }}>请输入风控预警比列,范围 0.01-1</span>
                        </div>
                    </div>
                    <div>
                        <div className="partner-dialog-right-item" style={{ marginBottom: 20 }}>
                            <div className="partner-dialog-right-hint">
                                <span>*</span>是否允许撤销&nbsp;:
                            </div>
                            <Radio.Group
                                style={{ marginTop: 6, width: 250 }}
                                value={this.state.isCanCancel ? 1 : 2}
                                onChange={this.onChangeCancel}
                                disabled={typeDialog === 2 ? true : false}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    <div className="partner-image-container">
                        <div className="partner-image-item">
                            <div className="partner-image-hint">
                                <span>*</span>三证合一照片&nbsp;:
                            </div>
                            <div className="partner-dialog-upload"
                                style={{ width: 250 }}
                                onMouseOver={this.onMouseUp}
                                onMouseOut={this.onMouseLeave}>
                                <div className="upload-content">
                                    <div className="upload-hint"
                                        style={{ visibility: isEmpty(this.state.partner_cert_img_url) ? "visible" : "hidden" }}>
                                        <Icon type="plus" />
                                        上传
                                    </div>
                                    <div className="upload-image-div">
                                        <img src={this.state.partner_cert_img_url}
                                            style={{ visibility: !isEmpty(this.state.partner_cert_img_url) ? "visible" : "hidden" }}
                                            alt="三证合一照片" className="upload-image" />
                                        <div className="upload-overlay"
                                            style={{ visibility: this.state.isVisiblePre }}>
                                            <div onClick={this.onPreviewImage}><Icon type="eye-o"
                                                style={{ color: "#fff" }} /></div>
                                            <div onClick={this.onDeleteImage}
                                                style={{ display: typeDialog !== 2 && isCanUpdata ? "block" : "none" }}>
                                                <Icon
                                                    type="delete"
                                                    style={{ color: "#fff" }} /></div>
                                        </div>
                                    </div>
                                </div>
                                <input className="organization-input"
                                    type="file"
                                    value=""
                                    // id="file"
                                    onChange={this.onChangeImage}
                                    style={{ display: isEmpty(this.state.partner_cert_img_url) ? "block" : "none" }}
                                    accept="image/png, image/jpeg, image/gif, image/jpg" />
                                <Modal visible={this.state.isCanPreview} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={this.state.partner_cert_img_url} />
                                </Modal>
                            </div>
                        </div>
                        <div className="partner-image-empty-hint"
                            style={{ visibility: isEmptyImage ? "visible" : "hidden" }}>
                            <span>{this.state.isImageHint}</span></div>
                    </div>

                </div>
            </div>
        </Modal>);
    }
}

export default PartnerDialog;
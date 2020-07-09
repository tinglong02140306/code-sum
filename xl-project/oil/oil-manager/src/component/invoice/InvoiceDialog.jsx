import React from 'react';
import {Modal, Input, Button} from 'antd';
import {observer, inject} from 'mobx-react';
import {isEmpty} from '../../utils/isEmpty'
import "./InvoiceDialog.scss"
import {isSpecialChart} from "../../utils/isSpecialChart";

@inject("invoiceStore")
@observer
class InvoiceDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            org_id: "",
            org_name: "",
            org_tax_no: "",
            org_address: "",
            org_mobile: "",
            org_bank_name: "",
            org_bank_account_id: "",
            oil_name: "",
            oil_unit: "",
            oil_num: "",
            oil_price: "",
            amt: "",
            fax_rat: "",
            pre_invoice_mark_no: "",
            invoice_no: "",
            gmt_create: "",
            isInvoiceNoEmpty: false,
        };
    }

    //取消
    onCancel=()=>{
        this.props.invoiceStore.setIsShowInvoiceDialog(false);
    }
    //提交
    onSubmit = ()=>{

        // const pager = {...this.props.invoiceStore.pagination};
        // pager.current = pagination.current;
        // this.props.invoiceStore.setPagination(pagination);

        const {id,invoice_no,pre_invoice_mark_no} = this.state;

        if (isEmpty(invoice_no) && isSpecialChart(invoice_no)) {
            this.setState({isInvoiceNoEmpty:true});
        }else {
            this.setState({isInvoiceNoEmpty:false});
            this.props.invoiceStore.getUpdateInvoiceSingle(id, invoice_no, pre_invoice_mark_no)

        }

    }
    onChange=()=>{
    }
    onChangeInvoice=(e)=>{
        this.setState({invoice_no: e.target.value});
    }

    componentDidMount() {
        const {
            id, org_id,org_name, org_tax_no, org_address, org_mobile, org_bank_name,
            org_bank_account_id, oil_name, oil_unit, oil_num, oil_price, amt, fax_rat,
            pre_invoice_mark_no, invoice_no,gmt_create
        } = this.props.invoiceStore.invoiceObject;

        this.setState({
            id: id,
            org_id: org_id,
            org_name: org_name,
            org_tax_no: org_tax_no,
            org_address: org_address,
            org_mobile: org_mobile,
            org_bank_name: org_bank_name,
            org_bank_account_id: org_bank_account_id,
            oil_name: oil_name,
            oil_unit: oil_unit,
            oil_num: oil_num,
            oil_price: oil_price,
            amt: amt,
            fax_rat: fax_rat,
            pre_invoice_mark_no: pre_invoice_mark_no,
            invoice_no: invoice_no,
            gmt_create: gmt_create
        });
    }

    render() {
        const {isShowInvoiceDialog,type,isShowLeadLoading} = this.props.invoiceStore;
        const {
            id, org_id,org_name, org_tax_no, org_address, org_mobile, org_bank_name, gmt_create,
            org_bank_account_id, oil_name, oil_unit, oil_num, oil_price, amt, fax_rat, pre_invoice_mark_no, invoice_no
        } = this.state;
        return (<Modal

            title={type === 1 ? "查看" : "添加发票号"}
            width={800}
            onCancel={this.onCancel}
            visible={isShowInvoiceDialog}
            footer={type === 1 ? [
                <Button key="back" type="primary" onClick={this.oancel}>确定</Button>,] : [
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit} loading={isShowLeadLoading}>提交</Button>,]}>
            <div className="invoice-dialog-container">
                <div className="invoice-dialog-left">
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;序&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;:</div>
                        <Input
                            style={{width: 250, margin: 0}}
                            value={id}
                            disabled={true}
                            onChange={this.onChange}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;构&nbsp;&nbsp;号&nbsp;&nbsp;:</div>
                        <Input
                            onChange={this.onChange}
                            value={org_id}
                            disabled={true}
                            style={{width: 250, margin: 0}}/>
                    </div>

                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;公&nbsp;司&nbsp;名&nbsp;称&nbsp;:</div>
                        <Input.TextArea
                            autosize={{minRows: 1}}
                            value={org_name}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;公&nbsp;司&nbsp;税&nbsp;号&nbsp;:</div>
                        <Input
                            value={org_tax_no}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;公&nbsp;司&nbsp;地&nbsp;址&nbsp;:</div>
                        <Input.TextArea
                            value={org_address}
                            disabled={true}
                            onChange={this.onChange}
                            placeholder="最多200字"
                            maxLength={200}
                            autosize={{minRows: 1}}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;公&nbsp;司&nbsp;电&nbsp;话&nbsp;:</div>
                        <Input
                            value={org_mobile}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"> &nbsp;&nbsp;开户行名称&nbsp;:</div>
                        <Input.TextArea
                            autosize={{minRows: 1}}
                            value={org_bank_name}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="children-dialog-input-title"> &nbsp;&nbsp;开&nbsp;户&nbsp;行&nbsp;号&nbsp;:</div>
                        <Input
                            value={org_bank_account_id}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="children-dialog-input-title"> &nbsp;&nbsp;创&nbsp;建&nbsp;时&nbsp;间&nbsp;:</div>
                        <Input
                            value={gmt_create}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                </div>
                <div className="invoice-dialog-center"/>
                <div className="invoice-dialog-left">
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">货物名称:</div>
                        <Input
                            value={oil_name}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">计量单位:</div>
                        <Input
                            value={oil_unit}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量&nbsp;:</div>
                        <Input
                            value={oil_num}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价&nbsp;:</div>
                        <Input
                            value={oil_price}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额&nbsp;:</div>
                        <Input
                            value={amt}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率&nbsp;:</div>
                        <Input
                            value={fax_rat}
                            disabled={true}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title">标&nbsp;记&nbsp;号&nbsp;:
                        </div>
                        <Input.TextArea
                            disabled={true}
                            value={pre_invoice_mark_no}
                            maxLength={30}
                            autosize={{minRows:1}}
                            onChange={this.onChange}
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-input-item">
                        <div className="invoice-dialog-input-title"><span style={{display: type===2 ? "block": "none"}}>*</span>发&nbsp;票&nbsp;号&nbsp;:</div>
                        <Input.TextArea
                            value={invoice_no}
                            maxLength={30}
                            autosize={{minRows:1}}
                            disabled={type === 2 ? false : true}
                            onChange={type === 2 ? this.onChangeInvoice : this.onChange }
                            style={{width: 250, margin: 0}}/>
                    </div>
                    <div className="invoice-dialog-empty-hint"
                         style={{visibility: this.state.isInvoiceNoEmpty ? "visible" : "hidden"}}>请输入发票号(不包含特殊字符)
                    </div>

                </div>
            </div>

        </Modal>);
    }
}

export default InvoiceDialog;
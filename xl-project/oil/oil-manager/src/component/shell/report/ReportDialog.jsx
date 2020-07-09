import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./ReportDialog.scss";

@inject("reportStore")
@observer
class ReportDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            id: "",
            order_no: "",
            terminal_id: "",
            order_amount: "",
            discount_amount: "",
            payment_amount: "",
            cost_amount: "",
            oil_type: "",
            oil_detail: "",
            cost_price: "",
            list_price: "",
            oil_num: "",
            consume_date: "",
            xl_price: "",
            payable_amount: "",
        };
    }

    //取消
    onCancel = () => {
        this.props.reportStore.setIsShowDialog(false)
    }
    onChange =()=>{

    }
    componentDidMount() {
        const {
            id, order_no, terminal_id, order_amount,discount_amount,payment_amount,cost_amount,oil_type,oil_detail,cost_price,list_price,oil_num,consume_date,xl_price,payable_amount
        } = this.props.reportStore.reportObject;

        let oilType = "";
        if (oil_type==="0"){
            oilType="汽油";
        } else {
            oilType="柴油"
        }

        this.setState({
            id: id,
            order_no: order_no,
            terminal_id: terminal_id,
            order_amount: order_amount,
            discount_amount: discount_amount,
            payment_amount: payment_amount,
            cost_amount: cost_amount,
            oil_type: oilType,
            oil_detail: oil_detail,
            cost_price: cost_price,
            list_price: list_price,
            oil_num: oil_num,
            consume_date: consume_date,
            xl_price: xl_price,
            payable_amount: payable_amount,
        });
    }

    render() {
        const {isShowDialog} = this.props.reportStore;
        const {
            id, order_no, terminal_id, order_amount,discount_amount,payment_amount,cost_amount,oil_type,oil_detail,cost_price,list_price,oil_num,consume_date,xl_price,payable_amount
        } = this.state;
        return (
            <Modal
                visible={isShowDialog}
                title={"查看"}
                onCancel={this.onCancel}
                width={800}
                footer={[<Button key="submit" type="primary" onClick={this.onCancel}>确定</Button>]}>
                <div className="report-dialog-container">
                    <div className="waybill-dialog-left">
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID:</div>
                            <Input
                                disabled={true}
                                style={{width: 250, margin: 0}}
                                value={id}
                                onChange={this.onChange}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">消费订单号:</div>
                            <Input.TextArea
                                disabled={true}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                value={order_no}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">终端号:
                            </div>
                            <Input.TextArea
                                disabled={true}
                                value={terminal_id}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">订单金额:</div>
                            <Input
                                disabled={true}
                                value={order_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">应付金额:</div>
                            <Input
                                disabled={true}
                                value={payable_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">折扣金额:</div>
                            <Input
                                disabled={true}
                                value={discount_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">实付金额:</div>
                            <Input
                                disabled={true}
                                value={payment_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">成本金额:</div>
                            <Input
                                disabled={true}
                                value={cost_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                    <div className="report-dialog-center"/>
                    <div className="report-dialog-left">
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">油品类型:</div>
                            <Input
                                disabled={true}
                                value={oil_type}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">油品详情:</div>
                            <Input
                                disabled={true}
                                value={oil_detail}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">成本单价:</div>
                            <Input
                                disabled={true}
                                value={cost_price}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">油机单价:</div>
                            <Input
                                disabled={true}
                                value={list_price}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">信联单价:</div>
                            <Input
                                disabled={true}
                                value={xl_price}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">油品数量:</div>
                            <Input
                                disabled={true}
                                value={oil_num}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="report-dialog-input-item">
                            <div className="report-dialog-input-title">消费时间:</div>
                            <Input
                                disabled={true}
                                value={consume_date}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                </div>

            </Modal>);
    }
}

export default ReportDialog;
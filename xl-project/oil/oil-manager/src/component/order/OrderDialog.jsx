import React from 'react';
import {Modal, Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./OrderDialog.scss";

@inject("orderStore")
@observer
class OrderDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            etc_card_no: "",
            partner_name: "",
            out_order_no: "",
            partner_id: "",
            user_id: "",
            out_user_id: "",
            user_name: "",
            user_mobile: "",
            user_cert_id: "",
            user_plate_no: "",
            user_plate_color: "",
            terminal_id: "",
            order_no: "",
            card_id: "",
            consume_time: "",
            order_status: "",
            order_payment: "",
            total_amount: "",
            discount_amount: "",
            actual_amount: "",
            oil_type: "",
            oil_price: "",
            oil_num: "",
            oil_detail: ""
        };
    }

    onCancel = () => {
        this.props.orderStore.setIsShowOrderDialog(false);
    }

    onOk = () => {
        this.props.orderStore.setIsShowOrderDialog(false);
    }

    onChange =()=>{

    }

    componentDidMount() {
        const {etc_card_no,partner_name, out_order_no,
            partner_id, user_id, order_no, card_id, consume_time, order_status, order_payment,
            out_user_id,user_name,user_mobile,user_cert_id,user_plate_no,user_plate_color,terminal_id,
            total_amount, discount_amount, actual_amount, oil_type, oil_price, oil_num, oil_detail
        } = this.props.orderStore.orderChildrenObject;

        //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付
        let payWay = "";
        if (order_payment==="01"){
            payWay = "余额支付";
        } else if (order_payment==="02"){
            payWay="银联支付";
        } else if (order_payment==="03"){
            payWay="支付宝支付";
        }else if (order_payment==="04"){
            payWay="微信支付";
        }else if (order_payment==="05"){
            payWay="合作方支付";
        }

        let oilType = "";
        if (oil_type ==='0'){
            oilType="汽油";
        } else if (oil_type ==='1'){
            oilType="汽油";
        }else {
            oilType="--"
        }

        //00-订单创建，03-消费成功，04-消费失败，05-订单取消
        let orderStatus = "";
        if (order_status==="00"){
            orderStatus = "订单创建";
        } else if (order_status==="03"){
            orderStatus="消费成功";
        } else if (order_status==="04"){
            orderStatus="消费失败";
        } else if (order_status==="05"){
            orderStatus="订单取消";
        }
        this.setState({
            etc_card_no: etc_card_no,
            partner_name: partner_name,
            out_order_no: out_order_no,
            partner_id: partner_id,
            user_id: user_id,
            order_no: order_no,
            card_id: card_id,
            out_user_id: out_user_id,
            user_name: user_name,
            user_mobile: user_mobile,
            user_cert_id: user_cert_id,
            user_plate_no: user_plate_no,
            user_plate_color: user_plate_color,
            terminal_id: terminal_id,
            consume_time: consume_time,
            order_status: orderStatus,
            order_payment: payWay,
            total_amount: total_amount,
            discount_amount: discount_amount,
            actual_amount: actual_amount,
            oil_type: oilType,
            oil_price: oil_price,
            oil_num: oil_num,
            oil_detail: oil_detail
        });
    }

    render() {
        const {isShowOrderDialog} = this.props.orderStore;
        const {etc_card_no,partner_name, out_order_no,
            partner_id, user_id, order_no, card_id, consume_time, order_status, order_payment,
            out_user_id,user_name,user_mobile,user_cert_id,user_plate_no,user_plate_color,terminal_id,
            total_amount, discount_amount, actual_amount, oil_type, oil_price, oil_num, oil_detail
        } = this.state;
        return (<div>
            <Modal visible={isShowOrderDialog}
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   title="查看"
                   okText="确定"
                   width={800}>
                <div className="order-dialog-container">
                    <div className="order-dialog-left">
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">合作方ID:</div>
                            <Input
                                style={{width: 250, margin: 0}}
                                value={partner_id}
                                disabled={true}
                                onChange={this.onChange}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">订&nbsp;单&nbsp;号&nbsp;:</div>
                            <Input.TextArea
                                value={order_no}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                disabled={true}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">用&nbsp;户&nbsp;名&nbsp;:</div>
                            <Input
                                value={user_name}
                                onChange={this.onChange}
                                disabled={true}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">合作方名称:</div>
                            <Input
                                value={partner_name}
                                disabled={true}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">用户手机:</div>
                            <Input
                                value={user_mobile}
                                disabled={true}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:
                            </div>
                            <Input
                                value={card_id}
                                disabled={true}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">终端编号:
                            </div>
                            <Input
                                disabled={true}
                                value={terminal_id}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        {/*<div className="order-dialog-input-item">*/}
                            {/*<div className="order-dialog-input-title">第三方用户号:*/}
                            {/*</div>*/}
                            {/*<Input*/}
                                {/*disabled={true}*/}
                                {/*value={out_user_id}*/}
                                {/*onChange={this.onChange}*/}
                                {/*style={{width: 250, margin: 0}}/>*/}
                        {/*</div>*/}
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">第三方订单号:
                            </div>
                            <Input
                                disabled={true}
                                value={out_order_no}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div><div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">ETC卡号:
                            </div>
                            <Input
                                disabled={true}
                                value={etc_card_no}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                    <div className="order-dialog-center"></div>
                    <div className="order-dialog-left">
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">消费时间:</div>
                            <Input
                                disabled={true}
                                value={consume_time}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">订单状态:</div>
                            <Input
                                disabled={true}
                                value={order_status}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">支付方式:</div>
                            <Input
                                disabled={true}
                                value={order_payment}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">总&nbsp;金&nbsp;额&nbsp;:</div>
                            <Input
                                disabled={true}
                                value={total_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">折扣金额:</div>
                            <Input
                                disabled={true}
                                value={discount_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">实际金额:</div>
                            <Input
                                disabled={true}
                                value={actual_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">油品类型:</div>
                            <Input
                                disabled={true}
                                value={oil_type}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">油品单价:</div>
                            <Input
                                disabled={true}
                                value={oil_price}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">油品数量:</div>
                            <Input
                                disabled={true}
                                value={oil_num}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="order-dialog-input-item">
                            <div className="order-dialog-input-title">油品详情:</div>
                            <Input
                                disabled={true}
                                value={oil_detail}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>);
    }
}

export default OrderDialog;
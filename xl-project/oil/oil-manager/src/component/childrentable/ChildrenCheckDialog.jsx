import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./ChildrenCheckDialog.scss";

@inject("childStore")
@observer
class SystemPreviewResetDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            partner_id: "",
            org_id: "",
            user_id: "",
            sub_order_no: "",
            sub_card_id: "",
            sub_actual_amount: "",
            out_sub_order_no: "",
            sub_create_time: null,
        };
    }

    //取消
    onCancel = () => {
        this.props.childStore.setIsShowDialog(false)
    }
    onChange =()=>{

    }
    componentDidMount() {
        const {
            partner_id, org_id, user_id, sub_order_no, sub_card_id, sub_actual_amount, out_sub_order_no, sub_create_time
        } = this.props.childStore.childrenItem;

        this.setState({
            partner_id: partner_id,
            org_id: org_id,
            user_id: user_id,
            sub_order_no: sub_order_no,
            sub_card_id: sub_card_id,
            sub_actual_amount: sub_actual_amount,
            out_sub_order_no: out_sub_order_no,
            sub_create_time: sub_create_time,
        });
    }

    render() {
        const {isShowDialog} = this.props.childStore;
        const {
            partner_id, org_id, sub_order_no, sub_card_id, sub_actual_amount, out_sub_order_no, sub_create_time
        } = this.state;
        return (
            <Modal
                visible={isShowDialog}
                title={"查看"}
                onCancel={this.onCancel}
                width={800}
                footer={[<Button key="submit" type="primary" onClick={this.onCancel}>确定</Button>]}>
                <div className="children-dialog-container">
                    <div className="children-dialog-left">
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title">合作方ID:</div>
                            <Input
                                disabled={true}
                                style={{width: 250, margin: 0}}
                                value={partner_id}
                                onChange={this.onChange}/>
                        </div>
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title">机&nbsp;构&nbsp;号&nbsp;:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={org_id}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title">子订单号:
                            </div>
                            <Input.TextArea
                                disabled={true}
                                value={sub_order_no}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title">子&nbsp;卡&nbsp;号&nbsp;:</div>
                            <Input
                                disabled={true}
                                value={sub_card_id}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                    <div className="children-dialog-center"/>
                    <div className="children-dialog-left">
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title"> &nbsp;&nbsp;子&nbsp;订&nbsp;单&nbsp;金&nbsp;额&nbsp;:</div>
                            <Input
                                disabled={true}
                                value={sub_actual_amount}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title">第三方子订单号:</div>
                            <Input.TextArea
                                disabled={true}
                                value={out_sub_order_no}
                                autosize={{minRows: 1}}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="children-dialog-input-item">
                            <div className="children-dialog-input-title"> &nbsp; 创&nbsp;&nbsp;&nbsp;建&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;间&nbsp;:</div>
                            <Input
                                disabled={true}
                                value={sub_create_time}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                </div>

            </Modal>);
    }
}

export default SystemPreviewResetDialog;
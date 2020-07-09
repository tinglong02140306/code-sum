import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./WaybillDialog.scss";

@inject("waybillStore")
@observer
class SystemPreviewResetDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            org_id: "",
            user_id: "",
            out_user_id: "",
            bill_no: "",
            bill_total_money: "",
            bill_oil_money: "",
            bill_occur_time: "",

        };
    }

    //取消
    onCancel = () => {
        this.props.waybillStore.setIsShowWaybillDialog(false)
    }
    onChange =()=>{

    }
    componentDidMount() {
        const {
            org_id, user_id, out_user_id, bill_no,bill_total_money,bill_oil_money,bill_occur_time
        } = this.props.waybillStore.waybillObject;

        this.setState({
            org_id: org_id,
            user_id: user_id,
            out_user_id: out_user_id,
            bill_no: bill_no,
            bill_total_money: bill_total_money,
            bill_oil_money: bill_oil_money,
            bill_occur_time: bill_occur_time,
        });
    }

    render() {
        const {isShowWaybillDialog} = this.props.waybillStore;
        const {
            org_id, user_id, out_user_id, bill_no,bill_total_money,bill_oil_money,bill_occur_time
        } = this.state;
        return (
            <Modal
                visible={isShowWaybillDialog}
                title={"查看"}
                onCancel={this.onCancel}
                width={800}
                footer={[<Button key="submit" type="primary" onClick={this.onCancel}>确定</Button>]}>
                <div className="waybill-dialog-container">
                    <div className="waybill-dialog-left">
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机构方ID:</div>
                            <Input
                                disabled={true}
                                style={{width: 250, margin: 0}}
                                value={org_id}
                                onChange={this.onChange}/>
                        </div>
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用&nbsp;户&nbsp;号&nbsp;:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={user_id}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运&nbsp;单&nbsp;号&nbsp;:
                            </div>
                            <Input.TextArea
                                disabled={true}
                                value={bill_no}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title">第三方用户号:</div>
                            <Input.TextArea
                                disabled={true}
                                value={out_user_id}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                    <div className="waybill-dialog-center"/>
                    <div className="waybill-dialog-left">
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title">总&nbsp;金&nbsp;额&nbsp;&nbsp;:</div>
                            <Input
                                disabled={true}
                                value={bill_total_money}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title"> 油费金额:</div>
                            <Input
                                disabled={true}
                                value={bill_oil_money}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="waybill-dialog-input-item">
                            <div className="waybill-dialog-input-title"> 发生时间:</div>
                            <Input
                                disabled={true}
                                value={bill_occur_time}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                </div>

            </Modal>);
    }
}

export default SystemPreviewResetDialog;
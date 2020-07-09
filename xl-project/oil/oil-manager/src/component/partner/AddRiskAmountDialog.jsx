import React from 'react';
import {Modal, Button, Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./AddRiskAmountDialog.scss";
import {isRangeNum} from "../../utils/isRangeNum";
import {getFixed} from "../../utils/getFixed";

@inject("partner")
@observer
class AddRiskAmountDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            risk_amount_add: "",
            isErrorAmount:false
        };
    }

    onCancelRisk = () => {
        this.props.partner.setIsShowRiskDialog(false);
    }

    onSubmit = () => {
        if (isRangeNum(this.state.risk_amount_add,99999999.99)) {
            this.setState({isErrorAmount:false});
            this.props.partner.getAddRiskAmount(this.props.partner.partnerItem.partner_id, getFixed(this.state.risk_amount_add));
        }else {
            this.setState({isErrorAmount:true});
        }
    }

    onChangeRiskAmountAdd = (e) => {
        this.setState({
            risk_amount_add: e.target.value
        });
    }

    render() {
        const {partnerItem, isShowRiskDialog, isAddRiskLoading} = this.props.partner;
        const {risk_amount_add,isErrorAmount} = this.state;
        return (
            <Modal
                title="增加风控金额"
                visible={isShowRiskDialog}
                onCancel={this.onCancelRisk}
                footer={
                    [<Button key="back" onClick={this.onCancelRisk}>取消</Button>,
                        <Button type="primary" key="submit" onClick={this.onSubmit}
                                loading={isAddRiskLoading}>确认</Button>]}>
                <div className="add-risk-dialog-container">
                    <div className="add-risk-dialog-input-item">
                        <div>合作方id:</div>
                        <Input
                            value={partnerItem.partner_id}
                            style={{width: 250, margin: 0}}
                            disabled={true}/>
                    </div>
                    <div className="add-risk-dialog-input-item">
                        <div>风控金额总额:</div>
                        <Input
                            value={partnerItem.risk_amount_limit}
                            style={{width: 250, margin: 0}}
                            disabled={true}/>
                    </div>
                    <div className="add-risk-dialog-input-item">
                        <div>已用风控金额:</div>
                        <Input
                            value={partnerItem.risk_amount_used}
                            style={{width: 250, margin: 0}}
                            disabled={true}/>
                    </div>
                    <div className="add-risk-dialog-input-item">
                        <div>剩余风控金额:</div>
                        <Input
                            value={parseFloat(partnerItem.risk_amount_limit - partnerItem.risk_amount_used).toFixed(2)}
                            style={{width: 250, margin: 0}}
                            disabled={true}/>
                    </div>
                    <div className="add-risk-dialog-input">
                        <div className="add-risk-dialog-input-item">
                            <div>增加风控金额:</div>
                            <Input
                                value={risk_amount_add}
                                placeholder="上限99999999.99"
                                onChange={this.onChangeRiskAmountAdd}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="add-risk-dialog-input-empty" style={{visibility: isErrorAmount ? "visible" : "hidden"}}>
                            <span>请输入要增加的风控金额,上限99999999.99</span>
                        </div>
                    </div>

                </div>
            </Modal>
        );
    }
}

export default AddRiskAmountDialog;
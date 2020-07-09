import React from 'react';
import {Modal, Button, Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./ActivityCountDialog.scss";

@inject("activityCountStore")
@observer
class ActivityCountDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            activity_id: "",
            activity_name: "",
            activity_start_date: "",
            activity_end_date: "",
            activity_status: "",
            coupon_total_amount: "",
            coupon_used_amount: "",
            coupon_unused_amount: "",
            coupon_user_total: "",
            money_total_amount: "",
            money_used_amount: "",
            money_unused_amount: ""

        };
    }

    //取消
    onCancel = () => {
        this.props.activityCountStore.setIsShowDialog(false)
    }
    onChange = () => {

    }


    componentDidMount() {
        const {
            activity_id, activity_name, activity_start_date, activity_end_date, activity_status, coupon_total_amount, coupon_used_amount, coupon_unused_amount, coupon_user_total, money_total_amount, money_used_amount, money_unused_amount
        } = this.props.activityCountStore.activityCountObject;

        this.setState({
            activity_id: activity_id,
            activity_name: activity_name,
            activity_start_date: activity_start_date,
            activity_end_date: activity_end_date,
            activity_status: activity_status,
            coupon_total_amount: coupon_total_amount,
            coupon_used_amount: coupon_used_amount,
            coupon_unused_amount: coupon_unused_amount,
            coupon_user_total: coupon_user_total,
            money_total_amount: money_total_amount,
            money_used_amount: money_used_amount,
            money_unused_amount: money_unused_amount
        });
    }

    render() {
        const {isShowDialog, isShowInviteLoading} = this.props.activityCountStore;
        const {
            activity_id, activity_name, activity_start_date, activity_end_date, activity_status, coupon_total_amount, coupon_used_amount, coupon_unused_amount, coupon_user_total, money_total_amount, money_used_amount, money_unused_amount
        } = this.state;
        return (
            <Modal
                visible={isShowDialog}
                title={"查看信息"}
                onCancel={this.onCancel}
                width={800}
                footer={[<Button key="submit" type="primary"
                                 onClick={this.onCancel}>确定</Button>]}>
                <div className="activity-count-dialog-container">
                    <div className="activity-count-dialog-left">
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动ID:</div>
                            <Input
                                disabled={true}
                                style={{width: 200, margin: 0}}
                                value={activity_id}
                                onChange={this.onChange}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动名称:</div>
                            <Input.TextArea
                                autosize={{minRows: 1}}
                                disabled={true}
                                onChange={this.onChange}
                                value={activity_name}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开始日期:</div>
                            <Input
                                disabled={true}
                                value={activity_start_date}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={activity_end_date}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动状态:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={activity_status}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">优惠券发放量:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={coupon_total_amount}
                                style={{width: 200, margin: 0}}/>
                        </div>
                    </div>
                    <div className="activity-count-dialog-center"/>
                    <div className="activity-count-dialog-left">
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;优惠券使用量:</div>
                            <Input
                                disabled={true}
                                value={coupon_used_amount}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">优惠券未使用量:</div>
                            <Input
                                disabled={true}
                                value={coupon_unused_amount}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">优惠券领取人数:</div>
                            <Input
                                disabled={true}
                                value={coupon_user_total}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;预算资金总量:</div>
                            <Input
                                disabled={true}
                                value={money_total_amount}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">预算资金使用量:</div>
                            <Input
                                disabled={true}
                                value={money_used_amount}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                        <div className="activity-count-dialog-input-item">
                            <div className="activity-count-dialog-input-title">预算资金剩余量:</div>
                            <Input
                                disabled={true}
                                value={money_unused_amount}
                                onChange={this.onChange}
                                style={{width: 200, margin: 0}}/>
                        </div>
                    </div>
                </div>

            </Modal>);
    }
}

export default ActivityCountDialog;
import React from 'react';
import './ActivityManageModal.scss';
import {isMoney} from '../../../utils/isMoney';
import {isEmpty} from '../../../utils/isEmpty';
import {Modal, Button, Input, DatePicker, Radio} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';

@inject("activityManageStore")
@observer
class ActivityManageModal extends React.Component {

    constructor() {
        super();
        this.state = {
            activity_name: null,
            activity_start_date: null,
            activity_end_date: null,
            activity_status: 0,
            activity_total_amount: null,
            isEmptyName: false,
            isEmptyAmount: false,
            isEmptyStartDate: false,
            isEmptyEndDate: false,
            endOpen: false
        };
    }

    componentDidMount() {
        const {typeModal, activityObject} = this.props.activityManageStore;
        if (typeModal !== 2 && activityObject != null) {
            this.setState({
                activity_name: activityObject.activity_name,
                activity_start_date: moment(activityObject.activity_start_date),
                activity_end_date: moment(activityObject.activity_end_date),
                activity_status: activityObject.activity_status,
                activity_total_amount: activityObject.activity_total_amount
            });
        }
    }

    /**
     *
     * @param submitData
     * @param oldData
     */
    onDealUpdate(submitData,oldData){
        if (submitData===oldData){
            return null
        }
        return submitData
    }

    isCanUpdate(activity_name_result,activity_start_date_result,activity_end_date_result,activity_status_result,activity_total_amount_result){
        if (!activity_name_result&&!activity_start_date_result&&!activity_end_date_result&&!activity_status_result&&!activity_total_amount_result){
            return false
        } else {
            return true
        }
    }

    onCancel = () => {
        this.props.activityManageStore.setIsShowActivityManageModal(0, false, null);
    }

    onOk = () => {
        const {activity_name, activity_start_date, activity_end_date, activity_status, activity_total_amount} = this.state;
        const {typeModal, activityObject} = this.props.activityManageStore;
        const checkResult = this.checkInfo();
        if (checkResult) {
            if (typeModal === 1) {//修改
                const activity_name_result = this.onDealUpdate(activity_name,activityObject.activity_name);
                const activity_start_date_result = this.onDealUpdate(activity_start_date,activityObject.activity_start_date);
                const activity_end_date_result = this.onDealUpdate(activity_end_date,activityObject.activity_end_date);
                const activity_status_result = this.onDealUpdate(activity_status,activityObject.activity_status);
                const activity_total_amount_result = this.onDealUpdate(activity_total_amount,activityObject.activity_total_amount);
                if (this.isCanUpdate(activity_name_result, activity_start_date_result, activity_end_date_result, activity_status_result, activity_total_amount_result)){
                    this.props.activityManageStore.getUpdateActivity(activityObject.id,
                        activity_name_result,
                        activity_start_date_result, activity_end_date_result,
                        activity_status_result, activity_total_amount_result, () => {
                            this.props.onClicked();
                        })
                } else {
                    this.props.activityManageStore.setIsShowActivityManageModal(0,false,null);
                }
            } else {//新增
                this.props.activityManageStore.getAddActivity(activity_name, activity_start_date, activity_end_date,
                    activity_status, activity_total_amount,()=>{
                        this.props.onClicked();
                    });
            }
        }
    }

    /**
     * 提交前的校验
     */
    checkInfo = () => {
        const {activity_name, activity_start_date, activity_end_date, activity_total_amount} = this.state;
        if (isEmpty(activity_name)) {
            this.setState({
                isEmptyName: true
            });
            return false
        } else {
            this.setState({
                isEmptyName: false
            });
        }

        if (isEmpty(activity_start_date)) {
            this.setState({
                isEmptyStartDate: true
            });
            return false
        } else {
            this.setState({
                isEmptyStartDate: false
            });
        }

        if (isEmpty(activity_end_date)) {
            this.setState({
                isEmptyEndDate: true
            });
            return false
        } else {
            this.setState({
                isEmptyEndDate: false
            });
        }

        if (isMoney(activity_total_amount)) {
            this.setState({
                isEmptyAmount: false
            });
        } else {
            this.setState({
                isEmptyAmount: this.render()
            });
            return false
        }

        return true
    }

    /**
     * 活动名称
     */
    onActivityNameChange = (e) => {
        this.setState({
            activity_name: e.target.value
        });
    }

    /**
     * 活动状态
     */
    onActivityStatusChange = (e) => {
        this.setState({
            activity_status: e.target.value
        });
    }

    /**
     * 预算金额
     */
    onActivityAmountChange = (e) => {
        this.setState({
            activity_total_amount: e.target.value
        });
    }

    /**
     * 开始日期
     * @param value
     */
    onStartChange = (value) => {
        this.setState({activity_start_date: value});
        this.onChange('startValue', value);
    }

    /**
     * 结束日期
     * @param value
     */
    onEndChange = (value) => {
        this.setState({activity_end_date: value});
        this.onChange('endValue', value);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.activity_end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.activity_start_date;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    getTitle = (typeModal) => {
        let title = "";
        switch (typeModal) {
            case 0:
                title = "查看";
                break
            case 1:
                title = "修改";
                break
            case 2:
                title = "新增";
                break
        }
        return title
    }

    render() {
        const {
            activity_name, activity_start_date, activity_end_date, activity_status, activity_total_amount,
            isEmptyName, isEmptyAmount, isEmptyStartDate, isEmptyEndDate
        } = this.state;
        const {isShowActivityManageModal, typeModal, isShowActivityManageModalLoading} = this.props.activityManageStore;
        const title = this.getTitle(typeModal);
        return (<Modal
            width={700}
            title={title}
            onCancel={this.onCancel}
            visible={isShowActivityManageModal}
            footer={typeModal === 0 ?
                [<Button type="primary" key="back" onClick={this.onCancel}>确定</Button>] : [
                    <Button key="back" onClick={this.onCancel}>取消</Button>,
                    <Button key="submit" onClick={this.onOk} loading={isShowActivityManageModalLoading}
                            type="primary">提交</Button>]}>
            <div className="activity-manage-modal-container">
                <div className="activity-manage-modal-item">
                    <div className="activity-manage-modal-input-box">
                        <div className="activity-manage-modal-input-hint"><span>*</span>活动名称:</div>
                        <Input.TextArea
                            maxLength={100}
                            value={activity_name}
                            autosize={{minRows: 1}}
                            disabled={typeModal === 0}
                            placeholder="请输入优惠券名称"
                            onChange={this.onActivityNameChange}/>
                    </div>
                    <div className="activity-manage-modal-input-error-hint"
                         style={{visibility: isEmptyName ? 'visible' : 'hidden'}}>请输入活动名称
                    </div>
                </div>
                <div className="activity-manage-modal-item">
                    <div className="activity-manage-modal-input-box">
                        <div className="activity-manage-modal-input-hint"><span>*</span>开始日期:</div>
                        <DatePicker
                            size="small"
                            disabled={typeModal === 0}
                            disabledDate={this.disabledStartDate}
                            format="YYYY-MM-DD"
                            value={activity_start_date}
                            placeholder="开始日期"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                        />
                    </div>
                    <div className="activity-manage-modal-input-error-hint"
                         style={{visibility: isEmptyStartDate ? 'visible' : 'hidden'}}>请选择开始日期
                    </div>
                </div>
                <div className="activity-manage-modal-item">
                    <div className="activity-manage-modal-input-box">
                        <div className="activity-manage-modal-input-hint"><span>*</span>结束日期:</div>
                        <DatePicker
                            size="small"
                            disabled={typeModal === 0}
                            disabledDate={this.disabledEndDate}
                            format="YYYY-MM-DD"
                            value={activity_end_date}
                            placeholder="结束日期"
                            onChange={this.onEndChange}
                            onOpenChange={this.handleEndOpenChange}
                        />
                    </div>
                    <div className="activity-manage-modal-input-error-hint"
                         style={{visibility: isEmptyEndDate ? 'visible' : 'hidden'}}>请选择结束日期
                    </div>
                </div>
                <div className="activity-manage-modal-item">
                    <div className="activity-manage-modal-input-box">
                        <div className="activity-manage-modal-input-hint"><span>*</span>活动状态:</div>
                        <Radio.Group onChange={this.onActivityStatusChange} value={activity_status}
                                     disabled={typeModal === 0}>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={1}>发布</Radio>
                            <Radio value={2}>失效</Radio>
                        </Radio.Group>
                    </div>
                    <div className="activity-manage-modal-input-error-hint" style={{visibility: 'hidden'}}>请选择结束日期</div>
                </div>
                <div className="activity-manage-modal-item">
                    <div className="activity-manage-modal-input-box">
                        <div className="activity-manage-modal-input-hint"><span>*</span>预算金额:</div>
                        <Input
                            maxLength={50}
                            value={activity_total_amount}
                            disabled={typeModal === 0}
                            placeholder="请输入预算金额"
                            onChange={this.onActivityAmountChange}/>
                    </div>
                    <div className="activity-manage-modal-input-error-hint"
                         style={{visibility: isEmptyAmount ? 'visible' : 'hidden'}}>请输入预算金额
                    </div>
                </div>
            </div>
        </Modal>);
    }
}

export default ActivityManageModal;
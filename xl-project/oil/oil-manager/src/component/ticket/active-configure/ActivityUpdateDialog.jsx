import React from 'react';
import './ActivityUpdateAllDialog.scss';
import {isMoney} from '../../../utils/isMoney';
import {isEmpty} from '../../../utils/isEmpty';
import {Modal, Button, Input, DatePicker, Radio,Icon} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import {addTreeProvence} from "../../../utils/utils";

@inject("activityManageStore")
@observer
class ActivityUpdateModal extends React.Component {

    constructor() {
        super();
        this.state = {
            current: 0,
            desc:[''],
            name:'',
            start_date:null,
            end_date:null,
            status:1,
            limit:{type:'',value:''},
            isNameEmpty:false,
            isStartDateEmpty:false,
            isEndDateEmpty:false,
            isStatusEmpty:false,
            isLimitEmpty:false,
            endOpen: false,
            isLimit: false,
            push_basis:'',
        };
    }

    componentDidMount() {
        const {updateTypeModal, activityObject} = this.props.activityManageStore;

        if (updateTypeModal !== 2 && activityObject != null) {
            if (activityObject.desc){
                if (activityObject.desc.length){
                    this.setState({desc:activityObject.desc})
                }
            }
            // if (activityObject.limit){
            //     if (activityObject.limit.length){
            //         this.setState({limit:activityObject.limit[0]})
            //     }
            // }
            if (activityObject.push_basis === '银行卡'){
                this.setState({push_basis:0})
            }else if (activityObject.push_basis === '加油卡'){
                this.setState({push_basis:1})
            }else if (activityObject.push_basis === '身份证'){
                this.setState({push_basis:2})
            }else if (activityObject.push_basis === '手机号'){
                this.setState({push_basis:3})
            }else if (activityObject.push_basis === '车牌号'){
                this.setState({push_basis:4})
            }else {
                this.setState({push_basis:''})
            }
            this.setState({
                name: activityObject.name,
                start_date: moment(activityObject.start_date),
                end_date: moment(activityObject.end_date),
                status: activityObject.status,
            });
        }
    }

    //活动名称
    onActivityNameChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    //开始日期
    onStartChange = (value) => {
        this.setState({start_date: value});
        this.onChange('startValue', value);
    }

    //结束日期
    onEndChange = (value) => {
        this.setState({end_date: value});
        this.onChange('endValue', value);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
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

    //描述
    onDescChange = (e) => {
        let descArr = this.state.desc;
        const array =  descArr.map((item,index) => {
            if (index == e.target.id){
                item = e.target.value;
            }
            return item;
        });
        this.setState({
            desc: array
        });
    }

    //活动状态
    onActivityStatusChange = (e) => {
        this.setState({
            status: e.target.value
        });
    }

    //投放依据
    onActivityPushBasisChange = (e) => {
        this.setState({
            push_basis:e.target.value
        });
    }

    //活动限制
    onActivityLimitChange = (e) => {
        this.setState({
            limit: {type:e.target.value,value:''}
        });
    }

    //活动限制描述
    onWhiteListChange = (e) => {
        this.setState({
            limit: {type:1,value:e.target.value}
        });
    }

    onOk = () => {
        const { push_basis,current, desc, name, start_date, end_date, status, limit} = this.state;
        const {updateTypeModal, activityObject} = this.props.activityManageStore;
        const checkResult = this.checkInfo();
        if (updateTypeModal === 1){
            if (checkResult) {
                const name_result = this.onDealUpdate(name,activityObject.name);
                const start_date_result = this.onDealUpdate(start_date,moment(activityObject.start_date));
                const end_date_result = this.onDealUpdate(end_date,moment(activityObject.end_date));
                const desc_result = this.onDealUpdate(desc,activityObject.desc);
                const push_basis_result = this.onDealUpdate(push_basis,activityObject.push_basis);
                // const limit_result = this.onDealUpdate(limit,activityObject.limit[0]);

                if (this.isCanUpdate(name_result, start_date_result, end_date_result, desc_result, push_basis_result)){
                    console.log(name_result, desc_result, push_basis_result)
                    this.props.activityManageStore.getUpdateActivity(
                        activityObject.id, name_result, start_date_result, end_date_result, desc_result, push_basis_result, () => {
                            this.props.onClicked();
                        })
                } else {
                    this.props.activityManageStore.setIsShowActivityUpdateModal(1,false,null);
                }
            }
        }else {
            this.props.activityManageStore.setIsShowActivityManageModal(0, false, null);
        }
    }
    onDealUpdate(submitData,oldData){
        if (submitData===oldData){
            return null
        }
        return submitData
    }

    isCanUpdate(name_result, start_date_result, end_date_result, desc_result, limit_result){
        if (!name_result&&!start_date_result&&!end_date_result&&!desc_result&&!limit_result){
            return false
        } else {
            return true
        }
    }

    /**
     * 提交前的校验
     */
    checkInfo = () => {
        const { name, start_date, end_date, limit} = this.state;

        if (isEmpty(name)) {
            this.setState({isNameEmpty: true});
            return false
        } else {
            this.setState({isNameEmpty: false});
        }
        if (isEmpty(start_date)) {
            this.setState({isStartDateEmpty: true});
            return false
        } else {
            this.setState({isStartDateEmpty: false});
        }
        if (isEmpty(end_date)) {
            this.setState({isEndDateEmpty: true});
            return false
        } else {
            this.setState({isEndDateEmpty: false});
        }
        // if (limit.type === 1 && isEmpty(limit.value)) {
        //     this.setState({isLimitEmpty: true});
        //     return false
        // } else {
        //     this.setState({isLimitEmpty: false});
        // }
        // if (isEmpty(status)) {
        //     this.setState({isStatusEmpty: true});
        //     return false
        // } else {
        //     this.setState({isStatusEmpty: false});
        // }

        return true
    }

    addDesc=(e)=>{
        let descArr = this.state.desc;
        descArr.push('');
        this.setState({
            desc:descArr
        });
    };

    removeDesc = (index) =>{
        let descArr = this.state.desc;
        if (descArr.length > 1){
            descArr.splice(index,1);
            this.setState({
                desc:descArr
            });
        }else {
            return;
        }
    }
    onPushBasisCancel = (e) => {
        this.setState({
            push_basis: ''
        });
    }
    getTitle = (updateTypeModal) => {
        let title = "";
        switch (updateTypeModal) {
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

    onCancel = () => {
        this.props.activityManageStore.setIsShowActivityUpdateModal(1, false, null);
    }
    render() {
        const {push_basis,isLimitEmpty,current, desc, name, start_date, end_date, status, limit,isNameEmpty, isStartDateEmpty, isEndDateEmpty, isStatusEmpty} = this.state;
        const {isShowActivityUpdateModal, updateTypeModal, isShowActivityManageModalLoading} = this.props.activityManageStore;
        const title = this.getTitle(updateTypeModal);
        return (<Modal
            width={900}
            title={title}
            onCancel={this.onCancel}
            visible={isShowActivityUpdateModal}
            footer={updateTypeModal === 0 ?
                [<Button type="primary" key="back" onClick={this.onCancel}>确定</Button>] : [
                    <Button key="back" onClick={this.onCancel}>取消</Button>,
                    <Button key="submit" onClick={this.onOk} loading={isShowActivityManageModalLoading}
                            type="primary">提交</Button>]}>

            <div className="activity-steps-content1-update">
                <div className="activity-steps-content1-item-update">
                    <div className="activity-steps-content1-input-box-update">
                        <div className="activity-steps-content1-input-hint-update"><span>*</span>活动名称:</div>
                        <Input.TextArea
                            maxLength={100}
                            value={name}
                            autosize={{minRows:1}}
                            disabled={updateTypeModal === 0}
                            placeholder="给活动起个名字"
                            onChange={this.onActivityNameChange}
                        />
                    </div>
                    <div className="activity-input-error-hint-update"
                         style={{visibility: isNameEmpty ? 'visible' : 'hidden'}}>请输入活动名称
                    </div>
                </div>
                <div className="activity-steps-content1-item-update">
                    <div className="activity-steps-content1-input-box-update">
                        <div className="activity-steps-content1-input-hint-update"><span>*</span>开始日期:</div>
                        <DatePicker
                            size="small"
                            disabled={updateTypeModal === 0}
                            disabledDate={this.disabledStartDate}
                            format="YYYY-MM-DD"
                            value={start_date}
                            placeholder="开始日期"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                        />
                    </div>
                    <div className="activity-input-error-hint-update" style={{visibility: isStartDateEmpty ? 'visible' : 'hidden'}}>请选择开始日期</div>
                </div>
                <div className="activity-steps-content1-item-update">
                    <div className="activity-steps-content1-input-box-update">
                        <div className="activity-steps-content1-input-hint-update"><span>*</span>结束日期:</div>
                        <DatePicker
                            size="small"
                            disabled={updateTypeModal === 0}
                            disabledDate={this.disabledEndDate}
                            format="YYYY-MM-DD"
                            value={end_date}
                            placeholder="结束日期"
                            onChange={this.onEndChange}
                            onOpenChange={this.handleEndOpenChange}
                        />
                    </div>
                    <div className="activity-input-error-hint-update" style={{visibility: isEndDateEmpty ? 'visible' : 'hidden'}}>请选择结束日期</div>
                </div>
                <div className="activity-steps-content1-item-update">
                    <div className="activity-steps-content1-input-box-limit-update">
                        <div className="activity-steps-content1-input-hint-update">投放依据:</div>
                        <Radio.Group
                            onChange={this.onActivityPushBasisChange} value={push_basis}
                            // disabled={typeModal === 0}
                        >
                            <Radio value={0}>银行卡</Radio>
                            <Radio value={1}>加油卡</Radio>
                            <Radio value={2}>身份证</Radio>
                            <Radio value={3}>手机号</Radio>
                            <Radio value={4}>车牌号</Radio>
                        </Radio.Group>
                        <Icon type="stop" className='activity-rollback' style={{visibility: push_basis ? "visible" : "hidden"}} onClick={this.onPushBasisCancel}/>

                    </div>
                    <div className="activity-input-error-hint"></div>
                </div>
                <div className="activity-steps-content1-item-update">
                    {
                        desc.map((item,index)=>
                            <div key={index} className='activity-steps-content1-item-desc-update'>
                                <div className="activity-steps-content1-input-box-update">
                                    <div className="activity-steps-content1-input-hint-update" style={{visibility:index>0?"hidden":"visible"}}>活动描述:</div>
                                    <Input.TextArea
                                        id={index}
                                        maxLength={100}
                                        value={item}
                                        autosize={{minRows: 1}}
                                        disabled={updateTypeModal === 0}
                                        placeholder="活动描述"
                                        onChange={this.onDescChange}
                                    />
                                    <Icon
                                        className="dynamic-delete-button-update"
                                        type="minus-circle-o"
                                        style={{display:desc.length>1?"flex":"none"}}
                                        onClick={this.removeDesc.bind(this,index)}
                                    />
                                </div>
                                <div className="activity-input-error-hint-update" style={{visibility: 'hidden'}}>请活动描述</div>
                            </div>
                        )
                    }

                    <Button type="dashed" onClick={this.addDesc} className="activity-steps-content1-input-update" style={{visibility:updateTypeModal===0?'hidden':'visible'}}>
                        <Icon type="plus" /> 添加描述信息
                    </Button>
                </div>

            </div>
        </Modal>);
    }
}

export default ActivityUpdateModal;
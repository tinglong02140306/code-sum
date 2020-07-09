import React from 'react';
import {Modal, Button, Input, Icon, Select, Radio, DatePicker,Checkbox} from 'antd';
import {inject, observer} from "mobx-react";
import "./GrantTicketDialog.scss";
import {isEmpty} from "../../../utils/isEmpty";
import {isNumber} from "../../../utils/isNumber";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {isMoney} from "../../../utils/isMoney";
import {isRange} from "../../../utils/isRange";
import moment from 'moment';
import {stringToMoment} from "../../../utils/utils";

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['发券', '使用'];
const tag={
    "使用":"USE",
    "发券":"PUSH",
};
@inject("grantTicketStore")
@observer
class GrantTicketDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            id: '',
            activity_id: "",
            coupon_category_id: "",
            put_frequency: null,
            // single_one_coupon_limit: '',
            // single_time_single_one_coupon_limit: '',
            max_number: '',
            usable_number: '',
            each_time_number: '',
            valid_type: 0,
            valid_days: '',
            invalid_date: null,
            isActivityIdEmpty: false,
            isCouponIdEmpty: false,
            isPushFrequencyEmpty: false,
            isInvalidDateEmpty: false,
            isValidDaysEmpty: false,
            limit:[{type: '', value: '',usage:[]},{type: '', value: '',usage:[]},{type: '', value: '',usage:[]},{type: '', value: '',usage:[]},{type: '', value: '',usage:[]}],
            isLimitFirstEmpty:false,
            isLimitSecondEmpty:false,
            isLimitThirdEmpty:false,
            isLimitFourthEmpty:false,
            isLimitFifthEmpty:false,
        };
    }

    componentDidMount() {
        const {type, grantTicketObject} = this.props.grantTicketStore;
        if (type !== 2) {
            let limitArr = grantTicketObject.limit;
            let limitArrNew = [];
            if (limitArr){
                for(let i = 0 ; i < 5; i++) {
                    let tempDic = {type: '', value: '', usage: []};
                    for (let j = 0; j < limitArr.length; j++) {
                        let dic = limitArr[j];
                        if (dic.type === (i+1)) {
                            tempDic = dic;
                        }
                    }
                    limitArrNew.push(tempDic);
                }
                // console.log(JSON.stringify(limitArrNew))
                this.setState({
                    limit:limitArrNew
                });
            }
            if (grantTicketObject.valid_type === '投放周期') {
                this.setState({valid_type: 0,})
            } else if (grantTicketObject.valid_type === '固定日期') {
                this.setState({valid_type: 1,})
            } else if (grantTicketObject.valid_type === '固定天数') {
                this.setState({valid_type: 2,})
            }
            this.setState({
                id: grantTicketObject.id,
                activity_id: grantTicketObject.activity_id,
                coupon_category_id: grantTicketObject.coupon_category_id,
                put_frequency: grantTicketObject.put_frequency,
                // single_one_coupon_limit: grantTicketObject.single_one_coupon_limit,
                // single_time_single_one_coupon_limit: grantTicketObject.single_time_single_one_coupon_limit,
                max_number: grantTicketObject.max_number,
                // usable_number: grantTicketObject.usable_number,
                each_time_number: grantTicketObject.each_time_number,
                valid_days: grantTicketObject.valid_days,
                invalid_date: stringToMoment(grantTicketObject.invalid_date, 'YYYY-MM-DD'),
            });
        }
    }

    //取消
    onCancel = () => {
        this.props.grantTicketStore.setIsShowDialog(false, 0)
    }
    //提交
    onSubmit = () => {
        const {type, grantTicketObject} = this.props.grantTicketStore;
        const {limit,id, activity_id, coupon_category_id, put_frequency, max_number, usable_number, each_time_number, valid_type, valid_days, invalid_date, isPushFrequencyEmpty, isInvalidDateEmpty, isValidDaysEmpty} = this.state;
        let validType = null;
        if (grantTicketObject.valid_type === '投放周期') {
            validType = 0;
        } else if (grantTicketObject.valid_type === '固定日期') {
            validType = 1;
        } else if (grantTicketObject.valid_type === '固定天数') {
            validType = 2;
        }
        this.checkInfo();
        if (type === 2) {
            //2添加
            if (!isEmpty(activity_id) && !isEmpty(coupon_category_id) && !isEmpty(valid_type)) {

                if (!isEmpty(put_frequency) || !isEmpty(invalid_date) || !isEmpty(valid_days)) {
                    this.props.grantTicketStore.addCouponData(limit,activity_id, coupon_category_id, put_frequency, max_number, each_time_number, valid_type, valid_days, invalid_date, () => {})
                } else {
                    return;
                }
            }
        } else {
            if (!isEmpty(id) && !isEmpty(activity_id) && !isEmpty(coupon_category_id) && !isEmpty(valid_type)) {
                if (!isEmpty(put_frequency) || !isEmpty(invalid_date) || !isEmpty(valid_days)) {
                    this.props.grantTicketStore.updateCouponData(limit,id,activity_id, coupon_category_id, put_frequency, max_number, each_time_number, valid_type, valid_days, invalid_date, () => {})
                    // this.props.grantTicketStore.updateCouponData(limit,id, activity_id === grantTicketObject.activity_id ? null : activity_id, coupon_category_id === grantTicketObject.coupon_category_id ? null : coupon_category_id, put_frequency === grantTicketObject.put_frequency ? null : put_frequency, max_number === grantTicketObject.max_number ? null : max_number, each_time_number === grantTicketObject.each_time_number ? null : each_time_number, valid_type === validType ? null : valid_type, valid_days === grantTicketObject.valid_days ? null : valid_days, invalid_date === grantTicketObject.invalid_date ? null : invalid_date, () => {})
                } else {
                    return;
                }
            }
        }
    }

    checkInfo = () => {
        const {limit,id, activity_id, coupon_category_id, put_frequency, valid_type, valid_days, invalid_date} = this.state;
        if (isEmpty(activity_id)) {
            this.setState({isActivityIdEmpty: true});
            return false;
        } else {
            this.setState({isActivityIdEmpty: false});
        }
        if (isEmpty(coupon_category_id)) {
            this.setState({isCouponIdEmpty: true});
            return false;
        } else {
            this.setState({isCouponIdEmpty: false});
        }
        if (valid_type === 0) {
            if (isEmpty(put_frequency)) {
                this.setState({isPushFrequencyEmpty: true,});
                return false;
            } else {
                this.setState({isPushFrequencyEmpty: false,});
            }
        } else if (valid_type === 1) {
            if (isEmpty(invalid_date)) {
                this.setState({isInvalidDateEmpty: true});
                return false;
            } else {
                this.setState({isInvalidDateEmpty: false,});
            }
        } else if (valid_type === 2) {
            if (isEmpty(valid_days)) {
                this.setState({isValidDaysEmpty: true});
                return false;
            } else {
                this.setState({isValidDaysEmpty: false,});
            }
        }
        if (limit[0].type === 1){
            if (isEmpty(limit[0].value)){
                this.setState({isLimitFirstEmpty: true});
                return false;
            }else {
                this.setState({isLimitFirstEmpty: false});
            }
        }
        if (limit[1].type === 2){
            if (isEmpty(limit[1].value)){
                this.setState({isLimitSecondEmpty: true});
                return false;
            }else {
                this.setState({isLimitSecondEmpty: false});
            }
        }
        return true;
    }

    //活动id
    onChangeActivityId = (value) => {
        this.setState({activity_id: value});
    }
    //优惠券id
    onChangeCouponId = (value) => {
        this.setState({coupon_category_id: value});
    }
    //投放频率
    onChangeFrequency = (value) => {
        this.setState({put_frequency: value});
    }
    //单人投放上限
    onChangeSingleOneCouponLimit = (e) => {
        this.setState({single_one_coupon_limit: e.target.value});
    }
    //单人单次投放上限
    onChangeSingleTimeSingleOneCouponLimit = (e) => {
        this.setState({single_time_single_one_coupon_limit: e.target.value});
    }
    //投放上限(最大数量)
    onChangeCouponAmountMaxLimit = (e) => {
        this.setState({max_number: e.target.value});
    }
    //剩余数量
    onChangeUsableNumber = (e) => {
        this.setState({usable_number: e.target.value});
    }
    //每次投放量
    onChangeEachTimeNumber = (e) => {
        this.setState({each_time_number: e.target.value});
    }
    //剩余天数
    onChangeValidDays = (e) => {
        this.setState({valid_days: e.target.value});
    }
    onValidTypeChange = (e) => {
        this.setState({valid_type: e.target.value});
    }
    onStartChange = (value) => {
        this.setState({invalid_date: value});
    }

    //白名单限制
    onActivityFirstChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[0].type = e.target.value;
        this.setState({
            limit: limitArr
        });
    }

    onWhiteListUsageChange = checkedList => {
        let limitArr = this.state.limit;
        // limitArr[0].usage = e.target.value;
        limitArr[0].usage = checkedList;
        this.setState({
            limit: limitArr
        });
    };

    onBankUsageChange = checkedList => {
        let limitArr = this.state.limit;
        // limitArr[1].usage = e.target.value;
        limitArr[1].usage = checkedList;
        this.setState({
            limit: limitArr
        });
    }
    onThirdUsageChange = checkedList => {
        let limitArr = this.state.limit;
        // limitArr[1].usage = e.target.value;
        limitArr[2].usage = checkedList;
        this.setState({
            limit: limitArr
        });
    }
    onFourthUsageChange = checkedList => {
        let limitArr = this.state.limit;
        // limitArr[1].usage = e.target.value;
        limitArr[3].usage = checkedList;
        this.setState({
            limit: limitArr
        });
    }
    onFifthUsageChange = checkedList => {
        let limitArr = this.state.limit;
        // limitArr[1].usage = e.target.value;
        limitArr[4].usage = checkedList;
        this.setState({
            limit: limitArr
        });
    }

    //白名单限制描述
    onWhiteListChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[0].value = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //白名单限制取消
    onWhiteListCancel = (e) => {
        let limitArr = this.state.limit;
        limitArr[0].type = '';
        limitArr[0].value = '';
        limitArr[0].usage = [];
        this.setState({
            limit: limitArr
        });
    }
    //银行限制
    onActivitySecondChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[1].type = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //银行限制描述
    onActivityBankChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[1].value = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //银行限制取消
    onActivityBankCancel = (e) => {
        let limitArr = this.state.limit;
        limitArr[1].type = '';
        limitArr[1].value = '';
        limitArr[1].usage = [];
        this.setState({
            limit: limitArr
        });
    }
    //卡bin限制
    onActivityThirdRadioChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[2].type = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //kabin限制描述
    onActivityThirdChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[2].value = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //kabin限制取消
    onActivityThirdCancel = (e) => {
        let limitArr = this.state.limit;
        limitArr[2].type = '';
        limitArr[2].value = '';
        limitArr[2].usage = [];
        this.setState({
            limit: limitArr
        });
    }
    //脱敏手机号限制
    onActivityFourthRadioChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[3].type = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //脱敏手机号限制描述
    onActivityFourthChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[3].value = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //脱敏手机号限制取消
    onActivityFourthCancel = (e) => {
        let limitArr = this.state.limit;
        limitArr[3].type = '';
        limitArr[3].value = '';
        limitArr[3].usage = [];
        this.setState({
            limit: limitArr
        });
    }
    //全匹配手机号限制
    onActivityFifthRadioChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[4].type = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //全匹配手机号限制描述
    onActivityFifthChange = (e) => {
        let limitArr = this.state.limit;
        limitArr[4].value = e.target.value;
        this.setState({
            limit: limitArr
        });
    }
    //全匹配手机号限制取消
    onActivityFifthCancel = (e) => {
        let limitArr = this.state.limit;
        limitArr[4].type = '';
        limitArr[4].value = '';
        limitArr[4].usage = [];
        this.setState({
            limit: limitArr
        });
    }
    render() {
        const {type, isShowLoading, isShowDialog, activityList, couponList} = this.props.grantTicketStore;
        const {isLimitFirstEmpty,isLimitSecondEmpty,isLimitThirdEmpty, isLimitFourthEmpty, isLimitFifthEmpty,limit,coupon_category_id, activity_id, isPushFrequencyEmpty, isInvalidDateEmpty, isValidDaysEmpty} = this.state;
        return (<Modal
            title={type === 1 ? "修改" : type === 3 ? "查看" : "添加"}
            visible={isShowDialog}
            onCancel={this.onCancel}
            width={800}
            footer={type === 3 ? [
                <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>,] : [
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit} loading={isShowLoading}>提交</Button>,]}>
            <div className="grant-ticket-dialog-container-left">
                <div className="grant-ticket-dialog-container">
                    <div className="grant-ticket-dialog-item-container">
                        <div className="grant-ticket-dialog-select">
                            <div className="grant-ticket-dialog-title">
                                <span style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>活动:
                            </div>
                            <Select
                                style={{width: 250}}
                                onChange={this.onChangeActivityId}
                                value={activity_id.toString()}
                                disabled={type === 3 ? true : false}
                                showArrow={type === 3 ? false : true}>
                                {activityList !== null ? activityList.map((item) =>
                                    <Select.Option key={item.id}>{item.name}</Select.Option>
                                ) : ""}
                            </Select>
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: this.state.isActivityIdEmpty ? "visible" : "hidden"}}>请选择活动
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container">
                        <div className="grant-ticket-dialog-select">
                            <div className="grant-ticket-dialog-title">
                                <span style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>优惠券:
                            </div>
                            <Select style={{width: 250}}
                                    onChange={this.onChangeCouponId}
                                    value={coupon_category_id.toString()}
                                    disabled={type === 3 ? true : false}
                                    showArrow={type === 3 ? false : true}>
                                {couponList !== null ? couponList.map((number) =>
                                    <Select.Option key={number.id}>{number.name}</Select.Option>
                                ) : ""}
                            </Select>
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: this.state.isCouponIdEmpty ? "visible" : "hidden"}}>请选择优惠券
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container">
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title"><span
                                style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>有效期类型:
                            </div>
                            <Radio.Group onChange={this.onValidTypeChange} value={this.state.valid_type}
                                         disabled={type === 3 ? true : false}>
                                <Radio value={0}>投放周期</Radio>
                                <Radio value={1}>固定日期</Radio>
                                <Radio value={2}>固定天数</Radio>
                                {/*<Radio value={3}>无</Radio>*/}
                            </Radio.Group>
                        </div>
                        <div className="grant-ticket-dialog-empty-hint" style={{visibility: "hidden"}}>有效期类型</div>
                    </div>
                    <div className="grant-ticket-dialog-item-container"
                         style={{display: this.state.valid_type === 0 ? "flex" : "none"}}>
                        <div className="grant-ticket-dialog-select">
                            <div className="grant-ticket-dialog-title">
                                <span style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>投放频率:
                            </div>
                            <Select style={{width: 250}}
                                    onChange={this.onChangeFrequency}
                                    value={this.state.put_frequency}
                                    disabled={type === 3 ? true : false}
                                    showArrow={type === 3 ? false : true}>
                                <Select.Option value={0}>即时</Select.Option>
                                <Select.Option value={1}>每日</Select.Option>
                                <Select.Option value={2}>每周</Select.Option>
                                <Select.Option value={3}>每月</Select.Option>
                            </Select>
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: isPushFrequencyEmpty ? "visible" : "hidden"}}>请选择投放频率
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container"
                         style={{display: this.state.valid_type === 2 ? "flex" : "none"}}>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title">
                                <span style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>有效天数:
                            </div>
                            <Input
                                type="text"
                                autosize={{minRows: 1}}
                                style={{width: 250}}
                                disabled={type === 3 ? true : false}
                                value={this.state.valid_days}
                                onChange={this.onChangeValidDays}
                                placeholder="有效天数"
                                maxLength={100}
                            />
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: isValidDaysEmpty ? 'visible' : "hidden"}}>请输入有效天数
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container"
                         style={{display: this.state.valid_type === 1 ? "flex" : "none"}}>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title">
                                <span style={{visibility: type === 3 ? "hidden" : "visible"}}>*</span>失效日期:
                            </div>
                            <DatePicker
                                size="small"
                                style={{width: 250}}
                                format="YYYY-MM-DD"
                                value={this.state.invalid_date}
                                placeholder="失效日期"
                                onChange={this.onStartChange}
                            />
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: isInvalidDateEmpty ? 'visible' : "hidden"}}>请选择失效日期
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container">
                        <div className="grant-ticket-dialog-item-container">
                            <div className="grant-ticket-dialog-item">
                                <div className="grant-ticket-dialog-title">每次投放量:</div>
                                <Input
                                    type="text"
                                    autosize={{minRows: 1}}
                                    style={{width: 250}}
                                    disabled={type === 3 ? true : false}
                                    value={this.state.each_time_number}
                                    onChange={this.onChangeEachTimeNumber}
                                    placeholder="每次投放量"
                                    maxLength={100}
                                />
                            </div>
                            <div className="grant-ticket-dialog-empty-hint"
                                 style={{visibility: "hidden"}}>请输入每次投放量
                            </div>
                        </div>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title">最大数量:</div>
                            <Input
                                type="text"
                                autosize={{minRows: 1}}
                                style={{width: 250}}
                                disabled={type === 3 ? true : false}
                                value={this.state.max_number}
                                onChange={this.onChangeCouponAmountMaxLimit}
                                placeholder="投放上限(-1表示不限制)"
                                maxLength={100}
                            />
                        </div>
                        <div className="grant-ticket-dialog-empty-hint"
                             style={{visibility: "hidden"}}>请输入投放上限数(只能填数字)
                        </div>
                    </div>
                    <div className="grant-ticket-dialog-item-container1">
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title">限制:</div>
                            <Radio.Group onChange={this.onActivityFirstChange} value={limit[0].type} disabled={type === 3}>
                                <Radio value={1}>白&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;单&nbsp;&nbsp;</Radio>
                            </Radio.Group>
                            <Input.TextArea
                                width={80}
                                style={{marginRight:10}}
                                maxLength={100}
                                value={limit[0].value}
                                autosize={{minRows: 1}}
                                disabled={limit[0].type === 1 ? false : true}
                                placeholder="机构号"
                                onChange={this.onWhiteListChange}/>
                            {/*<Radio.Group onChange={this.onWhiteListUsageChange} value={limit[0].usage} disabled={limit[0].type !== 1&&type === 3}>*/}
                            {/*    <Radio value={'PUSH'}>发券</Radio>*/}
                            {/*    <Radio value={'USE'}>使用</Radio>*/}
                            {/*</Radio.Group>*/}
                            <CheckboxGroup
                                // options={plainOptions}
                                value={limit[0].usage}
                                defaultValue={limit[0].usage}
                                disabled={limit[0].type === 1 ? false : true}
                                onChange={this.onWhiteListUsageChange}>
                                <Checkbox value={'PUSH'}>发券</Checkbox>
                                <Checkbox value={'USE'}>使用</Checkbox>
                            </CheckboxGroup>
                            <Icon type="stop" className='grant-rollback' style={{visibility: limit[0].type === 1 ? "visible" : "hidden"}} onClick={this.onWhiteListCancel}/>
                        </div>
                        <div className="activity-input-error-hint" style={{visibility: isLimitFirstEmpty ? 'visible' : 'hidden'}}>机构号不能为空</div>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title"></div>
                            <Radio.Group onChange={this.onActivitySecondChange} value={limit[1].type?limit[1].type:''} disabled={type === 3}>
                                <Radio value={2}>银&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;行&nbsp;&nbsp;</Radio>
                            </Radio.Group>
                            <Input.TextArea
                                width={80}
                                style={{marginRight:10}}
                                maxLength={100}
                                value={limit[1].value}
                                autosize={{minRows: 1}}
                                disabled={limit[1].type === 2 ? false : true}
                                placeholder="银行简称"
                                onChange={this.onActivityBankChange}/>
                            <CheckboxGroup
                                value={limit[1].usage}
                                defaultValue={limit[1].usage}
                                disabled={limit[1].type === 2 ? false : true}
                                onChange={this.onBankUsageChange}>
                                <Checkbox value={'PUSH'}>发券</Checkbox>
                                <Checkbox value={'USE'}>使用</Checkbox>
                            </CheckboxGroup>
                            <Icon type="stop" className='grant-rollback' style={{visibility: limit[1].type === 2 ? "visible" : "hidden"}} onClick={this.onActivityBankCancel}/>
                        </div>
                        <div className="activity-input-error-hint" style={{visibility: isLimitSecondEmpty ? 'visible' : 'hidden'}}>银行简称不能为空</div>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title"></div>
                            <Radio.Group onChange={this.onActivityThirdRadioChange} value={limit[2].type?limit[2].type:''} disabled={type === 3}>
                                <Radio value={3}>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bin&nbsp;&nbsp;</Radio>
                            </Radio.Group>
                            <Input.TextArea
                                width={80}
                                style={{marginRight:10}}
                                maxLength={100}
                                value={limit[2].value}
                                autosize={{minRows: 1}}
                                disabled={limit[2].type === 3 ? false : true}
                                placeholder="卡bin"
                                onChange={this.onActivityThirdChange}/>
                            <CheckboxGroup
                                value={limit[2].usage}
                                defaultValue={limit[2].usage}
                                disabled={limit[2].type === 3 ? false : true}
                                onChange={this.onThirdUsageChange}>
                                <Checkbox value={'PUSH'}>发券</Checkbox>
                                <Checkbox value={'USE'}>使用</Checkbox>
                            </CheckboxGroup>
                            <Icon type="stop" className='grant-rollback' style={{visibility: limit[2].type === 3 ? "visible" : "hidden"}} onClick={this.onActivityThirdCancel}/>
                        </div>
                        <div className="activity-input-error-hint" style={{visibility: isLimitThirdEmpty ? 'visible' : 'hidden'}}>卡bin不能为空</div>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title"></div>
                            <Radio.Group onChange={this.onActivityFourthRadioChange} value={limit[3].type?limit[3].type:''} disabled={type === 3}>
                                <Radio value={4}>脱&nbsp;敏&nbsp;手机号</Radio>
                            </Radio.Group>
                            <Input.TextArea
                                width={90}
                                style={{marginRight:10}}
                                maxLength={100}
                                value={limit[3].value}
                                autosize={{minRows: 1}}
                                disabled={limit[3].type === 4 ? false : true}
                                placeholder="脱敏手机号"
                                onChange={this.onActivityFourthChange}/>
                            <CheckboxGroup
                                value={limit[3].usage}
                                defaultValue={limit[3].usage}
                                disabled={limit[3].type === 4 ? false : true}
                                onChange={this.onFourthUsageChange}>
                                <Checkbox value={'PUSH'}>发券</Checkbox>
                                <Checkbox value={'USE'}>使用</Checkbox>
                            </CheckboxGroup>
                            <Icon type="stop" className='grant-rollback' style={{visibility: limit[3].type === 4 ? "visible" : "hidden"}} onClick={this.onActivityFourthCancel}/>
                        </div>
                        <div className="activity-input-error-hint" style={{visibility: isLimitFourthEmpty ? 'visible' : 'hidden'}}>脱敏手机号不能为空</div>
                        <div className="grant-ticket-dialog-item">
                            <div className="grant-ticket-dialog-title"></div>
                            <Radio.Group onChange={this.onActivityFifthRadioChange} value={limit[4].type?limit[4].type:''} disabled={type === 3}>
                                <Radio value={5}>全匹配手机号</Radio>
                            </Radio.Group>
                            <Input.TextArea
                                width={90}
                                style={{marginRight:10}}
                                maxLength={100}
                                value={limit[4].value}
                                autosize={{minRows: 1}}
                                disabled={limit[4].type === 5 ? false : true}
                                placeholder="全匹配手机号"
                                onChange={this.onActivityFifthChange}/>
                            <CheckboxGroup
                                value={limit[4].usage}
                                defaultValue={limit[4].usage}
                                disabled={limit[4].type === 5 ? false : true}
                                onChange={this.onFifthUsageChange}>
                                <Checkbox value={'PUSH'}>发券</Checkbox>
                                <Checkbox value={'USE'}>使用</Checkbox>
                            </CheckboxGroup>
                            <Icon type="stop" className='grant-rollback' style={{visibility: limit[4].type === 5 ? "visible" : "hidden"}} onClick={this.onActivityFifthCancel}/>
                        </div>
                        <div className="activity-input-error-hint" style={{visibility: isLimitFifthEmpty ? 'visible' : 'hidden'}}>全匹配手机号不能为空</div>
                    </div>
                </div>
            </div>
        </Modal>);
    }
}

export default GrantTicketDialog;
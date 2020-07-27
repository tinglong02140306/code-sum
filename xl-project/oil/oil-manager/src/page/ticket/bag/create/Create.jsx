import React from 'react';
import './Create.scss';
import { Button, Form, Input, Radio, InputNumber, Select, Spin, DatePicker, TimePicker, RangePicker, Checkbox } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';
import { TreeSelect } from 'antd';
import { getCurrentDate, getCurAfterDate } from '../../../../utils/utils';
import { formatData } from '../../../../utils/formatDate';
import { city } from '../../../../constants/city_title';

import { weekInterList } from '../../../../constants/week-inter';

const { SHOW_PARENT } = TreeSelect;

@inject('tickerBagStore')
@observer
class Create extends React.Component {
    state = {
        limitTimeStatus: true,  // 限时购买状态 true 不限 false 限制
        timeInterStatus: true,   // 时区选择状态 true 不限  false 自定义
        timeSelectFlag: false,   // 判断时区数据 有 true  无 false
        timeInterValue: '0',  //  时区选择的文本值 0 不限  1 自定义
        timeInterList: weekInterList,
        modify_flag: true, // true 可以修改  false 不能修改
        coupon_count: "",
        record: {},

        numTipMsg: false,  // 卷包限量 提示语是否显示标志位
        buyTipMsg: false,  // 卷包限购 提示语是否显示标志位
        buy_limit_count: "",
        package_total: "",
        area_name: "",
        // 时间复选框
        timeCheckVal: []
    };

    componentDidMount() {
        this.props.tickerBagStore.queryAct(() => {
            this.didMountDealData();
        });
    }

    onSubmitClick = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { timeInterValue, timeInterList, buy_limit_count, package_total, area_name, modify_flag } = this.state;
                const record = this.props.tickerBagStore.record;
                let len = Object.keys(record).length,
                    params = {};
                if (len == 0 || (len > 0 && modify_flag)) {
                    const obj = this.getActObj(values.act_id);
                    values.coupon_id = obj.coupon_id;
                    values.coupon_count = obj.single_push_count;
                    values.instruction = values.instruction.replace(/\n/g, "<BR>");

                    // 验证时间区间问题 区间数据处理
                    let timeObj = {};
                    if (values.coupon_package_type == 2) {
                        let arr = timeInterList.filter((item) => {
                            return item.isChecked;
                        });
                        timeObj.time_interval = JSON.stringify(arr);
                        timeObj.start_date = formatData(values.date[0]);
                        timeObj.end_date = formatData(values.date[1]);
                    } else {
                        timeObj.start_date = "";
                        timeObj.end_date = "";
                    }
                    // 验证限量、限购及数据处理
                    if (values.package_limit_type && !package_total) return;
                    if (values.buy_limit_type && !buy_limit_count) return;
                    timeObj.package_total = package_total;
                    timeObj.buy_limit_count = buy_limit_count;

                    // 所属区域处理
                    values.area_code = values.area_code.join(',');
                    values.area_name = area_name.join(',');

                    if (len > 0) {
                        values.status = record.status;
                        values.id = record.id;
                    }

                    params = { ...values, ...timeObj };
                } else if (len > 0 && !modify_flag) {
                    params = {
                        package_name: values.package_name,
                        package_price: values.package_price,
                        discount_rate: values.discount_rate,
                        buy_limit: values.buy_limit,
                        sequence: values.sequence,
                        background_url: values.background_url,
                        description: values.description,
                        instruction: values.instruction,
                        coupon_package_type: values.coupon_package_type,
                        package_limit_type: values.package_limit_type,
                        area_code: values.area_code.join(','),
                        area_name: area_name.join(','),
                        status: record.status,
                        id: record.id
                    }
                }
                console.log(params)

                if (Object.keys(record).length == 0) {
                    this.props.tickerBagStore.addBag(params, () => {
                        this.props.history.push('/ticket-bag');
                    });
                } else {
                    this.props.tickerBagStore.updateBag(params, () => {
                        this.props.history.push('/ticket-bag');
                    });
                }
            }
        });
    };

    getActObj = (act_id) => {
        const { act_list } = this.props.tickerBagStore;
        for (let i = 0; i < act_list.length; i++) {
            const item = act_list[i];
            if (item.id === act_id) {
                return item;
            }
        }
        return {}
    }

    //校验折扣率
    validateDiscountRate = (rule, value, callback) => {
        const reg = /^0\.[1-9]{0,2}$/;
        if (reg.test(value)) {
            callback();
        } else {
            callback('折扣率取值范围为0-1,不包含0和1,最多保留小数点后两位');
        }
    }
    // 发放活动
    actChange = (value) => {
        this.setState({
            coupon_count: this.getActObj(value).single_push_count
        })
    }
    // 所属区域 变化
    onAreaChange = (value, label, extra) => {
        console.log(value, label, extra);
        this.setState({
            area_name: label
        })
    }
    // 限时抢购
    limitTimePayChange = (e) => {
        this.setState({
            limitTimeStatus: e.target.value == '0' ? true : false
        });
    }

    // 时间区间 不限 自定义
    handleTimeInterChange = (e) => {
        let val = e.target.value;
        this.setState({
            timeInterStatus: val == '0' ? true : false,
            timeInterValue: val
        });
    }
    // 时间选择 复选框改变
    timeCheckChange = (value) => {
        console.log('timeCheckChange', value)
        let timeInterList = this.state.timeInterList,
            selectFlag = false;
        value && value.map((item) => {
            timeInterList[item].isChecked = true;
            selectFlag = true;
        });
        if (value.length == 0) {
            timeInterList.map((item) => {
                item.isChecked = false;
            });
            selectFlag = false
        }
        this.setState({
            timeInterList: timeInterList,
            timeSelectFlag: selectFlag
        });
        console.log(timeInterList)
    }
    // 开始时间
    timeStartChange = (val, strVal, index) => {
        let timeInterList = this.state.timeInterList,
            item = timeInterList[index];
        // 时间渲染处理
        item.startTime = strVal;
        this.setState({
            timeInterList: timeInterList
        });

        // 错误提示语是否显示处理
        item.err = this.compareTime(strVal, item.endTime);
        this.setState({
            timeInterList: timeInterList
        });
    }
    // 结束时间
    timeEndChange = (val, strVal, index) => {
        let timeInterList = this.state.timeInterList,
            item = timeInterList[index];

        // 时间渲染处理
        item.endTime = strVal;
        this.setState({
            timeInterList: timeInterList
        })

        // 错误提示语是否显示处理
        item.err = this.compareTime(item.startTime, strVal);
        this.setState({
            timeInterList: timeInterList
        });
    }
    // 时间大小比较  
    compareTime = (startTime, endTime) => {
        let startTimeArr = startTime.split(':'),
            endTimeArr = endTime.split(':');
        if (startTimeArr[0] < endTimeArr[0] || (startTimeArr[0] == endTimeArr[0] && startTimeArr[1] < endTimeArr[1])) {
            // 不显示错误提示语
            return false;
        } else {
            return true;
        }
    }
    didMountDealData() {
        let record = this.props.tickerBagStore.record,
            obj = {};
        if (Object.keys(record).length == 0) { // 创建
            obj = {
                coupon_package_type: 1,
                buy_limit: "NEW_USER",  // 是否限制新用户购买
                start_date: getCurrentDate(),  // 开始日期，2020-07-21   默认时间需要处理
                end_date: getCurAfterDate(),  // 结束日期，2020-07-21  默认时间需要处理
                package_limit_type: false,
                buy_limit_type: false
            }
            this.setState({
                record: obj
            });
        } else { // 修改
            let timeInterArr = JSON.parse(record.time_interval),
                timeInterList = this.state.timeInterList,
                index = 0,
                arrVal = [];  // check选择值
            timeInterArr && timeInterArr.map((item) => {
                let week = item.weekday;
                index = week == '周一' ? 0 : week == '周二' ? 1 : week == '周三' ? 2 : week == '周四' ? 3 : week == '周五' ? 4 : week == '周六' ? 5 : 6;
                timeInterList[index].startTime = item.startTime;
                timeInterList[index].endTime = item.endTime;
                timeInterList[index].isChecked = true;
                arrVal.push(item.index);
            });

            let len = timeInterArr ? timeInterArr.length : 0;
            this.setState({
                timeInterList: timeInterList,
                limitTimeStatus: len > 0 ? false : true,  // 限时购买状态 true 不限 false 限制
                timeInterStatus: len > 0 ? false : true,   // 时区选择状态 true 不限  false 自定义
                timeSelectFlag: len > 0 ? true : false,   // 判断时区数据 有 true  无 false
                timeInterValue: len > 0 ? '1' : '0',  //  时区选择的文本值 0 不限  1 自定义
                modify_flag: record.modify_flag ? true : false,

                // TODO
                buy_limit_count: record.buy_limit_count,
                package_total: record.package_total,
                numTipMsg: record.package_limit_type,
                buyTipMsg: record.buy_limit_type,
                coupon_count: record.coupon_count,
                timeCheckVal: arrVal,
                area_name: record.area_name.split(',')
            });
            if (!record.start_date && !record.end_date) {
                record.start_date = getCurrentDate();
                record.end_date = getCurAfterDate();
            }

            record.area_code = record.area_code.split(',');
            // record.timeCheckVal = arrVal;
            // console.log(record.coupon_package_type, record.timeCheckVal, arrVal)
            record.coupon_package_type = record.coupon_package_type;


            this.setState({
                record: record
            });
        }
    }


    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { loadingAdd, act_list } = this.props.tickerBagStore;
        const { record, limitTimeStatus, timeInterStatus, timeInterList, timeSelectFlag, timeInterValue, modify_flag, coupon_count, numTipMsg, buyTipMsg, buy_limit_count, package_total, timeCheckVal } = this.state;
        const { act_id } = getFieldsValue(['act_id']);
        let item = this.getActObj(act_id);

        const AreaProps = {
            dropdownClassName: "tree-drop-wrap",
            showSearch: true,
            treeData: city,
            onChange: this.onAreaChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            placeholder: '请选择所属区域',
            style: { width: '100%' },
            allowClear: true,
            multiple: true,
            treeDefaultExpandAll: false,
            treeNodeFilterProp: 'title'
        };

        return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-bag-create-container">
                    <div className="ticket-bag-create-title">{Object.keys(record).length == 0 ? '新增洗车券包' : '修改洗车券包'}</div>
                    <Form className="ticket-bag-create-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-bag-create-warpper">
                            <div className="ticket-bag-create-content-box">
                                <Form.Item className="ticket-bag-create-box-item other" label="券包名称">
                                    {getFieldDecorator('package_name', {
                                        rules: [{ required: true, message: '请输入券包名称' }], initialValue: record.package_name
                                    })(<Input placeholder="请输入洗车券包名称，用于对用户展示洗车券包名称" />)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="选择发放活动">
                                    {getFieldDecorator('act_id', { rules: [{ required: true, message: '请选择发放活动' }], initialValue: record.act_id })(
                                        <Select placeholder="请选择发放活动" disabled={!modify_flag} onChange={this.actChange}>
                                            {act_list && act_list.map((item) => {
                                                return (<Select.Option key={item.id} value={item.id}>
                                                    {item.act_name}
                                                </Select.Option>);
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="洗车券数量">
                                    {getFieldDecorator('coupon_count', { initialValue: coupon_count })(<Input disabled />)}
                                </Form.Item>


                                <Form.Item className="ticket-bag-create-box-item other" label="券包价格">
                                    {getFieldDecorator('package_price', { rules: [{ required: true, message: '请选择发放活动' }], initialValue: record.package_price })
                                        (<Input placeholder="请输入券包价格" />)}
                                </Form.Item>

                                <Form.Item className="ticket-bag-create-box-item other" label="折扣率">
                                    {getFieldDecorator('discount_rate', {
                                        rules: [
                                            { required: true, message: '请输入券包折扣率,取值范围(0-1)' },
                                            { validator: this.validateDiscountRate }], initialValue: record.discount_rate
                                    })
                                        (<Input placeholder="请输入券包折扣率,用于展示,取值范围(0-1)" />)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="是否限制新用户购买">
                                    {getFieldDecorator('buy_limit', { initialValue: record.buy_limit })
                                        (<Radio.Group>
                                            <Radio value="NEW_USER">是</Radio>
                                            <Radio value="">否</Radio>
                                        </Radio.Group>)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="排列顺序">
                                    {getFieldDecorator('sequence', { rules: [{ required: true, message: '请输入排列顺序' }], initialValue: record.sequence })
                                        (<Input placeholder="按数字自小到大排列优惠券包的展示顺序，例：1，2，3" />)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="背景图">
                                    {getFieldDecorator('background_url', { rules: [{ required: true, message: '请输入背景图地址' }], initialValue: record.background_url })
                                        (<Input placeholder="请输入背景图地址" />)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="所属区域">
                                    {getFieldDecorator('area_code', { rules: [{ required: true, message: '请选择所属区域' }], initialValue: record.area_code })(
                                        <TreeSelect {...AreaProps} />
                                    )}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="描述">
                                    {getFieldDecorator('description', { rules: [{ required: true, message: '请输入券包描述' }], initialValue: record.description })
                                        (<Input.TextArea rows={4} placeholder="请输入券包描述，可分行输入" />)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="使用说明">
                                    {getFieldDecorator('instruction', { rules: [{ required: true, message: '请输入券包使用说明' }], initialValue: record.instruction })
                                        (<Input.TextArea rows={4} placeholder="请输入券包使用说明" />)}
                                </Form.Item>
                            </div>

                            <div className="ticket-bag-create-content-box">
                                <Form.Item className="ticket-bag-create-box-item other" label="限时抢购">
                                    {getFieldDecorator('coupon_package_type', { rules: [{ required: true }], initialValue: record.coupon_package_type })
                                        (<Radio.Group onChange={this.limitTimePayChange} disabled={!modify_flag}>
                                            <div><Radio value={1}>不限</Radio></div>
                                            <div>
                                                <Radio value={2}>限制</Radio>
                                                {getFieldDecorator('date', { rules: [{ required: true, message: '请选择时间' }], initialValue: [moment(record.start_date), moment(record.end_date)] })
                                                    (<DatePicker.RangePicker
                                                        size="small"
                                                        showTime
                                                        disabled={!modify_flag || limitTimeStatus}
                                                        format="YYYY-MM-DD"
                                                        placeholder="请选择日期" />)}

                                                {limitTimeStatus ? null :
                                                    <div className="time-inter-wrap">
                                                        <div className="title">时间区间</div>
                                                        <Radio.Group onChange={this.handleTimeInterChange} value={timeInterValue} disabled={!modify_flag}>
                                                            <Radio.Button value="0">不限</Radio.Button>
                                                            <Radio.Button value="1">自定义</Radio.Button>
                                                        </Radio.Group>
                                                        {timeInterStatus ? <div>任何时段均可购买</div> : <div>
                                                            {timeInterList && timeInterList.map((item) => {
                                                                return (
                                                                    <div key={item.index} value={item.index}>
                                                                        <Checkbox.Group onChange={this.timeCheckChange} disabled={!modify_flag} defaultValue={timeCheckVal}>
                                                                            <Checkbox value={item.index}>{item.weekday}</Checkbox>
                                                                            <div className="date-picker-wrap">
                                                                                <TimePicker
                                                                                    allowClear={false}
                                                                                    disabled={!modify_flag || !item.isChecked}
                                                                                    value={moment(item.startTime, 'HH:mm')}
                                                                                    format="HH:mm"
                                                                                    onChange={(val, strVal) => this.timeStartChange(val, strVal, item.index)} />
                                                                                <span className="timePicker-line">-</span>
                                                                                <TimePicker
                                                                                    allowClear={false}
                                                                                    disabled={!modify_flag || !item.isChecked}
                                                                                    value={moment(item.endTime, 'HH:mm')}
                                                                                    format="HH:mm"
                                                                                    onChange={(val, strVal) => this.timeEndChange(val, strVal, item.index)} />
                                                                                {item.err ? <span className="err-msg">开始时间不能晚于结束时间</span> : null}
                                                                            </div>
                                                                        </Checkbox.Group>
                                                                    </div>
                                                                );
                                                            })}
                                                            {(!timeSelectFlag && !timeInterStatus) ? <span className="tip-msg">请请至少选择一个日期</span> : null}
                                                        </div>}
                                                    </div>
                                                }
                                            </div>
                                        </Radio.Group>)}
                                </Form.Item>

                                {/* <Form.Item className="ticket-bag-create-box-item other" label="卷包限量">
                                    {getFieldDecorator('package_total', { rules: [{ required: true, message: '请输入卷包限量' }], initialValue: record.package_total })
                                        (<div className="ticket-num-input-wrap">
                                            <InputNumber
                                                placeholder="请输入券包最大售卖数量"
                                                disabled={!modify_flag} />
                                            <span>个</span>
                                        </div>)}
                                </Form.Item>
                                <Form.Item className="ticket-bag-create-box-item other" label="限购数量">
                                    {getFieldDecorator('buy_limit_count', { rules: [{ required: true, message: '请输入券包单用户限购数量' }], initialValue: record.buy_limit_count })
                                        (<div className="ticket-num-input-wrap">
                                            <InputNumber
                                                placeholder="请输入券包单用户限购数量"
                                                disabled={!modify_flag} />
                                            <span>个</span>
                                        </div>)}
                                </Form.Item> */}



                                <Form.Item className="ticket-bag-create-box-item other" label="卷包限量">

                                    {getFieldDecorator('package_limit_type', { rules: [{ required: true }], initialValue: record.package_limit_type })
                                        (<Radio.Group onChange={(e) => { this.setState({ numTipMsg: e.target.value }) }} disabled={!modify_flag}>
                                            <div><Radio value={false}>不限</Radio></div>
                                            <div className="radio-input-wrap">
                                                <Radio value={true}>限制</Radio>
                                                <div className="ticket-num-input-wrap margin-input">
                                                    <InputNumber
                                                        placeholder="请输入券包最大售卖数量"
                                                        value={package_total}
                                                        disabled={!modify_flag || !numTipMsg}
                                                        max={9999}
                                                        min={1}
                                                        onChange={(value) => { this.setState({ package_total: value }); }} />
                                                    <span>个</span>
                                                </div>
                                            </div>
                                            {((modify_flag && (!package_total && numTipMsg))) ? <span className="tip-msg">请输入券包最大售卖数量</span> : null}
                                        </Radio.Group>)}
                                </Form.Item>


                                <Form.Item className="ticket-bag-create-box-item other" label="卷包限购">

                                    {getFieldDecorator('buy_limit_type', { rules: [{ required: true }], initialValue: record.buy_limit_type })
                                        (<Radio.Group onChange={(e) => { this.setState({ buyTipMsg: e.target.value }); }} disabled={!modify_flag}>
                                            {/* 不限的话 传给后台9999 */}
                                            <div><Radio value={false}>不限</Radio></div>
                                            <div className="radio-input-wrap">
                                                <Radio value={true}>限制</Radio>
                                                <div className="ticket-num-input-wrap margin-input">
                                                    <InputNumber
                                                        placeholder="请输入券包单用户限购数量"
                                                        value={buy_limit_count}
                                                        disabled={!modify_flag || !buyTipMsg}
                                                        max={9999}
                                                        min={1}
                                                        onChange={(value) => { this.setState({ buy_limit_count: value }); }} />
                                                    <span>个</span>
                                                </div>
                                            </div>
                                            {((modify_flag && (!buy_limit_count && buyTipMsg))) ? <span className="tip-msg">请输入券包单用户限购数量</span> : null}
                                            <span className="tip-msg"></span>
                                        </Radio.Group>)}
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item className="ticket-bag-create-box-item-btns">
                            <Button onClick={() => this.props.history.push('/ticket-bag/list')}>取 消</Button>
                            <Button type="primary" htmlType="submit">
                                提 交
							</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        );
    }
}

export default Form.create()(Create);

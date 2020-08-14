import React from 'react';
import './Update.scss';
import Points from '../../components/points/Points';
import { Button, Form, Input, Spin, Radio, DatePicker, InputNumber } from 'antd';
import { inject, observer } from 'mobx-react/index';
import moment from 'moment';

@inject('tickerManageStore')
@observer
class Update extends React.Component {
    state = {
    };

    componentDidMount() { }

    onSubmitClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!err) {
                const { record } = this.props.tickerManageStore;
                values.id = record.id;
                values.station_array = values.station_array.map(item => {
                    return item.key
                })
                if (values.coupon_type != 4) values.transferable = null;
                this.props.tickerManageStore.updateCoupon(values, () => {
                    this.props.history.push("/ticket-manage")
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loadingAdd, record } = this.props.tickerManageStore;
        const { coupon_name, coupon_desc, ponits, station_type, coupon_type = "0", coupon_amt, limit_amt,
            valid_type = "0", start_date, end_date, valid_days, single_push_limit, fund_bear = "信联", transferable = false } = record;
        return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-manage-update-container">
                    <div className="ticket-manage-update-title">修改优惠券</div>
                    <Form className="ticket-manage-update-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-manage-update-content-box">
                            <Form.Item className="ticket-manage-update-box-item other" label="优惠券名称">
                                {getFieldDecorator('coupon_name', {
                                    initialValue: coupon_name,
                                    rules: [{ required: true, message: '请输入优惠券名称' }]
                                })(<Input placeholder="给优惠券起个名词（不对用户展示）" />)}
                            </Form.Item>
                            <Form.Item className="ticket-manage-update-box-item" label="优惠券类型">
                                {getFieldDecorator('coupon_type', { initialValue: coupon_type, rules: [{ required: true, message: '请选择优惠券类型' }] })
                                    (<Radio.Group disabled>
                                        <Radio value="0">加油优惠券</Radio>
                                        <Radio value="1">洗车优惠券</Radio>
                                        <Radio value="3">提货券</Radio>
                                        <Radio value="4">洗车抵用券</Radio>
                                    </Radio.Group>)}
                            </Form.Item>
                            <div className="ticket-manage-update-content">
                                {coupon_type !== "4" ?
                                    <Form.Item className="ticket-manage-update-box-item other" label="优惠券面额">
                                        {getFieldDecorator('coupon_amt', { initialValue: coupon_amt })
                                            (<Input disabled placeholder="请输入优惠券面额" />)}
                                    </Form.Item> : null}
                                {coupon_type === "0" || coupon_type === "1" ?
                                    <Form.Item className="ticket-manage-update-box-item number" label="消费门槛">
                                        <div className="ticket-manage-update-box-item-detail margin-input">
                                            <span>消费金额满</span>
                                            <Input disabled value={limit_amt} />
                                            <span>元</span>
                                        </div>
                                    </Form.Item> : null}
                                <Form.Item className="ticket-manage-update-box-item" label="有效期设置">
                                    {getFieldDecorator('valid_type', { initialValue: valid_type })
                                        (<Radio.Group disabled>
                                            <Radio value="0">起止日期</Radio>
                                            <Radio value="1">固定天数</Radio>
                                        </Radio.Group>)}
                                </Form.Item>
                                {valid_type === "0" ?
                                    <Form.Item className="ticket-manage-update-box-item" label="有效期">
                                        {getFieldDecorator('date', { initialValue: [moment(start_date), moment(end_date)] })
                                            (<DatePicker.RangePicker disabled format="YYYY-MM-DD" />)}
                                    </Form.Item> : null}
                                {valid_type === "1" ?
                                    <Form.Item className="ticket-manage-update-box-item number" label="有效期">
                                        <div className="ticket-manage-update-box-item-detail margin-input">
                                            <InputNumber disabled value={valid_days} />
                                            <span>天</span>
                                        </div>
                                    </Form.Item> : null}
                                <Form.Item className="ticket-manage-update-box-item number" label="单个用户最多领取">
                                    <div className="ticket-manage-update-box-item-detail margin-input">
                                        <InputNumber disabled value={single_push_limit} />
                                        <span>张</span>
                                        <span id="hint">(-1:不限制)</span>
                                    </div>
                                </Form.Item>
                                {
                                    coupon_type == 4 ?
                                        <Form.Item className="ticket-manage-create-box-item" label="是否支持转赠">
                                            {getFieldDecorator('transferable', { initialValue: true })
                                                (<Radio.Group disabled>
                                                    <Radio value={true}>是</Radio>
                                                    <Radio value={false}>否</Radio>
                                                </Radio.Group>)}
                                        </Form.Item> : null
                                }



                                <Form.Item className="ticket-manage-update-box-item" label="优惠资金来源">
                                    {getFieldDecorator('fund_bear', { initialValue: fund_bear })
                                        (<Radio.Group disabled>
                                            <Radio value="信联">信联</Radio>
                                            <Radio value="商户">商户</Radio>
                                        </Radio.Group>)}
                                </Form.Item>
                                <Form.Item className="ticket-manage-update-box-item other" label="优惠券使用说明">
                                    {getFieldDecorator('coupon_desc', {
                                        initialValue: coupon_desc,
                                        rules: [{ required: true, message: '请输入优惠券使用说明' }]
                                    })(<Input.TextArea rows={4} placeholder="用于对用户展示优惠券使用说明，可分行输入" />)}
                                </Form.Item>
                                <Form.Item className="ticket-manage-update-box-item" label="优惠券适用网点">
                                    {getFieldDecorator('station_array', {
                                        initialValue: ponits,
                                        rules: [{ required: true, message: '请添加适用网点' }]
                                    })(<Points type={station_type === "加油" ? 1 : 2} />)}
                                </Form.Item>
                            </div>
                            <Form.Item className="ticket-manage-update-box-item-btns">
                                <Button onClick={() => this.props.history.push("/ticket-manage/list")}>取 消</Button>
                                <Button type="primary" htmlType="submit">
                                    提 交
								</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Spin>
        );
    }
}

export default Form.create()(Update);

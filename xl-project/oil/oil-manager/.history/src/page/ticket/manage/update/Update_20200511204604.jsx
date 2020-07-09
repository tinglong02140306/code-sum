import React from 'react';
import './Update.scss';
import Points from '../../components/points/Points';
import { Button, Form, Input, Radio, InputNumber, DatePicker, Spin } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';

@inject('tickerManageStore')
@observer
class Update extends React.Component {
	state = {};

	componentDidMount() {}

	onSubmitClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
        const { loadingAdd, record } = this.props.tickerManageStore;
		const {
			coupon_name,
			coupon_type,
			coupon_amt,
			limit_amt,
			single_push_limit,
			fund_bear,
			valid_type,
			valid_days,
			start_date,
			end_date,
			coupon_desc} = record;
		let oil_clean = coupon_type === '加油优惠券' || coupon_type === '洗车优惠券' || coupon_type === undefined;
		let voucher = coupon_type === '洗车抵用券';
		let is_oil = coupon_type === '加油优惠券' || coupon_type === '非油品提货券';
		let _valid_type = valid_type || '起止日期';
		return (
			<Spin spinning={loadingAdd}>
				<div className="ticket-manage-create-container">
					<div className="ticket-manage-create-title">修改优惠券</div>
					<Form className="ticket-manage-create-box" layout="inline" onSubmit={this.onSubmitClick}>
						<div className="ticket-manage-create-content-box">
							<Form.Item className="ticket-manage-create-box-item other" label="优惠券名称">
								{getFieldDecorator('coupon_name', {
									initialValue: coupon_name,
									rules: [ { required: true, message: '请输入优惠券名称' } ]
								})(<Input placeholder="给优惠券起个名词（不对用户展示）" />)}
							</Form.Item>
							<Form.Item className="ticket-manage-create-box-item" label="优惠券类型">
								{getFieldDecorator('coupon_type', {
									initialValue: coupon_type,
									rules: [ { required: true, message: '请选择优惠券类型' } ]
								})(
									<Radio.Group disabled>
										<Radio value="加油优惠券">加油优惠券</Radio>
										<Radio value="洗车优惠券">洗车优惠券</Radio>
										<Radio value="非油品提货券">非油品提货券</Radio>
										<Radio value="洗车抵用券">洗车抵用券</Radio>
									</Radio.Group>
								)}
							</Form.Item>
							<div className="ticket-manage-create-content">
								<Form.Item
									className="ticket-manage-create-box-item other"
									label="优惠券面额"
									style={{ display: !voucher ? 'flex' : 'none' }}
								>
									{getFieldDecorator('coupon_amt', { initialValue: coupon_amt })(
										<Input disabled placeholder="请输入优惠券面额" />
									)}
								</Form.Item>
								<Form.Item
									className="ticket-manage-create-box-item number"
									label="消费门槛"
									style={{ display: oil_clean ? 'flex' : 'none' }}
								>
									{getFieldDecorator('limit_amt', {
										initialValue: limit_amt,
										rules: [ { required: oil_clean, message: '请输入消费门槛' } ]
									})(
										<div className="ticket-manage-create-box-item-detail margin-input">
											<span>消费金额大于</span>
											<Input disabled placeholder="请输入" />
											<span>元</span>
										</div>
									)}
								</Form.Item>
								<Form.Item className="ticket-manage-create-box-item" label="有效期设置">
									{getFieldDecorator('valid_type', { initialValue: valid_type })(
										<Radio.Group disabled>
											<Radio value="起止日期">起止日期</Radio>
											<Radio value="固定天数">固定天数</Radio>
										</Radio.Group>
									)}
								</Form.Item>
								<Form.Item
									className="ticket-manage-create-box-item"
									style={{ display: _valid_type === '起止日期' ? 'inline-block' : 'none' }}
									label="有效期"
								>
									{getFieldDecorator('date', {
										initialValue: [moment(start_date),moment(end_date)],
										rules: [ { required: _valid_type === '起止日期', message: '请选择起止日期' } ]
									})(<DatePicker.RangePicker disabled format="YYYY-MM-DD" />)}
								</Form.Item>
								<Form.Item
									className="ticket-manage-create-box-item number"
									style={{ display: _valid_type === '固定天数' ? 'inline-block' : 'none' }}
									label="有效期"
								>
									{getFieldDecorator('valid_days', {initialValue: valid_days,
										rules: [ { required: _valid_type === '固定天数', message: '请输入有效期天数' } ]
									})(
										<div className="ticket-manage-create-box-item-detail margin-input">
											<InputNumber disabled placeholder="请输入" />
											<span>天</span>
										</div>
									)}
								</Form.Item>
								<Form.Item className="ticket-manage-create-box-item number" label="单个用户最多领取">
									{getFieldDecorator('single_push_limit', {initialValue: single_push_limit,
										rules: [ { required: true, message: '请输入单个用户最多领取量' } ]
									})(
										<div className="ticket-manage-create-box-item-detail margin-input">
											<InputNumber disabled placeholder="请输入" />
											<span>张</span>
											<span id="hint">(-1:不限制)</span>
										</div>
									)}
								</Form.Item>
								<Form.Item
									className="ticket-manage-create-box-item"
									label="优惠资金来源"
									style={{ display: oil_clean ? 'flex' : 'none' }}
								>
									{getFieldDecorator('fund_bear', {
										initialValue: fund_bear,
										rules: [ { required: oil_clean, message: '请选择优惠资金来源' } ]
									})(
										<Radio.Group disabled>
											<Radio value="XINLIAN">信联</Radio>
											<Radio value="STATION">商户</Radio>
										</Radio.Group>
									)}
								</Form.Item>
								<Form.Item className="ticket-manage-create-box-item other" label="优惠券使用说明">
									{getFieldDecorator('coupon_desc', {initialValue: coupon_desc,
										rules: [ { required: true, message: '请输入优惠券使用说明' } ]
									})(<Input.TextArea rows={4} placeholder="用于对用户展示优惠券使用说明，可分行输入" />)}
								</Form.Item>
								<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
									{getFieldDecorator('station_array', {
										rules: [ { required: true, message: '请添加适用网点' } ]
									})(<Points type={is_oil ? 1 : 2} />)}
								</Form.Item>
							</div>
							<Form.Item className="ticket-manage-create-box-item-btns">
								<Button htmlType="submit">取 消</Button>
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

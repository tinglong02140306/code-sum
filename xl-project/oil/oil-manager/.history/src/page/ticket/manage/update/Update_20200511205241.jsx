import React from 'react';
import './Update.scss';
import Points from '../../components/points/Points';
import { Button, Form, Input,Spin } from 'antd';
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
		const {coupon_name,coupon_type,coupon_desc} = record;
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
							<div className="ticket-manage-create-content">
								<Form.Item className="ticket-manage-create-box-item other" label="优惠券使用说明">
									{getFieldDecorator('coupon_desc', {initialValue: coupon_desc,
										rules: [ { required: true, message: '请输入优惠券使用说明' } ]
									})(<Input.TextArea rows={4} placeholder="用于对用户展示优惠券使用说明，可分行输入" />)}
								</Form.Item>
								<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
									{getFieldDecorator('station_array', {
										rules: [ { required: true, message: '请添加适用网点' } ]
									})(<Points type={coupon_type==="加油优惠券"||coupon_type==="非油品提货券"?1:2} />)}
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

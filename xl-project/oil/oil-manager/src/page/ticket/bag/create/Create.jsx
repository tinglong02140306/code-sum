import React from 'react';
import './Create.scss';
import Points from '../../components/points/Points';
import { Button, Form, Input, Radio, InputNumber, Select, Spin } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';

@inject('tickerBagStore')
@observer
class Create extends React.Component {
	state = {};

	componentDidMount() {
        this.props.tickerBagStore.queryAct();
    }

	onSubmitClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log(err);
			console.log(values);
			if (!err) {
                const act_id = values.act_id;
                const obj = this.getActObj(act_id);
                values.coupon_id = obj.coupon_id;
                values.coupon_count = obj.single_push_count;
                values.buy_limit = values.buy_limit==="NEW_USER"?"NEW_USER":"";
                values.instruction = values.instruction.replace(/\n/g,"<BR>");
				this.props.tickerBagStore.addBag(values, () => {
					this.props.history.push('/ticket-bag');
				});
			}
		});
    };
    
    getActObj = (act_id) =>{
        const { act_list } = this.props.tickerBagStore;
        for(let i=0;i<act_list.length;i++){
            const item = act_list[i];
            if(item.id===act_id){
                return item;
            }
        }
        return {}
	}
	
	//校验折扣率
	validateDiscountRate = (rule, value, callback)=>{
		const reg = /^0\.[1-9]{0,2}$/;
		if(reg.test(value)){
			callback();
		}else{
			callback('折扣率取值范围为0-1,不包含0和1,最多保留小数点后两位');
		}
	}

	render() {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { loadingAdd,act_list } = this.props.tickerBagStore;
        const { act_id } = getFieldsValue([ 'act_id']);
        let item = this.getActObj(act_id);
		return (
			<Spin spinning={loadingAdd}>
				<div className="ticket-bag-create-container">
					<div className="ticket-bag-create-title">新增洗车券包</div>
					<Form className="ticket-bag-create-box" layout="inline" onSubmit={this.onSubmitClick}>
						<div className="ticket-bag-create-content-box">
							<Form.Item className="ticket-bag-create-box-item other" label="券包名称">
								{getFieldDecorator('package_name', {
									rules: [ { required: true, message: '请输入券包名称' } ]
								})(<Input placeholder="请输入洗车券包名称，用于对用户展示洗车券包名称" />)}
							</Form.Item>
							<Form.Item className="ticket-bag-create-box-item other" label="选择发放活动">
								{getFieldDecorator('act_id', { rules: [ { required: true, message: '请选择发放活动' } ] })(
									<Select placeholder="请选择发放活动">
										{act_list&&act_list.map((item) => {
											return (<Select.Option key={item.id} value={item.id}>
													{item.act_name}
												</Select.Option>);})}
									</Select>
								)}
							</Form.Item>
							<Form.Item className="ticket-bag-create-box-item other" label="洗车券数量">
								{getFieldDecorator('single_push_count', { initialValue: item.single_push_count })(<Input disabled />)}
							</Form.Item>
							<Form.Item className="ticket-bag-create-box-item other" label="券包价格">
                                {getFieldDecorator('package_price',{ rules: [ { required: true, message: '请选择发放活动' } ] })
                                (<Input placeholder="请输入券包价格" />)}
							</Form.Item>
							<Form.Item className="ticket-bag-create-box-item other" label="折扣率">
                                {getFieldDecorator('discount_rate',{ rules: [ 
									{ required: true, message: '请输入券包折扣率,取值范围(0-1)' },
									{validator: this.validateDiscountRate} ] })
                                (<Input placeholder="请输入券包折扣率,用于展示,取值范围(0-1)" />)}
							</Form.Item>
                            <Form.Item className="ticket-bag-create-box-item other" label="是否限制新用户购买">
                                {getFieldDecorator('buy_limit',{initialValue: "NEW_USER"})
                                (<Radio.Group >
                                    <Radio value="NEW_USER">是</Radio>
                                    <Radio value="">否</Radio>
                                </Radio.Group>)}
							</Form.Item>
                            <Form.Item className="ticket-bag-create-box-item other" label="排列顺序">
                                {getFieldDecorator('sequence',{ rules: [ { required: true, message: '请输入排列顺序' } ] })
                                (<Input placeholder="按数字自小到大排列优惠券包的展示顺序，例：1，2，3" />)}
							</Form.Item>
							<Form.Item className="ticket-bag-create-box-item other" label="背景图">
                                {getFieldDecorator('background_url',{ rules: [ { required: true, message: '请输入背景图地址' } ] })
                                (<Input placeholder="请输入背景图地址" />)}
							</Form.Item>
                            <Form.Item className="ticket-bag-create-box-item other" label="描述">
                                {getFieldDecorator('description',{ rules: [ { required: true, message: '请输入券包描述' } ] })
                                (<Input.TextArea rows={4} placeholder="请输入券包描述，可分行输入" />)}
							</Form.Item>
                            <Form.Item className="ticket-bag-create-box-item other" label="使用说明">
                                {getFieldDecorator('instruction',{ rules: [ { required: true, message: '请输入券包使用说明' } ] })
                                (<Input.TextArea rows={4} placeholder="请输入券包使用说明" />)}
							</Form.Item>
						</div>
						<Form.Item className="ticket-bag-create-box-item-btns">
							<Button onClick={()=>this.props.history.push('/ticket-bag/list')}>取 消</Button>
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

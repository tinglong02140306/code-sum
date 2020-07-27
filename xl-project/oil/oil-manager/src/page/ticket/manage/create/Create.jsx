import React from 'react';
import './Create.scss';
import Points from '../../components/points/Points';
import {Button, Form, Input, Radio, InputNumber, DatePicker, Spin } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';

@inject('tickerManageStore')
@observer
class Create extends React.Component {
    
    state = {

	};

	componentDidMount() {
    }
    
    onSubmitClick=e=>{
        e.preventDefault();
		this.props.form.validateFields((err, values) => {
            console.log(err);
			if (!err) {
                values.start_date =  values.valid_type===0&&values.date?moment(values.date[0]).format('YYYY-MM-DD'):null;
                values.end_date =  values.valid_type===0&&values.date?moment(values.date[1]).format('YYYY-MM-DD'):null;
                values.valid_days = values.valid_type===1?values.valid_days:null;
                values.coupon_desc = values.coupon_desc.replace(/\n/g,"<BR>");
                if(values.coupon_type===0){
                    values.station_array = values.array0.map(item=>{
                        return item.key
                    })
                }else if(values.coupon_type===1){
                    values.station_array = values.array1.map(item=>{
                        return item.key
                    })
                }else if(values.coupon_type===3){
                    values.station_array = values.array3.map(item=>{
                        return item.key
                    })
                }else if(values.coupon_type===4){
                    values.station_array = values.array4.map(item=>{
                        return item.key
                    })
                }
				this.props.tickerManageStore.addCoupon(values,()=>{
                    this.props.history.push("/ticket-manage")
                });
			}
		});
    }

	render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const {loadingAdd} = this.props.tickerManageStore;
        const {valid_type=0, coupon_type=0} = getFieldsValue(["valid_type","coupon_type"]);
		return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-manage-create-container">
                    <div className="ticket-manage-create-title">创建优惠券</div>
                    <Form className="ticket-manage-create-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-manage-create-content-box">
                            <Form.Item className="ticket-manage-create-box-item other" label="优惠券名称">
                                {getFieldDecorator('coupon_name',{rules: [ { required: true, message: '请输入优惠券名称' } ]})(<Input placeholder="给优惠券起个名词（不对用户展示）"/>)}
                            </Form.Item>
                            <Form.Item className="ticket-manage-create-box-item" label="优惠券类型">
                                {getFieldDecorator('coupon_type',{initialValue:coupon_type,rules: [ { required: true, message: '请选择优惠券类型' }]})
                                (<Radio.Group >
                                    <Radio value={0}>加油优惠券</Radio>
                                    <Radio value={1}>洗车优惠券</Radio>
                                    <Radio value={3}>提货券</Radio>
                                    <Radio value={4}>洗车抵用券</Radio>
                                </Radio.Group>)}
                            </Form.Item>
                            <div className="ticket-manage-create-content">
                                {coupon_type!==4? 
                                    <Form.Item className="ticket-manage-create-box-item other" label="优惠券面额">
                                        {getFieldDecorator('coupon_amt',{rules: [ { required: true, message: '请输入优惠券面额' }]})(<Input placeholder="请输入优惠券面额"/>)}
                                    </Form.Item>:null}
                                {coupon_type===0||coupon_type===1?
                                    <Form.Item className="ticket-manage-create-box-item number" label="消费门槛">
                                        {getFieldDecorator('limit_amt',{rules: [ { required: true, message: '请输入消费门槛' }]})
                                        (<div className="ticket-manage-create-box-item-detail margin-input">
                                            <span>消费金额满</span>
                                            <Input placeholder="请输入"/>
                                            <span>元</span></div>)}
                                    </Form.Item>:null}
                                <Form.Item className="ticket-manage-create-box-item" label="有效期设置">
                                    {getFieldDecorator('valid_type',{initialValue:valid_type})
                                    (<Radio.Group >
                                        <Radio value={0}>起止日期</Radio>
                                        <Radio value={1}>固定天数</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                {valid_type===0?
                                    <Form.Item className="ticket-manage-create-box-item" label="有效期">
                                        {getFieldDecorator('date',{rules: [{ required: true, message: '请选择起止日期' }]})
                                        (<DatePicker.RangePicker  format="YYYY-MM-DD"/>)}
                                    </Form.Item>:null}
                                {valid_type===1?
                                    <Form.Item className="ticket-manage-create-box-item number" label="有效期">
                                        {getFieldDecorator('valid_days',{rules: [{ required: true, message: '请输入有效期天数' }]})
                                        (<div className="ticket-manage-create-box-item-detail margin-input">
                                            <InputNumber placeholder="请输入"/>
                                            <span>天</span></div>)}
                                    </Form.Item>:null}
                                <Form.Item className="ticket-manage-create-box-item number" label="单个用户最多领取">
                                    {getFieldDecorator('single_push_limit',{rules: [{ required: true, message: '请输入单个用户最多领取量' }]})
                                    (<div className="ticket-manage-create-box-item-detail margin-input">
                                        <InputNumber placeholder="请输入"/>
                                        <span>张</span>
                                        <span id="hint">(-1:不限制)</span></div>)}
                                </Form.Item>
                                <Form.Item className="ticket-manage-create-box-item" label="优惠资金来源">
                                    {getFieldDecorator('fund_bear',{initialValue:"信联",rules: [ { required: true, message: '请选择优惠资金来源' }]})
                                    (<Radio.Group >
                                         <Radio value="信联">信联</Radio>
                                        <Radio value="商户">商户</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                <Form.Item className="ticket-manage-create-box-item other" label="优惠券使用说明">
                                    {getFieldDecorator('coupon_desc',{rules: [ { required: true, message: '请输入优惠券使用说明' }]})
                                    (<Input.TextArea rows={4}  placeholder="用于对用户展示优惠券使用说明，可分行输入"/>)}
                                </Form.Item>
                                {coupon_type===0?<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
                                    {getFieldDecorator('array0',{rules: [ { required: true, message: '请添加适用网点' }]})
                                    (<Points type={1}/>)}
                                </Form.Item>:null}
                                {coupon_type===1?<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
                                    {getFieldDecorator('array1',{rules: [ { required: true, message: '请添加适用网点' }]})
                                    (<Points type={2}/>)}
                                </Form.Item>:null}
                                {coupon_type===3?<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
                                    {getFieldDecorator('array3',{rules: [ { required: true, message: '请添加适用网点' }]})
                                    (<Points type={1}/>)}
                                </Form.Item>:null}
                                {coupon_type===4?<Form.Item className="ticket-manage-create-box-item" label="优惠券适用网点">
                                    {getFieldDecorator('array4',{rules: [ { required: true, message: '请添加适用网点' }]})
                                    (<Points type={2}/>)}
                                </Form.Item>:null}
                            </div>
                            <Form.Item className="ticket-manage-create-box-item-btns">
                                <Button  onClick={()=>this.props.history.push("/ticket-manage/list")}>取 消</Button>
                                <Button  type="primary" htmlType="submit">提 交</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Spin>
		);
	}


}

export default Form.create()(Create);

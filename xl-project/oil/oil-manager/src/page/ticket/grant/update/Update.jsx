import React from 'react';
import './Update.scss';
import Points from '../../components/points/Points';
import Rules from '../../components/rules/Rules';
import {Button, Form, Input, Radio, Spin, Select, InputNumber,DatePicker } from 'antd';
import { inject, observer } from 'mobx-react/index';
import moment from 'moment';

@inject('tickerGrantStore')
@observer
class Update extends React.Component {
	state = {

	};

	componentDidMount() {
        this.props.tickerGrantStore.getCoupons();
    }
    
    onSubmitClick=e=>{
        e.preventDefault();
        const {record} = this.props.tickerGrantStore;
		this.props.form.validateFields((err, values) => {
            console.log(values);
             values.id = record.id;
			if (!err) {
				if(values.act_type==="消费返还"){
                    if(values.station_type==="加油"){
                        values.station_array = values.gas_array&&values.gas_array.map(item=>{
                            return item.key
                        })
                    }else{
                        values.station_array =  values.washer_array&&values.washer_array.map(item=>{
                            return item.key
                        })
                    }
                    this.props.tickerGrantStore.update(values,()=>{
                        this.props.history.push("/ticket-grant");
                    });
                }else{
                    values.station_array=null;
                    this.props.tickerGrantStore.update(values,()=>{
                        this.props.history.push("/ticket-grant");
                    });
                }
			}
		});
    }

	render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const {loadingAdd, record} = this.props.tickerGrantStore;
        const {act_name, push_type="券码兑换", ponits, station_type="加油",coupon_name,coupon_id,
        push_count, single_push_count, start_date, end_date, oil_type, limit_dates,limit_cnt} = record;
        const station_type_default = getFieldsValue(["station_type"]).station_type||station_type;
		return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-grant-create-container">
                    <div className="ticket-grant-create-title">修改发放活动</div>
                    <Form className="ticket-grant-create-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-grant-create-content-box">
                            <Form.Item className="ticket-grant-create-box-item other" label="活动名称">
                                {getFieldDecorator('act_name',{initialValue:act_name,rules: [ { required: true, message: '请输入活动名称，用于对用户展示优惠券来源' } ]})(<Input placeholder="请输入活动名称，用于对用户展示优惠券来源"/>)}
                            </Form.Item>
                            <Form.Item className="ticket-grant-create-box-item" label="发放方式">
                                {getFieldDecorator('act_type',{initialValue:push_type})
                                (<Radio.Group disabled>
                                    <Radio value="券码兑换">券码兑换</Radio>
                                    <Radio value="指定发放">指定发放</Radio>
                                    <Radio value="消费返还">消费返还</Radio>
                                    <Radio value="系统配置">系统配置</Radio>
                                </Radio.Group>)}
                            </Form.Item>
                            {push_type!=="消费返还"?
                                <Form.Item className="ticket-grant-create-box-item" label="选择优惠券">
                                    {getFieldDecorator('coupon_id',{initialValue:coupon_id})
                                    (<Select disabled>
                                         <Select.Option  value={coupon_id}>{coupon_name}</Select.Option>
                                    </Select>)}
                                </Form.Item>:null}
                            {push_type==="券码兑换"?
                                <Form.Item className="ticket-grant-create-box-item number" label="券码兑换总数量">
                                    <div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber defaultValue={push_count} disabled/>
                                        <span>张</span>
                                    </div>
                                </Form.Item>:null}
                            {push_type==="系统配置"?<div className="ticket-grant-create-content">
                                    <Form.Item className="ticket-grant-create-box-item number" label="每人发放该券数量">
                                        <div className="ticket-grant-create-box-item-detail margin-input">
                                            <InputNumber defaultValue={single_push_count} disabled/>
                                            <span>张</span>
                                        </div>
                                    </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item number" label="投放最大数量">
                                    <div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber defaultValue={limit_cnt} disabled/>
                                        <span>张</span>
                                    </div>
                                </Form.Item>
                                </div> :null}
                            {push_type==="消费返还"?<div className="ticket-grant-create-content">
                                <Form.Item className="ticket-grant-create-box-item" label="适用消费场景">
                                    {getFieldDecorator('station_type',{initialValue:station_type_default})
                                    (<Radio.Group disabled>
                                        <Radio value="加油">加油消费</Radio>
                                        <Radio value="洗车">洗车消费</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                {station_type_default==="加油"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动网点">
                                        {getFieldDecorator('gas_array',{initialValue:station_type==="加油"?ponits:[],rules: [{ required: true, message: '请添加满赠活动网点' }]})
                                        (<Points type={1}></Points>)}
                                    </Form.Item>:null}
                                {station_type_default==="洗车"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动网点">
                                        {getFieldDecorator('washer_array',{initialValue:station_type==="洗车"?ponits:[],rules: [{ required: true, message: '请添加满赠活动网点' }]})
                                        (<Points type={2}></Points>)}
                                    </Form.Item>:null}
                                <Form.Item className="ticket-grant-create-box-item" label="满赠活动商品">
                                    {getFieldDecorator('oil_type',{initialValue:oil_type})
                                    (<Radio.Group disabled>
                                        <Radio value="0">汽油</Radio>
                                        <Radio value="1">柴油</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item" label="活动时间">
                                    {getFieldDecorator('date',{initialValue:[moment(start_date),moment(end_date)]})
                                    (<DatePicker.RangePicker disabled format="YYYY-MM-DD"/>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item" label="满赠规则">
                                    {getFieldDecorator('limit_dates',{})
                                    (<Rules disabled data={limit_dates}/>)}
                                </Form.Item>
                            </div>:null}
                            <Form.Item className="ticket-grant-create-box-item-btns">
                                <Button  onClick={()=>this.props.history.push("/ticket-grant/list")}>取 消</Button>
                                <Button  type="primary" htmlType="submit">提 交</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Spin>
		);
	}


}

export default Form.create()(Update);

import React from 'react';
import './Create.scss';
import Points from '../../components/points/Points';
import Rules from '../../components/rules/Rules';
import Upload from '../../../../component/upload/Upload.jsx';
import {Button, Form, Input, Radio, InputNumber, DatePicker, Spin, Select, message } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';

@inject('tickerGrantStore')
@observer
class Create extends React.Component {
    
    state = {

	};

	componentDidMount() {
        this.props.tickerGrantStore.getCoupons();
    }
    
    onSubmitClick=e=>{
        e.preventDefault();
        const {getFieldsValue } = this.props.form;
        const {act_type,input_mode} = getFieldsValue(["act_type","input_mode"]);
		this.props.form.validateFields((err, values) => {
            console.log(values);
			if (!err) {
				if(act_type==="券码兑换"){
                    this.props.tickerGrantStore.pushCdkey(values,()=>{
                        message.info("创建成功");
                        this.props.history.push("/ticket-grant");
                    });
                }else if(act_type==="指定发放"){
                    if(input_mode==="直接录入"){
                        values.mobile_array = values.mobile_array.split(';');
                        this.props.tickerGrantStore.pushAim(values,()=>{
                            message.info("创建成功");
                            this.props.history.push("/ticket-grant");
                        });
                    }else if(input_mode==="表格导入"){
                        this.props.tickerGrantStore.pushAimBatch(values,()=>{
                            message.info("创建成功");
                            this.props.history.push("/ticket-grant");
                        });
                    }
                }else if(act_type==="消费返还"){
                    values.start_date =  values.date&&moment(values.date[0]).format('YYYY-MM-DD');
                    values.end_date =  values.date&&moment(values.date[1]).format('YYYY-MM-DD');
                    if(values.station_type==="加油"){
                        values.station_array = values.gas_array&&values.gas_array.map(item=>{
                            return item.key
                        })
                    }else{
                        values.station_array =  values.washer_array&&values.washer_array.map(item=>{
                            return item.key
                        })
                    }
                    this.props.tickerGrantStore.pushConsume(values,()=>{
                        message.info("创建成功");
                        this.props.history.push("/ticket-grant");
                    });
                }else if(act_type==="系统配置"){
                    this.props.tickerGrantStore.pushSystem(values,()=>{
                        message.info("创建成功");
                        this.props.history.push("/ticket-grant");
                    });
                }
			}
		});
    }

	render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const {act_type="券码兑换",input_mode="直接录入",station_type="加油"} = getFieldsValue(["act_type","input_mode","station_type"]);
        const {loadingAdd, coupons} = this.props.tickerGrantStore;
		return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-grant-create-container">
                    <div className="ticket-grant-create-title">创建发放活动</div>
                    <Form className="ticket-grant-create-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-grant-create-content-box">
                            <Form.Item className="ticket-grant-create-box-item other" label="活动名称">
                                {getFieldDecorator('act_name',{rules: [ { required: true, message: '请输入活动名称，用于对用户展示优惠券来源' } ]})(<Input placeholder="请输入活动名称，用于对用户展示优惠券来源"/>)}
                            </Form.Item>
                            <Form.Item className="ticket-grant-create-box-item" label="发放方式">
                                {getFieldDecorator('act_type',{initialValue:"券码兑换"})
                                (<Radio.Group >
                                    <Radio value="券码兑换">券码兑换</Radio>
                                    <Radio value="指定发放">指定发放</Radio>
                                    <Radio value="消费返还">消费返还</Radio>
                                    <Radio value="系统配置">系统配置</Radio>
                                </Radio.Group>)}
                            </Form.Item>
                            {/* 券码兑换 */}
                            {act_type==="券码兑换"?<div className="ticket-grant-create-content">
                                <Form.Item className="ticket-grant-create-box-item" label="选择优惠券">
                                    {getFieldDecorator('coupon_id',{rules: [ { required: true, message: '请选择优惠券' } ]})
                                    (<Select  placeholder="请选择优惠券">
                                        {coupons&&coupons.map(item=>{
                                            return <Select.Option key={item.id} value={item.id}>{item.coupon_name}</Select.Option>
                                        })}
                                    </Select>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item number" label="券码兑换总数量">
                                    {getFieldDecorator('coupon_count',{rules: [ { required: true, message: '请输入券码兑换总数量' }]})
                                     (<div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber placeholder="请输入"/>
                                        <span>张</span></div>)}
                                </Form.Item>
                            </div>:null}
                            {/* 指定发放 */}
                            {act_type==="指定发放"?<div className="ticket-grant-create-content">
                                <Form.Item className="ticket-grant-create-box-item" label="选择优惠券">
                                    {getFieldDecorator('coupon_id',{rules: [ { required: true, message: '请选择优惠券' } ]})
                                    (<Select  placeholder="请选择优惠券">
                                        {coupons&&coupons.map(item=>{
                                            return <Select.Option key={item.id} value={item.id}>{item.coupon_name}</Select.Option>
                                        })}
                                    </Select>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item number" label="每人发放该券数量">
                                    {getFieldDecorator('push_count',{rules: [ { required: true, message: '请输入每人发放该券数量' }]})
                                     (<div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber placeholder="请输入"/>
                                        <span>张</span></div>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item" label="投放依据">
                                    {getFieldDecorator('push_type')
                                    (<Radio disabled checked>手机号</Radio>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item" label="投放依据录入">
                                    {getFieldDecorator('input_mode',{initialValue:"直接录入"})
                                    (<Radio.Group >
                                        <Radio value="直接录入">直接录入</Radio>
                                        <Radio value="表格导入">表格导入</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                {input_mode==="直接录入"?
                                    <Form.Item className="ticket-grant-create-box-item other" label="录入手机号">
                                        {getFieldDecorator('mobile_array',{rules: [ { required: true, message: '请输入手机号' }]})
                                        (<Input.TextArea rows={4}  placeholder="请输入手机号，多个手机号请使用英文分号“;”隔开"/>)}
                                    </Form.Item>:null}
                                {input_mode==="表格导入"?
                                    <Form.Item className="ticket-grant-create-box-item other" label="上传文件">
                                        {getFieldDecorator('file',{rules: [ { required: true, message: '请上传文件' }]})
                                        (<Upload type={3}/>)}
                                    </Form.Item>:null}
                                {input_mode==="表格导入"?
                                    <Form.Item className="ticket-grant-create-box-item other" label="">
                                        {(<div className="grant-create-box">
                                            <span className="grant-span">文本文件，手机号使用英文状态下,间隔</span>
                                            <span className="grant-span">eg: 18766590265,18766590265</span>
                                        </div>)}
                                    </Form.Item>:null}
                            </div>:null}
                            {/* 消费返还 */}
                            {act_type==="消费返还"?<div className="ticket-grant-create-content">
                                <Form.Item className="ticket-grant-create-box-item" label="适用消费场景">
                                    {getFieldDecorator('station_type',{initialValue:station_type})
                                    (<Radio.Group >
                                        <Radio value="加油">加油消费</Radio>
                                        <Radio value="洗车">洗车消费</Radio>
                                    </Radio.Group>)}
                                </Form.Item>
                                {station_type==="加油"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动网点">
                                        {getFieldDecorator('gas_array',{rules: [{ required: true, message: '请添加满赠活动网点' }]})
                                        (<Points type={1}></Points>)}
                                    </Form.Item>:null}
                                {station_type==="洗车"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动网点">
                                        {getFieldDecorator('washer_array',{rules: [{ required: true, message: '请添加满赠活动网点' }]})
                                        (<Points type={2}></Points>)}
                                    </Form.Item>:null}
                                {/*加油消费*/}
                                {station_type==="加油"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动商品">
                                        {getFieldDecorator('oil_type',{initialValue:0})
                                        (<Radio.Group >
                                            <Radio value={0}>汽油</Radio>
                                            <Radio value={1}>柴油</Radio>
                                        </Radio.Group>)}
                                    </Form.Item>:null}
                                {/*洗车消费*/}
                                {station_type==="洗车"?
                                    <Form.Item className="ticket-grant-create-box-item" label="满赠活动商品">
                                        {getFieldDecorator('oil_type',{initialValue:0})
                                        (<Radio disabled checked>洗车服务</Radio>)}
                                    </Form.Item>:null}
                                <Form.Item className="ticket-grant-create-box-item" label="活动时间">
                                    {getFieldDecorator('date',{rules: [{ required: true, message: '请选择起止日期' }]})
                                    (<DatePicker.RangePicker  format="YYYY-MM-DD"/>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item" label="满赠规则">
                                    {getFieldDecorator('limit_dates',{rules: [{ required: true, message: '请添加满赠规则' }]})
                                    (<Rules data={coupons} disabled={false}/>)}
                                </Form.Item>
                            </div>:null}
                            {/* 系统配置 */}
                            {act_type==="系统配置"?<div className="ticket-grant-create-content">
                                <Form.Item className="ticket-grant-create-box-item" label="选择优惠券">
                                    {getFieldDecorator('coupon_id',{rules: [ { required: true, message: '请选择优惠券' } ]})
                                    (<Select  placeholder="请选择优惠券">
                                        {coupons&&coupons.map(item=>{
                                            return <Select.Option key={item.id} value={item.id}>{item.coupon_name}</Select.Option>
                                        })}
                                    </Select>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item number" label="每人发放该券数量">
                                    {getFieldDecorator('coupon_count',{rules: [ { required: true, message: '请输入每人发放该券数量' }]})
                                     (<div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber placeholder="请输入"/>
                                        <span>张</span></div>)}
                                </Form.Item>
                                <Form.Item className="ticket-grant-create-box-item number" label="投放最大数量">
                                    {getFieldDecorator('limit_cnt',{rules: [ { required: true, message: '请输入投放最大数量' }]})
                                    (<div className="ticket-grant-create-box-item-detail margin-input">
                                        <InputNumber placeholder="请输入"/>
                                        <span>张</span></div>)}
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

export default Form.create()(Create);

import React from 'react';
import moment from 'moment';
import { Table, Button, Modal, Form, Input, Icon, message, Select, DatePicker } from 'antd';
import { inject, observer } from 'mobx-react/index';
import { getCurrentDate, getCurrentMonthFirst } from '../../../utils/dateUtils';
import './Order.scss';

let page_num = 1;
const PAGE_SIZE = 15;

@inject('tickerBagOrderStore')
@observer
class List extends React.Component {
	state = {
		export_modal: false,
		download_modal:false,
		show_record: null
	};

	componentDidMount() {
		page_num = 1;
		this.props.tickerBagOrderStore.queryBag();
		this.fetch();
	}

	//列表
	fetch = () => {
		const { getFieldsValue } = this.props.form;
		const { mobile, order_no,order_status,package_id ,date} = 
			getFieldsValue([ 'mobile', 'order_no',"order_status","package_id","date" ]);
		const params = {
			page_num: page_num,
			page_size: PAGE_SIZE,
			mobile: mobile||null,
			order_no: order_no||null,
			order_status:order_status||null,
			package_id:package_id||null,
			start_date:date?moment(date[0]).format('YYYY-MM-DD'):null,
			end_date:date?moment(date[1]).format('YYYY-MM-DD'):null,
		};
		this.props.tickerBagOrderStore.query(params);
	};

	//分页加载
	handleTableChange = (pagination) => {
		const pager = { ...this.props.tickerBagOrderStore.pagination };
		pager.current = pagination.current;
		page_num = pagination.current;
		this.fetch();
	};

	//查询按钮 点击事件
	onQueryClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log(err);
			console.log(values);
			if (!err) {
				this.fetch();
			}
		});
	};

	//下载订单
	onDownloadOrder = (file_name) => {
		this.props.tickerBagOrderStore.downloadOrder(file_name, (file_url) => {
			this.setState({ download_modal: false })
			window.location.href = file_url;
		});
	};

	download = () => {
		const { download_modal } = this.state;
		const { loadingDownLoad } = this.props.tickerBagOrderStore;
		const washOrderString = localStorage.getItem("TICKER_BAG_ORDER");
		const washOrder = washOrderString&&JSON.parse(washOrderString);
		let isHasFile = false;
		if(washOrder){
			let preTime = washOrder.time;
			let currentTime = new Date().getTime();
			let diff = currentTime - parseFloat(preTime);
			let minute = Math.floor(diff/(60*1000));
			isHasFile = minute<30;
		}
		return (
			<Modal
				visible={download_modal}
				title="下载订单"
				footer={null}
				className="vehicle-order-modal"
				onCancel={() => this.setState({ download_modal: false })}
			>
				{isHasFile?
					<Form className="vehicle-order-modal-form" width={800}>
						<div className="vehicle-order-modal-download">
							上次导出的订单:
							<span>{washOrder.file_name}</span>
						</div>
						<Form.Item className="vehicle-order-modal-form-footer">
							<Button htmlType="submit" onClick={() => this.setState({ download_modal: false })}>
								取消
							</Button>
							<Button type="primary" htmlType="submit" loading={loadingDownLoad} 
									onClick={()=>this.onDownloadOrder(washOrder.file_name)}>
									下载
							</Button>
						</Form.Item>
					</Form>:<Form className="vehicle-order-modal-form" width={800}>
						<div className="vehicle-order-modal-download">
							文件已失效，请先导出订单
						</div>
						<Form.Item className="vehicle-order-modal-form-footer">
							<Button type="primary" htmlType="submit"  
									onClick={()=>this.setState({download_modal:false})}>
									确定
							</Button>
						</Form.Item>
					</Form>}
			</Modal>
		);
	}

	export = () => {
		const {export_modal} = this.state;
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const {loadingExport} = this.props.tickerBagOrderStore;
		
		const disabledStartDate = (startValue) => {
			const endValue = getFieldsValue([ 'end' ]).end;
			if (!startValue || !endValue) {
				return false;
			}
			return startValue.valueOf() > endValue.valueOf();
		};

		const disabledEndDate = (endValue) => {
			const { getFieldsValue } = this.props.form;
			const startValue = getFieldsValue([ 'start' ]).start;
			if (!endValue || !startValue) {
				return false;
			}
			return endValue.valueOf() <= startValue.valueOf();
		};

		//导出订单
		const onExportClick = (e) => {
			e.preventDefault();
			const {  order_status, start_date, end_date } = getFieldsValue(['order_status', 'start_date', 'end_date' ]);
			if ((end_date.valueOf() - start_date.valueOf()) / 24 / 60 / 60 / 1000 > 31) {
				message.error('最多导出31天');
			} else {
				const params = {
					order_status: order_status||null,
					start_date: moment(start_date).format('YYYY-MM-DD'),
					end_date: moment(end_date).format('YYYY-MM-DD')
				};
				this.props.tickerBagOrderStore.exportOrder(params, () => {
					this.setState({export_modal:false,download_modal:true});
				});
			}
		};

		return <Modal visible={export_modal}
			title="生成导出文件"
			footer={null}
			className="ticket-order-modal"
			onCancel={() => this.setState({export_modal: false})}>
			<Form className="ticket-order-export-form" width={800} layout="inline" onSubmit={onExportClick}>
					<Form.Item className="ticket-order-export-form-item" label="订单状态">
						{getFieldDecorator('order_status',{ initialValue: "" })(
							<Select placeholder="请选择订单状态">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="00">创建</Select.Option>
								<Select.Option value="01">支付成功</Select.Option>
								<Select.Option value="03">消费成功</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="ticket-order-export-form-item" label="开始日期">
						{getFieldDecorator('start_date', { initialValue: moment(getCurrentMonthFirst(), 'YYYY-MM-DD') })(
							<DatePicker format="YYYY-MM-DD" disabledDate={disabledStartDate} />
						)}
					</Form.Item>
					<Form.Item className="ticket-order-export-form-item" label="结束日期">
						{getFieldDecorator('end_date', { initialValue: moment(getCurrentDate(), 'YYYY-MM-DD') })(
							<DatePicker format="YYYY-MM-DD" disabledDate={disabledEndDate} />
						)}
					</Form.Item>
					<div className="hint">（注：默认导出当前月流水,最大可导出31天的数据）</div>
					<Form.Item className="ticket-order-export-form-footer">
						<Button htmlType="submit" onClick={() => this.setState({ export_modal: false })}>取消</Button>
						<Button type="primary" htmlType="submit" loading={loadingExport}>确定</Button>
					</Form.Item>
				</Form>
		</Modal>
	}

	//Table 表头
	header = () => {
		return (<div>
			<Button size="small" type="primary" onClick={() => this.setState({export_modal:true})}>导出订单</Button>
			<Button size="small" type="primary" onClick={() => this.setState({download_modal:true})} style={{marginLeft:10}}>下载订单</Button>
		</div>
		);
	};

	render() {
		const {export_modal, download_modal} = this.state;
		const { list, pagination, loading,act_list } = this.props.tickerBagOrderStore;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="ticket-order-list-container">
				<Form className="ticket-order-list-form" layout="inline" onSubmit={this.onQueryClick}>
					<Form.Item className="ticket-order-list-form-item" label="手机号">
						{getFieldDecorator('mobile')(<Input size="small" placeholder="请输入手机号" />)}
					</Form.Item>
					<Form.Item className="ticket-order-list-form-item" label="订单号">
						{getFieldDecorator('order_no')(<Input size="small" placeholder="请输入订单号" />)}
					</Form.Item>
					<Form.Item className="ticket-order-list-form-item" label="订单状态">
						{getFieldDecorator('order_status')(
							<Select placeholder="请选择订单状态">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="00">创建</Select.Option>
								<Select.Option value="01">支付成功</Select.Option>
								<Select.Option value="03">消费成功</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="ticket-order-list-form-item" label="券包">
						{getFieldDecorator('package_id',{initialValue:""})(
							<Select placeholder="请选择券包">
								<Select.Option value="">全部</Select.Option>
								{act_list&&act_list.map((item,index)=>{
									return <Select.Option key={index} value={item.id}>{item.package_name}</Select.Option>
								})}
							</Select>
						)}
					</Form.Item>
					<Form.Item className="ticket-order-list-form-item range-picker" label="起止日期">
						{getFieldDecorator('date')(<DatePicker.RangePicker size="small" />)}
					</Form.Item>
					<div className="ticket-order-list-form-btns">
						<Form.Item>
							<Button size="small" type="primary" htmlType="submit" onClick={() => {}}>
								查询
							</Button>
						</Form.Item>
						{/* <Form.Item>
							<Button size="small">重置</Button>
						</Form.Item> */}
					</div>
				</Form>
				<Table
					className="ticket-order-list-table"
					title={this.header}
					bordered
					size="small"
					columns={this.columns}
					onChange={this.handleTableChange}
					dataSource={list}
					pagination={pagination}
					loading={loading}
				/>
				{export_modal?this.export():null}
				{download_modal?this.download():null}
			</div>
		);
	}

	columns = [
		{
			title: '订单号',
			dataIndex: 'order_no',
			key: 'order_no',
			align: 'center'
		},
		{
			title: '订单状态',
			dataIndex: 'order_status',
			key: 'order_status',
			align: 'center',
			render: (record) => {
				const order_status =
					record === '00' ? '创建' : record === '01' ? '支付成功' : record === '03' ? '消费成功' : '--';
				return <div>{order_status}</div>;
			}
		},
		{
			title: '订单金额',
			dataIndex: 'order_amount',
			key: 'order_amount',
			align: 'center'
		},
		{
			title: '支付时间',
			dataIndex: 'payment_time',
			key: 'payment_time',
			align: 'center'
		},
		{
			title: '手机号',
			key: 'mobile',
			dataIndex: 'mobile',
			align: 'center'
		},
		{
			title: '活动',
			dataIndex: 'act_name',
			key: 'act_name',
			align: 'center'
		},
		{
			title: '券名称',
			dataIndex: 'coupon_name',
			key: 'coupon_name',
			align: 'center'
		},
		{
			title: '券数量',
			dataIndex: 'coupon_count',
			key: 'coupon_count',
			align: 'center'
		},
		{
			title: '券包名称',
			dataIndex: 'package_name',
			key: 'package_name',
			align: 'center'
		},
		{
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			align: 'center'
		}
	];
}

export default Form.create()(List);

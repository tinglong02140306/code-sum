import React from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Icon, message, Select, DatePicker } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './Order.scss';
import moment from 'moment';
import { getCurrentDate, getCurrentMonthFirst } from '../../../utils/dateUtils';

let page_num = 1;
const PAGE_SIZE = 15;
let order_status = '';

@inject('vehicleOrderStore')
@observer
class Order extends React.Component {
	state = {
		modal_type: 0, //1:查看
		modal_obj: null,
		export_modal: false,
		download_modal: false
	};

	disabledStartDate = (startValue) => {
		const { getFieldsValue } = this.props.form;
		const endValue = getFieldsValue([ 'end_date' ]).end_date;
		if (!startValue || !endValue) {
			return false;
		}
		return startValue.valueOf() > endValue.valueOf();
	};

	disabledEndDate = (endValue) => {
		const { getFieldsValue } = this.props.form;
		const startValue = getFieldsValue([ 'start_date' ]).start_date;
		if (!endValue || !startValue) {
			return false;
		}
		return endValue.valueOf() <= startValue.valueOf();
	};

	componentDidMount() {
		page_num = 1;
		this.fetch();
	}

	//列表
	fetch = () => {
		const { getFieldsValue } = this.props.form;
		const { mobile, order_status, start_date, end_date } = getFieldsValue([
			'mobile',
			'order_status',
			'start_date',
			'end_date'
		]);
		const params = {
			page_num: page_num,
			page_size: PAGE_SIZE,
			mobile: mobile || null,
			order_status: order_status || null,
			start_date: (start_date && moment(start_date).format('YYYY-MM-DD')) || null,
			end_date: (end_date && moment(end_date).format('YYYY-MM-DD')) || null
		};
		this.props.vehicleOrderStore.query(params);
	};

	//分页加载
	handleTableChange = (pagination) => {
		const pager = { ...this.props.vehicleOrderStore.pagination };
		pager.current = pagination.current;
		page_num = pagination.current;
		this.fetch();
	};

	//查询按钮 点击事件
	onQueryClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				order_status = values.order_status;
				this.fetch();
			}
		});
	};

	//退款
	onRefundClick = (order_no) => {
		this.props.vehicleOrderStore.orderRefund(order_no, () => {
			this.fetch();
		});
	};

	//下载订单
	onDownloadOrder = (file_name) => {
		this.props.vehicleOrderStore.downloadOrder(file_name, (file_url) => {
			this.setState({ download_modal: false })
			window.location.href = file_url;
		});
	};

	//Table 表头
	header = () => {
		return (
			<div>
				<Button size="small" type="primary" onClick={() => this.setState({ export_modal: true })}>
					导出订单
				</Button>
				<Button
					className="vehicle-order-btn"
					size="small"
					type="primary"
					onClick={() => this.setState({ download_modal: true })}>
					下载订单
				</Button>
			</div>
		);
	};

	//下载订单
	downloadModal = () => {
		const { download_modal } = this.state;
		const { loadingDownLoad } = this.props.vehicleOrderStore;
		const washOrderString = localStorage.getItem("WASH_ORDER");
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
	};

	//导出
	exportModal = () => {
		const { export_modal } = this.state;
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { loadingExport } = this.props.vehicleOrderStore;
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
		const onExportOrder = (e) => {
			e.preventDefault();
			const { order_status, start, end } = getFieldsValue([ 'order_status', 'start', 'end' ]);
			if ((end.valueOf() - start.valueOf()) / 24 / 60 / 60 / 1000 > 31) {
				message.error('最多导出31天');
			} else {
				const params = {
					order_status: order_status,
					start_date: moment(start).format('YYYY-MM-DD'),
					end_date: moment(end).format('YYYY-MM-DD')
				};
				this.props.vehicleOrderStore.exportOrder(params, () => {
					this.setState({ export_modal: false, download_modal: true });
				});
			}
		};

		return (
			<Modal
				visible={export_modal}
				title="生成导出文件"
				footer={null}
				className="vehicle-order-modal"
				onCancel={() => this.setState({ export_modal: false })}
			>
				<Form className="vehicle-order-modal-form" width={800} onSubmit={onExportOrder} layout="inline">
					<Form.Item className="vehicle-order-export-form-item" label="状态">
						{getFieldDecorator('order_status', { initialValue: order_status })(
							<Select>
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="退款成功">退款成功</Select.Option>
								<Select.Option value="支付超时">支付超时</Select.Option>
								<Select.Option value="支付失败">支付失败</Select.Option>
								<Select.Option value="支付成功">支付成功</Select.Option>
								<Select.Option value="订单创建">订单创建</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-export-form-item" label="开始日期">
						{getFieldDecorator('start', { initialValue: moment(getCurrentMonthFirst(), 'YYYY-MM-DD') })(
							<DatePicker format="YYYY-MM-DD" disabledDate={disabledStartDate} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-export-form-item" label="结束日期">
						{getFieldDecorator('end', { initialValue: moment(getCurrentDate(), 'YYYY-MM-DD') })(
							<DatePicker format="YYYY-MM-DD" disabledDate={disabledEndDate} />
						)}
					</Form.Item>
					<div className="hint">（注：默认导出当前月流水,最大可导出31天的数据）</div>
					<Form.Item className="vehicle-order-modal-form-footer">
						<Button htmlType="submit" onClick={() => this.setState({ export_modal: false })}>
							取消
						</Button>
						<Button type="primary" htmlType="submit" loading={loadingExport}>
							确定
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	};

	//Modal 1:查看 0:关闭
	modal = () => {
		const { modal_type, modal_obj } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal
				visible={modal_type ? true : false}
				title="查看"
				footer={null}
				className="vehicle-order-modal"
				onCancel={() => this.setState({ modal_type: 0 })}
			>
				<Form
					className="vehicle-order-modal-form"
					layout="inline"
					onSubmit={() => this.setState({ modal_type: 0 })}
				>
					<Form.Item className="vehicle-order-modal-form-item" label="订单号">
						{getFieldDecorator('order_no', { initialValue: modal_obj && modal_obj.order_no })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="手机号">
						{getFieldDecorator('mobile1', { initialValue: modal_obj && modal_obj.mobile })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="洗车机">
						{getFieldDecorator('washer_name', { initialValue: modal_obj && modal_obj.washer_name })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="洗车机编号">
						{getFieldDecorator('washer_no', { initialValue: modal_obj && modal_obj.washer_no })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="状态">
						{getFieldDecorator('order_status', { initialValue: modal_obj && modal_obj.order_status })(
							<Select disabled={true}>
								<Select.Option value="退款成功">退款成功</Select.Option>
								<Select.Option value="支付超时">支付超时</Select.Option>
								<Select.Option value="支付失败">支付失败</Select.Option>
								<Select.Option value="支付成功">支付成功</Select.Option>
								<Select.Option value="订单创建">订单创建</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="订单金额">
						{getFieldDecorator('total_amount', { initialValue: modal_obj && modal_obj.total_amount })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="实付金额">
						{getFieldDecorator('actual_amount', { initialValue: modal_obj && modal_obj.actual_amount })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="折扣金额">
						{getFieldDecorator('discount_amount', { initialValue: modal_obj && modal_obj.discount_amount })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="支付方式">
						{getFieldDecorator('order_payment', { initialValue: modal_obj && modal_obj.order_payment })(
							<Select disabled={true}>
								<Select.Option value="04">微信支付</Select.Option>
								<Select.Option value="09">洗车券支付</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-item" label="下单时间">
						{getFieldDecorator('create_time', { initialValue: modal_obj && modal_obj.create_time })(
							<Input disabled={true} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-modal-form-footer">
						<Button type="primary" htmlType="submit">
							确定
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	};

	render() {
		const { modal_type, export_modal, download_modal } = this.state;
		const { getFieldDecorator } = this.props.form;
		const { list, loading, pagination } = this.props.vehicleOrderStore;
		return (
			<div className="vehicle-order-container">
				<Form className="vehicle-order-search-container" layout="inline" onSubmit={this.onQueryClick}>
					<Form.Item className="vehicle-order-search-item" label="手机号">
						{getFieldDecorator('mobile')(<Input size="small" placeholder="请输入您要查询的手机号" />)}
					</Form.Item>
					<Form.Item className="vehicle-order-search-item" label="状态">
						{getFieldDecorator('order_status', { initialValue: '' })(
							<Select size="small">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="退款成功">退款成功</Select.Option>
								<Select.Option value="支付超时">支付超时</Select.Option>
								<Select.Option value="支付失败">支付失败</Select.Option>
								<Select.Option value="支付成功">支付成功</Select.Option>
								<Select.Option value="订单创建">订单创建</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-search-item" label="开始日期">
						{getFieldDecorator('start_date')(
							<DatePicker size="small" format="YYYY-MM-DD" disabledDate={this.disabledStartDate} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-search-item" label="结束日期">
						{getFieldDecorator('end_date')(
							<DatePicker size="small" format="YYYY-MM-DD" disabledDate={this.disabledEndDate} />
						)}
					</Form.Item>
					<Form.Item className="vehicle-order-search-item-btn">
						<Button size="small" type="primary" htmlType="submit">
							查询
						</Button>
					</Form.Item>
				</Form>
				<Table
					className="vehicle-order-table"
					bordered
					size="small"
					columns={this.columns}
					title={this.header}
					onChange={this.handleTableChange}
					dataSource={list}
					pagination={pagination}
					loading={loading}
				/>
				{modal_type ? this.modal() : null}
				{export_modal ? this.exportModal() : null}
				{download_modal ? this.downloadModal() : null}
			</div>
		);
	}

	columns = [
		{
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
			align: 'center'
		},
		{
			title: '订单编号',
			dataIndex: 'order_no',
			key: 'order_no',
			align: 'center'
		},
		{
			title: '洗车机',
			dataIndex: 'washer_name',
			key: 'washer_name',
			align: 'center'
		},
		{
			title: '状态',
			dataIndex: 'order_status',
			key: 'order_status',
			align: 'center'
		},
		{
			title: '订单金额',
			dataIndex: 'total_amount',
			key: 'total_amount',
			align: 'center',
			render: (record) => {
				return <div>{record}元</div>;
			}
		},
		{
			title: '实付金额',
			dataIndex: 'actual_amount',
			key: 'actual_amount',
			align: 'center',
			render: (record) => {
				return <div>{record}元</div>;
			}
		},
		{
			title: '折扣金额',
			dataIndex: 'discount_amount',
			key: 'discount_amount',
			align: 'center',
			render: (record) => {
				return <div>{record}元</div>;
			}
		},
		{
			title: '支付方式',
			dataIndex: 'order_payment',
			key: 'order_payment',
			align: 'center',
			render: (record) => {
				return <div>{record === '04' ? '微信支付' : record === '09' ? '洗车券支付' : '--'}</div>;
			}
		},
		{
			title: '下单时间',
			dataIndex: 'create_time',
			key: 'create_time',
			align: 'center'
		},
		{
			title: '操作',
			key: 'options',
			align: 'center',
			render: (record) => {
				return (
					<div className="vehicle-order-options-box">
						<div
							className="vehicle-order-options-item see"
							onClick={() => this.setState({ modal_type: 1, modal_obj: record })}
						>
							<Icon type="eye" />查看
						</div>
						<Popconfirm
							title="确定要退款吗？"
							onConfirm={() => this.onRefundClick(record.order_no)}
							okText="确定"
							cancelText="取消"
						>
							<div className="vehicle-order-options-item delete">
								<Icon type="delete" />退款
							</div>
						</Popconfirm>
					</div>
				);
			}
		}
	];
}

export default Form.create()(Order);

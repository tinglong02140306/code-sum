import React from 'react';
import { Table, Button, Popconfirm, Form, Input, Icon, message, Select, Modal, TimePicker, InputNumber } from 'antd';
import { inject, observer } from 'mobx-react/index';
import Upload from '../../../component/upload/Upload';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import './Info.scss';

let page_num = 1;
const PAGE_SIZE = 15;

@inject('vehicleInfoStore')
@observer
class Info extends React.Component {
	state = {
		options_type: 0, //1:修改 2:查看 3:新增
		options_obj: null,
		qrcode_type: 0, //1:查看
		qrcode_url: ''
	};

	componentDidMount() {
		page_num = 1;
		this.props.vehicleInfoStore.queryBrand();
		this.fetch();
	}

	//列表
	fetch = () => {
		const { getFieldsValue } = this.props.form;
		const { wash_name, brand_id, terminal_id, washer_status, deleted } = getFieldsValue([
			'wash_name',
			'brand_id',
			'terminal_id',
			'washer_status',
			'deleted'
		]);
		const params = {
			page_num: page_num,
			page_size: PAGE_SIZE,
			wash_name: wash_name || null,
			brand_id: brand_id || null,
			terminal_id: terminal_id || null,
			washer_status: washer_status || null,
			deleted: deleted || null
		};
		this.props.vehicleInfoStore.query(params);
	};

	//分页加载
	handleTableChange = (pagination) => {
		const pager = { ...this.props.vehicleInfoStore.pagination };
		pager.current = pagination.current;
		page_num = pagination.current;
		this.fetch();
	};

	//查询按钮 点击事件
	onQueryClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values);
				this.fetch();
			}
		});
	};

	// 同步洗车机
	onSyncWasher = () => {
		this.props.vehicleInfoStore.syncWasher(() => {
			//同步洗车机  刷新页面
			this.fetch();
		});
	};

	//修改
	onOptionsClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log(values);
			if (!err) {
				const {options_obj, options_type} = this.state;
				if (values.logo_type === 1) delete values.photoUrl;
				if (values.logo_type === 2) delete values.photoFile;
				values.brandName = this.getBrandName(values.brandId);
				values.hoursBegin =  values.hoursBegin&&moment(values.hoursBegin).format('HH:mm');
				values.hoursEnd =  values.hoursEnd&&moment(values.hoursEnd).format('HH:mm');
				if(options_type===1){
					values.id = options_obj&&options_obj.id;
					this.props.vehicleInfoStore.update(values, () => {
						this.fetch();
						this.setState({ options_type: 0, options_obj: null });
					});
				}else if(options_type===3){
					this.props.vehicleInfoStore.add(values, () => {
						this.fetch();
						this.setState({ options_type: 0, options_obj: null });
					});
				}
			}
		});
	};

	//生成二维码
	generateWasherQrcode = (id) => {
		this.props.vehicleInfoStore.generateWasherQrcode(id, () => {
			message.info('二维码已生成');
			this.fetch();
		});
	};

	getBrandName = (brandId) => {
		const { brandList } = this.props.vehicleInfoStore;
		if (brandList && brandList.length) {
			for(let i=0; i<brandList.length; i++){
				const item = brandList[i];
				if(item.id===brandId){
					return item.brand_name
				}
			}
		}
		return null;
	};

	//Modal 1:修改 2:查看 3:新增
	options = () => {
		const { options_type, options_obj } = this.state;
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const title = options_type === 1 ? '修改' :  options_type === 2 ?'查看':'新增';
		const disabled = options_type === 2;
		const { modalLoading, brandList } = this.props.vehicleInfoStore;
		const { logo_type = 2 } = getFieldsValue([ 'logo_type' ]);
		return (
			<Modal
				visible={options_type ? true : false}
				title={title}
				footer={null}
				width={700}
				className="vehicle-info-modal"
				onCancel={() => {
					this.setState({ options_type: 0 });
				}}>
				<Form className="vehicle-info-modal-form" layout="inline" onSubmit={this.onOptionsClick}>
					<div className="vehicle-info-modal-form-box">
						<div className="vehicle-info-modal-form-box-side">
							{options_type ===2 ? (
								<Form.Item className="vehicle-info-modal-form-item" label="编号">
									{getFieldDecorator('washer_no', {
										initialValue: options_obj && options_obj.washer_no,
										rules: [ { message: '请输入编号' } ]
									})(<Input placeholder="请输入编号" disabled={disabled} />)}
								</Form.Item>
							) : null}
							<Form.Item className="vehicle-info-modal-form-item" label="外部编号">
								{getFieldDecorator('extendNo', {
									initialValue: options_obj && options_obj.extend_no,
									rules: [ { required: true, message: '请输入外部编号' } ]
								})(<Input placeholder="请输入外部编号" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="信联商户号">
								{getFieldDecorator('merchantId', {
									initialValue: options_obj && options_obj.merchant_id,
									rules: [ { required: true, message: '请输入信联商户号' } ]
								})(<Input placeholder="请输入信联商户号" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="信联终端号">
								{getFieldDecorator('terminalId', {
									initialValue: options_obj && options_obj.terminal_id,
									rules: [ { required: true, message: '请输入信联终端号' } ]
								})(<Input placeholder="请输入信联终端号" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="洗车机名称">
								{getFieldDecorator('washerName', {
									initialValue: options_obj && options_obj.wash_name,
									rules: [ { required: true, message: '请输入洗车机名称' } ]
								})(<Input placeholder="请输入洗车机名称" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="洗车机地址">
								{getFieldDecorator('washerAddress', {
									initialValue: options_obj && options_obj.wash_address,
									rules: [ { required: true, message: '请输入洗车机地址' } ]
								})(<Input.TextArea rows={2} placeholder="请输入洗车机地址" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="经度">
								{getFieldDecorator('lngTx', {
									initialValue: options_obj && options_obj.lng_tx,
									rules: [ { required: true, message: '请输入经度' } ]
								})(<Input placeholder="请输入经度" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="纬度">
								{getFieldDecorator('latTx', {
									initialValue: options_obj && options_obj.lat_tx,
									rules: [ { required: true, message: '请输入纬度' } ]
								})(<Input placeholder="请输入纬度" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="服务电话">
								{getFieldDecorator('tel', {
									initialValue: options_obj && options_obj.tel,
									rules: [ { required: true, message: '服务电话' } ]
								})(<Input placeholder="请输入服务电话" disabled={disabled} />)}
							</Form.Item>
						</div>
						<div className="vehicle-info-modal-form-box-side">
							{options_type !== 1&&options_obj && options_obj.qr_url ? (
								<Form.Item className="vehicle-info-modal-form-item" label="二维码链接">
									{getFieldDecorator('qr_url', { initialValue: options_obj && options_obj.qr_url })(
										<Input placeholder="请输入二维码链接" disabled={disabled} />
									)}
								</Form.Item>
							) : null}
							<Form.Item className="vehicle-info-modal-form-item" label="洗车机品牌">
								{getFieldDecorator('brandId', { initialValue: options_obj && options_obj.brand_id })(
									<Select placeholder="请选择洗车机品牌" disabled={disabled}>
										{brandList &&
											brandList.map((item) => {
												return (
													<Select.Option key={item.id} value={item.id}>
														{item.brand_name}
													</Select.Option>
												);
											})}
									</Select>
								)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="洗车机归属">
								{getFieldDecorator('belong', { initialValue: options_obj && options_obj.belong })(
									<Select placeholder="请选择洗车机归属" disabled={disabled}>
										<Select.Option value={1}>信联</Select.Option>
										<Select.Option value={2}>小睿</Select.Option>
									</Select>
								)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="开业时间">
								{getFieldDecorator('hoursBegin', {
									initialValue: options_obj && moment(options_obj.hours_begin, 'HH:mm'),
									rules: [ { required: true, message: '请选择开业时间' } ]
								})(<TimePicker disabled={disabled} format="HH:mm"/>)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="停业时间">
								{getFieldDecorator('hoursEnd', {
									initialValue: options_obj && moment(options_obj.hours_end, 'HH:mm'),
									rules: [ { required: true, message: '请选择停业时间' } ]
								})(<TimePicker disabled={disabled} format="HH:mm"/>)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="免费停车时间">
								{getFieldDecorator('freeParkingMin', {
									initialValue: options_obj && options_obj.free_parking_min,
									rules: [ { required: true, message: '请输入免费停车时间' } ]
								})(
									<InputNumber
										placeholder="请输入免费停车时间"
										formatter={(value) => `${value}分钟`}
										disabled={disabled}
									/>
								)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="价格">
								{getFieldDecorator('washerPrice', {
									initialValue: options_obj && options_obj.washer_price,
									rules: [ { required: true, message: '请输入价格' } ]
								})(<Input placeholder="请输入价格" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="结算金额">
								{getFieldDecorator('settlementAmount', {
									initialValue: options_obj && options_obj.settlement_amount,
									rules: [ { required: true, message: '请输入结算金额' } ]
								})(<Input placeholder="请输入结算金额" disabled={disabled} />)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="状态">
								{getFieldDecorator('washerStatus', {
									initialValue: options_obj && options_obj.washer_status,
									rules: [ { required: true, message: '请输入状态' } ]
								})(
									<Select disabled={disabled}>
										<Select.Option value={1}>正常</Select.Option>
										<Select.Option value={2}>使用中</Select.Option>
										<Select.Option value={3}>维护中</Select.Option>
										<Select.Option value={4}>已停车</Select.Option>
									</Select>
								)}
							</Form.Item>
							<Form.Item className="vehicle-info-modal-form-item" label="品牌logo">
								{getFieldDecorator('logo_type', {
									initialValue: logo_type,
									rules: [ { required: true, message: '请输入品牌logo' } ]
								})(
									<Select disabled={disabled}>
										<Select.Option value={1}>资源文件</Select.Option>
										<Select.Option value={2}>资源地址</Select.Option>
									</Select>
								)}
							</Form.Item>
							{logo_type === 1 ? (
								<Form.Item className="vehicle-info-modal-form-item upload" label="">
									{getFieldDecorator('photoFile', {
										rules: [ { required: true, message: '请上传资源文件' } ]
									})(<Upload type={1} />)}
								</Form.Item>
							) : null}
							{logo_type === 2 ? (
								<Form.Item className="vehicle-info-modal-form-item upload" label="">
									{getFieldDecorator('photoUrl', {
										initialValue: options_obj && options_obj.photo_url,
										rules: [ { required: true, message: '请输入品牌logo' } ]
									})(<Input.TextArea placeholder="请输入品牌logo" disabled={disabled} />)}
								</Form.Item>
							) : null}
						</div>
					</div>
					<Form.Item className="vehicle-info-modal-form-footer">
						<Button
							style={{ visibility: options_type === 2 ? 'hidden' : 'visible' }}
							onClick={() => this.setState({ options_type: 0, modal_obj: null })}
						>
							取消
						</Button>
						<Button type="primary" htmlType="submit" loading={modalLoading}>
							{options_type === 2 ? '确定' : '提交'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	};

	//查看二维码
	qrcode = () => {
		const { qrcode_type, qrcode_url } = this.state;
		return (
			<Modal
				visible={qrcode_type ? true : false}
				title=""
				footer={null}
				className="vehicle-info-modal"
				onCancel={() => {
					this.setState({ qrcode_type: 0, qrcode_url: '' });
				}}
			>
				<div className="vehicle-info-modal-qrcode">
					<img className="vehicle-info-modal-qrcode-img" src={qrcode_url} alt="" />
					<CopyToClipboard
						text={qrcode_url}
						onCopy={(text, result) => (result ? message.info('链接复制成功') : message.error('链接复制失败'))}
					>
						<Button>复制链接</Button>
					</CopyToClipboard>
				</div>
			</Modal>
		);
	};

	//Table 表头
	header = () => {
		return (
			<div>
				<Button size="small" type="primary" onClick={() => this.setState({options_type:3,options_obj:null})}>
					新增洗车机
				</Button>
				<Button size="small" type="primary" style={{marginLeft:10}} onClick={() => this.onSyncWasher()}>
					同步洗车机
				</Button>
			</div>
		);
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { list, loading, pagination,brandList } = this.props.vehicleInfoStore;
		const { options_type, qrcode_type } = this.state;
		return (
			<div className="vehicle-info-container">
				<Form className="vehicle-info-search-container" layout="inline" onSubmit={this.onQueryClick}>
					<Form.Item className="vehicle-info-search-item" label="洗车机名称">
						{getFieldDecorator('wash_name')(<Input size="small" placeholder="请输入您要查询的洗车机名称" />)}
					</Form.Item>
					<Form.Item className="vehicle-info-search-item" label="洗车机品牌">
						{getFieldDecorator('brand_id',{ initialValue: "" })
						(<Select placeholder="请选择洗车机品牌" >
							<Select.Option key="null" value="">全部</Select.Option>
							{brandList &&brandList.map((item) => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{item.brand_name}
									</Select.Option>
								);
							})}
						</Select>)}
					</Form.Item>
					<Form.Item className="vehicle-info-search-item" label="信联终端号">
						{getFieldDecorator('terminal_id')(<Input size="small" placeholder="请输入您要查询的信联终端号" />)}
					</Form.Item>
					<Form.Item className="vehicle-info-search-item" label="状态">
						{getFieldDecorator('washer_status', { initialValue: '' })(
							<Select size="small">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="1">正常</Select.Option>
								<Select.Option value="2">使用中</Select.Option>
								<Select.Option value="3">维护中</Select.Option>
								<Select.Option value="4">已停车</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-info-search-item" label="是否营业">
						{getFieldDecorator('deleted', { initialValue: '' })(
							<Select size="small">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="true">是</Select.Option>
								<Select.Option value="false">否</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="vehicle-info-search-item-btn">
						<Button size="small" type="primary" htmlType="submit">
							查询
						</Button>
					</Form.Item>
				</Form>
				<Table
					className="vehicle-info-table"
					bordered
					size="small"
					title={this.header}
					columns={this.columns}
					onChange={this.handleTableChange}
					dataSource={list}
					pagination={pagination}
					loading={loading}
				/>
				{options_type === 0 ? null : this.options()}
				{qrcode_type === 0 ? null : this.qrcode()}
			</div>
		);
	}

	columns = [
		{
			title: '品牌名称',
			dataIndex: 'brand_name',
			key: 'brand_name',
			align: 'center'
		},
		{
			title: '品牌ID',
			dataIndex: 'brand_id',
			key: 'brand_id',
			align: 'center'
		},
		{
			title: '洗车机名称',
			dataIndex: 'wash_name',
			key: 'wash_name',
			align: 'center'
		},
		{
			title: '价格',
			dataIndex: 'washer_price',
			key: 'washer_price',
			align: 'center'
		},{
			title: '归属',
			dataIndex: 'belong',
			key: 'belong',
			align: 'center',
			render:(record)=>{
				const belong = record===1?"信联":record===2?"小睿":"--"
				return <div>{belong}</div>
			}
		},
		{
			title: '状态',
			dataIndex: 'washer_status',
			key: 'washer_status',
			align: 'center',
			render: (record) => {
				const status =
					record === 1 ? '正常' : record === 2 ? '使用中' : record === 3 ? '维护中' : record === 1 ? '已停车' : '未知';
				const color =
					record === 1
						? '#1890ff'
						: record === 2
							? '#00CC00'
							: record === 3 ? '#FF3333' : record === 1 ? '#FF9933' : 'rgba(0,0,0,0.65)';
				return <div style={{ color: color }}>{status}</div>;
			}
		},
		{
			title: '营业时间',
			key: 'hours',
			align: 'center',
			render: (record) => {
				return (
					<div>
						{(record && record.hours_begin) || '--'}~{(record && record.hours_end) || '--'}
					</div>
				);
			}
		},
		{
			title: '免费停车时间',
			dataIndex: 'free_parking_min',
			key: 'free_parking_min',
			align: 'center',
			render: (record) => {
				const time = record ? `${record}分钟` : '--';
				return <div>{time}</div>;
			}
		},
		{
			title: '二维码',
			key: 'qr_url',
			align: 'center',
			render: (record) => {
				return (
					<div className="vehicle-info-qr-box">
						<div
							className="vehicle-info-qr-item see"
							style={{ display: record && record.qr_url ? 'flex' : 'none' }}
							onClick={() => this.setState({ qrcode_type: 1, qrcode_url: record && record.qr_url })}
						>
							查看二维码
						</div>
						<Popconfirm
							title="确定要生成该洗车机的二维码吗？"
							onConfirm={() => {
								this.generateWasherQrcode(record.id);
							}}
							okText="确定"
							cancelText="取消"
						>
							<div
								className="vehicle-info-qr-item update"
								style={{ display: record && record.qr_url ? 'none' : 'flex' }}
							>
								生成二维码
							</div>
						</Popconfirm>
					</div>
				);
			}
		},
		{
			title: '营业',
			dataIndex: 'deleted',
			key: 'deleted',
			align: 'center',
			render: (record) => {
				return <div>{record ? '未营业' : '营业'}</div>;
			}
		},
		{
			title: '操作',
			key: 'options',
			align: 'center',
			render: (record) => {
				return (
					<div className="vehicle-info-options-box">
						<div
							className="vehicle-info-options-item see"
							onClick={() => this.setState({ options_type: 2, options_obj: record })}
						>
							<Icon type="eye" />查看
						</div>
						<div
							className="vehicle-info-options-item update"
							onClick={() => this.setState({ options_type: 1, options_obj: record })}
						>
							<Icon type="edit" />修改
						</div>
					</div>
				);
			}
		}
	];
}

export default Form.create()(Info);

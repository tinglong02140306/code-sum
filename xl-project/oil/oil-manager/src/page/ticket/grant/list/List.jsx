import React from 'react';
import { Table, Button, Dropdown, Form, Input, Select, Menu, message } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './List.scss';

let page_num = 1;
const PAGE_SIZE = 15;

@inject('tickerGrantStore')
@observer
class List extends React.Component {
	state = {
		show_modal: false,
		show_record: null
	};

	componentDidMount() {
		page_num = 1;
		this.fetch();
	}

	//列表
	fetch = () => {
		const { getFieldsValue } = this.props.form;
		const { id, act_name, push_type, act_status } = getFieldsValue([ 'id', 'act_name', 'push_type', 'act_status' ]);
		const params = {
			page_num: page_num,
			page_size: PAGE_SIZE,
			id: id || null,
			act_name: act_name || null,
			push_type: push_type || null,
			act_status: act_status || null
		};
		this.props.tickerGrantStore.query(params);
	};

	//分页加载
	handleTableChange = (pagination) => {
		const pager = { ...this.props.tickerGrantStore.pagination };
		pager.current = pagination.current;
		page_num = pagination.current;
		this.fetch();
	};

	//查询按钮 点击事件
	onQueryClick = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.fetch();
			}
		});
	};

	//修改发放活动状态
	changeStatus = (id, target_status) => {
		this.props.tickerGrantStore.changeStatus(id, target_status, () => {
			this.fetch();
		});
	};

	//修改发放活动
	updateCoupon = (record) => {
		this.props.tickerGrantStore.setRecord(record);
		this.props.history.push('/ticket-grant-update');
	};

	//Table 表头
	header = () => {
		return (
			<Button
				icon="plus"
				size="small"
				type="primary"
				onClick={() => this.props.history.push('/ticket-grant-create')}>
				创建发放活动
			</Button>
		);
	};

	//下载券码
	downloadCoupon = (id) =>{
		this.props.tickerGrantStore.downloadCdkey(id,(file_url)=>{
			message.info("券码下载完成");
			window.location.href = file_url;
		});
	}

	render() {
		const { list, pagination, loading } = this.props.tickerGrantStore;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="ticket-grant-list-container">
				<Form className="ticket-grant-list-form" layout="inline" onSubmit={this.onModalClick}>
					<Form.Item className="ticket-grant-list-form-item" label="发放批次号">
						{getFieldDecorator('id')(<Input size="small" placeholder="请输入您要查询的发放批次号" />)}
					</Form.Item>
					<Form.Item className="ticket-grant-list-form-item" label="活动名称">
						{getFieldDecorator('act_name')(<Input size="small" placeholder="请输入您要查询的活动名称" />)}
					</Form.Item>
					<Form.Item className="ticket-grant-list-form-item" label="发放方式">
						{getFieldDecorator('push_type', { initialValue: '' })(
							<Select size="small">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="券码兑换">券码兑换</Select.Option>
								<Select.Option value="指定发放">指定发放</Select.Option>
								<Select.Option value="消费返还">消费返还</Select.Option>
								<Select.Option value="系统配置">系统配置</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item className="ticket-grant-list-form-item range-picker" label="活动状态">
						{getFieldDecorator('act_status', { initialValue: '' })(
							<Select size="small">
								<Select.Option value="">全部</Select.Option>
								<Select.Option value="暂停">暂停</Select.Option>
								<Select.Option value="启用">启用</Select.Option>
								<Select.Option value="失效">失效</Select.Option>
							</Select>
						)}
					</Form.Item>
					<div className="ticket-grant-list-form-btns">
						<Form.Item>
							<Button size="small" type="primary" htmlType="submit" onClick={() => this.fetch()}>
								查询
							</Button>
						</Form.Item>
					</div>
				</Form>
				<Table
					className="ticket-grant-list-table"
					title={this.header}
					bordered
					size="small"
					columns={this.columns}
					onChange={this.handleTableChange}
					dataSource={list}
					pagination={pagination}
					loading={loading}
				/>
			</div>
		);
	}

	menu = (id) => {
		return (
			<Menu>
				<Menu.Item onClick={() => this.changeStatus(id, '暂停')}>暂停</Menu.Item>
				<Menu.Item onClick={() => this.changeStatus(id, '启用')}>启用</Menu.Item>
				<Menu.Item onClick={() => this.changeStatus(id, '失效')}>失效</Menu.Item>
			</Menu>
		);
	};

	columns = [
		{
			title: '批次号',
			dataIndex: 'id',
			key: 'id',
			align: 'center'
		},
		{
			title: '活动名称',
			dataIndex: 'act_name',
			key: 'act_name',
			align: 'center'
		},
		{
			title: '发放方式',
			dataIndex: 'push_type',
			key: 'push_type',
			align: 'center'
		},
		{
			title: '发放数',
			dataIndex: 'push_count',
			key: 'push_count',
			align: 'center',
			render: (record) => {
				return <div>{record == '-1' ? '不限制' : record}</div>;
			}
		},
		{
			title: '核销数',
			dataIndex: 'used_count',
			key: 'used_count',
			align: 'center'
		},
		{
			title: '创建人',
			dataIndex: 'creator',
			key: 'creator',
			align: 'center'
		},
		{
			title: '创建时间',
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
					<div className="ticket-grant-options-box">
						<div className="ticket-grant-options-item" onClick={() => this.updateCoupon(record)}>
							修改 |
						</div>
						<Dropdown className="ticket-grant-options-item" overlay={() => this.menu(record.id)}>
							<div>{record.act_status}</div>
						</Dropdown>
						<div className="ticket-grant-options-item" 
							style={{display:record.push_type==="券码兑换"?"flex":"none"}}
							onClick={() => this.downloadCoupon(record.id)}>
							| 下载券码
						</div>
					</div>
				);
			}
		}
	];
}

export default Form.create()(List);

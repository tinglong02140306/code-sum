import React from 'react';
import { Table, Button, Popconfirm, Form } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './List.scss';

let page_num = 1;
const PAGE_SIZE = 15;

@inject('tickerBagStore')
@observer
class List extends React.Component {

	state = {
		show_modal:false,
		show_record:null
	};

	componentDidMount() {
		page_num = 1;
		this.fetch();
	}

	//列表
	fetch = () => {
		const { getFieldsValue } = this.props.form;
		const {coupon_name,coupon_type} = getFieldsValue(["coupon_name","coupon_type"]);
		const params = {
			page_num:page_num,
			page_size:PAGE_SIZE,
			coupon_name:coupon_name,
			coupon_type:coupon_type
		}
		this.props.tickerBagStore.query(params);
	};

	//分页加载
	handleTableChange = (pagination) => {
		const pager = { ...this.props.tickerBagStore.pagination };
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


	//修改洗车券包
	updateBag = (record) => {
		this.props.tickerBagStore.setRecord(record);
		this.props.history.push("/ticket-bag-update");
	}

	deleteBag = id => {
		this.props.tickerBagStore.deleteBag(id,()=>{
			this.fetch();
		});
	}
	
	//Table 表头
	header = () => {
		return (
            <Button icon="plus" size="small" type="primary" 
                onClick={() => this.props.history.push("/ticket-bag-create")}>新增洗车券包</Button>
		);
	};
	
	render() {
        const {list, pagination, loading} = this.props.tickerBagStore;
		return (
			<div className="ticket-bag-list-container">
				<Table
                    className="ticket-bag-list-table"
                    title={this.header}
					bordered
					size="small"
					columns={this.columns}
					onChange={this.handleTableChange}
					dataSource={list}
					pagination={pagination}
					loading={loading}/>
			</div>
		);
	}

	columns = [
		{
			title: '券包名称',
			dataIndex: 'package_name',
			key: 'package_name',
			align: 'center'
		},
		{
			title: '活动名称',
			dataIndex: 'act_name',
			key: 'act_name',
			align: 'center'
		},
		{
			title: '是否限制新用户',
			dataIndex: 'buy_limit',
			key: 'buy_limit',
			align: 'center',
			render: (record) => {
				return <div>{record==="NEW_USER"?"是":"否"}</div>;
			}
		},
		{
			title: '券数量',
			key: 'coupon_count',
			dataIndex: 'coupon_count',
			align: 'center'
		},
		{
			title: '价格',
			dataIndex: 'package_price',
			key: 'package_price',
            align: 'center'
		},{
			title: '顺序',
			dataIndex: 'sequence',
			key: 'sequence',
			align: 'center'
		},{
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
					<div className="ticket-bag-options-box">
						<div
							className="ticket-bag-options-item"
							onClick={() => this.updateBag(record)}>修改 |
						</div>
                        <Popconfirm
							title="确定要删除该券包吗？"
							onConfirm={() => this.deleteBag(record.id)}
							okText="确定"
							cancelText="取消">
                            <div
                                className="ticket-bag-options-item">删除
                            </div>
                        </Popconfirm>
					</div>
				);
			}
		}
	];
}

export default Form.create()(List);

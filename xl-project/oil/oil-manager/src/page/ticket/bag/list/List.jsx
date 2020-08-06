import React from 'react';
import { Table, Button, Popconfirm, Form, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './List.scss';

let page_num = 1;
const PAGE_SIZE = 15;

@inject('tickerBagStore')
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
        const { coupon_name, coupon_type } = getFieldsValue(["coupon_name", "coupon_type"]);
        const params = {
            page_num: page_num,
            page_size: PAGE_SIZE,
            coupon_name: coupon_name,
            coupon_type: coupon_type
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
        this.props.tickerBagStore.setRecord(record, 2);
        this.props.history.push("/ticket-bag-create");
    }
    // 删除券包
    deleteBag = id => {
        this.props.tickerBagStore.deleteBag(id, () => {
            this.fetch();
        });
    }
    // 上/下架卷包
    offOnSelfBag = (record) => {
        this.props.tickerBagStore.offOnSelfBag({ id: record.id, package_status: record.status == 1 ? 2 : 1 }, () => {
            this.fetch();
        });
    }
    // 查看
    viewBag = (record) => {
        // 1 新增 2 编辑 3 查看
        this.props.tickerBagStore.setRecord(record, 3);
        this.props.history.push("/ticket-bag-create");
    }

    //Table 表头
    header = () => {
        return (
            <Button icon="plus" size="small" type="primary"
                onClick={() => { this.props.history.push("/ticket-bag-create"); this.props.tickerBagStore.setRecord({}, 1) }}>新增洗车券包</Button>
        );
    };

    render() {
        const { list, pagination, loading } = this.props.tickerBagStore;
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
                    loading={loading} />
                {/* scroll={{ x: '110%' }} */}
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
            // 是否限制新用户
            title: '限制新用户',
            dataIndex: 'buy_limit',
            key: 'buy_limit',
            align: 'center',
            render: (record) => {
                return <div>{record === "NEW_USER" ? "是" : "否"}</div>;
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
        }, {
            title: '顺序',
            dataIndex: 'sequence',
            key: 'sequence',
            align: 'center'
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            align: 'center'
        }, {
            title: '操作人',
            dataIndex: 'operator',
            key: 'operator',
            align: 'center'
        }, {
            title: '展示地区',
            dataIndex: 'area_name',
            key: 'area_name',
            align: 'center',
            render: (record) => {
                return (<Tooltip placement="bottom" title={record}><span className="area-text">{record}</span></Tooltip>);
            },
        }, {
            title: '限时',
            dataIndex: 'coupon_package_type',
            key: 'coupon_package_type',
            align: 'center',
            render: (record) => {
                return (<span>{record == "2" ? "是" : "否"}</span>);
            },
        }, {
            title: '限量',
            dataIndex: 'package_limit_type',
            key: 'package_limit_type',
            align: 'center',
            render: (record) => {
                return (<span>{record ? "是" : "否"}</span>);
            }
        }, {
            title: '限购',
            dataIndex: 'buy_limit_type',
            key: 'buy_limit_type',
            align: 'center',
            render: (record) => {
                return (<span>{record ? '是' : '否'}</span>);
            },
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (record) => {
                // 1-上架，2-下架，3-过期
                return (<span style={{ color: record == 1 ? "#0d965d" : "rgb(183, 181, 181)" }}>{record == 1 ? "上架" : record == 2 ? "下架" : record == 3 ? "过期" : ""}</span>);
            },
        }, {
            title: '操作',
            key: 'options',
            align: 'center',
            width: "200px",
            // fixed: 'right',
            render: (record) => {
                return (
                    <div className="ticket-bag-options-box">
                        <div
                            className="ticket-bag-options-item"
                            onClick={() => this.updateBag(record)}>{record.status != 2 ? "" : "修改 |"}
                        </div>
                        {record.status != 3 ? <Popconfirm
                            title={record.status == 1 ? "确定要下架该券包吗？" : "确定要上架该券包吗？"}
                            onConfirm={() => this.offOnSelfBag(record)}
                            okText="确定"
                            cancelText="取消">
                            <div
                                className="ticket-bag-options-item">{record.status == 1 ? "下架 | " : record.status == 2 ? "上架  | " : ""}
                            </div>
                        </Popconfirm> : null}

                        <Popconfirm
                            title="确定要删除该券包吗？"
                            onConfirm={() => this.deleteBag(record.id)}
                            okText="确定"
                            cancelText="取消">
                            <div
                                className="ticket-bag-options-item">删除 |
                            </div>
                        </Popconfirm>

                        <div
                            className="ticket-bag-options-item"
                            onClick={() => this.viewBag(record)}>查看
                        </div>
                    </div>
                );
            }
        }
    ];
}

export default Form.create()(List);

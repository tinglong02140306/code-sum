import React from 'react';
import { Table, Button, Dropdown, Menu, Form, Input, Select, Drawer } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './List.scss';

let page_num = 1,
    detailPageNum = 1;
const PAGE_SIZE = 15;

@inject('tickerManageStore')
@observer
class List extends React.Component {

    state = {
        show_modal: false,
        show_record: null,
        visible: false,
        coupon_id: ""
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
        this.props.tickerManageStore.query(params);
    };
    //分页加载
    handleTableChange = (pagination) => {
        const pager = { ...this.props.tickerManageStore.pagination };
        pager.current = pagination.current;
        detailPageNum = pagination.current;
        this.fetch();
    };

    //查询按钮 点击事件
    onQueryClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            console.log(values);
            if (!err) {
                page_num = 1;
                this.fetch();
            }
        });
    };

    //修改优惠券状态
    changeStatus = (id, target_status) => {
        this.props.tickerManageStore.changeStatus(id, target_status, () => {
            this.fetch();
        });
    }

    //修改优惠券
    updateCoupon = (record) => {
        this.props.tickerManageStore.setRecord(record);
        this.props.history.push("/ticket-manage-update");
    }
    //Table 表头
    header = () => {
        return (
            <Button icon="plus" size="small" type="primary"
                onClick={() => this.props.history.push("/ticket-manage-create")}>新增优惠券</Button>
        );
    };



    // drawer

    // 查看明细
    viewCoupon = (record) => {
        this.setState({
            coupon_id: record.id
        });
        this.detailFetch(record.id);
        setTimeout(() => {
            this.setState({
                visible: true
            });
        })

    };
    // 点击遮罩关闭事件
    onClose = () => {
        this.setState({
            visible: false,
        });
        // 重置数据
        detailPageNum = 1;
    };
    // 明细列表
    detailFetch = (id) => {
        const { getFieldsValue } = this.props.form;
        const { act_name, push_status } = getFieldsValue(["act_name", "push_status"]);
        const { coupon_id } = this.state;
        console.log(coupon_id)
        const params = {
            page_num: detailPageNum,
            page_size: PAGE_SIZE,
            coupon_id: id ? id : coupon_id, // 券ID
            act_name: act_name,  // 活动名称
            push_status: push_status  // 状态
        }
        this.props.tickerManageStore.detailQuery(params);
    };

    //分页加载
    handleDetailTableChange = (detailPagination) => {
        const pager = { ...this.props.tickerManageStore.detailPagination };
        pager.current = detailPagination.current;
        detailPageNum = detailPagination.current;
        this.detailFetch();
    };

    //查询按钮 点击事件
    onDetailQueryClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            console.log(values);
            if (!err) {
                detailPageNum = 1;
                this.detailFetch();
            }
        });
    };
    // 撤销
    revokeCoupon = (record) => {
        this.props.tickerManageStore.revokeCoupon(record.id, () => {
            this.detailFetch();
        });
    };


    render() {
        const { list, detailList, pagination, detailPagination, loading } = this.props.tickerManageStore;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ticket-manage-list-container">
                <Form className="ticket-manage-list-form" layout="inline" onSubmit={this.onQueryClick}>
                    <Form.Item className="ticket-manage-list-form-item" label="优惠券名称">
                        {getFieldDecorator('coupon_name')(<Input size="default" placeholder="请输入优惠券名称" />)}
                    </Form.Item>
                    <Form.Item className="ticket-manage-list-form-item" label="优惠券类型">
                        {getFieldDecorator('coupon_type', { initialValue: "" })
                            (<Select>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value={0}>加油优惠券</Select.Option>
                                <Select.Option value={1}>洗车优惠券 </Select.Option>
                                <Select.Option value={3}>提货券</Select.Option>
                                <Select.Option value={4}>洗车抵用券</Select.Option>
                            </Select>)}
                    </Form.Item>
                    <div className="ticket-manage-list-form-btns">
                        <Form.Item>
                            <Button size="small" type="primary" htmlType="submit" onClick={() => { }}>查询</Button>
                        </Form.Item>
                    </div>
                </Form>
                <Table
                    className="ticket-manage-list-table"
                    title={this.header}
                    bordered
                    size="small"
                    columns={this.columns}
                    onChange={this.handleTableChange}
                    dataSource={list}
                    pagination={pagination}
                    loading={loading} />

                <Drawer
                    title="查看明细"
                    placement="right"
                    width="85%"
                    closable={true}
                    onClose={this.onClose}
                    maskClosable={false}
                    visible={this.state.visible}
                >
                    <Form className="ticket-manage-list-form" layout="inline" onSubmit={this.onDetailQueryClick}>
                        <Form.Item className="ticket-manage-list-form-item" label="券发放名称">
                            {getFieldDecorator('act_name')(<Input size="small" placeholder="请输入券发放名称" />)}
                        </Form.Item>
                        <Form.Item className="ticket-manage-list-form-item" label="状态">
                            {getFieldDecorator('push_status')(<Input size="small" placeholder="请输入状态" />)}
                        </Form.Item>
                        <div className="ticket-manage-list-form-btns">
                            <Form.Item>
                                <Button size="small" type="primary" htmlType="submit" onClick={() => { }}>查询</Button>
                            </Form.Item>
                        </div>
                    </Form>
                    <Table
                        className="ticket-manage-list-table"
                        bordered
                        size="small"
                        columns={this.drawerColumns}
                        onChange={this.handleDetailTableChange}
                        dataSource={detailList}
                        pagination={detailPagination}
                        loading={loading}
                        scroll={{ x: '120%' }} />
                </Drawer>


            </div>
        );
    }

    menu = (id) => {
        return <Menu>
            <Menu.Item onClick={() => this.changeStatus(id, "暂停")}>暂停</Menu.Item>
            <Menu.Item onClick={() => this.changeStatus(id, "失效")}>失效</Menu.Item>
            <Menu.Item onClick={() => this.changeStatus(id, "启用")}>启用</Menu.Item>
        </Menu>
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center'
        }, {
            title: '券名称',
            dataIndex: 'coupon_name',
            key: 'coupon_name',
            align: 'center'
        }, {
            title: '券类型',
            dataIndex: 'coupon_type',
            key: 'coupon_type',
            align: 'center',
            render: (record) => {
                const type = record === "0" ? "加油优惠券" : record === "1" ? "洗车优惠券 " : record === "3" ? "提货券" : record === "4" ? "洗车抵用券" : "--"
                return <div>{type}</div>;
            }
        }, {
            title: '资金来源',
            dataIndex: 'fund_bear',
            key: 'fund_bear',
            align: 'center'
        }, {
            title: '有效期',
            key: 'validity',
            align: 'center',
            render: (record) => {
                if (record.valid_type === "1") {
                    return <div>{record.valid_days}天</div>;
                } else if (record.valid_type === "0") {
                    return <div>{record.start_date}~{record.end_date}</div>;
                } else {
                    return <div>--</div>
                }
            }
        }, {
            title: '最大领取',
            dataIndex: 'single_push_limit',
            key: 'single_push_limit',
            align: 'center',
            render: (record) => {
                return <div>{record == "-1" ? "不限制" : record}</div>;
            }
        }, {
            title: '发放数',
            dataIndex: 'push_count',
            key: 'push_count',
            align: 'center'
        }, {
            title: '核销数',
            dataIndex: 'used_count',
            key: 'used_count',
            align: 'center'
        }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            align: 'center'
        },
        {
            title: '操作',
            key: 'options',
            align: 'center',
            render: (record) => {
                return (
                    <div className="ticket-manage-options-box">
                        <div
                            className="ticket-manage-options-item"
                            onClick={() => this.updateCoupon(record)}>修改 |
						</div>
                        <Dropdown className="ticket-grant-options-item" overlay={() => this.menu(record.id)}>
                            <div>{record.coupon_status}</div>
                        </Dropdown>
                        <div
                            className="ticket-manage-options-item"
                            onClick={() => this.viewCoupon(record)}>| 查看
						</div>
                    </div>
                );
            }
        }
    ];



    drawerColumns = [
        {
            // TOD
            title: '券ID',
            dataIndex: 'coupon_id',
            key: 'coupon_id',
            align: 'center'
        }, {
            title: '券名称',
            dataIndex: 'coupon_name',
            key: 'coupon_name',
            align: 'center'

        }, {
            // TODO
            title: '券类型',
            dataIndex: 'coupon_type',
            key: 'coupon_type',
            align: 'center'
        }, {
            title: '券创建时间',
            dataIndex: 'coupon_create_time',
            key: 'coupon_create_time',
            align: 'center'
        }, {
            title: '券创建人',
            dataIndex: 'coupon_creator',
            key: 'coupon_creator',
            align: 'center'
        }, {
            // TODO
            title: '活动ID',
            dataIndex: 'act_id',
            key: 'act_id',
            align: 'center'
        }, {
            title: '券发放名称',
            dataIndex: 'act_name',
            key: 'act_name',
            align: 'center'
        }, {
            title: '券发放时间',
            dataIndex: 'push_time',
            key: 'push_time',
            align: 'center'
        }, {
            title: '发放人',
            dataIndex: 'act_creator',
            key: 'act_creator',
            align: 'center'
        }, {
            // TODO
            title: '发放ID',
            dataIndex: 'push_id',
            key: 'push_id',
            align: 'center'
        }, {
            // TODO
            title: '投放方式',
            dataIndex: 'push_type',
            key: 'push_type',
            align: 'center'
        }, {
            title: '状态',
            dataIndex: 'push_status',
            key: 'push_status',
            align: 'center'
        }, {
            title: '核销订单号',
            dataIndex: 'use_order_no',
            key: 'use_order_no',
            align: 'center'
        }, {
            title: '核销站点名称',
            dataIndex: 'use_station_name',
            key: 'use_station_name',
            align: 'center'
        }, {
            title: '创建核销时间',
            dataIndex: 'use_time',
            key: 'use_time',
            align: 'center'
        },
        {
            title: '操作',
            key: 'options',
            fixed: 'right',
            render: (record) => {
                return (
                    <div className="ticket-manage-options-box">
                        <div
                            className="ticket-manage-options-item"
                            onClick={() => this.revokeCoupon(record)}>撤销
						</div>
                    </div>
                );
            }
        }
    ];
}

export default Form.create()(List);

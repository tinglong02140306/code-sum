import React from 'react';
import { Table, Button, Dropdown, Form, Input, Select, Menu, message, Drawer } from 'antd';
import { inject, observer } from 'mobx-react/index';
import './List.scss';

let page_num = 1,
    detailPageNum = 1;
const PAGE_SIZE = 15;

@inject('tickerGrantStore')
@observer
class List extends React.Component {
    state = {
        show_modal: false,
        show_record: null,
        visible: false,
        act_id: ""  // 活动ID
    };

    componentDidMount() {
        page_num = 1;
        this.fetch();
    }

    //列表
    fetch = () => {
        const { getFieldsValue } = this.props.form;
        const { id, act_name, push_type, act_status } = getFieldsValue(['id', 'act_name', 'push_type', 'act_status']);
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
                page_num = 1;
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
    downloadCoupon = (id) => {
        this.props.tickerGrantStore.downloadCdkey(id, (file_url) => {
            message.info("券码下载完成");
            window.location.href = file_url;
        });
    }

    // drawer

    // 查看明细
    viewCoupon = (record) => {
        this.setState({
            act_id: record.id
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
        const { act_id } = this.state;
        const { push_status } = getFieldsValue(["push_status"]);
        const params = {
            page_num: detailPageNum,
            page_size: PAGE_SIZE,
            push_status: push_status,
            act_id: id ? id : act_id
        }
        this.props.tickerGrantStore.detailQuery(params);
    };

    //分页加载
    handleDetailTableChange = (detailPagination) => {
        const pager = { ...this.props.tickerGrantStore.detailPagination };
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
        this.props.tickerGrantStore.revokeCoupon(record.id, () => {
            this.detailFetch();
        });
    };

    render() {
        const { list, detailList, pagination, detailPagination, loading } = this.props.tickerGrantStore;
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
                            style={{ display: record.push_type === "券码兑换" ? "flex" : "none" }}
                            onClick={() => this.downloadCoupon(record.id)}>
                            | 下载券码
						</div>
                        <div
                            className="ticket-grant-options-item"
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
            dataIndex: 'push_time',
            key: 'push_time',
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
            dataIndex: 'act_create_time',
            key: 'act_create_time',
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

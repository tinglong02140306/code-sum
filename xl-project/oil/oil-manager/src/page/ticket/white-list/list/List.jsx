import React from 'react';
import "./List.scss";
import { Table, Input, Button, Icon, Popconfirm, Form, Select, Tooltip, Modal } from 'antd';
import { inject, observer } from 'mobx-react';

import ImportDialog from "../../../../component/ticket/white-list/ImportDialog";
import ImportResultDialog from '../../../../component/ticket/white-list/ImportResultDialog';

let store = null;
let page_num = 1;
let WhiteListStore = {};

@inject("WhiteListStore")
@observer
class WhiteList extends React.Component {

    constructor() {
        super();
        this.state = {
            isLeadLoading: false,
        }
    }

    componentDidMount() {
        this.props.WhiteListStore.getAccountList({ page_num: page_num, page_size: 15 });
    }
    // 分页时触发
    handleTableChange = (pagination) => {
        const { page_size } = this.props.WhiteListStore;
        const pager = { ...this.props.WhiteListStore.pagination };
        pager.current = pagination.current;
        page_num = pager.current;
        this.props.WhiteListStore.setCurrentPage(page_num);
        this.props.WhiteListStore.setPagination(pager);
        this.props.WhiteListStore.getAccountList({ page_num: page_num, page_size: page_size });
    }
    //查询按钮 点击事件
    onQueryClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            console.log(values);
            if (!err) {
                const param = {
                    page_num: page_num,
                    page_size: 15,
                    act_code: values.act_code ? values.act_code : null,
                    account_no: values.account_no ? values.account_no : null
                }
                this.props.WhiteListStore.getAccountList(param);
            }
        });
    };
    /**
     * 导入白名单
     */
    onEngineLeadChange = () => {
        this.props.WhiteListStore.setIsShowEngineDialog(true);
    }

    //Table 表头
    header = () => {
        return <div className="white-table-header">
            <div className="white-table-header-left">
                <Button icon="plus" type="primary" className="white-table-header-button" onClick={() => this.props.history.push("/ticket-white-create")}>新增优惠券</Button>
                <Button type="primary" onClick={this.onEngineLeadChange} className="white-table-header-button">导入白名单</Button>
            </div>
        </div>
    }
    render() {
        const { isShowLoading, accountList, pagination, isShowEngineDialog, isShowLeadResuleDialog } = this.props.WhiteListStore;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return <div className="white-container">
            <Form className="ticket-order-list-form" layout="inline" onSubmit={this.onQueryClick}>
                <Form.Item className="ticket-order-list-form-item" label="活动代码">
                    {getFieldDecorator('act_code')(<Input size="small" placeholder="请输入活动代码" />)}
                </Form.Item>
                <Form.Item className="ticket-order-list-form-item" label="银行卡号">
                    {getFieldDecorator('account_no')(<Input size="small" placeholder="请输入银行卡号" />)}
                </Form.Item>
                <div className="ticket-order-list-form-btns">
                    <Form.Item>
                        <Button size="small" type="primary" htmlType="submit" onClick={() => { }}>
                            查询
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <Table className="white-table"
                columns={columns}
                bordered={true}
                loading={isShowLoading}
                title={this.header}
                size="small"
                pagination={pagination}
                onChange={this.handleTableChange}
                dataSource={accountList} />
            {isShowEngineDialog ? <ImportDialog /> : null}
            {/* {isShowLeadResuleDialog ? <ImportResultDialog /> : null} */}
        </div>
    }
}

export default Form.create()(WhiteList);


const columns = [
    {
        title: '银行卡号',
        dataIndex: 'account_no',
        key: 'account_no',
        align: 'center'
    }, {
        title: '操作人员',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center'
    }, {
        title: '录入时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
    }, {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return (
                <div
                    style={{
                        minWidth: 80,
                        color: "#1890ff",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                    {<Popconfirm
                        title="确定删除该白名单吗？" okText="是的" cancelText="取消"
                        onConfirm={() => { WhiteListStore.deleteEvt({ id: record.id }) }}>
                        <div>
                            <Icon type="form" />
                            <a style={{ fontSize: 15, marginLeft: 2 }}>删除</a>
                        </div>
                    </Popconfirm>}
                </div>
            );
        }
    }];
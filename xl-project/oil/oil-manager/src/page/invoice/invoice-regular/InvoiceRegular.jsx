import React from 'react';
import {Table, Button, Input, message, Icon, Tooltip, Popconfirm, Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import "./InvoiceRegular.scss";
import copy from 'copy-to-clipboard';
import {isEmpty} from '../../../utils/isEmpty';
import http from "../../../http/http";

let page_size = 10;
let invoiceRegularStore = {};

@inject("invoiceRegularStore")
@observer
class InvoiceRegular extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bill_order_no: null,
            title: null,
            tax_no: null,
            amount: null,
            card_id: null,
            dataSource: []
        }
    }

    componentDidMount() {
        this.props.invoiceRegularStore.setPageSize(10);
        this.fetch();
    }

    fetch = () => {
        const {bill_order_no, title, tax_no, amount, card_id} = this.state;
        const params = {
            page_num: 1,
            page_size: page_size,
            bill_order_no:isEmpty(bill_order_no)?null:bill_order_no,
            title:isEmpty(title)?null:title,
            tax_no:isEmpty(tax_no)?null:tax_no,
            amount:isEmpty(amount)?null:amount,
            card_id:isEmpty(card_id)?null:card_id,
        }
        this.props.invoiceRegularStore.getInvoiceQuery(params);
    }

    //分页加载
    handleTableChange = (pagination) => {
        const {bill_order_no, title, tax_no, amount, card_id} = this.state;
        const pager = {...this.props.invoiceRegularStore.pagination};
        pager.current = pagination.current;
        this.props.invoiceRegularStore.setPagination(pagination);
        const params = {
            page_num: pager.current,
            page_size: page_size,
            bill_order_no:isEmpty(bill_order_no)?null:bill_order_no,
            title:isEmpty(title)?null:title,
            tax_no:isEmpty(tax_no)?null:tax_no,
            amount:isEmpty(amount)?null:amount,
            card_id:isEmpty(card_id)?null:card_id,
        }
        this.props.invoiceRegularStore.getInvoiceQuery(params);
    }

    //重置
    onResetInvoice = () => {
        this.setState({
            bill_order_no: null,
            title: null,
            tax_no: null,
            amount: null,
            card_id: null,
        });
    }


    onCancel = () => {
        this.props.invoiceRegularStore.setIsShowResult(false);
        this.fetch();
    }

    onKeydown = (e) => {
        console.log(e.key);
        if (e.key === 'Enter'){
            this.fetch();
        }
    }
    //查询
    onSearch = () => {
        const {bill_order_no, title, tax_no, amount, card_id} = this.state;
        const params = {
            page_num: 1,
            page_size: page_size,
            bill_order_no:isEmpty(bill_order_no)?null:bill_order_no,
            title:isEmpty(title)?null:title,
            tax_no:isEmpty(tax_no)?null:tax_no,
            amount:isEmpty(amount)?null:amount,
            card_id:isEmpty(card_id)?null:card_id,
        }
        this.props.invoiceRegularStore.getInvoiceQuery(params);
    }

    onChangeBillOrderNo = (e) => {
        this.setState({bill_order_no: e.target.value});
    }
    onChangeTitle = (e) => {
        this.setState({title: e.target.value});
    }

    onChangeTaxNo = (e) => {
        this.setState({tax_no: e.target.value});
    }

    onChangeAmount = (e) => {
        this.setState({amount: e.target.value});
    }

    onChangeCardId = (e) => {
        this.setState({card_id: e.target.value});
    }

    render() {
        const {bill_order_no, title, tax_no, amount, card_id} = this.state;
        const {pagination, isShowLoading, dataList, isShowResult, apply_url} = this.props.invoiceRegularStore;

        invoiceRegularStore = this.props.invoiceRegularStore;
        return (
            <div className="invoice-regular-container">
                <div className="invoice-regular-search-container" ref={node => this.search_container = node}>
                    <div className="invoice-regular-search-double">
                        <div className="invoice-regular-input-item">
                            <div className="invoice-regular-input-title">抬&nbsp;&nbsp;&nbsp;头:</div>
                            <Input
                                size="small"
                                value={title}
                                onChange={this.onChangeTitle}
                                onKeyDown={this.onKeydown}
                            />
                        </div>
                        <div className="invoice-regular-input-item">
                            <div className="invoice-regular-input-title">订单号:</div>
                            <Input
                                size="small"
                                value={bill_order_no}
                                onChange={this.onChangeBillOrderNo}
                                onKeyDown={this.onKeydown}
                            />
                        </div>
                    </div>
                    <div className="invoice-regular-search-double">
                        <div className="invoice-regular-input-item">
                            <div className="invoice-regular-input-title">税号:</div>
                            <Input
                                size="small"
                                value={tax_no}
                                onChange={this.onChangeTaxNo}
                                onKeyDown={this.onKeydown}
                            />
                        </div>
                        <div className="invoice-regular-input-item">
                            <div className="invoice-regular-input-title">卡号:</div>
                            <Input
                                size="small"
                                value={card_id}
                                onChange={this.onChangeCardId}
                                onKeyDown={this.onKeydown}
                            />
                        </div>
                    </div>
                    <div className="invoice-regular-search-double">
                        <div className="invoice-regular-input-item">
                            <div className="invoice-regular-input-title">金额:</div>
                            <Input
                                size="small"
                                value={amount}
                                onChange={this.onChangeAmount}
                                onKeyDown={this.onKeydown}
                            />
                        </div>
                    </div>
                    <div className="invoice-regular-search-btn-container">
                        <Button size="small" type="primary"
                                onClick={this.onSearch}
                                style={{width: 80, marginBottom: 5, fontSize: 14}}>查询</Button>
                        <Button size="small" type="primary"
                                onClick={this.onResetInvoice}
                                style={{width: 80, fontSize: 14}}>重置</Button>
                    </div>
                </div>
                <div className="table-regular-container">
                    <Table
                        className="invoice-regular-table"
                        scroll={{x: '120%'}}
                        bordered
                        size="small"
                        columns={columns}
                        dataSource={dataList}
                        pagination={pagination}
                        loading={isShowLoading}
                        rowClassName={(record, index) => record.state ===2?'row-class':''}
                        onChange={this.handleTableChange}/>
                </div>
                <Modal
                    width={400}
                    okText="确定"
                    // cancelText="取消" centered={true}
                    visible={isShowResult}
                    title='发票冲红成功'
                    onOk={this.onCancel} onCancel={this.onCancel}>
                    <div className='invoice-regular-input-item'>
                        <div style={{textDecoration: 'underline', color: 'rgba(45,142,89,0.52)',}}
                             onClick={() => {
                                 copy(apply_url);
                                 if (copy(apply_url)) {
                                     message.info('复制成功')
                                 } else {
                                     message.error('复制失败')
                                 }
                             }}>冲红成功！点击复制新的开票链接</div>
                    </div>
                </Modal>
            </div>);
    }
}

export default InvoiceRegular;

const columns = [
    {
        title: '消费订单号',
        dataIndex: 'bill_order_no',
        key: 'bill_order_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 75,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (record) => {
            let state = '';
            if (record === 1) {
                state = '正常';
            } else if (record === 2) {
                state = '冲红';
            } else {
                state = '--';
            }
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{state}</p>);
        },
    },
    {
        title: '抬头',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    // maxWidth: 200,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    color: '#4D7DFF',
                    padding: 0,
                    margin: 0
                }}>{record}</p></Tooltip>);
        },
    }, {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    // maxWidth: 200,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    color: '#ff832e',
                    padding: 0,
                    margin: 0
                }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '税号',
        dataIndex: 'tax_no',
        key: 'tax_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: 'PDF链接',
        dataIndex: 'pdf_url',
        key: 'pdf_url',
        align: 'center',
        render: (record) => {
            return (
                record ? <div style={{
                    minWidth: 75,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textDecoration: 'underline',
                    color: 'rgba(45,142,89,0.52)',
                    padding: 0,
                    margin: 0,
                }} onClick={() => {
                    copy(record)
                    if (copy(record)) {
                        message.info('复制成功')
                    } else {
                        message.error('复制失败')
                    }
                }}>复制</div> : <div style={{minWidth: 60, padding: 0, margin: 0}}/>
            );
        },
    }, {
        title: '图片链接',
        dataIndex: 'image_url',
        key: 'image_url',
        align: 'center',
        render: (record) => {
            return (
                record ? <div style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textDecoration: 'underline',
                    color: 'rgba(45,142,89,0.52)',
                    padding: 0,
                    margin: 0,
                }} onClick={() => {
                    copy(record)
                    if (copy(record)) {
                        message.info('复制成功')
                    } else {
                        message.error('复制失败')
                    }
                }}>复制</div> : <div style={{minWidth: 60, padding: 0, margin: 0}}/>);
        },
    }, {
        title: '开票时间',
        dataIndex: 'done_time',
        key: 'done_time',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}>{record}</p></Tooltip>);
        },
    }, {
        title: '消费时间',
        dataIndex: 'consume_time',
        key: 'consume_time',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '申请链接',
        dataIndex: 'apply_url',
        key: 'apply_url',
        align: 'center',
        render: (record) => {
            return (
                record ? <div style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textDecoration: 'underline',
                    color: 'rgba(45,142,89,0.52)',
                    padding: 0,
                    margin: 0,
                }} onClick={() => {
                    copy(record)
                    if (copy(record)) {
                        message.info('复制成功')
                    } else {
                        message.error('复制失败')
                    }
                }}>复制</div> : <div style={{minWidth: 60, padding: 0, margin: 0}}/>);
        },
    }, {
        title: '银行',
        dataIndex: 'bank_name',
        key: 'bank_name',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '账户',
        dataIndex: 'bank_no',
        key: 'bank_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '收件人手机号',
        dataIndex: 'accept_mobile',
        key: 'accept_mobile',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '收件人邮箱',
        dataIndex: 'accept_email',
        key: 'accept_email',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 75,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '收件人地址',
        dataIndex: 'accept_address',
        key: 'accept_address',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 75,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }, {
        title: '操作',
        key: 'option',
        fixed: 'right',
        align: 'center',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 80,
                    color: "#1890ff",
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                { record.state===1?<Popconfirm
                    title="确定冲红该发票吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        invoiceRegularStore.invoiceWriteOff(record.order_no);
                    }}>
                    <div>
                        <Icon type="form"/>
                        <a style={{fontSize: 15, marginLeft: 2}}>冲红</a>
                    </div>
                </Popconfirm>:
                    <div>
                    <Icon type="form" style={{color:"#b7b5b5"}}/>
                    <a style={{fontSize: 15, marginLeft: 2,color:"#b7b5b5"}}>冲红</a>
                    </div>}
            </div>);
        },
    },
];
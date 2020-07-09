import React from 'react';
import './Financial.scss';
import {Table, Button, DatePicker} from 'antd';
import {inject, observer} from 'mobx-react';

let page_num = 0;

@inject("financialStore")
@observer
class Financial extends React.Component{
    constructor() {
        super();
        this.state = {
            bill_date: null,
        }
    }

    componentDidMount(){
        page_num = 18;
        this.fetch();
    }


    fetch = () =>{
        this.props.financialStore.getFinancialList(this.state.bill_date,page_num);
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('bill_date', value);
        this.setState({bill_date: value});
    }

    onReset = () =>{
        this.setState({
            bill_date: null,
        });
    }

    onReach = () =>{
        this.fetch();
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.financialStore.pagination};
        pager.current = pagination.current;
        this.props.financialStore.setPagination(pager);
    }

    render(){
        const { bill_date} = this.state;
        const {isShowLoading, financialList,pagination} = this.props.financialStore;
        return(
            <div className="financial-container">
                <div className="financial-top-container" ref={node => this.search_container = node}>
                    <div className="financial-search-item-container">
                        <div className="financial-date-picker-container">
                            <div>账单日期:</div>
                            <DatePicker
                                size="small"
                                format="YYYY-MM-DD"
                                value={bill_date}
                                placeholder="账单日期"
                                onChange={this.onStartChange}/>
                        </div>
                    </div>
                    <div className="financial-btn-container">
                        <Button type="primary"
                                size="small"
                                disabled={isShowLoading ? true : false}
                                style={{ width: 80}}
                                onClick={this.onReach}>查询
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            disabled={isShowLoading? true:false}
                            style={{marginLeft:15, width:80}}
                            onClick={this.onReset}
                        >重置
                        </Button>
                    </div>
                </div>
                <div className="financial-table-container">
                    <Table
                        className="financial-table"
                        bordered
                        size="small"
                        columns={columns}
                        loading={isShowLoading}
                        dataSource={financialList}
                        pagination={pagination}
                        scroll={{x:'130%'}}
                        onChange={this.handleTableChange}/>
                </div>
            </div>
        );
    }
}
export default Financial;
const columns = [
    {
        title: '日期',
        dataIndex: 'bill_date',
        key: 'bill_date',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '平台汇总数据',
        dataIndex: 'platform_data',
        key: 'platform_data',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
        children: [
            {
                title: '笔数',
                dataIndex: 'oil_success_num',
                key: 'oil_success_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:30,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '总金额',
                dataIndex: 'oil_total_amount',
                key: 'oil_total_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '总折扣',
                dataIndex: 'oil_discount_amount',
                key: 'oil_discount_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '折扣后',
                dataIndex: 'oil_actual_amount',
                key: 'oil_actual_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款笔数',
                dataIndex: 'oil_refund_num',
                key: 'oil_refund_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款金额',
                dataIndex: 'oil_refund_amount',
                key: 'oil_refund_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            }
        ],
    },
    {
        title: '第三方汇总数据',
        dataIndex: 'wx_data',
        key: 'wx_data',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
        children:[
            {
                title: '支付渠道',
                dataIndex: 'bill_channel',
                key: 'bill_channel',
                align: 'center',
                render: (record) => {
                    let bill_channel = "";
                    if (record==="01"){
                        bill_channel = "余额支付";
                    } else if (record==="02"){
                        bill_channel = "银联支付";
                    } else if (record==="03"){
                        bill_channel = "支付宝";
                    } else if (record==="04"){
                        bill_channel = "微信";
                    }else if (record==="05"){
                        bill_channel = "合作机构";
                    }
                    return (<p style={{
                        minWidth:30,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{bill_channel}</p>);
                },
            },
            {
                title: '笔数',
                dataIndex: 'partner_success_num',
                key: 'partner_success_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:30,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '总金额',
                dataIndex: 'partner_total_amount',
                key: 'partner_total_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '总折扣',
                dataIndex: 'partner_discount_amount',
                key: 'partner_discount_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '折扣后',
                dataIndex: 'partner_actual_amount',
                key: 'partner_actual_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '手续费',
                dataIndex: 'partner_fee_amount',
                key: 'partner_fee_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款笔数',
                dataIndex: 'partner_refund_num',
                key: 'partner_refund_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款金额',
                dataIndex: 'partner_refund_amount',
                key: 'partner_refund_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            }
        ],
    },
    {
        title: '信联汇总数据',
        dataIndex: 'xl_data',
        key: 'xl_data',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
        children:[
            {
                title: '笔数',
                dataIndex: 'xlcore_success_num',
                key: 'xlcore_success_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:30,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '总金额',
                dataIndex: 'xlcore_total_amount',
                key: 'xlcore_total_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '总折扣',
                dataIndex: 'xlcore_discount_amount',
                key: 'xlcore_discount_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },

            {
                title: '折扣后',
                dataIndex: 'xlcore_actual_amount',
                key: 'xlcore_actual_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:45,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款笔数',
                dataIndex: 'xlcore_refund_num',
                key: 'xlcore_refund_num',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            },
            {
                title: '退款金额',
                dataIndex: 'xlcore_refund_amount',
                key: 'xlcore_refund_amount',
                align: 'center',
                render: (record) => {
                    return (<p style={{
                        minWidth:60,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>);
                },
            }
        ],

    }
];
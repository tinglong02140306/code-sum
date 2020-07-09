import React from 'react';
import {Table, Icon, Form, DatePicker, Input, Select, Button} from 'antd';
import "./Reports.scss";
import {inject, observer} from "mobx-react/index";
import ReportDialog from "../../../component/shell/report/ReportDialog";

let page_size = 0;
let reportStore = {};

@inject("reportStore")
@observer
class Reports extends React.Component {
    constructor() {
        super();
        this.state = {
            width: 0,
            isLoading: false,
            start_date: null,
            end_date: null,
            terminal_id: '',
            bill_status: '',
        }
    }

    componentDidMount() {
        page_size = 18;
        this.fetch();
    }

    fetch = () => {
        const {start_date, end_date, terminal_id, bill_status} = this.state;
        this.props.reportStore.getReportList(1, page_size, start_date, end_date, terminal_id, bill_status);

    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    /**
     * 查询
     */
    onSearchClick = () => {
        this.fetch();

    }

    onResetClick = () => {
        this.setState({
            start_date: null,
            end_date: null,
            terminal_id: '',
            bill_status: '',
        });

    }

    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    }

    /**
     * 开始日期
     * @param value
     */
    onStartChange = (value) => {
        this.setState({start_date: value});
        this.onChange('startValue', value);
    };
    disabledStartDate = (startValue) => {
        const endValue = this.state.end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    onChangeBillStatus = (value) => {
        this.setState({bill_status: value});
        if (value === "00") {
            this.setState({bill_status: "00"});
        } else if (value === "01") {
            this.setState({bill_status: "01"});
        } else if (value === "02") {
            this.setState({bill_status: "02"});
        } else if (value === "03") {
            this.setState({bill_status: "03"});
        } else if (value === "04") {
            this.setState({bill_status: "04"});
        } else if (value === "05") {
            this.setState({bill_status: "05"});
        } else if (value === "06") {
            this.setState({bill_status: "06"});
        } else if (value === "07") {
            this.setState({bill_status: "07"});
        } else {
            this.setState({bill_status: ""});
        }
    }
    /**
     * 结束日期
     * @param value
     */
    onEndChange = (value) => {

        this.setState({end_date: value});
        this.onChange('endValue', value);
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    //分页加载
    handleTableChange = (pagination) => {
        const {start_date, end_date, terminal_id, bill_status} = this.state;

        const pager = {...this.props.reportStore.pagination};
        pager.current = pagination.current;
        this.props.reportStore.setPagination(pager);
        this.props.reportStore.getReportList(pager.current, page_size, start_date, end_date, terminal_id, bill_status);
    }

    render() {
        const {start_date, end_date, terminal_id, bill_status, width} = this.state;
        const {isShowTableLoading, reportList, pagination, isShowDialog} = this.props.reportStore;
        reportStore = this.props.reportStore;

        return (
            <div className="reports-container">
                <div className="reports-top-container" ref={node => this.search_container = node}>
                    <Form className="reports-form" layout="inline">
                        <Form.Item label="开始日期" className="reports-form-item">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                value={start_date}
                                placeholder="开始日期"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                        </Form.Item>
                        <Form.Item label="结束日期" className="reports-form-item">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                value={end_date}
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </Form.Item>
                        <Form.Item label="终端号" className="reports-form-item">
                            <Input size="small"
                                   value={terminal_id}
                                   style={{width: 150, margin: 0}}
                                   maxLength={20}
                                   onChange={this.onChangeTerminalId}/>
                        </Form.Item>
                        <Form.Item label="订单状态" className="reports-form-item">
                            <Select
                                size="small"
                                style={{width: 150}}
                                value={bill_status}
                                onChange={this.onChangeBillStatus}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="00">订单创建</Select.Option>
                                <Select.Option value="01">支付成功</Select.Option>
                                <Select.Option value="02">支付失败</Select.Option>
                                <Select.Option value="03">消费成功</Select.Option>
                                <Select.Option value="04">消费失败</Select.Option>
                                <Select.Option value="05">订单取消</Select.Option>
                                <Select.Option value="06">冲正成功</Select.Option>
                                <Select.Option value="07">冲正失败</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" size="small" className="reports-button"
                                onClick={this.onSearchClick}>查询</Button>
                        <Button type="primary" size="small" className="reports-button"
                                onClick={this.onResetClick}>重置</Button>
                    </Form>
                </div>
                <Table className="reports-table"
                       columns={columns}
                       bordered={true}
                       dataSource={reportList}
                       size="small"
                       pagination={pagination}
                       onChange={this.handleTableChange}
                       loading={isShowTableLoading}
                       scroll={{x: '110%'}}/>
                {isShowDialog ? <ReportDialog/> : null}
            </div>
        )
    }
}

export default Reports;
const columns = [
    {
        title: '消费订单号',
        dataIndex: 'order_no',
        key: 'order_no',
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
        title: '订单状态',
        dataIndex: 'bill_status',
        key: 'bill_status',
        align: 'center',
        render: (record) => {
            let billStatus = "";
            if (record == "00") {
                billStatus = "订单创建";
            } else if (record == "01") {
                billStatus = "支付成功"
            } else if (record == "02") {
                billStatus = "支付失败"
            } else if (record == "03") {
                billStatus = "消费成功"
            } else if (record == "04") {
                billStatus = "消费失败"
            } else if (record == "05") {
                billStatus = "订单取消"
            } else if (record == "06") {
                billStatus = "冲正成功"
            } else if (record == "07") {
                billStatus = "冲正失败"
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{billStatus}</p>);
        },
    }, {
        title: '终端号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 45,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '订单金额',
        dataIndex: 'order_amount',
        key: 'order_amount',
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
    },
    {
        title: '应付金额',
        dataIndex: 'payable_amount',
        key: 'payable_amount',
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
    },
    {
        title: '折扣金额',
        dataIndex: 'discount_amount',
        key: 'discount_amount',
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
    },
    {
        title: '实付金额',
        dataIndex: 'payment_amount',
        key: 'payment_amount',
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
    },
    {
        title: '成本金额',
        dataIndex: 'cost_amount',
        key: 'cost_amount',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p>);
        },
    },
    {
        title: '油品类型',
        dataIndex: 'oil_type',
        key: 'oil_type',
        align: 'center',
        render: (record) => {
            let oilType = "";
            if (record == "0") {
                oilType = "汽油";
            } else {
                oilType = "柴油"
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{oilType}</p>);
        },
    },
    {
        title: '油品详情',
        dataIndex: 'oil_detail',
        key: 'oil_detail',
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
    },
    {
        title: '成本单价',
        dataIndex: 'cost_price',
        key: 'cost_price',
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
    },
    {
        title: '油机单价',
        dataIndex: 'list_price',
        key: 'list_price',
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
    },
    {
        title: '信联单价',
        dataIndex: 'xl_price',
        key: 'xl_price',
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
    },
    {
        title: '油品数量',
        dataIndex: 'oil_num',
        key: 'oil_num',
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
    },
    {
        title: '消费时间',
        dataIndex: 'consume_date',
        key: 'consume_date',
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
    },
    {
        title: '操作',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 60,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                }}
                onClick={() => {
                    reportStore.setIsShowDialog(true);
                    reportStore.setReportObject(record);
                }}
            ><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
        },
    },

];
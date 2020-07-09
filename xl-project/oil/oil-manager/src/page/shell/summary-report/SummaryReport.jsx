import React from 'react';
import './SummaryReport.scss';
import {Button, Form, DatePicker, Table,message} from 'antd';
import moment from 'moment';
import {inject, observer} from "mobx-react/index";


const FormItem = Form.Item;
let page_num = 0;
let nowTime = moment();
let startTime = moment().add(-7,'days');

@inject("summaryStore")
@observer
class SummaryReport extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading:false,
            start_date:null,
            end_date:null
        }
    }

    componentDidMount(){      
        page_num = 18;
        this.setState({
            start_date: startTime,
            end_date:nowTime,
        },()=> {
            this.fetch();
        });
    }

    fetch = () =>{
        const {start_date,end_date} = this.state;
        this.props.summaryStore.getConsumeSumList(1,page_num,start_date,end_date);
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
        const {start_date,end_date} = this.state;

        if (start_date == null || end_date == null){
            message.error("时间不能为空!");

        } else {
            this.fetch();
        }

    }

    resetClick = () => {
        this.setState({
            start_date: null,
            end_date:null,
        });

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

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
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
        const pager = {...this.props.summaryStore.pagination};
        pager.current = pagination.current;
        this.props.summaryStore.setPagination(pager);

        const {start_date,end_date} = this.state;
        this.props.summaryStore.getConsumeSumList(pager.current,page_num,start_date,end_date);
    }

    render() {
        const {start_date,end_date} = this.state;

        const {isShowLoading, dataList,pagination} = this.props.summaryStore;
        return (
            <div className="summary-report-container">
                <div className="summary-report-top-container" ref={node => this.search_container = node}>
                    <Form className="summary-report-form">
                        <FormItem label="开始日期">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledStartDate}
                                defaultValue={startTime}
                                format="YYYY-MM-DD"
                                value={start_date}
                                placeholder="开始日期"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />

                        </FormItem>
                        <FormItem label="结束日期">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledEndDate}
                                defaultValue={nowTime}
                                format="YYYY-MM-DD"
                                value={end_date}
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="small" className="summary-report-form-btn" onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="summary-report-form-btn" onClick={this.resetClick}>重置</Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="summary-report-table-box">
                    <div className="summary-report-table-container">
                        <Table
                            className="summary-report-table"
                            bordered
                            size="small"
                            columns={columns}
                            loading={isShowLoading}
                            dataSource={dataList}
                            pagination={pagination}
                            scroll={{x:'120%'}}
                            onChange={this.handleTableChange}/>
                    </div>
                </div>
            </div>
        );
    }

}
export default SummaryReport;

const columns = [{
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
},{
    title: '总订单金额',
    dataIndex: 'order_amount_sum',
    key: 'order_amount_sum',
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
        title: '总应付金额',
        dataIndex: 'payable_amount_sum',
        key: 'payable_amount_sum',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 75,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p>);
        },
    },
    {
        title: '总折扣金额',
        dataIndex: 'discount_amount_sum',
        key: 'discount_amount_sum',
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
        title: '总实付金额',
        dataIndex: 'payment_amount_sum',
        key: 'payment_amount_sum',
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
        title: '总成本金额',
        dataIndex: 'cost_amount_sum',
        key: 'cost_amount_sum',
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
        title: '总收益金额',
        dataIndex: 'income_amount_sum',
        key: 'income_amount_sum',
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
        title: '总油品数量',
        dataIndex: 'oil_num_sum',
        key: 'oil_num_sum',
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
    }
];
import React from 'react';
import './WaterCollect.scss';
import {Button, Form, DatePicker, Table,message} from 'antd';
import moment from 'moment';
import {inject, observer} from "mobx-react/index";


const FormItem = Form.Item;
let page_num = 0;
let nowTime = moment();
let startTime = moment().add(-7,'days');

@inject("collectStore")
@observer
class WaterCollect extends React.Component {
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
        },()=>{
            this.fetch();
        });
    }


    fetch = () =>{
        const {start_date,end_date} = this.state;
        this.props.collectStore.getConsumeList(1,page_num,start_date,end_date);
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }


    downloadExl = () =>{
        const {start_date,end_date} = this.state;
        this.props.collectStore.getExportAllData(1,999,start_date,end_date);
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
        const pager = {...this.props.collectStore.pagination};
        pager.current = pagination.current;
        this.props.collectStore.setPagination(pager);
    }

    header=()=>{
        const {isShowLoading} = this.props.collectStore;
        return <div className="water-collect-btn-container">
        <Button type="primary"
                size="small"
                icon="download"
                disabled={isShowLoading ? true : false}
                style={{ width: 80}}
                onClick={this.downloadExl}>导出</Button>
        </div>
    }

    render() {
        const {start_date,end_date} = this.state;
        const {isShowLoading, dataList,pagination} = this.props.collectStore;
        return (
            <div className="water-collect-container">
                <div className="water-collect-top-container" ref={node => this.search_container = node}>
                    <Form className="water-collect-form">
                        <FormItem label="开始日期">
                            <DatePicker
                                size="small"
                                defaultValue={startTime}
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                value={start_date}
                                placeholder="开始日期"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}/>
                        </FormItem>
                        <FormItem label="结束日期">
                            <DatePicker
                                size="small"
                                defaultValue={nowTime}
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                value={end_date}
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                onOpenChange={this.handleEndOpenChange}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="small" className="water-collect-form-btn" onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="water-collect-form-btn" onClick={this.resetClick}>重置</Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="water-collect-table-box">
                    <div className="water-collect-table-container">
                        <Table
                            className="water-collect-table"
                            bordered
                            title={this.header}
                            size="small"
                            columns={columns}
                            loading={isShowLoading}
                            dataSource={dataList}
                            pagination={pagination}
                            onChange={this.handleTableChange}/>
                    </div>
                </div>
            </div>
            );
    }

}
// export default Form.create()(WaterCollect);
export default WaterCollect;

const columns = [{
    title: '交易日期',
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
    title: '订单金额',
    dataIndex: 'amount',
    key: 'amount',
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
        title: '实际消费金额',
        dataIndex: 'consume_amount',
        key: 'consume_amount',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p>);
        },
    },
    {
        title: '折扣金额',
        dataIndex: 'discount',
        key: 'discount',
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
        title: '手续费',
        dataIndex: 'fee',
        key: 'fee',
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
    }];
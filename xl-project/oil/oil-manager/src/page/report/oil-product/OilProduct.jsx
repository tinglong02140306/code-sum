import React from 'react';
import './OilProduct.scss';
import {Table, Button, Form, DatePicker} from 'antd';
import {inject, observer} from 'mobx-react';

let page_num = 0;
let  business_type_array = [];
let  business_data_count_array = [];

@inject("oilProductStore")
@observer
class OilProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            oil_start_date:null,
            oil_end_date:null
        }
    }

    componentDidMount(){
       page_num = 18;
        this.fetch();
    }


    fetch = () =>{
        const {oil_start_date, oil_end_date} = this.state;
        this.props.oilProductStore.getOilProductList(oil_start_date,oil_end_date);
        business_type_array = this.props.oilProductStore.business_type_array;
        business_data_count_array = this.props.oilProductStore.business_data_count_array;
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }


    downloadExl = () =>{
        this.props.oilProductStore.downloadExl();
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.oilProductStore.pagination};
        pager.current = pagination.current;
        this.props.oilProductStore.setPagination(pager);
    }

    /**
     * 开始日期
     * @param value
     */
    onStartChange = (value) => {
        this.setState({oil_start_date: value});
        this.onChange('startValue', value);
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.oil_end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    /**
     * 结束日期
     * @param value
     */
    onEndChange = (value) => {
        this.setState({oil_end_date: value});
        this.onChange('endValue', value);
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.oil_start_date;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    /**
     * 查询
     */
    onSearchClick = () => {
        this.fetch();
    }

    resetClick = () => {
        this.setState({
            oil_start_date:null,
            oil_end_date:null
        });
    }

    header=()=>{
        const {isShowLoading} = this.props.oilProductStore;
        return <div className="oil-product-btn-container">
                        <Button type="primary"
                                size="small"
                                icon="download"
                                disabled={isShowLoading ? true : false}
                                style={{ width: 80}}
                                onClick={this.downloadExl}
                        >导出</Button>
            </div>
    }

    render(){
        const {oil_start_date,oil_end_date} = this.state;
        const {isShowLoading, oilProductList,pagination} = this.props.oilProductStore;
        return(
            <div className="oil-product-container">
                <div className="oil-product-top-container" ref={node => this.search_container = node}>
                    <Form className="oil-product-form">
                        <Form.Item label="开始日期">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                value={oil_start_date}
                                placeholder="开始日期"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                        </Form.Item>
                        <Form.Item label="结束日期">
                            <DatePicker
                                size="small"
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                value={oil_end_date}
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size="small" className="oil-product-form-btn"
                                    onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="oil-product-form-btn"
                                    onClick={this.resetClick}>重置</Button>
                        </Form.Item>
                    </Form>

                </div>
                <div className="oil-product-table-box">
                    <div className="oil-product-table-container">
                        <Table
                            className="oil-product-table"
                            bordered
                            title={this.header}
                            size="small"
                            columns={columns}
                            loading={isShowLoading}
                            dataSource={oilProductList}
                            pagination={pagination}/>
                    </div>
                </div>


            </div>
        );
    }
}
export default OilProduct;


const columns = [
    {
        title: '业务类型',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        render: (text,record,index) => {
            const obj = {
                children: <p style={{
                    minWidth:60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{text}</p>,
                props: {},
            };
            if (index === 0) {
                obj.children= <p style={{
                    minWidth:60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{business_type_array[0]}</p>;
                obj.props.rowSpan = business_data_count_array[0];

            }
            for(let i=1;i<business_data_count_array[0];i++){
                if(index === i){
                    obj.props.rowSpan = 0;
                }
            }
            if (index === business_data_count_array[0]) {
                obj.children= <p style={{
                    minWidth:60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{business_type_array[1]}</p>;
                obj.props.rowSpan = business_data_count_array[1];
            }
            let j = business_data_count_array[0]+business_data_count_array[1];

            for(let i=business_data_count_array[0]+1;i<j;i++){
                if(index === i){
                    obj.props.rowSpan = 0;
                }}
            if (index === j) {
                obj.children= <p style={{
                    minWidth:60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>总计</p>;
                obj.props.rowSpan = 1;
                obj.props.colSpan = 2;
            }
            return obj;
        },
    },
    {
        title: '产品类型',
        dataIndex: 'product_type',
        key: 'product_type',
        align: 'center',
        render: (text,record,index) => {

            const obj = {
                children: <p style={{
                    minWidth:60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{text}</p>,
                props: {},
            };
            if (index === business_data_count_array[0]+business_data_count_array[1]) {

                obj.props.colSpan = 0;
            }
            return obj;
        },
    },
    {
        title: '本金消费',
        dataIndex: 'capital_consume',
        key: 'capital_consume',
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
        children: [
            {
                title: '消费金额',
                dataIndex: 'capital_consume_amount',
                key: 'capital_consume_amount',
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
                title: '折扣金额',
                dataIndex: 'capital_discount_amount',
                key: 'capital_discount_amount',
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
                title: '实际金额',
                dataIndex: 'capital_actual_amount',
                key: 'capital_actual_amount',
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
        ],
    },
    {
        title: '积分消费',
        dataIndex: 'integral_consume',
        key: 'integral_consume',
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
        children:[
            {
                title: '消费金额',
                dataIndex: 'integral_consume_amount',
                key: 'integral_consume_amount',
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
                title: '折扣金额',
                dataIndex: 'integral_discount_amount',
                key: 'integral_discount_amount',
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
                title: '实际金额',
                dataIndex: 'integral_actual_amount',
                key: 'integral_actual_amount',
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
        ],
    },
    {
        title: '合计',
        dataIndex: 'total_consume',
        key: 'total_consume',
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
        children:[
            {
                title: '消费金额',
                dataIndex: 'total_consume_amount',
                key: 'total_consume_amount',
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
                title: '折扣金额',
                dataIndex: 'total_discount_amount',
                key: 'total_discount_amount',
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
                title: '实际金额',
                dataIndex: 'total_actual_amount',
                key: 'total_actual_amount',
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
        ],

    }
];
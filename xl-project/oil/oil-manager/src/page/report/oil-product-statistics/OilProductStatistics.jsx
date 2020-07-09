import React from 'react';
import "./OilProductStatistics.scss"
import {Table, Button, Form, DatePicker,message} from 'antd';
import {inject, observer} from 'mobx-react';
import Header from "../../../component/report/wx-report-header/Header";
import {getCurrentDate, getCurrentFirstDate, getDifferDate} from "../../../utils/utils";
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD';
const defaultValue = [moment(getCurrentFirstDate(), dateFormat),moment(getCurrentDate(), dateFormat)];

let page_num = 0;
let  business_type_array = [];
let  business_data_count_array = [];

@inject("productStatisticsStore")
@observer
class OilProductStatistics extends React.Component {
    constructor() {
        super();
        this.state = {
            pickerValue:defaultValue,
            start_time: getCurrentFirstDate(),
            end_time: getCurrentDate()
        }
    }

    componentDidMount(){
        page_num = 18;
        this.fetch();
    }

    fetch = () =>{
        const{start_time,end_time} = this.state;
        this.props.productStatisticsStore.getOilProductList(start_time,end_time);
        business_type_array = this.props.productStatisticsStore.business_type_array;
        business_data_count_array = this.props.productStatisticsStore.business_data_count_array;
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    /**
     *导出
     */
    downloadExl = () =>{
        const{start_time,end_time} = this.state;
        this.props.productStatisticsStore.downloadExl(start_time,end_time);
    }

    /**
     *日期选择
     */
    onPickerChange = (dates, dateStrings) =>{
        const differ = getDifferDate(dateStrings[0],dateStrings[1]);
        if(differ<366){
            this.setState({
                pickerValue:dates,
                start_time:dateStrings[0],
                end_time:dateStrings[1]
            });
            this.props.productStatisticsStore.getOilProductList(dateStrings[0],dateStrings[1]);
            business_type_array = this.props.productStatisticsStore.business_type_array;
            business_data_count_array = this.props.productStatisticsStore.business_data_count_array;
        }else{
            message.error("所属日期查询最大跨度为365天");
        }

    }
    footer=()=>{
        return  <div className="oil-product-s-table-label">
            <div className="oil-product-s-footer-bottom">
                <div className="oil-product-s-footer-text">分管领导:</div>
                <div className="oil-product-s-footer-text">负责人:</div>
                <div className="oil-product-s-footer-text">复核人:</div>
                <div className="oil-product-s-footer-text">制表人:</div>
                <div className="oil-product-s-footer-text">制表日期:</div>
            </div>
        </div>
    }

    render(){
        const {pickerValue} = this.state;
        const {isShowLoading, oilProductList,pagination} = this.props.productStatisticsStore;
        return(
            <div className="oil-product-s-container">
                <div className="oil-product-s-header-container">
                    <p className="oil-product-s-header-title">加油业务各产品消费统计报表</p>
                    <div className="oil-product-s-title-right">
                        <Button className="oil-product-s-title-btn"
                                type="primary"
                                icon="download"
                                onClick={this.downloadExl}
                            // disabled={isShowLoading||!chargeList.length}
                                size="small">导出</Button>
                    </div>
                </div>
                <Table
                    className="oil-product-s-table"
                    bordered
                    title={()=>Header(pickerValue,this.onPickerChange)}
                    footer={this.footer}
                    size="small"
                    columns={columns}
                    loading={isShowLoading}
                    dataSource={oilProductList}
                    pagination={pagination}/>
            </div>
        );
    }
}
export default OilProductStatistics;


const columns = [
    {
        title: '业务类型',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        render: (text,record,index) => {
            const obj = {
                children: <p>{text}</p>,
                props: {},
            };

            let row=0;
            for (let i=0; i<business_data_count_array.length; i++){
                if (index == row) {
                    obj.children= <p>{business_type_array[i]}</p>;
                    obj.props.rowSpan = business_data_count_array[i];
                }else {
                    let len = business_data_count_array[i];
                    for (let j = row; j < row + len; j++) {
                        if (index == j) {
                            obj.props.rowSpan = 0;
                        }
                    }
                }
                row+=business_data_count_array[i];
            }

            if (business_data_count_array.length>1){
                if (index == row-1) {
                    obj.children= <p>总计</p>;
                    obj.props.rowSpan = 1;
                    obj.props.colSpan = 2;
                }
            }

            return obj;
        },
    },
    {
        title: '产品类型',
        dataIndex: 'product_name',
        key: 'product_name',
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

            if (business_data_count_array.length>1){
                let last = 0;
                for (let i=0;i<business_data_count_array.length ;i++ ) {
                    last+=business_data_count_array[i];
                }
                if (index === last-1) {
                    obj.props.colSpan = 0;
                }
            }
            return obj;
        },
    },
    {
        title: '订单金额',
        dataIndex: 'amount',
        key: 'amount',
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
        }
    },
    {
        title: '增值服务费',
        dataIndex: 'service_charge',
        key: 'service_charge',
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
        }
    },
    {
        title: '收入小计',
        dataIndex: 'subtotal_income',
        key: 'subtotal_income',
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
        }
    },
    {
        title: '折扣金额',
        dataIndex: 'discount',
        key: 'discount',
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
        }
    },
    {
        title: '实际消费金额',
        dataIndex: 'consume_amount',
        key: 'consume_amount',
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
        }
    },
];
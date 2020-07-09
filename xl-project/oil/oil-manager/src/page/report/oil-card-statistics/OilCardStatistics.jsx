import React from 'react';
import './OilCardStatistics.scss';
import {Table, Button, Form, DatePicker, message} from 'antd';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import {getCurrentDate, getCurrentFirstDate, getDifferDate} from '../../../utils/utils';
import Header from "../../../component/report/wx-report-header/Header";

const dateFormat = 'YYYY/MM/DD';
const defaultValue = [moment(getCurrentFirstDate(), dateFormat), moment(getCurrentDate(), dateFormat)];
let business_type_array = [];//业务类型arr
let business_data_count_array = [];//业务类型arr元素个数

@inject("cardStatisticsStore")
@observer
class OilCardStatistics extends React.Component {
    constructor() {
        super();
        this.state = {
            pickerValue: defaultValue,
            start_time: getCurrentFirstDate(),
            end_time: getCurrentDate()
        }
    }

    componentDidMount() {
        const {start_time, end_time} = this.state;
        this.props.cardStatisticsStore.getCardStatisticsList(start_time, end_time);
        business_type_array = this.props.cardStatisticsStore.business_type_array;
        business_data_count_array = this.props.cardStatisticsStore.business_data_count_array;
    }

    downloadExl = () => {
        const {start_time, end_time} = this.state;

        this.props.cardStatisticsStore.downloadExl(start_time, end_time);
    }
    /**
     *计算
     */
    syncClick = () => {
        const {start_time, end_time} = this.state;
        this.props.cardStatisticsStore.getCalculate(start_time, end_time);
        // business_type_array = this.props.productStatisticsStore.business_type_array;
        // business_data_count_array = this.props.productStatisticsStore.business_data_count_array;
    }
    /**
     *日期选择
     */
    onPickerChange = (dates, dateStrings) => {
        const differ = getDifferDate(dateStrings[0], dateStrings[1]);
        if (differ < 366) {
            this.setState({
                pickerValue: dates,
                start_time: dateStrings[0],
                end_time: dateStrings[1]
            });
            this.props.cardStatisticsStore.getCardStatisticsList(dateStrings[0], dateStrings[1]);
            business_type_array = this.props.cardStatisticsStore.business_type_array;
            business_data_count_array = this.props.cardStatisticsStore.business_data_count_array;

        } else {
            message.error("所属日期查询最大跨度为365天");
        }

    }
    // header=()=>{
    //     const {isShowLoading} = this.props.cardStatisticsStore;
    //     return <div className="oil-card-header-container">
    //         <div className="oil-card-header-title">
    //             <div className="oil-card-table-title">加油业务电子卡运营统计报表</div>
    //             <Button type="primary"
    //                     size="small"
    //                     disabled={isShowLoading ? true : false}
    //                     style={{margin:"0 15px"}}
    //             >计算应入账金额</Button>
    //             <Button type="primary"
    //                     size="small"
    //                     // icon="download"
    //                     disabled={isShowLoading ? true : false}
    //                     style={{margin:"0 15px"}}
    //                     onClick={this.downloadExl}
    //             >导出</Button>
    //
    //         </div>
    //         <div className="oil-card-table-line"> </div>
    //         <div className="oil-card-table-label">
    //             <div>制表单位：加油事业部</div>
    //             <div className="oil-card-DatePicker">
    //                 <div>所属日期：</div>
    //                 <DatePicker.RangePicker
    //                     size={"small"}
    //                     format="YYYY.MM.DD"
    //                     onChange={this.onChangeTime}
    //                     // value={start_date}
    //                 />
    //             </div>
    //             <div>单位：元</div>
    //         </div>
    //     </div>
    // }
    footer = () => {
        return <div className="oil-card-table-label">
            <div className="oil-card-footer-bottom">
                <div className="oil-card-footer-text">分管领导:</div>
                <div className="oil-card-footer-text">负责人:</div>
                <div className="oil-card-footer-text">复核人:</div>
                <div className="oil-card-footer-text">制表人:</div>
                <div className="oil-card-footer-text">制表日期:</div>
            </div>

        </div>
    }

    render() {
        const {pickerValue} = this.state;
        const {isShowLoading, cardStatisticsList, pagination} = this.props.cardStatisticsStore;
        return (
            <div className="oil-card-container">
                <div className="oil-card-header-container">
                    <p className="oil-card-table-title">加油业务电子卡运营统计报表</p>
                    <div className="oil-card-table-title-right">
                        <Button className="oil-card-table-title-btn"
                                type="primary"
                                icon="mobile"
                                onClick={this.syncClick}
                                disabled={isShowLoading || !cardStatisticsList.length}
                                size="small">计算</Button>
                        <Button className="oil-card-table-title-btn"
                                type="primary"
                                icon="download"
                                onClick={this.downloadExl}
                            disabled={isShowLoading||!cardStatisticsList.length}
                                size="small">导出</Button>
                    </div>
                </div>
                <Table
                    className="oil-card-table"
                    bordered
                    // title={this.header}
                    title={() => Header(pickerValue, this.onPickerChange)}
                    footer={this.footer}
                    size="small"
                    columns={columns}
                    loading={isShowLoading}
                    dataSource={cardStatisticsList}
                    pagination={pagination}
                />
            </div>
        );
    }
}

export default OilCardStatistics;


const columns = [
    {
        title: '业务类型',
        dataIndex: 'business_name',
        key: 'business_name',
        align: 'center',
        render: (text, record, index) => {
            const obj = {
                children: <p>{text}</p>,
                props: {},
            };
            let row = 0;
            for (let i = 0; i < business_data_count_array.length; i++) {
                if (index == row) {
                    obj.children = <p>{business_type_array[i]}</p>;
                    obj.props.rowSpan = business_data_count_array[i];
                } else {
                    let len = business_data_count_array[i];
                    for (let j = row; j < row + len; j++) {
                        if (index == j) {
                            obj.props.rowSpan = 0;
                        }
                    }
                }
                row += business_data_count_array[i];
            }
            if (business_data_count_array.length > 1) {
                if (index == row - 1) {
                    obj.children = <p>总计</p>;
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
        render: (text, record, index) => {

            const obj = {
                children: <p style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{text}</p>,
                props: {},
            };
            if (business_data_count_array.length > 1) {
                let last = 0;
                for (let i = 0; i < business_data_count_array.length; i++) {
                    last += business_data_count_array[i];
                }

                if (index === last - 1) {
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
                minWidth: 60,
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
                minWidth: 60,
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
        title: '实际消费金额',
        dataIndex: 'consume_amount',
        key: 'consume_amount',
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
        title: '通道手续费',
        dataIndex: 'fee',
        key: 'fee',
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
        title: '应入账金额',
        dataIndex: 'accounts_payable',
        key: 'accounts_payable',
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
    }
];
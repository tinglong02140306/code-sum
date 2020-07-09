import React from 'react';
import './AccountCheck.scss';
import {Button, Form, DatePicker, Table,message,Select,ConfigProvider} from 'antd';
import moment from 'moment';
import {inject, observer} from "mobx-react/index";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const FormItem = Form.Item;
let page_num = 0;
let nowTime = moment();
let startTime = moment().add(-1,'days');

@inject("accountCheckStore")
@observer
class AccountCheck extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading:false,
            partner_id:'',
            bill_date:startTime,
        }
    }

    componentDidMount(){
        page_num = 15;
        if (localStorage.getItem('partner_id')==='null'){
            this.props.accountCheckStore.getPartnerList();
        }
        this.setState({
            partner_id:localStorage.getItem('partner_id')==='null'?'':localStorage.getItem('partner_id'),
            bill_date: startTime,
        },()=>{
            this.fetch();
        });
    }

    fetch = () =>{
        const {partner_id,bill_date} = this.state;
        this.props.accountCheckStore.getAccountCheckList(partner_id,bill_date);
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    downloadExl = () =>{
        const {partner_id,bill_date} = this.state;
        // this.props.accountCheckStore.getExportAllData(partner_id,bill_date);
        this.props.accountCheckStore.downloadExl();
    }

    /**
     * 查询
     */
    onSearchClick = () => {
        const {bill_date} = this.state;
        if (bill_date == null){
            message.error("时间不能为空!");
        } else {
            this.fetch();
        }
    }

    resetClick = () => {
        this.setState({
            partner_id:localStorage.getItem('partner_id')==='null'?'':localStorage.getItem('partner_id'),
            bill_date: startTime,
        });

    }

    /**
     * 日期
     * @param value
     */
    onBillDateChange = (value) => {
        this.setState({bill_date: value});
    };

    onChangePartnerId = (value) => {
        this.setState({partner_id: value});
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.accountCheckStore.pagination};
        pager.current = pagination.current;
        this.props.accountCheckStore.setPagination(pager);
    }

    header=()=>{
        const {isShowLoading} = this.props.accountCheckStore;
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
        const {partner_id,bill_date} = this.state;
        const {isShowLoading, dataList,pagination,partnerList} = this.props.accountCheckStore;
        return (
            <div className="water-collect-container">
                <div className="water-collect-top-container" ref={node => this.search_container = node}>
                    <Form className="water-collect-form">
                        <FormItem label="合作方">
                            {localStorage.getItem('partner_name')==='null'? <Select
                                style={{marginRight:5}}
                                onChange={this.onChangePartnerId}
                                disabled={localStorage.getItem('partner_id')==='null'?false:true}
                                size="small"
                                value={partner_id}>
                                {partnerList !== null ? partnerList.map((number) =>
                                    <Select.Option value={number.partner_id}
                                                   key={number.partner_id}>{number.nick_name}</Select.Option>
                                ) : ""}
                            </Select>: <Select
                                onChange={this.onChangePartnerId}
                                disabled={localStorage.getItem('partner_id')==='null'?false:true}
                                size="small"
                                defaultValue={localStorage.getItem('nick_name')}
                                >

                            </Select>
                            }
                        </FormItem>
                        <FormItem label="订单日期">
                            <DatePicker
                                size="small"
                                defaultValue={startTime}
                                format="YYYY-MM-DD"
                                value={bill_date}
                                placeholder="订单日期"
                                locale={locale}
                                onChange={this.onBillDateChange}
                            />
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
                            className="account-check-table"
                            bordered
                            title={this.header}
                            size="small"
                            columns={columns}
                            loading={isShowLoading}
                            dataSource={dataList}
                            pagination={pagination}
                            rowClassName={(record, index) => index <=2?'gas-class':index >=6?'total-class':'diesel-class'}
                            onChange={this.handleTableChange}/>
                    </div>
                </div>
            </div>
        );
    }

}
export default AccountCheck;

const columns = [{
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
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
        if (index === 0 || index === 3 || index ===6) {
            obj.props.rowSpan = 3;
        }else {
            obj.props.rowSpan = 0;
        }
        return obj;
    },

},{
    title: '油品',
    dataIndex: 'oil_type',
    key: 'oil_type',
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
        title: '订单数量',
        dataIndex: 'bill_count',
        key: 'bill_count',
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
        title: '油品升量',
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
    },{
        title: '订单金额',
        dataIndex: 'bill_amount',
        key: 'bill_amount',
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
    }];
import React from 'react';
import './PosUser.scss';
import {Button, Form, DatePicker, Table,message,Input,Modal} from 'antd';
import moment from 'moment';
import {inject, observer} from "mobx-react/index";
import {isEmpty} from "../../../utils/isEmpty";
import {isNumber} from "../../../utils/isNumber";

const FormItem = Form.Item;
let page_num = 0;
let nowTime = moment();

@inject("posUserStore")
@observer
class SummaryReport extends React.Component {
    constructor() {
        super();
        this.state = {
            terminal_id:'',
            consume_date:nowTime,
            serial_num:''
        }
    }

    componentDidMount(){
        page_num = 18;
    }

    fetch = () =>{
        const {terminal_id,consume_date,serial_num} = this.state;
        this.props.posUserStore.getPosUserList(terminal_id,consume_date,serial_num);
    }

    /**
     * 查询
     */
    onSearchClick = () => {
        const {terminal_id,consume_date,serial_num} = this.state;

        if (isEmpty(consume_date)){
            message.error("请选择交易日期!");
            return
        }
        if (isEmpty(terminal_id)){
            message.error("请输入终端号!");
            return
        } else  if (!isNumber(terminal_id)) {
            Modal.error({
                title: '输入错误',
                content: '请输入正确的终端号(正能输入数字)',
            });
            return
        }
        if (isEmpty(serial_num)){
            message.error("请输入交易参考号!");
            return
        }else  if (!isNumber(serial_num)) {
            Modal.error({
                title: '输入错误',
                content: '请输入正确的交易参考号(正能输入数字)',
            });
            return
        }


        this.fetch();
    }
    /**
     * 重置
     */
    resetClick = () => {
        this.setState({
            terminal_id:'',
            consume_date:null,
            serial_num:''
        });
    }

    /**
     * 交易日期
     * @param value
     */
    onDateChange = (value) => {
        this.setState({consume_date: value});
        // this.onChange('startValue', value);
    };
    /**
     * 终端号
     * @param value
     */
    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    };
    /**
     * 交易参考号
     * @param value
     */
    onChangeSerialNum = (e) => {
        this.setState({serial_num: e.target.value});
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.posUserStore.pagination};
        pager.current = pagination.current;
        this.props.posUserStore.setPagination(pager);
    }

    render() {
        const {terminal_id, consume_date, serial_num,} = this.state;
        const {isShowLoading, dataList,pagination} = this.props.posUserStore;
        return (
            <div className="pos-user-container">
                <div className="pos-user-top-container" ref={node => this.search_container = node}>
                    <div className="pos-user-form-text">仅限微信会员卡用户</div>
                    <Form className="pos-user-form" layout="inline">
                        <FormItem label="交易日期" className="pos-user-form-item">
                            <DatePicker
                                size="small"
                                format="YYYY-MM-DD"
                                defaultValue={nowTime}
                                value={consume_date}
                                placeholder="交易日期"
                                onChange={this.onDateChange}
                            />
                        </FormItem>
                        <Form.Item label="终端号" className="pos-user-form-item">
                            <Input size="small"
                                   value={terminal_id}
                                   style={{width: 150, margin: 0}}
                                   maxLength={20}
                                   placeholder="请输入终端号"
                                   onChange={this.onChangeTerminalId}
                            />
                        </Form.Item>
                        <Form.Item label="交易参考号" className="pos-user-form-item">
                            <Input size="small"
                                   value={serial_num}
                                   style={{width: 150, margin: 0}}
                                   maxLength={20}
                                   placeholder="请输入交易参考号"
                                   onChange={this.onChangeSerialNum}
                            />
                        </Form.Item>
                        <FormItem>
                            <Button type="primary" size="small" className="pos-user-form-btn" onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="pos-user-form-btn" onClick={this.resetClick}>重置</Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="pos-user-table-box">
                    <div className="pos-user-table-container">
                        <Table
                            className="pos-user-table"
                            bordered
                            size="small"
                            columns={columns}
                            loading={isShowLoading}
                            dataSource={dataList}
                            scroll={{x:760}}/>
                    </div>
                </div>
            </div>
        );
    }

}
export default SummaryReport;

const columns = [{
    title: '用户姓名',
    dataIndex: 'real_name',
    key: 'real_name',
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
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
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
        title: '卡号',
        dataIndex: 'card_no',
        key: 'card_no',
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
        title: '应付金额',
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
        title: '本次减免',
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
        title: '实付金额',
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
        title: '油品类型',
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
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
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
    }
];
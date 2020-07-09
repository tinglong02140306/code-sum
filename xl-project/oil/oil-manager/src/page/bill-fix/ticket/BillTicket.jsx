import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal,DatePicker,message} from 'antd';
import './BillTicket.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import TicketStationDialog from "../component/TicketStationDialog";
import {trim} from "../../../utils/trim";
import {formatData} from "../../../utils/formatDate";

let store = null;
@inject("BillTicketStore")
@observer
class BillTicket extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            terminal_id:'',
            amount:'',
            ticket_print_state:'',
            start_time: null,
            end_time: null,
            endOpen: false,
        }
    }
    componentDidMount() {
        //首次进入不主动触发查询，由用户手动触发
        store= this.props.BillTicketStore;
    }

    componentWillUnmount() {
        if (this.props.BillTicketStore.searchData){
            this.props.BillTicketStore.setSearchData(null);
        }
    }

    onSearchClick = () => {
        const {page_num,page_size,terminal_id,start_time,end_time,amount,ticket_print_state} = this.state;
        store= this.props.BillTicketStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            amount:isEmpty(amount)?null:trim(amount),
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            ticket_print_state:isEmpty(ticket_print_state)?null:trim(ticket_print_state),
            start_time:isEmpty(start_time)?null:formatData(start_time),
            end_time:isEmpty(end_time)?null:formatData(end_time),
        }
        this.props.BillTicketStore.getOrderTicketQuery(params);
        // if (searchData||terminal_id||amount||ticket_print_state||start_time||end_time){
        //     this.props.BillTicketStore.getOrderTicketQuery(params);
        // }else {
        //     message.error("请添加查询条件~");
        // }
    }

    onResetClick = () => {
        this.props.BillTicketStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_id: '',
            terminal_id:'',
            amount:'',
            ticket_print_state:'',
            start_time: null,
            end_time: null,
            endOpen: false,
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,terminal_id,start_time,end_time,amount,ticket_print_state} = this.state;
        const {searchData} = store;
        const pager = {...this.props.BillTicketStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        store.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            amount:isEmpty(amount)?null:trim(amount),
            ticket_print_state:isEmpty(ticket_print_state)?null:trim(ticket_print_state),
            start_time:isEmpty(start_time)?null:formatData(start_time),
            end_time:isEmpty(end_time)?null:formatData(end_time),
        }
        this.props.BillTicketStore.getOrderTicketQuery(params);
    };

    onChangeName = (e) => {
        this.props.BillTicketStore.setTypeModal(3);
        this.props.BillTicketStore.setIsShowSearchDialog(true);
    };

    onChangePrintState = (e) => {
        this.setState({ticket_print_state: e});
    };

    onChangeAmount = (e) => {
        this.setState({amount: e.target.value});
    };

    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    };

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_time;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
    }
    disabledEndDate = (endValue) => {
        const startValue = this.state.start_time;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('start_time', value);
        this.setState({
            start_time: value,
            start_export: value,
        });
    }
    onEndChange = (value) => {
        this.onChange('end_time', value);
        this.setState({
            end_time: value,
            end_export: value,
        });
    }

    addStation = () =>{
        if (this.props.BillTicketStore.searchData){
            this.props.BillTicketStore.setSearchData(null);
        }
        this.props.BillTicketStore.setIsShowDialog(true);
        this.props.BillTicketStore.setTypeModal(0)
    };

    render() {
        const {terminal_id,start_time,end_time,ticket_print_state,amount} = this.state;
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,searchData} = this.props.BillTicketStore;
        store = this.props.BillTicketStore;
        return (
            <div className="station-terminal-container">
                <div className="station-terminal-top-container">
                    <div className="station-terminal-top-form">
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="油站名称" className="station-terminal-form-item">
                                <Input size="small"
                                       type="button"
                                       value={searchData?searchData.name:""}
                                       style={{width: 190, marginTop: 9,alignItems:"left"}}
                                       onClick={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="终端ID" className="station-terminal-form-item">
                                <Input size="small"
                                       value={terminal_id}
                                       style={{width: 160, margin: 0}}
                                       onChange={this.onChangeTerminalId}/>
                            </Form.Item>
                            <Form.Item label="订单金额" className="station-terminal-form-item">
                                <Input size="small"
                                       value={amount}
                                       style={{width: 160, margin: 0}}
                                       onChange={this.onChangeAmount}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="station-terminal-button" onClick={this.onSearchClick}>查询</Button>
                        </Form>
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="打印状态" className="station-terminal-form-item">
                                <Select className="terminal-dialog-item-input"
                                        size="small"
                                        value={ticket_print_state}
                                        style={{width: 180, margin: 0}}
                                        onChange={this.onChangePrintState}>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="未打印">未打印</Select.Option>
                                    <Select.Option value="打印失败">打印失败</Select.Option>
                                    <Select.Option value="打印成功">打印成功</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="开始时间" className="station-terminal-form-item">
                                <DatePicker
                                    size="small"
                                    disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    value={start_time}
                                    // placeholder="开始时间"
                                    onChange={this.onStartChange}
                                    className="order-data-picker"/>
                            </Form.Item>
                            <Form.Item label="结束时间" className="station-terminal-form-item">
                                <DatePicker
                                    size="small"
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD"
                                    value={end_time}
                                    // placeholder="结束时间"
                                    onChange={this.onEndChange}
                                    className="order-data-picker"/>
                            </Form.Item>
                            <Button type="primary" size="small" className="station-terminal-button" onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>

                </div>
                <div className="station-terminal-table-container">
                    <Table className='station-terminal-table'
                           bordered={true}
                           size="small"
                           scroll={{x:'120%'}}
                           title={this.header}
                           columns={columns}
                           loading={isShowLoading}
                           dataSource={dataList}
                           onChange={this.handleTableChange}
                           pagination={pagination}
                    >
                    </Table>
                </div>
                {isShowSearchDialog?<TicketStationDialog/>:null}
            </div>

        );
    }
}

export default BillTicket;

const columns = [
    {
        title: '消费订单号',
        dataIndex: 'order_no',
        key: 'order_no',
        align: 'center'
    },{
        title: '打印状态',
        dataIndex: 'ticket_print_state',
        key: 'ticket_print_state',
        align: 'center'
    },{
        title: '打印描述',
        dataIndex: 'ticket_print_state_desc',
        key: 'ticket_print_state_desc',
        align: 'center'
    },
    {
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
        align: 'center',
        //00-订单创建，03-消费成功，04-消费失败，05-订单取消，06-冲正成功，07-冲正失败，08-撤销失败，09-订单退款
        render: (record) => {
            let order_status = "";
            if (record==="00") {
                order_status = "订单创建";
            } else if (record==="03") {
                order_status = "消费成功";
            }else if (record==="04") {
                order_status = "消费失败";
            }else if (record==="05") {
                order_status = "订单取消";
            }else if (record==="06") {
                order_status = "冲正成功";
            }else if (record==="07") {
                order_status = "冲正失败";
            }else if (record==="08") {
                order_status = "撤销失败";
            }else if (record==="09") {
                order_status = "订单退款";
            }else {
                order_status = "--";
            }
            return (<p style={optionStyle.container}>{order_status}</p>);
        },
    }, {
        title: '支付方式',
        dataIndex: 'order_payment',
        key: 'order_payment',
        align: 'center',
        //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付
        render: (record) => {
            let order_payment = "";
            if (record==="01") {
                order_payment = "余额";
            }else if (record==="02"){
                order_payment = "银联支付";
            } else if (record==="03"){
                order_payment = "支付宝支付";
            } else if (record==="04"){
                order_payment = "微信支付";
            } else if (record==="05"){
                order_payment = "合作方支付";
            } else{
                order_payment = "--";
            }
            return (<p style={optionStyle.container}>{order_payment}</p>);
        },
    },{
        title: '消费时间',
        dataIndex: 'consume_time',
        key: 'consume_time',
        align: 'center',
    },{
        title: '总金额',
        dataIndex: 'total_amount',
        key: 'total_amount',
        align: 'center',
    },
    {
        title: '折扣金额',
        dataIndex: 'discount_amount',
        key: 'discount_amount',
        align: 'center',
    },
    {
        title: '实际金额',
        dataIndex: 'actual_amount',
        key: 'actual_amount',
        align: 'center',
    },{
        title: '油品类型',
        dataIndex: 'oil_type',
        key: 'oil_type',
        align: 'center',
        //0-汽油；1-柴油
        render: (record) => {
            let oil_type = "";
            if (record==="0") {
                oil_type = "汽油";
            } else if (record==="1") {
                oil_type = "柴油";
            }else {
                oil_type = "--";
            }
            return (<p style={optionStyle.container}>{oil_type}</p>);
        },
    },{
        title: '油品单价',
        dataIndex: 'oil_price',
        key: 'oil_price',
        align: 'center',
    },{
        title: '油品数量',
        dataIndex: 'oil_num',
        key: 'oil_num',
        align: 'center',
    },{
        title: '油品详情' ,
        dataIndex: 'oil_detail',
        key: 'oil_detail',
        align: 'center',
    },{
        title: '终端编号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center',
    },{
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return <div style={optionStyle.container}>
                <Popconfirm
                    title="确定要申请打印小票吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.billFixPrintTicket(record.order_no)
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="form" style={{color: "#1890ff"}}/>
                        <p style={optionStyle.update}>打印</p>
                    </div>
                </Popconfirm>
            </div>
        }
    }];

const optionStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:12
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        cursor: 'pointer'
    },
    update: {
        margin: 2,
        color: "#1890ff"
    },
    delete: {
        margin: 2,
        color: "#ff5501"
    },
    see: {
        margin: 2,
        color: "#379b7f"
    },
    text:{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0,
    }
}
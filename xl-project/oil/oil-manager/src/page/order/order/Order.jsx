import React from 'react';
import "./Order.scss";
import {Input, Button, Table, DatePicker, Select, Icon, Modal,Popconfirm,message} from 'antd';
import {observer, inject} from 'mobx-react';
import ExportDialog from "../../../component/order/ExportDialog";
import ExportResultDialog from "../../../component/order/ExportResultDialog";
import OrderDialog from "../../../component/order/OrderDialog";
import OrderChildrenDialog from "../../../component/order/OrderChildrenDialog";
import moment from 'moment';
import {isEmpty} from "../../../utils/isEmpty";
import {isSpecialChart} from "../../../utils/isSpecialChart";

let page_num = 0;
let orderStore = {};
let nowTime = moment();
let startTime = moment().add(-7,'days');

@inject("orderStore")
@observer
class Order extends React.Component {

    constructor() {
        super();
        this.state = {
            user_mobile:'',
            channel: 4,
            partner_id: "",
            user_id: "",
            order_no: "",
            card_id: "",
            out_user_id: "",
            out_order_no: "",
            terminal_id: "",
            oil_type: 2,//0-汽油；1-柴油 2-无
            start_date: null,
            end_date: null,
            endOpen: false,
            collapsed: false,
            width: 0,
            order_status:"",
            selectedRowKeys: [],
            start_export: startTime,
            end_export: nowTime,
        }
    }

    componentDidMount() {
        page_num = 10;
        this.fetch();
    }

    fetch = () => {
        const {etc_card_no,channel,user_mobile,start_date, end_date, partner_id, user_id, order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status} = this.state;
        this.props.orderStore.getOrderList(1, page_num, start_date, end_date, partner_id, order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status,etc_card_no,channel,user_mobile);
        this.props.orderStore.getPartnerList();
    }

    handleTableChange = (pagination) => {
        const pager = {...this.props.orderStore.pagination};
        pager.current = pagination.current;
        this.props.orderStore.setPagination(pager);
        const {etc_card_no,channel,user_mobile,start_date, end_date, partner_id, user_id, order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status} = this.state;
        this.props.orderStore.getOrderList(pager.current, page_num, start_date, end_date, partner_id, order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status,etc_card_no,channel,user_mobile,);
    }

    //合作方ID
    onChangePartnerId = (e) => {
        this.setState({partner_id: e.target.value});
    }
    onChangeBrandId = (value) => {
        this.setState({partner_id: value});
    };
    selectBrandOption = () => {
        const {partnerList} = this.props.orderStore;
        // console.log("brandList"+JSON.stringify(brandList))
        if (partnerList.length) {
            return partnerList && partnerList.map((item, index) => {
                // return <Select.Option key={item.code}>{item.name}</Select.Option>
                return <Select.Option key={item.partner_id}>{item.nick_name}</Select.Option>
            });
        }
    };
    //用户号
    onChangeUserId = (e) => {
        this.setState({user_id: e.target.value});
    }
    //消费订单号
    onChangeOrderNo = (e) => {
        this.setState({order_no: e.target.value});
    }
    //加油卡卡号
    onChangeCardId = (e) => {
        this.setState({card_id: e.target.value});
    }
    //手机号
    onChangeUserMobile = (e) => {
        this.setState({user_mobile: e.target.value});
    }
    //第三方用户号
    onChangeOutUserId = (e) => {
        this.setState({out_user_id: e.target.value});
    }
    //第三方订单号
    onChangeOutOrderNo = (e) => {
        this.setState({out_order_no: e.target.value});
    }
    //油品类型
    onChangeOilType = (value) => {
        this.setState({oil_type: value});
    }
    //订单类型
    onChangeOrderStatus =(value)=>{
        this.setState({order_status:value});
    }
    //订单渠道
    onChangeChannel =(value)=>{
        this.setState({channel:value});
    }
    //终端号
    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    }
    //etc卡号
    onChangeEtcCardNo = (e) => {
        this.setState({etc_card_no: e.target.value});
    }

    onChangeCollapse = () => {
        // const {pagination} = this.props.orderStore;
        // if (this.state.collapsed){
        //     pagination.pageSize = page_num;
        // } else {
        //     pagination.pageSize = page_num-6;
        // }
        // this.props.orderStore.setPagination({pagination});
        this.setState({collapsed: !this.state.collapsed});
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_date;
        // console .log("ss",startValue.valueOf(),endValue.valueOf())
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
        // console .log("ee",endValue.valueOf())
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        // if (value){
        //     console .log("ss",value.valueOf())
        // }
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('start_date', value);
        this.setState({
            start_date: value,
            start_export: value,
        });
    }


    onEndChange = (value) => {
        this.onChange('end_date', value);
        this.setState({
            end_date: value,
            end_export: value,

        });
    }

    handleStartOpenChange = (open) => {
        // if (!open) {
        //     this.setState({endOpen: true});
        // }
    }

    handleEndOpenChange = (open) => {
        // this.setState({endOpen: open});
    }
    //查询
    onReach = () => {
        const {terminal_id, partner_id, user_id, order_no, card_id, out_user_id, out_order_no} = this.state;
        if (!isEmpty(terminal_id)) {
            if (isSpecialChart(terminal_id) || terminal_id.length > 20) {
                Modal.error({
                    title: '终端编号输入错误',
                    content: '请输入正确的终端编号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(partner_id)) {
            if (isSpecialChart(partner_id) || partner_id.length !== 9) {
                Modal.error({
                    title: '合作方ID输入错误',
                    content: '请输入正确的合作方ID(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(user_id)) {
            if (isSpecialChart(user_id) || user_id.length !== 19) {
                Modal.error({
                    title: '用户号输入错误',
                    content: '请输入正确的用户号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(order_no)) {
            if (isSpecialChart(order_no) || order_no.length > 30) {
                Modal.error({
                    title: '消费订单号输入错误',
                    content: '请输入正确的消费订单号(不包含特殊字符)',
                });
                return
            }
        }

        if (!isEmpty(card_id)) {
            if (isSpecialChart(card_id) || card_id.length > 20) {
                Modal.error({
                    title: '加油卡卡号输入错误',
                    content: '请输入正确的加油卡卡号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(out_user_id)) {
            if (isSpecialChart(out_user_id) || out_user_id.length > 50) {
                Modal.error({
                    title: '第三方用户号输入错误',
                    content: '请输入正确的第三方用户号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(out_order_no)) {
            if (isSpecialChart(out_order_no) || out_order_no.length > 50) {
                Modal.error({
                    title: '第三方订单号输入错误',
                    content: '请输入正确的第三方订单号(不包含特殊字符)',
                });
                return
            }
        }
        this.fetch();
    }
    //重置
    onReset = () => {
        this.setState({
            user_mobile:'',
            channel: 0,
            partner_id: "",
            user_id: "",
            order_no: "",
            card_id: "",
            out_user_id: "",
            out_order_no: "",
            terminal_id: "",
            oil_type: 2,//0-汽油；1-柴油 2-无
            start_date: null,
            end_date: null,
            endOpen: false,
            order_status:"",
            start_export: startTime,
            end_export: nowTime,
        });
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // //勾选导出
    // onExportSome = () => {
    //     this.props.orderStore.getExportSomeData(this.state.selectedRowKeys);
    // }
    //文件下载
    onExportDownload = () => {
        this.props.orderStore.getConsumeFlowDownloadUrl();

    }
    //全部导出
    onExportAll = () => {
        const {start_export,end_export,etc_card_no,channel,user_mobile,start_date, end_date, partner_id,  order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status} = this.state;
        //
        // if (start_date != null){
        //     this.setState({
        //         start_export:start_date
        //     })
        // }
        // if (end_date != null){
        //     this.setState({
        //         end_export:end_date
        //     })
        // }
        // const differ = getDifferDate(start_export,end_export);
        // if (differ < 32) {
        //     this.props.orderStore.getExportAllData(etc_card_no,channel,user_mobile,start_export,end_export, partner_id, order_no, card_id, out_user_id, out_order_no, oil_type, terminal_id,order_status);
        // } else {
        //     message.error("最多可导出31天的数据");
        // }
        this.props.orderStore.setIsShowExportDialog(true);

    }

    header=()=>{
        const {isShowButtonLoading,orderList} = this.props.orderStore;
        const {selectedRowKeys} = this.state;
        return<div className="order-export-container-box">
            <div className="order-export-container">
                {/*<Button type="primary"*/}
                        {/*className="export-button"*/}
                        {/*loading={isShowButtonLoading}*/}
                        {/*onClick={this.onExportAll }*/}
                        {/*disabled={!orderList.length}*/}
                        {/*style={{width: 100, marginRight: 10}}>全部导出</Button>*/}
                {/*<Button type="primary" style={{width: 100}}*/}
                        {/*onClick={this.onExportSome}*/}
                        {/*disabled={selectedRowKeys.length === 0 ? true : false}>勾选导出</Button>*/}
                <Button type="primary"
                        className="export-button"
                        loading={isShowButtonLoading}
                        onClick={this.onExportAll }
                        disabled={!orderList.length}
                        style={{width: 100, marginRight: 10}}>导出</Button>
                <Button type="primary"
                        className="export-button"
                        // loading={isShowButtonLoading}
                        onClick={this.onExportDownload }
                        disabled={!orderList.length}
                        style={{width: 100, marginRight: 10}}>文件下载</Button>
                <div className="order-export-label-text">注：壳牌显示为红色(总金额=应付金额，折扣金额=信联折扣)</div>
            </div>
            <div className="order-export-text">（导出：由于数据量较大，请先去生成导出文件，然后去"文件下载"下载生成的文件。） </div>
            {/*<div className="order-export-text">（全部导出：默认导出最近7天，最大可导出31天的数据） </div>*/}
        </div>

    }

    render() {
        const {isShowExportResultDialog,isShowExportDialog,isShowOrderLoading, orderList, isShowOrderDialog, isShowOrderChildrenDialog, pagination,partnerList} = this.props.orderStore;
        const {etc_card_no,channel,user_mobile,partner_id,selectedRowKeys, order_status,terminal_id, collapsed, start_date, end_date, order_no, card_id, out_user_id, out_order_no, oil_type, endOpen} = this.state;
        orderStore = this.props.orderStore;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="order-container">
                <div className="order-search-container" ref={node => this.search_container = node}>
                    <div className="order-collapsed">
                        <div className="order-search-open">
                            <div className="order-search-first">
                                <div className="order-input-special">
                                    <div className="order-input-hint">订单渠道:</div>
                                    <Select
                                        size="small"
                                        value={channel}
                                        style={{width: 150}}
                                        onChange={this.onChangeChannel}>
                                        <Select.Option value={0}>企业加油</Select.Option>
                                        <Select.Option value={1}>e-高速</Select.Option>
                                        <Select.Option value={2}>微信会员卡</Select.Option>
                                        <Select.Option value={3}>ETC加油</Select.Option>
                                        <Select.Option value={4}>小程序二维码</Select.Option>
                                        <Select.Option value={5}>聚合码</Select.Option>
                                        <Select.Option value={7}>ETC无感</Select.Option>
                                        <Select.Option value={8}>一键加油</Select.Option>
                                        <Select.Option value={9}>支付宝</Select.Option>
                                    </Select>
                                </div>
                                {/*<div className="order-input-container">*/}
                                    {/*<div>手机号:</div>*/}
                                    {/*<Input size="small"*/}
                                           {/*value={user_mobile}*/}
                                           {/*maxLength={9}*/}
                                           {/*style={{width: 150, margin: 0}}*/}
                                           {/*onChange={this.onChangeUserMobile}/>*/}
                                {/*</div>*/}
                                <div className="order-input-container">
                                    <div>加油卡卡号:</div>
                                    <Input size="small"
                                           value={card_id}
                                           style={{width: 150, margin: 0}}
                                           maxLength={20}
                                           onChange={this.onChangeCardId}/>
                                </div>
                                <div className="order-input-container">
                                    <div>消费订单号:</div>
                                    <Input size="small"
                                           value={order_no}
                                           style={{width: 150, margin: 0}}
                                           maxLength={30}
                                           onChange={this.onChangeOrderNo}/>
                                </div>
                            </div>
                            <div className="order-search-first">
                                <div className="order-input-special">
                                    <div className="order-input-hint">订单状态:</div>
                                    <Select
                                        size="small"
                                        value={order_status}
                                        style={{width: 150}}
                                        onChange={this.onChangeOrderStatus}>
                                        <Select.Option value="">无</Select.Option>
                                        <Select.Option value="00">订单创建</Select.Option>
                                        <Select.Option value="01">支付成功</Select.Option>
                                        <Select.Option value="02">支付失败</Select.Option>
                                        <Select.Option value="03">消费成功</Select.Option>
                                        <Select.Option value="04">消费失败</Select.Option>
                                        <Select.Option value="05">订单取消</Select.Option>
                                        <Select.Option value="06">冲正成功</Select.Option>
                                        <Select.Option value="07">冲正失败</Select.Option>
                                        <Select.Option value="08">撤销失败</Select.Option>
                                        <Select.Option value="09">订单退款</Select.Option>
                                    </Select>
                                </div>
                                <div className="order-input-container">
                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;开始日期:</div>
                                    <DatePicker
                                        size="small"
                                        disabledDate={this.disabledStartDate}
                                        format="YYYY-MM-DD"
                                        value={start_date}
                                        placeholder="开始日期"
                                        onChange={this.onStartChange}
                                        className="order-data-picker"/>
                                </div>
                                <div className="order-input-container">
                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;结束日期:</div>
                                    <DatePicker
                                        size="small"
                                        disabledDate={this.disabledEndDate}
                                        format="YYYY-MM-DD"
                                        value={end_date}
                                        placeholder="结束日期"
                                        onChange={this.onEndChange}
                                        className="order-data-picker"/>
                                </div>
                                <div onClick={this.onChangeCollapse} className="order-more">
                                    <a>更多</a>
                                    <Icon type={collapsed ? "up" : "down"} style={{marginRight: 5}}/>
                                </div>
                            </div>
                        </div>
                        <div className="order-search-open" style={{display: collapsed ? "flex" : "none"}}>
                            <div className="order-search-first" style={{visibility: channel!==0&&channel!==3 ? "visible" : "hidden",width: channel!==0&&channel!==3 ? "100%" : "0",height: channel!==0&&channel!==3 ? "100%" : "0"}}>
                                <div className="order-input-container">
                                    <div>终端编号:</div>
                                    <Input size="small"
                                           value={terminal_id}
                                           style={{width: 150, margin: 0}}
                                           maxLength={20}
                                           onChange={this.onChangeTerminalId}/>
                                </div>
                                <div className="order-input-container">
                                    <div>ETC卡号:</div>
                                    <Input size="small"
                                           value={etc_card_no}
                                           style={{width: 150, margin: 0}}
                                           maxLength={50}
                                           onChange={this.onChangeEtcCardNo}/>
                                </div>
                            </div>
                        </div>

                        <div className="order-search-open" style={{display: collapsed ? "none" : "flex"}} >
                            <div className="order-search-first" style={{visibility: channel===0 ? "visible" : "hidden",width: channel===0 ? "100%" : "0",height: channel===0 ? "100%" : "0"}}>
                                <div className="order-input-container">
                                    <div>终端编号:</div>
                                    <Input size="small"
                                           value={terminal_id}
                                           style={{width: 150, margin: 0}}
                                           maxLength={20}
                                           onChange={this.onChangeTerminalId}/>
                                </div>
                                <div className="order-input-special">
                                    <div className="order-input-hint">合作方:</div>
                                    <Select
                                        size="small"
                                        defaultValue={partner_id}
                                        value={partner_id}
                                        style={{width: 150}}
                                        onChange={this.onChangeBrandId}>
                                        {this.selectBrandOption()}
                                    </Select>
                                </div>
                                <div className="order-input-container">
                                    <div>第三方订单号:</div>
                                    <Input size="small"
                                           value={out_order_no}
                                           style={{width: 150, margin: 0}}
                                           maxLength={50}
                                           onChange={this.onChangeOutOrderNo}/>
                                </div>
                            </div>
                            {/*<div className="order-search-first" style={{visibility: channel==0 ? "visible" : "hidden",width: channel===0 ? "100%" : "0",height: channel===0 ? "100%" : "0"}}>*/}

                            <div className="order-search-first" style={{visibility: channel===3 ? "visible" : "hidden",width: channel===3 ? "100%" : "0",height: channel===3 ? "100%" : "0"}}>
                                {/*<div className="order-input-special">*/}
                                {/*<div className="order-input-hint">油品类型:*/}
                                {/*</div>*/}
                                {/*<Select*/}
                                {/*size="small"*/}
                                {/*value={oil_type}*/}
                                {/*style={{width: 150}}*/}
                                {/*onChange={this.onChangeOilType}>*/}
                                {/*<Select.Option value={0}>汽油</Select.Option>*/}
                                {/*<Select.Option value={1}>柴油</Select.Option>*/}
                                {/*<Select.Option value={2}>无</Select.Option>*/}
                                {/*</Select>*/}
                                {/*</div>*/}
                                <div className="order-input-container">
                                    <div>终端编号:</div>
                                    <Input size="small"
                                           value={terminal_id}
                                           style={{width: 150, margin: 0}}
                                           maxLength={20}
                                           onChange={this.onChangeTerminalId}/>
                                </div>

                                <div className="order-input-container">
                                    <div>ETC卡号:</div>
                                    <Input size="small"
                                           value={etc_card_no}
                                           style={{width: 150, margin: 0}}
                                           maxLength={50}
                                           onChange={this.onChangeEtcCardNo}/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="order-btn-container">
                        <Button type="primary"
                                size="small"
                                disabled={isShowOrderLoading ? true : false}
                                style={{marginBottom: 5, width: 80}}
                                onClick={this.onReach}>查询</Button>
                        <Button type="primary"
                                size="small"
                                style={{width: 80}}
                                onClick={this.onReset}>重置</Button>
                    </div>
                </div>
                <div className="order-table-container">
                    <Table
                        className="order-table"
                        bordered
                        size="small"
                        // columns={columns}
                        columns={localStorage.getItem('partner_id')==='null'?columns:columns2}
                        loading={isShowOrderLoading}
                        dataSource={orderList}
                        scroll={{x: '120%'}}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        // rowSelection={rowSelection}
                        rowClassName={(record, index) => record.model_flag ===2?'row-class':''}
                        title={this.header}/>
                </div>
                {isShowOrderDialog ? <OrderDialog/> : null}
                {isShowOrderChildrenDialog ? <OrderChildrenDialog/> : null}
                {isShowExportDialog ? <ExportDialog/> : null}
                {isShowExportResultDialog ? <ExportResultDialog/> : null}
            </div>
        );
    }
}

export default Order;

//一键加油
// const columns = [
//     {
//         title: '消费订单号',
//         dataIndex: 'order_no',
//         key: 'order_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },{
//         title: '订单状态',
//         dataIndex: 'order_status',
//         key: 'order_status',
//         align: 'center',
//         render: (record) => {
//             //00-订单创建，01-支付成功, 02-支付失败， 03-消费成功，04-消费失败，05-订单取消，06-冲正成功，07-冲正失败
//             let orderStatus = "";
//             if (record === "00") {
//                 orderStatus = "订单创建";
//             } else if (record === "01") {
//                 orderStatus = "支付成功";
//             }else if (record === "02") {
//                 orderStatus = "支付失败";
//             }else if (record === "03") {
//                 orderStatus = "消费成功";
//             } else if (record === "04") {
//                 orderStatus = "消费失败";
//             } else if (record === "05") {
//                 orderStatus = "订单取消";
//             }else if (record === "06") {
//                 orderStatus = "冲正成功";
//             }else if (record === "07") {
//                 orderStatus = "冲正失败";
//             }else if (record === "08") {
//                 orderStatus = "撤销失败";
//             }else if (record === "09") {
//                 orderStatus = "订单退款";
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{orderStatus}</p>);
//         },
//     },
//     {
//         title: '支付方式',
//         dataIndex: 'order_payment',
//         key: 'order_payment',
//         align: 'center',
//         render: (record) => {
//             //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付 07-微信车主，08-建行龙支付
//             let payWay = "";
//             if (record === "01") {
//                 payWay = "余额支付";
//             } else if (record === "02") {
//                 payWay = "银联支付";
//             } else if (record === "03") {
//                 payWay = "支付宝支付";
//             } else if (record === "04") {
//                 payWay = "微信支付";
//             } else if (record === "05") {
//                 payWay = "合作方支付";
//             }else if (record === "07") {
//                 payWay = "微信车主";
//             }else if (record === "08") {
//                 payWay = "建行龙支付";
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{payWay}</p>);
//         },
//     },
//     {
//         title: '消费时间',
//         dataIndex: 'consume_time',
//         key: 'consume_time',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '总金额',
//         dataIndex: 'total_amount',
//         key: 'total_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 45,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '折扣金额',
//         dataIndex: 'discount_amount',
//         key: 'discount_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '实际金额',
//         dataIndex: 'actual_amount',
//         key: 'actual_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品类型',
//         dataIndex: 'oil_type',
//         key: 'oil_type',
//         align: 'center',
//         render: (record) => {
//             let oilType = "";
//             if (record === '0') {
//                 oilType = "汽油";
//             } else if (record === '1') {
//                 oilType = "柴油";
//             }else {
//                 oilType = "--"
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{oilType}</p>);
//         },
//     },
//     {
//         title: '油品单价',
//         dataIndex: 'oil_price',
//         key: 'oil_price',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品数量',
//         dataIndex: 'oil_num',
//         key: 'oil_num',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品详情',
//         dataIndex: 'oil_detail',
//         key: 'oil_detail',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '终端编号',
//         dataIndex: 'terminal_id',
//         key: 'terminal_id',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '商户名称',
//         dataIndex: 'terminal_name',
//         key: 'terminal_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '卡号',
//         dataIndex: 'card_id',
//         key: 'card_id',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 30,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '用户手机号',
//         dataIndex: 'user_mobile',
//         key: 'user_mobile',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '用户名',
//         dataIndex: 'user_name',
//         key: 'user_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 45,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '合作方名称',
//         dataIndex: 'partner_name',
//         key: 'partner_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '第三方订单号',
//         dataIndex: 'out_order_no',
//         key: 'out_order_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 90,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },{
//         title: 'ETC卡号',
//         dataIndex: 'etc_card_no',
//         key: 'etc_card_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 90,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     // {
//     //     title: '子流水单',
//     //     key: 'children',
//     //     fixed: 'right',
//     //     align: 'center',
//     //     render: (record) => {
//     //         return (<div
//     //             style={{
//     //                 minWidth: 80,
//     //                 display: 'flex',
//     //                 flexDirection: 'row',
//     //                 alignItems: 'center',
//     //                 justifyContent: 'center',
//     //                 fontSize: 12
//     //             }}
//     //             onClick={
//     //                 () => {
//     //                     if (record.sub_bill_array){
//     //                         orderStore.setIsShowOrderChildrenDialog(true);
//     //                         orderStore.setOrderChildrenObject(record);
//     //                     }else {
//     //                         message.info("无子流水单");
//     //                     }
//     //                 }}>
//     //             <a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>子流水单</a></div>);
//     //     },
//     // },
//     {
//         title: '打印小票',
//         key: 'ticket',
//         fixed: 'right',
//         align: 'center',
//         render: (record) => {
//             return (<div style={{
//                 minWidth: 50,
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: 12
//             }}
//             >
//                 <Popconfirm
//                     title="确定要申请打印小票吗？" okText="确定" cancelText="取消"
//                     onConfirm={() => {
//                         orderStore.billFixPrintTicket(record.order_no)
//                     }}>
//                     <a><Icon type="form" style={{marginRight: 2}}/>打印</a>
//                 </Popconfirm>
//             </div>);
//         },
//     },
//     {
//         title: '操作',
//         key: 'operation',
//         fixed: 'right',
//         align: 'center',
//         render: (record) => {
//             return (<div
//                 style={{
//                     minWidth: 50,
//                     display: 'flex',
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: 12
//                 }}
//                 onClick={() => {
//                     orderStore.setIsShowOrderDialog(true);
//                     orderStore.setOrderChildrenObject(record);
//                 }}><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
//         },
//     },
// ];
// const columns2 = [
//     {
//         title: '消费订单号',
//         dataIndex: 'order_no',
//         key: 'order_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },{
//         title: '订单状态',
//         dataIndex: 'order_status',
//         key: 'order_status',
//         align: 'center',
//         render: (record) => {
//             //00-订单创建，01-支付成功, 02-支付失败， 03-消费成功，04-消费失败，05-订单取消，06-冲正成功，07-冲正失败
//             let orderStatus = "";
//             if (record === "00") {
//                 orderStatus = "订单创建";
//             } else if (record === "01") {
//                 orderStatus = "支付成功";
//             }else if (record === "02") {
//                 orderStatus = "支付失败";
//             }else if (record === "03") {
//                 orderStatus = "消费成功";
//             } else if (record === "04") {
//                 orderStatus = "消费失败";
//             } else if (record === "05") {
//                 orderStatus = "订单取消";
//             }else if (record === "06") {
//                 orderStatus = "冲正成功";
//             }else if (record === "07") {
//                 orderStatus = "冲正失败";
//             }else if (record === "08") {
//                 orderStatus = "撤销失败";
//             }else if (record === "09") {
//                 orderStatus = "订单退款";
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{orderStatus}</p>);
//         },
//     },
//     {
//         title: '订单渠道',
//         dataIndex: 'channel',
//         key: 'channel',
//         align: 'center',
//         render: (record) => {
//             //0-企业加油 1-e高速 2-微信会员卡 3-ETC加油 4-小程序二维码 5-聚合码 7-ETC无感 8-一键加油
//             let orderStatus = "";
//             if (record === "0") {
//                 orderStatus = "企业加油";
//             } else if (record === "1") {
//                 orderStatus = "e高速";
//             }else if (record === "2") {
//                 orderStatus = "微信会员卡";
//             }else if (record === "3") {
//                 orderStatus = "ETC加油";
//             } else if (record === "4") {
//                 orderStatus = "小程序二维码";
//             } else if (record === "5") {
//                 orderStatus = "聚合码";
//             }else if (record === "6") {
//                 orderStatus = "ETC无感";
//             }else if (record === "7") {
//                 orderStatus = "ETC无感";
//             }else if (record === "8") {
//                 orderStatus = "一键加油";
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{orderStatus}</p>);
//         },
//     },
//     {
//         title: '支付方式',
//         dataIndex: 'order_payment',
//         key: 'order_payment',
//         align: 'center',
//         render: (record) => {
//             //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付 07-微信车主，08-建行龙支付
//             let payWay = "";
//             if (record === "01") {
//                 payWay = "余额支付";
//             } else if (record === "02") {
//                 payWay = "银联支付";
//             } else if (record === "03") {
//                 payWay = "支付宝支付";
//             } else if (record === "04") {
//                 payWay = "微信支付";
//             } else if (record === "05") {
//                 payWay = "合作方支付";
//             }else if (record === "07") {
//                 payWay = "微信车主";
//             }else if (record === "08") {
//                 payWay = "建行龙支付";
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{payWay}</p>);
//         },
//     },
//     {
//         title: '消费时间',
//         dataIndex: 'consume_time',
//         key: 'consume_time',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '总金额',
//         dataIndex: 'total_amount',
//         key: 'total_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 45,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '折扣金额',
//         dataIndex: 'discount_amount',
//         key: 'discount_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '实际金额',
//         dataIndex: 'actual_amount',
//         key: 'actual_amount',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品类型',
//         dataIndex: 'oil_type',
//         key: 'oil_type',
//         align: 'center',
//         render: (record) => {
//             let oilType = "";
//             if (record === '0') {
//                 oilType = "汽油";
//             } else if (record === '1') {
//                 oilType = "柴油";
//             }else {
//                 oilType = "--"
//             }
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{oilType}</p>);
//         },
//     },
//     {
//         title: '油品单价',
//         dataIndex: 'oil_price',
//         key: 'oil_price',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品数量',
//         dataIndex: 'oil_num',
//         key: 'oil_num',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '油品详情',
//         dataIndex: 'oil_detail',
//         key: 'oil_detail',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '终端编号',
//         dataIndex: 'terminal_id',
//         key: 'terminal_id',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '商户名称',
//         dataIndex: 'terminal_name',
//         key: 'terminal_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 60,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '卡号',
//         dataIndex: 'card_id',
//         key: 'card_id',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 30,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '用户手机号',
//         dataIndex: 'user_mobile',
//         key: 'user_mobile',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '用户名',
//         dataIndex: 'user_name',
//         key: 'user_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 45,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '合作方名称',
//         dataIndex: 'partner_name',
//         key: 'partner_name',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 75,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '第三方订单号',
//         dataIndex: 'out_order_no',
//         key: 'out_order_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 90,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },{
//         title: 'ETC卡号',
//         dataIndex: 'etc_card_no',
//         key: 'etc_card_no',
//         align: 'center',
//         render: (record) => {
//             return (<p style={{
//                 minWidth: 90,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//                 padding: 0,
//                 margin: 0
//             }}>{record}</p>);
//         },
//     },
//     {
//         title: '操作',
//         key: 'operation',
//         fixed: 'right',
//         align: 'center',
//         render: (record) => {
//             return (<div
//                 style={{
//                     minWidth: 50,
//                     display: 'flex',
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: 12
//                 }}
//                 onClick={() => {
//                     orderStore.setIsShowOrderDialog(true);
//                     orderStore.setOrderChildrenObject(record);
//                 }}><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
//         },
//     },
// ];

// 一键加油之后上线
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
    },{
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
        align: 'center',
        render: (record) => {
            //00-订单创建，01-支付成功, 02-支付失败， 03-消费成功，04-消费失败，05-订单取消，06-冲正成功，07-冲正失败
            let orderStatus = "";
            if (record === "00") {
                orderStatus = "订单创建";
            } else if (record === "01") {
                orderStatus = "支付成功";
            }else if (record === "02") {
                orderStatus = "支付失败";
            }else if (record === "03") {
                orderStatus = "消费成功";
            } else if (record === "04") {
                orderStatus = "消费失败";
            } else if (record === "05") {
                orderStatus = "订单取消";
            }else if (record === "06") {
                orderStatus = "冲正成功";
            }else if (record === "07") {
                orderStatus = "冲正失败";
            }else if (record === "08") {
                orderStatus = "撤销失败";
            }else if (record === "09") {
                orderStatus = "订单退款";
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{orderStatus}</p>);
        },
    },
    {
        title: '支付方式',
        dataIndex: 'order_payment',
        key: 'order_payment',
        align: 'center',
        render: (record) => {
            //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付 07-微信车主，08-建行龙支付
            let payWay = "";
            if (record === "01") {
                payWay = "余额支付";
            } else if (record === "02") {
                payWay = "银联支付";
            } else if (record === "03") {
                payWay = "支付宝支付";
            } else if (record === "04") {
                payWay = "微信支付";
            } else if (record === "05") {
                payWay = "合作方支付";
            }else if (record === "07") {
                payWay = "微信车主";
            }else if (record === "08") {
                payWay = "建行龙支付";
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{payWay}</p>);
        },
    },
    {
        title: '消费时间',
        dataIndex: 'consume_time',
        key: 'consume_time',
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
        title: '总金额',
        dataIndex: 'total_amount',
        key: 'total_amount',
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
        title: '折扣',
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
        title: '第三方折扣',
        dataIndex: 'partner_discount',
        key: 'partner_discount',
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
        title: '实付',
        dataIndex: 'actual_amount',
        key: 'actual_amount',
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
        title: '油品',
        dataIndex: 'oil_type',
        key: 'oil_type',
        align: 'center',
        render: (record) => {
            let oilType = "";
            if (record === '0') {
                oilType = "汽油";
            } else if (record === '1') {
                oilType = "柴油";
            }else {
                oilType = "--"
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
        title: '单价',
        dataIndex: 'oil_price',
        key: 'oil_price',
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
        title: '数量',
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
        title: '终端编号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
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
        title: '商户名称',
        dataIndex: 'terminal_name',
        key: 'terminal_name',
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
        title: '卡号',
        dataIndex: 'card_id',
        key: 'card_id',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '用户手机号',
        dataIndex: 'user_mobile',
        key: 'user_mobile',
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
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
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
        title: '合作方名称',
        dataIndex: 'partner_name',
        key: 'partner_name',
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
        title: '第三方订单号',
        dataIndex: 'out_order_no',
        key: 'out_order_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },{
        title: 'ETC卡号',
        dataIndex: 'etc_card_no',
        key: 'etc_card_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    // {
    //     title: '子流水单',
    //     key: 'children',
    //     fixed: 'right',
    //     align: 'center',
    //     render: (record) => {
    //         return (<div
    //             style={{
    //                 minWidth: 80,
    //                 display: 'flex',
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 fontSize: 12
    //             }}
    //             onClick={
    //                 () => {
    //                     if (record.sub_bill_array){
    //                         orderStore.setIsShowOrderChildrenDialog(true);
    //                         orderStore.setOrderChildrenObject(record);
    //                     }else {
    //                         message.info("无子流水单");
    //                     }
    //                 }}>
    //             <a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>子流水单</a></div>);
    //     },
    // },
    {
        title: '打印小票',
        key: 'ticket',
        fixed: 'right',
        align: 'center',
        render: (record) => {
            return (<div style={{
                minWidth: 50,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
            }}
            >
                <Popconfirm
                    title="确定要申请打印小票吗？" okText="确定" cancelText="取消"
                    onConfirm={() => {
                        orderStore.billFixPrintTicket(record.order_no)
                    }}>
                    <a><Icon type="form" style={{marginRight: 2}}/>打印</a>
                </Popconfirm>
            </div>);
        },
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 50,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                }}
                onClick={() => {
                    orderStore.setIsShowOrderDialog(true);
                    orderStore.setOrderChildrenObject(record);
                }}><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
        },
    },
];
const columns2 = [
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
    },{
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
        align: 'center',
        render: (record) => {
            //00-订单创建，01-支付成功, 02-支付失败， 03-消费成功，04-消费失败，05-订单取消，06-冲正成功，07-冲正失败
            let orderStatus = "";
            if (record === "00") {
                orderStatus = "订单创建";
            } else if (record === "01") {
                orderStatus = "支付成功";
            }else if (record === "02") {
                orderStatus = "支付失败";
            }else if (record === "03") {
                orderStatus = "消费成功";
            } else if (record === "04") {
                orderStatus = "消费失败";
            } else if (record === "05") {
                orderStatus = "订单取消";
            }else if (record === "06") {
                orderStatus = "冲正成功";
            }else if (record === "07") {
                orderStatus = "冲正失败";
            }else if (record === "08") {
                orderStatus = "撤销失败";
            }else if (record === "09") {
                orderStatus = "订单退款";
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{orderStatus}</p>);
        },
    },
    {
        title: '支付方式',
        dataIndex: 'order_payment',
        key: 'order_payment',
        align: 'center',
        render: (record) => {
            //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付 07-微信车主，08-建行龙支付
            let payWay = "";
            if (record === "01") {
                payWay = "余额支付";
            } else if (record === "02") {
                payWay = "银联支付";
            } else if (record === "03") {
                payWay = "支付宝支付";
            } else if (record === "04") {
                payWay = "微信支付";
            } else if (record === "05") {
                payWay = "合作方支付";
            }else if (record === "07") {
                payWay = "微信车主";
            }else if (record === "08") {
                payWay = "建行龙支付";
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{payWay}</p>);
        },
    },
    {
        title: '消费时间',
        dataIndex: 'consume_time',
        key: 'consume_time',
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
        title: '总金额',
        dataIndex: 'total_amount',
        key: 'total_amount',
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
        title: '折扣',
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
        title: '第三方折扣',
        dataIndex: 'partner_discount)',
        key: 'partner_discount)',
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
        title: '实付',
        dataIndex: 'actual_amount',
        key: 'actual_amount',
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
        title: '油品',
        dataIndex: 'oil_type',
        key: 'oil_type',
        align: 'center',
        render: (record) => {
            let oilType = "";
            if (record === '0') {
                oilType = "汽油";
            } else if (record === '1') {
                oilType = "柴油";
            }else {
                oilType = "--"
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
        title: '单价',
        dataIndex: 'oil_price',
        key: 'oil_price',
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
        title: '数量',
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
        title: '终端编号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
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
        title: '商户名称',
        dataIndex: 'terminal_name',
        key: 'terminal_name',
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
        title: '卡号',
        dataIndex: 'card_id',
        key: 'card_id',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '用户手机号',
        dataIndex: 'user_mobile',
        key: 'user_mobile',
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
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
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
        title: '合作方名称',
        dataIndex: 'partner_name',
        key: 'partner_name',
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
        title: '第三方订单号',
        dataIndex: 'out_order_no',
        key: 'out_order_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },{
        title: 'ETC卡号',
        dataIndex: 'etc_card_no',
        key: 'etc_card_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
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
        fixed: 'right',
        align: 'center',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 50,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                }}
                onClick={() => {
                    orderStore.setIsShowOrderDialog(true);
                    orderStore.setOrderChildrenObject(record);
                }}><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
        },
    },
];
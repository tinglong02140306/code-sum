import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal,DatePicker,message} from 'antd';
import './BillPartner.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import PartnerStationDialog from "../component/PartnerStationDialog";
import {trim} from "../../../utils/trim";
import {formatData} from "../../../utils/formatDate";

let store = null;
@inject("BillPartnerStore")
@observer
class BillPartner extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            partner_id:'',
            out_order_no:'',
            card_id:'',
            start_time: null,
            end_time: null,
            endOpen: false,
            isShowModal: false,
            out_user_id: '',
        }
    }
    componentDidMount() {
        //首次进入不主动触发查询，由用户手动触发
        store= this.props.BillPartnerStore;
        // const {page_num,page_size,partner_id,start_time,end_time,card_id,out_order_no} = this.state;
        // store.setPageNum(page_num);
        // const {searchData} = store;
        // const params = {
        //     page_num:page_num,
        //     page_size:page_size,
        //     station_id: isEmpty(searchData)?null:searchData.id,
        //     partner_id:isEmpty(partner_id)?null:trim(partner_id),
        //     out_order_no:isEmpty(out_order_no)?null:trim(out_order_no),
        //     card_id:isEmpty(card_id)?null:trim(card_id),
        //     start_time:isEmpty(start_time)?null:formatData(start_time),
        //     end_time:isEmpty(end_time)?null:formatData(end_time),
        // }
        // this.props.BillPartnerStore.getOrderPartnerQuery(params);
    }

    componentWillUnmount() {
        if (this.props.BillPartnerStore.searchData){
            this.props.BillPartnerStore.setSearchData(null);
        }
    }

    onSearchClick = () => {
        const {page_num,page_size,partner_id,start_time,end_time,card_id,out_order_no} = this.state;
        store= this.props.BillPartnerStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            partner_id:isEmpty(partner_id)?null:trim(partner_id),
            out_order_no:isEmpty(out_order_no)?null:trim(out_order_no),
            card_id:isEmpty(card_id)?null:trim(card_id),
            start_time:isEmpty(start_time)?null:formatData(start_time),
            end_time:isEmpty(end_time)?null:formatData(end_time),
        }
        if (searchData||partner_id||out_order_no||card_id||start_time||end_time){
            this.props.BillPartnerStore.getOrderPartnerQuery(params);
        }else {
            message.error("请添加查询条件~");
        }
    }

    onResetClick = () => {
        this.props.BillPartnerStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_id: '',
            partner_id:'',
            out_order_no:'',
            card_id:'',
            start_time: null,
            end_time: null,
            endOpen: false,
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,partner_id,start_time,end_time,card_id,out_order_no} = this.state;
        const {searchData} = store;
        const pager = {...this.props.BillPartnerStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        store.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            partner_id:isEmpty(partner_id)?null:trim(partner_id),
            out_order_no:isEmpty(out_order_no)?null:trim(out_order_no),
            card_id:isEmpty(card_id)?null:trim(card_id),
            start_time:isEmpty(start_time)?null:formatData(start_time),
            end_time:isEmpty(end_time)?null:formatData(end_time),
        }
        this.props.BillPartnerStore.getOrderPartnerQuery(params);
    };

    onChangeName = (e) => {
        this.props.BillPartnerStore.setTypeModal(3);
        this.props.BillPartnerStore.setIsShowSearchDialog(true);
    };

    onChangeCardId = (e) => {
        this.setState({card_id: e.target.value});
    };

    onChangeOutOrderNo = (e) => {
        this.setState({out_order_no: e.target.value});
    };

    onChangePartnerId = (e) => {
        this.setState({partner_id: e.target.value});
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
        if (this.props.BillPartnerStore.searchData){
            this.props.BillPartnerStore.setSearchData(null);
        }
        this.props.BillPartnerStore.setIsShowDialog(true);
        this.props.BillPartnerStore.setTypeModal(0)
    };

    onChangeUserId = (e) => {
        this.setState({out_user_id: e.target.value});
    };

    // //补单输入
    // showFixModal = () =>{
    //     console.log('sss')
    //     this.setState({isShowModal: true});
    // };

    cancelFixModal = () =>{
        this.props.BillPartnerStore.setIsCanPreview(false);
        this.setState({
            out_user_id: '',
        });
    };

    //确定补单
    toBillFixPartner = () =>{
        const {recodeObject} = this.props.BillPartnerStore;

        this.props.BillPartnerStore.billFixPartner(recodeObject.order_no,'1',this.state.out_user_id,() => {
            this.props.BillPartnerStore.setIsCanPreview(false);
            this.setState({
                out_user_id: '',
            });
        })
    };

    render() {
        const {partner_id,start_time,end_time,card_id,out_order_no,isShowModal,out_user_id} = this.state;
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,searchData,isCanPreview} = this.props.BillPartnerStore;
        store = this.props.BillPartnerStore;
        return (
            <div className="station-terminal-container">
                <div className="station-terminal-top-container">
                    <div className="station-terminal-top-form">
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="加油站名称" className="station-terminal-form-item">
                                <Input size="small"
                                       type="button"
                                       value={searchData?searchData.name:""}
                                       style={{width: 200, marginTop: 9,alignItems:"left"}}
                                       onClick={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="合作方ID" className="station-terminal-form-item">
                                <Input size="small"
                                       value={partner_id}
                                       style={{width: 150, margin: 0}}
                                       onChange={this.onChangePartnerId}/>
                            </Form.Item>
                            <Form.Item label="第三方订单号" className="station-terminal-form-item">
                                <Input size="small"
                                       value={out_order_no}
                                       style={{width: 150, margin: 0}}
                                       onChange={this.onChangeOutOrderNo}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="station-terminal-button" onClick={this.onSearchClick}>查询</Button>
                        </Form>
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="加油卡卡号" className="station-terminal-form-item">
                                <Input size="small"
                                       value={card_id}
                                       style={{width: 200, margin: 0}}
                                       onChange={this.onChangeCardId}/>
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
                <Modal
                    title="补单"
                    okText="确认"
                    width={500}
                    okType="primary"
                    cancelText="取消"
                    onCancel={this.cancelFixModal}
                    onOk={this.toBillFixPartner}
                    visible={isCanPreview}
                >
                    <div>
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="第三方用户编号" className="station-terminal-form-item" required={true}>
                                <Input size="small"
                                       value={out_user_id}
                                       placeholder='请输入第三方用户编号'
                                       style={{width: 200, margin: 0}}
                                       onChange={this.onChangeUserId}/>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                {isShowSearchDialog?<PartnerStationDialog/>:null}
            </div>

        );
    }
}

export default BillPartner;

const columns = [
    {
        title: '消费订单号',
        dataIndex: 'order_no',
        key: 'order_no',
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
    },{
        title: '卡号',
        dataIndex: 'card_id',
        key: 'card_id',
        align: 'center',
    },{
        title: '合作方ID',
        dataIndex: 'partner_id',
        key: 'partner_id',
        align: 'center',
    },{
        title: '合作方名称',
        dataIndex: 'partner_name',
        key: 'partner_name',
        align: 'center',
    },{
        title: '第三方订单号',
        dataIndex: 'out_order_no',
        key: 'out_order_no',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return <div style={optionStyle.container}>
                {/*<Popconfirm*/}
                {/*    title="确定要退款吗？" okText="是的" cancelText="取消"*/}
                {/*    onConfirm={() => {*/}
                {/*        store.billFixPartner(record.order_no,'0')*/}
                {/*    }}>*/}
                {/*    <div style={optionStyle.item}>*/}
                {/*        <Icon type="minus-circle" style={{color: "#ff5501"}}/>*/}
                {/*        <p style={optionStyle.delete}>退款</p>*/}
                {/*    </div>*/}
                {/*</Popconfirm>*/}
                {/*<Popconfirm*/}
                {/*    title="确定要补单吗？" okText="是的" cancelText="取消"*/}
                {/*    onConfirm={() => {*/}
                {/*        store.billFixPartner(record.order_no,'1')*/}
                {/*    }}*/}
                {/*    >*/}
                {/*    <div style={optionStyle.item}>*/}
                {/*        <Icon type="form" style={{color: "#1890ff"}}/>*/}
                {/*        <p style={optionStyle.update}>补单</p>*/}
                {/*    </div>*/}
                {/*</Popconfirm>*/}
                <div style={optionStyle.item} onClick={() => {
                    store.setRecodeObject(record);
                    store.setIsCanPreview(true)}}>
                    <Icon type="form" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>补单</p>
                </div>
            </div>
        }
    }];

const optionStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
import React from 'react';
import {Modal, Table} from 'antd';
import "./OrderChildrenDialog";
import {observer, inject} from 'mobx-react';

@inject("orderStore")
@observer
class OrderChildrenDialog extends React.Component {

    render() {
        const {isShowOrderChildrenDialog, orderChildrenObject} = this.props.orderStore;
        let dataSource = [];
        dataSource.push(orderChildrenObject);
        let dataChildrenSource = [];
        dataChildrenSource = orderChildrenObject.sub_bill_array;
        return (<div>
            <Modal
                title="子流水单"
                width={1000}
                okText="确定"
                cancelText="取消"
                onOk={() => {
                    this.props.orderStore.setIsShowOrderChildrenDialog(false)
                }}
                onCancel={() => {
                    this.props.orderStore.setIsShowOrderChildrenDialog(false)
                }}
                visible={isShowOrderChildrenDialog}>

                <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{color:"#000000",fontWeight:'bold',fontSize:14,marginBottom:5,marginLeft:5}}>父流水表:</div>
                    <Table
                        bordered
                        size="small"
                        columns={columns}
                        style={{width: 900}}
                        scroll={{x: 2480}}
                        dataSource={dataSource}
                        pagination={false}/>
                    <div style={{display:dataChildrenSource.length===0?'none':'block',marginTop:20}}>
                        <div style={{color:"#000000",fontWeight:'bold',fontSize:14,marginBottom:5,marginLeft:5}}>子流水表:</div>
                        {dataChildrenSource.length === 0 ? null :
                            <Table
                                bordered
                                size="small"
                                columns={columnsChildren}
                                style={{width: 900}}
                                scroll={{x: 1200}}
                                dataSource={dataChildrenSource}
                                pagination={false}>
                            </Table>}
                    </div>

                </div>


            </Modal>
        </div>)
    }
}

export default OrderChildrenDialog;

const columnsChildren = [
    {
        title: '子订单号',
        dataIndex: 'sub_order_no',
        fixed: 'left',
        render: (record) => {
            return (<p style={{
                width: 260,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '机构号',
        dataIndex: 'org_id',
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '子卡号',
        dataIndex: 'sub_card_id',
        render: (record) => {
            return (<p style={{
                width: 200,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '子订单金额',
        dataIndex: 'sub_actual_amount',
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '第三方子订单号',
        dataIndex: 'out_sub_order_no',
        render: (record) => {
            return (<p style={{
                width: 260,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '子订单创建时间',
        dataIndex: 'sub_create_time',
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }
];

const columns = [
    {
        title: '消费订单号',
        dataIndex: 'order_no',
        key: 'order_no',
        fixed: 'left',
        render: (record) => {
            return (<p style={{
                width: 240,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '合作方ID',
        dataIndex: 'partner_id',
        key: 'partner_id',
        render: (record) => {
            return (<p style={{
                width: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '用户号',
        dataIndex: 'user_id',
        key: 'user_id',
        render: (record) => {
            return (<p style={{
                width: 160,
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
        render: (record) => {
            return (<p style={{
                width: 160,
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
        render: (record) => {
            return (<p style={{
                width: 120,
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
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '身份证号',
        dataIndex: 'user_cert_id',
        key: 'user_cert_id',
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '第三方用户号',
        dataIndex: 'out_user_id',
        key: 'out_user_id',
        render: (record) => {
            return (<p style={{
                width: 160,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '车牌号',
        dataIndex: 'user_plate_no',
        key: 'user_plate_no',
        render: (record) => {
            return (<p style={{
                width: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '车牌颜色',
        dataIndex: 'user_plate_color',
        key: 'user_plate_color',
        render: (record) => {
            return (<p style={{
                width: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '消费时间',
        dataIndex: 'consume_time',
        key: 'consume_time',
        render: (record) => {
            return (<p style={{
                width: 160,
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
        render: (record) => {
            return (<p style={{
                width: 200,
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
        dataIndex: 'order_status',
        key: 'order_status',
        render: (record) => {
            //00-订单创建，03-消费成功，04-消费失败，05-订单取消
            let orderStatus = "";
            if (record === "00") {
                orderStatus = "订单创建";
            } else if (record === "03") {
                orderStatus = "消费成功";
            } else if (record === "04") {
                orderStatus = "消费失败";
            } else if (record === "05") {
                orderStatus = "订单取消";
            }
            return (<p style={{
                width: 80,
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
        render: (record) => {
            //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付
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
            }
            return (<p style={{
                width: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{payWay}</p>);
        },
    },
    {
        title: '总金额',
        dataIndex: 'total_amount',
        key: 'total_amount',
        render: (record) => {
            return (<p style={{
                width: 80,
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
        dataIndex: 'discount_amount',
        key: 'discount_amount',
        render: (record) => {
            return (<p style={{
                width: 80,
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
        dataIndex: 'actual_amount',
        key: 'actual_amount',
        render: (record) => {
            return (<p style={{
                width: 80,
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
        dataIndex: 'oil_type',
        key: 'oil_type',
        render: (record) => {
            let oilType = "";
            if (record === "0") {
                oilType = "汽油";
            } else {
                oilType = "柴油"
            }
            return (<p style={{
                width: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{oilType}</p>);
        },
    },
    {
        title: '油品单价',
        dataIndex: 'oil_price',
        key: 'oil_price',
        render: (record) => {
            return (<p style={{
                width: 80,
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
        render: (record) => {
            return (<p style={{
                width: 80,
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
        render: (record) => {
            return (<p style={{
                width: 100,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }
];
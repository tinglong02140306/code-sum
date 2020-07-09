import React from 'react';
import {Modal, Table} from 'antd';
import "./ChildrenOrderDialog.scss";
import {observer, inject} from 'mobx-react';

@inject("childStore")
@observer
class ChildrenOrderDialog extends React.Component {

    render() {
        const {isShowOrderDialog, childrenOrderItem} = this.props.childStore;
        let dataSource = [];
        dataSource.push(childrenOrderItem);
        // let dataChildrenSource = [];
        // dataChildrenSource = orderChildrenObject.sub_bill_array;
        return (<div>
            <Modal
                title="父流水单"
                width={1000}
                okText="确定"
                cancelText="取消"
                onOk={() => {
                    this.props.childStore.setIsShowOrderDialog(false)
                }}
                onCancel={() => {
                    this.props.childStore.setIsShowOrderDialog(false)
                }}
                visible={isShowOrderDialog}>
                <div className="children-order-dialog-container">
                    <div>
                        <div style={{color:"#000000",fontWeight:'bold',fontSize:14,marginBottom:5,marginLeft:5}}>子流水表:</div>
                        <Table
                            bordered
                            size="small"
                            columns={childrenColumns}
                            style={{width: 900}}
                            scroll={{x: 900, marginBottom:50}}
                            dataSource={dataSource}
                            pagination={false}/>
                    </div>
                    <div>
                        <div style={{color:"#000000",fontWeight:'bold',fontSize:14,marginBottom:5,marginLeft:5}}>父流水表:</div>
                        <Table
                            bordered
                            size="small"
                            columns={orderColumns}
                            style={{width: 900}}
                            scroll={{x: 960}}
                            dataSource={dataSource}
                            pagination={false}>
                        </Table>
                    </div>


                </div>


            </Modal>
        </div>)
    }
}

export default ChildrenOrderDialog;

const childrenColumns = [
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
                width: 150,
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
                width: 100,
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
                width: 300,
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
                width: 150,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    }
];

const orderColumns = [
    {
        title: '消费订单号',
        dataIndex: 'parent_order_no',
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
        title: '合作方ID',
        dataIndex: 'partner_id',
        render: (record) => {
            return (<p style={{
                width: 150,
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
        render: (record) => {
            return (<p style={{
                width: 150,
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
        render: (record) => {
            return (<p style={{
                width: 150,
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
        render: (record) => {
            //00-订单创建，03-消费成功，04-消费失败，05-订单取消
            let orderStatus = "";
            if (record==="00"){
                orderStatus = "订单创建";
            } else if (record==="03"){
                orderStatus="消费成功";
            } else if (record==="04"){
                orderStatus="消费失败";
            } else if (record==="05"){
                orderStatus="订单取消";
            }
            return (<p style={{
                width: 100,
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
        render: (record) => {
            //01-余额，02-银联支付，03-支付宝支付，04-微信支付，05-合作方支付
            let payWay = "";
            if (record==="01"){
                payWay = "余额支付";
            } else if (record==="02"){
                payWay="银联支付";
            } else if (record==="03"){
                payWay="支付宝支付";
            }else if (record==="04"){
                payWay="微信支付";
            }else if (record==="05"){
                payWay="合作方支付";
            }
            return (<p style={{
                width: 100,
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
        width: 100,
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
    },
    {
        title: '折扣金额',
        dataIndex: 'discount_amount',
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
    },
    {
        title: '实际金额',
        dataIndex: 'actual_amount',
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
    },
    {
        title: '油品类型',
        dataIndex: 'oil_type',
        render: (record) => {
            let oilType = "";
            if (record==="0"){
                oilType="汽油";
            } else {
                oilType="柴油"
            }
            return (<p style={{
                width: 100,
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
    },
    {
        title: '油品数量',
        dataIndex: 'oil_num',
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
    },
    {
        title: '油品详情',
        dataIndex: 'oil_detail',
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
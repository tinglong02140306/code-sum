import React from 'react';
import {Modal, Table,Button,Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("invoiceStore")
@observer
class LeadResultDialog extends React.Component {

    onCancel =()=>{
        this.props.invoiceStore.setIsShowLeadResultDialog(false);
    }

    render() {
        const {isShowLeadResultDialog,leadResult} = this.props.invoiceStore;
        console.log(leadResult.markArray);
        return (<Modal
            title="数据插入结果"
            width={1000}
            visible={isShowLeadResultDialog}
            onCancel={this.onCancel}
            footer={[<Button type="primary" key="back"
                        onClick={this.onCancel}>确定</Button>]}>
            <div style={{display:'flex',flexDirection:'column'}}>
                <div>
                    <div style={{fontSize:14,fontWeight:'bold',marginBottom:5,color:'#000000'}}>总共提交<span style={{color:"#000000"}}>{leadResult.amount}</span>条数据，其中<span style={{color:'#1bb158'}}>{leadResult.success_count}</span>条提交成功，<span style={{color:'#ff2128'}}>{leadResult.failed_count}</span>条提交失败</div>
                </div>
                <div style={{display:leadResult.failed_count==="0" ?'none':'block'}}>
                    <div style={{fontSize:15,fontWeight:'bold',marginBottom:10,color:'#000000'}}>提交失败列表</div>
                    <Table
                        scroll={{x: 2240}}
                        bordered
                        size="small"
                        style={{width: 900, backgroundColor: "#fff", fontSize: 10, margin: 0, padding: 0}}
                        columns={columns}
                        dataSource={leadResult.markArray}
                        pagination={false}/>
                </div>

            </div>
        </Modal>);
    }
}

export default LeadResultDialog;


const columns = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
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
}, {
    title: '机构号',
    dataIndex: 'org_id',
    key: 'org_id',
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
}, {
    title: '公司名称',
    dataIndex: 'org_name',
    key: 'org_name',
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
},{
    title: '公司税号',
    dataIndex: 'org_tax_no',
    key: 'org_tax_no',
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
}, {
    title: '公司地址',
    dataIndex: 'org_address',
    key: 'org_address',
    render: (record) => {
        return (
            <div>
                <Tooltip placement="bottom" title={record}>
                    <p style={{
                        width: 200,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p>
                </Tooltip>
            </div>);
    },
}, {
    title: '公司联系方式',
    dataIndex: 'org_mobile',
    key: 'org_mobile',
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
}, {
    title: '开户行名称',
    dataIndex: 'org_bank_name',
    key: 'org_bank_name',
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
}, {
    title: '开户行号',
    dataIndex: 'org_bank_account_id',
    key: 'org_bank_account_id',
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
}, {
    title: '货物名称',
    dataIndex: 'oil_name',
    key: 'oil_name',
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
}, {
    title: '计量单位',
    dataIndex: 'oil_unit',
    key: 'oil_unit',
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
}, {
    title: '数量',
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
}, {
    title: '单价',
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
}, {
    title: '金额',
    dataIndex: 'amt',
    key: 'amt',
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
}, {
    title: '税率',
    dataIndex: 'fax_rat',
    key: 'fax_rat',
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
}, {
    title: '创建时间',
    dataIndex: 'gmt_create',
    key: 'gmt_create',
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
}, {
    title: '标记号',
    dataIndex: 'pre_invoice_mark_no',
    key: 'pre_invoice_mark_no',
    fixed: 'right',
    render: (record) => {
        return (<p style={{
            width: 180,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}, {
    title: '发票号',
    dataIndex: 'invoice_no',
    key: 'invoice_no',
    fixed: 'right',
    render: (record) => {
        return (<p style={{
            width: 180,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}];
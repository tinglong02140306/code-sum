import React from 'react';
import "./Partner.scss";
import {inject, observer} from 'mobx-react';
import {Table, Button, Icon, Tooltip,Popconfirm} from 'antd';
import PartnerOperate from "../../../component/partner/PartnerOperate";
import PartnerDialog from "../../../component/partner/PartnerDialog";
import AddRiskAmountDialog from "../../../component/partner/AddRiskAmountDialog";

let partnerStore = {};
let store = null;

@inject("partner")
@observer
class Partner extends React.Component {

    componentDidMount() {
        store = this.props.partner;
        this.props.partner.setPageSize(18);
        this.fetch();
    }


    handleTableChange = (pagination) => {
        const pager = {... this.props.partner.pagination};
        pager.current = pagination.current;
        this.props.partner.setPagination(pager);
        this.props.partner.getDataList(pager.current);
    }

    header = ()=>{
        return  <div className="partner-add-container">
                    <Button type="primary"
                        onClick={() => {
                        this.props.partner.showPartnerItem({});
                        this.props.partner.changeDialogVisible(3, true);
                    }}>合作方信息录入</Button>
                </div>
    }

    fetch = () => {
        this.props.partner.getDataList(1);
    }


    render() {
        partnerStore = this.props.partner;
        return (<div className="partner-container">
           <Table
                className="partner-table"
                columns={columns}
                title={this.header}
                dataSource={this.props.partner.dataList}
                pagination={ this.props.partner.pagination}
                loading={ this.props.partner.isShowLoading}
                onChange={this.handleTableChange}
                bordered
                scroll={{x: '120%'}}
                size="small"/>
            { this.props.partner.isDialogVisible ? <PartnerDialog/> : null}
            { this.props.partner.isShowRiskDialog ? <AddRiskAmountDialog/> : null}
        </div>);
    }
}

export default Partner;


const columns = [{
    title: '合作方ID',
    dataIndex: 'partner_id',
    fixed: 'left',
    key: 'partner_id',
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
}, {
    title: '名称',
    dataIndex: 'partner_name',
    key: 'partner_name',
    align: 'center',
    render: (record) => {
        return (
            <Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    maxWidth: 200,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}>{record}</p>
            </Tooltip>);
    },
},{
    title: '昵称',
    dataIndex: 'nick_name',
    key: 'nick_name',
    align: 'center',
    render: (record) => {
        return (
            <Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    maxWidth: 200,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}>{record}</p>
            </Tooltip>);
    },
}, {
    title: '类型',
    dataIndex: 'partner_type',
    key: 'partner_type',
    align: 'center',
    render: (record) => {
        let mode = "";
        if (record === "0") {
            mode = "油企";
        } else if (record === "1") {
            mode = "无车承运人";
        }else if(record==="2"){
            mode = "导流平台";
        }else{
            mode = "--";
        }
        return (<p style={{
            minWidth: 30,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{mode}</p>);
    },
}, {
    title: '法人',
    dataIndex: 'partner_legal_entity',
    key: 'partner_legal_entity',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}><p style={{
            minWidth: 30,
            maxWidth: 120,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p></Tooltip>);
    },
}, {
    title: '电话',
    dataIndex: 'partner_mobile',
    key: 'partner_mobile',
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
},{
    title: '税号',
    dataIndex: 'partner_tax_no',
    key: 'partner_tax_no',
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
}, {
    title: '单笔限制金额',
    dataIndex: 'single_consume_limit',
    key: 'single_consume_limit',
    align: 'center',
    render: (record) => {
        return (<p style={{
            minWidth: 90,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{parseFloat(record).toFixed(2)}</p>);
    },
}, {
    title: '风控金额',
    dataIndex: 'risk_amount',
    key: 'risk_amount',
    align: 'center',
    render: (record) => {
        return (<p style={{
            minWidth: 90,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{parseFloat(record).toFixed(2)}</p>);
    },
},{
    title: '风控历史总额',
    dataIndex: 'risk_amount_limit',
    key: 'risk_amount_limit',
    align: 'center',
    render: (record) => {
        return (<p style={{
            minWidth: 90,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{parseFloat(record).toFixed(2)}</p>);
    },
},{
    title: '风控预警比列',
    dataIndex: 'risk_amount_warn_scale',
    key: 'risk_amount_warn_scale',
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
}, {
    title: '风控金额使用量',
    dataIndex: 'risk_amount_used',
    key: 'risk_amount_used',
    align: 'center',
    render: (record) => {
        return (<p style={{
            minWidth: 105,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{parseFloat(record).toFixed(2)}</p>);
    },
},
    {
    title: '剩余风控金额',
    key: 'risk_amount_no_used',
    align: 'center',
    render: (record) => {
        return (<p style={{
            minWidth: 90,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{(record.risk_amount_limit - record.risk_amount_used).toFixed(2)}</p>);
    },
},
    {
    title: '模式',
    dataIndex: 'partner_mode',
    key: 'partner_mode',
    align: 'center',
    render: (record) => {
        let mode = "";
        if (record === 1) {
            mode = "拆单";
        } else {
            mode = "不拆单";
        }
        return (<p style={{
            minWidth: 30,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{mode}</p>);
    },
}, {
    title: '油品',
    dataIndex: 'oil_limit',
    key: 'oil_limit',
    align: 'center',
    render: (record) => {
        let oil = "";
        if (record === 1) {
            oil = "汽油";
        } else if (record === 2) {
            oil = "柴油";
        } else {
            oil = "汽油柴油";
        }
        return (<p style={{
            minWidth: 30,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{oil}</p>);
    },
}, {
    title: '是否允许撤销',
    dataIndex: 'allow_consume_cancel',
    key: 'allow_consume_cancel',
    align: 'center',
    render: (record) => {
        let mode = "";
        if (record === "false") {
            mode = "不允许";
        } else {
            mode = "允许";
        }
        return (<p style={{
            minWidth: 90,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{mode}</p>);
    },
},{
    title: '联系人姓名',
    dataIndex: 'partner_link_name',
    key: 'partner_link_name',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}><p style={{
            minWidth: 75,
            maxWidth: 120,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p></Tooltip>);
    },
}, {
    title: '联系人手机',
    dataIndex: 'partner_link_mobile',
    key: 'partner_link_mobile',
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
}, {
    title: '地址',
    dataIndex: 'partner_address',
    key: 'partner_address',
    align: 'center',
    render: (record) => {
        return (
            <Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    maxWidth: 300,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{record}</p></Tooltip>);
    },
}, {
    title: '恢复风控金额',
    fixed: 'right',
    align: 'center',
    render: (record) => {
        return (<div style={{display:'flex',flexDirection:'row',minWidth:90,fontSize:12}}
                     // onClick={() => {
                     //     partnerStore.setIsShowRiskDialog(true);
                     //     partnerStore.showPartnerItem(record);
                     // }}
        >
            <Popconfirm
                title="确定恢复风控金额吗？" okText="确定" cancelText="取消"
                onConfirm={() => {
                    store.getResetRiskAmount(record.partner_id)
                }}>
                <a><Icon type="eye-o" style={{marginRight: 2}}/>恢复风控金额</a>
            </Popconfirm>
        </div>);
    },
},{
    title: '操作',
    fixed: 'right',
    align: 'center',
    render: (record) => {
        return (<PartnerOperate record={record}/>);
    },
}
];

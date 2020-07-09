import React from 'react';
import "./Organization.scss";
import {Button, Input, Icon, Select, Table, Modal, Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';
import OrganizationOperate from "../../../component/organization/OrganizationOperate";
import OrganizationDialog from "../../../component/organization/OrganizationDialog";
import {isEmpty} from "../../../utils/isEmpty";
import {isPhoneRight} from "../../../utils/mobile";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {isRightTax} from "../../../utils/isRightTax";
import OrganizationCheckDialog from "../../../component/organization/OrganizationCheckDialog";

@inject("organization")
@observer
class Organization extends React.Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            width: 0,
            partner_id: "",
            invoice_type_str: "全部",
            org_name: "",
            org_legal_entity: "",
            org_mobile: "",
            org_link_name: "",
            org_link_mobile: "",
            org_tax_no: "",
            invoice_type: "",
            org_id: "",
            collapsed: true
        };
    }

    componentDidMount() {
        this.props.organization.getPartnerList();
        this.props.organization.setPageSize(16);
        this.fetch();
    }

    fetch = () => {
        const {org_id, partner_id, invoice_type, org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no} = this.state;
        this.props.organization.getOrganizationList(1, org_id, partner_id, invoice_type,
            org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no);
    }

    //查询
    onSearch = () => {
        const {org_id, partner_id, org_name, org_legal_entity, org_link_name, org_mobile, org_tax_no, org_link_mobile} = this.state;
        if (!isEmpty(org_id)) {
            if (isSpecialChart(org_id) || org_id.length !== 15) {
                Modal.error({
                    title: '机构方ID输入错误',
                    content: '请输入正确的机构方ID(不包含特殊字符)',
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
        if (!isEmpty(org_name)) {
            if (isSpecialChart(org_name)) {
                Modal.error({
                    title: '机构方名称输入错误',
                    content: '请输入正确的机构方名称(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(org_legal_entity)) {
            if (isSpecialChart(org_legal_entity)) {
                Modal.error({
                    title: '法人输入错误',
                    content: '请输入正确的法人(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(org_link_name)) {
            if (isSpecialChart(org_link_name)) {
                Modal.error({
                    title: '联系人名称输入错误',
                    content: '请输入正确的联系人名称(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(org_tax_no)) {
            if (!isRightTax(org_tax_no)) {
                Modal.error({
                    title: '税号输入错误',
                    content: '请输入正确的税号(不包含特殊字符)',
                });
            }
        }
        if (!isEmpty(org_mobile)) {
            if (!isPhoneRight(org_mobile)) {
                Modal.error({
                    title: '电话输入错误',
                    content: '请输入正确的电话',
                });
                return
            }
        }
        if (!isEmpty(org_link_mobile)) {
            if (!isPhoneRight(org_link_mobile)) {
                Modal.error({
                    title: '联系电话输入错误',
                    content: '请输入正确的联系电话',
                });
                return
            }
        }
        this.fetch();
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.organization.pagination};
        pager.current = pagination.current;
        this.props.organization.setPagination(pagination);
        const {org_id, partner_id, invoice_type, org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no} = this.state;
        this.props.organization.getOrganizationList(pager.current, org_id, partner_id, invoice_type,
            org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no);
    }

    //重置
    resetSearch = () => {
        this.setState({
            partner_id: "",
            invoice_type_str: "全部",
            org_name: "",
            org_legal_entity: "",
            org_mobile: "",
            org_link_name: "",
            org_link_mobile: "",
            org_tax_no: "",
            invoice_type: null,
            org_id: ""
        })
    }

    onChangeOrgId = (e) => {
        this.setState({org_id: e.target.value});
    }
    onChangePartnerId = (e) => {
        this.setState({partner_id: e.target.value});
    }

    onChangeOrgName = (e) => {
        this.setState({org_name: e.target.value});
    }

    onChangeLegalEntity = (e) => {
        this.setState({org_legal_entity: e.target.value});
    }

    onChangeOrgMobile = (e) => {
        this.setState({org_mobile: e.target.value});
    }

    onChangeLinkName = (e) => {
        this.setState({org_link_name: e.target.value});
    }

    onChangeLinkMobile = (e) => {
        this.setState({org_link_mobile: e.target.value});
    }

    onChangeTax = (e) => {
        this.setState({org_tax_no: e.target.value});
    }

    onChangeInvoiceType = (value) => {
        this.setState({invoice_type_str: value});
        if (value === "no") {
            this.setState({invoice_type: 0});
        } else if (value === "special") {
            this.setState({invoice_type: 1});
        } else if (value === "common") {
            this.setState({invoice_type: 2});
        } else {
            this.setState({invoice_type: null});
        }
    }

    onChangeCollapse = () => {
        this.setState({collapsed: !this.state.collapsed});
    }

    header=()=>{
        return  <div className="organization-table-btn">
            <Button type="primary"
                onClick={() => {
                    this.props.organization.setOrganizationObject({});
                    this.props.organization.setIsShowDialog(true, 2)
                }}>机构方信息录入</Button>
        </div>
    }

    render() {
        const {collapsed, org_id, partner_id, invoice_type_str, org_name, org_legal_entity, org_mobile, org_link_name, org_link_mobile, org_tax_no} = this.state;
        const {organizationList, pagination, isShowLoading} = this.props.organization;
        return (<div className="organization-container">
            <div className="organization-search-container-dev">
                <div className="organization-search">
                    <div className="organization-search-container">
                        <div className="organization-search-item-container">
                            <div className="organization-search-item">
                                <div>合&nbsp;作&nbsp;方&nbsp;ID:</div>
                                <Input
                                    size="small"
                                    value={partner_id}
                                    maxLength={9}
                                    onChange={this.onChangePartnerId}/>
                            </div>
                            <div className="organization-search-item">
                                <div>机&nbsp;构&nbsp;方&nbsp;ID&nbsp;:</div>
                                <Input
                                    size="small"
                                    value={org_id}
                                    maxLength={15}
                                    onChange={this.onChangeOrgId}
                                />
                            </div>
                            <div className="organization-search-left-select-item">
                                <span className="organization-select-span">发票类型:</span>
                                <Select
                                    size="small"
                                    style={{width: 80}}
                                    value={invoice_type_str}
                                    onChange={this.onChangeInvoiceType}>
                                    <Select.Option value="all">全部</Select.Option>
                                    <Select.Option value="no">不开票</Select.Option>
                                    <Select.Option value="special">专票</Select.Option>
                                    <Select.Option value="common">普票</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="organization-search-item-container">
                            <div className="organization-search-item">
                                <div>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人&nbsp;:</div>
                                <Input
                                    size="small"
                                    maxLength={50}
                                    value={org_legal_entity}
                                    onChange={this.onChangeLegalEntity}/>
                            </div>
                            <div className="organization-search-item">
                                <div>税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;:</div>
                                <Input
                                    size="small"
                                    value={org_tax_no}
                                    maxLength={20}
                                    onChange={this.onChangeTax}/>
                            </div>
                            <div onClick={this.onChangeCollapse} className="organization-more">
                                <a>更多</a>
                                <Icon type={collapsed ? "down" : "up"} style={{marginRight: 5}}/>
                            </div>
                        </div>
                        <div style={{display: collapsed ? "none" : "block"}}>
                            <div className="organization-search-item-container">
                                <div className="organization-search-item">
                                    <div>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称&nbsp;:</div>
                                    <Input
                                        size="small"
                                        onChange={this.onChangeOrgName}
                                        value={org_name}
                                        maxLength={100}/>
                                </div>
                                <div className="organization-search-item">
                                    <div>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话&nbsp;:</div>
                                    <Input
                                        size="small"
                                        value={org_mobile}
                                        maxLength={15}
                                        onChange={this.onChangeOrgMobile}/>
                                </div>
                            </div>
                        </div>
                        <div style={{display: collapsed ? "none" : "block"}}>
                            <div className="organization-search-item-container">
                                <div className="organization-search-item">
                                    <div>联系人名称:</div>
                                    <Input
                                        size="small"
                                        maxLength={50}
                                        value={org_link_name}
                                        onChange={this.onChangeLinkName}/>
                                </div>
                                <div className="organization-search-item">
                                    <div>联系人电话:</div>
                                    <Input
                                        size="small"
                                        maxLength={15}
                                        value={org_link_mobile}
                                        onChange={this.onChangeLinkMobile}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="organization-search-right">
                        <Button type="primary" size="small" style={{margin: 2, fontSize: 14, width: 80}}
                                onClick={this.onSearch}
                                disabled={isShowLoading ? true : false}>查询</Button>
                        <Button type="primary" size="small" style={{margin: 2, fontSize: 14, width: 80}}
                                onClick={this.resetSearch}>重置</Button>
                    </div>
                </div>
            </div>
            <div className="organization-table-container">
                <Table
                    className="organization-table"
                    columns={columns}
                    dataSource={organizationList}
                    pagination={pagination}
                    loading={isShowLoading}
                    onChange={this.handleTableChange}
                    bordered
                    title={this.header}
                    scroll={{x: '120%'}}
                    size="small"/>
            </div>
            {this.props.organization.isShowDialog ? <OrganizationDialog/> : null}
            {this.props.organization.isShowCheckDialog ? <OrganizationCheckDialog/> : null}
        </div>);
    }
}

export default Organization;


const columns = [{
    title: '合作方ID',
    dataIndex: 'partner_id',
    fixed: 'left',
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
    title: '机构ID',
    dataIndex: 'org_id',
    fixed: 'left',
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
    dataIndex: 'org_name',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}><p style={{
            minWidth: 30,
            maxWidth: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p></Tooltip>);
    },
}, {
    title: '法人',
    dataIndex: 'org_legal_entity',
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
    title: '税号',
    dataIndex: 'org_tax_no',
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
    title: '电话',
    dataIndex: 'org_mobile',
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
    title: '开户行名称',
    dataIndex: 'org_bank_name',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}><p style={{
            minWidth: 75,
            maxWidth: 160,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p></Tooltip>);
    },
}, {
    title: '开户账号',
    dataIndex: 'org_bank_account_id',
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
    title: '发票类型',
    dataIndex: 'invoice_type',
    align: 'center',
    render: (record) => {
        //0-不开票；1-专票；2-普票
        let status = "";
        if (record === 0) {
            status = "不开票";
        } else if (record === 1) {
            status = "专票";
        } else if (record === 2) {
            status = "普票";
        }
        return (<p style={{
            minWidth: 60,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{status}</p>);
    },
}, {
    title: '发票限额',
    dataIndex: 'invoice_amtlmt',
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
    title: '联系人姓名',
    dataIndex: 'org_link_name',
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
    dataIndex: 'org_link_mobile',
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
    dataIndex: 'org_address',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}><p style={{
            minWidth: 30,
            maxWidth: 300,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p></Tooltip>);
    },
}, {
    title: '审核状态',
    dataIndex: 'audit_status',
    align: 'center',
    render: (record) => {
        let status = "";
        if (record === 1) {
            status = "已提交审核";
        } else if (record === 3) {
            status = "审核失败";
        } else if (record === 5) {
            status = "审核成功";
        }
        return (<p style={{
            minWidth: 60,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{status}</p>);
    },
}, {
    title: '操作',
    fixed: 'right',
    align: 'center',
    render: (record) => {
        return (<OrganizationOperate record={record}/>);
    },
}];

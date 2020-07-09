import React from 'react';
import {Table, Button, Input, Select, Icon, Tooltip, DatePicker} from 'antd';
import {inject, observer} from 'mobx-react';
import "./Invoice.scss";
import LeadDialog from "../../../component/invoice/LeadDialog";
import InvoiceDialog from "../../../component/invoice/InvoiceDialog";
import LeadResultDialog from "../../../component/invoice/LeadResultDialog";
import {isEmpty} from '../../../utils/isEmpty';
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {Modal} from "antd/lib/index";

let page_size = 16;
let invoiceStore = {};

@inject("invoiceStore")
@observer
class Invoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            invoice_no: "",
            org_id: "",
            pre_invoice_mark_no: "",
            org_tax_no: "",
            printed: "no",
            selectedRowKeys: [],
            start_date: null,
            end_date: null,
            endOpen: false,
        }
    }

    componentDidMount() {
        this.props.invoiceStore.setPageSize(16);
        this.fetch();
    }

    
    fetch = () => {
        const {org_id, org_tax_no, printed, invoice_no, pre_invoice_mark_no, start_date, end_date} = this.state;
        this.props.invoiceStore.getInvoiceList(1, page_size, org_id, org_tax_no, printed, invoice_no, pre_invoice_mark_no, start_date, end_date);
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.invoiceStore.pagination};
        pager.current = pagination.current;
        this.props.invoiceStore.setPagination(pagination);
        const {org_id, org_tax_no, printed, invoice_no, pre_invoice_mark_no, start_date, end_date} = this.state;
        this.props.invoiceStore.getInvoiceList(pager.current, page_size, org_id, org_tax_no, printed, invoice_no, pre_invoice_mark_no, start_date, end_date);
    }

    onSearchInvoice = () => {
        const {invoice_no, org_id, pre_invoice_mark_no, org_tax_no} = this.state;
        if (!isEmpty(org_id)) {
            if (isSpecialChart(org_id) || org_id.length !== 15) {
                Modal.error({
                    title: '机构方ID输入错误',
                    content: '请输入正确的机构方ID(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(invoice_no)) {
            if (isSpecialChart(invoice_no) || invoice_no.length > 30) {
                Modal.error({
                    title: '发票号输入错误',
                    content: '请输入正确的发票号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(org_tax_no)) {
            if (isSpecialChart(org_tax_no) || org_tax_no.length > 20) {
                Modal.error({
                    title: '机构税号输入错误',
                    content: '请输入正确的机构税号(不包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(pre_invoice_mark_no)) {
            if (isSpecialChart(pre_invoice_mark_no) || pre_invoice_mark_no.length > 30) {
                Modal.error({
                    title: '标记号输入错误',
                    content: '请输入正确的标记号(不包含特殊字符)',
                });
                return
            }
        }
        this.fetch();
    }
    //重置
    onResetInvoice = () => {
        this.setState({
            invoice_no: "",
            org_id: "",
            pre_invoice_mark_no: "",
            org_tax_no: "",
            printed: "no",
            start_date: null,
            end_date: null,
            endOpen: false
        });
    }

    onChangeOrgId = (e) => {
        this.setState({org_id: e.target.value});
    }

    onChangeInvoiceNo = (e) => {
        this.setState({invoice_no: e.target.value});
    }

    onChangeInvoiceMark = (e) => {
        this.setState({pre_invoice_mark_no: e.target.value});
    }

    onChangeTaxNo = (e) => {
        this.setState({org_tax_no: e.target.value});
    }

    onChangePrinted = (value) => {
        this.setState({printed: value});
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
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
        this.onChange('start_date', value);
        this.setState({start_date: value});
    }


    onEndChange = (value) => {
        this.onChange('end_date', value);
        this.setState({end_date: value});
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    //勾选导出
    onExportSome = () => {
        this.props.invoiceStore.getExportSomeData(this.state.selectedRowKeys);
    }
    //全部导出
    onExportAll = () => {
        this.props.invoiceStore.getExportAllData();
    }

    //input
    handleChange = (e) => {
        const files = e.target.files;
        console.log(files);
        if (files && files[0]) this.props.invoiceStore.handleFile(files[0]);
    };
    //模板
    onHandleTemplet = () => {
        const templetData = [["序号", "机构号", "公司名称", "公司税号", "公司地址", "公司联系方式", "开户行名称", "开户行号", "货物名称", "计量单位", "数量", "单价", "金额", "税率", "创建时间", "标记号", "发票号"],
            [1, "901010001", "NERV", "12345678", "日本第三新东京市的地下", "13000000000", "SEELE", "123456", "汽97", "升", 800.333, 0.62, 1000, "16%", "2018-07-10 16:44:18", "STest000000001", "STest000000001"]];
        this.props.invoiceStore.exportFile(templetData);
    }

    header=()=>{
        const {selectedRowKeys} = this.state;
        const {invoiceList, isShowExportLoading} = this.props.invoiceStore;
        return <div className="invoice-export-container">
        <div className="invoice-btn-container">
            <Button type="primary"
                    loading={isShowExportLoading}
                    onClick={this.onExportAll}
                    disabled={!invoiceList.length}
                    style={{width: 100, marginRight: 10}}>全部导出</Button>
            <Button type="primary" style={{width: 100}}
                    onClick={this.onExportSome}
                    disabled={selectedRowKeys.length === 0 ? true : false}>勾选导出</Button>
        </div>
        <div className="invoice-btn-container">
            <Button type="primary" style={{width: 100}}
                    onClick={this.onHandleTemplet}>文件模板</Button>
            <div className="invoice-lead-container">
                <input type="file" accept={SheetJSFT}
                       className="invoice-lead"
                       value=""
                       onChange={this.handleChange}/>
                <div className="invoice-lead-title">导入文件</div>
            </div>
        </div>
    </div>
    }

    render() {
        const {invoice_no, org_id, pre_invoice_mark_no, org_tax_no, printed, selectedRowKeys, start_date, end_date, endOpen} = this.state;
        const {
            pagination, isShowInvoiceLoading, invoiceList,
            isShowLeadDialog, isShowInvoiceDialog, isShowLeadResultDialog
        } = this.props.invoiceStore;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        invoiceStore = this.props.invoiceStore;
        return (<div className="invoice-container">
            <div className="invoice-search-container" ref={node => this.search_container = node}>
                <div className="invoice-search-double">
                    <div className="invoice-input-item">
                        <div className="invoice-input-title">机构号:</div>
                        <Input
                            size="small"
                            value={org_id}
                            maxLength={15}
                            onChange={this.onChangeOrgId}/>
                    </div>
                    <div className="invoice-input-item">
                        <div className="invoice-input-title">发票号:</div>
                        <Input
                            size="small"
                            value={invoice_no}
                            maxLength={30}
                            onChange={this.onChangeInvoiceNo}/>
                    </div>
                </div>
                <div className="invoice-search-double">
                    <div className="invoice-input-item">
                        <div className="invoice-input-title">税&nbsp;&nbsp;&nbsp;号:</div>
                        <Input
                            size="small"
                            value={org_tax_no}
                            maxLength={20}
                            onChange={this.onChangeTaxNo}/>
                    </div>
                    <div className="invoice-input-item">
                        <div className="invoice-input-title">标记号:</div>
                        <Input
                            size="small"
                            value={pre_invoice_mark_no}
                            maxLength={30}
                            onChange={this.onChangeInvoiceMark}/>
                    </div>
                </div>
                <div className="invoice-search-double">
                    <div className="invoice-input-date-picker-item">
                        <div className="invoice-input-title">开始时间:</div>
                        <DatePicker
                            size="small"
                            style={{width: 110, margin: 0}}
                            disabledDate={this.disabledStartDate}
                            format="YYYY-MM-DD"
                            value={start_date}
                            placeholder="开始日期"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}/>
                    </div>
                    <div className="invoice-input-date-picker-item">
                        <div className="invoice-input-title">结束时间:</div>
                        <DatePicker
                            size="small"
                            style={{width: 110, margin: 0}}
                            disabledDate={this.disabledEndDate}
                            format="YYYY-MM-DD"
                            value={end_date}
                            placeholder="结束日期"
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}/>
                    </div>
                </div>
                <div className="invoice-search-double">
                    <div className="invoice-input-item">
                        <div className="invoice-input-title">打印:</div>
                        <Select
                            size="small"
                            value={printed}
                            style={{width: 80, margin: 0}}
                            onChange={this.onChangePrinted}>
                            <Select.Option value="true">已打印</Select.Option>
                            <Select.Option value="false">未打印</Select.Option>
                            <Select.Option value="no">无</Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="invoice-search-btn-container">
                    <Button size="small" type="primary"
                            onClick={this.onSearchInvoice}
                            style={{width: 80, marginBottom: 5, fontSize: 14}}>查询</Button>
                    <Button size="small" type="primary"
                            onClick={this.onResetInvoice}
                            style={{width: 80, fontSize: 14}}>重置</Button>
                </div>
            </div>
            <div className="table-container">
                <Table
                    className="invoice-table"
                    scroll={{x: '120%'}}
                    bordered
                    size="small"
                    title={this.header}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={invoiceList}
                    pagination={pagination}
                    loading={isShowInvoiceLoading}
                    onChange={this.handleTableChange}/>
            </div>
            {isShowLeadDialog ? <LeadDialog/> : null}
            {isShowInvoiceDialog ? <InvoiceDialog/> : null}
            {isShowLeadResultDialog ? <LeadResultDialog/> : null}
        </div>);
    }
}

export default Invoice;

const columns = [
// {
//     title: '序号',
//     dataIndex: 'id',
//     key: 'id',
//     fixed: 'left',
//     align: 'center',
//     render: (record) => {
//         return (<p style={{
//             minWidth: 30,
//             overflow: "hidden",
//             whiteSpace: "nowrap",
//             textOverflow: "ellipsis",
//             padding: 0,
//             margin: 0
//         }}>{record}</p>);
//     },
// }, 
{
    title: '机构号',
    dataIndex: 'org_id',
    key: 'org_id',
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
}, {
    title: '公司名称',
    dataIndex: 'org_name',
    key: 'org_name',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}>
            <p style={{
                minWidth: 60,
                maxWidth: 200,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p></Tooltip>);
    },
}, {
    title: '公司税号',
    dataIndex: 'org_tax_no',
    key: 'org_tax_no',
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
    title: '公司地址',
    dataIndex: 'org_address',
    key: 'org_address',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}>
            <p style={{
                minWidth: 60,
                maxWidth: 300,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p></Tooltip>);
    },
}, {
    title: '公司联系方式',
    dataIndex: 'org_mobile',
    key: 'org_mobile',
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
    title: '开户行名称',
    dataIndex: 'org_bank_name',
    key: 'org_bank_name',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}>
            <p style={{
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
    title: '开户行号',
    dataIndex: 'org_bank_account_id',
    key: 'org_bank_account_id',
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
    title: '货物名称',
    dataIndex: 'oil_name',
    key: 'oil_name',
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
    title: '计量单位',
    dataIndex: 'oil_unit',
    key: 'oil_unit',
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
    title: '数量',
    dataIndex: 'oil_num',
    key: 'oil_num',
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
    title: '单价',
    dataIndex: 'oil_price',
    key: 'oil_price',
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
    title: '金额',
    dataIndex: 'amt',
    key: 'amt',
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
    title: '税率',
    dataIndex: 'fax_rat',
    key: 'fax_rat',
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
    title: '创建时间',
    dataIndex: 'gmt_create',
    key: 'gmt_create',
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
    title: '标记号',
    dataIndex: 'pre_invoice_mark_no',
    key: 'pre_invoice_mark_no',
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
}, {
    title: '发票号',
    dataIndex: 'invoice_no',
    key: 'invoice_no',
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
}, {
    title: '操作',
    key: 'option',
    fixed: 'right',
    align: 'center',
    render: (record) => {
        return (<div
            style={{minWidth: 130, color: "#1890ff", display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div onClick={() => {
                invoiceStore.setIsShowInvoiceDialog(true, 1);
                invoiceStore.setInvoiceObject(record);
            }}>
                <Icon type="eye-o"/>
                <a style={{fontSize: 12, marginLeft: 2}}>查看</a>
            </div>
            <div style={{marginLeft: 5, display: isEmpty(record.invoice_no) ? "block" : "none"}} onClick={() => {
                invoiceStore.setIsShowInvoiceDialog(true, 2);
                invoiceStore.setInvoiceObject(record);
            }}>
                <Icon type="form"/>
                <a style={{fontSize: 12, marginLeft: 2}}>添加发票号</a>
            </div>
        </div>);
    },
},
];

const SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) {
    return "." + x;
}).join(",");
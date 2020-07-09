import React from 'react';
import {Table, Button, Input, Icon, DatePicker} from 'antd';
import {inject, observer} from 'mobx-react';
import "./waybill.scss"
import WaybillDialog from "../../../component/waybill/WaybillDialog";
import {isEmpty} from "../../../utils/isEmpty";
import {Modal} from "antd/lib/index";
import {isSpecialChart} from "../../../utils/isSpecialChart";

let page_num = 0;
let waybillStore = {};

@inject("waybillStore")
@observer
class Waybill extends React.Component {
    constructor() {
        super();
        this.state = {
            org_id: "",
            user_id: "",
            out_user_id: "",
            bill_no: "",
            start_date: null,
            end_date: null,
            endOpen: false,
            width:0
        }
    }

    componentDidMount() {
        page_num = 18;
        this.fetch();
    }


    fetch = () => {
        const {start_date, end_date, org_id, user_id, out_user_id, bill_no} = this.state;
        this.props.waybillStore.getWaybillList(1, page_num, start_date, end_date, org_id,
            user_id, out_user_id, bill_no);
    }

    //机构方ID
    onChangeOrgId = (e) => {
        this.setState({org_id: e.target.value});
    }
    //用户号
    onChangeUserId = (e) => {
        this.setState({user_id: e.target.value});
    }

    //第三方用户号
    onChangeOutUserId = (e) => {
        this.setState({out_user_id: e.target.value});
    }
    //第三方订单号
    onChangeBillNo = (e) => {
        this.setState({bill_no: e.target.value});
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
    //分页加载
    handleTableChange = (pagination) => {
        const {start_date, end_date, org_id, user_id, out_user_id, bill_no} = this.state;
        const pager = {...this.props.waybillStore.pagination};
        pager.current = pagination.current;
        this.props.waybillStore.setPagination(pager);
        this.props.waybillStore.getWaybillList(pager.current, page_num, start_date, end_date, org_id,
            user_id, out_user_id, bill_no);
    }
    //查询
    onReach = () => {
        const {org_id, user_id, out_user_id, bill_no} = this.state;

        if (!isEmpty(org_id)) {
            if (isSpecialChart(org_id) || org_id.length !== 15) {
                Modal.error({
                    title: '机构方ID输入错误',
                    content: '请输入正确的机构方ID(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(user_id)) {
           if (isSpecialChart(user_id) || user_id.length !== 19) {
                Modal.error({
                    title: '用户号输入错误',
                    content: '请输入正确的用户号(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(out_user_id)) {
            if (isSpecialChart(out_user_id)) {
                Modal.error({
                    title: '输入错误',
                    content: '请输入正确的格式(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(bill_no)) {
            if (isSpecialChart(bill_no)) {
                Modal.error({
                    title: '输入错误',
                    content: '请输入正确的格式(不能包含特殊字符)',
                });
                return
            }
        }
        this.fetch();
    }
    //重置
    onReset = () => {
        this.setState({
            org_id: "",
            user_id: "",
            out_user_id: "",
            bill_no: "",
            start_date: null,
            end_date: null,
            endOpen: false,
        });
    }

    render() {
        const {width, start_date, end_date, org_id, user_id, out_user_id, bill_no, endOpen} = this.state;
        const {isShowWaybillDialog, waybillList, pagination, isShowWaybillLoading} = this.props.waybillStore;
        waybillStore = this.props.waybillStore;
        return (
            <div className="waybill-container">
                <div className="waybill-top-container" ref={node => this.search_container = node}>
                    <div className="waybill-search-container" >
                        <div className="waybill-search-item-container">
                            <div className="waybill-input-container">
                                <div>机构方ID:</div>
                                <Input size="small"
                                       value={org_id}
                                       maxLength={15}
                                       onChange={this.onChangeOrgId}/>
                            </div>
                            <div className="waybill-input-container">
                                <div>第三方用户号:</div>
                                <Input size="small"
                                       value={out_user_id}
                                       maxLength={30}
                                       onChange={this.onChangeOutUserId}
                                />
                            </div>
                            <div className="waybill-date-picker-container">
                                <div>开始日期:</div>
                                <DatePicker
                                    size="small"
                                    disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    value={start_date}
                                    placeholder="开始日期"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            </div>
                        </div>
                        <div className="waybill-search-item-container">
                            <div className="waybill-input-bottom-container">
                                <div>用&nbsp;户&nbsp;号&nbsp;:</div>
                                <Input size="small"
                                       value={user_id}
                                       maxLength={19}
                                       onChange={this.onChangeUserId}/>
                            </div>
                            <div className="waybill-input-bottom-container">
                                <div>运单号:</div>
                                <Input size="small"
                                       value={bill_no}
                                       maxLength={30}
                                       onChange={this.onChangeBillNo}
                                />
                            </div>
                            <div className="waybill-date-picker-container" style={{marginTop:5}}>
                                <div>结束日期:</div>
                                <DatePicker
                                    size="small"
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD"
                                    value={end_date}
                                    placeholder="结束日期"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="waybill-btn-container">
                        <Button type="primary"
                                size="small"
                                disabled={isShowWaybillLoading ? true : false}
                                style={{marginBottom: 5, width: 80}}
                                onClick={this.onReach}>查询</Button>
                        <Button type="primary"
                                size="small"
                                style={{width: 80}}
                                onClick={this.onReset}>重置</Button>
                    </div>
                </div>
                <div className="waybill-table-container">
                    <Table
                        className="waybill-table"
                        bordered
                        size="small"
                        columns={columns}
                        loading={isShowWaybillLoading}
                        dataSource={waybillList}
                        pagination={pagination}
                        onChange={this.handleTableChange}/>
                </div>
                {isShowWaybillDialog ? <WaybillDialog/> : null}
            </div>);
    }
}

export default Waybill;

const columns = [
    {
        title: '机构方ID',
        dataIndex: 'org_id',
        key: 'org_id',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:60,
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
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:45,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '运单号',
        dataIndex: 'bill_no',
        key: 'bill_no',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:45,
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
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:90,
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
        dataIndex: 'bill_total_money',
        key: 'bill_total_money',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:45,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '油费金额',
        dataIndex: 'bill_oil_money',
        key: 'bill_oil_money',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '订单发生时间',
        dataIndex: 'bill_occur_time',
        key: 'bill_occur_time',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth:90,
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
        align: 'center',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 60,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                }}
                onClick={() => {
                    waybillStore.setIsShowWaybillDialog(true);
                    waybillStore.setOrderWaybillObject(record);
                }}
            ><a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}/>查看</a></div>);
        },
    },
];
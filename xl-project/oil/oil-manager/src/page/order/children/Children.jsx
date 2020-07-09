import React from 'react';
import {Input, Button, Table, DatePicker, Icon} from 'antd';
import "./Children.scss"
import locale from "antd/lib/date-picker/locale/zh_CN";
import ChildrenCheckDialog from "../../../component/childrentable/ChildrenCheckDialog";
import ChildrenOrderDialog from "../../../component/childrentable/ChildrenOrderDialog";
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {Modal} from "antd/lib/index";

let page_num = 0;
let childStore = {};

@inject("childStore")
@observer
class Children extends React.Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            partner_id: "",
            org_id: "",
            user_id: "",
            sub_order_no: "",
            sub_card_id: "",
            out_user_id: "",
            out_sub_order_no: "",
            start_date: null,
            end_date: null,
            collapsed: true,
        };
    }

    componentDidMount() {
        this.props.childStore.setPageSize(18);
        this.fetch();
    }

    
    fetch = () => {
        const {partner_id, org_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no, start_date, end_date} = this.state;
        this.props.childStore.getChildrenList(1, page_num, start_date, end_date, partner_id,
            org_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no);
    }
    //查询
    onSearch = () => {
        const {partner_id, org_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no} = this.state;

        if (!isEmpty(org_id)) {
            if (isSpecialChart(org_id) || org_id.length !== 15) {
                Modal.error({
                    title: '机构方ID输入错误',
                    content: '请输入正确的机构方ID(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(partner_id)) {
            if (isSpecialChart(partner_id) || partner_id.length !== 9) {
                Modal.error({
                    title: '合作方ID输入错误',
                    content: '请输入正确的合作方ID(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(sub_order_no)) {
            if (isSpecialChart(sub_order_no)) {
                Modal.error({
                    title: '输入错误',
                    content: '请输入正确的格式(不能包含特殊字符)',
                });
                return
            }
        }
        if (!isEmpty(sub_card_id)) {
            if (isSpecialChart(sub_card_id) || sub_card_id.length !== 23) {
                Modal.error({
                    title: '子卡号输入错误',
                    content: '请输入正确的子卡号(不能包含特殊字符)',
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
        if (!isEmpty(out_sub_order_no)) {
            if (isSpecialChart(out_sub_order_no)) {
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
    resetSearch = () => {
        this.setState({
            partner_id: "",
            org_id: "",
            user_id: "",
            sub_order_no: "",
            sub_card_id: "",
            out_user_id: "",
            out_sub_order_no: "",
            start_date: null,
            end_date: null,
            endOpen: false
        })
    }
    //分页加载
    handleTableChange = (pagination) => {
        const {partner_id, org_id, user_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no, start_date, end_date} = this.state;
        const pager = {...this.props.childStore.pagination};
        pager.current = pagination.current;
        this.props.childStore.setPagination(pager);
        this.props.childStore.getChildrenList(pager.current, page_num, start_date, end_date, partner_id,
            org_id, user_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no);
    }
    disabledStartDate = (start_date) => {
        const end_date = this.state.end_date;
        if (!start_date || !end_date) {
            return false;
        }
        return start_date.valueOf() > end_date.valueOf();
    }

    disabledEndDate = (end_date) => {
        const start_date = this.state.start_date;
        if (!end_date || !start_date) {
            return false;
        }
        return end_date.valueOf() <= start_date.valueOf();
    }
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    //开始日期
    onChangeStartTime = (value) => {
        this.setState({start_date: value});
    }
    //结束日期
    onChangeEndTime = (value) => {
        this.setState({end_date: value});
    }
    //合作方ID
    onChangePartnerId = (e) => {
        this.setState({partner_id: e.target.value});
    }
    //机构方ID
    onChangeOrgId = (e) => {
        this.setState({org_id: e.target.value});
    }
   
    //子订单号
    onChangeSubOrderNo = (e) => {
        this.setState({sub_order_no: e.target.value});
    }
    //子卡号
    onChangeSubCardId = (e) => {
        this.setState({sub_card_id: e.target.value});
    }
    //第三方用户号
    onChangeOutUserId = (e) => {
        this.setState({out_user_id: e.target.value});
    }
    //第三方子订单号
    onChangeOutSubOrderNo = (e) => {
        this.setState({out_sub_order_no: e.target.value});
    }

    onChangeCollapse = () => {
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {
        const {collapsed,width, partner_id, org_id, sub_order_no, sub_card_id, out_user_id, out_sub_order_no, start_date, end_date} = this.state;
        const {isShowLoading, pagination, childrenList} = this.props.childStore;
        childStore = this.props.childStore;
        return (
            <div className="children-container">
                <div className="children-search-container" ref={node => this.search_container = node}>
                    <div className="children-search-left">
                        <div className="children-search-left-first">
                            <div className="children-search-left-item">
                                <div>合作方ID:</div>
                                <Input
                                    size="small"
                                    value={partner_id}
                                    maxLength={9}
                                    onChange={this.onChangePartnerId}/>
                            </div>
                            <div className="children-search-left-item">
                                <div>子订单号:</div>
                                <Input
                                    size="small"
                                    value={sub_order_no}
                                    maxLength={50}
                                    onChange={this.onChangeSubOrderNo}/>
                            </div>
                            <div className="children-search-left-item">
                                <div>第三方用户号:</div>
                                <Input
                                    size="small"
                                    value={out_user_id}
                                    maxLength={50}
                                    onChange={this.onChangeOutUserId}/>
                            </div>
                        </div>
                        <div className="children-search-left-second">
                            <div className="children-search-left-item">
                                <div>机构方ID:</div>
                                <Input
                                    size="small"
                                    value={org_id}
                                    maxLength={15}
                                    onChange={this.onChangeOrgId}/>
                            </div>
                            <div className="children-search-left-item">
                                <div>子卡号:</div>
                                <Input
                                    size="small"
                                    value={sub_card_id}
                                    maxLength={23}
                                    onChange={this.onChangeSubCardId}/>
                            </div>
                            <div className="children-search-left-item">
                                <div>第三方子订单号:</div>
                                <Input
                                    size="small"
                                    value={out_sub_order_no}
                                    maxLength={50}
                                    onChange={this.onChangeOutSubOrderNo}/>
                            </div>
                            <div onClick={this.onChangeCollapse} className="children-more">
                                <a>更多</a>
                                <Icon type={collapsed ? "down" : "up"} style={{marginRight: 5}}/>
                            </div>
                        </div>
                        <div style={{display: collapsed ? "none" : "block"}}>
                            <div className="children-search-left-second">
                                <div className="children-search-left-date-picker-item">
                                    <div className="children-select-span">开始日期:</div>
                                    <DatePicker
                                        className="children-data-picker"
                                        size="small"
                                        disabledDate={this.disabledStartDate}
                                        value={start_date}
                                        format="YYYY-MM-DD"
                                        onChange={this.onChangeStartTime}
                                        onOpenChange={this.handleStartOpenChange}
                                        locale={locale}/>
                                </div>
                                <div className="children-search-left-date-picker-item">
                                    <div className="children-select-span">结束日期:</div>
                                    <DatePicker
                                        className="children-data-picker"
                                        size="small"
                                        disabledDate={this.disabledEndDate}
                                        value={end_date}
                                        format="YYYY-MM-DD"
                                        onChange={this.onChangeEndTime}
                                        onOpenChange={this.handleEndOpenChange}
                                        locale={locale}/>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="children-search-right">
                        <Button type="primary" size="small" style={{margin: 2, fontSize: 14, width: 80}}
                                onClick={this.onSearch}
                                disabled={isShowLoading ? true : false}
                        >查询</Button>
                        <Button type="primary" size="small" style={{margin: 2, fontSize: 14, width: 80}}
                                onClick={this.resetSearch}>重置</Button>
                    </div>
                </div>

                <div className="children-table-container">
                    <Table
                        className="children-table"
                        bordered
                        size="small"
                        columns={columns}
                        loading={isShowLoading}
                        dataSource={childrenList}
                        onChange={this.handleTableChange}
                        pagination={pagination}/>
                </div>
                {this.props.childStore.isShowDialog ? <ChildrenCheckDialog/> : null}
                {this.props.childStore.isShowOrderDialog ? <ChildrenOrderDialog/> : null}

            </div>
        );
    }
}

export default Children;

const columns = [{
    title: '子订单号',
    dataIndex: 'sub_order_no',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '合作方ID',
    dataIndex: 'partner_id',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '机构号',
    dataIndex: 'org_id',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '子卡号',
    dataIndex: 'sub_card_id',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '子订单金额',
    dataIndex: 'sub_actual_amount',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '第三方子订单号',
    dataIndex: 'out_sub_order_no',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '子订单创建时间',
    dataIndex: 'sub_create_time',
    align: 'center',
    render: (record) => {
        return (<div>{record}</div>);
    },
}, {
    title: '父流水表',
    key: 'order',
    align: 'center',
    render: (record) => {
        return (<div onClick={
                    () => {
                        childStore.setIsShowOrderDialog(true);
                        childStore.setChildrenOrderItem(record);
                    }}>
                <a><Icon type="eye-o" style={{marginRight: 2, color: '#1890ff'}}></Icon>父流水单</a></div>);
    }
}, {
    title: '操作',
    key: 'operation',
    align: 'center',
    render: (record) => {
        return (
            <div>
                <a onClick={() => {
                    childStore.setIsShowDialog(true);
                    childStore.setChildrenItem(record);
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Icon type="eye-o"/>
                        <div style={{fontSize: 12, marginLeft: 2}}>查看</div>
                    </div>
                </a>
            </div>
        );
    }
}
];
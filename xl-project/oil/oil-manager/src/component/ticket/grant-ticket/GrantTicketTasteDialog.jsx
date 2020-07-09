import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './GrantTicketDialog.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";

let store = null;
@inject("grantTicketStore")
@observer
class GrantTicketTasteDialog extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            mobile: '',
        }
    }

    componentDidMount() {
        const {page_num,page_size,mobile} = this.state;
        // store= this.props.grantTicketStore;
        // store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            mobile: isEmpty(mobile)?null:trim(mobile),
        }
        this.props.grantTicketStore.getCouponNeoQuery(params);
    }

    onSearchClick = () => {
        const {page_num,page_size,mobile} = this.state;
        store= this.props.grantTicketStore;
        // store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            mobile: isEmpty(mobile)?null:trim(mobile),
        }
        this.props.grantTicketStore.getCouponNeoQuery(params);
    }

    onResetClick = () => {
        this.setState({
            page_num:1,
            page_size:10,
            mobile: '',
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,mobile} = this.state;
        const pager = {...this.props.grantTicketStore.neoPagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.grantTicketStore.setNeoPagination(pager);
        store.setCurrentNeoPage(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            mobile: isEmpty(mobile)?null:trim(mobile),
        }
        this.props.grantTicketStore.getCouponNeoQuery(params);
    };

    onChangeMobile = (e) => {
        this.setState({mobile: e.target.value});
    };

    onCancel=()=>{
        this.props.grantTicketStore.setIsShowTasteDialog(false,1);
    };

    onOk=()=>{
        this.props.grantTicketStore.setIsShowTasteDialog(false,1);
    };


    render() {
        const {isShowTasteLoading,neoPagination,couponNeoList,isShowTasteDialog} = this.props.grantTicketStore;
        const {mobile} = this.state;
        store = this.props.grantTicketStore;
        return (
            <Modal title="明细"
                   okText="确认"
                   width={1100}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowTasteDialog}>
                <div className="search-info-container">
                    <div className="search-info-top-container">
                        <Form className="search-info-form" layout="inline">
                            <Form.Item label="简称" className="search-info-form-item">
                                <Input size="small"
                                       value={mobile}
                                       style={{width: 100, margin: 0}}
                                       maxLength={100}
                                       onChange={this.onChangeMobile}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="search-info-button"
                                    onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="search-info-button"
                                    onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>
                    <div className="search-info-table-container">
                        <Table className='search-info-table'
                               bordered={true}
                               size="middle"
                               columns={columns}
                               loading={isShowTasteLoading}
                               dataSource={couponNeoList}
                               onChange={this.handleTableChange}
                               pagination={neoPagination}
                        >
                        </Table>
                    </div>
                </div>
            </Modal>

        );
    }
}

export default GrantTicketTasteDialog;

const columns = [
    {
        title: '活动名称',
        dataIndex: 'activity_name',
        key: 'activity_name',
        align: 'center'
    },
    {
        title: '券名称',
        dataIndex: 'coupon_name',
        key: 'coupon_name',
        align: 'center',
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
    },
    {
        title: '投放时间',
        dataIndex: 'put_time',
        key: 'put_time',
        align: 'center',
    },
    {
        title: '券状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record===0) {
                status = "待发放";
            } else if (record===1) {
                status = "已投放";
            }else if (record===2) {
                status = "已使用";
            }else if (record===4) {
                status = "已过期";
            }else if (record===8) {
                status = "已失效";
            }else {
                status = "--";
            }
            return (<p style={optionStyle.container}>{status}</p>);
        },
    },
    {
        title: '交易订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                {record.status !== 2? <Popconfirm
                    title="确定要撤回么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.revokeCouponData(record.id)
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="redo" style={{color: "#ff5501"}}/>
                        <p style={optionStyle.delete}>撤回</p>
                    </div>
                </Popconfirm>: <a style={{color:"#b7b5b5",padding:2}}>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Icon type="stop" style={{color:"#b7b5b5"}}/>
                        <div style={{fontSize:12,marginLeft:2}}>撤回</div>
                    </div>
                </a>}
            </div>
        }
    }
];

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
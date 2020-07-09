import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Radio,Modal,message} from 'antd';
import './GrantTicketDialog.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";
import http from "../../../http/http";

let store = null;
@inject("grantTicketStore")
@observer
class GrantTicketPushDialog extends Component {

    constructor() {
        super();
        this.state = {
            coupon_id:'',
            mobile:'',
            isShowSubmitLoading: false,
            isShowPush: false,
        }
    }

    componentDidMount() {
        this.props.grantTicketStore.getCouponPushQuery();
    }

    handleTableChange = (pagination) => {
        const {page_size,mobile} = this.state;
        const pager = {...this.props.grantTicketStore.neoPagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.grantTicketStore.setNeoPagination(pager);
        store.setCurrentNeoPage(pager.current);
        this.props.grantTicketStore.getCouponPushQuery();
    };

    onChangeMobile = (e) => {
        this.setState({mobile: e.target.value});
    };

    onCancel=()=>{
        this.props.grantTicketStore.setIsShowPushDialog(false,1);
    };

    onOk=()=>{
        this.props.grantTicketStore.setIsShowPushDialog(false,1);
    };


    onSubmit=()=>{
        const {mobile} = this.state;
        const {coupon_id} = this.props.grantTicketStore;
        const params = {
            coupon_id:coupon_id,
            mobile:mobile
        }
        this.setState({isShowSubmitLoading: true});
        http.post('/website/coupon/neo-push',params,response=>{
            this.setState({
                isShowSubmitLoading: false,
                mobile:'',
            });
            this.props.grantTicketStore.setIsShowPush(false,null);
            message.info('发券成功')
            this.props.grantTicketStore.getCouponPushQuery();
            this.props.grantTicketStore.getCouponNeoQuery(this.props.grantTicketStore.neoParams);
        },err=>{
            message.error(err);
            this.setState({isShowSubmitLoading: false});
        });
    };

    onShowPush=(coupon_id)=>{
        this.setState({
            isShowPush: true,
            coupon_id:coupon_id
        });
    };

    onPushCancel=()=>{
        this.props.grantTicketStore.setIsShowPush(false,null);
    };
    render() {
        const {isShowPush,isShowPushLoading,pushPagination,couponPushList,isShowPushDialog} = this.props.grantTicketStore;
        const {mobile,isShowSubmitLoading} = this.state;
        store = this.props.grantTicketStore;
        return (
            <Modal title="可发券列表"
                   okText="确认"
                   width={800}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowPushDialog}>
                <div className="search-info-container">
                    <div className="search-info-table-container">
                        <Table className='search-info-table'
                               bordered={true}
                               size="middle"
                               columns={columns}
                               loading={isShowPushLoading}
                               dataSource={couponPushList}
                               onChange={this.handleTableChange}
                               pagination={pushPagination}
                        >
                        </Table>
                    </div>
                    <Modal
                           okText="提交"
                           cancelText="取消" centered={true}
                           confirmLoading={isShowSubmitLoading}
                           visible={isShowPush}
                           title='发券'
                           onOk={this.onSubmit} onCancel={this.onPushCancel}>
                        <div className='coupon-push-container'>
                            {/*<div className='coupon-push-form'>*/}
                            {/*    <span style={{width:80}}>发券依据:</span>*/}
                            {/*    <Radio>手机号</Radio>*/}
                            {/*</div>*/}
                            {/*<div className='coupon-push-form'>*/}
                            {/*    <span style={{width:80}}>发券方式:</span>*/}
                            {/*    <Radio>录入</Radio>*/}
                            {/*</div>*/}
                            <div className='coupon-push-form'>
                                <span style={{width:80}}>手机号:</span>
                                <Input size="small"
                                       value={mobile}
                                       placeholder={'请输入手机号'}
                                       style={{width: 150, margin: 0}}
                                       maxLength={11}
                                       onChange={this.onChangeMobile}/>
                            </div>
                        </div>
                    </Modal>
                </div>

            </Modal>


        );
    }
}

export default GrantTicketPushDialog;

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '券名称',
        dataIndex: 'coupon_name',
        key: 'coupon_name',
        align: 'center',
    },

    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item}
                     onClick={() =>{
                         store.setIsShowPush(true,record.id);
                     }}
                >
                    <Icon type="copy" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>发券</p>
                </div>
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
import React from 'react';
import {Table, Button, Icon, Tooltip, Modal} from 'antd';
import "./Invite.scss"
import {inject, observer} from "mobx-react/index";
import InviteDialog from "../../../component/invite/InviteDialog";
import {isEmpty} from "../../../utils/isEmpty";

let page_num = 0;
let inviteStore = {};

@inject("inviteStore")
@observer
class Invite extends React.Component {
    constructor() {
        super();
        this.state = {
            width: 0,
            isCanPreview:false,
            inviter_qrcode_url:''
        }
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.inviteStore.pagination};
        pager.current = pagination.current;
        this.props.inviteStore.setPagination(pager);
        this.props.inviteStore.getInviteList(pager.current, page_num);
    }

    componentDidMount() {
        page_num = 18;
        this.fetch();
    }

    fetch = () => {
        this.props.inviteStore.getInviteList(1, page_num);
    }
    //查看图片
    onPreviewImage = () => {
        this.props.inviteStore.setIsCanPreview(true);
    }
    //取消查看二维码
    handleCancel = () => {
        this.props.inviteStore.setIsCanPreview(false);
    }

    render() {
        inviteStore = this.props.inviteStore;
        return (<div className="invite-container">
            <div className="invite-promoter-content">
                <Table
                    className="promoter-table"
                    columns={columns}
                    dataSource={this.props.inviteStore.inviteList}
                    pagination={this.props.inviteStore.pagination}
                    loading={this.props.inviteStore.isShowInviteLoading}
                    onChange={this.handleTableChange}
                    bordered
                    scroll={{x: '100%'}}
                    size="small"/>
            </div>
            {this.props.inviteStore.isShowInviteDialog ? <InviteDialog/> : null}
            <Modal visible={inviteStore.isCanPreview} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{width: '100%'}} src={this.props.inviteStore.inviter_qrcode_url}/>
            </Modal>
        </div>);
    }
}

export default Invite;

const columns = [{
    title: '推广渠道',
    dataIndex: 'inviter_channel',
    key: 'inviter_channel',
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
    title: '推广分组',
    dataIndex: 'inviter_group',
    key: 'inviter_group',
    align: 'center',
    render: (record) => {
        return (
            <Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}>{record}</p>
            </Tooltip>);
    },
}, {
    title: '推广人姓名',
    dataIndex: 'inviter_name',
    key: 'inviter_name',
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
    title: '推广标识',
    dataIndex: 'inviter_senceflag',
    key: 'inviter_senceflag',
    align: 'center',
    render: (record) => {
        let mode = "";
        if (record === 0) {
            mode = "推广人";
        } else {
            mode = "推广场景";
        }
        return (<p style={{
            minWidth: 60,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{mode}</p>);
    },
}, {
    title: '代理标识',
    dataIndex: 'inviter_flag',
    key: 'inviter_flag',
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
    title: '联系方式',
    dataIndex: 'inviter_mobile',
    key: 'inviter_mobile',
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
    title: '推荐码',
    dataIndex: 'inviter_code',
    key: 'inviter_code',
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
},
    {
        title: '二维码',
        key: 'inviter_qrcode_url',
        align: 'center',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 45,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}

                onClick={() => {
                    {isEmpty(record.inviter_qrcode_url) ?[]
                         : [inviteStore.setInviterQrcodeUrl(record.inviter_qrcode_url)]}
                }}
            ><a  style={{textDecoration:"underline",color:"black"}} >{isEmpty(record.inviter_qrcode_url) ? '' : '二维码'}</a></div>);
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
                    // fontSize: 15
                }}
                onClick={() => {
                    inviteStore.setIsShowInviteDialog(true);
                    inviteStore.setOrderInviteObject(record);
                }}
            ><a>
                {isEmpty(record.inviter_qrcode_url) ? '生成推广码' : ''}</a></div>);
        },
    }
];
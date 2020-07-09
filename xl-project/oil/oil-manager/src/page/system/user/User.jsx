import React from 'react';
import {Input, Button, Table, Select, Tooltip} from 'antd';
import "./User.scss";
import {observer, inject} from 'mobx-react';
import SystemAddUserDialog from "../../../component/systemuserdialog/SystemAddUserDialog";
import SystemUserOperate from "../../../component/systemuserdialog/SystemUserOperate";
import SystemPreviewResetDialog from "../../../component/systemuserdialog/SystemPreviewResetDialog";
import {Modal} from "antd/lib/index";
import {isPhoneRight} from "../../../utils/mobile";
import {isEmpty} from "../../../utils/isEmpty";
import {isSpecialChart} from "../../../utils/isSpecialChart";

@inject("systemuser")
@observer
class User extends React.Component {

    constructor() {
        super();
        this.state = {
            realName: "",
            mobile: "",
            isLockString: "无",
            isLock: null,
            username: ""
        }
    }

    componentDidMount() {
        this.props.systemuser.setPageSize(18);
        this.fetch();
    }

    //网络请求
    fetch = () => {
        const {username, realName, mobile, isLock} = this.state;
        this.props.systemuser.getUserList(1, username, realName, mobile, isLock);
        this.props.systemuser.getPartnerList();
        this.props.systemuser.getRoleList();
    }

    //添加新用户
    addUser = () => {
        this.props.systemuser.setIsShowAddUpdateDialog(true, 2)
    }

    //查询
    onSearch = () => {
        const {realName, username, mobile} = this.state;
        if (!isEmpty(realName)) {
            if (isSpecialChart(realName)) {
                Modal.error({
                    title: '真实姓名错误',
                    content: '请输入正确的真实姓名',
                });
                return
            }
        }
        if (!isEmpty(username)) {
            if (isSpecialChart(username)) {
                Modal.error({
                    title: '用户名错误',
                    content: '请输入正确的用户名',
                });
                return
            }
        }
        this.fetch();

    }

    onChangeUserName = (e) => {
        this.setState({username: e.target.value});
    }
    onChangeRealName = (e) => {
        this.setState({realName: e.target.value});
    }

    onChangeMobile = (e) => {
        this.setState({mobile: e.target.value});
    }

    onChangeIsLock = (e) => {
        this.setState({isLockString: e});
        if (e === "yes") {
            this.setState({isLock: true});
        } else if (e === "no") {
            this.setState({isLock: false});
        } else {
            this.setState({isLock: null});
        }
    }

    onResetSearchUser = () => {
        this.setState({
            realName: "",
            mobile: "",
            isLockString: "无",
            isLock: null,
            username: ""
        });
    }

    //分页加载
    handleTableChange = (pagination) => {
        const {realName, mobile, isLock, username} = this.state;
        const pager = {...this.props.systemuser.pagination};
        pager.current = pagination.current;
        this.props.systemuser.setPagination(pager);
        this.props.systemuser.getUserList(pager.current, username, realName, mobile, isLock);
    }

    header=()=>{
        return <div className="user-content-div">
            <Button type="primary" onClick={this.addUser} disabled={this.props.systemuser.disableFetch}>新增用户</Button>
        </div>
    }

    onOk = () =>{
        this.props.systemuser.showPsw=false;
        const {realName, mobile, isLock, username} = this.state;
        this.props.systemuser.getUserList(1, username, realName, mobile, isLock);
    }

    renderUserPassword = ()=>{
        const {showPsw, addUserName, addPsw} = this.props.systemuser;
        return <Modal visible={showPsw}
            onCancel={()=>this.props.systemuser.showPsw=false}
            onOk={()=>this.onOk()}
            title="密码">
                <div className="user-psw-container">
                    <div className="user-psw-item">
                        <span>用户名:</span>
                        <div>{addUserName}</div>
                    </div>
                    <div className="user-psw-item">
                        <span>密码:</span>
                        <div>{addPsw}</div>
                    </div>
                </div>
        </Modal>
    }

    render() {
        return (<div className="user-container">
            <div ref={node => this.search_container = node} className="user-top-container">
                <div className="user-input-item">
                    <div className="user-input-item-title">用户名:</div>
                    <Input type="text"
                           maxLength={50}
                           size="small"
                           value={this.state.username}
                           onChange={this.onChangeUserName}
                           placeholder="请输入用户名"/>
                </div>
                <div className="user-input-item">
                    <div className="user-input-item-title">真实姓名:</div>
                    <Input
                        type="text"
                        maxLength={50}
                        size="small"
                        value={this.state.realName}
                        onChange={this.onChangeRealName}
                        placeholder="请输入真实姓名"/>
                </div>
                <Button type="primary"
                        htmlType="submit"
                        onClick={this.onSearch}
                        className="user-btn"
                        disabled={this.props.systemuser.isShowLoading ? true : false}>查询</Button>
                <Button type="primary" htmlType="submit"
                        onClick={this.onResetSearchUser}>重置</Button>
            </div>
            <div className="user-content">
                <Table
                    bordered
                    size="small"
                    scroll={{x: '100%'}}
                    className="user-table"
                    columns={columns}
                    title={this.header}
                    onChange={this.handleTableChange}
                    pagination={this.props.systemuser.pagination}
                    loading={this.props.systemuser.isShowLoading}
                    dataSource={this.props.systemuser.userList}/>
            </div>
            {this.props.systemuser.isShowAddUpdateDialog ? <SystemAddUserDialog/> : null}
            {this.props.systemuser.isShowPreviewResetDialog ? <SystemPreviewResetDialog/> : null}
            {this.props.systemuser.showPsw?this.renderUserPassword():null}
        </div>);
    }

}

export default User;

const columns = [{
    title: '唯一用户名',
    dataIndex: 'username',
    fontSize: '16px',
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
    title: '真实姓名',
    dataIndex: 'real_name',
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
    title: '电话',
    dataIndex: 'mobile',
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
    title: '角色',
    dataIndex: 'role_name',
    align: 'center',
    render: (record) => {
        return (
            <Tooltip placement="bottom" title={record}>
                <p style={{
                    minWidth: 30,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0
                }}>{record}</p></Tooltip>);
    },
}, {
    title: '操作',
    align: 'center',
    render: (record) => {
        return (<SystemUserOperate record={record}/>);
    },
}];
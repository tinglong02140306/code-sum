import React from 'react';
import {Button, Table, Tooltip} from 'antd';
import "./Permission.scss";
import {observer, inject} from 'mobx-react';
import SystemPermissionDialog from "../../../component/systempermission/SystemPermissionDialog";
import SystemPermissionOperate from "../../../component/systempermission/SystemPermissionOperate";

@inject("systempermission")
@observer
class Permission extends React.Component {

    state = {
        selectedRowKeys: [],
    };

    constructor() {
        super();
        this.state = {
            id: "",
            permission_name: "",
            permission_value: []
        }
    }

    componentDidMount() {
        this.props.systempermission.setPageSize(18);
        this.fetch();
    }


    //网络请求
    fetch = () => {
        //权限列表
        this.props.systempermission.getPermissionList(1);
    }
    //添加
    addUser = () => {
        this.props.systempermission.setSystemItemPermission({});
        this.props.systempermission.setIsShowDialog(true, 2)
    }

    handleTableChange = (pagination) => {
        const pager = {...this.props.systempermission.pagination};
        pager.current = pagination.current;
        this.props.systempermission.setPagination(pager);
        // const {permission_name, permission_value} = this.state;
        this.props.systempermission.getPermissionList(pager.current);
    }

    header=()=>{
        return <div className="permission-content-div" ref={node => this.search_container = node}>
            <Button type="primary" onClick={this.addUser}>新增权限</Button>
        </div>
    }

    render() {
        return (<div className="permission-content">
            <Table
                className="permission-table"
                bordered
                title={this.header}
                size="small"
                columns={columns}
                dataSource={this.props.systempermission.permissionList}
                pagination={this.props.systempermission.pagination}
                loading={this.props.systempermission.isShowLoading}
                onChange={this.handleTableChange}
                scroll={{x: '100%'}}/>
            {this.props.systempermission.isShowDialog ? <SystemPermissionDialog/> : null}
        </div>);
    }

}

export default Permission;

const columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
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
    title: '权限名称',
    dataIndex: 'permission_name',
    width: '20%',
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
    title: '权限值',
    dataIndex: 'permission_value',
    width: '40%',
    align: 'center',
    render: (record) => {
        return (<Tooltip placement="bottom" title={record}>
            <p style={{
                minWidth: 45,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p></Tooltip>);
    },
}, {
    title: '操作',
    align: 'center',
    render: (record) => {
        return (<SystemPermissionOperate record={record}/>);
    },
    width: '25%'
}];
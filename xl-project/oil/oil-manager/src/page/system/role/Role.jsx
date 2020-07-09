import React from 'react';
import {Button, Table, Tooltip} from 'antd';
import "./Role.scss";
import {observer, inject} from 'mobx-react';
import SystemRoleDialog from "../../../component/systemroledialog/SystemRoleDialog";
import SystemRoleOperate from "../../../component/systemroledialog/SystemRoleOperate";
import SystemRoleCheckDialog from "../../../component/systemroledialog/SystemRoleCheckDialog";

@inject("systemrole")
@inject("systempermission")
@observer
class Role extends React.Component {

    constructor() {
        super();
        this.state = {
            id: "",
            role_name: "",
            role_description: "",
            permission_id_array: [],
        }
    }


    componentDidMount() {
        this.props.systemrole.setPageSize(18);
        this.fetch();
    }

    //网络请求
    fetch = () => {
        //角色列表
        this.props.systemrole.getRoleList(1);

    }
    //添加角色
    addUser = () => {
        this.props.systemrole.setIsShowDialog(true,2)
    }

    handleTableChange = (pagination) => {
        const pager = {...this.props.systemrole.pagination};
        pager.current = pagination.current;
        this.props.systemrole.setPagination(pager);
        this.props.systemrole.getRoleList(pager.current);
    }

    header=()=>{
        return <div className="role-content-div" ref={node => this.search_container = node}>
            <Button type="primary" onClick={this.addUser}>新增角色</Button>
        </div>
    }

    render() {
        return (<div className="role-container">
            <div className="role-content">
                <Table
                    bordered
                    size="small"
                    title={this.header}
                    columns={columns}
                    scroll={{x:'100%'}}
                    className="role-table"
                    dataSource={this.props.systemrole.roleList}
                    pagination={this.props.systemrole.pagination}
                    loading={this.props.systemrole.isShowLoading}
                    onChange={this.handleTableChange}/>
            </div>
            {this.props.systemrole.isShowDialog ? <SystemRoleDialog/> : null}
            {this.props.systemrole.isShowCheckDialog ? <SystemRoleCheckDialog/> : null}
        </div>);
    }

}

export default Role;

const columns = [
//     {
//     title: 'ID',
//     dataIndex: 'id',
//     align:'center',
//     render: (record) => {
//         return (<p style={{
//             overflow: "hidden",
//             whiteSpace: "nowrap",
//             textOverflow: "ellipsis",
//             padding: 0,
//             margin: 0
//         }}>{record}</p>);
//     },
// },
    {
    title: '角色名称',
    dataIndex: 'role_name',
    align:'center',
    render: (record) => {
        return (<p style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}, {
    title: '角色描述',
    dataIndex: 'role_description',
    align:'center',
    render: (record) => {
        return (<p style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}, {
    title: '权限',
    dataIndex: 'permission_array',
    align:'center',
    render: (record) => {
        let content = '';
        let arr = [];
        record.map(item=>{
            arr.push(item.name)
            content=arr.toString();
        });
        return (<Tooltip placement="bottom" title={content}>
            <p style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{content}</p></Tooltip>);
    },
},
    {
        title: '页面',
        dataIndex: 'page_array',
        align:'center',
        render: (record) => {
            let content = '';
            let arr = [];
            record.map(item=>{
                arr.push(item.name)
                content=arr.toString();
            });
            return (<Tooltip placement="bottom" title={content}>
                <p style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: 0,
                    margin: 0,
                }}>{content}</p></Tooltip>);
        },
    }, {
    title: '操作',
    render: (record) => {
        return (<SystemRoleOperate record={record}/>);
    },
    align:'center',
}];
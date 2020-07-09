import React from 'react';
import './Groups.scss';
import {Table, Button, Popconfirm, Icon,Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';
import GroupDialog from '../../../component/shell/group/GroupDialog'
let store = null;

@inject("groupStore")
@observer
class Groups extends React.Component {

    componentDidMount() {
        this.props.groupStore.setPageSize(18);
        store = this.props.groupStore;
        this.props.groupStore.getGroupList();
    }

    /**
     * 新增分组
     */
    onGroupAdd=()=>{
        this.props.groupStore.setIsShowGroupDialog(true);
        store.setTypeDialog(0);
        store.setDialogData(null);
    }

    /**
     * 全量修改
     */
    onGroupUpdataAll=()=>{
        this.props.groupStore.setIsShowGroupDialog(true);
        store.setTypeDialog(2);
        store.setDialogData(null);
    }

    header = () => {
        return <div>
            <Button type="primary" onClick={this.onGroupAdd} style={{marginRight:10}}>新增分组</Button>
            <Button type="primary" onClick={this.onGroupUpdataAll} >全量修改</Button>
        </div>
    }

    render() {
        const {isShowLoading, groupList, isShowGroupDialog,pagination} = this.props.groupStore;
        return <div className="terminal-groups-container">
            <Table className="terminal-groups-table"
                   bordered={true}
                   size="small"
                   title={this.header}
                   columns={columns}
                   loading={isShowLoading}
                   scroll={{x:'120%'}}
                   dataSource={groupList}
                   pagination={pagination}/>
            {isShowGroupDialog?<GroupDialog/>:null}
        </div>
    }
}

export default Groups;


const columns = [
    {
        title: '分组名称',
        dataIndex: 'group_name',
        key: 'group_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '92#汽油优惠价',
        dataIndex: '38',
        key: '38',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '95#汽油优惠价',
        dataIndex: '39',
        key: '39',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '98#汽油优惠价',
        dataIndex: '40',
        key: '40',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '0#柴油成本价',
        dataIndex: '42',
        key: '42',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '10#柴油成本价',
        dataIndex: '43',
        key: '43',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    },  {
        title: '信联价计算公式汽油',
        dataIndex: 'xl_price_formula_gas',
        key: 'xl_price_formula_gas',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    },{
        title: '信联价计算公式柴油',
        dataIndex: 'xl_price_formula_diesel',
        key: 'xl_price_formula_diesel',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '生效日期',
        dataIndex: 'valid_time',
        key: 'valid_time',
        align: 'center'
    }, {
        title: '失效日期',
        dataIndex: 'invalid_time',
        key: 'invalid_time',
        align: 'center'
    }, {
        title: '操作',
        key: 'options',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                    store.setIsShowGroupDialog(true);
                    store.setTypeDialog(1);
                    store.setDialogData(record);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定要删除么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.getDeleteGroup(record.id);
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="delete" style={{color: "#ff5501"}}/>
                        <p style={optionStyle.delete}>删除</p>
                    </div>
                </Popconfirm>
            </div>
        }
    }];

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
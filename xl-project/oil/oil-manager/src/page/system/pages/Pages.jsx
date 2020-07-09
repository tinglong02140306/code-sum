import React from 'react';
import './Pages.scss';
import {Table, Button,Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';
import SystemPagesDialog from "../../../component/system/pages/SystemPagesDialog";
import SystemPagesPreviewDialog from "../../../component/system/pages/SystemPagesPreviewDialog";
import SystemPagesOperate from "../../../component/system/pages/SystemPagesOperate";

@inject('pageStore')
@observer
class Pages extends React.Component {

    componentDidMount() {
        this.props.pageStore.setPageSize(18);
        this.fetch();
    }


    //网络请求
    fetch = () => {
        //角色列表
        this.props.pageStore.getPagesList(1);

    }
    //添加角色
    addUser = () => {
        this.props.pageStore.setIsShowDialog(true,2)
    }

    handleTableChange = (pagination) => {
        const pager = {...this.props.pageStore.pagination};
        pager.current = pagination.current;
        this.props.pageStore.setPagination(pager);
        this.props.pageStore.getPagesList(pager.current);
    }

    header=()=>{
        return <div className="pages-content-div" ref={node => this.search_container = node}>
            <Button type="primary" onClick={this.addUser}>新增页面</Button>
        </div>
    }

    render() {
        const {pagesList,pagination,isShowLoading,isShowDialog,isShowCheckDialog} = this.props.pageStore;
        return <div className="pages-container">
            <div className="pages-content">
                <Table
                    bordered
                    size="small"
                    title={this.header}
                    columns={columns}
                    scroll={{x: '100%'}}
                    className="pages-table"
                    dataSource={pagesList}
                    pagination={pagination}
                    loading={isShowLoading}
                    onChange={this.handleTableChange}/>
            </div>
            {isShowDialog ? <SystemPagesDialog/> : null}
            {isShowCheckDialog ? <SystemPagesPreviewDialog/> : null}
        </div>
    }
}

export default Pages;

const columns = [{
    title: 'ID',
    dataIndex: 'id',
    key:'id',
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
    title: '页面名称',
    dataIndex: 'page_name',
    key:'page_name',
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
    title: '页面值',
    dataIndex: 'page_value',
    key:'page_value',
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
        return (<SystemPagesOperate record={record}/>);
    },
    width: '25%'
}];
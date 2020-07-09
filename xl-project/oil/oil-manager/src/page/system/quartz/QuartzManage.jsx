import React from 'react';
import './QuartzManage.scss';
import {Table, Button, Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';
import QuartzMenu from '../../../component/quartz/QuartzMenu';
import QuartzDialog from '../../../component/quartz/QuartzDialog';

let widthScreen = 0;

@inject("serviceStore")
@observer
class QuartzManage extends React.Component {


    componentDidMount() {
        this.props.serviceStore.setPageSize(18);
        this.fetch();
    }


    fetch = () => {
        this.props.serviceStore.getServiceList(1);
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.serviceStore.pagination};
        pager.current = pagination.current;
        this.props.serviceStore.setPagination(pager);
    }

    header=()=>{
        return <div className="service-manager-search-container" ref={node => this.search_container = node}>
            <Button type="primary" onClick={() => {
                this.props.serviceStore.setIsShowQuartzDialog(true)
            }}>添加</Button>
        </div>    
    }

    render() {
        const {serviceList, pagination, isShowLoading, isShowQuartzDialog} = this.props.serviceStore;
        return (<div className="service-manager-container">
            <div className="service-table-container">
                <Table
                    size="small"
                    columns={columns}
                    bordered
                    title={this.header}
                    className="service-manager-table"
                    pagination={pagination}
                    dataSource={serviceList}
                    loading={isShowLoading}
                    scroll={{x: '100%'}}
                    onChange={this.handleTableChange}
                />
            </div>
            {isShowQuartzDialog ? <QuartzDialog/> : null}
        </div>);
    }
}

export default QuartzManage;


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
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
    },
    {
        title: '任务名称',
        dataIndex: 'job_name',
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
                    }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '任务分组',
        dataIndex: 'job_group',
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
                    }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '任务状态',
        dataIndex: 'job_status',
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
                    }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '任务描述',
        dataIndex: 'job_description',
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
                    }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '任务表达式',
        dataIndex: 'cron_expression',
        align: 'center',
        render: (record) => {
            return (
                <Tooltip placement="bottom" title={record}>
                    <p style={{
                        minWidth: 75,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: 0,
                        margin: 0
                    }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
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
    },
    {
        title: '操作',
        align: 'center',
        render: (record) => {
            return (<QuartzMenu record={record}/>);
        },
    }
]
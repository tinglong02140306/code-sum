import React from 'react';
import {Table, Button, Tooltip} from 'antd';
import "./Interests.scss"
import {inject, observer} from "mobx-react";
import InterestsDialog from '../components/interests/InterestsDialog';
import CRUD from '../../../component/common/crud/CRUD';
let interestStore = null
let Page_Num = 1;
let PAGE_SIZE = 15;
@inject("interestStore")
@observer
class Interests extends React.Component {
    
    state = {
            
    }

    componentDidMount() {
       interestStore = this.props.interestStore;
       this.props.interestStore.getInterestsList(Page_Num,PAGE_SIZE);
        this.props.interestStore.getActivityList(1,0);
    }

    //新增
    onAddClick = () => {
        this.props.interestStore.setIsShowDialog(true,0);
        this.props.interestStore.setShowData(null);
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.interestStore.pagination};
        pager.current = pagination.current;
        this.props.interestStore.setPagination(pager);
        this.props.interestStore.getInterestsList(pager.current, PAGE_SIZE);
    }

    renderHeader = () => {
        return <div className="interests-table-header">
            <Button type="primary" onClick={this.onAddClick}>新增</Button>
        </div>
    }

    render() {
        const {showLoadingPage, interestsList, isShowDialog, pagination} = this.props.interestStore;
        return (<div className="interests-container">
           <Table className="interests-table" 
                columns={columns} 
                size="small" 
                title={this.renderHeader}
                bordered={true}
                pagination={pagination}
                dataSource={interestsList}
                loading={showLoadingPage}
                  scroll={{x: '120%'}}
                onChange={this.handleTableChange}>
            </Table>
            {isShowDialog? <InterestsDialog></InterestsDialog>:null}
        </div>);
    }
}

export default Interests;

const columns = [{
    title: '权益名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
}, {
    title: '所属地区',
    dataIndex: 'area_name',
    key: 'area_name',
    align: 'center'
}, {
    title: '权益logo',
    dataIndex: 'logo_url',
    key: 'logo_url',
    align: 'center',
    render:record=>{
        return record?<Tooltip placement="bottom" title={record}>
            <div className="interests-td-logo">
                <img alt="record" src={record} className="interests-td-logo-image"></img>
            </div>
        </Tooltip>:"无"
    }
}, {
    title: '活动类目',
    dataIndex: 'equit_type',
    key: 'equit_type',
    align: 'center',
    render: (record) => {
        let status = "";
        if (record === 2) {
            status = "洗车";
        } else {
            status = "加油";
        }
        return (<p style={optionStyle.container}>{status}</p>);
    },
}, {
    title: '活动类型',
    dataIndex: 'target_type',
    key: 'target_type',
    align: 'center',
    render: (record) => {
        let status = "";
        if (record === 1) {
            status = "绑卡领取";
        } else {
            status = "优惠券领取";
        }
        return (<p style={optionStyle.container}>{status}</p>);
    },
}, {
    title: '活动简介',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
},{
    title: '权益内容',
    dataIndex: 'equit_rule_desc_list',
    key: 'equit_rule_desc_list',
    align: 'center',
    render:record=>{
        return record&&record.length?<Tooltip placement="bottom" title={record}>
        <div className="interests-td-coupon">
            {record&&record.map((item,index)=>{
                return <span key={index}>{item}</span>
            })}
        </div>
    </Tooltip>:"无"
    }
},
    {
    title: '操作',
    key: 'operation',
    align: 'center',
        fixed: 'right',
    render: (record) => {
       return <CRUD  
            onCheckClick={()=>{interestStore.setIsShowDialog(true,1);interestStore.setShowData(record)}} 
            onUpdateClick={()=>{interestStore.setIsShowDialog(true,2);interestStore.setShowData(record)}} 
            onDeleteClick={()=>{interestStore.deleteInterests(record.id)}} ></CRUD>
    }
}
];
const optionStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 30,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0
    },}
import React from "react";
import "./Banner.scss";
import {Button,Form,Table,Tooltip,Icon,Select,Popconfirm,message } from 'antd';
import {inject, observer} from 'mobx-react';
import copy from 'copy-to-clipboard';
import BannerDialog from "../../../component/wxapplet/banner/BannerDialog";
const Option = Select.Option;
let store = null;

@inject("bannerStore")
@observer
class Banner extends React.Component{

    constructor(){
        super();
        this.state={
            page_num:1,
            page_size:10,
            resource_type:0,
            resource_use:0,
            purpose:null
        };
    }

    componentDidMount(){
        const {page_num,page_size,purpose} = this.state;
        store= this.props.bannerStore;
        const params = {
            page_num:page_num,
            page_size:page_size,
            purpose:purpose,
        }
        this.props.bannerStore.getResourceList(params);
    }

    handleTableChange = (pagination) => {
        const {page_size,purpose} = this.state;
        const pager = {...this.props.bannerStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.bannerStore.setPagination(pager);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            purpose:purpose,
        }
        this.props.bannerStore.getResourceList(params);
    }

    /**
     *录入
     */
    onAddClick=()=>{
        this.props.bannerStore.setIsShowDialog(true);
        this.props.bannerStore.setTypeModal(0);
    }

    /**
     *重置
     */
    onResetClick=()=>{
        const {setFieldsValue} = this.props.form;
        setFieldsValue({purpose:null});
    }

    /**
     *提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const params = values;
            params.page_num = this.state.page_num;
            params.page_size = this.state.page_size;
            this.props.bannerStore.getResourceList(params);
        });
    }

    /**
     *头部 布局
     */
    header=()=>{
        return <div className="etc-oil-header-container">
            <Button type="primary" size="small" onClick={this.onAddClick}>录入</Button>
        </div>
    }

    render(){
        const {isShowDialog,resourceList,isLoadingTable,pagination} = this.props.bannerStore;
        const {getFieldDecorator} = this.props.form;
        return <div className="etc-oil-container">
            <Form className="etc-oil-form" layout="inline" onSubmit={this.handleSubmit}>

                <Form.Item  label="用途" className="etc-oil-form-item">
                    {getFieldDecorator('purpose', {initialValue:''})
                    (<Select size="small">
                        <Option value={null}>全部</Option>
                        <Option value={'WXAPPLET'}>WXAPPLET</Option>
                        <Option value={'ALIPAY_APPLET'}>ALIPAY_APPLET</Option>
                        <Option value={'EQUITY'}>EQUITY</Option>
                    </Select>)}
                </Form.Item>

                <Button type="primary" htmlType="submit" size="small" className="etc-oil-button">查询</Button>
                <Button type="primary" size="small" className="etc-oil-button" onClick={this.onResetClick}>重置</Button>
            </Form>
            <Table className="etc-oil-table"
                   columns={columns}
                   bordered={true}
                   title={this.header}
                   dataSource={resourceList}
                   size="small"
                   pagination={pagination}
                   onChange={this.handleTableChange}
                   loading={isLoadingTable}
                   // scroll={{x: "110%"}}
            />
            {isShowDialog?<BannerDialog/>:null}
        </div>
    }
}

export default  Form.create({})(Banner);

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '目标位置',
        dataIndex: 'target_uri',
        key: 'target_uri',
        align:'center',
    },
    {
        title: '顺序',
        dataIndex: 'sequence',
        key: 'sequence',
        align:'center',
    },
    {
        title: '地区',
        dataIndex: 'area_name',
        key: 'area_name',
        align:'center',
    },
    {
        title: '所属',
        dataIndex: 'area_code',
        key: 'area_code',
        align:'center',
    },
    {
        title: '附加',
        dataIndex: 'subjoin',
        key: 'subjoin',
        align:'center',
    },
    {
        title: '资源图片',
        dataIndex: 'banner_url',
        key: 'banner_url',
        align:'center',
        width:120,
        render:(record)=>{
            return<div style={style}>
                <img style={{width:23,height:23,display:record?'flex':'none'}} alt="" src={record}></img>
            </div>
        }
        },
    {
        title: '资源链接',
        dataIndex: 'banner_url',
        key: 'banner',
        align:'center',
        width:120,
        render: (record) => {
            return (
                record ? <div style={{
                    minWidth: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textDecoration: 'underline',
                    color: 'rgba(45,142,89,0.52)',
                    padding: 0,
                    margin: 0,
                }} onClick={() => {
                    copy(record)
                    if (copy(record)) {
                        message.info('复制成功')
                    } else {
                        message.error('复制失败')
                    }
                }}>复制</div> : <div style={{minWidth: 60, padding: 0, margin: 0}}/>);
        },
},
    {
        title: '操作',
        key: 'options',
        align:'center',
        width:180,
        render:(record)=>{
            return <div style={option_container}>
                <div style={option_item} onClick={()=>{store.setIsShowDialog(true);store.setStoreItem(record);store.setTypeModal(1)}}>
                    <Icon type="edit" style={{color:'#ff9f46'}}></Icon>
                    <p style={edit_text}>修改</p>
                </div>
                <div style={option_item}>
                    <Icon type="eye-o" style={{color:'#1890ff'}}></Icon>
                    <p style={option_text} onClick={()=>{store.setIsShowDialog(true);store.setStoreItem(record);store.setTypeModal(2)}}>查看</p>
                </div>
                <Popconfirm
                    title="确定要删除么？" okText="是的" cancelText="取消"
                    onConfirm={()=>{store.delectBannerResorce(record.id)}}>
                    <div style={option_item}>
                        <Icon type="delete" style={{color:'#e73838'}}></Icon>
                        <p style={delete_text}>删除</p>
                    </div>
                </Popconfirm>

            </div>
        }
    }];

const style = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin:0,
    padding:0
}

const option_container={
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
}

const option_item={
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:5,
    marginRight:5,
    cursor:'pointer'
}

const option_text={
    margin:0,
    marginLeft:2,
    color:'#1890ff'
}
const delete_text={
    margin:0,
    marginLeft:2,
    color:'#e73838'
}
const edit_text={
    margin:0,
    marginLeft:2,
    color:'#ff9f46'
}



import React from 'react';
import {Table, Button, Popconfirm, Modal, Form, Input, Icon, message, Select} from 'antd';
import Upload from '../upload/Upload.jsx';
import "./Static.scss"
import {inject, observer} from "mobx-react/index";
import {CopyToClipboard} from 'react-copy-to-clipboard';

let page_num = 1;
const PAGE_SIZE = 15;

@inject("staticStore")
@observer
class Static extends React.Component {

    state = {
        search_name:"",
        show_modal:false,
    }

    componentDidMount() {
       this.fetch("");
    }

    //分页加载
    handleTableChange = (pagination) => {
        const {search_name} = this.state;
        const pager = {...this.props.staticStore.pagination};
        pager.current = pagination.current;
        page_num = pagination.current;
        this.fetch(search_name);
    }

    //查询按钮点击事件
    onQueryClick = e =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              this.setState({search_name:values.resource_name});
              this.fetch(values.resource_name);
            }
        });
    }

    //新增资源 点击事件
    onAddStaticClick = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {search_name} = this.state;
                this.props.staticStore.addStatic(values,success=>{
                    this.setState({show_modal:false});
                    success&&this.fetch(search_name);
                });
            }
        });
    }

    //删除资源 点击事件
    onDelectStaticClick = (id) => {
        const {search_name} = this.state;
        this.props.staticStore.deleteStatic(id,()=>{
            this.fetch(search_name);
        });
    }

    //网络请求
    fetch = (resource_name) => {
        this.props.staticStore.queryStatic(page_num,PAGE_SIZE,resource_name);
    }
   
    //新增按钮 布局
    header=()=>{
        return <Button className="static-table-header" type="primary" onClick={()=>{this.setState({show_modal:true});}}>新增</Button>
    }

    //新增资源 Modal展示
    modalAdd = () => {
        const {addLoading} = this.props.staticStore;
        const { getFieldDecorator, getFieldsValue} = this.props.form;
        const {show_modal} = this.state;
        const {uploadType=1,resourceType} = getFieldsValue(["uploadType","resourceType","file"]);
        return <Modal visible={show_modal} 
            title="查看" 
            footer={null}
            className="static-modal-container"
            onCancel={()=>{this.setState({show_modal:false})}}>
            <Form className="static-modal-add-form" layout="inline"  onSubmit={this.onAddStaticClick}>
                <Form.Item label="资源名称">
                    {getFieldDecorator('resourceName', {rules: [{required: true,message: '请输入资源名称',}]})
                    (<Input className="static-modal-add-form-item" placeholder="请输入资源名称"/>)}
                </Form.Item>
                <Form.Item label="资源类型" className="form-item-margin">
                    {getFieldDecorator('resourceType', {initialValue:1})
                        (<Select placeholder="请选择资源类型" className="static-modal-add-form-item">
                            <Select.Option value={1}>图片</Select.Option>
                            <Select.Option value={2}>视频</Select.Option>
                            <Select.Option value={3}>其它</Select.Option>
                        </Select>)}
                </Form.Item>
                <Form.Item label="上传方式" className="form-item-margin">
                    {getFieldDecorator('uploadType', {initialValue:uploadType})
                        (<Select placeholder="请选择资源类型" className="static-modal-add-form-item">
                            <Select.Option value={1}>资源地址</Select.Option>
                            <Select.Option value={2}>资源文件</Select.Option>
                        </Select>)}
                </Form.Item>
                {uploadType===1? <Form.Item label="资源地址">
                    {getFieldDecorator('resourceUrl',{rules: [{ required:true, message: '请输入资源地址' }]})
                    (<Input className="static-modal-add-form-item" placeholder="请输入资源地址"/>)}
                </Form.Item>:null}
                {uploadType===2?<Form.Item label="资源文件">
                    {getFieldDecorator('file',{rules: [{ required: true, message: '请选择资源文件' }]})
                    (<Upload className="static-modal-add-form-item" type={resourceType||1}/>)}
                </Form.Item>:null}
                <Form.Item className="static-add-modal-submit">
                    <Button type="primary" htmlType="submit" loading={addLoading}>提交</Button>
                </Form.Item>
            </Form>
        </Modal>
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const {staticList, pagination, loading} = this.props.staticStore;
        const {show_modal} = this.state;
        return (<div className="static-container">
            <Form className="static-form" layout="inline" onSubmit={this.onQueryClick}>
                <Form.Item label="文件名">
                    {getFieldDecorator('resource_name')(<Input placeholder="请输入您要查询的文件名"/>)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
            </Form>
            <Table className="static-table" 
                bordered
                size="small"
                columns={this.columns} 
                dataSource={staticList} 
                pagination={pagination}
                loading={loading}
                title={this.header}
                onChange={this.handleTableChange}/>
            {show_modal?this.modalAdd():null}
        </div>);
    }

    columns = [{
        title: '资源名称',
        dataIndex: 'resource_name',
        key: 'resource_name',
        align: 'center',
      },{
        title: '资源类型',
        dataIndex: 'resource_type',
        key: 'resource_type',
        align: 'center',
        render:(record)=>{
        return <div>{record===1?"图片":record===2?"视频":"其他"}</div> 
        }
      },{
        title: '资源图片',
        dataIndex: 'resource_url',
        key: 'resource',
        align:'center',
        render:(record)=>{
            return<div style={style}>
                <img style={{width:23,height:23,display:record?'flex':'none'}} alt="" src={record}></img>
            </div>
        }
    },{
        title: '资源连接',
        dataIndex: 'resource_url',
        key: 'file_url',
        align: 'center',
        render:(record)=>{
            return <div>
                <img src="" alt=""></img>
                <CopyToClipboard text={record} onCopy={(text, result) => result?message.info("链接复制成功"):message.error("链接复制失败")}>
                    <Button>复制链接</Button>
                </CopyToClipboard>
            </div> 
        }
      },{
        title: '操作',
        key: 'options',
        align: 'center',
        render:(record)=>{
            return <div className="static-options-box">
                {/* <div className="static-options-item static-options-see">
                    <Icon type="eye"></Icon>查看
                </div> */}
                <Popconfirm title="确定要删除该资源吗？"
                    onConfirm={()=>this.onDelectStaticClick(record.id)}
                    okText="确定"
                    cancelText="取消">
                    <div className="static-options-item static-options-delete">
                        <Icon type="delete"></Icon>删除
                    </div>
                </Popconfirm>
            </div> 
        }
      }
    ];
}

export default Form.create()(Static);

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
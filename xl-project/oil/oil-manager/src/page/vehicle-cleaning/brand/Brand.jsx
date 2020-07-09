import React from 'react';
import {Table, Button, Popconfirm, Modal, Form, Input, Icon, message, Select} from 'antd';
import Upload from '../../../component/upload/Upload';
import {inject, observer} from "mobx-react/index";
import "./Brand.scss"

let page_num = 1;
const PAGE_SIZE = 15;

@inject("vehicleBrandStore")
@observer
class Brand extends React.Component {

    state = {
        modal_type:0,//1:新增 2:修改 3:查看
        modal_obj:null,//展示的modal数据
    }

    componentDidMount() {
      const params = {
        page_num:page_num,
        page_size:PAGE_SIZE
      }
      this.props.vehicleBrandStore.query(params);
    }

    //分页加载
    handleTableChange = (pagination) => {
        const pager = {...this.props.vehicleBrandStore.pagination};
        pager.current = pagination.current;
        page_num = pagination.current;
        const params = {
            page_num:page_num,
            page_size:PAGE_SIZE
        }
        this.props.vehicleBrandStore.query(params);
    }

    //删除 点击事件
    onDelectClick = (id) => {
        this.props.vehicleBrandStore.delete(id,()=>{
            const params = {
                page_num:page_num,
                page_size:PAGE_SIZE
            }
            this.props.vehicleBrandStore.query(params);
        });
    }
 
    //Table 表头
    header=()=>{
        return <Button className="vehicle-brand-table-header" size="small" type="primary" onClick={()=>this.setState({modal_type:1,modal_obj:null})}>新增</Button>
    }

    //modal 中的提交按钮 
    onModalClick = e => {
        e.preventDefault();
        const {modal_type} = this.state;//1:新增 2:修改 3:查看
        if(modal_type===3){
            this.setState({modal_type:0,modal_obj:null});
        }else{
            this.props.form.validateFields((err, values) => {
                console.log(err);
                console.log(values);
                if (!err) {
                    if(values.logo_type===1) delete values.logoUrl;
                    if(values.logo_type===2) delete values.file;
                    if(modal_type===1){//1:新增
                        this.props.vehicleBrandStore.add(values,()=>{
                            const params = {
                                page_num:page_num,
                                page_size:PAGE_SIZE
                            }
                            this.setState({modal_type:0});
                            this.props.vehicleBrandStore.query(params);
                        });
                    }else{//2:修改 
                        values.id = this.state.modal_obj.id;
                        this.props.vehicleBrandStore.update(values,()=>{
                            const params = {
                                page_num:page_num,
                                page_size:PAGE_SIZE
                            }
                            this.setState({modal_type:0});
                            this.props.vehicleBrandStore.query(params);
                        });
                    }
                }
            });
        }
    }

    //Modal 1:新增 2:修改 3:查看
    modal = () => {
        const {modal_type, modal_obj} = this.state;
        const { getFieldDecorator,getFieldsValue } = this.props.form;
        const title = modal_type===1?"新增":modal_type===2?"修改":"查看";
        const disabled = modal_type===3;
        const {logo_type=2} = getFieldsValue(["logo_type"]);
        const {modalLoading} = this.props.vehicleBrandStore;
        return <Modal visible={modal_type?true:false} 
        title={title} 
        footer={null}
        className="vehicle-brand-modal"
        onCancel={()=>{this.setState({modal_type:0})}}>
        <Form className="vehicle-brand-modal-form" layout="inline" onSubmit={this.onModalClick}>
            <Form.Item className="vehicle-brand-modal-form-item" label="品牌全称">
                {getFieldDecorator('fullName', {initialValue:modal_obj&&modal_obj.full_name,rules: [{message: '请输入品牌全称'}]})(<Input placeholder="请输入公司名称" disabled={disabled}/>)}
            </Form.Item>
            <Form.Item className="vehicle-brand-modal-form-item" label="品牌简称">
                {getFieldDecorator('brandName', {initialValue:modal_obj&&modal_obj.brand_name,rules: [{required: true,message: '请输入品牌简称'}]})
                (<Input placeholder="请输入品牌简称" disabled={disabled}/>)}
            </Form.Item>
            <Form.Item className="vehicle-brand-modal-form-item" label="品牌代码">
                {getFieldDecorator('brandCode', {initialValue:modal_obj&&modal_obj.brand_code,rules: [{required: true,message: '请输入品牌代码'}]})
                (<Input placeholder="请输入牌代码" disabled={disabled}/>)}
            </Form.Item>
            <Form.Item className="vehicle-brand-modal-form-item" label="品牌logo">
                {getFieldDecorator('logo_type',{initialValue:logo_type,rules: [{required: true,message: '请输入品牌logo'}]})
                (<Select disabled={disabled}>
                    <Select.Option value={1}>资源文件</Select.Option>
                    <Select.Option value={2}>资源地址</Select.Option>
                </Select>)}
            </Form.Item>
            {logo_type===1? 
                <Form.Item className="vehicle-brand-modal-form-item vehicle-brand-modal-other" label="">
                    {getFieldDecorator('file',{rules: [{required: true,message: '请上传资源文件'}]})
                    (<Upload type={1}></Upload>)}
                </Form.Item>:null}
            {logo_type===2? 
                <Form.Item className="vehicle-brand-modal-form-item vehicle-brand-modal-other" label="">
                    {getFieldDecorator('logoUrl',{initialValue:modal_obj&&modal_obj.logo_url,rules: [{required: true,message: '请输入品牌logo'}]})
                    (<Input.TextArea  placeholder="请输入品牌logo" disabled={disabled}/>)}
                </Form.Item>:null}
            <Form.Item className="vehicle-brand-modal-form-footer">
                <Button style={{visibility:modal_type===3?'hidden':'visible'}} onClick={()=>this.setState({modal_type:0,modal_obj:null})}>取消</Button>
                <Button type="primary" htmlType="submit" loading={modalLoading}>{modal_type===3?"确定":"提交"}</Button>
            </Form.Item>
        </Form>
    </Modal>
      
    }

    render() {
        const {modal_type} = this.state;
        const {list, loading, pagination} = this.props.vehicleBrandStore;
        return (<div className="vehicle-brand-container">
            <Table  className="vehicle-brand-table"
                bordered
                size="small"
                columns={this.columns}
                title={this.header}
                onChange={this.handleTableChange} 
                dataSource={list} 
                pagination={pagination}
                loading={loading}></Table>
            {modal_type===0?null:this.modal()}
        </div>);
    }

    columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },{
        title: '品牌全称',
        dataIndex: 'full_name',
        key: 'full_name',
        align: 'center',
      },{
        title: '品牌简称',
        dataIndex: 'brand_name',
        key: 'brand_name',
        align: 'center',
      },{
        title: '品牌代码',
        dataIndex: 'brand_code',
        key: 'brand_code',
        align: 'center',
      },{
        title: '品牌logo',
        dataIndex: 'logo_url',
        key: 'logo_url',
        align: 'center',
        render:record => {
            return <img className="vehicle-brand-logo" alt="" src={record}></img>
        }
      },{
        title: '操作',
        key: 'options',
        align: 'center',
        render:(record)=>{
            return <div className="vehicle-brand-options-box">
                <div className="vehicle-brand-options-item see" onClick={()=>this.setState({modal_type:3,modal_obj:record})}>
                    <Icon type="eye"></Icon>查看
                </div>
                <div className="vehicle-brand-options-item update" onClick={()=>this.setState({modal_type:2,modal_obj:record})}>
                    <Icon type="edit"></Icon>修改
                </div>
                <Popconfirm title="确定要删除该品牌吗？"
                    onConfirm={()=>this.onDelectClick(record.id)}
                    okText="确定"
                    cancelText="取消">
                    <div className="vehicle-brand-options-item delete">
                        <Icon type="delete"></Icon>删除
                    </div>
                </Popconfirm>
            </div> 
        }
      }
    ];
}

export default Form.create()(Brand);


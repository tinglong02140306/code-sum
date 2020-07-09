import React from "react";
import "./ComanyDialog.scss";
import {Input,Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";

@inject("companyStore")
@observer
class CompanyDialog extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            company_id:'',
            name:'',
            address:'',
            contact_person:'',
            contact_phone:'',
            xl_merchant_id:'',
            app_id:'',
            secret_key:'',
            isEmptyName:false
        }
    }

    componentDidMount(){
        const {typeModal} = this.props.companyStore;//0:增加 1:修改 2 :查看
        const {id,company_id,name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key} = this.props.companyStore.companyObject;
        if(typeModal !==0){
            this.setState({
                id:id||'',
                company_id:company_id||'',
                name:name||'',
                address:address||'',
                contact_person:contact_person||'',
                contact_phone:contact_phone||'',
                xl_merchant_id:xl_merchant_id||'',
                app_id:app_id||'',
                secret_key:secret_key||'',
                isEmptyName:false,
            });
        }

    }

    onNameChange=(e)=>{
        this.setState({name:e.target.value});
    }

    onAddressChange=(e)=>{
        this.setState({address:e.target.value});
    }

    onContactPersonChange=(e)=>{
        this.setState({contact_person:e.target.value});
    }

    onContactPhoneChange=(e)=>{
        this.setState({contact_phone:e.target.value});
    }

    onXlMerchantChange=(e)=>{
        this.setState({xl_merchant_id:e.target.value});
    }

    onAppIdChange=(e)=>{
        this.setState({app_id:e.target.value});
    }

    onSecretKeyChange=(e)=>{
        this.setState({secret_key:e.target.value});
    }

    onCancel=()=>{
        this.props.companyStore.setIsShowDialog(false);
        // this.props.companyStore.setCompanyObject(null);
    }

    onOk=()=>{

        const {typeModal} = this.props.companyStore;//0:增加 1:修改 2 :查看
        const {id,name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key} = this.state;

        if(typeModal===0){//新增
            if (isEmpty(name)) {
                this.setState({isEmptyName:true})
            }else {
                this.props.companyStore.AddCompany(name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key);
            }

        }else if(typeModal===1){//修改
            if (isEmpty(name)) {
                this.setState({isEmptyName:true})
            }else {
                this.props.companyStore.updateCompany(id,name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key);
            }
        }else{
            this.props.companyStore.setIsShowDialog(false);
            // this.props.companyStore.setCompanyObject(null);
        }

    }

    fileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                image_url: file||this.state.image_url,
                file_path:this.getObjectURL(file)
            });
        }
    }

    render(){
        const {isShowDialog,typeModal} = this.props.companyStore;//0:新增 1:修改 2 :查看
        const {isEmptyName,name,address,contact_person,contact_phone,xl_merchant_id,app_id,secret_key} = this.state;
        let title = "";
        let okText = "";
        if(typeModal===0){
            title="录入";
            okText="提交"
        }else if (typeModal===1){
            title="修改";
            okText="提交"
        }else{
            title="查看";
            okText="确定"
        }
        return (
            <Modal title={title}
                      okText={okText}
                      okType="primary"
                      cancelText="取消"
                      onCancel={this.onCancel}
                      onOk={this.onOk}
                      visible={isShowDialog}>
            <div className="company-dialog-box">
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label"><span>*</span>名称:</p>
                        <Input placeholder="名称"
                               disabled={typeModal!==2?false:true}
                               value={name}
                               onChange={this.onNameChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder"style={{visibility:isEmptyName?"visible":"hidden"}}>名称不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">地址:</p>
                        <Input placeholder="地址"
                               disabled={typeModal!==2?false:true}
                               value={address}
                               onChange={this.onAddressChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>地址不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">联系人:</p>
                        <Input placeholder="联系人"
                               disabled={typeModal!==2?false:true}
                               value={contact_person}
                               onChange={this.onContactPersonChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>ID不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">联系电话:</p>
                        <Input placeholder="联系电话"
                               disabled={typeModal!==2?false:true}
                               value={contact_phone}
                               onChange={this.onContactPhoneChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>电话不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">信联商户号:</p>
                        <Input placeholder="信联商户号"
                               disabled={typeModal!==2?false:true}
                               value={xl_merchant_id}
                               onChange={this.onXlMerchantChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>商户号不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">appId:</p>
                        <Input placeholder="appId"
                               disabled={typeModal!==2?false:true}
                               value={app_id}
                               onChange={this.onAppIdChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>电话不能为空</p>
                </div>
                <div className="company-dialog-item">
                    <div className="company-dialog-item-content">
                        <p className="company-dialog-item-label">密钥:</p>
                        <Input placeholder="密钥"
                               disabled={typeModal!==2?false:true}
                               value={secret_key}
                               onChange={this.onSecretKeyChange}></Input>
                    </div>
                    <p className="company-dialog-item-placeholder" style={{visibility: "hidden"}}>商户号不能为空</p>
                </div>
            </div>
        </Modal>
        )
    }
}

export default CompanyDialog;
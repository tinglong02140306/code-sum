import React from 'react';
import {Modal, Button,Input,Select} from 'antd';
import {observer, inject} from 'mobx-react';
import "../../page/system/user/User.scss";
@inject("systemuser")
@observer
class SystemPreviewResetDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            password: "Jy123456",
            confirmPassword:"Jy123456",
            isPasswordEmpty:false,
            isConfirmPasswordEmpty:false
        };
    }

    //校验密码
    isPasswordRight =(password)=>{
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        if (!reg.test(password)) {
            return false;
        } else {
            return true;
        }
    }

    //取消
    onCancel = () => {
        this.props.systemuser.setIsShowPreviewResetDialog(false, this.props.systemuser.previewResetType)
    }

    //提交
    onSubmit = () => {
        if (!this.isPasswordRight(this.state.password)) {
            this.setState({isPasswordEmpty:true});
        }else {
            this.setState({isPasswordEmpty:false});
        }

        if (this.state.password!==this.state.confirmPassword){
            this.setState({isConfirmPasswordEmpty:true});
        } else {
            this.setState({isConfirmPasswordEmpty:false});
        }

        if (this.isPasswordRight(this.state.password)&&this.state.password===this.state.confirmPassword) {
            this.props.systemuser.getResetPassword(this.props.systemuser.systemItemUser.id,this.state.password);
        }
    }

    //密码
    onChangePassword = (e) => {
        this.setState({password: e.target.value});
    }


    onChangeConfirmPassword = (e) => {
        this.setState({confirmPassword: e.target.value});
    }


    render() {
        const {isShowPreviewResetDialog, previewResetType,systemItemUser,isShowPreviewResetLoading,partnerList} = this.props.systemuser;
        return (<Modal
            width={500}
            onCancel={this.onCancel}
            visible={isShowPreviewResetDialog}
            title={this.props.systemuser.previewResetType===3?"查看":"重置密码"}
            footer={previewResetType === 4 ?
                [<Button key="back" onClick={this.onCancel}>取消</Button>
                    , <Button key="submit" type="primary" onClick={this.onSubmit} loading={isShowPreviewResetLoading}>提交</Button>,] :
                [<Button key="submit" type="primary" onClick={this.onCancel}>确定</Button>]}>
            <div className="user-dialog-container">
                <div className="user-dialog-left-container">
                    <div className="user-dialog-item-container">
                        <div className="user-dialog-item">
                            <div>真实姓名:</div>
                            <Input
                                maxLength={50}
                                style={{width: 250}}
                                disabled={true}
                                defaultValue={systemItemUser.real_name}/>
                        </div>
                        <div className="user-dialog-item-hint"
                             style={{visibility:"hidden"}}>真实姓名不能为空
                        </div>
                    </div>
                    <div className="user-dialog-item-container">
                        <div className="user-dialog-item">
                            <div>用户名:</div>
                            <Input
                                maxLength={50}
                                style={{width: 250}}
                                disabled={true}
                                defaultValue={systemItemUser.username}/>
                        </div>
                        <div className="user-dialog-item-hint"
                             style={{visibility:"hidden"}}>用户名不能为空
                        </div>
                    </div>
                    <div className="user-dialog-item-container">
                        <div className="user-dialog-item">
                            <div>手机号:</div>
                            <Input
                                maxLength={15}
                                style={{width: 250}}
                                disabled={true}
                                defaultValue={systemItemUser.mobile}/>
                        </div>
                        <div className="user-dialog-item-hint"
                             style={{visibility:"hidden"}}>手机号不能为空
                        </div>
                    </div>
                    <div className="user-dialog-item-container">
                        <div className="user-dialog-item">
                            <div>角色:</div>
                            <Input.TextArea
                                autosize={{minRows: 1}}
                                maxLength={50}
                                style={{width: 250}}
                                disabled={true}
                                defaultValue={systemItemUser.role}/>
                        </div>
                        <div className="user-dialog-item-hint"
                             style={{visibility:"hidden"}}>手机号不能为空
                        </div>
                    </div>
                    <div className="user-dialog-item-container">
                        <div className="user-dialog-select-item">
                            <div className="user-dialog-select">商户名称:</div>
                           <Select
                                style={{width: 250}}
                                disabled={true}
                                value={systemItemUser.partner_id}
                                defaultValue={systemItemUser.partner_id}>
                                {partnerList ? partnerList.map((item) =>{
                                    return <Select.Option value={item.partner_id} key={item.partner_id}>
                                        {item.partner_name}
                                    </Select.Option>}
                                ) : ""}
                                </Select>
                        </div>
                        <div className="user-dialog-item-hint"
                             style={{visibility:"hidden"}}>手机号不能为空
                        </div>
                    </div>
                    <div className="user-dialog-item-container"
                         style={{display: previewResetType === 4 ? "visible" : "none"}}>
                        <div className="user-dialog-item">
                            <div><span>*</span>密码:</div>
                            <Input
                                maxLength={16}
                                style={{width: 250}}
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                placeholder="8-16位必须包含数字和字母"/>
                        </div>
                        <div className="user-dialog-reset-item-hint"
                             style={{visibility:this.state.isPasswordEmpty?"visible":"hidden"}}>请设置8-16密码，必须包含数字和字母
                        </div>
                    </div>
                    <div className="user-dialog-item-container"
                         style={{display: previewResetType === 4 ? "visible" : "none"}}>
                        <div className="user-dialog-item">
                            <div><span>*</span>确认密码:</div>
                            <Input
                                maxLength={16}
                                style={{width: 250}}
                                value={this.state.confirmPassword}
                                onChange={this.onChangeConfirmPassword}
                                placeholder="请确认密码"/>
                        </div>
                        <div className="user-dialog-reset-item-hint"
                             style={{visibility:this.state.isConfirmPasswordEmpty?"visible":"hidden"}}>请确认密码
                        </div>
                    </div>
                </div>
            </div>

        </Modal>);
    }
}

export default SystemPreviewResetDialog;
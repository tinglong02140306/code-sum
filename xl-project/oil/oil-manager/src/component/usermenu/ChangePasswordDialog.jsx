import React from 'react';
import {Modal,Button,Input,message} from 'antd';
import "./ChangePasswordDialog.scss";
import http from '../../http/http';

class ChangePasswordDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            id: "",
            old_password: "",
            new_password: "",
            confirm_password: "",
            isOldPasswordEmpty: false,
            isNewPasswordEmpty: false,
            isConfirmPasswordEmpty: false,
            isPasswordEqual:true,
            submitLoading:false,
        };
    }
    //校验密码
    isPasswordRight =(password)=>{
        const reg = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,16}$/;
        if (!reg.test(password)) {
            return false;
        } else {
            return true;
        }
    }

    //取消
    onCancel = () => {
        this.props.onCancel();
    }
    //提交
    onSubmit = ()=>{
        if (!this.state.old_password) {
            this.setState({isOldPasswordEmpty:true});
        }else {
            this.setState({isOldPasswordEmpty:false});
        }

        if (!this.isPasswordRight(this.state.new_password)) {
            this.setState({isNewPasswordEmpty:true});
        }else {
            this.setState({isNewPasswordEmpty:false});
        }

        if (this.state.new_password!==this.state.confirm_password){
            this.setState({isConfirmPasswordEmpty:true});
        } else {
            this.setState({isConfirmPasswordEmpty:false});
        }
        if (this.state.old_password&&this.isPasswordRight(this.state.new_password)&&this.state.new_password===this.state.confirm_password) {
            const reqData = {
                old_password: this.state.old_password,
                new_password: this.state.new_password,
            };
            this.setState({submitLoading:true});
            http.post('/website/user/user-password-update',reqData,()=>{
                message.info("重置成功,请重新登录");
                this.setState({submitLoading:false});
                this.props.onChangeSuccess();
            },err=>{
                this.setState({submitLoading:false});
                message.error(err);
            });
        }
    }
    //旧密码
    onChangeOldPassword = (e) => {
        this.setState({old_password: e.target.value});
    }
    onClearOldPassword = () => {
        this.old_password.focus();
        this.setState({old_password: ""});
    }
    //新密码
    onChangeNewPassword = (e) => {
        this.setState({new_password: e.target.value});
    }
    onClearNewPassword = () => {
        this.new_password.focus();
        this.setState({new_password: ""});
    }

    //确认密码
    onChangeConfirmPassword = (e) => {
        this.setState({confirm_password: e.target.value});
    }
    onClearConfirmPassword = () => {
        this.confirm_password.focus();
        this.setState({confirm_password: ""});
    }

    render() {
       const {visible} = this.props;
       const {submitLoading} = this.state;
        return (

            <Modal onCancel={this.onCancel}
                   title={this.props.title||"修改密码"}
                   visible={visible}
                   width={600}
                   footer={[
                       <Button key="back" onClick={this.onCancel}>取消</Button>,
                       <Button key="submit" type="primary" onClick={this.onSubmit}
                               loading={submitLoading}>提交</Button>,]}>
                <div className="password-dialog-container">
                    <div className="password-dialog-item-container">
                        <div className="password-dialog-item">
                            <div><span>*</span>旧密码:</div>
                            <Input
                                type="password"
                                style={{width: 300}}
                                value={this.state.old_password}
                                onChange={this.onChangeOldPassword}
                                placeholder="请输入旧密码"
                            />
                        </div>
                        <div className="password-dialog-empty-hint"
                             style={{visibility: this.state.isOldPasswordEmpty ? "visible" : "hidden"}}>请输入旧密码
                        </div>
                    </div>
                    <div className="password-dialog-item-container">
                        <div className="password-dialog-item">
                            <div><span>*</span>新密码:</div>
                            <Input
                                type="password"
                                style={{width: 300}}
                                maxLength={16}
                                value={this.state.new_password}
                                onChange={this.onChangeNewPassword}
                                placeholder="含大小写字母,数字,特殊字符,长度8-16位。"
                            />
                        </div>
                        <div className="password-dialog-empty-hint"
                             style={{visibility: this.state.isNewPasswordEmpty ? "visible" : "hidden"}}>密码必须包含大小写字母,数字,特殊字符,长度8-16位。
                        </div>
                    </div>
                </div>
                <div>
                    <div className="password-dialog-item-container">
                        <div className="password-dialog-item">
                            <div><span>*</span>确认密码:</div>
                            <Input
                                type="password"
                                style={{width: 300}}
                                value={this.state.confirm_password}
                                onChange={this.onChangeConfirmPassword}
                                placeholder="确认密码"
                            />
                        </div>
                        <div className="password-dialog-empty-hint"
                             style={{visibility: this.state.isConfirmPasswordEmpty ? "visible" : "hidden"}}>请确认密码
                        </div>
                    </div>
                </div>
            </Modal>
        );

    }
}

export  default ChangePasswordDialog;
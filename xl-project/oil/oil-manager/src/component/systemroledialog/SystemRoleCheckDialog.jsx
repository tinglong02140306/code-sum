import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./SystemRoleCheckDialog.scss";

@inject("systemrole")
@observer
class SystemPreviewResetDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            password: "",
            confirmPassword:"",
            isPasswordEmpty:false,
            isConfirmPasswordEmpty:false
        };
    }

    //取消
    onCancel = () => {
        this.props.systemrole.setIsShowCheckDialog(false)
    }

    onChange=()=>{

    }

    render() {
        const {systemItemUser,isShowCheckDialog} = this.props.systemrole;
        let permissionContent = '';
        let arr = [];
        if (systemItemUser.permission_array){
            systemItemUser.permission_array.map(item=>{
                arr.push(item.name)
                permissionContent=arr.toString();
            });
        }
        let pageContent = '';
        let arr2 = [];
        if (systemItemUser.page_array){
            systemItemUser.page_array.map(item=>{
                arr2.push(item.name)
                pageContent=arr2.toString();
            });
        }

        return (
            <Modal
            visible={isShowCheckDialog}
            width={800}
            title={"查看"}
            onCancel={this.onCancel}
            footer={[<Button key="submit" type="primary" onClick={this.onCancel}>确定</Button>]}>
            <div className="check-dialog-container">
                <div className="check-dialog-left-container">
                    <div className="check-dialog-item-container">
                        <div className="check-dialog-item">
                            <div>id:</div>
                            <Input
                                disabled={true}
                                style={{width: 450}}
                                // defaultValue={systemItemUser.id}
                                onChange={this.onChange}
                                value={systemItemUser.id}
                            />
                        </div>
                        <div className="check-dialog-item-hint"
                             style={{visibility:"hidden"}}>id不能为空
                        </div>
                    </div>
                    <div className="check-dialog-item-container">
                        <div className="check-dialog-item">
                            <div>角色名称:</div>
                            <Input
                                disabled={true}
                                style={{width: 450}}
                                onChange={this.onChange}
                                // defaultValue={systemItemUser.role_name}
                                value={systemItemUser.role_name}
                                // onChange={this.onChangeUserName}
                            />
                        </div>
                        <div className="check-dialog-item-hint"
                             style={{visibility:"hidden"}}>角色名称不能为空
                        </div>
                    </div>
                    <div className="check-dialog-item-container">
                        <div className="check-dialog-item">
                            <div>角色描述:</div>
                            <Input
                                disabled={true}
                                style={{width: 450}}
                                onChange={this.onChange}
                                // defaultValue={systemItemUser.role_description}
                                value={systemItemUser.role_description}
                            />
                        </div>
                        <div className="check-dialog-item-hint"
                             style={{visibility:"hidden"}}>角色描述不能为空
                        </div>
                    </div>
                    <div className="check-dialog-item-container">
                        <div className="check-dialog-item">
                            <div>页面:</div>
                            <Input.TextArea
                                disabled={true}
                                style={{width: 450}}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                defaultValue={pageContent}
                                // value={systemItemUser.pages}
                            />
                        </div>
                        <div className="check-dialog-item-hint"
                             style={{visibility:"hidden"}}>页面不能为空
                        </div>
                    </div>
                    <div className="check-dialog-item-container">
                        <div className="check-dialog-item">
                            <div>权限:</div>
                            <Input.TextArea
                                disabled={true}
                                style={{width: 450}}
                                onChange={this.onChange}
                                autosize={{minRows: 1}}
                                defaultValue={permissionContent}
                                // value={systemItemUser.permission}
                            />
                        </div>
                        <div className="check-dialog-item-hint"
                             style={{visibility:"hidden"}}>权限不能为空
                        </div>
                    </div>
                </div>
            </div>

        </Modal>);
    }
}

export default SystemPreviewResetDialog;
import React from 'react';
import {Modal,Button,Input,Icon} from 'antd';
import {inject, observer} from "mobx-react";
import "../../page/system/permission/Permission.scss";
import "./SystemPermissionDialog.scss";
import {isSpecialChart} from "../../utils/isSpecialChart";
import {isEmpty} from "../../utils/isEmpty";

@inject("systempermission")
@observer
class SystemPermissionDialog extends React.Component{

    constructor() {
        super();
        this.state = {
            isFirst: true,
            id: "",
            permission_name: "",
            permission_value: "",
            isPerNameEmpty: false,
            isPerValueEmpty: false,
        };
    }

    componentDidMount(){
        const {type, systemItemPermission} = this.props.systempermission;
        if(type !==2){
            this.setState({
                id:systemItemPermission.id,
                permission_name:systemItemPermission.permission_name,
                permission_value:systemItemPermission.permission_value

            });
        }
    }
    //取消
    onCancel =()=>{
        this.props.systempermission.setIsShowDialog(false,0)
    }
    //提交
    onSubmit = ()=>{
        const {systemItemPermission} = this.props.systempermission;
        const {permission_name,permission_value} = this.state;

        if (isEmpty(this.state.permission_name) || isSpecialChart(this.state.permission_name)) {
            this.setState({isPerNameEmpty:true});
        }else {
            this.setState({isPerNameEmpty:false});
        }
        if (isEmpty(this.state.permission_value) || isSpecialChart(this.state.permission_value)) {
            this.setState({isPerValueEmpty:true});
        }else {
            this.setState({isPerValueEmpty:false});
        }

        if(this.props.systempermission.type===2){

            if (!isEmpty(this.state.permission_name) && !isEmpty(this.state.permission_value) && !isSpecialChart(this.state.permission_name)
                && !isSpecialChart(this.state.permission_value)){
                this.props.systempermission.getAddPermission(this.state.permission_name,this.state.permission_value)
            }
        }else {
            if (!isEmpty(this.state.permission_name) && !isEmpty(this.state.permission_value) && !isSpecialChart(this.state.permission_name)
                && !isSpecialChart(this.state.permission_value)){
                this.props.systempermission.getUpdatePermissionList(this.state.id, permission_name===systemItemPermission.permission_name?null:permission_name, permission_value===systemItemPermission.permission_value?null:permission_value)

            }

        }
    }

    //权限名称
    onChangePermissionName = (e) => {
        this.setState({permission_name: e.target.value});
    }
    onClearPermissionName = () => {
        this.permission_name.focus();
        this.setState({permission_name: ""});
    }

    //权限描述
    onChangePermissionDescribe = (e) => {
        this.setState({permission_value: e.target.value});
    };

    render(){
        const {type,isShowDialog} = this.props.systempermission;

        return(<Modal
            title={type === 1 ? "修改" : type === 3 ? "查看" :"新增"}
            visible={isShowDialog}
            onCancel={this.onCancel}
            width={600}
            bodyStyle={{width: 500,marginLeft:10}}
            footer={type === 3 ? [
                <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>,] : [
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit} loading={this.props.systempermission.isShowLoading}>提交</Button>,]}>
            <div className="permission-dialog-container">
                    <div className="permission-dialog-item-container">
                        <div className="permission-dialog-item">
                            <div><span style={{visibility: type===1 ? "visible" : type===2 ? "visible" : "hidden"}}>*</span>权限名称:</div>
                            <Input
                                type="text"
                                style={{width: 300}}
                                defaultValue={this.state.permission_name}
                                value={this.state.permission_name}
                                disabled={type===3?true:false}
                                onChange={this.onChangePermissionName}
                                ref={node => this.permission_name = node}
                                placeholder="请输入权限名称"
                                maxLength={50}
                            />
                        </div>
                        <div className="permission-dialog-empty-hint"
                             style={{visibility: this.state.isPerNameEmpty ? "visible" : "hidden"}}>请输入权限名称(不能包含特殊字符)
                        </div>
                    </div>

                    <div className="permission-dialog-item-container">
                        <div className="permission-dialog-item">
                            <div><span style={{visibility: this.props.systempermission.type===1 ? "visible" : this.props.systempermission.type===2 ? "visible" : "hidden"}}>*</span>权限值:</div>
                            <Input.TextArea
                                type="text"
                                autosize={{minRows: 1}}
                                style={{width: 300}}
                                disabled={type===3?true:false}
                                value={this.state.permission_value}
                                onChange={this.onChangePermissionDescribe}
                                ref={node => this.permission_value = node}
                                placeholder="请输入权限值"
                                maxLength={100}
                            />
                        </div>
                        <div className="permission-dialog-empty-hint"
                             style={{visibility: this.state.isPerValueEmpty ? "visible" : "hidden"}}>请输入权限值(不能包含特殊字符)
                        </div>
                    </div>
                </div>
            {/*</div>*/}

        </Modal>);
    }
}

export default SystemPermissionDialog;
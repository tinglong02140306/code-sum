import React from 'react';
import {Modal, Button, Input, Tree, Radio, Select,InputNumber} from 'antd';
import {inject, observer} from "mobx-react";
import "../../page/system/user/User.scss";
import {isPhoneRight} from "../../utils/mobile";
import {isEmpty} from "../../utils/isEmpty";
import {isSpecialChart} from "../../utils/isSpecialChart";

const RadioGroup = Radio.Group;

@inject("systemuser")
@observer
class SystemAddUserDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            isFirst: true,
            username: "",
            real_name: "",
            mobile: "",
            id: "",
            role_id_array: [],
            locked: false,
            password: "Jy123456",
            isUserNameEmpty: false,
            isRealNameEmpty: false,
            isMobileEmpty: false,
            isPasswordEmpty: false,
            isPartnerEmpty:false,
            partner:"true",
            partner_id:null,
            role_id:null
        };
    }

    componentDidMount() {
        const {systemItemUser, type} = this.props.systemuser;
        if (this.state.isFirst && type === 1) {
            this.setState({
                id: systemItemUser.id,
                username: systemItemUser.username,
                real_name: systemItemUser.real_name,
                mobile: systemItemUser.mobile,
                isFirst: false,
                partner:systemItemUser.partner_id?"true":'false',
                partner_id:systemItemUser.partner_id,
                role_id:systemItemUser.role_id,
            });
        }
    }

    //取消
    onCancel = () => {
        this.props.systemuser.setIsShowAddUpdateDialog(false, this.props.systemuser.type);
    }
    //提交
    onSubmit = () => {
        const {systemItemUser} = this.props.systemuser;
        const {mobile, real_name, intCheckKeys, username,partner,partner_id,role_id} = this.state;
        let partnerIdState = false;
        //1 : 修改 2: 新增
        if (!isEmpty(real_name)) {
            if (isSpecialChart(real_name)) {
                this.setState({isRealNameEmpty: true});
            } else {
                this.setState({isRealNameEmpty: false});
            }
        }
        const reg = /^[a-zA-z][a-zA-Z0-9]{4,19}$/;
        if (!reg.test(username)) {
            this.setState({isUserNameEmpty: true});
        } else {
            this.setState({isUserNameEmpty: false});
        }
        if (!isPhoneRight(mobile)) {
            this.setState({isMobileEmpty: true});
        } else {
            this.setState({isMobileEmpty: false});
        }
        if (partner=="true"){
            if (isEmpty(partner_id)){
                partnerIdState = false;
                this.setState({isPartnerEmpty:true});
            } else {
                partnerIdState = true;
                this.setState({isPartnerEmpty:false});
            }
        } else {
            partnerIdState = true;
        }
        if (this.props.systemuser.type === 2) {
            if (!isSpecialChart(username)&& isPhoneRight(mobile) && partnerIdState) {
                this.props.systemuser.getAddUser(username,mobile,real_name, intCheckKeys,partner,partner_id,role_id);
            }
        } else {
            if (!isSpecialChart(username)&& isPhoneRight(mobile) && partnerIdState) {
                this.props.systemuser.getUpdateUser(systemItemUser.id, mobile, real_name, intCheckKeys ,partner,partner_id,role_id)
                // this.props.systemuser.getUpdateUser(systemItemUser.id, mobile === systemItemUser.mobile ? null : mobile, real_name === systemItemUser.real_name ? null : real_name, intCheckKeys === systemItemUser.role_id_array ? null : intCheckKeys,partner === systemItemUser.partner+"" ? null : partner,partner_id===systemItemUser.partner_id?null:partner_id,role_id===systemItemUser.role_id?null:role_id)
            }
        }

    }

    //用户名
    onChangeUserName = (e) => {
        this.setState({username: e.target.value});
    }

    //真实姓名
    onChangeRealName = (e) => {
        this.setState({real_name: e.target.value});
    }

    //手机号
    onChangeMobile = (e) => {
        this.setState({mobile: e.target.value});
    }

    //密码
    onChangePassword = (e) => {
        this.setState({password: e.target.value});
    }

    //初始化title
    initTitle = (type) => {
        //1 : 修改 2: 新增
        let title = "";
        if (type === 1) {
            title = "修改信息"
        } else if (type === 2) {
            title = "增加用户"
        }
        return title;
    }

    onPartnerChange=(e)=>{
        this.setState({
            partner:e.target.value
        });
    }

    onPartnerSelectChange=(value)=>{
        this.setState({
            partner_id:value
        });
    }

    onRoleSelectChange=(value)=>{
        this.setState({
            role_id:value
        });
    }

    render() {
        const {type, partnerList,roleList} = this.props.systemuser;
        let title = this.initTitle(type);
        return <div>
            <Modal
                title={title}
                visible={this.props.systemuser.isShowAddUpdateDialog}
                onCancel={this.onCancel}
                footer={
                    [<Button key="back" onClick={this.onCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.onSubmit}
                                loading={this.props.systemuser.isShowAddUpdateLoading}>提交</Button>,]}>
                <div className="user-dialog-box">
                    <div className="user-dialog-left-container">
                        <div className="user-dialog-item-container">
                            <div className="user-dialog-item">
                                <div>真实姓名:</div>
                                <Input
                                    type="text"
                                    maxLength={50}
                                    style={{width: 250}}
                                    value={this.state.real_name}
                                    onChange={this.onChangeRealName}
                                    placeholder="请输入真实姓名"/>
                            </div>
                            <div className="user-dialog-item-hint"
                                 style={{visibility: this.state.isRealNameEmpty ? "visible" : "hidden"}}>请输入正确的真实姓名，不能包含特殊字符
                            </div>
                        </div>
                        <div className="user-dialog-item-container">
                            <div className="user-dialog-item">
                                <div><span
                                    style={{visibility: this.props.systemuser.type === 2 ? "visible" : "hidden"}}>*</span>用户名:
                                </div>
                                <Input
                                    type="text"
                                    maxLength={20}
                                    style={{width: 250}}
                                    value={this.state.username}
                                    onChange={this.onChangeUserName}
                                    disabled={type===2?false:true}
                                    placeholder="用户名只能由字母或者数字组成，必须字母开头，长度4-20位"/>
                            </div>
                            <div className="user-dialog-item-hint"
                                 style={{visibility: this.state.isUserNameEmpty ? "visible" : "hidden"}}>用户名只能由字母或者数字组成，必须字母开头，长度4-20位
                            </div>
                        </div>
                        <div className="user-dialog-item-container">
                            <div className="user-dialog-item">
                                <div><span
                                    style={{visibility: this.props.systemuser.type === 2 ? "visible" : "hidden"}}>*</span>手机号:
                                </div>
                                <Input
                                    maxLength={11}
                                    type={"number"}
                                    style={{width: 250}}
                                    value={this.state.mobile}
                                    onChange={this.onChangeMobile}
                                    placeholder="请输入正确的11位手机号"/>
                            </div>
                            <div className="user-dialog-item-hint"
                                 style={{visibility: this.state.isMobileEmpty ? "visible" : "hidden"}}>请输入正确的11位手机号
                            </div>
                        </div>
                        <div className="user-dialog-item-container">
                            <div className="user-partner-item">
                                <div className="user-partner-label"><span>*</span>是否商户:</div>
                                <RadioGroup onChange={this.onPartnerChange}
                                            defaultValue={this.state.partner}
                                            value={this.state.partner} style={{width: 250}}>
                                    <Radio value="true">是</Radio>
                                    <Radio value="false">否</Radio>
                                </RadioGroup>
                            </div>
                            <div className="user-dialog-item-hint"
                                 style={{visibility: "hidden"}}>占位
                            </div>
                        </div>
                        <div className="user-dialog-item-container"
                             style={{display: this.state.partner==='true' ? "flex" : "none"}}>
                            <div className="user-partner-select">
                                <div className="user-partner-label" style={{visibility: "hidden"}}><span>*</span>是否商户:</div>
                                <Select
                                    style={{width: 250}}
                                    value={this.state.partner_id}
                                    defaultValue={this.state.partner_id}
                                    onChange={this.onPartnerSelectChange}>
                                    {partnerList ? partnerList.map((item) =>{
                                       return <Select.Option value={item.partner_id} key={item.partner_id}>
                                            {item.partner_name}
                                        </Select.Option>}
                                    ) : ""}
                                </Select>
                            </div>
                            <div className="user-dialog-item-hint"
                                 style={{visibility: this.state.isPartnerEmpty?"visible":"hidden"}}>请选择商户名称
                            </div>
                        </div>
                        <div className="user-dialog-item-container">
                            <div className="user-partner-item">
                                <div className="user-partner-label"><span>*</span>角色:</div>
                                <Select
                                    style={{width: 250}}
                                    value={this.state.role_id}
                                    defaultValue={this.state.role_id}
                                    onChange={this.onRoleSelectChange}>
                                    {roleList ? roleList.map((item) =>{
                                        return <Select.Option value={item.id} key={item.id}>
                                            {item.role_name}
                                        </Select.Option>}
                                    ) : ""}
                                </Select>
                            </div>
                            <div className="user-dialog-item-hint"
                                style={{visibility: this.state.isEmptyCheckKeys?"visible":"hidden",marginLeft:30}}>请选择角色
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            </div>;
    }
}

export default SystemAddUserDialog;

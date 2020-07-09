import React from 'react';
import {Modal, Button, Input, Tree, Icon} from 'antd';
import {inject, observer} from "mobx-react";
import "./SystemRoleDialog.scss";
import {isEmpty} from "../../utils/isEmpty";
import {intToStringArray} from "../../utils/intToStringArray";
import {isSpecialChart} from "../../utils/isSpecialChart";
import {addPermissionTreeKey} from "../../utils/addPermissionTreeKey";

@inject("systemrole")
@observer
class SystemRoleDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            isFirst: true,
            id: "",
            role_name: "",
            role_description: "",
            permission_id_array: [],
            isRoleNameEmpty: false,
            isRoleDescribeEmpty: false,
            isCheckKeysEmpty: false,
            isPagesCheckKeysEmpty: false,
            checkedKeys: [],//权限列表
            intCheckKeys: [],//权限列表
            pagesCheckedKeys: [],//页面列表
            pagesIntCheckKeys: [],//页面列表
            treeData: [{title: "全部", key: "all", children: []}],
            treeData1: [{title: "全部", key: "all", children: []}],
            // pagesTreeData: [{title: "全部", key: "all", children: []}]
            isPermissionSearch:false,
            isPageSearch:false,
        };
    }

    componentDidMount() {
        const {type, systemItemRole, permissionList,pagesList} = this.props.systemrole;
        if (this.state.isFirst && type !== 2) {
            let permission_id_array=[];
            let page_id_array=[];
            if (systemItemRole.permission_array){
                for (let i = 0; i < systemItemRole.permission_array.length; i++) {
                    permission_id_array.push((systemItemRole.permission_array[i]).id);
                }
            }
            if (systemItemRole.page_array){
                for (let i = 0; i < systemItemRole.page_array.length; i++) {
                    page_id_array.push((systemItemRole.page_array[i]).id);
                }
            }
            this.setState({
                id: systemItemRole.id,
                role_name: systemItemRole.role_name,
                role_description: systemItemRole.role_description,
                permission_id_array: permission_id_array,
                treeData: permissionList,
                checkedKeys: intToStringArray(permission_id_array),
                intCheckKeys: permission_id_array,
                treeData1: pagesList,
                pagesCheckedKeys: intToStringArray(page_id_array),
                pagesIntCheckKeys: page_id_array

            });
        } else {
            this.setState({
                treeData: permissionList,
                treeData1:pagesList
            });
        }
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode {...item} />;
        });

    }
    onSearchChange = (e) => {
        const value = e.target.value;
        if (!isEmpty(value)) {
            const newChildren = [];
            // this.props.systemrole.permissionList[0].children.filter((item) => {
            this.props.systemrole.permissionList.filter((item) => {
                if (item.title.indexOf(value) >= 0) {
                    newChildren.push(item);
                }
            });
            const filterData = [{title: "全部", key: "all", children: newChildren}];
            this.setState({
                treeData: newChildren
            });
        } else {
            this.setState({
                treeData: this.props.systemrole.permissionList
            });
        }

    }
    onSearchChangePages = (e) => {
        const value = e.target.value;
        if (!isEmpty(value)) {
            const newChildren = [];
            // this.props.systemrole.pagesList[0].children.filter((item) => {
            this.props.systemrole.pagesList.filter((item) => {
                if (item.title.indexOf(value) >= 0) {
                    newChildren.push(item);
                }
            });
            const filterData = [{title: "全部", key: "all", children: newChildren}];
            this.setState({
                treeData1: newChildren,
                isPageSearch:true,
            });
        } else {
            this.setState({
                treeData1: this.props.systemrole.pagesList
            });
        }
    }

    onCheck = (checkedKeys) => {
        let arrayInt = [];
        for (let i = 0; i < checkedKeys.length; i++) {
            if (checkedKeys[i] !== "all") {
                arrayInt.push(parseInt(checkedKeys[i], 10));
            }
        }
        this.setState({
            checkedKeys: checkedKeys,
            intCheckKeys: arrayInt
        });

    }
    onCheckPages = (checkedKeys) =>{
        let arrayInt = [];
        for (let i = 0; i < checkedKeys.length; i++) {
            if (checkedKeys[i] !== "all") {
                arrayInt.push(parseInt(checkedKeys[i], 10));
            }
        }
        this.setState({
            pagesCheckedKeys: checkedKeys,
            pagesIntCheckKeys: arrayInt
        });
        // if (this.state.isPageSearch){
        //     let keysData =this.state.pagesCheckedKeys
        //     let arr = keysData.concat(checkedKeys);//合并
        //     let newCheckedKeys = [];//新数组
        //     let obj={}
        //     console.log('keysData'+keysData)
        //     console.log('checkedKeys'+checkedKeys)
        //     console.log(arr)
        //     for (let i = 0; i < arr.length; i++) {
        //         if (!obj[arr[i]]) {
        //             newCheckedKeys.push(arr[i])
        //         }
        //     }
        //     console.log('newCheckedKeys'+newCheckedKeys)
        //
        //     this.setState({
        //         pagesCheckedKeys: arr,
        //         pagesIntCheckKeys: arrayInt
        //     });
        //
        // }else {
        //     this.setState({
        //         pagesCheckedKeys: checkedKeys,
        //         pagesIntCheckKeys: arrayInt
        //     });
        // }

    }
    //取消
    onCancel = () => {
        this.props.systemrole.setIsShowDialog(false, 0)
    }
    //提交
    onSubmit = () => {

        const {systemItemRole} = this.props.systemrole;

        const {role_name, role_description, intCheckKeys,pagesIntCheckKeys} = this.state;

        if (isEmpty(this.state.role_name) || isSpecialChart(this.state.role_name)) {
            this.setState({isRoleNameEmpty: true});
        } else {
            this.setState({isRoleNameEmpty: false});
        }

        if (this.state.intCheckKeys.length===0) {
            this.setState({isCheckKeysEmpty :true});
            return;

        }else {
            this.setState({isCheckKeysEmpty :false});
        }

        if (this.state.pagesIntCheckKeys.length===0) {
            this.setState({isPagesCheckKeysEmpty :true});
        }else {
            this.setState({isPagesCheckKeysEmpty :false});
        }

        if (isSpecialChart(this.state.role_description)) {

            this.setState({isRoleDescribeEmpty: true});
        } else {
            this.setState({isRoleDescribeEmpty: false});
        }

        if (this.props.systemrole.type === 2) {
            //todo this.setState(); 为异步处理
            if (!isEmpty(this.state.role_name) && !isSpecialChart(this.state.role_name) && !isSpecialChart(this.state.role_description)) {
                this.props.systemrole.getAddRole(this.state.role_name, this.state.role_description, this.state.intCheckKeys,this.state.pagesIntCheckKeys)
            }
        } else {
            if (!isEmpty(this.state.role_name) && !isSpecialChart(this.state.role_name) && !isSpecialChart(this.state.role_description)) {
                this.props.systemrole.getUpdateRole(this.state.id, role_name === systemItemRole.role_name ? null : role_name, role_description === systemItemRole.role_description ? null : role_description, intCheckKeys === systemItemRole.permission_id_array ? null : intCheckKeys,pagesIntCheckKeys === systemItemRole.page_id_array ? null : pagesIntCheckKeys)
            }
        }
    }

    //角色名称
    onChangeRoleName = (e) => {
        this.setState({role_name: e.target.value});
    }
    onClearRoleName = () => {
        this.role_name.focus();
        this.setState({role_name: ""});
    }

    //角色描述
    onChangeRoleDescribe = (e) => {
        this.setState({role_description: e.target.value});
    }
    onClearRoleDescribe = () => {
        this.role_description.focus();
        this.setState({role_description: ""});
    }


    render() {
        const {type} = this.props.systemrole;

        const roleName = this.state.role_name && type !== 2 ?
            <Icon type="close-circle" onClick={this.onClearRoleName} style={{color: "#d5d5d5"}}/> : null;
        const roleDescribe = this.state.role_description && type !== 2 ?
            <Icon type="close-circle" onClick={this.onClearRoleDescribe} style={{color: "#d5d5d5"}}/> : null;

        return (<Modal
            title={type === 1 ? "修改" : type === 3 ? "查看" : "新增"}
            visible={this.props.systemrole.isShowDialog}
            onCancel={this.onCancel}
            width={1200}
            footer={type === 3 ? [
                <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>,] : [
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit}
                        loading={this.props.systemrole.isShowLoading}>提交</Button>,]}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'flex-start'}}>
                <div className="role-dialog-left-container">
                    <div className="role-dialog-item-container">
                        <div className="role-dialog-item">
                            <div><span
                                style={{visibility: this.props.systemrole.type === 1 ? "visible" : this.props.systemrole.type === 2 ? "visible" : "hidden"}}>*</span>角色名称:
                            </div>
                            <Input
                                disabled={type === 3 ? true : false}
                                type="text"
                                suffix={roleName}
                                style={{width: 250}}
                                value={this.state.role_name}
                                onChange={this.onChangeRoleName}
                                ref={node => this.role_name = node}
                                placeholder="请输入角色名称"
                                maxLength={50}
                            />
                        </div>
                        <div className="role-dialog-item-hint"
                             style={{visibility: this.state.isRoleNameEmpty ? "visible" : "hidden"}}>请输入角色名称(不能包含特殊字符)
                        </div>
                    </div>

                    <div className="role-dialog-item-container">
                        <div className="role-dialog-item">
                            <div><span
                                style={{visibility: this.props.systemrole.type === 1 ? "visible" : this.props.systemrole.type === 2 ? "visible" : "hidden"}}>*</span>角色描述:</div>
                            <Input.TextArea
                                autosize={{minRows: 1}}
                                disabled={type === 3 ? true : false}
                                type="text"
                                suffix={roleDescribe}
                                style={{width: 250}}
                                value={this.state.role_description}
                                onChange={this.onChangeRoleDescribe}
                                ref={node => this.role_description = node}
                                placeholder="请输入角色描述"
                                maxLength={100}
                            />
                        </div>
                        <div className="role-dialog-item-hint"
                             style={{visibility: this.state.isRoleDescribeEmpty ? "visible" : "hidden"}}>请输入角色描述(不能包含特殊字符)
                        </div>
                    </div>
                    <div className="role-dialog-right-container">
                        <div className="role-dialog-right">
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'flex-end',
                                width: '130px',
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginRight: '10px'
                            }}><span
                                style={{visibility: this.props.systemrole.type === 1 ? "visible" : this.props.systemrole.type === 2 ? "visible" : "hidden",color: "#c90000",marginRight:"5"}}>*</span>页面选择:
                            </div>
                            <div className="role-dialog-right-permission-container">
                                <Input.Search
                                    style={{width: 250}}
                                    placeholder="查询/搜索"
                                    onChange={this.onSearchChangePages}/>
                                <div className="role-dialog-select-hint"
                                     style={{visibility: this.state.isPagesCheckKeysEmpty ? "visible" : "hidden"}}>请选择页面
                                </div>
                                <div style={{
                                    // height:this.state.treeData1[0].children.length >= 12? 400 :"auto",
                                    // overflowY: this.state.treeData1[0].children.length >= 12 ? "scroll" : "hidden",
                                    height:this.state.treeData1.length >= 12? 400 :"auto",
                                    overflowY: this.state.treeData1.length >= 12 ? "scroll" : "hidden",
                                    overflowX: "hidden",
                                }}>
                                    <Tree
                                        checkable
                                        onCheck={this.onCheckPages}
                                        checkedKeys={this.state.pagesCheckedKeys}
                                        defaultExpandAll={true}>{this.renderTreeNodes(this.state.treeData1)}</Tree>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="role-dialog-left-container">
                    <div className="role-dialog-right">
                        <div className="role-dialog-right-permission"><span
                            style={{visibility: this.props.systemrole.type === 1 ? "visible" : this.props.systemrole.type === 2 ? "visible" : "hidden",color: "#c90000",marginRight:"5px"}}>*</span>权限:</div>
                        <div className="role-dialog-right-permission-container">
                            <Input.Search
                                style={{width: 250}}
                                placeholder="查询/搜索"
                                onChange={this.onSearchChange}/>
                            <div className="role-dialog-select-hint"
                                 style={{visibility: this.state.isCheckKeysEmpty ? "visible" : "hidden"}}>请选择权限
                            </div>
                            <div style={{
                                // height: this.state.treeData[0].children.length >= 12 ? 400 : "auto",
                                // overflowY: this.state.treeData[0].children.length >= 12 ? "scroll" : "hidden",
                                height: this.state.treeData.length >= 12 ? 400 : "auto",
                                overflowY: this.state.treeData.length >= 12 ? "scroll" : "hidden",
                                overflowX: "hidden",
                            }}>
                                <Tree
                                    checkable
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    defaultExpandAll={true}>{this.renderTreeNodes(this.state.treeData)}</Tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>);
    }
}

export default SystemRoleDialog;

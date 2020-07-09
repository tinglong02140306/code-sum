import React from 'react';
import './SystemPagesDialog.scss';
import {Modal,Button,Input,Icon} from 'antd';
import {inject, observer} from "mobx-react";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {isEmpty} from "../../../utils/isEmpty";

@inject("pageStore")
@observer
class SystemPagesDialog extends React.Component{

    constructor() {
        super();
        this.state = {
            isFirst: true,
            id: "",
            pageName: "",
            pageValue: "",
            isPageNameEmpty: false,
            isPageValueEmpty: false,
        };
    }

    componentDidMount(){
        const {type, systemItemPage} = this.props.pageStore;
        if(type !==2){
            this.setState({
                id:systemItemPage.id,
                pageName:systemItemPage.page_name,
                pageValue:systemItemPage.page_value
            });
        }
    }
    //取消
    onCancel =()=>{
        this.props.pageStore.setIsShowDialog(false,0)
    }
    //提交
    onSubmit = ()=>{
        const {systemItemPage} = this.props.pageStore;
        const {pageName,pageValue} = this.state;

        if (isEmpty(this.state.pageName) || isSpecialChart(this.state.pageName)) {
            this.setState({isPageNameEmpty:true});
        }else {
            this.setState({isPageNameEmpty:false});
        }
        if (isEmpty(this.state.pageValue) || isSpecialChart(this.state.pageValue)) {
            this.setState({isPageValueEmpty:true});
        }else {
            this.setState({isPageValueEmpty:false});
        }

        if(this.props.pageStore.type===2){

            if (!isEmpty(this.state.pageName) && !isEmpty(this.state.pageValue) && !isSpecialChart(this.state.pageName)
                && !isSpecialChart(this.state.pageValue)){
                this.props.pageStore.getAddPages(this.state.pageName,this.state.pageValue)
            }
        }else {
            if (!isEmpty(this.state.pageName) && !isEmpty(this.state.pageValue) && !isSpecialChart(this.state.pageName)
                && !isSpecialChart(this.state.pageValue)){
                this.props.pageStore.getUpdatePage(this.state.id, pageName===systemItemPage.pageName?null:pageName, pageValue===systemItemPage.pageValue?null:pageValue)

            }

        }
    }

    //权限名称
    onChangePageName = (e) => {
        this.setState({pageName: e.target.value});
    }
    onClearPageName = () => {
        this.pageName.focus();
        this.setState({pageName: ""});
    }

    //权限描述
    onChangePageDescribe = (e) => {
        this.setState({pageValue: e.target.value});
    }
    onClearPageDescribe = () => {
        this.pageValue.focus();
        this.setState({pageValue: ""});
    }

    render(){
        const {type} = this.props.pageStore;

        const roleName = this.state.pageName && type !== 3 ?
            <Icon type="close-circle" onClick={this.onClearPageName} style={{color: "#d5d5d5"}}/> : null;
        const roleDescribe = this.state.pageValue && type !== 3 ?
            <Icon type="close-circle" onClick={this.onClearPageDescribe} style={{color: "#d5d5d5"}}/> : null;

        return(<Modal
            title={type === 1 ? "修改" : type === 3 ? "查看" :"新增"}
            visible={this.props.pageStore.isShowDialog}
            onCancel={this.onCancel}
            width={600}
            bodyStyle={{width: 500,marginLeft:10}}
            footer={type === 3 ? [
                <Button key="back" type="primary" onClick={this.onCancel}>确定</Button>,] : [
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit} loading={this.props.pageStore.isShowLoading}>提交</Button>,]}>
            <div className="permission-dialog-container">
                {/*<div className="permission-dialog-input">*/}

                <div className="permission-dialog-item-container">
                    <div className="permission-dialog-item">
                        <div><span style={{visibility: this.props.pageStore.type===1 ? "visible" : this.props.pageStore.type===2 ? "visible" : "hidden"}}>*</span>页面名称:</div>
                        <Input
                            // disabled={type === 3 ? true : false}
                            type="text"
                            // suffix={roleName}
                            style={{width: 300}}
                            defaultValue={this.state.pageName}
                            value={this.state.pageName}
                            disabled={type===3?true:false}
                            onChange={this.onChangePageName}
                            ref={node => this.pageName = node}
                            placeholder="请输入页面名称"
                            maxLength={50}
                        />
                    </div>
                    <div className="permission-dialog-empty-hint"
                         style={{visibility: this.state.isPageNameEmpty ? "visible" : "hidden"}}>请输入页面名称(不能包含特殊字符)
                    </div>
                </div>

                <div className="permission-dialog-item-container">
                    <div className="permission-dialog-item">
                        <div><span style={{visibility: this.props.pageStore.type===1 ? "visible" : this.props.pageStore.type===2 ? "visible" : "hidden"}}>*</span>页面值:</div>
                        <Input.TextArea
                            type="text"
                            autosize={{minRows: 1}}
                            // suffix={roleDescribe}
                            style={{width: 300}}
                            disabled={type===3?true:false}
                            value={this.state.pageValue}
                            onChange={this.onChangePageDescribe}
                            ref={node => this.pageValue = node}
                            placeholder="请输入页面值"
                            maxLength={100}
                        />
                    </div>
                    <div className="permission-dialog-empty-hint"
                         style={{visibility: this.state.isPageValueEmpty ? "visible" : "hidden"}}>请输入页面值(不能包含特殊字符)
                    </div>
                </div>
            </div>
            {/*</div>*/}

        </Modal>);
    }
}

export default SystemPagesDialog;
import React from 'react';
import {Modal,Button,Input,Icon} from 'antd';
import {inject, observer} from "mobx-react";
import "./EhsActivityDialog.scss";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {isEmpty} from "../../../utils/isEmpty";

@inject("ehsActivityStore")
@observer
class EhsSinglePushDialog extends React.Component{

    constructor() {
        super();
        this.state = {
            coupon_type: "",
            mobile: "",
            real_name: "",
            cert_no: "",
            isMobileEmpty: false,
            isRealNameEmpty: false,
            isCertNoEmpty: false,
        };
    }

    componentDidMount(){

    }
    //取消
    onCancel =()=>{
        this.props.ehsActivityStore.setIsShowSingleDialog(false,10)
    }
    //提交
    onSubmit = ()=>{
        const {type} = this.props.ehsActivityStore;
        const {mobile,real_name,cert_no,isMobileEmpty,isRealNameEmpty,isCertNoEmpty} = this.state;

        if (isEmpty(real_name) || isSpecialChart(real_name)) {
            this.setState({isRealNameEmpty:true});
        }else {
            this.setState({isRealNameEmpty:false});
        }
        if (isEmpty(mobile) || isSpecialChart(mobile)) {
            this.setState({isMobileEmpty:true});
        }else {
            this.setState({isMobileEmpty:false});
        }

        if (isEmpty(cert_no) || isSpecialChart(cert_no)) {
            this.setState({isCertNoEmpty:true});
        }else {
            this.setState({isCertNoEmpty:false});
        }

        if (!isEmpty(real_name) && !isEmpty(mobile) && !isEmpty(cert_no)  && !isSpecialChart(real_name) && !isSpecialChart(mobile)
            && !isSpecialChart(cert_no)){
            this.props.ehsActivityStore.singleAddCoupon(type,mobile,real_name,cert_no)
        }
    }

    //名称
    onChangeName = (e) => {
        this.setState({real_name: e.target.value});
    }
    onClearName = () => {
        this.real_name.focus();
        this.setState({real_name: ""});
    }

    //手机号
    onChangeMobile = (e) => {
        this.setState({mobile: e.target.value});
    }
    onClearMobile = () => {
        this.mobile.focus();
        this.setState({mobile: ""});
    }
    //证件号
    onChangeCertNo = (e) => {
        this.setState({cert_no: e.target.value});
    }
    onClearCertNo = () => {
        this.mobile.focus();
        this.setState({cert_no: ""});
    }

    render(){
        const {type,isShowSingleDialog,isShowLoading} = this.props.ehsActivityStore;
        const {mobile,real_name,cert_no,isMobileEmpty,isRealNameEmpty,isCertNoEmpty} = this.state;
        const nameSuffix = this.state.real_name ?
            <Icon type="close-circle" onClick={this.onClearName} style={{color: "#d5d5d5"}}/> : null;
        const mobileSuffix = this.state.mobile ?
            <Icon type="close-circle" onClick={this.onClearMobile} style={{color: "#d5d5d5"}}/> : null;
        const certNoSuffix = this.state.cert_no ?
            <Icon type="close-circle" onClick={this.onClearMobile} style={{color: "#d5d5d5"}}/> : null;
        return(<Modal
            title={type===10?"10元代金券投放":"300元代金券投放"}
            visible={isShowSingleDialog}
            onCancel={this.onCancel}
            width={600}
            bodyStyle={{width: 500,marginLeft:10}}
            footer={<Button key="submit" type="primary" onClick={this.onSubmit} loading={isShowLoading}>提交</Button>}>
            <div className="e-single-dialog-container">
                <div className="e-single-dialog-item-container">
                    <div className="e-single-dialog-item">
                        <div><span style={{visibility:"visible"}}>*</span>姓名:</div>
                        <Input
                            type="text"
                            suffix={nameSuffix}
                            style={{width: 300}}
                            value={real_name}
                            onChange={this.onChangeName}
                            ref={node => this.real_name = node}
                            placeholder="请输入姓名"
                            maxLength={20}
                        />
                    </div>
                    <div className="e-single-dialog-empty-hint"
                         style={{visibility: isRealNameEmpty ? "visible" : "hidden"}}>请输入姓名(不能包含特殊字符)
                    </div>
                </div>
                <div className="e-single-dialog-item-container">
                    <div className="e-single-dialog-item">
                        <div><span style={{visibility: "visible"}}>*</span>手机号:</div>
                        <Input
                            type="text"
                            suffix={mobileSuffix}
                            style={{width: 300}}
                            value={mobile}
                            onChange={this.onChangeMobile}
                            ref={node => this.mobile = node}
                            placeholder="请输入手机号"
                            maxLength={11}
                        />
                    </div>
                    <div className="e-single-dialog-empty-hint"
                         style={{visibility: isMobileEmpty ? "visible" : "hidden"}}>请输入手机号(不能包含特殊字符)
                    </div>
                </div>
                <div className="e-single-dialog-item-container">
                    <div className="e-single-dialog-item">
                        <div><span style={{visibility: "visible"}}>*</span>证件号:</div>
                        <Input
                            type="text"
                            suffix={certNoSuffix}
                            style={{width: 300}}
                            value={cert_no}
                            onChange={this.onChangeCertNo}
                            ref={node => this.cert_no = node}
                            placeholder="请输入证件号"
                            maxLength={18}
                        />
                    </div>
                    <div className="e-single-dialog-empty-hint"
                         style={{visibility: isCertNoEmpty ? "visible" : "hidden"}}>请输入证件号(不能包含特殊字符)
                    </div>
                </div>
            </div>
        </Modal>);
    }
}

export default EhsSinglePushDialog;
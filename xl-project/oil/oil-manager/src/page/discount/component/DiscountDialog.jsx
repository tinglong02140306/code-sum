import React from "react";
import "./DiscountDialog.scss";
import {Input,Modal,Radio} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {isVehicleNumber} from "../../../utils/utils";

@inject("discountStore")
@observer
class DiscountDialog extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            name:'',
            discount_rate:'',
            amount:'',
            investor:null,
            isEmptyName:false,
            isEmptyRate:false,
            isEmptyAmount:false,
            isEmptyInvestor:false,
        }
    }

    componentDidMount(){
        const {typeModal} = this.props.discountStore;//0:增加 1:修改 2 :查看
        const {id,name,discount_rate,amount,investor} = this.props.discountStore.discountObject;
        if(typeModal !==0){
            this.setState({
                id:id||'',
                name:name||'',
                discount_rate:discount_rate||'',
                amount:amount||'',
                investor:investor||null,
            });
        }
    }

    onNameChange=(e)=>{
        this.setState({name:e.target.value});
    }

    onRateChange=(e)=>{
        this.setState({discount_rate:e.target.value});
    }

    onAmountChange=(e)=>{
        this.setState({amount:e.target.value});
    }

    onInvestorChange=(e)=>{
        this.setState({investor:e.target.value});
    }

    onCancel=()=>{
        this.props.discountStore.setIsShowDialog(false);
    }

    onOk=()=>{

        const {typeModal} = this.props.discountStore;//0:增加 1:修改 2 :查看
        const {id,name,discount_rate,amount,investor} = this.state;

        if(typeModal===0){//新增
            if (name && discount_rate && amount){
                this.props.discountStore.AddDiscount(name,discount_rate,amount,investor);
            }else {
                this.dealData();
            }
        }else if(typeModal===1){//修改
            if (name && discount_rate && amount){
                this.props.discountStore.updateDiscount(id,name,discount_rate,amount,investor);
            }else {
                this.dealData();
            }
        }else{
            this.props.discountStore.setIsShowDialog(false);
        }

    }

    /**
     *提交前的校验
     */
    dealData=()=>{
        const {name,discount_rate,amount,investor} = this.state;
        this.setState({
            isEmptyName:isEmpty(name)?true:false,
            isEmptyRate:isEmpty(discount_rate)?true:false,
            isEmptyAmount:isEmpty(amount)?true:false,
            // isEmptyInvestor:isEmpty(investor)?true:false,
        });
    }

    render(){
        const {isShowDialog,typeModal,isShowSubmitLoading} = this.props.discountStore;//0:新增 1:修改 2 :查看
        const {isEmptyName,isEmptyRate,isEmptyAmount,isEmptyInvestor,name,discount_rate,amount,investor} = this.state;
        let title = "";
        let okText = "";
        if(typeModal===0){
            title="添加";
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
                   confirmLoading={isShowSubmitLoading}
                   visible={isShowDialog}>
                <div className="discount-dialog-box">
                    <div className="discount-dialog-item">
                        <div className="discount-dialog-item-content">
                            <p className="discount-dialog-item-label"><span>*</span>名称:</p>
                            <Input placeholder="名称"
                                   disabled={typeModal!==2?false:true}
                                   value={name}
                                   onChange={this.onNameChange}></Input>
                        </div>
                        <p className="discount-dialog-item-placeholder"style={{visibility:isEmptyName?"visible":"hidden"}}>名称不能为空</p>
                    </div>
                    <div className="discount-dialog-item">
                        <div className="discount-dialog-item-content">
                            <p className="discount-dialog-item-label"><span>*</span>折扣率:</p>
                            <Input placeholder="折扣率"
                                   disabled={typeModal!==2?false:true}
                                   value={discount_rate}
                                   onChange={this.onRateChange}></Input>
                        </div>
                        <p className="discount-dialog-item-placeholder" style={{color:'#FF832E'}}>(折扣率用以计算折扣，例如：0.04)</p>
                        <p className="discount-dialog-item-placeholder" style={{display:isEmptyRate?"flex":"none"}}>折扣率不能为空</p>
                    </div>
                    <div className="discount-dialog-item">
                        <div className="discount-dialog-item-content">
                            <p className="discount-dialog-item-label"><span>*</span>触发金额:</p>
                            <Input placeholder="触发金额"
                                   disabled={typeModal!==2?false:true}
                                   value={amount}
                                   onChange={this.onAmountChange}></Input>
                        </div>
                        <p className="discount-dialog-item-placeholder" style={{visibility:isEmptyAmount?"visible":"hidden"}}>触发金额不能为空</p>
                    </div>
                    {/*<div className="discount-dialog-item">*/}
                    {/*    <div className="discount-dialog-item-content">*/}
                    {/*        <p className="discount-dialog-item-label"><span>*</span>出资方:</p>*/}
                    {/*        <Radio.Group onChange={this.onInvestorChange} value={investor} style={{width:250}}>*/}
                    {/*            <Radio value={1}>信联</Radio>*/}
                    {/*            <Radio value={2}>油站</Radio>*/}
                    {/*        </Radio.Group>*/}
                    {/*    </div>*/}
                    {/*    <p className="discount-dialog-item-placeholder" style={{visibility:isEmptyInvestor?"visible":"hidden"}}>请选择出资方</p>*/}
                    {/*</div>*/}
                </div>
            </Modal>
        )
    }
}

export default DiscountDialog;
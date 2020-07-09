import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./OilPriceDialog.scss";
import {isEmpty} from "../../../utils/isEmpty";
import {isSpecialChart} from "../../../utils/isSpecialChart";
import {isMoney} from "../../../utils/utils";
@inject("oilPriceStore")
@observer
class ReportDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            id:"",
            province_name: "",
            no_eighty_nine_gasoline: "",
            no_ninety_two_gasoline: "",
            no_ninety_five_gasoline: "",
            no_zero_diesel_oil: "",
            no_ninety_eight_gasoline: "",
            no_one_diesel_oil: "",
            no_e_ninety_two_gasoline: "",
            no_two_diesel_oil: "",
            create_time: "",
            is89GasolineEmpty: false,
            is92GasolineEmpty: false,
            is95GasolineEmpty: false,
            is0DieselOilEmpty: false,
            is98GasolineEmpty: false,
            is1DieselOilEmpty: false,
            isE92GasolineEmpty: false,
            is2DieselOilEmpty: false,
        };
    }

    //取消
    onCancel = () => {
        this.props.oilPriceStore.setIsShowDialog(false)
    }
    //提交
    onSubmit =()=>{
        const {
            id,no_eighty_nine_gasoline,no_ninety_two_gasoline, no_ninety_five_gasoline, no_zero_diesel_oil, no_ninety_eight_gasoline, no_one_diesel_oil, no_e_ninety_two_gasoline, no_two_diesel_oil,is89GasolineEmpty, is92GasolineEmpty, is95GasolineEmpty, is0DieselOilEmpty, is98GasolineEmpty, is1DieselOilEmpty, isE92GasolineEmpty,is2DieselOilEmpty
        } = this.state;

        if (isEmpty(no_eighty_nine_gasoline) || !isMoney(no_eighty_nine_gasoline)) {
            this.setState({is89GasolineEmpty:true});
        }else {
            this.setState({is89GasolineEmpty:false});
        }
        if (isEmpty(no_ninety_two_gasoline) || !isMoney(no_ninety_two_gasoline) ) {
            this.setState({is92GasolineEmpty:true});
        }else {
            this.setState({is92GasolineEmpty:false});
        }
        if (isEmpty(no_ninety_five_gasoline) || !isMoney(no_ninety_five_gasoline)) {
            this.setState({is95GasolineEmpty:true});
        }else {
            this.setState({is95GasolineEmpty:false});
        }
        if (isEmpty(no_zero_diesel_oil) || !isMoney(no_zero_diesel_oil)) {
            this.setState({is0DieselOilEmpty:true});
        }else {
            this.setState({is0DieselOilEmpty:false});
        }
        if (isEmpty(no_ninety_eight_gasoline) || !isMoney(no_ninety_eight_gasoline)) {
            this.setState({is98GasolineEmpty:true});
        }else {
            this.setState({is98GasolineEmpty:false});
        }
        if (isEmpty(no_one_diesel_oil) || !isMoney(no_one_diesel_oil)) {
            this.setState({is1DieselOilEmpty:true});
        }else {
            this.setState({is1DieselOilEmpty:false});
        }
        if (isEmpty(no_e_ninety_two_gasoline) || !isMoney(no_e_ninety_two_gasoline)) {
            this.setState({isE92GasolineEmpty:true});
        }else {
            this.setState({isE92GasolineEmpty:false});
        }
        if (isEmpty(no_two_diesel_oil) || !isMoney(no_two_diesel_oil)) {
            this.setState({is2DieselOilEmpty:true});
        }else {
            this.setState({is2DieselOilEmpty:false});
        }
        if (!isEmpty(no_eighty_nine_gasoline) && !isEmpty(no_ninety_two_gasoline) && !isEmpty(no_ninety_five_gasoline) && !isEmpty(no_zero_diesel_oil) && !isEmpty(no_ninety_eight_gasoline) && !isEmpty(no_one_diesel_oil) && !isEmpty(no_e_ninety_two_gasoline) && !isEmpty(no_two_diesel_oil)){
            if (isMoney(no_eighty_nine_gasoline) && isMoney(no_ninety_two_gasoline) && isMoney(no_ninety_five_gasoline) && isMoney(no_zero_diesel_oil) && isMoney(no_ninety_eight_gasoline) && isMoney(no_one_diesel_oil) && isMoney(no_e_ninety_two_gasoline) && isMoney(no_two_diesel_oil)){
                this.props.oilPriceStore.getUpdateOilPrice(id,no_eighty_nine_gasoline,no_ninety_two_gasoline, no_ninety_five_gasoline, no_zero_diesel_oil, no_ninety_eight_gasoline, no_one_diesel_oil, no_e_ninety_two_gasoline, no_two_diesel_oil);
            }

        }
    }
    componentDidMount() {
        const {
            id,province_name,no_eighty_nine_gasoline,no_ninety_two_gasoline, no_ninety_five_gasoline, no_zero_diesel_oil, no_ninety_eight_gasoline, no_one_diesel_oil, no_e_ninety_two_gasoline, no_two_diesel_oil, create_time,
        } = this.props.oilPriceStore.oilPriceObject;


        this.setState({
            id: id,
            province_name: province_name,
            no_eighty_nine_gasoline: no_eighty_nine_gasoline,
            no_ninety_two_gasoline: no_ninety_two_gasoline,
            no_ninety_five_gasoline: no_ninety_five_gasoline,
            no_zero_diesel_oil: no_zero_diesel_oil,
            no_ninety_eight_gasoline: no_ninety_eight_gasoline,
            no_one_diesel_oil: no_one_diesel_oil,
            no_e_ninety_two_gasoline: no_e_ninety_two_gasoline,
            no_two_diesel_oil: no_two_diesel_oil,
            create_time: create_time,
        });
    }
    /**
     *89号汽油价格
     */
    onNoEightyNineGasoline=(e)=>{
        this.setState({no_eighty_nine_gasoline:e.target.value});
    };

    /**
     *92号汽油价格
     */
    onNoNinetyTwoGasoline=(e)=>{
        this.setState({no_ninety_two_gasoline:e.target.value});
    };

    /**
     *95号汽油价格
     */
    onNoNinetyFiveGasoline=(e)=>{
        this.setState({no_ninety_five_gasoline:e.target.value});
    };

    /**
     *0号柴油价格
     */
    onNoZeroDieselOil=(e)=>{
        this.setState({no_zero_diesel_oil:e.target.value});
    };
    /**
     *98号汽油价格
     */
    onNoNinetyEightGasoline=(e)=>{
        this.setState({no_ninety_eight_gasoline:e.target.value});
    };
    /**
     *1号柴油价格
     */
    onNoOneDieselOil=(e)=>{
        this.setState({no_one_diesel_oil:e.target.value});
    };
    /**
     *E92号汽油价格
     */
    OnNoENinetyTwoGasoline=(e)=>{
        this.setState({no_e_ninety_two_gasoline:e.target.value});
    };
    /**
     *2号柴油价格
     */
    onNoTwoDieselOil=(e)=>{
        this.setState({no_two_diesel_oil:e.target.value});
    };

    render() {
        const {isShowDialog,isShowSubmitLoading} = this.props.oilPriceStore;
        const {
            province_name,create_time,no_eighty_nine_gasoline,no_ninety_two_gasoline, no_ninety_five_gasoline, no_zero_diesel_oil, no_ninety_eight_gasoline, no_one_diesel_oil, no_e_ninety_two_gasoline, no_two_diesel_oil,is89GasolineEmpty, is92GasolineEmpty, is95GasolineEmpty, is0DieselOilEmpty, is98GasolineEmpty, is1DieselOilEmpty, isE92GasolineEmpty,is2DieselOilEmpty
        } = this.state;
        return (
            <Modal
                visible={isShowDialog}
                title={"油价修改"}
                okText="提交"
                cancelText="取消" centered={true}
                onOk={this.onSubmit}
                onCancel={this.onCancel}
                confirmLoading={isShowSubmitLoading}
                width={650}>
                <div className="price-dialog-container">
                    <div className="price-dialog-left">
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">&nbsp;&nbsp;&nbsp;&nbsp;省名称:</div>
                                <Input
                                    disabled={true}
                                    style={{width: 155, margin: 0}}
                                    value={province_name}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility:"hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">创建时间:</div>
                                <Input
                                    disabled={true}
                                    value={create_time}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility:"hidden"}}>请输入正确价格
                            </div>
                        </div>

                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">89号汽油价格:</div>
                                <Input
                                    value={no_eighty_nine_gasoline}
                                    onChange={this.onNoEightyNineGasoline}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is89GasolineEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">92号汽油价格:</div>
                                <Input
                                    value={no_ninety_two_gasoline}
                                    onChange={this.onNoNinetyTwoGasoline}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is92GasolineEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">95号汽油价格:</div>
                                <Input
                                    value={no_ninety_five_gasoline}
                                    onChange={this.onNoNinetyFiveGasoline}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is95GasolineEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                    </div>
                    <div className="price-dialog-center"/>
                    <div className="report-dialog-left">
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">0号柴油价格:</div>
                                <Input
                                    value={no_zero_diesel_oil}
                                    onChange={this.onNoZeroDieselOil}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is0DieselOilEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">98号汽油价格:</div>
                                <Input
                                    value={no_ninety_eight_gasoline}
                                    onChange={this.onNoNinetyEightGasoline}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is98GasolineEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">1号柴油价格:</div>
                                <Input
                                    value={no_one_diesel_oil}
                                    onChange={this.onNoOneDieselOil}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is1DieselOilEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">E92号汽油价格:</div>
                                <Input
                                    value={no_e_ninety_two_gasoline}
                                    onChange={this.OnNoENinetyTwoGasoline}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: isE92GasolineEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>
                        <div className="price-dialog-item-container">
                            <div className="price-dialog-input-item">
                                <div className="price-dialog-input-title">2号柴油价格:</div>
                                <Input
                                    value={no_two_diesel_oil}
                                    onChange={this.onNoTwoDieselOil}
                                    style={{width: 155, margin: 0}}/>
                            </div>
                            <div className="price-dialog-empty-hint"
                                 style={{visibility: is2DieselOilEmpty ? "visible" : "hidden"}}>请输入正确价格
                            </div>
                        </div>

                    </div>
                </div>

            </Modal>);
    }
}

export default ReportDialog;
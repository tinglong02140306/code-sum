import React from 'react';
import {Modal,Input,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import "./TerminalDialog.scss";
import {isMoney} from '../../../utils/isMoney';
const Option = Select.Option;
@inject("terminalStore")
@observer
class TerminalDialog extends React.Component{

    constructor(){
        super();
        this.state={
            terminal_id:'',
            terminal_name:'',
            oil_detail_id:'',
            group_id:'',
            group_name:'',
            cost_price:'',
            list_price:'',
            terminal_id_hint:'',
            terminal_name_hint:'',
            oil_detail_id_hint:'',
            terminal_group_hint:'',
            cost_price_hint:'',
            list_price_hint:'',
            id:'',
            discount_amount:'',
            xl_price:'',
            pos_oil:''
        }
    }

    componentDidMount(){
        const {dialogData} = this.props.terminalStore;
        if(dialogData){
            this.setState({
                terminal_id:dialogData.terminal_id||'',
                terminal_name:dialogData.terminal_name||'',
                oil_detail_id:dialogData.oil_detail_id===0?0:dialogData.oil_detail_id?dialogData.oil_detail_id:'',
                cost_price:dialogData.cost_price||'',
                list_price:dialogData.list_price||'',
                xl_price:dialogData.xl_price||'',
                discount_amount:dialogData.discount_amount||'',
                pos_oil:dialogData.pos_oil||'',
                group_id:dialogData.group_id||'',
                group_name:dialogData.group_name||'',
                id:dialogData.id
            });
        }
    }

    onTerminalIdChange=(e)=>{
        this.setState({terminal_id:e.target.value});
    }
    onTerminalNameChange=(e)=>{
        this.setState({terminal_name:e.target.value});
    }

    onOilDetailsIdChange=(e)=>{
        console.log(e);
        this.setState({oil_detail_id:e});
    }

    onGroupNameIdChange=(e)=>{
        this.setState({group_id:e});
    }

    onCostPriceChange=(e)=>{
        this.setState({cost_price:e.target.value});
    }

    listPriceChange=(e)=>{
        this.setState({list_price:e.target.value});
    }
    XLPriceChange=(e)=>{
        this.setState({xl_price:e.target.value});
    }
    discountAmountChange=(e)=>{
        this.setState({discount_amount:e.target.value});
    }

    onOk=()=>{
        const {typeDialog,dialogData,currentPage} = this.props.terminalStore;
        const {discount_amount,xl_price,terminal_id,oil_detail_id,cost_price,list_price,id,terminal_name,group_id} = this.state;
        console.log('000'+group_id);
        if(typeDialog===0){//0:新增
            if(terminal_id&&group_id&&this.isRightOilDetailId(oil_detail_id)&&isMoney(list_price)&&list_price<1000){
                this.props.terminalStore.getAddTerminal(terminal_id,oil_detail_id,cost_price,list_price,terminal_name,group_id,discount_amount,xl_price,);
            }else{
                this.dealData();
            }
        }else if(typeDialog===1){// 1:修改
            if(terminal_id&&group_id&&this.isRightOilDetailId(oil_detail_id)&&isMoney(list_price)&&list_price<1000){
                // this.props.terminalStore.getUpdateTerminal(id,cost_price==dialogData.cost_price?null:cost_price,list_price==dialogData.list_price?null:list_price, terminal_name==dialogData.terminal_name?null:terminal_name,group_id==dialogData.group_id?null:group_id,currentPage);
                this.props.terminalStore.getUpdateTerminal(id,cost_price,list_price, terminal_name,group_id,discount_amount,xl_price,currentPage);
            }else{
                this.dealData();
            }
        }else{//2:查看
            this.props.terminalStore.setIsShowDialog(false);
            this.props.terminalStore.setDialogData(null);
        }
    }

    onCancel=()=>{
        this.props.terminalStore.setIsShowDialog(false);
        this.props.terminalStore.setDialogData(null);
    }

    isRightOilDetailId = (oil_detail_id)=>{
        return oil_detail_id===0?true:oil_detail_id?true:false
    }

    /**
     *提交前的校验
     */
    dealData=()=>{
        const {terminal_id,oil_detail_id,cost_price,list_price,terminal_name,group_id} = this.state;
        this.setState({
            terminal_id_hint:terminal_id?'':'请输入终端编号',
            // terminal_name_hint:terminal_name?'':'请输入终端名称',
            terminal_group_hint:group_id?'':'请选择终端分组',
            oil_detail_id_hint:oil_detail_id===0?oil_detail_id:oil_detail_id?'':'请选择油品类型',
            cost_price_hint:cost_price?isMoney(cost_price)?cost_price<1000?'':'成本价应小于1000元':'请输入正确的成本价':'请输入成本价',
            list_price_hint:list_price?isMoney(list_price)?list_price<1000?'':'油机价应小于1000元':'请输入正确的油机价':'请输入油机价',
        });
    }

    getTitle = ()=>{
        const {typeDialog} = this.props.terminalStore;//0:新增 1:修改 2:查看
        if(typeDialog===0){
            return "新增";
        }else if (typeDialog===1){
            return "修改";
        }else{
            return "查看";
        }
    }

    selectOption=()=>{
        const {oilList} = this.props.terminalStore;
        return oilList&&oilList.map(item=>{
            return <Option key={item.id} >{item.pos_oil}</Option>
        });
    }

    selectGroupOption=()=>{
        const {groupList} = this.props.terminalStore;
        return groupList&&groupList.map(item=>{
            return <Option key={item.id} >{item.group_name}</Option>
        });
    }

    render(){
        const {isShowDialog,typeDialog,isShowSubDialog} = this.props.terminalStore;
        const {terminal_group_hint,discount_amount,xl_price,terminal_name_hint,terminal_name,terminal_id,oil_detail_id,group_id,group_name,cost_price,list_price,terminal_id_hint,oil_detail_id_hint,cost_price_hint,list_price_hint,pos_oil} = this.state;
        const title = this.getTitle();
        return <Modal okText={typeDialog===2?"确定":"提交"} 
                cancelText="取消" centered={true}
                confirmLoading={isShowSubDialog}
                visible={isShowDialog}
                title={title}
                onOk={this.onOk} onCancel={this.onCancel}>
                    <div className="terminal-dialog-container">
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label"><span>*</span>终端编号:</p>
                                <Input className="terminal-dialog-item-input"
                                    disabled={typeDialog===0?false:true}
                                    maxLength={16}
                                    value={terminal_id} onChange={this.onTerminalIdChange}/>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:terminal_id_hint?"visible":"hidden"}}>{terminal_id_hint}</p>
                        </div>
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label">终端名称:</p>
                                <Input.TextArea className="terminal-dialog-item-input"
                                       disabled={typeDialog===2}
                                       maxLength={100} autosize={{ minRows: 1}}
                                       value={terminal_name} onChange={this.onTerminalNameChange}/>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:terminal_name_hint?"visible":"hidden"}}>{terminal_name_hint}</p>
                        </div>
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label"><span>*</span>终端分组:</p>
                                <Select className="terminal-dialog-item-input"
                                        disabled={typeDialog===2}
                                        defaultValue={group_name}
                                        onChange={this.onGroupNameIdChange}>
                                    {this.selectGroupOption()}
                                </Select>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:terminal_group_hint?"visible":"hidden"}}>{terminal_group_hint}</p>
                        </div>
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label"><span>*</span>油品类型:</p>
                                <Select className="terminal-dialog-item-input"
                                    disabled={typeDialog===0?false:true}
                                    value={typeDialog===0?oil_detail_id:pos_oil} onChange={this.onOilDetailsIdChange}>
                                    {this.selectOption()}
                                </Select>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:oil_detail_id_hint?"visible":"hidden"}}>{oil_detail_id_hint}</p>
                        </div>
                        {/*<div className="terminal-dialog-item-container">*/}
                        {/*    <div className="terminal-dialog-item">*/}
                        {/*        <p className="terminal-dialog-item-label"><span>*</span>成本价(元):</p>*/}
                        {/*        <Input className="terminal-dialog-item-input"*/}
                        {/*            disabled={typeDialog===2}*/}
                        {/*            maxLength={10}*/}
                        {/*            value={cost_price} onChange={this.onCostPriceChange}/>*/}
                        {/*    </div>*/}
                        {/*    <p className="terminal-dialog-item-hint"  style={{visibility:cost_price_hint?"visible":"hidden"}}>{cost_price_hint}</p>*/}
                        {/*</div>*/}
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label"><span>*</span>油机价(元):</p>
                                <Input className="terminal-dialog-item-input"
                                    disabled={typeDialog===2}
                                    maxLength={10}
                                    value={list_price} onChange={this.listPriceChange}/>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:list_price_hint?"visible":"hidden"}}>{list_price_hint}</p>
                        </div>
                        {/*<div className="terminal-dialog-item-container">*/}
                        {/*    <div className="terminal-dialog-item">*/}
                        {/*        <p className="terminal-dialog-item-label">信联价(元):</p>*/}
                        {/*        <Input className="terminal-dialog-item-input"*/}
                        {/*               disabled={typeDialog===2}*/}
                        {/*               maxLength={10}*/}
                        {/*               value={xl_price} onChange={this.XLPriceChange}/>*/}
                        {/*    </div>*/}
                        {/*    <p className="terminal-dialog-item-hint"  style={{visibility:"hidden"}}>{list_price_hint}</p>*/}
                        {/*</div>*/}
                        <div className="terminal-dialog-item-container">
                            <div className="terminal-dialog-item">
                                <p className="terminal-dialog-item-label">优惠金额:</p>
                                <Input className="terminal-dialog-item-input"
                                       disabled={typeDialog===2}
                                       maxLength={10}
                                       value={discount_amount} onChange={this.discountAmountChange}/>
                            </div>
                            <p className="terminal-dialog-item-hint"  style={{visibility:"hidden"}}>{list_price_hint}</p>
                        </div>
                    </div>
                </Modal>
    }
}

export default TerminalDialog;
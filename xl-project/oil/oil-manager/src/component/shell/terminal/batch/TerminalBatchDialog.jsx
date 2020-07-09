import React from 'react';
import './TerminalBatchDialog.scss';
import {Modal,Select,Input} from "antd";
import {inject, observer} from 'mobx-react';
import {isMoney} from '../../../../utils/isMoney';
const Option = Select.Option;

@inject("terminalStore")
@observer
class TerminalBatchDialog extends React.Component {

    constructor(){
        super();
        this.state={
            group_id:'',
            oil_detail_id:'',
            cost_price:'',
            list_price:'',
            group_id_hint:'',
            oil_detail_id_hint:'',
            cost_price_hint:'',
            list_price_hint:'',
        }
    }

    /**
     *提交前的校验
     */
    dealData=()=>{
        const {group_id,oil_detail_id,cost_price,list_price} = this.state;
        this.setState({
            group_id_hint:group_id===0?group_id:group_id?'':'请选择终端分组',
            oil_detail_id_hint:oil_detail_id===0?oil_detail_id:oil_detail_id?'':'请选择油品类型',
            // cost_price_hint:(!cost_price&&!list_price)?"成本价与油机价不能同时为空":cost_price?isMoney(cost_price)?cost_price<1000?'':'成本价应小于1000元':'请输入正确的成本价':"",
            list_price_hint:(!cost_price&&!list_price)?"成本价与油机价不能同时为空":list_price?isMoney(list_price)?list_price<1000?'':'油机价应小于1000元':'请输入正确的油机价':''
        });
    }

    isEmptyData = (data)=>{
        return data===0?false:!data
    }

    onOk = () => {
        const {group_id,oil_detail_id,cost_price,list_price} = this.state;
        if (!this.isEmptyData(group_id)&&!this.isEmptyData(oil_detail_id)&&this.isRightMoney()){
            this.props.terminalStore.getBatchUpdate(group_id,oil_detail_id,cost_price,list_price);
        }else {
            this.dealData();
        }
    }

    isRightMoney=()=>{
        const {cost_price,list_price} = this.state;
        if (list_price){
            if (isMoney(list_price)){
                if (isMoney(list_price)){
                    return true
                } else {
                    return false
                }
            }
        }else {
            return false
        }
        // if (cost_price||list_price){
        //     if (cost_price&&isMoney(cost_price)){
        //         if (list_price){
        //             if (isMoney(list_price)){
        //                 return true
        //             } else {
        //                 return false
        //             }
        //         } else {
        //             return true
        //         }
        //     }else if (list_price&&isMoney(list_price)){
        //         if (cost_price){
        //             if (isMoney(cost_price)){
        //                 return true
        //             } else {
        //                 return false
        //             }
        //         } else {
        //             return true
        //         }
        //     }
        // }
        return false;
    }

    onCancel = () => {
        this.props.terminalStore.setIsShowBatchDialog(false)
    }

    onCostPriceChange=(e)=>{
        this.setState({cost_price:e.target.value});
    }

    listPriceChange=(e)=>{
        this.setState({list_price:e.target.value});
    }

    onGroupChange=(e)=>{
        this.setState({group_id:e});
    }

    onOilIdChange=(e)=>{
        this.setState({oil_detail_id:e});
    }

    selectGroupOption=()=>{
        const {groupList} = this.props.terminalStore;
        return groupList&&groupList.map(item=>{
            return <Option key={item.id} >{item.group_name}</Option>
        });
    }

    selectOilOption=()=>{
        const {oilList} = this.props.terminalStore;
        return oilList&&oilList.map(item=>{
            return <Option key={item.id} >{item.pos_oil}</Option>
        });
    }

    render() {
        const {isShowBatchDialog, isShowBatchLoading} = this.props.terminalStore;
        const {cost_price,list_price,group_id_hint,oil_detail_id_hint,cost_price_hint,list_price_hint} = this.state;
        return <Modal okText="提交"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowBatchLoading}
                      visible={isShowBatchDialog}
                      title="批量修改"
                      onOk={this.onOk} onCancel={this.onCancel}>
            <div className="terminal-batch-dialog-container">
                <div className="terminal-batch-dialog-item-container">
                    <div className="terminal-batch-dialog-item">
                        <p className="terminal-batch-dialog-item-label"><span>*</span>终端分组:</p>
                        <Select className="terminal-batch-dialog-item-input"
                                onChange={this.onGroupChange}>
                            {this.selectGroupOption()}
                        </Select>
                    </div>
                    <p className="terminal-batch-dialog-item-hint"  style={{visibility:group_id_hint?"visible":"hidden"}}>{group_id_hint}</p>
                </div>
                <div className="terminal-batch-dialog-item-container">
                    <div className="terminal-batch-dialog-item">
                        <p className="terminal-batch-dialog-item-label"><span>*</span>油品类型:</p>
                        <Select className="terminal-batch-dialog-item-input"
                                onChange={this.onOilIdChange}>
                            {this.selectOilOption()}
                        </Select>
                    </div>
                    <p className="terminal-batch-dialog-item-hint"  style={{visibility:oil_detail_id_hint?"visible":"hidden"}}>{oil_detail_id_hint}</p>
                </div>
                {/*<div className="terminal-batch-dialog-item-container">*/}
                {/*    <div className="terminal-batch-dialog-item">*/}
                {/*        <p className="terminal-batch-dialog-item-label">成本价(元):</p>*/}
                {/*        <Input className="terminal-dialog-item-input"*/}
                {/*               maxLength={10}*/}
                {/*               value={cost_price}*/}
                {/*               onChange={this.onCostPriceChange}/>*/}
                {/*    </div>*/}
                {/*    <p className="terminal-batch-dialog-item-hint"  style={{visibility:cost_price_hint?"visible":"hidden"}}>{cost_price_hint}</p>*/}
                {/*</div>*/}
                <div className="terminal-batch-dialog-item-container">
                    <div className="terminal-batch-dialog-item">
                        <p className="terminal-batch-dialog-item-label">油机价(元):</p>
                        <Input className="terminal-batch-dialog-item-input"
                               maxLength={10}
                               value={list_price}
                               onChange={this.listPriceChange}/>
                    </div>
                    <p className="terminal-batch-dialog-item-hint"  style={{visibility:list_price_hint?"visible":"hidden"}}>{list_price_hint}</p>
                </div>
            </div>
        </Modal>
    }
}

export default TerminalBatchDialog;
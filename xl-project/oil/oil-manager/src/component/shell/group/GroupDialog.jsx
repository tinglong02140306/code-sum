import React from 'react';
import './GroupDialog.scss';
import {Modal,Input,DatePicker,Select} from 'antd';
import {observer, inject} from 'mobx-react';
import {OIL_ID} from '../../../constant/constant';
import {isMoney,oilIdSplit,formatTime,stringToMoment} from '../../../utils/utils';
import moment from 'moment';

@inject("groupStore")
@observer

class GroupDialog extends React.Component{
    constructor(){
        super();
        this.state={
            id:'',
            group_name:'',
            group_name_hint:'',
            diesel_cost0:'',
            diesel_cost10:'',
            gas_preferential92:'',
            gas_preferential95:'',
            gas_preferential98:'',
            diesel_cost0_hint:'',
            diesel_cost10_hint:'',
            gas_preferential92_hint:'',
            gas_preferential95_hint:'',
            gas_preferential98_hint:'',
            xl_price_formula_gas:'',
            xl_price_formula_diesel:'',
            xl_symbol:'+',
            xl_price:'0',
            xl_symbol_diesel:'+',
            xl_price_diesel:'0',
            startValue:null,
            endValue:null
        }
    }

    componentDidMount() {
        const {dialogData} = this.props.groupStore;
        const {typeDialog} = this.props.groupStore;//0:新增 1:修改 2:全量修改
        if(typeDialog===2) this.setState({group_name:'全量修改'});
        if (dialogData){
            this.setState({
                id:dialogData.id,
                group_name:dialogData.group_name,
                group_name_hint:'',
                diesel_cost0:dialogData['42'],
                diesel_cost10:dialogData['43'],
                gas_preferential92:dialogData['38'],
                gas_preferential95:dialogData['39'],
                gas_preferential98:dialogData['40'],
                startValue:stringToMoment(dialogData.valid_time,'YYYY-MM-DD HH:mm:ss'),
                endValue:stringToMoment(dialogData.invalid_time,'YYYY-MM-DD HH:mm:ss')
            })
            if (dialogData.xl_price_formula_gas){
                this.setState({
                    xl_symbol:dialogData.xl_price_formula_gas.substr(0,1),
                    xl_price:dialogData.xl_price_formula_gas.substr(1,dialogData.xl_price_formula_gas.length-1),
                })
            }
            if (dialogData.xl_price_formula_diesel){
                this.setState({
                    xl_symbol_diesel:dialogData.xl_price_formula_diesel.substr(0,1),
                    xl_price_diesel:dialogData.xl_price_formula_diesel.substr(1,dialogData.xl_price_formula_diesel.length-1),
                })
            }
        }
    }


    onOk=()=>{
        const {typeDialog} = this.props.groupStore;//0:新增 1:修改 2:全量修改
        const {xl_symbol_diesel,xl_price_diesel,xl_symbol,xl_price,id,group_name,gas_preferential92,gas_preferential95,gas_preferential98,diesel_cost0,diesel_cost10,startValue,endValue} = this.state;
        this.setHint();
        let xl_price_formula_gas = xl_symbol + xl_price;
        let xl_price_formula_diesel = xl_symbol_diesel + xl_price_diesel;
        if(group_name&&this.checkPrice(gas_preferential92)&&this.checkPrice(gas_preferential95)&&this.checkPrice(gas_preferential98)
                &&this.checkPrice(diesel_cost0)&&this.checkPrice(diesel_cost10)){
            const price = {
                [OIL_ID.gas92]:gas_preferential92,
                [OIL_ID.gas95]:gas_preferential95,
                [OIL_ID.gas98]:gas_preferential98,
                [OIL_ID.diesel0]:diesel_cost0,
                [OIL_ID.diesel10]:diesel_cost10,
            }
            const cost_price = oilIdSplit(price);
            if (typeDialog===1){// 1:修改
                this.props.groupStore.getUpdateGroup(id,group_name,cost_price,formatTime(startValue),formatTime(endValue),xl_price_formula_gas,xl_price_formula_diesel);
            } else if(typeDialog === 0){//0:新增
                this.props.groupStore.getAddGroup(group_name,cost_price,formatTime(startValue),formatTime(endValue),xl_price_formula_gas,xl_price_formula_diesel);
            }else{
                this.props.groupStore.getUpdateAll(cost_price,formatTime(startValue),formatTime(endValue),xl_price_formula_gas,xl_price_formula_diesel);
            }
        }
    }

    /**
     *若价格为空 返回true，若价格不为空切格式正确返回true，否则返回false
     */
    checkPrice=(price)=>{
        if(price) return isMoney(price)
        return true;       
    }

    setHint=()=>{
        const {gas_preferential92,gas_preferential95,gas_preferential98,diesel_cost0,diesel_cost10,group_name} = this.state;
        this.setState({group_name_hint:group_name?'':'分组名不能为空'});
        this.setState({gas_preferential92_hint:gas_preferential92?isMoney(gas_preferential92)?'':'格式错误':''});
        this.setState({gas_preferential95_hint:gas_preferential95?isMoney(gas_preferential95)?'':'格式错误':''});
        this.setState({gas_preferential98_hint:gas_preferential98?isMoney(gas_preferential98)?'':'格式错误':''});
        this.setState({diesel_cost0_hint:diesel_cost0?isMoney(diesel_cost0)?'':'格式错误':''});
        this.setState({diesel_cost10_hint:diesel_cost10?isMoney(diesel_cost10)?'':'格式错误':''});
    }

    onCancel=()=>{
        this.props.groupStore.setIsShowGroupDialog(false);
    }

    /**
     * 分组名称
     */
    onGroupNameChange=(e)=>{
        this.setState({group_name:e.target.value});
    }

    /**
     *0#柴油成本价
     */
    onDieselCost0=(e)=>{
        this.setState({diesel_cost0:e.target.value});
    }

    /**
     *10#柴油成本价
     */
    onDieselCost10=(e)=>{
        this.setState({diesel_cost10:e.target.value});
    }

    /**
     *92#汽油优惠价
     */
    onGasPreferential92=(e)=>{
        this.setState({gas_preferential92:e.target.value});
    }

    /**
     *95#汽油优惠价
     */
    onGasPreferential95=(e)=>{
        this.setState({gas_preferential95:e.target.value});
    }

    /**
     *98#汽油优惠价
     */
    onGasPreferential98=(e)=>{
        this.setState({gas_preferential98:e.target.value});
    }
    /**
     *信联价计算公式
     */
    onXlPriceFormula=(e)=>{
        this.setState({xl_price:e.target.value});
    }
    onXlPriceDieselFormula=(e)=>{
        this.setState({xl_price_diesel:e.target.value});
    }

    onXlSymbolChange=(e)=>{
        this.setState({xl_symbol:e});
    }
    onXlSymbolDieselChange=(e)=>{
        this.setState({xl_symbol_diesel:e});
    }

    onStartChange = (value) => {
        this.setState({startValue:value});
    }
    
    onEndChange = (value) => {
        this.setState({endValue:value});
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    /**
     *Input
     *
     * @memberof GroupDialog
     */
    inputItem = (label,inputValue,inputChange,hint)=>{
        return <div className="terminal-group-dialog-item-container">
                    <div className="terminal-group-dialog-item">
                        <p className="terminal-group-dialog-item-label">{label}</p>
                        <Input className="terminal-group-dialog-item-input"
                            maxLength={8}
                            value={inputValue} onChange={inputChange}/>
                    </div>
                    <p className="terminal-group-dialog-item-hint"  style={{visibility:hint?"visible":"hidden"}}>{hint}</p>
                </div>
    }

    /**
     *InputTextArea
     *
     * @memberof GroupDialog
     */
    inputTextAreaItem = (label,inputValue,inputChange,hint)=>{
        return <div className="terminal-group-dialog-item-container">
                    <div className="terminal-group-dialog-item">
                        <p className="terminal-group-dialog-item-text-area-label"><span>*</span>{label}</p>
                        <Input.TextArea className="terminal-group-dialog-item-input-text-area"
                            maxLength={100}
                            autosize={{ minRows: 1, maxRows: 3 }}
                            value={inputValue} onChange={inputChange}/>
                    </div>
                    <p className="terminal-group-dialog-item-hint terminal-group-dialog-group-hint"  style={{visibility:hint?"visible":"hidden"}}>{hint}</p>
                </div>
    }

    /**
     *
     * DatePicker
     * @memberof GroupDialog
     */
    DatePickerItem = (label,inputValue,inputChange,disabledDate)=>{
        return <div className="terminal-group-dialog-item-container">
                    <div className="terminal-group-dialog-item">
                        <p className="terminal-group-dialog-item-text-area-label">{label}</p>
                        <DatePicker  format="YYYY-MM-DD HH:mm:ss" 
                            value={inputValue}
                            onChange={inputChange}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            disabledDate={disabledDate}/>
                    </div>
                </div>
    }

    render(){
        const {isShowGroupDialog,isShowSubmitLoading,typeDialog} = this.props.groupStore;//0:新增 1:修改
        const {xl_symbol_diesel,xl_price_diesel,xl_symbol,xl_price,group_name,group_name_hint,diesel_cost0,diesel_cost10,gas_preferential92,gas_preferential98,gas_preferential95,
            diesel_cost0_hint,diesel_cost10_hint,gas_preferential92_hint,gas_preferential95_hint,gas_preferential98_hint,
            startValue,endValue} = this.state;
        const title = typeDialog?typeDialog===1?'修改':'全量修改':'新增'    
        return <Modal width={650}
                      visible={isShowGroupDialog}
                      okText="提交"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowSubmitLoading}
                      title={title}
                      onOk={this.onOk} onCancel={this.onCancel}>
                      <div className='terminal-group-dialog-box'>
                        <div className='terminal-group-name-box' style={{display:typeDialog!==2?'flex':'none'}}>
                            {this.inputTextAreaItem('分组名称:',group_name,this.onGroupNameChange,group_name_hint)}
                        </div>
                        <div className="terminal-group-dialog-item-label terminal-group-price-title">油价信息设置:</div>
                        <div className='terminal-group-dialog-price-box'>
                            <div  className="terminal-group-dialog-container">
                                <div className='terminal-group-dialog-box'>
                                    <p className="terminal-group-dialog-item-title-label">优惠价设置:</p>
                                    {this.inputItem('92#汽油单价优惠额:',gas_preferential92,this.onGasPreferential92,gas_preferential92_hint)}
                                    {this.inputItem('95#汽油单价优惠额:',gas_preferential95,this.onGasPreferential95,gas_preferential95_hint)}
                                    {this.inputItem('98#汽油单价优惠额:',gas_preferential98,this.onGasPreferential98,gas_preferential98_hint)}                        
                                </div>
                                <div className='terminal-group-separation'></div>
                                <div className='terminal-group-dialog-box'>
                                    <p className="terminal-group-dialog-item-title-label">成本价设置:</p>
                                    {this.inputItem('0#柴油成本价:',diesel_cost0,this.onDieselCost0,diesel_cost0_hint)}
                                    {this.inputItem('10#柴油成本价:',diesel_cost10,this.onDieselCost10,diesel_cost10_hint)}   
                                </div>
                            </div>
                            <div className='terminal-group-dialog-box'>
                                <p className="terminal-group-dialog-item-title-label">信联价设置:</p>
                                <div className='terminal-group-dialog-xl-container'>
                                    <div style={{marginLeft:5,marginRight:15}}>汽油：</div>
                                    <div>
                                        <Select value={xl_symbol}  defaultValue={xl_symbol} style={{ width: 60 }} onChange={this.onXlSymbolChange}>
                                            <Select.Option value="+"><div className='terminal-group-dialog-xl-select'>+</div></Select.Option>
                                            <Select.Option value="*"><div className='terminal-group-dialog-xl-select'>*</div></Select.Option>
                                        </Select>
                                        <Input
                                            style={{ width: 60,marginLeft:5}}
                                            // className="terminal-group-dialog-item-input"
                                            maxLength={8}
                                            value={xl_price} onChange={this.onXlPriceFormula}/>
                                    </div>
                                    <div style={{marginLeft:5,marginRight:50}}>元</div>
                                    <div className='terminal-group-dialog-price-formula'>信联价(汽油)=信联成本价<span>{xl_symbol}{xl_price}</span>元</div>
                                </div>
                                <div className='terminal-group-dialog-xl-container'>
                                    <div style={{marginLeft:5,marginRight:15}}>柴油：</div>
                                    <div>
                                        <Select value={xl_symbol_diesel}  defaultValue={xl_symbol_diesel} style={{ width: 60 }} onChange={this.onXlSymbolDieselChange}>
                                            <Select.Option value="+"><div className='terminal-group-dialog-xl-select'>+</div></Select.Option>
                                            <Select.Option value="*"><div className='terminal-group-dialog-xl-select'>*</div></Select.Option>
                                        </Select>
                                        <Input
                                            style={{ width: 60,marginLeft:5}}
                                            // className="terminal-group-dialog-item-input"
                                            maxLength={8}
                                            value={xl_price_diesel} onChange={this.onXlPriceDieselFormula}/>
                                    </div>
                                    <div style={{marginLeft:5,marginRight:50}}>元</div>
                                    <div className='terminal-group-dialog-price-formula'>信联价(柴油)=信联成本价<span>{xl_symbol_diesel}{xl_price_diesel}</span>元</div>
                                </div>
                            </div>
                            <div className='terminal-group-row-separation'></div>
                            <div  className="terminal-group-dialog-data-container">
                                {this.DatePickerItem('生效日期:',startValue,this.onStartChange,this.disabledStartDate)}
                                {this.DatePickerItem('失效日期:',endValue,this.onEndChange,this.disabledEndDate)}
                            </div>
                            <div className='terminal-group-data-hint'>
                                <div>提示:</div>
                                <div>生效日期为空表示立即生效;失效日期为空表示长期有效</div>
                            </div>
                        </div>
                      </div>
        </Modal>
    }
}

export default GroupDialog;
import React from "react";
import "./TerminalAddDialog.scss";
import {Input,Modal,Radio,Icon,Switch} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";

@inject("stationTerminalStore")
@observer
class TerminalAddDialog extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            station_name:'',
            company_name:'',
            terminal_id:'',
            merchant_id:'',
            merchant_name:'',
            station_pk:'',
            terminalIdHint:'',
            merchantIdHint:'',
            merchantNameHint:'',
            stationHint:'',
            extend_no:'',
            defaulted:false,
            affiliation:null,
            affiliation_str:null
        }
    }

    componentDidMount(){
        const {typeModal} = this.props.stationTerminalStore;//0:增加 1:修改 2 :查看
        const {id,station_name,terminal_id,merchant_id,merchant_name,station_pk,affiliation,extend_no,company_name,defaulted} = this.props.stationTerminalStore.stationTerminalObject;
        let affiliation_num = null;
        if (affiliation==='壳牌'){
            affiliation_num = 0;
        }else if (affiliation === '油团团'){
            affiliation_num = 1;
        }else if (affiliation === '智慧油客'){
            affiliation_num = 2;
        }
        if(typeModal !==0){
            this.setState({
                id:id,
                station_name:station_name||'',
                company_name:company_name||'',
                station_pk:station_pk||'',
                terminal_id:terminal_id||'',
                merchant_id:merchant_id||'',
                merchant_name:merchant_name||'',
                affiliation_str:affiliation||null,
                defaulted:defaulted||false,
                affiliation:affiliation_num,
                extend_no:extend_no,
            });
        }
    }

    onStationChange=(e)=>{
        this.props.stationTerminalStore.setIsShowSearchDialog(true);
    }

    onTerminalIdChange=(e)=>{
        this.setState({terminal_id:e.target.value});
    }

    onMerchantIdChange=(e)=>{
        this.setState({merchant_id:e.target.value});
    }

    onMerchantNameChange=(e)=>{
        this.setState({merchant_name:e.target.value});
    }
    onExtendNoChange = (e) => {
        this.setState({extend_no: e.target.value});
    };
    onSwitchChange = (e) => {
        let defaulted = this.state.defaulted;
        this.setState({defaulted: !defaulted});
    };
    onAffiliationChange = (e) => {
        this.setState({affiliation: e.target.value});
        if (e.target.value === 0){
            this.setState({affiliation_str:'壳牌'});
        }else if (e.target.value === 1){
            this.setState({affiliation_str:'油团团'});
        }else if (e.target.value === 2){
            this.setState({affiliation_str:'智慧油客'});
        }else {
            this.setState({affiliation_str:null});
        }
    }
    //取消选择
    onAffiliationCancel = (e) => {
        this.setState({
            affiliation: null,
            affiliation_str:null
        });
    }
    onCancel=()=>{
        if (this.props.stationTerminalStore.operationData) {
            this.props.stationTerminalStore.setOperationData(null);
        }
        this.props.stationTerminalStore.setIsShowDialog(false);
    }

    onOk=()=>{

        const {typeModal,operationData} = this.props.stationTerminalStore;//0:增加 1:修改 2 :查看
        const {extend_no,id,terminal_id,merchant_id,merchant_name,station_pk,affiliation,affiliation_str,defaulted} = this.state;

        if(typeModal===0){//新增

            if (operationData){
                if (!isEmpty(operationData.id)&&!isEmpty(terminal_id)&&!isEmpty(merchant_id)&&!isEmpty(merchant_name)) {
                    this.props.stationTerminalStore.addStationTerminal(terminal_id,merchant_id,merchant_name,operationData.id,affiliation_str,extend_no,defaulted);
                }else {
                    this.dealData();
                }
            } else {
                if (!isEmpty(station_pk)&&!isEmpty(terminal_id)&&!isEmpty(merchant_id)&&!isEmpty(merchant_name)) {
                    this.props.stationTerminalStore.addStationTerminal(terminal_id,merchant_id,merchant_name,station_pk,affiliation_str,extend_no,defaulted);
                }else {
                    this.dealData();
                }
            }
        }else if(typeModal===1){//修改
            if (operationData){
                if (!isEmpty(operationData.id)&&!isEmpty(merchant_id)&&!isEmpty(merchant_name)) {
                    this.props.stationTerminalStore.updateStationTerminal(id,merchant_id,merchant_name,operationData.id,affiliation_str,extend_no,defaulted);
                }else {
                    this.dealData();
                }
            } else {
                if (!isEmpty(station_pk)&&!isEmpty(merchant_id)&&!isEmpty(merchant_name)) {
                    this.props.stationTerminalStore.updateStationTerminal(id,merchant_id,merchant_name,station_pk,affiliation_str,extend_no,defaulted);
                }else {
                    this.dealData();
                }
            }
        }else{
            if (operationData){
                this.props.stationTerminalStore.setOperationData(null);
            }
            this.props.stationTerminalStore.setIsShowDialog(false);
        }

    }

    /**
     *提交前的校验
     */
    dealData=()=>{
        const {operationData} = this.props.stationTerminalStore;
        const {terminal_id,merchant_id,merchant_name,station_pk} = this.state;
        this.setState({
            terminalIdHint:terminal_id?"":"终端编号不能为空",
            merchantIdHint:merchant_id?"":"商户编号不能为空",
            merchantNameHint:merchant_name?"":"商户名称不能为空",
            stationHint:operationData?"":station_pk?"":"加油站不能为空",
        });
    }
    render(){
        const {isShowDialog,typeModal,operationData} = this.props.stationTerminalStore;//0:新增 1:修改 2 :查看
        const {company_name,extend_no,station_name,terminal_id,merchant_id,merchant_name,terminalIdHint,merchantIdHint,merchantNameHint,stationHint,affiliation,defaulted} = this.state;
        let title = "";
        let okText = "";
        if(typeModal===0){
            title="新增";
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
                   visible={isShowDialog}>
                <div className="terminal-add-dialog-box">
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label"><span>*</span>油站名称:</p>
                            <Input placeholder="油站油站名称"
                                   type="button"
                                   disabled={typeModal!==2?false:true}
                                   value={operationData?operationData.name:station_name}
                                   onClick={this.onStationChange}></Input>
                        </div>
                        <p className="terminal-add-item-placeholder">{stationHint}</p>
                    </div>
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label"><span>*</span>终端编号:</p>
                            <Input placeholder="终端编号"
                                   disabled={typeModal==1?true:false}
                                   value={terminal_id}
                                   onChange={this.onTerminalIdChange}></Input>
                        </div>
                        <p className="terminal-add-item-placeholder">{terminalIdHint}</p>
                    </div>
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label"><span>*</span>商户编号:</p>
                            <Input placeholder="商户编号"
                                   disabled={typeModal!==2?false:true}
                                   value={merchant_id}
                                   onChange={this.onMerchantIdChange}></Input>
                        </div>
                        <p className="terminal-add-item-placeholder">{merchantIdHint}</p>
                    </div>
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label"><span>*</span>商户名称:</p>
                            <Input placeholder="商户名称"
                                   disabled={typeModal!==2?false:true}
                                   value={merchant_name}
                                   onChange={this.onMerchantNameChange}></Input>
                        </div>
                        <p className="terminal-add-item-placeholder">{merchantNameHint}</p>
                    </div>
                   <div className="terminal-add-dialog-item">
                         <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label">外部编号:</p>
                            <Input placeholder="商户名称"
                                   disabled={typeModal!==2?false:true}
                                   value={extend_no}
                                   onChange={this.onExtendNoChange}></Input>
                        </div>
                        <p className="terminal-add-item-placeholder">{merchantNameHint}</p>
                    </div>
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label">是否默认:</p>
                            <div style={{width: 250}}>
                                <Switch
                                    disabled={typeModal!==2?false:true}
                                    checked={defaulted?true:false}
                                    onChange={this.onSwitchChange}></Switch>
                            </div>

                        </div>
                        <p className="terminal-add-item-placeholder">{merchantNameHint}</p>
                    </div>
                    <div className="terminal-add-dialog-item">
                        <div className="terminal-add-dialog-item-content">
                            <p className="terminal-add-dialog-item-label">合作伙伴:</p>
                            <Input placeholder="合作伙伴"
                                   type="button"
                                   disabled={true}
                                   value={operationData?operationData.company_name:isEmpty(company_name)?null:company_name}
                                   ></Input>
                        </div>
                        <p className="terminal-add-item-placeholder" style={{color:'#FF832E'}}>(与油站关联，不可编辑)</p>
                    </div>
                    {/*<div className="terminal-add-dialog-item">*/}
                    {/*    <div className="terminal-add-dialog-item-content1">*/}
                    {/*        <p className="terminal-add-dialog-item-label">归&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;属:</p>*/}
                    {/*        <Radio.Group onChange={this.onAffiliationChange} value={affiliation} disabled={typeModal!==2?false:true}>*/}
                    {/*            <Radio value={0}>壳牌</Radio>*/}
                    {/*            <Radio value={1}>油团团</Radio>*/}
                    {/*            <Radio value={2}>智慧油客</Radio>*/}
                    {/*        </Radio.Group>*/}
                    {/*        <Icon type="stop" className='grant-rollback' style={{marginLeft:15,marginTop:5,visibility: affiliation===0 || affiliation===1 ||affiliation===2? "visible" : "hidden"}} onClick={this.onAffiliationCancel}/>*/}
                    {/*    </div>*/}
                    {/*    <p className="terminal-add-item-placeholder"></p>*/}
                    {/*</div>*/}
                </div>
            </Modal>
        )
    }
}

export default TerminalAddDialog;
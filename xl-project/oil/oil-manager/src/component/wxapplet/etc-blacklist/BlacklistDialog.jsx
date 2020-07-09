import React from 'react';
import {Modal,Input,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import "./BlacklistDialog.scss";
import {isVehicleNumber,isPoneAvailable} from "../../../utils/utils";

@inject("blacklistStore")
@observer
class BlacklistDialog extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            etc_card_no:'',
            plate_no:'',
            plate_color:'',
            mobile:'',
            etc_card_no_hint:'',
            plate_no_hint:'',
            plate_color_hint:'',
            mobile_hint:'',
        }
    }

    componentDidMount(){
        const {dialogData} = this.props.blacklistStore;
        if(dialogData){
            this.setState({
                id:dialogData.id||'',
                etc_card_no:dialogData.etc_card_no||'',
                plate_no:dialogData.plate_no||'',
                plate_color:dialogData.plate_color,
                mobile:dialogData.mobile||'',
            });
        }
    }

    onEtcCardNoChange=(e)=>{
        this.setState({etc_card_no:e.target.value});
    }
    onPlateNoChange=(e)=>{
        this.setState({plate_no:e.target.value});
    }

    onPlateColorChange=(value)=>{
        this.setState({plate_color:value});
    }

    onMobileChange=(e)=>{
        this.setState({mobile:e.target.value});
    }

    onOk=()=>{
        const {typeDialog,dialogData,currentPage} = this.props.blacklistStore;
        const {id,plate_no,etc_card_no,plate_color,mobile} = this.state;

        if(typeDialog===0){//0:新增
            // if(etc_card_no.length==20&&isVehicleNumber(plate_no)&&plate_color&&mobile){
            if(etc_card_no.length==20&&isVehicleNumber(plate_no)){
                if (mobile){
                    if (isPoneAvailable(mobile)){
                        this.props.blacklistStore.getAddBlacklist(etc_card_no,plate_no,plate_color,mobile);
                    } else {
                        this.setState({mobile_hint:'手机号输入错误',});
                    }
                }  else {
                    this.props.blacklistStore.getAddBlacklist(etc_card_no,plate_no,plate_color,mobile);
                }
            }else{
                this.dealData();
            }
        }else if(typeDialog===1){// 1:修改
                if(etc_card_no.length==20&&isVehicleNumber(plate_no)){
                    if (mobile){
                        if (isPoneAvailable(mobile)){
                            this.props.blacklistStore.getUpdateBlacklist(id,etc_card_no==dialogData.etc_card_no?null:etc_card_no,plate_no==dialogData.plate_no?null:plate_no, plate_color==dialogData.plate_color?null:plate_color,mobile==dialogData.mobile?null:mobile,currentPage);
                        } else {
                            this.setState({mobile_hint:'手机号输入错误',});
                        }
                    }  else {
                        this.props.blacklistStore.getUpdateBlacklist(id,etc_card_no==dialogData.etc_card_no?null:etc_card_no,plate_no==dialogData.plate_no?null:plate_no, plate_color==dialogData.plate_color?null:plate_color,mobile==dialogData.mobile?null:mobile,currentPage);
                    }
            }else{
                this.dealData();
            }
        }else{//2:查看
            this.props.blacklistStore.setIsShowDialog(false);
            this.props.blacklistStore.setDialogData(null);
        }
    }

    onCancel=()=>{
        this.props.blacklistStore.setIsShowDialog(false);
        this.props.blacklistStore.setDialogData(null);
    }

    /**
     *提交前的校验
     */
    dealData=()=>{
        const {etc_card_no,plate_no} = this.state;
        this.setState({
            etc_card_no_hint:etc_card_no?etc_card_no.length==20?'':'请输入正确的ETC卡号(20位)':'请输入ETC卡号',
            plate_no_hint:plate_no?isVehicleNumber(plate_no)?'':'请输入正确的车牌号':'请输入车牌号',
            // plate_color_hint:plate_color_hint?'':'请输入车牌颜色',
            // mobile_hint:mobile_hint?'':'请输入手机号',
        });
    }

    getTitle = ()=>{
        const {typeDialog} = this.props.blacklistStore;//0:新增 1:修改 2:查看
        if(typeDialog===0){
            return "新增";
        }else if (typeDialog===1){
            return "修改";
        }else{
            return "查看";
        }
    }

    render(){
        const {isShowDialog,typeDialog,isShowSubDialog} = this.props.blacklistStore;
        const {plate_no_hint,plate_no,etc_card_no,etc_card_no_hint,plate_color_hint,plate_color,mobile,mobile_hint} = this.state;
        const title = this.getTitle();
        return <Modal okText={typeDialog===2?"确定":"提交"}
                      cancelText="取消" centered={true}
                      confirmLoading={isShowSubDialog}
                      visible={isShowDialog}
                      title={title}
                      onOk={this.onOk} onCancel={this.onCancel}>
            <div className="blacklist-dialog-container">
                <div className="blacklist-dialog-item-container">
                    <div className="blacklist-dialog-item">
                        <p className="blacklist-dialog-item-label"><span>*</span>ETC卡号:</p>
                        <Input className="blacklist-dialog-item-input"
                               disabled={typeDialog===2}
                               maxLength={20}
                               value={etc_card_no}
                               onChange={this.onEtcCardNoChange}/>
                    </div>
                    <p className="blacklist-dialog-item-hint"  style={{visibility:etc_card_no_hint?"visible":"hidden"}}>{etc_card_no_hint}</p>
                </div>
                <div className="blacklist-dialog-item-container">
                    <div className="blacklist-dialog-item">
                        <p className="blacklist-dialog-item-label"><span>*</span>车牌号:</p>
                        <Input className="blacklist-dialog-item-input"
                               disabled={typeDialog===2}
                               maxLength={8}
                               value={plate_no}
                               onChange={this.onPlateNoChange}/>
                    </div>
                    <p className="blacklist-dialog-item-hint"  style={{visibility:plate_no_hint?"visible":"hidden"}}>{plate_no_hint}</p>
                </div>
                <div className="blacklist-dialog-item-container">
                    <div className="blacklist-dialog-item">
                        <p className="blacklist-dialog-item-label">车牌颜色:</p>
                        <Select
                            className="blacklist-dialog-item-input"
                            value={plate_color}
                            disabled={typeDialog===2}
                            onChange={this.onPlateColorChange}>
                            {/*<Select.Option value="">蓝色</Select.Option>*/}
                            <Select.Option value={0}>蓝色</Select.Option>
                            <Select.Option value={1}>黄色</Select.Option>
                            <Select.Option value={2}>黑色</Select.Option>
                            <Select.Option value={3}>白色</Select.Option>
                            <Select.Option value={4}>渐变绿</Select.Option>
                            <Select.Option value={5}>黄绿</Select.Option>
                            <Select.Option value={6}>蓝白</Select.Option>
                        </Select>
                    </div>
                    {/*<p className="blacklist-dialog-item-hint"  style={{visibility:plate_color_hint?"visible":"hidden"}}>{plate_color_hint}</p>*/}
                    <p className="blacklist-dialog-item-hint"  style={{visibility:"hidden"}}>占位</p>
                </div>
                <div className="blacklist-dialog-item-container">
                    <div className="blacklist-dialog-item">
                        <p className="blacklist-dialog-item-label">手机号:</p>
                        <Input className="blacklist-dialog-item-input"
                               disabled={typeDialog===2}
                               maxLength={11}
                               value={mobile}
                               onChange={this.onMobileChange}/>
                    </div>
                    <p className="blacklist-dialog-item-hint"  style={{visibility:mobile_hint?"visible":"hidden"}}>{mobile_hint}</p>
                    {/*<p className="blacklist-dialog-item-hint"  style={{visibility:"hidden"}}>占位</p>*/}
                </div>
            </div>
        </Modal>
    }
}

export default BlacklistDialog;
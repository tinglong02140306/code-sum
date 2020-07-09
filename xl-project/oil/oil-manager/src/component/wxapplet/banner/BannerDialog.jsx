import React from "react";
import "./BannerDialog.scss";
import http from "../../../http/http";
import {Input,Modal,Select,message,Tree,TreeSelect} from 'antd';
import {inject, observer} from 'mobx-react';
import ADDICON from '../../../images/icon-add.png';
import {city} from '../../../constants/city_title'
import {addTreeProvence} from "../../../utils/utils";
import CityTree from "../../../page/wxapplet/components/city-tree/CityTree";
import {dealCityName} from "../../../utils/common/city";
import {isEmpty} from "../../../utils/isEmpty";

const Option = Select.Option;
const cityData = city;
@inject("bannerStore")
@observer
class EtcOilDialog extends React.Component{

    constructor(){
        super();
        this.state={

            file_path:'',
            isEmptyResourceName:'false',
            accept:'image/*',
            confirmLoading:false,
            isDisabled:false,
            checkedKeys:[],
            treeData:city,
            newIndex:[],
            isEmptyCheckedData:'',

            isEmptyFile:'',
            isEmptyUrl:'',
            isEmptySequence:'',
            isEmptyArea:'',
            file:'',//文件流
            sequence:'0',//顺序
            purpose:'WXAPPLET',//用途
            name:'',//名称
            targetUri:'',//目标位置
            area_name:'全国',//地区
            area_code:'000000',//所属
            subjoin:'',//附加
            bannerUrl:'',//地址
            pushType:2,//上传方式 1.url 2.文件
        }
    }

    componentDidMount(){
        const {storeItem} = this.props.bannerStore;
        if(storeItem){
            if (storeItem.area_code){
                const area_code_arr = storeItem.area_code.split(',');
                this.setState({
                    checkedKeys:area_code_arr||[]
                })
            }
            this.setState({
                file:storeItem.banner_url,
                file_path:storeItem.banner_url,
                name:storeItem.name,
                resourceType:storeItem.resource_type,
                resourceUse:storeItem.resource_use,
                // backgroundColorHex:storeItem.background_color_hex,
                targetUri:storeItem.target_uri,
                sequence:storeItem.sequence,
                orgId:storeItem.org_id,
                area_code:storeItem.area_code,
                area_name:storeItem.area_name,
                isEmptyResourceName:'false',
                isEmptyBackgroundColorHex:'false',
                isEmptyFile:'',
                confirmLoading:false,
                isDisabled:true
            });
            if(storeItem.resource_type==1){
                this.setState({accept:'image/*'});
            }else if(storeItem.resource_type==2){
                this.setState({accept:'video/*'});
            }
        }
    }

    onCancel=()=>{
        this.props.bannerStore.setIsShowDialog(false);
        this.props.bannerStore.setStoreItem(null);
    }

    onOk=()=>{
        const {typeModal} = this.props.bannerStore;//0:新增 1:修改 2 :查看
        const {bannerUrl,file,area_code,sequence} = this.state;

        if(typeModal===2){//查看
            this.props.bannerStore.setIsShowDialog(false);
            this.props.bannerStore.setStoreItem(null);
        }else{

            if(typeModal===0){//新增
                if (sequence&&area_code){
                    if (file||bannerUrl){
                        this.setState({confirmLoading:true});
                        this.resourceAdd();
                    }else {
                        this.setState({isEmptyFile:file?"":'请添加Banner文件'});
                        this.setState({isEmptyUrl:isEmpty(bannerUrl)?"":'请添加BannerUrl'});
                    }
                }else {
                    this.setState({isEmptySequence:isEmpty(sequence)?"顺序不能为空":''});
                    this.setState({isEmptyArea:isEmpty(area_code)?"请选择所属地区":''});
                }
            }else{//修改
                if (sequence&&area_code){
                    this.setState({confirmLoading:true});
                    this.resourceUpdate();
                }else {
                    this.setState({isEmptySequence:isEmpty(sequence)?"false":'顺序不能为空'});
                    this.setState({isEmptyArea:isEmpty(area_code)?"请选择所属地区":''});
                }
            }
        }
    }

    //添加
    resourceAdd = () =>{
        const {name,sequence,targetUri,purpose,bannerUrl,area_name,area_code,file,pushType} = this.state;

        let formData = new FormData();
        formData.append('name', name);
        formData.append('purpose', purpose);
        formData.append('targetUri', targetUri);
        formData.append('sequence', sequence);
        formData.append('areaCode', area_code);
        formData.append('areaName', area_name);
        if (pushType === 2){
            formData.append('file', file?file:null);
        }else {
            formData.append('bannerUrl', bannerUrl?bannerUrl:null);
        }
        http.postFile("/website/resource/add-banner",formData,res=>{
            this.setState({confirmLoading:false});
            this.props.bannerStore.setIsShowDialog(false);
            this.props.bannerStore.setStoreItem(null);
            this.props.bannerStore.getResourceList(this.props.bannerStore.params);
        },err=>{
            this.setState({confirmLoading:false});
            message.error(err);
        });
    }

    //修改
    resourceUpdate = () =>{
        const {typeModal,storeItem} = this.props.bannerStore;//0:新增 1:修改 2 :查看
        const {name,sequence,targetUri,purpose,subjoin,area_name,area_code} = this.state;

        const params = {
            id: storeItem.id,
            name: name,
            purpose: purpose,
            target_uri: targetUri,
            sequence: sequence,
            subjoin: subjoin,
            area_code: area_code,
            area_name: area_name,
        }

        http.post("/website/resource/update-banner",params,res=>{
            this.setState({confirmLoading:false});
            this.props.bannerStore.setIsShowDialog(false);
            this.props.bannerStore.setStoreItem(null);
            this.props.bannerStore.getResourceList(this.props.bannerStore.params);
        },err=>{
            this.setState({confirmLoading:false});
            message.error(err);
        })
    }

    dealResponse=(res)=>{
        if(res.response_code=="0000"){
            if(res.result_code=="00000"){
                this.props.bannerStore.setIsShowDialog(false);
                this.props.bannerStore.setStoreItem(null);
                this.props.bannerStore.getResourceList(this.props.bannerStore.params);
            }else{
                message.error(res.result_msg);
            }
        }else{
            message.error(res.response_msg);
        }
    }

    getObjectURL = (file) => {
        let url = null;
        if(file){
            // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
            if (window.createObjectURL !== undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL !== undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL !== undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
        }
        return url;
    }

    onResourceUse=(e)=>{
        this.setState({purpose: e});
    }

    onResourceType=(e)=>{
        this.setState({pushType: e});
    }

    onResourceName=(e)=>{
        this.setState({name: e.target.value});
    }

    onTargetUrl=(e)=>{
        this.setState({targetUri: e.target.value});
    }

    onSequence=(e)=>{
        this.setState({sequence: e.target.value});
    }

    onOrgId=(e)=>{
        this.setState({subjoin: e.target.value});
    }

    onBannerUrl=(e)=>{
        this.setState({bannerUrl: e.target.value});
    }

    fileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                file: file||this.state.file,
                file_path:this.getObjectURL(file)
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

    onChangeTree = (value,title) => {
        this.setState({
            area_code:value,
            area_name:title[0]
        });

    };


    render(){
        const {isShowDialog,typeModal} = this.props.bannerStore;//0:新增 1:修改 2 :查看
        const {name,sequence,targetUri,purpose,subjoin,accept,isEmptyUrl,file_path,isEmptyFile,pushType,confirmLoading,bannerUrl,treeData,area_name,area_code,isEmptyArea,isEmptySequence} = this.state;
        let title = "";
        let okText = "";
        if(typeModal===0){
            title="录入";
            okText="提交"
        }else if (typeModal===1){
            title="修改";
            okText="提交"
        }else{
            title="查看";
            okText="确定"
        }
        return <Modal title={title} okText={okText} okType="primary" cancelText="取消" width={900}
                      onCancel={this.onCancel} onOk={this.onOk}
                      visible={isShowDialog} confirmLoading={confirmLoading}>
            <div className="etc-oil-dialog-box-container">
                <div className="etc-oil-dialog-box">
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">Banner名称:</p>
                            <Input placeholder="请输入资源名称" onChange={this.onResourceName} value={name}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder"></p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">目标位置:</p>
                            <Input placeholder="请输入目标位置" onChange={this.onTargetUrl} value={targetUri}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" ></p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>顺序:</p>
                            <Input placeholder="请输入顺序" onChange={this.onSequence} value={sequence}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptySequence}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>Banner用途:</p>
                            <Select onChange={this.onResourceUse} defaultValue={purpose} disabled={typeModal===2}>
                                <Option value={'WXAPPLET'}>WXAPPLET</Option>
                                <Option value={'ALIPAY_APPLET'}>ALIPAY_APPLET</Option>
                                <Option value={'EQUITY'}>EQUITY</Option>
                            </Select>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: "hidden"}}></p>
                    </div>
                    <div className="etc-oil-dialog-item-box" style={{display:typeModal===1?'flex':'none'}}>
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>所属地区:</p>
                            <TreeSelect
                                value={area_code}
                                treeData={treeData}
                                placeholder="Please select"
                                treeDefaultExpandAll
                                onChange={this.onChangeTree}
                            />                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptyArea}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box" style={{display:typeModal!==1?'flex':'none'}}>
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>上传方式:</p>
                            <Select onChange={this.onResourceType} defaultValue={pushType} disabled={typeModal===2}>
                                <Option value={1}>Banner地址</Option>
                                <Option value={2}>Banner文件</Option>
                            </Select>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: "hidden"}}></p>
                    </div>
                </div>
                <div className='etc-oil-dialog-box-line' style={{display:typeModal!==1?'flex':'none'}}></div>
                <div className="etc-oil-dialog-box" style={{display:typeModal!==1?'flex':'none'}}>
                    <div className="etc-oil-dialog-item-box" style={{display:pushType===2?'flex':'none'}}>
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>Banner文件:</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div>
                                        <img className="etc-oil-dialog-file-image" style={{display:file_path?'flex':'none'}} alt="图片" src={file_path}></img>
                                    </div>
                                    <img className="etc-oil-dialog-file-add" src={ADDICON}  alt="Logo"></img>
                                    <Input className="etc-oil-dialog-file-input" type="file"
                                           accept={accept}
                                           onChange={this.fileChange} disabled={typeModal===2}></Input>
                                </div>
                            </div>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptyFile}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box" style={{display:pushType===1?'flex':'none'}}>
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>Banner地址:</p>
                            <Input placeholder="请输入bannerUrl" onChange={this.onBannerUrl} value={bannerUrl}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptyUrl}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box" >
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>所属地区:</p>
                            <TreeSelect
                                value={area_code}
                                treeData={treeData}
                                placeholder="Please select"
                                treeDefaultExpandAll
                                onChange={this.onChangeTree}
                            />                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptyArea}</p>
                    </div>
                </div>
            </div>
        </Modal>
    }
}

export default EtcOilDialog;
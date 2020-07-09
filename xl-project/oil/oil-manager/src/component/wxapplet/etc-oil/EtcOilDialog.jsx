import React from "react";
import "./EtcOilDialog.scss";
import http from "../../../http/http";
import {Input,Modal,Select,message,Tree} from 'antd';
import {inject, observer} from 'mobx-react';
import ADDICON from '../../../images/icon-add.png';
import {city} from '../../../constants/city_key'
import {addTreeProvence} from "../../../utils/utils";
import CityTree from "../../../page/wxapplet/components/city-tree/CityTree";
import {dealCityName} from "../../../utils/common/city";
import {isEmpty} from "../../../utils/isEmpty";

const Option = Select.Option;
const cityData = city;
@inject("etcOilStore")
@observer
class EtcOilDialog extends React.Component{

   constructor(){
        super();
        this.state={
            file:'',
            bigFile:'',
            file_path:'',
            bigFile_path:'',
            resourceName:'',
            resourceType:1,
            resourceUse:2,
            backgroundColorHex:'',
            targetUrl:'',
            sequence:'',
            orgId:'',
            isEmptyResourceName:'false',
            isEmptyBackgroundColorHex:'false',
            isEmptyFile:'',
            isEmptyBigFile:'',
            accept:'image/*',
            confirmLoading:false,
            isDisabled:false,
            checkedKeys:[],
            treeData:city,
            newIndex:[],
            area_code:'',
            area_name:'',
            isEmptyCheckedData:'',
        }
   }

   componentDidMount(){
       const {storeItem} = this.props.etcOilStore;
       if(storeItem){
           if (storeItem.area_code){
               const area_code_arr = storeItem.area_code.split(',');
               this.setState({
                   checkedKeys:area_code_arr||[]
               })
           }
           this.setState({
                file:storeItem.file_url,
                file_path:storeItem.file_url,
                bigFile_path:storeItem.big_file_url,
                bigFile:storeItem.big_file_url,
                resourceName:storeItem.resource_name,
                resourceType:storeItem.resource_type,
                resourceUse:storeItem.resource_use,
                backgroundColorHex:storeItem.background_color_hex,
                targetUrl:storeItem.target_url,
                sequence:storeItem.sequence,
                orgId:storeItem.org_id,
               area_code:storeItem.area_code,
               area_name:storeItem.area_name,
                isEmptyResourceName:'false',
                isEmptyBackgroundColorHex:'false',
                isEmptyFile:'',
                isEmptyBigFile:'',
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
        this.props.etcOilStore.setIsShowDialog(false);
        this.props.etcOilStore.setStoreItem(null);
    }

    onOk=()=>{
        const {typeModal,storeItem} = this.props.etcOilStore;//0:新增 1:修改 2 :查看
        const {area_code,newIndex,orgId,targetUrl,sequence,file,bigFile,resourceName,resourceType,resourceUse,backgroundColorHex} = this.state;
        if(typeModal===2){//查看
            this.props.etcOilStore.setIsShowDialog(false);
            this.props.etcOilStore.setStoreItem(null);
        }else{

            if (resourceUse === 2){
                if (!isEmpty(area_code)&&resourceName&&file){
                    this.setState({confirmLoading:true});
                    if(typeModal===0){//新增
                        this.resourceAdd();
                    }else{//修改
                        this.resourceUpdate();
                    }
                }else {
                    this.setState({isEmptyResourceName:resourceName?"false":'请输入资源名称'});
                    this.setState({isEmptyFile:file?"":'请添加资源文件'});
                    this.setState({isEmptyCheckedData:isEmpty(area_code)?"请选择省份":''});
                }
            }else {
                if(resourceName&&file){
                    this.setState({confirmLoading:true});
                    if(typeModal===0){//新增
                        this.resourceAdd();
                    }else{//修改
                        this.resourceUpdate();
                    }
                }else{
                    this.setState({isEmptyResourceName:resourceName?"false":'请输入资源名称'});
                    // this.setState({isEmptyBackgroundColorHex:backgroundColorHex?"false":'请输入背景色'});
                    this.setState({isEmptyFile:file?"":'请添加资源文件'});
                    // this.setState({isEmptyBigFile:bigFile?"":'请添加资源文件(大)'});
                    // this.setState({isEmptyCheckedData:newIndex.length>0?"":'请选择省份'});
                }
            }
        }
        
    }

    //添加
    resourceAdd = () =>{
        const {newIndex,orgId,targetUrl,sequence,file,bigFile,resourceName,resourceType,resourceUse,backgroundColorHex} = this.state;
        let area_code = newIndex.join(",");
        let area_name = dealCityName(newIndex).join(",");
        let formData = new FormData();
        formData.append('resourceName', resourceName);
        formData.append('resourceType', resourceType);
        formData.append('resourceUse', resourceUse);
        formData.append('backgroundColorHex', backgroundColorHex);
        formData.append('targetUrl', targetUrl);
        formData.append('sequence', sequence);
        formData.append('areaCode', area_code);
        formData.append('areaName', area_name);
        formData.append('orgId', orgId);
        formData.append('file', file);
        if(bigFile){
            formData.append('bigFile', bigFile);
        }
        // console.log("dd"+formData.getAll());
        http.postFile("/website/admin/param/static-resource-add",formData,res=>{
            console.log(formData.get("resourceName")+formData.get("area_name"));

            this.setState({confirmLoading:false});
            this.props.etcOilStore.setIsShowDialog(false);
            this.props.etcOilStore.setStoreItem(null);
            this.props.etcOilStore.getResourceList(this.props.etcOilStore.params);
        },err=>{
            this.setState({confirmLoading:false});
            message.error(err);
        });
    }

    //修改
    resourceUpdate = () =>{
        const {typeModal,storeItem} = this.props.etcOilStore;//0:新增 1:修改 2 :查看
        const {area_code,area_name,newIndex,orgId,targetUrl,sequence,file,bigFile,resourceName,resourceType,resourceUse,backgroundColorHex} = this.state;
        // let area_code = newIndex.join(",");
        // let area_name = dealCityName(newIndex).join(",");

        let formData = new FormData();
        formData.append('id', storeItem.id);
        formData.append('resourceName', resourceName);
        formData.append('backgroundColorHex', backgroundColorHex);
        formData.append('targetUrl', targetUrl);
        formData.append('sequence', sequence);
        formData.append('areaCode', area_code);
        formData.append('areaName', area_name);
        formData.append('orgId', orgId);
        if(file!=storeItem.file_url){
            formData.append('file', file);
        }
        if(bigFile!=storeItem.big_file_url){
            formData.append('bigFile', bigFile);
        }
        http.postFile("/website/admin/param/static-resource-update",formData,res=>{
            this.setState({confirmLoading:false});
            this.props.etcOilStore.setIsShowDialog(false);
            this.props.etcOilStore.setStoreItem(null);
            this.props.etcOilStore.getResourceList(this.props.etcOilStore.params);
        },err=>{
            this.setState({confirmLoading:false});
            message.error(err);
        })
    }

    dealResponse=(res)=>{
        if(res.response_code=="0000"){
            if(res.result_code=="00000"){
                this.props.etcOilStore.setIsShowDialog(false);
                this.props.etcOilStore.setStoreItem(null);
                this.props.etcOilStore.getResourceList(this.props.etcOilStore.params);
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
        this.setState({resourceUse: e});
    }

    onResourceType=(e)=>{
        if(e==1){
            this.setState({accept:'image/*'});
        }else if(e==2){
            this.setState({accept:'video/*'});
        }
        this.setState({resourceType: e});
    }

    onResourceName=(e)=>{
        this.setState({resourceName: e.target.value});
    }

    onTargetUrl=(e)=>{
        this.setState({targetUrl: e.target.value});
    }

    onSequence=(e)=>{
        this.setState({sequence: e.target.value});
    }

    onOrgId=(e)=>{
        this.setState({orgId: e.target.value});
    }

    onBackgroundColorHex=(e)=>{
        this.setState({backgroundColorHex: e.target.value});
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

    fileBigChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyBigFile: '',
                bigFile: file||this.state.bigFile,
                bigFile_path:this.getObjectURL(file)
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

    onTreeCheck = (expandedKeys,e) => {
        this.setState({checkedKeys:expandedKeys});
        console.log('checkedKeys'+expandedKeys);
        this.dealCheckKeys(expandedKeys)
    };
    //处理选中内容
    dealCheckKeys = (_keys) => {
        if(!_keys) return
        let keys = this.deepClone(_keys);
        let indexArray = [];
        let newIndex = [];
        if(_keys.indexOf("000000")>=0){
            newIndex.push("000000")
        }else{
            for(let i=0; i<keys.length; i++){
                const key = keys[i];
                if (key.endsWith('0000')) {
                    const subCode = key.substring(0,2);
                    for(let j=0; j<keys.length;j++){
                        const _sub = keys[j];
                        if(_sub!==`${subCode}0000`&&_sub.startsWith(subCode)){
                            indexArray.push(j);
                        }
                    }
                }
            }
            for (let i=0;i<keys.length; i++) {
                if (indexArray.indexOf(i) === -1) {
                    newIndex.push(keys[i])
                }
            }
        }
        let area_code = newIndex.join(",");
        let area_name = dealCityName(newIndex).join(",");
        this.setState({
            area_code:area_code,
            area_name:area_name,
            newIndex:newIndex,
        })
        // this.props.onChange(newIndex)
        return newIndex;
    }

    deepClone = (arr) => {
        let obj=arr.constructor===Array?[]:{};
        for(let item in arr){
            if(typeof arr[item]==="object"){
                obj[item]=this.deepClone(arr[item]);
            }else{
                obj[item]=arr[item];
            }
        }
        return obj;
    }
    //  dealCityName = (_newIndex) => {
    //     let newIndex = deepClone(_newIndex);
    //     // cityArr=[];
    //     for(let i=0; i<newIndex.length; i++){
    //         const seleteItem = newIndex[i];
    //         dealData(seleteItem,city);
    //     }
    //     return cityArr;
    // }

    //搜索
    onSearchChange = e => {
        const { value } = e.target;
        const keys = this.dealSearchValue(value);
        this.setState({checkedKeys:keys});
        this.dealCheckKeys(keys);
    };

    //处理搜索的key
    dealSearchValue = title => {
        let keyArray = [];
        for(let i=0; i<city.length; i++){
            const item = city[i];
            if (item.title.indexOf(title) >= 0) {
                keyArray.push(item.key);
            }
            const children = item.children;
            if(children&&children.length){
                for(let k=0; k<children.length; k++){
                    const _item = children[k];
                    if (_item.title.indexOf(title) >= 0) {
                        keyArray.push(_item.key);
                    }
                }
            }
        }
        return keyArray;
    }
    render(){
        const {isShowDialog,typeModal} = this.props.etcOilStore;//0:新增 1:修改 2 :查看
        const {checkedKeys,treeData,orgId,targetUrl,sequence,confirmLoading,bigFile_path,file_path,isEmptyFile,isEmptyBigFile,resourceName,backgroundColorHex,isEmptyBackgroundColorHex,isEmptyResourceName,accept,resourceType,resourceUse} = this.state;
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
                            <p className="etc-oil-dialog-item-label"><span>* </span>资源名称:</p>
                            <Input placeholder="请输入资源名称" onChange={this.onResourceName} value={resourceName}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: isEmptyResourceName!='false'?"visible":"hidden"}}>{isEmptyResourceName}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">背景色:</p>
                            <Input placeholder="请输入背景色" onChange={this.onBackgroundColorHex} value={backgroundColorHex}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: isEmptyBackgroundColorHex!='false'?"visible":"hidden"}}>{isEmptyBackgroundColorHex}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">目标链接:</p>
                            <Input placeholder="请输入目标链接" onChange={this.onTargetUrl} value={targetUrl}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: isEmptyBackgroundColorHex!='false'?"visible":"hidden"}}>{isEmptyBackgroundColorHex}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">顺序:</p>
                            <Input placeholder="请输入顺序" onChange={this.onSequence} value={sequence}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: isEmptyBackgroundColorHex!='false'?"visible":"hidden"}}>{isEmptyBackgroundColorHex}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">机构号:</p>
                            <Input placeholder="请输入机构号" onChange={this.onOrgId} value={orgId}></Input>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: isEmptyBackgroundColorHex!='false'?"visible":"hidden"}}>{isEmptyBackgroundColorHex}</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>资源用途:</p>
                            <Select onChange={this.onResourceUse} defaultValue={resourceUse} disabled={typeModal===2}>
                                <Option value={1}>小程序静态资源</Option>
                                <Option value={2}>小程序banner</Option>
                            </Select>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: "hidden"}}>资源用途不能为空</p>
                    </div>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>资源类型:</p>
                            <Select onChange={this.onResourceType} defaultValue={resourceType} disabled={typeModal===2}>
                                <Option value={1}>图片</Option>
                                <Option value={2}>视频</Option>
                                <Option value={3}>其它</Option>
                            </Select>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder" style={{visibility: "hidden"}}>资源类型不能为空</p>
                    </div>
                </div>
                <div className='etc-oil-dialog-box-line'></div>
                <div className="etc-oil-dialog-box">
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>资源文件:</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div style={{display:resourceType===1?'flex':'none'}}>
                                        <img className="etc-oil-dialog-file-image" style={{display:file_path?'flex':'none'}} alt="图片" src={file_path}></img>
                                    </div>
                                    <div style={{display:resourceType===2?'flex':'none'}}>
                                        <video className="etc-oil-dialog-file-image" style={{display:file_path?'flex':'none'}} alt="图片" src={file_path}></video>
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
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label">资源文件(大):</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div style={{display:resourceType===1?'flex':'none'}}>
                                        <img className="etc-oil-dialog-file-image" alt="图片" style={{display:bigFile_path?'flex':'none'}}  src={bigFile_path}></img>
                                    </div>
                                    <div style={{display:resourceType===2?'flex':'none'}}>
                                        <video className="etc-oil-dialog-file-image" style={{display:bigFile_path?'flex':'none'}} alt="图片" src={bigFile_path}></video>
                                    </div>
                                    <img className="etc-oil-dialog-file-add" src={ADDICON}  alt="Logo"></img>
                                    <Input className="etc-oil-dialog-file-input" type="file"
                                           accept={accept} disabled={typeModal===2}
                                           onChange={this.fileBigChange}></Input>
                                </div>
                            </div>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{isEmptyBigFile}</p>
                    </div>
                    <div className="etc-oil-dialog-box" style={{display:resourceUse===2?'flex':'none'}}>
                        <div className="etc-oil-dialog-item-content">
                            <div className="etc-oil-dialog-item-label"><span>*</span>省份:</div>
                            <Input.Search
                                style={{width: 250}}
                                placeholder="查询/搜索"
                                onChange={this.onSearchChange}
                            />
                        </div>
                        <div className="etc-oil-dialog-item-content-city">
                            {/*<CityTree></CityTree>*/}
                            <div className="etc-oil-dialog-item-label-city"></div>
                            <div style={{
                                width:350,
                                height:treeData[0]&&treeData[0].children.length >= 5 ? 200 : "auto",
                                overflowY:treeData[0]&&treeData[0].children.length >= 5 ? "scroll" : "hidden",
                                overflowX: "hidden",
                            }}>
                                <Tree
                                    style={{width:250}}
                                    checkable
                                    onCheck={this.onTreeCheck}
                                    checkedKeys={checkedKeys}
                                    autoExpandParent={true}>
                                    {this.renderTreeNodes(treeData)}
                                </Tree>
                        </div>
                        </div>
                        <p className="etc-oil-dialog-item-placeholder">{this.state.isEmptyCheckedData}</p>
                    </div>
                </div>
            </div>
        </Modal>
    }
}

export default EtcOilDialog;
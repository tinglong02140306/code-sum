import React from "react";
import "./StationImgDialog.scss";
import http from "../../../http/http";
import {Input,Modal,Select,message} from 'antd';
import {inject, observer} from 'mobx-react';
import ADDICON from '../../../images/icon-add.png';
const Option = Select.Option;

@inject("imageStore")
@observer
class ImageBulkChanges extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            gas_station_name:'',
            xl_id:'',
            image_url:'',
            file_path:'',
            isEmptyFile:'',
            accept:'image/*',
            confirmLoading:false,
            isDisabled:false
        }
    }

    componentDidMount(){
        const {id,gas_station_name,xl_id,image_url} = this.props.imageStore.stationImgObject;
        this.setState({
            id:id,
            gas_station_name:gas_station_name,
            xl_id:xl_id,
            image_url:image_url,
            file_path:image_url,
            isEmptyFile:'',
            isEmptyBigFile:'',
            confirmLoading:false,
            isDisabled:true
        });
    }

    onCancel=()=>{
        this.props.imageStore.setIsShowBulkDialog(false);
        // this.props.imageStore.setStationImgObject(null);
    }

    onOk=()=>{

        const {stationArray} = this.props.imageStore;
        const {image_url} = this.state;
        if(image_url){
            this.setState({confirmLoading:true});
            let formData = new FormData();
            formData.append('stationArray', stationArray);
            formData.append('file', image_url);
            console.log(stationArray);
            console.log(image_url);
            console.log(JSON.stringify(formData));
            http.postFile("/website/gasstation/station-image-batch-update",formData,res=>{
                this.setState({confirmLoading:false});
                this.props.imageStore.setIsShowBulkDialog(false);
                this.props.imageStore.setStationArray([]);
                message.info("修改成功");
                this.props.imageStore.getStationImage(this.props.imageStore.params);
            },err=>{
                this.setState({confirmLoading:false});
                message.error(err);
            })
        }else{
            this.setState({isEmptyFile:image_url?"":'请添加资源文件'});
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

    fileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                image_url: file||this.state.image_url,
                file_path:this.getObjectURL(file)
            });
        }
    }

    render(){
        const {typeModal,isShowBulkDialog} = this.props.imageStore;//0:新增 1:修改 2 :查看
        const {file_path,confirmLoading,isEmptyFile,accept} = this.state;
        let title = "批量修改";
        let okText = "提交";

        return <Modal title={title} okText={okText} okType="primary" cancelText="取消"
                      onCancel={this.onCancel} onOk={this.onOk}
                      visible={isShowBulkDialog} confirmLoading={confirmLoading}>
            <div className="station-img-dialog-box">
                <div className="station-img-dialog-item-box">
                    <div className="station-img-dialog-item-content">
                        <p className="station-img-dialog-item-label"><span>* </span>油站图片:</p>
                        <div className="station-img-dialog-file-box">
                            <div className="station-img-dialog-file-content-box">
                                <div style={{display:'flex'}}>
                                    <img className="etc-oil-dialog-file-image" style={{display:file_path?'flex':'none'}} alt="图片" src={file_path}></img>
                                    {/*<img className="station-img-dialog-file-image" style={{display:image_url?'flex':'none'}} alt="图片" src={image_url}></img>*/}
                                </div>
                                <img className="station-img-dialog-file-add" src={ADDICON}  alt="Logo"></img>
                                <Input className="station-img-dialog-file-input" type="file"
                                       accept={accept}
                                       onChange={this.fileChange} disabled={typeModal===2}></Input>
                            </div>
                        </div>
                    </div>
                    <p className="station-img-dialog-item-placeholder">{isEmptyFile}</p>
                </div>
            </div>
        </Modal>
    }
}

export default ImageBulkChanges;
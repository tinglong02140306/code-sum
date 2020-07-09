import React from "react";
import "./BrandDialog.scss";
import {Input,Modal,Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {isMoney} from "../../../utils/isMoney";

@inject("brandStore")
@observer
class BrandDialog extends React.Component{

    constructor(){
        super();
        this.state={
            id:'',
            name:'',
            code:'',
            logo_url:'',
            map_icon_url:'',
            logo_base64:'',
            map_icon_base64:'',
            isEmptyName:false,
            isEmptyCode:false,
            isEmptyLogo:false,
            isEmptyMapIcon:false,
            isVisiblePre: "hidden",
            isVisiblePre1: "hidden",
            isLogoHint: "",
            isMapIconHint: "",

        }
    }

    componentDidMount(){
        const {id,name,code,logo_url, map_icon_url} = this.props.brandStore.brandObject;
        const {typeModal} = this.props.brandStore;//0:增加 1:修改 2 :查看
        console.log(id)
        if (typeModal !==0){
            this.setState({
                id:id,
                name:name||'',
                code:code||'',
                logo_url:logo_url||'',
                map_icon_url:map_icon_url||'',
                logo_base64:logo_url||'',
                map_icon_base64:map_icon_url||'',
                isEmptyName:false,
                isEmptyCode:false,
                isEmptyLogo:false,
                isEmptyMapIcon:false,
                isCanPreview:false,
                isCanPreview1:false,
                isVisiblePre: "hidden",
                isVisiblePre1: "hidden",
                isLogoHint: "",
                isMapIconHint: "",
            });
        }

    }

    onNameChange=(e)=>{
        this.setState({name:e.target.value});
    };

    onCodeChange=(e)=>{
        this.setState({code:e.target.value});
    };


    onCancel=()=>{
        this.props.brandStore.setIsShowDialog(false);
        // this.props.brandStore.setBrandObject(null);
    }

    onOk=()=>{

        const {typeModal} = this.props.brandStore;// 1:修改 2 :查看
        const {id,name,code,logo_url, map_icon_url,logo_base64,map_icon_base64} = this.state;

        if(typeModal===0){//新增
            if (!isEmpty(name)&&!isEmpty(code)&&!isEmpty(logo_base64)&&!isEmpty(map_icon_base64)) {

                this.props.brandStore.addBrand(name,code,logo_base64,map_icon_base64);

            }else {
                this.dealData();
            }

        }else if(typeModal===1){//修改
            if (!isEmpty(name)&&!isEmpty(code)&&!isEmpty(logo_base64)&&!isEmpty(map_icon_base64)) {

                this.props.brandStore.updateBrand(id,name,code,logo_base64,map_icon_base64);

            }else {
                this.dealData();
            }
        }else{
            this.props.brandStore.setIsShowDialog(false);
            // this.props.brandStore.setBrandObject(null);
        }
    }
    /**
     *提交前的校验
     */
    dealData=()=>{
        const {name,code,logo_url, map_icon_url,logo_base64,map_icon_base64} = this.state;
        this.setState({
            isEmptyName:name?false:true,
            isEmptyCode:code?false:true,
            isEmptyLogo:logo_base64?false:true,
            isEmptyMapIcon:map_icon_base64?false:true,
            isLogoHint: logo_base64?"":"logo不能为空",
            isMapIconHint: map_icon_base64?"":"图标不能为空",
        });
    }

    handleCancel = () => {
        this.setState({isCanPreview: false});
    }
    handleCancel1 = () => {
        this.setState({isCanPreview1: false});
    }

    onChangeImage = (e) => {
        const reader = new FileReader();
        const allowImgFileSize = 1024 * 1024 * 5; //上传图片最大值(单位字节)超过5M上传失败
        const file = e.target.files[0];
        const url = this.getObjectURL(file);
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                if (allowImgFileSize !== 0 && allowImgFileSize < reader.result.length) {
                    this.setState({
                        isEmptyLogo: true,
                        isLogoHint: "照片大小不能超过5M",
                        logo_base64: ""
                    });
                    return;
                } else {
                    this.setState({
                        isEmptyLogo: false,
                        logo_base64: reader.result,
                        logo_url: url
                    });
                }
            }
        } else {
            this.setState({
                isEmptyLogo: true,
                isLogoHint: "照片格式错误",
                logo_url: ""
            });
        }
    }
    onChangeImage1 = (e) => {
        const reader = new FileReader();
        const allowImgFileSize = 1024 * 1024 * 5; //上传图片最大值(单位字节)超过5M上传失败
        const file = e.target.files[0];
        const url = this.getObjectURL(file);
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                if (allowImgFileSize !== 0 && allowImgFileSize < reader.result.length) {
                    this.setState({
                        isEmptyMapIcon: true,
                        isMapIconHint: "照片大小不能超过5M",
                        map_icon_base64: ""
                    });
                    return;
                } else {
                    this.setState({
                        isEmptyMapIcon: false,
                        map_icon_base64: reader.result,
                        map_icon_url: url
                    });
                }
            }
        } else {
            this.setState({
                isEmptyMapIcon: true,
                isMapIconHint: "照片格式错误",
                map_icon_url: ""
            });
        }
    }

    getObjectURL = (file) => {
        let url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    //鼠标放上 显示覆盖层
    onMouseUp = () => {
        if (!isEmpty(this.state.logo_url)) {
            this.setState({isVisiblePre: "visible"});
        }
    }
    //鼠标移开 移除覆盖层
    onMouseLeave = () => {
        this.setState({isVisiblePre: "hidden"});
    }

    //预览图片
    onPreviewImage = () => {
        this.setState({isCanPreview: true});
    }
    //删除图片
    onDeleteImage = () => {
        this.setState({logo_url: ""});
    }

    //鼠标放上 显示覆盖层
    onMouseUp1 = () => {
        if (!isEmpty(this.state.map_icon_url)) {
            this.setState({isVisiblePre1: "visible"});
        }
    }
    //预览图片
    onPreviewImage1 = () => {
        this.setState({isCanPreview1: true});
    }
    //鼠标移开 移除覆盖层
    onMouseLeave1 = () => {
        this.setState({isVisiblePre1: "hidden"});
    }

    //删除图片
    onDeleteImage1 = () => {
        this.setState({map_icon_url: ""});
    }


    render(){
        const {isShowDialog,typeModal} = this.props.brandStore;//0:新增 1:修改 2 :查看
        const {isEmptyCode,isEmptyLogo,isEmptyMapIcon,isEmptyName,name,code,logo_url, map_icon_url,logo_base64,map_icon_base64,isLogoHint,isMapIconHint} = this.state;
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
        return (
            <Modal title={title}
                   okText={okText}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowDialog}>
                <div className="company-dialog-box">
                    <div className="company-dialog-item">
                        <div className="company-dialog-item-content">
                            <p className="company-dialog-item-label"><span>*</span>名称:</p>
                            <Input placeholder="请输入名称"
                                   disabled={typeModal!==2?false:true}
                                   value={name}
                                   onChange={this.onNameChange}></Input>
                        </div>
                        <p className="company-dialog-item-placeholder"style={{visibility:isEmptyName?"visible":"hidden"}}>名称不能为空</p>
                    </div>
                    <div className="company-dialog-item">
                        <div className="company-dialog-item-content">
                            <p className="company-dialog-item-label"><span>*</span>品牌代码:</p>
                            <Input placeholder="品牌代码(英文或简称首字母)"
                                   disabled={typeModal!==2?false:true}
                                   value={code}
                                   onChange={this.onCodeChange}></Input>
                        </div>
                        <p className="company-dialog-item-placeholder"style={{visibility:isEmptyCode?"visible":"hidden"}}>品牌代码不能为空</p>
                    </div>
                    <div className="company-dialog-item">
                        <div className="company-dialog-item-content">
                            <p className="company-dialog-item-label"><span>*</span>品牌logo:</p>
                            <div style={{width:"250px"}}>
                                <div className="company-dialog-upload"
                                     onMouseOver={this.onMouseUp}
                                     onMouseOut={this.onMouseLeave}>
                                    <div className="company-img-content">
                                        <div className="company-img-hint"
                                             style={{visibility: isEmpty(logo_url) ? "visible" : "hidden"}}>
                                            <Icon type="plus"/>上传
                                        </div>
                                        <div className="company-image-div">
                                            <img src={logo_url}
                                                 style={{visibility: !isEmpty(logo_url) ? "visible" : "hidden"}}
                                                 alt="品牌logo" className="upload-image"/>
                                            <div className="company-image-overlay"
                                                 style={{visibility: this.state.isVisiblePre}}>
                                                <div onClick={this.onPreviewImage}>
                                                    <Icon type="eye-o" style={{color: "#fff"}}/>
                                                </div>
                                                <div onClick={this.onDeleteImage}
                                                     style={{display: typeModal !== 2 ? "block" : "none"}}>
                                                    <Icon type="delete" style={{color: "#fff"}}/></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input className="organization-input"
                                           type="file"
                                           multiple="multiple"
                                           value=""
                                           onChange={this.onChangeImage}
                                           style={{display: isEmpty(logo_url) ? "block" : "none"}}
                                           accept="image/png, image/jpeg, image/gif, image/jpg"/>
                                    <Modal visible={this.state.isCanPreview} footer={null}
                                           onCancel={this.handleCancel}>
                                        <img alt="example" style={{width: '100%'}} src={logo_url}/>
                                    </Modal>
                                </div>
                            </div>

                        </div>
                    </div>
                    <p className="company-dialog-item-placeholder1"style={{visibility:isEmptyLogo?"visible":"hidden"}}>{isLogoHint}</p>
                    <div className="company-dialog-item">
                        <div className="company-dialog-item-content">
                            <p className="company-dialog-item-label"><span>*</span>地图图标:</p>
                            <div style={{width:"250px"}}>
                                <div className="company-dialog-upload"
                                     onMouseOver={this.onMouseUp1}
                                     onMouseOut={this.onMouseLeave1}>
                                    <div className="company-img-content">
                                        <div className="company-img-hint"
                                             style={{visibility: isEmpty(map_icon_url) ? "visible" : "hidden"}}>
                                            <Icon type="plus"/>上传
                                        </div>
                                        <div className="company-image-div">
                                            <img src={map_icon_url}
                                                 style={{visibility: !isEmpty(map_icon_url) ? "visible" : "hidden"}}
                                                 alt="品牌logo" className="upload-image"/>
                                            <div className="company-image-overlay"
                                                 style={{visibility: this.state.isVisiblePre1}}>
                                                <div onClick={this.onPreviewImage1}>
                                                    <Icon type="eye-o" style={{color: "#fff"}}/>
                                                </div>
                                                <div onClick={this.onDeleteImage1}
                                                     style={{display: typeModal !== 2 ? "block" : "none"}}>
                                                    <Icon type="delete" style={{color: "#fff"}}/></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input className="organization-input"
                                           type="file"
                                           multiple="multiple"
                                           value=""
                                           onChange={this.onChangeImage1}
                                           style={{display: isEmpty(map_icon_url) ? "block" : "none"}}
                                           accept="image/png, image/jpeg, image/gif, image/jpg"/>
                                    <Modal visible={this.state.isCanPreview1} footer={null}
                                           onCancel={this.handleCancel1}>
                                        <img alt="example" style={{width: '100%'}} src={map_icon_url}/>
                                    </Modal>
                                </div>
                            </div>

                        </div>
                    </div>
                    <p className="company-dialog-item-placeholder1"style={{visibility:isEmptyMapIcon?"visible":"hidden"}}>{isMapIconHint}</p>
                </div>
            </Modal>
        )
    }
}

export default BrandDialog;
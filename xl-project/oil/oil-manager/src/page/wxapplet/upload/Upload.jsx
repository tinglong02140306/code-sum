import React from 'react';
import {Icon} from 'antd';
import {PropTypes} from 'prop-types'
import "./Upload.scss";
let image = "image/*";
let video = "video/*";

class Upload extends React.Component {

    state = {
        file:null,
        file_path:"",
        file_name:"",
    }

    fileChange=(e)=>{
        const {onChange} = this.props;
        const file = e.target.files[0];
        if(file){
            this.setState({
                file: file,
                file_name:file.name,
                file_path:this.getObjectURL(file)
            });
            onChange(file);
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

    onDeleteClick = () => {
        const {onChange} = this.props;
        this.setState({
            file: null,
            file_name:'',
            file_path:''
        });
        onChange(null);
    }

    render() {
        const {file, file_path, file_name} = this.state;
        const {type} = this.props;
        let accept = type===1?image:type===2?video:"";
        return <div className="upload-container">
            <div className="upload-container-input-box">
                <div className="upload-container-input-button">
                    <Icon type="upload"/>
                    <span>点击上传</span>
                </div>
                <input className="upload-input" onChange={this.fileChange}  type="file" accept={accept}></input>
            </div>
            <div className="upload-file-box" style={{display:file?"flex":"none"}}>
                <img className="upload-file-image" src={file_path} alt=""></img>
                <div className="upload-name">{file_name}</div>
                <Icon className="upload-delete" type="delete" onClick={this.onDeleteClick}></Icon>
            </div>
        </div>;
    }
}

export default Upload;

Upload.propTypes = {
    type:PropTypes.number,//类型 1:图片 2:视频 3:其它
    onChange:PropTypes.func,
    value:PropTypes.object
}


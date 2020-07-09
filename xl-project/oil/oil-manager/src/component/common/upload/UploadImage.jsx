import React from 'react';
import {Input, Icon} from 'antd';
import "./UploadImage.scss"
class UploadImage extends React.Component {
    
    state = {
        file_path:""   
    }

    componentDidMount() {
       this.setState({file_path:this.props.file_path})
    }

    fileChange=(e)=>{
        const file = e.target.files[0];
        const path = this.getObjectURL(file);
        if(file){
            this.setState({
                file_path:path
            });
            this.props.onChange(file);
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

    render() {
        const {file_path} = this.state;
        const {accept, disabled} = this.props;
        return (<div className="upload-image-container">
            <Input className="upload-image-container-input" type="file" onChange={this.fileChange} accept={accept} disabled={disabled}></Input>
            <Icon className="upload-image-container-icon" type="plus" style={{display:file_path?'none':'flex'}}></Icon>
            <div className="upload-image-container-box" style={{display:!file_path?'none':'flex'}}>
                <img className="upload-image-container-box-image" alt="" src={file_path}></img>
                <div className="upload-image-container-box-cover" ></div>
            </div>
        </div>);
    }
}

export default UploadImage;

UploadImage.defaultProps={
    accept:'image/*',
    disabled:false,
    file_path:'',
    onChange:()=>{}
}

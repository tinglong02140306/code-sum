import React from 'react';
import {Popconfirm, Icon} from 'antd';
import "./CRUD.scss"
class CRUD extends React.Component {
    
    state = {
        
    }

    componentDidMount() {
       
    }

    render() {
        const {retrieveText, updateText, deteteHintTitle, deleteHintOk, deleteHintCancel, deleteText, 
            deleteColor, retrieveColor, updateColor} = this.props;
        return (<div className="crud">
            <a className="crud-item" style={{color:retrieveColor}} onClick={this.props.onCheckClick}>
                <Icon type="eye-o"></Icon>
                <span>{retrieveText}</span>
            </a>
            <a className="crud-item" style={{color:updateColor}} onClick={this.props.onUpdateClick}>
                <Icon type="edit"></Icon>
                <span>{updateText}</span>
            </a>
            <Popconfirm
                title={deteteHintTitle} okText={deleteHintOk} cancelText={deleteHintCancel}
                onConfirm={this.props.onDeleteClick}>
                    <a className="crud-item" style={{color:deleteColor}}>
                        <Icon type="delete" />
                        <span>{deleteText}</span>
                    </a>
            </Popconfirm>
        </div>);
    }
}

export default CRUD;

CRUD.defaultProps={
    crud:'rud',
    deteteHintTitle:"确定要删除吗？",
    deleteHintOk:"是的",
    deleteHintCancel:"取消",
    deleteText:"删除",
    updateText:"修改",
    retrieveText:"查看",
    deleteColor:"#ff5501",
    retrieveColor:"#1890ff",
    updateColor:"#019f6c",
    onDeleteClick:()=>{},
    onUpdateClick:()=>{},
    onCheckClick:()=>{}
}

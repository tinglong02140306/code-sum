import React from 'react';
import {observer, inject} from 'mobx-react';
import {Icon,Popconfirm} from 'antd';
import './GrantTicketDialog.scss'
@inject("grantTicketStore")
@observer
class GrantTicketOperate extends React.Component {
    onConfirm = (recode) => {
        this.props.grantTicketStore.deleteCouponData(recode.id);
    }

    render() {
        return (<div className="grant-ticket-operate-container">
            <a onClick={()=>{
                this.props.grantTicketStore.setIsShowDialog(true,3);
                this.props.grantTicketStore.setGrantTicketObject(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="eye-o" style={{paddingRight:2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>查看</div>
                </div>
            </a>
            <a onClick={()=>{
                this.props.grantTicketStore.setIsShowDialog(true,1);
                this.props.grantTicketStore.setGrantTicketObject(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="edit" style={{color: '#FF5501',paddingRight:2}}/>
                    <div style={{color: '#FF5501',fontSize:12,marginLeft:2}}>修改</div>
                </div>
            </a>
            {/*<a style={{color: '#b27fd2', marginRight: 5}} onClick={() => {*/}
            {/*    this.props.grantTicketStore.setIsShowPushDialog(true, 1);*/}
            {/*}}><Icon type="copy" style={{marginRight: 2}}/>发券</a>*/}
            {/*<a style={{color: '#28868e',marginRight: 5}} onClick={() => {*/}
            {/*    this.props.grantTicketStore.setIsShowTasteDialog(true, 1);*/}
            {/*}}><Icon type="read" style={{marginRight: 2}}/>明细</a>*/}
            {/*<Popconfirm*/}
            {/*    title={"确定要删除该数据吗？"} okText="是的" cancelText="取消"*/}
            {/*    onConfirm={()=>{this.onConfirm(this.props.record)}}>*/}
            {/*    <a>*/}
            {/*        <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>*/}
            {/*            <Icon type="delete" style={{color: '#ff100c',paddingRight:2}}/>*/}
            {/*            <div style={{color: '#ff100c',fontSize:12,marginLeft:2}}>删除</div>*/}
            {/*        </div>*/}
            {/*    </a>*/}
            {/*</Popconfirm>*/}
        </div>);
    }
}

export default GrantTicketOperate;
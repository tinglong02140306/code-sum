import React from 'react';
import {observer, inject} from 'mobx-react';
import {Icon, Popconfirm} from 'antd';
import "../../page/system/user/User.scss";

@inject("systemuser")
@observer
class SystemUserOperate extends React.Component {

    onConfirm = (recode) => {
        this.props.systemuser.deleteUser(recode.id);
    }

    onResetPsw = recode => {
        this.props.systemuser.getResetPassword(recode);
    }

    render() {
        return (<div style={{display:'flex',flexDirection:'row',justifyContent:'center',minWidth:220}}>
            <a style={{padding:2}} onClick={() => {
                this.props.systemuser.setSystemItemUser(this.props.record)
                this.props.systemuser.setIsShowAddUpdateDialog(true, 1)
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="edit"  style={{paddingRight: 2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>修改</div>
                </div>
            </a>
            <Popconfirm
                title="确定要删除该用户么" okText="是的" cancelText="取消"
                onConfirm={()=>{this.onConfirm(this.props.record)}}>
                <a style={{color: this.props.record.locked ? "#ff5501" : "#1890ff",padding:2}}>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Icon type="delete" style={{paddingRight: 2}}/>
                        <div style={{fontSize:12,marginLeft:2}}> 删除</div>
                    </div>
                </a>
            </Popconfirm>
            <Popconfirm
                title="确定要重置密码么" okText="是的" cancelText="取消"
                onConfirm={()=>{this.onResetPsw(this.props.record)}}>
                <a>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="question-circle-o" style={{paddingRight: 2}}/>
                    <div style={{fontSize:12,marginLeft:2}}> 密码重置</div>
                </div>
                </a>
            </Popconfirm>
        </div>);
    }
}

export default SystemUserOperate;
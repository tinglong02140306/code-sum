import React from 'react';
import {observer, inject} from 'mobx-react';
import {Icon,Popconfirm} from 'antd';
import "../../page/system/role/Role.scss";

@inject("systemrole")
@observer
class SystemUserOperate extends React.Component {
    onConfirm = (recode) => {
        this.props.systemrole.deleteRole(recode.id);
    }

    render() {
        return (<div className="role-operate-container">
            <a onClick={()=>{
                this.props.systemrole.setIsShowDialog(true,1);
                this.props.systemrole.setSystemItemRole(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="edit" style={{paddingRight:2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>修改</div>
                </div>

            </a>
            <Popconfirm
                title={"确定要删除该角色吗？"} okText="是的" cancelText="取消"
                onConfirm={()=>{this.onConfirm(this.props.record)}}>
                <a>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Icon type="delete" style={{paddingRight:2}}/>
                        <div style={{fontSize:12,marginLeft:2}}>删除</div>
                    </div>

                </a>
            </Popconfirm>

            <a onClick={()=>{
                this.props.systemrole.setIsShowCheckDialog(true);
                this.props.systemrole.setSystemItemUser(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="eye-o" style={{paddingRight:2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>查看</div>
                </div>

            </a>
        </div>);
    }
}

export default SystemUserOperate;
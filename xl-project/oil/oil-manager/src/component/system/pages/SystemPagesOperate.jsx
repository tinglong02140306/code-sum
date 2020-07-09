//SystemPagesOperate
import React from 'react';
import {observer, inject} from 'mobx-react';
import {Icon,Popconfirm} from 'antd';
import "./SystemPagesOperate.scss";


@inject("pageStore")
@observer
class SystemPagesOperate extends React.Component {
    onConfirm = (recode) => {
        this.props.pageStore.deletePagesList(recode.id);
    }

    render() {
        return (<div className="permission-operate-container">
            <a onClick={()=>{
                this.props.pageStore.setIsShowDialog(true,1);
                this.props.pageStore.setSystemItemPage(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="edit" style={{paddingRight:2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>修改</div>
                </div>
            </a>
            <Popconfirm
                title={"确定要删除该权限吗？"} okText="是的" cancelText="取消"
                onConfirm={()=>{this.onConfirm(this.props.record)}}>
                <a>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Icon type="delete" style={{paddingRight:2}}/>
                        <div style={{fontSize:12,marginLeft:2}}>删除</div>
                    </div>
                </a>
            </Popconfirm>

            <a onClick={()=>{
                this.props.pageStore.setIsShowDialog(true,3);
                this.props.pageStore.setSystemItemPage(this.props.record);
            }}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Icon type="eye-o" style={{paddingRight:2}}/>
                    <div style={{fontSize:12,marginLeft:2}}>查看</div>
                </div>
            </a>
        </div>);
    }
}

export default SystemPagesOperate;
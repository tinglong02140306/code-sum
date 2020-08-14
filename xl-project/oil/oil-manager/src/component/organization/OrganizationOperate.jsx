import React from 'react';
import {Icon} from 'antd'
import {inject, observer} from 'mobx-react';
import "./OrganizationOperate.scss";

@inject("organization")
@observer
class OrganizationOperate extends React.Component {


    //1:修改 2:增加 3:查看
    render() {
        return (<div  style={{display:'flex',flexDirection:'row',width:90,fontSize:10}}>
            <a style={{padding:2}} onClick={() => {
                if (this.props.record.audit_status!==5){
                    this.props.organization.setOrganizationObject(this.props.record);
                    this.props.organization.setIsShowDialog(true, 1);
                }
            }}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Icon type="edit" style={{color:this.props.record.audit_status !==5?"#1890ff":"#b7b5b5"}}/>
                    <div style={{fontSize: 12, marginLeft: 2,color:this.props.record.audit_status !==5?"#1890ff":"#b7b5b5"}}>修改</div>
                </div>
            </a>
            <a style={{padding:2}} onClick={() => {
                this.props.organization.setOrganizationObject(this.props.record);
                this.props.organization.setIsShowDialog(true, 3)
            }}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Icon type="eye-o"/>
                    <div style={{fontSize: 12, marginLeft: 2}}> 查看</div>
                </div>
            </a>
            {/*<a style={{padding:2}}*/}
            {/*   onClick={() => {*/}
            {/*       if (this.props.record.audit_status===1){*/}
            {/*           this.props.organization.setOrganizationObject(this.props.record);*/}
            {/*           this.props.organization.setIsShowCheckDialog(true);*/}
            {/*       }*/}
            {/*   }}>*/}
            {/*    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>*/}
            {/*        <Icon type="link" style={{color:this.props.record.audit_status ===1?"#1890ff":"#b7b5b5"}}/>*/}
            {/*        <div style={{fontSize: 12, marginLeft: 2,color:this.props.record.audit_status ===1?"#1890ff":"#b7b5b5"}}>*/}
            {/*            {this.props.record.audit_status ===1?"审核":"已审核"}</div>*/}
            {/*    </div>*/}
            {/*</a>*/}
        </div>);
    }
}

export default OrganizationOperate;
import React from 'react';
import { Icon, Popconfirm } from 'antd'
import { inject, observer } from 'mobx-react';
import "../../page/business/partner/Partner.scss";
import { isEmpty } from "../../utils/isEmpty";

@inject("partner")
@observer
class PartnerOperate extends React.Component {

    onConfirmUser = (partner_id) => {
        this.props.partner.getOpenAccount(partner_id);
    }

    render() {
        return (<div style={{ display: 'flex', flexDirection: 'row', minWidth: 140, fontSize: 10 }}>
            <a style={{ padding: 2 }}
                onClick={() => {
                    // if (isEmpty(this.props.record.xlcore_user_id)){}
                    this.props.partner.showPartnerItem(this.props.record);
                    this.props.partner.changeDialogVisible(1, true);
                }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="edit" style={{ color: "#1890ff" }} />
                    <div style={{ fontSize: 12, marginLeft: 2, color: "#1890ff" }}>修改</div>
                    {/*<Icon type="edit" style={{color:isEmpty(this.props.record.xlcore_user_id)?"#1890ff":"#b7b5b5"}}/>*/}
                    {/*<div style={{fontSize:12,marginLeft:2,color:isEmpty(this.props.record.xlcore_user_id)?"#1890ff":"#b7b5b5"}}>修改</div>*/}
                </div>
            </a>
            <a style={{ padding: 2 }} onClick={() => {
                this.props.partner.showPartnerItem(this.props.record);
                this.props.partner.changeDialogVisible(2, true);
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="eye-o" />
                    <div style={{ fontSize: 12, marginLeft: 2 }}>查看</div>
                </div>
            </a>
            {isEmpty(this.props.record.xlcore_user_id) ? <Popconfirm
                title="确定要开户么？" okText="是的" cancelText="取消"
                disabled={isEmpty(this.props.record.xlcore_user_id) ? false : true}
                onConfirm={() => { this.onConfirmUser(this.props.record.partner_id) }}>
                <a style={{ color: "#ff5501", padding: 2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Icon type="usergroup-add" style={{ color: "#ff5501" }} />
                        <div style={{ fontSize: 12, marginLeft: 2 }}>开户</div>
                    </div>
                </a>
            </Popconfirm> : <a style={{ color: "#b7b5b5", padding: 2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Icon type="usergroup-add" style={{ color: "#b7b5b5" }} />
                        <div style={{ fontSize: 12, marginLeft: 2 }}>已开户</div>
                    </div>
                </a>}
        </div>);
    }
}

export default PartnerOperate;
import React from 'react';
import {Modal, Button,Input} from 'antd';
import {observer, inject} from 'mobx-react';
import "./InviteDialog.scss";
import {isEmpty} from "../../utils/isEmpty";
import {isSpecialChart} from "../../utils/isSpecialChart";

@inject("inviteStore")
@observer
class InviteDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            inviter_id: "",
            inviter_channel: "",
            inviter_group: "",
            inviter_name: "",
            inviter_senceflag: "",
            inviter_flag: "",
            inviter_mobile: "",
            inviter_code: "",
            inviter_qrcode_url: ""

        };
    }

    //取消
    onCancel = () => {
        this.props.inviteStore.setIsShowInviteDialog(false)
    }
    onChange = () => {

    }
    //提交
    onSubmit =()=>{
        if (!isEmpty(this.state.inviter_id) && !isEmpty(this.state.inviter_code)){
            this.props.inviteStore.getPromotionCode(this.state.inviter_id,this.state.inviter_code)
        }
    }
    componentDidMount() {
        const {
            inviter_id, inviter_channel, inviter_group, inviter_name,inviter_senceflag,inviter_flag,inviter_mobile,inviter_code,inviter_qrcode_url
        } = this.props.inviteStore.inviteObject;

        this.setState({
            inviter_id: inviter_id,
            inviter_channel: inviter_channel,
            inviter_group: inviter_group,
            inviter_name: inviter_name,
            inviter_senceflag: inviter_senceflag,
            inviter_flag: inviter_flag,
            inviter_mobile: inviter_mobile,
            inviter_code: inviter_code,
            inviter_qrcode_url: inviter_qrcode_url
        });
    }

    render() {
        const {isShowInviteDialog,isShowInviteLoading} = this.props.inviteStore;
        const {
            inviter_id, inviter_channel, inviter_group, inviter_name,inviter_senceflag,inviter_flag,inviter_mobile,inviter_code,inviter_qrcode_url
        } = this.state;
        return (
            <Modal
                visible={isShowInviteDialog}
                title={"生成推广码"}
                onCancel={this.onCancel}
                width={800}
                footer={[<Button key="submit" type="primary" loading={isShowInviteLoading} onClick={this.onSubmit}>确定</Button>]}>
                <div className="invite-dialog-container">
                    <div className="invite-dialog-left">
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">&nbsp;&nbsp;&nbsp;推广渠道:</div>
                            <Input
                                disabled={true}
                                style={{width: 250, margin: 0}}
                                value={inviter_channel}
                                onChange={this.onChange}/>
                        </div>
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">&nbsp;&nbsp;&nbsp;推广分组:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={inviter_group}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">推广人姓名:</div>
                            <Input
                                disabled={true}
                                value={inviter_name}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">&nbsp;&nbsp;&nbsp;推广标识:</div>
                            <Input
                                disabled={true}
                                onChange={this.onChange}
                                value={inviter_senceflag}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                    <div className="invite-dialog-center"/>
                    <div className="invite-dialog-left">
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">代理标识:</div>
                            <Input
                                disabled={true}
                                value={inviter_flag}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">联系方式:</div>
                            <Input
                                disabled={true}
                                value={inviter_mobile}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                        <div className="invite-dialog-input-item">
                            <div className="invite-dialog-input-title">&nbsp;&nbsp;&nbsp;推荐码:</div>
                            <Input
                                disabled={true}
                                value={inviter_code}
                                onChange={this.onChange}
                                style={{width: 250, margin: 0}}/>
                        </div>
                    </div>
                </div>

            </Modal>);
    }
}
export default InviteDialog;
import React from 'react';
import {Modal, Button, Radio, Input} from 'antd';
import {observer, inject} from 'mobx-react';
import {isSpecialChart} from "../../utils/isSpecialChart";

@inject("organization")
@observer
class OrganizationCheckDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            value: "yes",
            isCheck: 5,
            isEmptyIdea: false,
            idea: ""
        }
    }

    onCancel = () => {
        this.props.organization.setIsShowCheckDialog(false);
    }

    onSubmit = () => {
        //1-提交审核；3-审核失败；5-审核成功；
        if (this.state.isCheck === 3) {
            this.setState({isEmptyIdea: isSpecialChart(this.state.idea)});
            if (!isSpecialChart(this.state.idea)) {
                this.props.organization.getSubmitCheck(this.props.organization.organizationObject.org_id, this.state.isCheck, this.state.idea);
            }
        } else {
            this.props.organization.getSubmitCheck(this.props.organization.organizationObject.org_id, this.state.isCheck, this.state.idea);
        }
    }

    onChange = (e) => {
        this.setState({
            value: e.target.value,
            isCheck: e.target.value === "yes" ? 5 : 3
        });
    }

    onChangeIdea = (e) => {
        this.setState({
            idea: e.target.value
        });
    }

    render() {
        const {isCheckLoading, isShowCheckDialog} = this.props.organization;
        return (<Modal title="审核"
                       visible={isShowCheckDialog}
                       onCancel={this.onCancel}
                       footer={[<Button key="back" onClick={this.onCancel}>取消</Button>,
                           <Button key="submit" type="primary" loading={isCheckLoading}
                                   onClick={this.onSubmit}>确定</Button>]}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 20}}>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                    <span style={{color: "#000000", fontSize: 14, fontWeight: "bold", marginRight: 10}}>审核结果 :</span>
                    <Radio.Group
                        onChange={this.onChange}
                        value={this.state.value}>
                        <Radio value="yes">审核通过</Radio>
                        <Radio value="no">审核失败</Radio>
                    </Radio.Group>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                    <span style={{color: "#000000", fontSize: 14, fontWeight: "bold", marginRight: 10}}>审核意见 :</span>
                    <Input.TextArea style={{width: 300}}
                                    value={this.state.idea}
                                    maxLength={50}
                                    placeholder="最多50个字"
                                    onChange={this.onChangeIdea}/>
                </div>
                <div style={{visibility: this.state.isEmptyIdea ? "visible" : "hidden"}}>
                    <span style={{color: "#e90000", fontSize: 10, marginLeft: 75}}>请填写失败原因,不能输入特殊字符</span>
                </div>
            </div>


        </Modal>);
    }
}

export default OrganizationCheckDialog;
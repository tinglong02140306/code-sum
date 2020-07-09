import React from 'react';
import './QuartzDialog.scss';
import {Modal, Input,Button} from 'antd';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../utils/isEmpty";
import {cronValidate} from "../../utils/corn";
import {isRightJobName} from "../../utils/isRightJobName";
import {isRightJobGroup} from "../../utils/isRightJobGroup";

@inject("serviceStore")
@observer
class QuartzDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            job_name: "",
            job_group: "",
            job_description: "",
            cron_expression: "",
            isEmptyName:false,
            isEmptyGroup:false,
            isEmptyDescription:false,
            isEmptyExpression:false
        };
    }

    onChangeName = (e) => {
        this.setState({job_name: e.target.value});
    }

    onChangeGroup = (e) => {
        this.setState({job_group: e.target.value});
    }

    onChangeDescription = (e) => {
        this.setState({job_description: e.target.value});
    }

    onChangeExpression = (e) => {
        this.setState({cron_expression: e.target.value});
    }

    onCancel = () => {
        this.props.serviceStore.setIsShowQuartzDialog(false);
    }

    onSubmit=()=>{
        const {job_name,job_group,job_description,cron_expression} = this.state;
        if (isRightJobName(job_name)
            && isRightJobGroup(job_group)
            && !isEmpty(job_description)
            && cronValidate(cron_expression)) {
            this.props.serviceStore.getSaveQuartz(job_name,job_group,job_description,cron_expression);
        }else {
            this.setState({isEmptyName:!isRightJobName(job_name)?true:false});
            this.setState({isEmptyGroup:!isRightJobGroup(job_group)?true:false});
            this.setState({isEmptyDescription:isEmpty(job_description)?true:false});
            this.setState({isEmptyExpression:!cronValidate(cron_expression)?true:false});
        }
    }

    render() {
        const title = "添加";
        const {isShowQuartzDialog,isShowSubmitLoading} = this.props.serviceStore;
        const {job_name, job_group, job_description, cron_expression,isEmptyName,isEmptyGroup,isEmptyDescription,isEmptyExpression} = this.state;
        return (<Modal
            title={title}
            className="quartz-modal"
            onCancel={this.onCancel}
            visible={isShowQuartzDialog}
            footer={[<Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={isShowSubmitLoading}
                        onClick={this.onSubmit}>提交</Button>]}>
            <div className="quartz-dialog-container">
                <div className="quartz-dialog-item">
                    <div className="quartz-dialog-input-container">
                        <span className="quartz-dialog-special">*</span><span>任&nbsp;务&nbsp;名&nbsp;称&nbsp;:</span>
                        <Input.TextArea
                            size="small"
                            value={job_name}
                            style={{width: 250}}
                            autosize={{minRows: 1}}
                            onChange={this.onChangeName}/>
                    </div>
                    <p style={{visibility:isEmptyName?'visible':'hidden'}}>请输入正确的任务名称</p>
                </div>
                <div className="quartz-dialog-item">
                    <div className="quartz-dialog-input-container">
                        <span className="quartz-dialog-special">*</span><span>任&nbsp;务&nbsp;分&nbsp;组&nbsp;:</span>
                        <Input.TextArea
                            size="small"
                            value={job_group}
                            style={{width: 250}}
                            autosize={{minRows: 1}}
                            onChange={this.onChangeGroup}/>
                    </div>
                    <p style={{visibility:isEmptyGroup?'visible':'hidden'}}>请输入正确的任务分组</p>
                </div>
                <div className="quartz-dialog-item">
                    <div className="quartz-dialog-input-container">
                        <span className="quartz-dialog-special">*</span><span>任&nbsp;务&nbsp;描&nbsp;述&nbsp;:</span>
                        <Input.TextArea
                            size="small"
                            value={job_description}
                            style={{width: 250}}
                            autosize={{minRows: 1}}
                            onChange={this.onChangeDescription}/>
                    </div>
                    <p style={{visibility:isEmptyDescription?'visible':'hidden'}}>任务描述不能为空</p>
                </div>
                <div className="quartz-dialog-item">
                    <div className="quartz-dialog-input-container">
                        <span className="quartz-dialog-special">*</span><span>任务表达式:</span>
                        <Input.TextArea
                            size="small"
                            value={cron_expression}
                            style={{width: 250}}
                            autosize={{minRows: 1}}
                            onChange={this.onChangeExpression}/>
                    </div>
                    <p style={{visibility:isEmptyExpression?'visible':'hidden'}}>请输入正确的任务表达式</p>
                </div>
            </div>
    </Modal>)
        ;
    }
}

export default QuartzDialog;
import React from 'react';
import './QuartzMenu.scss';
import {Icon, Popconfirm} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("serviceStore")
@observer
class QuartzMenu extends React.Component {
    render() {
        return (<div className="quartz-menu-container">
            {this.props.record.job_status !== "PAUSED" ? <Popconfirm
                    title="确定要暂停么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        this.props.serviceStore.getQuartzPause(this.props.record.job_name, this.props.record.job_group)
                    }}>
                    <a href="">
                        <div className="quartz-menu-item">
                            <Icon type="poweroff" id="quartz-menu-stop-icon"/>
                            <p id="quartz-menu-stop">暂停</p>
                        </div>
                    </a>
                </Popconfirm> :
                <div className="quartz-menu-item">
                    <Icon type="poweroff" id="quartz-menu-stop-icon"
                          style={{color: this.props.record.job_status !== "PAUSED" ? "#ff6f25" : "#b4b4b4"}}/>
                    <p id="quartz-menu-stop"
                       style={{color: this.props.record.job_status !== "PAUSED" ? "#ff6f25" : "#b4b4b4"}}>暂停</p>
                </div>
            }
            {this.props.record.job_status !== "NORMAL" ?
                <Popconfirm
                    title="确定要恢复么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        this.props.serviceStore.getQuartzResume(this.props.record.job_name, this.props.record.job_group)
                    }}>
                    <a href="">
                        <div className="quartz-menu-item">
                            <Icon type="reload" id="quartz-menu-recover-icon"  />
                            <p id="quartz-menu-recover">恢复</p>
                        </div>
                    </a>
                </Popconfirm> :
                <div className="quartz-menu-item">
                    <Icon type="reload" id="quartz-menu-recover-icon" style={{color: this.props.record.job_status !== "NORMAL" ? "#1890FF" : "#b4b4b4"}}/>
                    <p id="quartz-menu-recover" style={{color: this.props.record.job_status !== "NORMAL" ? "#1890FF" : "#b4b4b4"}}>恢复</p>
                </div>}
            <Popconfirm
                title="确定要删除么？" okText="是的" cancelText="取消"
                onConfirm={() => {
                    this.props.serviceStore.getQuartzRemove(this.props.record.job_name, this.props.record.job_group)
                }}>
                <a href="">
                    <div className="quartz-menu-item">
                        <Icon type="delete" id="quartz-menu-delete-icon"/>
                        <p id="quartz-menu-delete">删除</p>
                    </div>
                </a>
            </Popconfirm>
        </div>);
    }
}

export default QuartzMenu;
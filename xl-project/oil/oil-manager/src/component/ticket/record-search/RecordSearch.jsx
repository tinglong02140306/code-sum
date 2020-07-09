import React from 'react';
import {Form, Input, Button,Icon} from 'antd';
import './RecordSearch.scss';
import {observer, inject} from 'mobx-react';

@inject("ticketRecodeStore")
@observer
class RecordSearch extends React.Component {

    constructor(){
        super();
        this.state={
            collapsed:true
        };
    }

    onCollapsedClick=()=>{
        this.setState({
            collapsed:!this.state.collapsed
        });
    }

    render() {
        const {collapsed} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (<div className="record-search-container">
            <div className="record-search-box">
                <div className="record-form-box">
                    <Form className="record-form-container">
                        <Form.Item label="合作方ID">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="机构方ID">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="哈哈哈">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="哈哈哈">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                    </Form>
                    <Form className="record-form-container">
                        <Form.Item label="合作方">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="机构方">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="机构方ID">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="哈哈哈">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                    </Form>
                    <Form className="record-form-container" style={{display: collapsed ? "none" : "flex"}}>
                        <Form.Item label="合作方">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="机构方">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="机构方ID">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                        <Form.Item label="哈哈哈">
                            <Input placeholder="placeholder" size="small"/>
                        </Form.Item>
                    </Form>
                </div>
                <div className="record-more-box" onClick={this.onCollapsedClick}>
                    <a>更多</a>
                    <Icon type={collapsed ? "down" : "up"} style={{marginRight: 5}}/>
                </div>
                <div className="record-btn-container">
                    <Button type="primary" size="small" className="record-btn-search">查询</Button>
                    <Button type="primary" size="small" className="record-btn-search">重置</Button>
                </div>
            </div>
        </div>);
    }
}

export default Form.create()(RecordSearch);
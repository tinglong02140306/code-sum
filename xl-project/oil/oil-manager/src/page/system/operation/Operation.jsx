import React from 'react';
import './Operation.scss';
import {Button, Input, Form, Radio, Row, Col, Spin} from 'antd';
import http from '../../../http/http';
import {isEmpty} from '../../../utils/isEmpty';

const FormItem = Form.Item;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const send_content = `{
    "class_name": "value",
    "method_name": "value",
    "method_param": {
		"java.lang.String": "value",
		"site.yuyanjia.template.common.model.WebUserDO": {
			"username": "value",
			"password": "value"
		}
	}
}`;

class Operation extends React.Component {

    constructor(){
        super();
        this.state={
            isLoading:false,
            radioValue:1,

        }
    }

    //是否拼接基本路径
    onChangeRadioGroup=(e)=>{
        this.setState({
            radioValue:e.target.value
        });
    }

    //提交
    onSubmit=(e)=>{
        e.preventDefault();
        const {radioValue} = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
               this.getHttpResponse(radioValue?http.baseUrl:null,values.url,isEmpty(values.send_content)?null:JSON.parse(values.send_content));
            }
        });
    }

    //网络请求
    getHttpResponse=(baseUrl,url,data)=>{
        this.setState({isLoading:true});
        http.postBaseUrl(baseUrl,url,data)
            .then(res=>{
                this.setState({isLoading:false});
                this.props.form.setFieldsValue({'receive_content':JSON.stringify(res)});
            })
            .catch(err=>{
                this.setState({isLoading:false});
                this.props.form.setFieldsValue({'receive_content':err});
            })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {isLoading,radioValue} = this.state;
        return <Spin spinning={isLoading} className="operation-spin">
            <div className="operation-container">
                <Row className="operation-box">
                    <Col span={16}>
                        <Form layout="inline" className="operation-form" onSubmit={this.onSubmit}>
                            <FormItem label="请求地址" className="operation-form-item">
                                {getFieldDecorator('url', {
                                    rules: [{required: true,message:"请求路径不能为空"}]
                                })(<TextArea autosize={{minRows: 1, maxRows: 2}}/>)}
                            </FormItem>
                            <FormItem label="&#8197;&#8197;发送内容" className="operation-form-item">
                                {getFieldDecorator('send_content', {initialValue:send_content})
                                (<TextArea autosize={{minRows: 6, maxRows: 8}}/>)}
                            </FormItem>
                            <FormItem label="&#8197;&#8197;相应内容" className="operation-form-item">
                                {getFieldDecorator('receive_content', {})
                                (<TextArea autosize={{minRows: 10, maxRows: 12}}/>)}
                            </FormItem>
                            <FormItem className="operation-form-item">
                                <Button type="primary" htmlType="submit">发送</Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={8}>
                        <RadioGroup className="operation-radio-group"
                                    defaultValue={radioValue}
                                    onChange={this.onChangeRadioGroup}>
                            <Radio value={0}>不拼接</Radio>
                            <Radio value={1}>拼接基本路径</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </div>
        </Spin>
    }
}

export default Form.create({})(Operation);
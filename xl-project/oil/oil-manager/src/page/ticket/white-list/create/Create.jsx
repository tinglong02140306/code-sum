import React from 'react';
import './Create.scss';
import Points from '../../components/points/Points';
import { Button, Form, Input, Spin } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react/index';

@inject('WhiteListStore')
@observer
class Create extends React.Component {

    state = {};

    componentDidMount() {
    }

    onSubmitClick = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!err) {
                this.props.WhiteListStore.addWhiteItem(values, () => {
                    this.props.history.push("/ticket-white-list")
                });
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { loadingAdd } = this.props.WhiteListStore;
        return (
            <Spin spinning={loadingAdd}>
                <div className="ticket-white-create-container">
                    <div className="ticket-white-create-title">创建白名单</div>
                    <Form className="ticket-white-create-box" layout="inline" onSubmit={this.onSubmitClick}>
                        <div className="ticket-white-create-content-box">
                            <Form.Item className="ticket-white-create-box-item other" label="活动代码">
                                {getFieldDecorator('act_code', { rules: [{ required: true, message: '活动代码' }] })(<Input placeholder="请输入活动代码" />)}
                            </Form.Item>
                            <Form.Item className="ticket-white-create-box-item other" label="银行卡号">
                                {getFieldDecorator('account_no', { rules: [{ required: true, message: '银行卡号' }] })(<Input placeholder="请输入银行卡号" />)}
                            </Form.Item>
                            <Form.Item className="ticket-white-create-box-item-btns">
                                <Button onClick={() => this.props.history.push("/ticket-white-list")}>取 消</Button>
                                <Button type="primary" htmlType="submit">提 交</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Spin>
        );
    }


}

export default Form.create()(Create);

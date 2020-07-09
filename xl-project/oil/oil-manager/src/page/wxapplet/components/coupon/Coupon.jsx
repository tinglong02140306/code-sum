import React from 'react';
import {Button, Form, Icon, Input} from 'antd';
import "./Coupon.scss"
const { TextArea } = Input;
let id = 1;
class Coupon extends React.Component {
    
    state = {
            
    }

    componentDidMount() {
       
    }

    //移除一条优惠内容
    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    };
    
    //添加一条优惠内容
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
          keys: nextKeys,
        });
    };

    onChange = e => {
        this.props.onChange(e)
    }

    //增加优惠内容
    renderCoupon = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        return keys.map((k, index) => (
          <Form.Item
            className={index === 0 ?"interests-dialog-form-item-add0":"interests-dialog-form-item-add"}
            label={index === 0 ? '优惠内容' : ''}
            required={false}
            key={k}>
            {getFieldDecorator(`coupons[${k}]`, {
              validateTrigger: this.onChange,
            })(<TextArea placeholder="请输入优惠内容" autosize={{ minRows: 1}}/>)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        ));
    }

    render() {
        const {} = this.props;
        return (<div>
            {this.renderCoupon()}
                <Form.Item className="interests-dialog-form-item-add-coupon">
                    <Button type="dashed" onClick={this.add} className="interests-dialog-form-add">
                        <Icon type="plus" /> 增加优惠内容
                    </Button>
                </Form.Item>
        </div>);
    }
}

export default Form.create({})(Coupon);

Coupon.defaultProps = {
    onChange:()=>{}
}

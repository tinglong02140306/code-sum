import React from 'react';
import {Modal, Button, Form, Input, Icon, Tag, Select} from 'antd';
import "./InterestsDialog.scss"
import CityTree from '../city-tree/CityTree'
import {inject, observer} from "mobx-react";
import {dealCityName} from '../../../../utils/common/city';
let id = 1;
const { TextArea } = Input;
@inject("interestStore")
@observer
class InterestsDialog extends React.Component {
    
    state = {
        id:"",
        name:"",
        logo_url:"",
        area_name:"",
        area_code:"",
        activity_id:"",
        activity_name:"",
        desc_list:[],
        sub_activity_url:""    
    }

    componentDidMount() {
        const {showData} = this.props.interestStore;
        if(showData){
            const area_code_arr = showData.area_code.split(',');
            const area_name_arr = showData.area_name.split(',');
            this.setState({
                id:showData.id,
                name:showData.name||"",
                logo_url:showData.logo_url||"",
                area_name:showData.area_name||"",
                area_code:showData.area_code||"",
                activity_id:showData.activity_id||"",
                activity_name:showData.activity_name||"",
                area_code_arr:area_code_arr||[],
                desc_list:showData.desc_list||[],
                area_name_arr:area_name_arr||[],
                sub_activity_url:showData.sub_activity_url||"" 
            })
            if(showData.desc_list){
                const { form } = this.props;
                const keys = form.getFieldValue('keys')||[];
                showData.desc_list.map((item,index)=>{
                    if(keys.indexOf(0)>=0&&index===0){

                    }else{
                        keys.push(index);
                    }
                })
            }           
        }
    }
    //活动id
    onChangeActivityId = (value) => {
        this.setState({activity_id: value});
    }

    //提交
    onSubmitClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
          if (err) {
            return;
          }
          const {type} = this.props.interestStore;
          value.area_code = value.address.join(",");
          value.area_name = dealCityName(value.address).join(",");
          if(type===0){//0:新增
            value.desc_list = this.dealNullArray(value.desc_list);
            value.activity_id = Number(value.activity_id);
            // console.log(JSON.stringify(value));
            this.props.interestStore.addInterests(value);
          }else{//2:修改
             const {id,name, logo_url, desc_list, sub_activity_url,area_code_arr,activity_id,activity_name} = this.state;
             // console.log(activity_id,value.activity_id)
             const params = {
                id:id,
                name:value.name==name?null:value.name,
                logo_url:value.logo_url==logo_url?null:value.logo_url,
                 activity_id:value.activity_id==activity_name?null:value.activity_id,
                area_name:this.equal(value.address,area_code_arr)?null:value.area_name,
                area_code:this.equal(value.address,area_code_arr)?null:value.area_code,
                desc_list:this.equal(this.dealNullArray(value.desc_list),desc_list)?null:this.dealNullArray(value.desc_list),
                sub_activity_url:value.sub_activity_url==sub_activity_url?null:value.sub_activity_url,
             }
             this.props.interestStore.updateInterests(params);
          }
        });
    }

    dealNullArray = (array) => {
        const _newArray = array&&array.filter((item,index)=>{
            if(item!==null&&item!==undefined){
                return item
            }
        })
        return _newArray
    }

    //判断两个数组是否相同 不包含顺序
    equal =  (arr1, arr2) => {
        let flag = true
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(item => {
                if (arr2.indexOf(item) === -1) {
                    flag = false
                }
            })
        }
        return flag;
    }

    //处理 权益规则
    dealDesc = (desc_list) =>{
        const couponsArr = [];
        //获取优惠规则
        if(desc_list){
          for (const key in desc_list) {
              if (desc_list.hasOwnProperty(key)) {
                  if(desc_list[key]!==undefined){
                      const element = desc_list[key];
                      couponsArr.push(element);
                  }
              }
          }
        }
        return couponsArr;
    }

    //处理所属地区
    dealAddress = (address) => {
        if(address&&address.length===2){
            const nameArray = address[0];
            const codeArray = address[1];
            const nameStr = nameArray.join(",");
            const codeStr = codeArray.join(",");
            return [nameStr, codeStr]
        }
        return [null,null]
    }

    //取消
    onCancelClick = () => {
        this.props.interestStore.setIsShowDialog(false);
    }

    getFooter = (type) => {
        return <div className="interests-footer-btns">{type===1?[<Button key="submit" type="primary" onClick={this.onCancelClick}>确定</Button>]:[<Button key="back" onClick={this.onCancelClick} className="interests-footer-btn">取消</Button>,<Button key="submit" type="primary" htmlType="submit">提交</Button>]}</div>
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

    //增加优惠内容
    renderCoupon = () => {
        const {desc_list} = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {type} = this.props.interestStore;
        const keys = getFieldValue('keys')||[0];
        getFieldDecorator('keys', { initialValue: keys});
        return keys.map((k, index) => (
          <Form.Item
            className={index === 0 ?"interests-dialog-form-item-add0":"interests-dialog-form-item-add"}
            label={index === 0 ? '权益内容' : ''}
            required={false}
            key={k}>
            {getFieldDecorator(`desc_list[${k}]`, {
              initialValue:desc_list[k]||"",
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{ required: true, message: '权益内容不能为空' }],
            })(<TextArea placeholder="请输入权益内容" autosize={{ minRows: 1}} disabled={type===1}/>)}
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
        const {name, logo_url, area_code_arr, sub_activity_url, area_name_arr,activity_id,activity_name} = this.state;
        const {isShowDialog, type, activityList} = this.props.interestStore;
        const title = type?type===1?'查看':'修改':'新增';
        const { getFieldDecorator } = this.props.form;
        return (<Modal visible={isShowDialog} title={title} width={810}
            footer={null} onCancel={this.onCancelClick}>
            <Form className="interests-dialog-container" layout="inline" labelAlign="right" onSubmit={this.onSubmitClick}>
                <div className="interests-dialog-div">
                <Form.Item label="权益名称" className="interests-dialog-form-item">
                    {getFieldDecorator('name', {
                        initialValue:name,
                        rules: [{ required: true, message: '银行名称不能为空' }],
                    })(
                        <TextArea placeholder="请输入银行名称" autosize={{ minRows: 1}} disabled={type===1}/>
                    )}
                </Form.Item>
               
                <Form.Item label="权益logo" className="interests-dialog-form-item">
                    {getFieldDecorator('logo_url', {
                        initialValue:logo_url,
                        rules: [{ required: true, message: '银行logo地址不能为空' }],
                    })(
                        <TextArea placeholder="请输入银行logo地址" autosize={{ minRows: 1}} disabled={type===1}/>
                    )}
                </Form.Item>
                {this.renderCoupon()}
                <Form.Item className="interests-dialog-form-item-add-coupon">
                    <Button type="dashed" onClick={this.add} className="interests-dialog-form-add" disabled={type===1}>
                        <Icon type="plus" /> 增加优惠内容
                    </Button>
                </Form.Item>
                <Form.Item label="子活动页面" className="interests-dialog-form-item">
                    {getFieldDecorator('sub_activity_url',{
                        initialValue:sub_activity_url
                    })(
                        <TextArea placeholder="请输入子活动页面" autosize={{ minRows: 1}} disabled={type===1}/>
                    )}
                </Form.Item>
                    <Form.Item label="活动" className="interests-dialog-form-item">
                        {getFieldDecorator('activity_id', {
                            initialValue:activity_name,
                            // initialValue:activity_name,
                            rules: [{ required: true, message: '活动不能为空' }],
                        })(
                            <Select
                                style={{width: 250}}
                                onChange={this.onChangeActivityId}
                                disabled={type === 1}
                                showArrow={type === 1}>
                                {activityList !== null ? activityList.map((item) =>
                                    <Select.Option key={item.id}>{item.name}</Select.Option>
                                ) : ""}
                            </Select>                        )}
                    </Form.Item>
                <Form.Item className="interests-dialog-form-item-footer">
                    {this.getFooter(type)}
                </Form.Item>
                </div>
                <div className="interests-dialog-div">
                    {type===1? <Form.Item label="所属地区" className="interests-dialog-form-item">
                        {area_name_arr&&area_name_arr.map((item,index)=>{ 
                            return <Tag key={index}>{item}</Tag>
                        })}
                    </Form.Item>:<Form.Item label="所属地区" className="interests-dialog-form-item">
                        {getFieldDecorator('address', {
                            initialValue:area_code_arr,
                            rules: [{ required: true, message: '所属地区不能为空' }],
                        })(
                           <CityTree></CityTree>
                        )}
                    </Form.Item>}
                </div>
            </Form>
        </Modal>);
    }
}

export default Form.create({})(InterestsDialog);

import React from 'react';
import {Modal, Button, Form, Input, Icon, Tag, Select,Radio} from 'antd';
import "./InterestsDialog.scss"
import CityTree from '../city-tree/CityTree'
import {inject, observer} from "mobx-react";
import {dealCityName} from '../../../../utils/common/city';
import ADDICON from "../../../../images/icon-add.png";
let id = 1;
const { TextArea } = Input;
@inject("interestStore")
@observer
class InterestsDialog extends React.Component {
    
    state = {
        accept:'image/*',
        id:"",
        name:"",//权益名称
        logoFile:'',//权益logo
        equitType:null,//活动类目1-加油，2-洗车
        targetType:null,//活动类型1-绑卡领取，2-优惠券领取
        targetValue:'',//活动类型值
        basicType:null,//活动依据
        basicValue:null,//银行卡简称
        areaName:'',//所属地区
        areaCode:'',//地区编号
        description:'',//活动简介
        navigationColorValue:'',//导航栏色值
        equitBannerFile:null,//活动banner
        buttonDesc:'',//按钮描述
        payDiscountLabel:'',//支付优惠标签
        equitSynopsisFile:null,//权益简介图片
        equitExplain:'',//权益简介说明，限80字内
        equitRuleDescList:[],//权益规则文案


        // logo_url:"",
        // area_name:"",
        // area_code:"",
        // activity_id:"",
        // activity_name:"",
        // desc_list:[],
        // sub_activity_url:""
    }

    componentDidMount() {
        const {showData} = this.props.interestStore;
        if(showData){
            const area_code_arr = showData.area_code.split(',');
            const area_name_arr = showData.area_name.split(',');
            this.setState({

                // name:showData.name||"",
                // logo_url:showData.logo_url||"",
                // area_name:showData.area_name||"",
                // area_code:showData.area_code||"",
                // activity_id:showData.activity_id||"",
                // activity_name:showData.activity_name||"",
                // area_code_arr:area_code_arr||[],
                // desc_list:showData.desc_list||[],
                // sub_activity_url:showData.sub_activity_url||"",
                id:showData.id,
                area_name_arr:area_name_arr||[],

                name:showData.name||"",//权益名称
                logoFile:showData.logo_url||"",//权益logo
                logoFilePath:showData.logo_url||"",//权益logo
                equitType:showData.equit_type||null,//活动类目1-加油，2-洗车
                targetType:showData.target_type||null,//活动类型1-绑卡领取，2-优惠券领取
                targetValue:showData.target_value||'',//活动类型值
                basicType:showData.basic_type||null,//活动依据
                basicValue:showData.basic_value||'',//银行卡简称
                areaName:showData.area_name||"",//所属地区
                area_code_arr:area_code_arr||[],//地区编号
                description:showData.description||"",//活动简介
                navigationColorValue:showData.navigation_color_value||"",//导航栏色值
                equitBannerFile:showData.equit_banner_url||"",//活动banner
                equitBannerFilePath:showData.equit_banner_url||"",//活动banner
                buttonDesc:showData.button_desc||"",//按钮描述
                payDiscountLabel:showData.pay_discount_label||"",//支付优惠标签
                equitSynopsisFile:showData.equit_synopsis_url||null,//权益简介图片
                equitSynopsisFilePath:showData.equit_synopsis_url||null,//权益简介图片
                equitExplain:showData.equit_explain||"",//权益简介说明，限80字内
                equitRuleDescList:showData.equit_rule_desc_list||[],//权益规则文案
                actName:showData.act_name||'',//活动名称
            })
            if(showData.equit_rule_desc_list){
                const { form } = this.props;
                const keys = form.getFieldValue('keys')||[];
                showData.equit_rule_desc_list.map((item,index)=>{
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
        this.setState({targetValue: value});
    }

    //银行卡code
    onChangeBasicType = (value) => {
        this.setState({basicType: value});
    }

    //银行卡code
    onTargetTypeChange = (e) => {
        this.setState({targetType: e.target.value});
    }

    //活动logo
    logoFileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                logoFile: file||this.state.logoFile,
                logoFilePath:this.getObjectURL(file)
            });
        }
    }

    //活动banner
    equitBannerFileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                equitBannerFile: file||this.state.equitBannerFile,
                equitBannerFilePath:this.getObjectURL(file)
            });
        }
    }
    //活动简介
    equitSynopsisFileChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            this.setState({
                isEmptyFile: '',
                equitSynopsisFile: file||this.state.equitSynopsisFile,
                equitSynopsisFilePath:this.getObjectURL(file)
            });
        }
    }
    getObjectURL = (file) => {
        let url = null;
        if(file){
            // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
            if (window.createObjectURL !== undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL !== undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL !== undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
        }
        return url;
    }

    //提交
    onSubmitClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
          if (err) {return;}

          const {type,showData} = this.props.interestStore;

          const {logoFile,equitBannerFile, equitSynopsisFile,targetValue,id,logoFilePath,equitBannerFilePath,equitSynopsisFilePath} = this.state;
          value.areaCode = value.address.join(",");
          value.areaName = dealCityName(value.address).join(",");
          value.equitRuleDescList = this.dealNullArray(value.equitRuleDescList);
          value.targetValue = Number(value.act_id);
          // console.log(JSON.stringify(value));
          //   console.log(JSON.stringify(value));
            let formData = new FormData();
            formData.append('name', value.name);
            formData.append('equitType', value.equitType);
            formData.append('targetType', value.targetType);
            if (value.targetType === 2){
                formData.append('targetValue', '0');
            }else {
                formData.append('targetValue', targetValue);
            }
            formData.append('basicType', value.basicType);
            formData.append('basicValue', value.basicValue);
            formData.append('areaName', value.areaName);
            formData.append('areaCode', value.areaCode);
            formData.append('description', value.description);
            formData.append('navigationColorValue', value.navigationColorValue);
            formData.append('buttonDesc', value.buttonDesc);
            formData.append('payDiscountLabel', value.payDiscountLabel);
            formData.append('equitExplain', value.equitExplain);
            formData.append('equitRuleDescList', value.equitRuleDescList);
            if(type===0){//0:新增
                formData.append('logoFile', logoFile?logoFile:null);
                formData.append('equitBannerFile', equitBannerFile?equitBannerFile:null);
                formData.append('equitSynopsisFile', equitSynopsisFile?equitSynopsisFile:null);
                this.props.interestStore.addInterests(formData);
            }else{//2:修改
                 // const {id,name, logo_url, desc_list, sub_activity_url,area_code_arr,activity_id,activity_name} = this.state;
                 // console.log(activity_id,value.activity_id)
                const params = {
                    // id:id,
                    // name:value.name==name?null:value.name,
                    // logo_url:value.logo_url==logo_url?null:value.logo_url,
                    // activity_id:value.activity_id==activity_name?null:value.activity_id,
                    // area_name:this.equal(value.address,area_code_arr)?null:value.area_name,
                    // area_code:this.equal(value.address,area_code_arr)?null:value.area_code,
                    // desc_list:this.equal(this.dealNullArray(value.desc_list),desc_list)?null:this.dealNullArray(value.desc_list),
                    // sub_activity_url:value.sub_activity_url==sub_activity_url?null:value.sub_activity_url,
                }
                formData.append('id', id);
                if(logoFile!=showData.logo_url) {
                    formData.append('logoFile', logoFile?logoFile:null);
                }else {
                    formData.append('logoUrl', showData.logo_url);
                }
                if(equitBannerFile!=showData.equit_banner_url) {
                    formData.append('equitBannerFile', equitBannerFile?equitBannerFile:null);
                }else {
                    formData.append('equitBannerUrl', showData.equit_banner_url);
                }
                if(equitSynopsisFile!=showData.equit_synopsis_url) {
                    formData.append('equitSynopsisFile', equitSynopsisFile?equitSynopsisFile:null);
                }else {
                    formData.append('equitSynopsisUrl', showData.equit_synopsis_url);
                }
                this.props.interestStore.updateInterests(formData);
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
        const {showLoadingPage} = this.props.interestStore;
        return <div className="interests-footer-btns">{type===1?[<Button key="submit" type="primary" onClick={this.onCancelClick}>确定</Button>]:[<Button key="back" onClick={this.onCancelClick} className="interests-footer-btn">取消</Button>,<Button loading={showLoadingPage} key="submit" type="primary" htmlType="submit">提交</Button>]}</div>
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
        const {equitRuleDescList} = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {type} = this.props.interestStore;
        const keys = getFieldValue('keys')||[0];
        getFieldDecorator('keys', { initialValue: keys});
        return keys.map((k, index) => (
          <Form.Item
            className={index === 0 ?"interests-dialog-form-item-add0":"interests-dialog-form-item-add"}
            label={index === 0 ? '* 权益内容' : ''}
            required={false}
            key={index}>
            {getFieldDecorator(`equitRuleDescList[${k}]`, {
              initialValue:equitRuleDescList[k]||"",
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
        const {name, logo_url, area_code_arr, sub_activity_url, actName,area_name_arr,activity_id,activity_name,logoFile,logoFilePath,equitType,targetType,basicType,basicValue,targetValue,description,navigationColorValue,equitBannerFile,equitBannerFilePath,buttonDesc,payDiscountLabel,equitExplain,equitSynopsisFile,equitSynopsisFilePath,accept} = this.state;
        const {isShowDialog, type, activityList} = this.props.interestStore;
        const title = type?type===1?'查看':'修改':'新增';
        const { getFieldDecorator } = this.props.form;
        return (<Modal visible={isShowDialog} title={title} width={850}
            footer={null} onCancel={this.onCancelClick}>
            <Form className="interests-dialog-container" layout="inline" labelAlign="right" onSubmit={this.onSubmitClick}>
                <div className="interests-dialog-div">
                <Form.Item label="权益名称" className="interests-dialog-form-item">
                    {getFieldDecorator('name', {
                        initialValue:name,
                        rules: [{ required: true, message: '标题不能为空' }],
                    })(
                        <TextArea placeholder="标题展示活动名称(10字以内)" autosize={{ minRows: 1}} disabled={type===1}/>
                    )}
                </Form.Item>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>权益logo:</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div>
                                        <img className="interests-file-image" alt="图片" src={logoFilePath}></img>
                                    </div>
                                    <img className="interests-file-add" src={ADDICON}  alt="Logo"></img>
                                    <Input className="interests-file-input" type="file"
                                           accept={accept}
                                           onChange={this.logoFileChange}></Input>
                                </div>
                            </div>
                        </div>
                        {/*<p className="etc-oil-dialog-item-placeholder">{isEmptyFile}</p>*/}
                    </div>
                    <Form.Item className="interests-dialog-form-item" label="活动类目">
                        {getFieldDecorator('equitType',{initialValue:equitType,rules: [{ required: true, message: '活动类目不能为空' }]})
                        (<Radio.Group disabled={type===1}>
                            <Radio value={1}>加油</Radio>
                            <Radio value={2}>洗车</Radio>
                        </Radio.Group>)}
                    </Form.Item>

                    <Form.Item className="interests-dialog-form-item" label="活动类型">
                        {getFieldDecorator('targetType',{initialValue:targetType,rules: [{ required: true, message: '活动类型不能为空' }]})
                        (<Radio.Group disabled={type===1} onChange={this.onTargetTypeChange}>
                            <Radio value={1}>绑卡领取</Radio>
                            {/*<Radio value={2}>优惠券领取</Radio>*/}
                        </Radio.Group>)}
                    </Form.Item>
                    {targetType===1?type === 1? <Form.Item label="活动名称" className="interests-dialog-form-item">
                        {getFieldDecorator('actName', {
                            initialValue:actName,
                            rules: [{ required: true, message: '标题不能为空' }],
                        })(
                            <TextArea autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>:<Form.Item label="活动名称" className="interests-dialog-form-item">
                        {getFieldDecorator('targetValue', {
                            initialValue:targetValue,
                            rules: [{ required: true, message: '活动不能为空' }],
                        })(
                            <Select
                                style={{width: 250}}
                                onChange={this.onChangeActivityId}
                                disabled={type === 1}
                                showArrow={type === 1}>
                                {activityList !== null ? activityList.map((item) =>
                                    <Select.Option key={item.act_id}>{item.act_name}</Select.Option>
                                ) : ""}
                            </Select> )}
                    </Form.Item>:null}
                    <Form.Item className="interests-dialog-form-item" label="活动依据">
                        {getFieldDecorator('basicType',{initialValue:basicType,rules: [{ required: true, message: '活动依据不能为空' }]})
                        (<Select
                            disabled={type===1}
                            style={{width: 250}}
                            onChange={this.onChangeBasicType}
                        >
                            <Select.Option  value={1}>银行卡code</Select.Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="活动简介" className="interests-dialog-form-item">
                        {getFieldDecorator('description', {
                            initialValue:description,
                            rules: [{ required: true, message: '活动简介不能为空' }],
                        })(
                            <TextArea placeholder="介绍活动地区、优惠规则(20字以内)" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
                    <Form.Item label="银行简称" className="interests-dialog-form-item">
                        {getFieldDecorator('basicValue', {
                            initialValue:basicValue,
                            rules: [{ required: true, message: '银行简称不能为空' }],
                        })(
                            <TextArea placeholder="请输入银行简称" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
                    <Form.Item label="支付优惠标签" className="interests-dialog-form-item">
                        {getFieldDecorator('payDiscountLabel', {
                            initialValue:payDiscountLabel,
                            rules: [{ required: true, message: '支付优惠标签不能为空' }],
                        })(
                            <TextArea placeholder="支付优惠标签(比如满200减20)" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
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
                <div className="interests-dialog-div">
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>活动banner:</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div>
                                        <img className="interests-file-image" alt="图片" src={equitBannerFilePath}></img>
                                    </div>
                                    <img className="interests-file-add" src={ADDICON}  alt="Logo"></img>
                                    <Input className="interests-file-input" type="file"
                                           accept={accept}
                                           onChange={this.equitBannerFileChange} ></Input>
                                </div>
                            </div>
                        </div>
                        {/*<p className="etc-oil-dialog-item-placeholder">{isEmptyFile}</p>*/}
                    </div>
                    <Form.Item label="导航栏色值" className="interests-dialog-form-item">
                        {getFieldDecorator('navigationColorValue', {
                            initialValue:navigationColorValue,
                            rules: [{ required: true, message: '导航栏色值不能为空' }],
                        })(
                            <TextArea placeholder="色值要与banner相匹配" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
                    <Form.Item label="按钮描述" className="interests-dialog-form-item">
                        {getFieldDecorator('buttonDesc', {
                            initialValue:buttonDesc,
                            rules: [{ required: true, message: '按钮描述不能为空' }],
                        })(
                            <TextArea placeholder="按钮展示的文字，限6个字以内" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
                    <div className="etc-oil-dialog-item-box">
                        <div className="etc-oil-dialog-item-content">
                            <p className="etc-oil-dialog-item-label"><span>* </span>权益简介图片:</p>
                            <div className="etc-oil-dialog-file-box">
                                <div className="etc-oil-dialog-file-content-box">
                                    <div>
                                        <img className="interests-file-image" alt="图片" src={equitSynopsisFilePath}></img>
                                    </div>
                                    <img className="interests-file-add" src={ADDICON}  alt="Logo"></img>
                                    <Input className="interests-file-input" type="file"
                                           accept={accept}
                                           onChange={this.equitSynopsisFileChange}></Input>
                                </div>
                            </div>
                        </div>
                        {/*<p className="etc-oil-dialog-item-placeholder">{isEmptyFile}</p>*/}
                    </div>
                    <Form.Item label="权益简介说明" className="interests-dialog-form-item">
                        {getFieldDecorator('equitExplain', {
                            initialValue:equitExplain,
                            rules: [{ required: true, message: '权益简介说明不能为空' }],
                        })(
                            <TextArea placeholder="权益简介说明，限80字内" autosize={{ minRows: 1}} disabled={type===1}/>
                        )}
                    </Form.Item>
                    {this.renderCoupon()}
                    <Form.Item className="interests-dialog-form-item-add-coupon">
                        <Button type="dashed" onClick={this.add} className="interests-dialog-form-add" disabled={type===1}>
                            <Icon type="plus" /> 增加优惠内容
                        </Button>
                    </Form.Item>
                    <Form.Item className="interests-dialog-form-item-footer">
                        {this.getFooter(type)}
                    </Form.Item>
                </div>

            </Form>
        </Modal>);
    }
}

export default Form.create({})(InterestsDialog);

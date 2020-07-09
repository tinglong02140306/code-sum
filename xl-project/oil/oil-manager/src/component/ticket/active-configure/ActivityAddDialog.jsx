import React from 'react';
import './ActivityAddDialog.scss';
import {addTreeProvence} from '../../../utils/utils';
import {isEmpty} from '../../../utils/isEmpty';
import {Modal, Button, Input, DatePicker, Radio, Steps, message, Icon, Transfer, Tree, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import iconSuccess from "../../../images/icon-success.png";
import provence from "../../../constants/provence"

const {Step} = Steps;
const provenceData = provence;
let provenceArr = [];
provenceArr = provenceArr.push(provenceData)

@inject("activityManageStore")
@observer
class ActivityAddModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            desc: [''],
            name: '',
            start_date: null,
            end_date: null,
            status: 1,
            limit: {type: '', value: ''},
            isNameEmpty: false,
            isStartDateEmpty: false,
            isEndDateEmpty: false,
            isStatusEmpty: false,
            isLimitEmpty: false,
            endOpen: false,
            isLimit: false,
            checkedKeys: [],
            treeData: [{title: "全部", key: "all", children: []}],
            provenceCheckedKeys: [],
            provenceTreeData: addTreeProvence(provenceData),
            targetKeys: [],
            push_basis:''
        };
    }

    componentDidMount() {
        const {typeModal, activityObject, brandList} = this.props.activityManageStore;
        this.setState({
            treeData: brandList,
        })
        if (typeModal !== 2 && activityObject != null) {
            if (activityObject.desc.length) {
                this.setState({desc: activityObject.desc})
            }
            // if (activityObject.limit.length) {
            //     this.setState({limit: activityObject.limit[0]})
            // }
            this.setState({
                name: activityObject.name,
                start_date: moment(activityObject.start_date),
                end_date: moment(activityObject.end_date),
                status: activityObject.status,
            });
        }
        // this.props.activityManageStore.getStationMultiQuery(this.state.checkedKeys,this.state.provenceCheckedKeys,)
    }

    //活动名称
    onActivityNameChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    //开始日期
    onStartChange = (value) => {
        this.setState({start_date: value});
        this.onChange('startValue', value);
    }

    //结束日期
    onEndChange = (value) => {
        this.setState({end_date: value});
        this.onChange('endValue', value);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    //描述
    onDescChange = (e) => {
        let descArr = this.state.desc;
        const array = descArr.map((item, index) => {
            if (index == e.target.id) {
                item = e.target.value;
            }
            return item;
        });
        this.setState({
            desc: array
        });
    }

    //活动状态
    onActivityStatusChange = (e) => {
        this.setState({
            status: e.target.value
        });
    }

    //活动限制
    onActivityLimitChange = (e) => {
        this.setState({
            limit: {type: e.target.value, value: ''}
        });
    }
    //投放依据
    onActivityPushBasisChange = (e) => {
        this.setState({
            push_basis: e.target.value
        });
    }

    //活动限制描述
    onWhiteListChange = (e) => {
        this.setState({
            limit: {type: 1, value: e.target.value}
        });
    }
    //品牌选择
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode {...item} />;
        });
    }
    onTreeCheck = (checkedKeys) => {
        let arrayInt = checkedKeys;
        for (let i = 0; i < checkedKeys.length; i++) {
            if (checkedKeys[i] === "all") {
                // arrayInt.push(parseInt(checkedKeys[i], 10));
                arrayInt.splice(i, 1);
            }
        }
        this.setState({
            checkedKeys: checkedKeys,
            // intCheckKeys: arrayInt
        });
        if (arrayInt.length && this.state.provenceCheckedKeys.length) {
            this.props.activityManageStore.getStationMultiQuery(arrayInt, this.state.provenceCheckedKeys)
        }
    }

    //省份选择
    renderProvenceTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode {...item} />;
        });
    }
    onProvenceTreeCheck = (checkedKeys) => {
        let arrayInt = checkedKeys;
        for (let i = 0; i < checkedKeys.length; i++) {
            if (checkedKeys[i] === "all") {
                // arrayInt.push(parseInt(checkedKeys[i], 10));
                arrayInt.splice(i, 1);
            }
        }
        this.setState({
            provenceCheckedKeys: checkedKeys,
        });
        if (arrayInt.length && this.state.checkedKeys.length) {
            this.props.activityManageStore.getStationMultiQuery(this.state.checkedKeys, arrayInt)
        }
    }

    //油站
    handleChange = targetKeys => {
        this.setState({targetKeys});
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;


    next() {
        // const current = this.state.current + 1;
        // this.setState({ current });
        const {targetKeys, current, desc, name, start_date, end_date, status, push_basis} = this.state;
        const {typeModal, activity_id} = this.props.activityManageStore;
        const checkResult = this.checkInfo();
        console.log(desc)
        if (typeModal === 2) {
            if (current === 0) {
                if (checkResult) {
                    this.props.activityManageStore.getAddActivity(name, start_date, end_date, desc, push_basis, current, () => {
                        const nextCurrent = current + 1;
                        this.setState({current: nextCurrent});
                    });
                }
            } else if (current === 1) {
                if (targetKeys.length) {
                    this.props.activityManageStore.getActivityStationAdd(activity_id, targetKeys, current, () => {
                        const nextCurrent = current + 1;
                        this.setState({current: nextCurrent});
                    });
                } else {
                    message.info("请选择油站");
                }
            }
        }
    }

    prev() {
        //上一步
        // if (this.state.current === 2){
        //
        // }
        // const current = this.state.current - 1;
        // this.setState({ current });
        const {current, desc, name, start_date, end_date, status, push_basis, whiteList, isNameEmpty, isStartDateEmpty, isEndDateEmpty, isStatusEmpty} = this.state;
        const {typeModal} = this.props.activityManageStore;
        const checkResult = this.checkInfo();
        if (typeModal === 2) {
            if (current === 0) {
                if (checkResult) {
                    this.props.activityManageStore.getAddActivity(name, start_date, end_date, desc, push_basis, null, () => {
                        this.props.onClicked();
                    });
                }
            }
        } else {
            this.props.activityManageStore.setIsShowActivityManageModal(0, false, null);
        }
    }

    /**
     * 提交前的校验
     */
    checkInfo = () => {
        const {name, start_date, end_date, status, limit} = this.state;

        if (isEmpty(name)) {
            this.setState({isNameEmpty: true});
            return false
        } else {
            this.setState({isNameEmpty: false});
        }
        if (isEmpty(start_date)) {
            this.setState({isStartDateEmpty: true});
            return false
        } else {
            this.setState({isStartDateEmpty: false});
        }
        if (isEmpty(end_date)) {
            this.setState({isEndDateEmpty: true});
            return false
        } else {
            this.setState({isEndDateEmpty: false});
        }
        // if (limit.type === 1 && isEmpty(limit.value)) {
        //     this.setState({isLimitEmpty: true});
        //     return false
        // } else {
        //     this.setState({isLimitEmpty: false});
        // }
        // if (isEmpty(status)) {
        //     this.setState({isStatusEmpty: true});
        //     return false
        // } else {
        //     this.setState({isStatusEmpty: false});
        // }

        return true
    }

    getTitle = (typeModal) => {
        let title = "";
        switch (typeModal) {
            case 0:
                title = "查看";
                break
            case 1:
                title = "修改活动";
                break
            case 2:
                title = "新建活动";
                break
        }
        return title
    }

    addDesc = (e) => {
        let descArr = this.state.desc;
        descArr.push('');
        this.setState({
            desc: descArr
        });
    };

    removeDesc = (index) => {
        let descArr = this.state.desc;
        if (descArr.length > 1) {
            descArr.splice(index, 1);
            this.setState({
                desc: descArr
            });
        } else {
            return;
        }
    }
    onPushBasisCancel = (e) => {
        this.setState({
            push_basis: ''
        });
    }

    onCancel = () => {
        this.props.activityManageStore.setIsShowActivityManageModal(0, false, null);
    }

    render() {
        const {push_basis,isLimitEmpty, isShowActivityCompleteLoading, targetKeys, provenceCheckedKeys, provenceTreeData, checkedKeys, treeData, current, desc, name, start_date, end_date, status, limit, whiteList, isNameEmpty, isStartDateEmpty, isEndDateEmpty, isStatusEmpty} = this.state;
        const {isShowActivityManageModal, typeModal, isShowActivityManageModalLoading, isShowSpinLoading, stationMultiList} = this.props.activityManageStore;
        const title = this.getTitle(typeModal);
        let brandNum = 0;
        if (treeData) {
            if (treeData.length) {
                brandNum = treeData.length;
            }
        }
        return (<Modal
            width={'80%'}
            title={title}
            onCancel={this.onCancel}
            visible={isShowActivityManageModal}
            footer={null}>
            <div className="activity-add-modal-container">

                <Steps className="activity-steps" current={current} size='small'>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>

                <div className="activity-steps-content1"
                     style={{display: steps[current].content === 0 ? 'flex' : 'none'}}>
                    <div className="activity-steps-content1-item">
                        <div className="activity-steps-content1-input-box">
                            <div className="activity-steps-content1-input-hint"><span>*</span>活动名称:</div>
                            <Input.TextArea
                                maxLength={100}
                                value={name}
                                autosize={{minRows: 1}}
                                // disabled={typeModal === 0}
                                placeholder="给活动起个名字"
                                onChange={this.onActivityNameChange}
                            />
                        </div>
                        <div className="activity-input-error-hint"
                             style={{visibility: isNameEmpty ? 'visible' : 'hidden'}}>请输入活动名称
                        </div>
                    </div>
                    <div className="activity-steps-content1-item">
                        <div className="activity-steps-content1-input-box">
                            <div className="activity-steps-content1-input-hint"><span>*</span>开始日期:</div>
                            <DatePicker
                                size="small"
                                // disabled={typeModal === 0}
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                value={start_date}
                                placeholder="开始日期"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                        </div>
                        <div className="activity-input-error-hint"
                             style={{visibility: isStartDateEmpty ? 'visible' : 'hidden'}}>请选择开始日期
                        </div>
                    </div>
                    <div className="activity-steps-content1-item">
                        <div className="activity-steps-content1-input-box">
                            <div className="activity-steps-content1-input-hint"><span>*</span>结束日期:</div>
                            <DatePicker
                                size="small"
                                // disabled={typeModal === 0}
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                value={end_date}
                                placeholder="结束日期"
                                onChange={this.onEndChange}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </div>
                        <div className="activity-input-error-hint"
                             style={{visibility: isEndDateEmpty ? 'visible' : 'hidden'}}>请选择结束日期
                        </div>
                    </div>
                    <div className="activity-steps-content1-item">
                        <div className="activity-steps-content1-input-box-limit">
                            <div className="activity-steps-content1-input-hint">投放依据:</div>
                            <Radio.Group
                                onChange={this.onActivityPushBasisChange} value={push_basis}
                                // disabled={typeModal === 0}
                            >
                                <Radio value={0}>银行卡</Radio>
                                <Radio value={1}>加油卡</Radio>
                                <Radio value={2}>身份证</Radio>
                                <Radio value={3}>手机号</Radio>
                                <Radio value={4}>车牌号</Radio>
                                {/*<Radio value={999}>无</Radio>*/}
                            </Radio.Group>
                            <Icon type="stop" className='activity-rollback' style={{visibility: push_basis ? "visible" : "hidden"}} onClick={this.onPushBasisCancel}/>
                        </div>
                        <div className="activity-input-error-hint"
                             style={{visibility: isLimitEmpty ? 'visible' : 'hidden'}}>值不能为空
                        </div>
                    </div>
                    <div className="activity-steps-content1-item">
                        {
                            desc.map((item, index) =>
                                <div key={index} className='activity-steps-content1-item-desc'>
                                    <div className="activity-steps-content1-input-box">
                                        <div className="activity-steps-content1-input-hint"
                                             style={{visibility: index > 0 ? "hidden" : "visible"}}>活动描述:
                                        </div>
                                        <Input.TextArea
                                            id={index}
                                            maxLength={100}
                                            value={item}
                                            autosize={{minRows: 1}}
                                            // disabled={typeModal === 0}
                                            placeholder="活动描述"
                                            onChange={this.onDescChange}
                                            // onChange={this.onDescChange.bind(this,index)}
                                        />
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            style={{display: desc.length > 1 ? "flex" : "none"}}
                                            onClick={this.removeDesc.bind(this, index)}
                                        />
                                    </div>
                                    <div className="activity-input-error-hint" style={{visibility: 'hidden'}}>请活动描述
                                    </div>
                                </div>
                            )
                        }

                        <Button type="dashed" onClick={this.addDesc} className="activity-steps-content1-input"
                                style={{visibility: typeModal === 0 ? 'hidden' : 'visible'}}>
                            <Icon type="plus"/> 添加描述信息
                        </Button>
                    </div>

                </div>
                <div className="activity-steps-content2"
                     style={{display: steps[current].content === 1 ? 'flex' : 'none'}}>
                    <div className='activity-steps-content2-box'>
                        <div className='activity-steps-content2-item'>
                            <div>共{brandNum}条</div>
                            <div>品牌</div>
                        </div>
                        <div className='activity-steps-content2-line'/>
                        <div className='activity-steps-content2-tree'>
                            <div style={{
                                height: treeData[0] && treeData[0].children.length >= 5 ? 158 : "auto",
                                overflowY: treeData[0] && treeData[0].children.length >= 5 ? "scroll" : "hidden",
                                overflowX: "hidden",
                            }}>
                                <Tree
                                    checkable
                                    onCheck={this.onTreeCheck}
                                    checkedKeys={checkedKeys}
                                    defaultExpandAll={true}>
                                    {this.renderTreeNodes(treeData)}
                                </Tree>
                            </div>
                        </div>
                    </div>
                    <div className='activity-steps-content2-box'>
                        <div className='activity-steps-content2-item'>
                            <div>共{provenceTreeData[0].children.length ? provenceTreeData[0].children.length : 0}条</div>
                            <div>省份</div>
                        </div>
                        <div className='activity-steps-content2-line'/>
                        <div className='activity-steps-content2-tree'>
                            <div style={{
                                height: provenceTreeData[0] && provenceTreeData[0].children.length >= 5 ? 158 : "auto",
                                overflowY: provenceTreeData[0] && provenceTreeData[0].children.length >= 5 ? "scroll" : "hidden",
                                overflowX: "hidden",
                            }}>
                                <Tree
                                    checkable
                                    onCheck={this.onProvenceTreeCheck}
                                    checkedKeys={provenceCheckedKeys}
                                    defaultExpandAll={true}>
                                    {this.renderProvenceTreeNodes(provenceTreeData)}
                                </Tree>
                            </div>
                        </div>

                    </div>
                    <div className='activity-steps-content2-Spin'>
                        <Spin style={{width: '50%'}} spinning={isShowSpinLoading}>
                            <Transfer
                                dataSource={stationMultiList}
                                titles={['加油站', '已添加']}
                                showSearch
                                filterOption={this.filterOption}
                                targetKeys={targetKeys}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                                render={item => item.title}
                            />
                        </Spin>
                    </div>
                </div>
                <div className="activity-steps-content3"
                     style={{display: steps[current].content === 2 ? 'flex' : 'none'}}>
                    <img className='activity-steps-content3-img' src={iconSuccess}></img>
                    <div className='activity-steps-content3-title'>操作成功！</div>
                    <div className='activity-steps-content3-sub-title'>活动已及时更新</div>
                </div>
                <div className="steps-action">
                    {current !== 2 && (
                        <Button type="primary" loading={isShowActivityManageModalLoading}
                                onClick={() => this.next(current)}>
                            {current === 0 ? '继续' : '完成'}
                        </Button>
                    )}
                    {/*{current === steps.length - 1 && (*/}
                    {/*    <Button size='small' type="primary" onClick={() => message.success('Processing complete!')}>*/}
                    {/*        完成*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                    {current === 0 && (
                        <Button loading={isShowActivityCompleteLoading} style={{marginLeft: 20}}
                                onClick={() => this.prev(current)}>
                            完成
                        </Button>
                    )}
                </div>
                <div className='activity-add-bottom-line'
                     style={{display: steps[current].content === 2 ? 'none' : 'flex'}}/>
                <div className='activity-add-bottom-hint'
                     style={{display: steps[current].content === 2 ? 'none' : 'flex'}}>
                    <div>说明</div>
                    <div>活动优惠</div>
                    <div>参与非油券活动的加油站将以油机价而非信联价出售</div>
                </div>
            </div>
        </Modal>);
    }
}

export default ActivityAddModal;

const steps = [
    {
        title: '配置活动规则',
        content: 0,
    },
    {
        title: '添加活动加油站',
        content: 1,
    },
    {
        title: '完成',
        content: 2,
    },
];


//
{/*<div className="activity-steps-content1-item">*/
}
{/*    <div className="activity-steps-content1-input-box">*/
}
{/*        <div className="activity-steps-content1-input-hint"><span>*</span>活动状态:</div>*/
}
{/*        <Radio.Group*/
}
{/*            onChange={this.onActivityStatusChange} value={status}*/
}
{/*                     // disabled={typeModal === 0}*/
}
{/*        >*/
}
{/*            <Radio value={1}>发布</Radio>*/
}
{/*            <Radio value={2}>失效</Radio>*/
}
{/*        </Radio.Group>*/
}
{/*    </div>*/
}
{/*    <div className="activity-input-error-hint" style={{visibility: isStatusEmpty ? 'hidden' : 'hidden'}}>请选择活动状态</div>*/
}
{/*</div>*/
}
{/*<div className="activity-steps-content1-item">*/}
{/*    <div className="activity-steps-content1-input-box-limit">*/}
{/*        <div className="activity-steps-content1-input-hint">活动限制:</div>*/}
{/*        <Radio.Group*/}
{/*            onChange={this.onActivityLimitChange} value={limit.type}*/}
{/*            // disabled={typeModal === 0}*/}
{/*        >*/}
{/*            <Radio value={1}>白名单*/}
{/*            </Radio>*/}
{/*        </Radio.Group>*/}
{/*        <Input.TextArea*/}
{/*            width={100}*/}
{/*            maxLength={100}*/}
{/*            value={limit.value}*/}
{/*            autosize={{minRows: 1}}*/}
{/*            disabled={limit.type === 1 ? false : true}*/}
{/*            placeholder="值"*/}
{/*            onChange={this.onWhiteListChange}*/}
{/*        />*/}
{/*    </div>*/}
{/*    <div className="activity-input-error-hint"*/}
{/*         style={{visibility: isLimitEmpty ? 'visible' : 'hidden'}}>值不能为空*/}
{/*    </div>*/}
{/*</div>*/}
import React from 'react';
import './ActivityAddDialog.scss';
import {addTreeProvence} from '../../../utils/utils';
import {isEmpty} from '../../../utils/isEmpty';
import {Modal, Button,Steps,Transfer,Tree,Spin,message} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import iconSuccess from "../../../images/icon-success.png";
import provence from "../../../constants/provence"

const { Step } = Steps;
const provenceData = provence;
let provenceArr = [];
provenceArr = provenceArr.push(provenceData)

@inject("activityManageStore")
@observer
class StationSetModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: [],
            treeData: [{title: "全部", key: "all", children: []}],
            provenceCheckedKeys: [],
            provenceTreeData: addTreeProvence(provenceData),
            targetKeys: [],
            activity_id:''
        };
    }

    componentDidMount() {
        const {brandList,activityObject} = this.props.activityManageStore;
        this.setState({
            treeData:brandList,
            activity_id:activityObject.id,
        })
        // this.props.activityManageStore.getStationMultiQuery(this.state.checkedKeys,this.state.provenceCheckedKeys,)
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
                arrayInt.splice(i,1);
            }

        }
        this.setState({
            checkedKeys: checkedKeys,
            // intCheckKeys: arrayInt
        });
        if (arrayInt.length && this.state.provenceCheckedKeys.length){
            this.props.activityManageStore.getStationMultiQuery(arrayInt,this.state.provenceCheckedKeys)
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
                arrayInt.splice(i,1);
            }
        }
        this.setState({
            provenceCheckedKeys: checkedKeys,
        });
        if (arrayInt.length && this.state.checkedKeys.length){
            this.props.activityManageStore.getStationMultiQuery(this.state.checkedKeys,arrayInt)
        }
    }

    //油站
    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    onCancel = () => {
        this.props.activityManageStore.setIsShowActivityStationSetModal(0, false, null);
    }

    onOk = () => {
        const {activity_id,targetKeys} = this.state;
        if (targetKeys.length){
            this.props.activityManageStore.getActivityStationAdd(activity_id, targetKeys, 3,()=>{});
        }else {
            message.info("请选择油站");
        }
    }

    render() {
        const {targetKeys,provenceCheckedKeys, provenceTreeData,checkedKeys, treeData} = this.state;
        const {isShowActivityStationSetModal, isShowActivityManageModalLoading,stationMultiList,isShowSpinLoading} = this.props.activityManageStore;
        return (<Modal
            width={'60%'}
            title='设置油站'
            onCancel={this.onCancel}
            visible={isShowActivityStationSetModal}
            footer={[
                <Button key="back" onClick={this.onCancel}>取消</Button>,
                <Button key="submit" onClick={this.onOk} loading={isShowActivityManageModalLoading}
                        type="primary">提交</Button>] }>
            <div className="activity-steps-content2">
                <div className='activity-steps-content2-box'>
                    <div className='activity-steps-content2-item'>
                        <div>共{treeData[0].children.length?treeData[0].children.length:0}条</div>
                        <div>品牌</div>
                    </div>
                    <div className='activity-steps-content2-line'/>
                    <div className='activity-steps-content2-tree'>
                        <div style={{
                            height:treeData[0]&&treeData[0].children.length >= 5 ? 158 : "auto",
                            overflowY:treeData[0]&&treeData[0].children.length >= 5 ? "scroll" : "hidden",
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
                        <div>共{provenceTreeData[0].children.length?provenceTreeData[0].children.length:0}条</div>
                        <div>省份</div>
                    </div>
                    <div className='activity-steps-content2-line'/>
                    <div className='activity-steps-content2-tree'>
                        <div style={{
                            height:provenceTreeData[0]&&provenceTreeData[0].children.length >= 5 ? 158 : "auto",
                            overflowY:provenceTreeData[0]&&provenceTreeData[0].children.length >= 5 ? "scroll" : "hidden",
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
                <div className='activity-steps-content2-Spin' >
                    <Spin  style={{width:'50%'}} spinning={isShowSpinLoading}>
                        <Transfer
                            dataSource={stationMultiList}
                            titles={['加油站','已添加']}
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
        </Modal>);
    }
}
export default StationSetModal;


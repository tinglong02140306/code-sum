import React from "react";
import './DiscountDialog.scss';
import {Input,Modal,Radio,Icon,Select,Tree,Transfer,Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {addTreeProvence} from "../../../utils/utils";
import provence from "../../../constants/provence";

const provenceData = provence;
let provenceArr = [];
provenceArr = provenceArr.push(provenceData)

@inject("discountStationStore")
@observer
class DiscountStationDialog extends React.Component{

    constructor(){
        super();
        this.state={
            discount_id:'',
            discount_name:'',
            station_array:[],
            checkedKeys: [],
            treeData: [{title: "全部", key: "all", children: []}],
            provenceCheckedKeys: [],
            provenceTreeData: addTreeProvence(provenceData),
            targetKeys: [],
            discountHint:'',
            stationHint:'',
        }
    }

    componentDidMount(){
        const {brandList} = this.props.discountStationStore;
        this.setState({
            treeData:brandList,
        })
    }

    onChangeDiscountId = (value) => {
        const {discountDataList} = this.props.discountStationStore;
        let discount_name = '';
        discountDataList.map((item) =>{
            if (item.id === value){
                // this.setState({discount_name:item.name})
                discount_name = item.name;
            }
        })
        this.setState({
            discount_id: value,
            discount_name: discount_name,
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
                arrayInt.splice(i,1);
            }

        }
        this.setState({
            checkedKeys: checkedKeys,
            // intCheckKeys: arrayInt
        });
        if (arrayInt.length && this.state.provenceCheckedKeys.length){
            this.props.discountStationStore.getStationMultiQuery(arrayInt,this.state.provenceCheckedKeys)
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
            this.props.discountStationStore.getStationMultiQuery(this.state.checkedKeys,arrayInt)
        }
    }

    //油站
    handleChange = targetKeys => {
        const {stationMultiList} = this.props.discountStationStore;
        let tempDic = {};
        let station_array = [];
        targetKeys.map((key) =>{
            stationMultiList.map((item)=>{
                if (key === item.key){
                    tempDic = {station_id: key, station_name: item.title};
                    station_array.push(tempDic);
                }
            })
        })
        this.setState({
            targetKeys: targetKeys,
            station_array: station_array,
        });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    onCancel=()=>{
        if (this.props.discountStationStore.operationData) {
            this.props.discountStationStore.setOperationData(null);
        }
        this.props.discountStationStore.setIsShowDialog(false);
    }

    onOk=()=>{
        // this.props.discountStationStore.setIsShowResultDialog(true,1);
        // this.dealData();
        const {typeModal,operationData,stationMultiList,discountDataList} = this.props.discountStationStore;//0:增加 1:修改 2 :查看
        const {station_array,discount_id,discount_name} = this.state;
        this.checkoutData();
        if(typeModal===0){//新增
            if (discount_name && discount_id && station_array.length){
                this.props.discountStationStore.addDiscountStation(discount_id,discount_name,station_array);

            }else {
                this.checkoutData();
            }
        }
    }

    /**
     *提交前处理数据
     */
    dealData=()=>{
        const {stationMultiList,discountDataList} = this.props.discountStationStore;
        const {discount_id,targetKeys} = this.state;
        discountDataList.map((item) =>{
            if (item.id === discount_id){
                this.setState({discount_name:item.name})
            }
        })
        let station_array = [];
        let tempDic = {};
        targetKeys.map((key) =>{
            stationMultiList.map((item)=>{
                if (key === item.key){
                    // nameArr.push(item.title)
                     tempDic = {station_id: key, station_name: item.title};
                    station_array.push(tempDic);
                }
            })
        })
        this.setState({
            station_array:station_array
        })
    }
    /**
     *提交前的校验
     */
    checkoutData=()=>{
        const {discount_id,targetKeys} = this.state;
        this.setState({
            discountHint:discount_id?"":"请选择折扣",
            stationHint:targetKeys.length?"":"油站不能为空",
        });
    }
    render(){
        const {targetKeys,provenceCheckedKeys, provenceTreeData,checkedKeys, treeData,discount_id,discountHint,stationHint} = this.state;
        const {discountDataList,isShowDialog,typeModal,isShowActivityStationSetModal, isShowActivityManageModalLoading,stationMultiList,isShowSpinLoading} = this.props.discountStationStore;
        let title = "";
        let okText = "";
        if(typeModal===0){
            title="添加";
            okText="提交"
        }else if (typeModal===1){
            title="修改";
            okText="提交"
        }else{
            title="查看";
            okText="确定"
        }
        let brandNum = 0;
        if (treeData) {
            if (treeData.length) {
                brandNum = treeData[0].children.length;
            }
        }
        return (
            <Modal title={title}
                   width={1100}
                   okText={okText}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowDialog}>
                <div className="discount-station-dialog-box">
                    <div className="discount-station-dialog-item">
                        <div className='discount-station-dialog-item-hint'>提示：添加油站会清空原有的油站关联</div>
                        <div className="discount-station-dialog-item-content">
                            <p className="discount-station-dialog-item-label"><span>*</span>折扣选择:</p>
                            <Select style={{width: 200}}
                                    onChange={this.onChangeDiscountId}
                                    size="small"
                                    value={discount_id}>
                                {discountDataList !== null ? discountDataList.map((number) =>
                                    <Select.Option value={number.id} key={number.id}>{number.name}</Select.Option>
                                ) : ""}
                            </Select>
                        </div>
                        <p className="discount-station-item-placeholder">{discountHint}</p>
                    </div>
                    <div className="discount-station-dialog-item">
                        <div className="discount-station-dialog-item-content">
                            <p className="discount-station-dialog-item-label"><span>*</span>油站选择:</p>
                        </div>
                        <div className="discount-activity-steps-content2">
                            <div className='discount-activity-steps-content2-box'>
                                <div className='discount-activity-steps-content2-item'>
                                    <div>共{brandNum}条</div>
                                    <div>品牌</div>
                                </div>
                                <div className='discount-activity-steps-content2-line'/>
                                <div className='discount-activity-steps-content2-tree'>
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
                            <div className='discount-activity-steps-content2-box'>
                                <div className='discount-activity-steps-content2-item'>
                                    <div>共{provenceTreeData[0].children.length?provenceTreeData[0].children.length:0}条</div>
                                    <div>省份</div>
                                </div>
                                <div className='discount-activity-steps-content2-line'/>
                                <div className='discount-activity-steps-content2-tree'>
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
                            <div className='discount-activity-steps-content2-Spin' >
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
                        <p className="discount-station-item-placeholder">{stationHint}</p>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default DiscountStationDialog;
import React from 'react';
import "./Terminal.scss";
import {Table, Input, Button, Icon, Popconfirm, Form,Select,Tooltip,Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import TerminalDialog from '../../../component/shell/terminal/TerminalDialog';
import TerminalBatchDialog from  "../../../component/shell/terminal/batch/TerminalBatchDialog";
import EngineLeadDialog from "../../../component/shell/terminal/engine/EngineLeadDialog";
import LeadResultDialog from '../../../component/shell/terminal/engine/LeadResultDialog';

const Option = Select.Option;
let store = null;
let page_num = 1;

@inject("terminalStore")
@observer
class Terminal extends React.Component {

    constructor() {
        super();
        this.state = {
            terminal_id: '',
            terminal_name: '',
            group_id:'',
            oil_detail_id:'',
            isLeadLoading:false,
            isShowDiesel:false,
            isShowAll:false
        }
    }

    componentDidMount() {
        const {terminal_id, terminal_name,group_id,oil_detail_id} = this.state;
        this.props.terminalStore.setPageSize(15);
        store = this.props.terminalStore;
        this.props.terminalStore.getTerminalList(page_num, 18, terminal_id, terminal_name,group_id,oil_detail_id);
        this.props.terminalStore.getGroupData();
        this.props.terminalStore.getOilList();
    }


    handleTableChange = (pagination) => {
        const {terminal_id, terminal_name,group_id,oil_detail_id} = this.state;
        const {page_size} = this.props.terminalStore;
        const pager = {...this.props.terminalStore.pagination};
        pager.current = pagination.current;
        page_num = pager.current;
        this.props.terminalStore.setCurrentPage(page_num);
        this.props.terminalStore.setPagination(pager);
        this.props.terminalStore.getTerminalList(page_num, page_size, terminal_id, terminal_name,group_id,oil_detail_id);
    }

    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    }

    onChangeTerminalName = (e) => {
        this.setState({terminal_name: e.target.value});
    }

    onSearchClick = () => {
        const {terminal_id, terminal_name,group_id,oil_detail_id} = this.state;
        const {page_size} = this.props.terminalStore;
        this.props.terminalStore.getTerminalList(1, page_size, terminal_id, terminal_name,group_id,oil_detail_id);
    }

    onResetClick = () => {
        this.setState({
            terminal_id: '',
            terminal_name: '',
            group_id:'',
            oil_detail_id:''
        });
    }
    /**
     *录入
     */
    onTerminalAdd = () => {
        this.props.terminalStore.setTypeDialog(0);
        this.props.terminalStore.setDialogData(null);
        this.props.terminalStore.getAddTerminalData();
    }

    /**
     * 批量修改
     */
    onTerminalBatchUpdate=()=>{
        this.props.terminalStore.getBatchUpdateData();
    }

    /**
     * 油机价导入
     */
    onEngineLeadChange=()=>{
        this.props.terminalStore.getCurrentEngineXLSX();
    }

    /**
     * 立即更新全部
     */
    onUpdateAll=()=>{
        this.setState({isShowAll: true,});
    }
    handelUpdateAll=()=>{
        this.setState({isShowAll: false,});
        this.props.terminalStore.getUpdateNow();
    }
    cancelUpdateAll=()=>{
        this.setState({isShowAll: false,});
    }
    /**
     * 立即更新柴油
     */
    onUpdateDiesel=()=>{
        this.setState({isShowDiesel: true,});
    }
    handleUpdateDiesel=()=>{
        this.setState({isShowDiesel: false,});
        this.props.terminalStore.getUpdateDiesel();
    }
    cancelUpdateDiesel=()=>{
        this.setState({isShowDiesel: false,});
    }

    header = () => {
        return <div className="terminal-table-header">
            <div className="terminal-table-header-left">
                <Button type="primary" onClick={this.onTerminalAdd} className="terminal-table-header-button">录入</Button>
                <Button type="primary" onClick={this.onTerminalBatchUpdate} className="terminal-table-header-button">批量修改</Button>
                <Button type="primary" onClick={this.onEngineLeadChange} className="terminal-table-header-button">油机价导入</Button>
            </div>
            <div className="terminal-table-header-right">
                <Button type="default" onClick={this.onUpdateDiesel}
                        className="terminal-table-header-button"
                        style={{backgroundColor:"#ff8120",color:"#ffffff",border:"none"}}>立即更新柴油</Button>
                <Button type="default"
                        onClick={this.onUpdateAll}
                        className="terminal-table-header-button"
                        style={{backgroundColor:"#ff8120",color:"#ffffff",border:"none"}}>立即更新油价</Button>
            </div>

            <Modal
                title="提示"
                visible={this.state.isShowDiesel}
                onOk={this.handleUpdateDiesel}
                onCancel={this.cancelUpdateDiesel}
            >
                <p>确定要立即更新柴油吗？</p>
            </Modal>
            <Modal
                title="提示"
                visible={this.state.isShowAll}
                onOk={this.handelUpdateAll}
                onCancel={this.cancelUpdateAll}
            >
                <p>确定要立即更新全部油价吗？</p>
            </Modal>
        </div>
    }

    selectGroupOption=()=>{
        const {groupList} = this.props.terminalStore;
        return groupList&&groupList.map((item,index)=>{
            if(!index){
               return  [<Option key={null} >全部</Option>,
                <Option key={item.id} >{item.group_name}</Option>]
            }
            return <Option key={item.id} >{item.group_name}</Option>
        });
    }

    selectOilOption=()=>{
        const {oilList} = this.props.terminalStore;
        return oilList&&oilList.map((item,index)=>{
            if(!index){
                return  [<Option key={null} >全部</Option>,
                    <Option key={item.id} >{item.pos_oil}</Option>]
            }
            return <Option key={item.id} >{item.pos_oil}</Option>
        });
    }

    onGroupNameIdChange=(e)=>{
        this.setState({group_id:e});
    }

    onOilDetailIdChange=(e)=>{
        this.setState({oil_detail_id:e});
    }

    render() {
        const {isShowLoading, terminalList, isShowDialog, pagination,isShowBatchDialog,isShowEngineDialog,isShowLeadResuleDialog} = this.props.terminalStore;
        const {terminal_id, terminal_name,group_id,oil_detail_id} = this.state;
        return <div className="terminal-container">
            {<div className="terminal-top-container">
                <Form className="terminal-form" layout="inline">
                    <Form.Item label="终端名称" className="terminal-form-item">
                        <Input size="small"
                               value={terminal_name}
                               style={{width: 150, margin: 0}}
                               maxLength={100}
                               onChange={this.onChangeTerminalName}/>
                    </Form.Item>
                    <Form.Item label="终端编号" className="terminal-form-item">
                        <Input size="small"
                               value={terminal_id}
                               style={{width: 150, margin: 0}}
                               maxLength={20}
                               onChange={this.onChangeTerminalId}/>
                    </Form.Item>
                    <Form.Item label="终端分组" className="terminal-form-item">
                        <Select className="terminal-dialog-item-input"
                                size="small"
                                value={group_id}
                                style={{width: 150, margin: 0}}
                                onChange={this.onGroupNameIdChange}>
                            {this.selectGroupOption()}
                        </Select>
                    </Form.Item>
                    <Form.Item label="油品类型" className="terminal-form-item">
                        <Select className="terminal-dialog-item-input"
                                size="small"
                                value={oil_detail_id}
                                style={{width: 150, margin: 0}}
                                onChange={this.onOilDetailIdChange}>
                            {this.selectOilOption()}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="small" className="terminal-button"
                            onClick={this.onSearchClick}>查询</Button>
                    <Button type="primary" size="small" className="terminal-button"
                            onClick={this.onResetClick}>重置</Button>
                </Form>
            </div>}
            <Table className="terminal-table"
                   columns={columns}
                   bordered={true}
                   loading={isShowLoading}
                   title={this.header}
                   size="small"
                   scroll={{x:'110%'}}
                   pagination={pagination}
                   onChange={this.handleTableChange}
                   dataSource={terminalList}/>
            {isShowDialog ? <TerminalDialog/> : null}
            {isShowBatchDialog?<TerminalBatchDialog/>:null}
            {isShowEngineDialog?<EngineLeadDialog/>:null}
            {isShowLeadResuleDialog?<LeadResultDialog/>:null}
        </div>
    }
}

export default Terminal;


const columns = [
    {
        title: '终端编号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center'
    }, {
        title: '终端名称',
        dataIndex: 'terminal_name',
        key: 'terminal_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    },  {
        title: '分组名称',
        dataIndex: 'group_name',
        key: 'group_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={optionStyle.text}>{record||"--"}</p></Tooltip>);
        }
    }, {
        title: '油品名称',
        dataIndex: 'pos_oil',
        key: 'pos_oil',
        align: 'center'
    }, {
        title: '成本价(元)',
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'center'
    }, {
        title: '油机价(元)',
        dataIndex: 'list_price',
        key: 'list_price',
        align: 'center'
    },{
        title: '信联价(元)',
        dataIndex: 'xl_price',
        key: 'xl_price',
        align: 'center'
    },{
        title: '优惠金额(元)',
        dataIndex: 'discount_amount',
        key: 'discount_amount',
        align: 'center'
    }, {
        title: '操作',
        key: 'options',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                    store.setDialogData(record);
                    store.setIsShowDialog(true);
                    store.setTypeDialog(2)
                }}>
                    <Icon type="eye-o" style={{color: "#379b7f"}}/>
                    <p style={optionStyle.see}>查看</p>
                </div>
                <div style={optionStyle.item} onClick={() => {
                    store.setDialogData(record);
                    store.setTypeDialog(1);
                    store.getGroupList();
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定要删除么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.getDelectTerminal(record.id)
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="delete" style={{color: "#ff5501"}}/>
                        <p style={optionStyle.delete}>删除</p>
                    </div>
                </Popconfirm>
            </div>
        }
    }];

const optionStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        cursor: 'pointer'
    },
    update: {
        margin: 2,
        color: "#1890ff"
    },
    delete: {
        margin: 2,
        color: "#ff5501"
    },
    see: {
        margin: 2,
        color: "#379b7f"
    },
    text:{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0,
    }
}
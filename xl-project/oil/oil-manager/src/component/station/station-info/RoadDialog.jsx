import React from "react";
import "../../../page/station/station-info/StationInfo.scss"
import {Input,Modal,Form,Button,Table} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";
import './StationInfoDialog.scss'

let store = null;
@inject("stationInfoStore")
@observer
class RoadDialog extends React.Component{

    constructor(){
        super();
        this.state={
            page_num:1,
            page_size:5,
            road_code:'',
            selectedRowKeys:[]
        }
    }

    componentDidMount() {
        const {road_code,page_num,page_size} = this.state;
        store= this.props.stationInfoStore;
        store.setRoadPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            road_code: isEmpty(road_code)?null:trim(road_code),
        }
        this.props.stationInfoStore.getRoadQuery(params);
    }

    onSearchClick = () => {
        const {road_code,page_num,page_size} = this.state;
        store= this.props.stationInfoStore;
        store.setRoadPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            road_code: isEmpty(road_code)?null:trim(road_code),
        }
        this.props.stationInfoStore.getRoadQuery(params);
    }

    onResetClick = () => {
        this.setState({
            page_num:1,
            page_size:5,
            road_code:'',
            selectedRowKeys:[]
        });
    }

    handleTableChange = (pagination) => {
        const {road_code,page_size} = this.state;
        const pager = {...this.props.stationInfoStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.stationInfoStore.setRoadPagination(pager);
        store.setRoadPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            road_code: isEmpty(road_code)?null:trim(road_code),
        }
        this.props.stationInfoStore.getRoadQuery(params);
    };

    onRoadCodeChange=(e)=>{
        this.setState({road_code:e.target.value});
    }

    onCancel=()=>{
        this.props.stationInfoStore.setIsShowRoadDialog(false);
    }

    onOk=()=>{
        const {roadList} = this.props.stationInfoStore;
        const {selectedRowKeys} = this.state;
        const key = selectedRowKeys[0];
        this.props.stationInfoStore.setRoadData(roadList[key])
        this.props.stationInfoStore.setIsShowRoadDialog(false);
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    selectRow = (record) => {
        const {selectedRowKeys} = this.state;
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1,record.key);
        } else {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1,record.key);
        }
        this.setState({ selectedRowKeys });
    }

    render(){
        const {isShowRoadDialog,roadList,roadPagination,isShowRoadLoading} = this.props.stationInfoStore;
        const {road_code,selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };
        return (
            <Modal title="道路选择"
                   okText="确认"
                   width={650}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowRoadDialog}>
                <div className="road-info-container">
                    <div className="road-info-top-container">
                        <Form className="road-info-form" layout="inline">
                            <Form.Item label="道路编号" className="road-info-form-item">
                                <Input size="small"
                                       value={road_code}
                                       style={{width: 100, margin: 0}}
                                       maxLength={100}
                                       onChange={this.onRoadCodeChange}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="road-info-button"
                                    onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="road-info-button"
                                    onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>
                    <div className="road-info-table-container">
                        <Table className='road-info-table'
                               // bordered={true}
                               rowSelection={rowSelection}
                               size="middle"
                               columns={columns}
                               loading={isShowRoadLoading}
                               dataSource={roadList}
                               onChange={this.handleTableChange}
                               pagination={roadPagination}
                               onRow={(record) => ({
                                   onClick: () => {
                                       this.selectRow(record);
                                   },
                               })}
                        >
                        </Table>
                    </div>
                </div>

            </Modal>
        )
    }
}

export default RoadDialog;
const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     key: 'id',
    //     align: 'center',
    // },
    {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        align: 'center'
    },
    {
        title: '道路名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
];

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
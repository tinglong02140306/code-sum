import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './TerminalAddDialog.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";

let store = null;
@inject("stationTerminalStore")
@observer
class StationSearchDialog extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:5,
            name: '',
            station_id: '',
            company_id: '',
            usage_status: '',
            selectedRowKeys:[]
        }
    }

    componentDidMount() {
        this.props.stationTerminalStore.getCompanyQuery();
        const {page_num,page_size,name,station_id,company_id,usage_status} = this.state;
        store= this.props.stationTerminalStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            name: isEmpty(name)?null:trim(name),
            station_id: isEmpty(station_id)?null:trim(station_id),
            company_id: isEmpty(company_id)?null:trim(company_id),
            usage_status: isEmpty(usage_status)?null:trim(usage_status),
        }
        this.props.stationTerminalStore.getStationQuery(params);
    }

    onSearchClick = () => {
        const {page_num,page_size,name,station_id,company_id,usage_status} = this.state;
        store= this.props.stationTerminalStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            name: isEmpty(name)?null:trim(name),
            station_id: isEmpty(station_id)?null:trim(station_id),
            company_id: isEmpty(company_id)?null:trim(company_id),
            usage_status: isEmpty(usage_status)?null:trim(usage_status),
        }
        this.props.stationTerminalStore.getStationQuery(params);
    }

    onResetClick = () => {
        this.setState({
            page_num:1,
            page_size:5,
            name: '',
            station_id: '',
            company_id: '',
            usage_status: '',
            selectedRowKeys:[]
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,name,station_id,company_id,usage_status} = this.state;
        const pager = {...this.props.stationTerminalStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.stationTerminalStore.setSearchPagination(pager);
        store.setSearchPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            name: isEmpty(name)?null:trim(name),
            station_id: isEmpty(station_id)?null:trim(station_id),
            company_id: isEmpty(company_id)?null:trim(company_id),
            usage_status: isEmpty(usage_status)?null:trim(usage_status),
        }
        this.props.stationTerminalStore.getStationQuery(params);
    };

    onChangeName = (e) => {
        this.setState({name: e.target.value});
    };

    onChangeStationId = (e) => {
        this.setState({station_id: e.target.value});
    };

    onChangeUsageStatus=(value)=>{
        this.setState({usage_status:value});
    };

    onChangeCompanyId=(value)=>{
        this.setState({company_id:value});
    };

    selectCompanyOption=()=>{
        const {companyList} = this.props.stationTerminalStore;
        if (companyList.length) {
            return companyList&&companyList.map((item,index)=>{
                if(!index){
                    return  [<Select.Option key={null} >无</Select.Option>,
                        <Select.Option key={item.id} >{item.name}</Select.Option>]
                }
                return <Select.Option key={item.id} >{item.name}</Select.Option>
            });
        }else {
            return <Select.Option key={null} >无</Select.Option>
        }
    };

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

    onCancel=()=>{
        this.props.stationTerminalStore.setIsShowSearchDialog(false);
    }

    onOk=()=>{
        const {stationList,typeModal} = this.props.stationTerminalStore;
        const {selectedRowKeys} = this.state;
        const key = selectedRowKeys[0];
        if (typeModal === 3){
            this.props.stationTerminalStore.setSearchData(stationList[key]);
        } else {
            this.props.stationTerminalStore.setOperationData(stationList[key]);
        }
        this.props.stationTerminalStore.setIsShowSearchDialog(false);
    }

    render() {
        const {isShowSearchLoading,searchPagination,stationList,isShowSearchDialog} = this.props.stationTerminalStore;
        const {name,station_id,company_id,usage_status,selectedRowKeys} = this.state;
        store = this.props.stationTerminalStore;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };
        return (
            <Modal title="油站选择"
                   okText="确认"
                   width={950}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowSearchDialog}>
                <div className="station-info-container">
                    <div className="station-info-top-container">
                        <Form className="station-info-form" layout="inline">
                            <Form.Item label="简称" className="station-info-form-item">
                                <Input size="small"
                                       value={name}
                                       style={{width: 100, margin: 0}}
                                       maxLength={100}
                                       onChange={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="编号" className="station-info-form-item">
                                <Input size="small"
                                       value={station_id}
                                       style={{width: 100, margin: 0}}
                                       maxLength={20}
                                       onChange={this.onChangeStationId}/>
                            </Form.Item>
                            <Form.Item label="合作伙伴" className="station-info-form-item">
                                <Select className="station-info-item-input"
                                        size="small"
                                        value={company_id}
                                        style={{width: 100, margin: 0}}
                                        onChange={this.onChangeCompanyId}>
                                    {this.selectCompanyOption()}
                                </Select>
                            </Form.Item>
                            <Form.Item label="使用状态" className="station-info-form-item">
                                <Select className="station-info-item-input"
                                        size="small"
                                        value={usage_status}
                                        style={{width: 100, margin: 0}}
                                        onChange={this.onChangeUsageStatus}>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="0">正常</Select.Option>
                                    <Select.Option value="1">停用</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="station-info-button"
                                    onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="station-info-button"
                                    onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>
                    <div className="station-info-table-container">
                        <Table className='station-info-table'
                               bordered={true}
                               size="middle"
                               columns={columns}
                               loading={isShowSearchLoading}
                               dataSource={stationList}
                               rowSelection={rowSelection}
                               onChange={this.handleTableChange}
                               pagination={searchPagination}
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

        );
    }
}

export default StationSearchDialog;

const columns = [
    {
        title: '编号',
        dataIndex: 'station_id',
        key: 'station_id',
        align: 'center'
    },
    // {
    //     title: '全称',
    //     dataIndex: 'full_name',
    //     key: 'full_name',
    //     align: 'center',
    // },
    {
        title: '简称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    // {
    //     title: '品牌名称',
    //     dataIndex: 'brand_name',
    //     key: 'brand_name',
    //     align: 'center',
    // },
    // {
    //     title: '支持油号',
    //     dataIndex: 'oil_no',
    //     key: 'oil_no',
    //     align: 'center',
    // },
    {
        title: '合作伙伴',
        dataIndex: 'company_name',
        key: 'company_name',
        align: 'center',
    },
    {
        title: '使用状态',
        dataIndex: 'usage_status',
        key: 'usage_status',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record==="0") {
                status = "正常";
            } else{
                status = "停用";
            }
            return (<p style={optionStyle.container}>{status}</p>);
        },
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
import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './DiscountStation.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import StationSearchDialog from "../component/StationSearchDialog";
import DiscountStationDialog from "../component/DiscountStationDialog";
import DiscountResultDialog from "../component/DiscountResultDialog";
import {trim} from "../../../utils/trim";

let store = null;
@inject("discountStationStore")
@observer
class DiscountStation extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            discount_id:'',
            station_id:'',
        }
    }

    componentDidMount() {
        this.props.discountStationStore.getDiscountQuery(1,0);
        this.props.discountStationStore.getBrandQuery(null, null);
        const {page_num,page_size,discount_id} = this.state;
        store= this.props.discountStationStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            discount_id:isEmpty(discount_id)?null:trim(discount_id),
        }
        this.props.discountStationStore.getDiscountStationQuery(params);
    }

    componentWillUnmount() {
        if (this.props.discountStationStore.searchData){
            this.props.discountStationStore.setSearchData(null);
    }
}

onSearchClick = () => {
    const {page_num,page_size,discount_id} = this.state;
    store= this.props.discountStationStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            discount_id:isEmpty(discount_id)?null:trim(discount_id),
        }
        this.props.discountStationStore.getDiscountStationQuery(params);
    }

    onResetClick = () => {
        this.props.discountStationStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_id: '',
            discount_id:'',
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,discount_id} = this.state;
        const {searchData} = store;
        const pager = {...this.props.discountStationStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        store.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id,
            discount_id:isEmpty(discount_id)?null:trim(discount_id),
        }
        this.props.discountStationStore.getDiscountStationQuery(params);
    };

    onChangeName = (e) => {
        this.props.discountStationStore.setTypeModal(3);
        this.props.discountStationStore.setIsShowSearchDialog(true);
    };

    addStation = () =>{
        if (this.props.discountStationStore.searchData){
            this.props.discountStationStore.setSearchData(null);
        }
        this.props.discountStationStore.setIsShowDialog(true);
        this.props.discountStationStore.setTypeModal(0)
    };

    onChangeDiscountId = (value) => {
        this.setState({discount_id: value});
    }
    header = () => {
        return <div>
            <Button type="primary" onClick={this.addStation}>油站关联添加</Button>
        </div>
    }

    render() {
        const {discount_id} = this.state;
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,isShowResultDialog,searchData,discountDataList} = this.props.discountStationStore;
        store = this.props.discountStationStore;
        return (
            <div className="station-terminal-container">
                <div className="station-terminal-top-container">
                    <div className="station-terminal-top-form">
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="油站名称" className="station-terminal-form-item">
                                <Input size="small"
                                       type="button"
                                       value={searchData?searchData.name:""}
                                       style={{width: 200, marginTop: 8,alignItems:"left"}}
                                       onClick={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="折扣名称" className="station-terminal-form-item">
                                <Select style={{width: 200}}
                                        onChange={this.onChangeDiscountId}
                                        size="small"
                                        value={discount_id}>
                                    {discountDataList !== null ? discountDataList.map((number) =>
                                        <Select.Option value={number.id}
                                                       key={number.id}>{number.name}</Select.Option>
                                    ) : ""}
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="station-terminal-button" onClick={this.onSearchClick}>查询</Button>
                            <Button type="primary" size="small" className="station-terminal-button" onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>

                </div>
                <div className="station-terminal-table-container">
                    <Table className='station-terminal-table'
                           bordered={true}
                           size="small"
                           title={this.header}
                           columns={columns}
                           loading={isShowLoading}
                           dataSource={dataList}
                           onChange={this.handleTableChange}
                           pagination={pagination}
                    >
                    </Table>
                </div>
                {isShowDialog?<DiscountStationDialog/>:null}
                {isShowSearchDialog?<StationSearchDialog/>:null}
                {isShowResultDialog?<DiscountResultDialog/>:null}
            </div>

        );
    }
}

export default DiscountStation;

const columns = [
    // {
    //     title: '油站ID',
    //     dataIndex: 'station_id',
    //     key: 'station_id',
    //     align: 'center'
    // },
    {
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center'
    },
    // {
    //     title: '折扣ID',
    //     dataIndex: 'discount_id',
    //     key: 'discount_id',
    //     align: 'center',
    // },
    {
        title: '折扣名称',
        dataIndex: 'discount_name',
        key: 'discount_name',
        align: 'center',
    },{
        title: '创建时间',
        dataIndex: 'gmt_create',
        key: 'gmt_create',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <Popconfirm
                    title="确定删除该油站关联吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteDiscountStation(record.id)
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
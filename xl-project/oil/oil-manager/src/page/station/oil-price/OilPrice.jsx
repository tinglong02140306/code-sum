import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './OilPrice.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";
import StationSearchDialog from "../../../component/station/station-oil-price/StationSearchDialog";
import PriceAddDialog from "../../../component/station/station-oil-price/PriceAddDialog";

let store = null;
@inject("stationPriceStore")
@observer
class StationOilPrice extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        store= this.props.stationPriceStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationPriceStore.getOilPriceQuery(params);
    }

    componentWillUnmount() {
        if (this.props.stationPriceStore.searchData){
            this.props.stationPriceStore.setSearchData(null);
        }
    }

    onSearchClick = () => {
        const {page_num,page_size} = this.state;
        store= this.props.stationPriceStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationPriceStore.getOilPriceQuery(params);
    }

    onResetClick = () => {
        this.props.stationPriceStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_pk: '',
        });
        const params = {
            page_num:1,
            page_size:10,
            station_pk: '',
        }
        this.props.stationPriceStore.getOilPriceQuery(params);
    }

    handleTableChange = (pagination) => {
        const {page_size} = this.state;
        const {searchData} = store;
        const pager = {...this.props.stationPriceStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.stationPriceStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationPriceStore.getOilPriceQuery(params);
    };

    onChangeName = () => {
        this.props.stationPriceStore.setTypeModal(3)
        this.props.stationPriceStore.setIsShowSearchDialog(true);
    };

    addStation = () =>{
        this.props.stationPriceStore.setIsShowDialog(true);
        this.props.stationPriceStore.setTypeModal(0)
    };
    header = () => {
        return <div style={{display:"flex",flexDirection:"row"}}>
            <Button type="primary" onClick={this.addStation}>添加油价信息</Button>
            {/*<div style={{paddingLeft:10,paddingTop:5, color:"red",fontSize:16}}>油价信息修改后，《附近加油站》中数据不会立即生效，请前往『缓存管理』，重置【油价缓存】【油站信息缓存】使其生效。</div>*/}
        </div>
    }

    render() {
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,searchData} = this.props.stationPriceStore;
        store = this.props.stationPriceStore;
        return (
            <div className="station-price-container">
                <div className="station-price-top-container">
                    <Form className="station-price-form" layout="inline">

                        <Form.Item label="油站名称" className="station-price-form-item">
                            <Input size="small"
                                   type="button"
                                   value={searchData?searchData.name:""}
                                   style={{width: 200, marginTop: 7}}
                                   onClick={this.onChangeName}/>
                        </Form.Item>
                        {/*<Button type="primary" htmlType="submit" size="small" className="station-price-button"*/}
                                {/*onClick={this.onSearchClick}>查询</Button>*/}
                        <Button type="primary" size="small" className="station-price-button"
                                onClick={this.onResetClick}>重置</Button>
                    </Form>
                </div>
                <div className="station-price-table-container">
                    <Table className='station-price-table'
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
                {isShowDialog?<PriceAddDialog/>:null}
                {isShowSearchDialog?<StationSearchDialog/>:null}
            </div>

        );
    }
}

export default StationOilPrice;

const columns = [
    {
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center'
    },
    {
        title: '油品编号',
        dataIndex: 'xl_oil_code',
        key: 'xl_oil_code',
        align: 'center'
    },{
        title: '油品全称',
        dataIndex: 'oil_full_name',
        key: 'oil_full_name',
        align: 'center'
    }, {
        title: '油价',
        dataIndex: 'oil_price',
        key: 'oil_price',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                    store.setStationPriceObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定删除该条数据吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deletePrice(record.id)
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
import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './OilGun.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import StationSearchDialog from "../../../component/station/oil-gun/StationSearchDialog";

let store = null;
@inject("stationGunStore")
@observer
class StationOilGun extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        store= this.props.stationGunStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationGunStore.getOilGunQuery(params);
    }

    componentWillUnmount() {
        if (this.props.stationGunStore.searchData){
            this.props.stationGunStore.setSearchData(null);
        }
    }

    onSearchClick = () => {
        const {page_num,page_size} = this.state;
        store= this.props.stationGunStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationGunStore.getOilGunQuery(params);
    }

    onResetClick = () => {
        this.props.stationGunStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_id: '',
        });
        const params = {
            page_num:1,
            page_size:10,
            station_id: '',
        }
        this.props.stationGunStore.getOilGunQuery(params);
    }

    handleTableChange = (pagination) => {
        const {page_size} = this.state;
        const {searchData} = store;
        const pager = {...this.props.stationGunStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.stationGunStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_id: isEmpty(searchData)?null:searchData.id
        }
        this.props.stationGunStore.getOilGunQuery(params);
    };

    onChangeName = () => {
        this.props.stationGunStore.setTypeModal(3)
        this.props.stationGunStore.setIsShowSearchDialog(true);
    };


    render() {
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,searchData} = this.props.stationGunStore;
        store = this.props.stationGunStore;
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
                           columns={columns}
                           loading={isShowLoading}
                           dataSource={dataList}
                           onChange={this.handleTableChange}
                           pagination={pagination}
                    >
                    </Table>
                </div>
                {isShowSearchDialog?<StationSearchDialog/>:null}
            </div>

        );
    }
}

export default StationOilGun;

const columns = [
    {
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center'
    },
    {
        title: '油枪号',
        dataIndex: 'gun_no',
        key: 'gun_no',
        align: 'center'
    },{
        title: '油品',
        dataIndex: 'oil_no',
        key: 'oil_no',
        align: 'center'
    }, {
        title: '油价',
        dataIndex: 'oil_price',
        key: 'oil_price',
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
import React, {Component} from 'react';
import {Table,Modal} from 'antd';
import './StationLookDialog.scss';
import {observer, inject} from 'mobx-react';

let store = null;
@inject("activityManageStore")
@observer
class StationSearchDialog extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            activity_id: '',
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        const {typeModal, activityObject} = this.props.activityManageStore;
        store= this.props.activityManageStore;
        store.setPageNum(page_num);
        const params = {
            activity_id: activityObject.id,
            page_num:page_num,
            page_size:page_size,
        }
        this.props.activityManageStore.getActivityStationQuery(params);
    }

    handleTableChange = (pagination) => {
        const {page_num,page_size} = this.state;
        const pager = {...this.props.activityManageStore.searchPagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.activityManageStore.setSearchPagination(pager);
        this.props.activityManageStore.setSearchPageNum(pager.current);
        const params = {
            activity_id: this.props.activityManageStore.activityObject.id,
            page_num:pager.current,
            page_size:page_size,
        }
        this.props.activityManageStore.getActivityStationQuery(params);
    };

    onCancel=()=>{
        this.props.activityManageStore.setIsShowActivityStationModal(false);
    };

    onOk=()=>{
        this.props.activityManageStore.setIsShowActivityStationModal(false);
    };


    render() {
        const {isShowSearchLoading,searchPagination,ActivityStationList,isShowActivityStationModal} = this.props.activityManageStore;
        store = this.props.stationPriceStore;
        return (
            <Modal title="活动油站"
                   okText="确认"
                   width={900}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   visible={isShowActivityStationModal}>
                <div className="search-info-look-container">
                    <div className="search-info-look-content">
                        <Table className='search-info-table'
                               bordered={true}
                               size="middle"
                               columns={columns}
                               loading={isShowSearchLoading}
                               dataSource={ActivityStationList}
                               onChange={this.handleTableChange}
                               pagination={searchPagination}
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
        title: '油站ID',
        dataIndex: 'station_id',
        key: 'station_id',
        align: 'center'
    },
    {
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
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
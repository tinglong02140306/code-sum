import React, {Component} from 'react';
import {Table,Icon} from 'antd';
import './OilPrice.scss';
import {observer, inject} from 'mobx-react';
import OilPriceDialog from '../../../component/shell/oil-price/OilPriceDialog'

let store = null;

let  page_num = 1;

@inject("oilPriceStore")
@observer
class OilPrice extends Component {

    componentDidMount() {
        this.props.oilPriceStore.setPageSize(18);
        store = this.props.groupStore;
        this.props.oilPriceStore.getOilPriceList(page_num,18);
    }

    handleTableChange = (pagination) => {
        const {pageSize} = this.props.oilPriceStore;
        this.props.oilPriceStore.getOilPriceList(pagination.current,pageSize);
    };

    render() {
        const {isShowLoading,pagination,oilPriceList,isShowDialog} = this.props.oilPriceStore;
        store = this.props.oilPriceStore;

        return (
            <div className="oil-price-table-container">
                <Table className='oil-price-table'
                       bordered={true}
                       size="small"
                       columns={columns}
                       loading={isShowLoading}
                       dataSource={oilPriceList}
                       onChange={this.handleTableChange}
                       scroll={{x: '110%'}}
                       pagination={pagination}>
                </Table>
                {isShowDialog?<OilPriceDialog/>:null}
            </div>

            );
    }
}

export default OilPrice;
const columns = [
    {
        title: '省名称',
        dataIndex: 'province_name',
        key: 'province_name',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 45,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },{
        title: '89号汽油',
        dataIndex: 'no_eighty_nine_gasoline',
        key: 'no_eighty_nine_gasoline',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '92号汽油',
        dataIndex: 'no_ninety_two_gasoline',
        key: 'no_ninety_two_gasoline',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0,
            }}>{record}</p>);
        },
    },
    {
        title: '95号汽油',
        dataIndex: 'no_ninety_five_gasoline',
        key: 'no_ninety_five_gasoline',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '0号柴油',
        dataIndex: 'no_zero_diesel_oil',
        key: 'no_zero_diesel_oil',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '98号汽油',
        dataIndex: 'no_ninety_eight_gasoline',
        key: 'no_ninety_eight_gasoline',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '1号柴油',
        dataIndex: 'no_one_diesel_oil',
        key: 'no_one_diesel_oil',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: 'E92号汽油',
        dataIndex: 'no_e_ninety_two_gasoline',
        key: 'no_e_ninety_two_gasoline',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 95,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '2号柴油',
        dataIndex: 'no_two_diesel_oil',
        key: 'no_two_diesel_oil',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 80,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '修改时间',
        dataIndex: 'modify_time',
        key: 'modify_time',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 90,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
        },
    },
    {
        title: '操作',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        render: (record) => {
            return (<div
                style={{
                    minWidth: 60,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                }}
                onClick={() => {
                    store.setIsShowDialog(true);
                    store.setOilPriceObject(record);
                }}
            ><a><Icon type="edit" style={{marginRight: 2, color: '#1890ff'}}/>修改</a></div>);
        },
    },
];
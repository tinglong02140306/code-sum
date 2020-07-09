import React from 'react';
import {Table, Button, Popconfirm, Icon} from 'antd';
import {observer, inject} from 'mobx-react';
import './Brand.scss';
import BrandDialog from "../../../component/station/brand/BrandDialog";
import {isEmpty} from "../../../utils/isEmpty";

let store = null;
@inject("brandStore")
@observer
class Brand extends React.Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        store= this.props.brandStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        this.props.brandStore.getBrandQuery(params);
    }

    addBrand = () =>{
        this.props.brandStore.setIsShowDialog(true);
        this.props.brandStore.setTypeModal(0)
    }

    header = () => {
        return <div>
            <Button type="primary" onClick={this.addBrand}>增加品牌</Button>
        </div>
    };

    handleTableChange = (pagination) => {
        const {page_size} = this.state;
        const pager = {...this.props.brandStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.brandStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
        }
        this.props.brandStore.getBrandQuery(params);
    };

    render() {
        const {isShowLoading,pagination,dataList,isShowDialog} = this.props.brandStore;
        store = this.props.brandStore;
        return (
            <div className="company-table-container">
                <Table className='company-table'
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
                {isShowDialog?<BrandDialog/>:null}
            </div>
        );
    }
}

export default Brand;
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '品牌代码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
    },
    {
        title: '品牌logo',
        dataIndex: 'logo_url',
        key: 'logo_url',
        align: 'center',
        render: (record) => {
            return (
                <div style={optionStyle.container}
                    onClick={() => {
                        {isEmpty(record) ?[]
                            : [store.setImageUrl(record)]}}
                    }>
                    <img style={{width:30,height:30,display:record?'flex':'none'}} alt="图片" src={record}></img>
                </div>
            );
        },
    },
    {
        title: '地图图标',
        dataIndex: 'map_icon_url',
        key: 'map_icon_url',
        align: 'center',
        render: (record) => {
            return (
                <div style={optionStyle.container}
                    onClick={() => {
                        {isEmpty(record) ?[]
                            : [store.setImageUrl(record)]}}
                    }>
                    <img style={{width:30,height:30,display:record?'flex':'none'}} alt="图片" src={record}></img>
                </div>
            );
        },
    },

    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                store.setBrandObject(record);
                store.setIsShowDialog(true);
                store.setTypeModal(2)
                }}>
                <Icon type="eye-o" style={{color: "#379b7f"}}/>
                <p style={optionStyle.see}>查看</p>
                </div>
                <div style={optionStyle.item} onClick={() => {
                    store.setBrandObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定删除该条数据么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteBrand(record.id)
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
import React from 'react';
import {Table, Button, Popconfirm, Icon} from 'antd';
import {observer, inject} from 'mobx-react';
import DiscountDialog from '../component/DiscountDialog'
import './Discount.scss';

let store = null;
@inject("discountStore")
@observer
class Discount extends React.Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        store= this.props.discountStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        this.props.discountStore.getDiscountQuery(params);
    }

    handleTableChange = (pagination) => {
        const {page_size} = this.state;
        const pager = {...this.props.discountStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.discountStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
        }
        this.props.discountStore.getDiscountQuery(params);
    };

    addCompany = () =>{
        this.props.discountStore.setIsShowDialog(true);
        this.props.discountStore.setTypeModal(0)
    }
    header = () => {
        return <div>
            <Button type="primary" onClick={this.addCompany}>折扣添加</Button>
        </div>
    }

    render() {
        const {isShowLoading,pagination,discountDataList,isShowDialog} = this.props.discountStore;
        store = this.props.discountStore;
        return (
            <div className="discount-table-container">
                <Table className='discount-table'
                       bordered={true}
                       size="small"
                       title={this.header}
                       columns={columns}
                       loading={isShowLoading}
                       dataSource={discountDataList}
                       onChange={this.handleTableChange}
                       pagination={pagination}
                >
                </Table>
                {isShowDialog?<DiscountDialog/>:null}
            </div>
        );
    }
}

export default Discount;
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '折扣率',
        dataIndex: 'discount_rate',
        key: 'discount_rate',
        align: 'center',
    },
    {
        title: '触发金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
    },
    // {
    //     title: '出资方',
    //     dataIndex: 'investor',
    //     key: 'investor',
    //     align: 'center',
    //     render: (record) => {
    //         let status = '';
    //         if (record === 1) {
    //             status = '信联';
    //         } else if(record === 2){
    //             status = '油站';
    //         } else {
    //             status = '--';
    //         }
    //         return (<p style={{
    //             minWidth: 60,
    //             overflow: "hidden",
    //             whiteSpace: "nowrap",
    //             textOverflow: "ellipsis",
    //             padding: 0,
    //             margin: 0
    //         }}>{status}</p>);
    //     }
    // },
    {
        title: '状态',
        dataIndex: 'flag',
        key: 'flag',
        align: 'center',
        render: (record) => {
            let status = '';
            if (record === true) {
                status = '启用';
            } else if(record === false){
                status = '停用';
            } else {
                status = '--';
            }
            return (<p style={{
                minWidth: 60,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{status}</p>);
        },
    },
    {
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
                {record.flag === true? <Popconfirm
                    title="确定要停用么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.statusChange(record.id,false)
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="lock" style={{color: "#b27fd2"}}/>
                        <p style={optionStyle.stop}>停用</p>
                    </div>
                </Popconfirm>: <Popconfirm
                    title="确定要启用么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                    store.statusChange(record.id,true)
                }}>
                    <div style={optionStyle.item}>
                    <Icon type="alert" style={{color: "#379b7f"}}/>
                    <p style={optionStyle.see}>启用</p>
                    </div>
                    </Popconfirm>}
                <div style={optionStyle.item} onClick={() => {
                    store.setDiscountObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定删除该条数据么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteDiscount(record.id)
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
    stop: {
        margin: 2,
        color: "#b27fd2"
    },
    text:{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0,
    }
}
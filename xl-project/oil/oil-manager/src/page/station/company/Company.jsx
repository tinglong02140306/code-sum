import React from 'react';
import {Table, Button, Popconfirm, Icon} from 'antd';
import {observer, inject} from 'mobx-react';
import CompanyDialog from '../../../component/station/company/ComanyDialog'
import './Company.scss';

let store = null;
@inject("companyStore")
@observer
class Company extends React.Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
        }
    }

    componentDidMount() {
        const {page_num,page_size} = this.state;
        store= this.props.companyStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        this.props.companyStore.getCompanyQuery(params);
    }

    handleTableChange = (pagination) => {
        const {page_size} = this.state;
        const pager = {...this.props.companyStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.companyStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
        }
        this.props.companyStore.getCompanyQuery(params);
    };

    addCompany = () =>{
        this.props.companyStore.setIsShowDialog(true);
        this.props.companyStore.setTypeModal(0)
    }
    header = () => {
        return <div>
            <Button type="primary" onClick={this.addCompany}>添加合作伙伴</Button>
        </div>
    }

    render() {
        const {isShowLoading,pagination,dataList,isShowDialog} = this.props.companyStore;
        store = this.props.companyStore;
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
                {isShowDialog?<CompanyDialog/>:null}
            </div>
        );
    }
}

export default Company;
const columns = [
    {
        title: '编号',
        dataIndex: 'company_id',
        key: 'company_id',
        align: 'center',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
    },
    {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
        align: 'center',
    },
    {
        title: '联系电话',
        dataIndex: 'contact_phone',
        key: 'contact_phone',
        align: 'center',
    },
    {
        title: '信联商户号',
        dataIndex: 'xl_merchant_id',
        key: 'xl_merchant_id',
        align: 'center',
    },
    {
        title: 'appId',
        dataIndex: 'app_id',
        key: 'app_id',
        align: 'center',
    },
    {
        title: '密钥',
        dataIndex: 'secret_key',
        key: 'secret_key',
        align: 'center',
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                store.setCompanyObject(record);
                store.setIsShowDialog(true);
                store.setTypeModal(2)
                }}>
                <Icon type="eye-o" style={{color: "#379b7f"}}/>
                <p style={optionStyle.see}>查看</p>
                </div>
                <div style={optionStyle.item} onClick={() => {
                    store.setCompanyObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定删除该条数据么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteCompany(record.id)
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
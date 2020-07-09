import React, {Component} from 'react';
import {Table,Icon,Button} from 'antd';
import './fee-import.scss';
import {observer, inject} from 'mobx-react';
import FeeImportDialog from '../../../component/report/fee-import/FeeImportDialog'
import ImportResultDialog from '../../../component/report/fee-import/ImportResultDialog'

let store = null;
let  page_num = 1;

@inject("feeImportStore")
@observer
class FeeImport extends Component {

    componentDidMount() {
        this.props.feeImportStore.setPageSize(18);
        store = this.props.groupStore;
        this.props.feeImportStore.getFeeList(page_num,18);
    }

    handleTableChange = (pagination) => {
        const {pageSize} = this.props.feeImportStore;
        this.props.feeImportStore.getFeeList(pagination.current,pageSize);
    };
    /**
     * 上传通道手续费文件
     */
    importFee=()=>{
        // this.props.feeImportStore.setIsShowImportDialog(true);

        this.props.feeImportStore.getCurrentXLSX();
    }
    header = () => {
        return <div>
            <Button type="primary" onClick={this.importFee}>上传文件</Button>
        </div>
    }

    render() {
        const {isShowLoading,pagination,feeList,isShowImportDialog,isShowImportResuleDialog} = this.props.feeImportStore;
        store = this.props.feeImportStore;

        return (
            <div className="oil-price-table-container">
                <Table className='oil-price-table'
                       bordered={true}
                       size="small"
                       title={this.header}
                       columns={columns}
                       loading={isShowLoading}
                       dataSource={feeList}
                       onChange={this.handleTableChange}
                       pagination={pagination}>
                </Table>
                {isShowImportDialog?<FeeImportDialog/>:null}
                {isShowImportResuleDialog?<ImportResultDialog/>:null}
            </div>

        );
    }
}

export default FeeImport;
const columns = [
    {
        title: '日期',
        dataIndex: 'import_time',
        key: 'import_time',
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
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
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
        title: '产品类型',
        dataIndex: 'product_type',
        key: 'product_type',
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
        title: '通道手续费',
        dataIndex: 'fee',
        key: 'fee',
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
];
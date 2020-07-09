import React from 'react';
import "./EtcGold.scss";
import {Table, Input, Button, Icon, Popconfirm, Form,Select,Tooltip,Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import GoldImportDialog from "../../../component/accountdialog/etc-gold/GoldImportDialog";
import ImportResultDialog from '../../../component/accountdialog/etc-gold/ImportResultDialog';

let store = null;
let page_num = 1;

@inject("goldStore")
@observer
class EtcGold extends React.Component {

    constructor() {
        super();
        this.state = {
            isLeadLoading:false,
        }
    }

    componentDidMount() {
        this.props.goldStore.setPageSize(15);
        store = this.props.goldStore;
        this.props.goldStore.getAccountList(page_num, 18);
    }

    handleTableChange = (pagination) => {
        const {page_size} = this.props.goldStore;
        const pager = {...this.props.goldStore.pagination};
        pager.current = pagination.current;
        page_num = pager.current;
        this.props.goldStore.setCurrentPage(page_num);
        this.props.goldStore.setPagination(pager);
        this.props.goldStore.getAccountList(page_num, page_size);
    }


    /**
     * 导入加油金
     */
    onEngineLeadChange=()=>{
        this.props.goldStore.getCurrentEngineXLSX();

        // this.props.goldStore.setIsShowEngineDialog(true);

    }


    header = () => {
        return <div className="gold-table-header">
            <div className="gold-table-header-left">
                <Button type="primary" onClick={this.onEngineLeadChange} className="gold-table-header-button">导入加油金</Button>
            </div>
        </div>
    }

    render() {
        const {isShowLoading, accountList, pagination,isShowEngineDialog,isShowLeadResuleDialog} = this.props.goldStore;
        return <div className="gold-container">
            <Table className="gold-table"
                   columns={columns}
                   bordered={true}
                   loading={isShowLoading}
                   title={this.header}
                   size="small"
                   pagination={pagination}
                   onChange={this.handleTableChange}
                   dataSource={accountList}/>
            {isShowEngineDialog?<GoldImportDialog/>:null}
            {isShowLeadResuleDialog?<ImportResultDialog/>:null}
        </div>
    }
}

export default EtcGold;


const columns = [
    {
        title: '订单号',
        dataIndex: 'order_no',
        key: 'order_no',
        align: 'center'
    }, {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
    },  {
        title: '资金流向',
        dataIndex: 'flow_type',
        key: 'flow_type',
        align: 'center',
        render: (record) => {
            let flow_type = "";
            if (record === "0") {
                flow_type = "入账";
            } else if (record === "1") {
                flow_type = "出账";
            }else {
                flow_type = "其他";
            }
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{flow_type}</p>);
        },
    }, {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        align: 'center'
    }, {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center'
    },];
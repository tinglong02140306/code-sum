import React from 'react';
import "./EtcBlacklist.scss";
import {Table, Input, Button, Icon, Popconfirm, Form,Select,Tooltip,Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import BlacklistDialog from '../../../component/wxapplet/etc-blacklist/BlacklistDialog';
import BlacklistImportDialog from "../../../component/wxapplet/etc-blacklist/BlacklistImportDialog";
import ImportResultDialog from '../../../component/wxapplet/etc-blacklist/ImportResultDialog';

let store = null;
let page_num = 1;

@inject("blacklistStore")
@observer
class EtcBlacklist extends React.Component {

    constructor() {
        super();
        this.state = {
            etc_card_no:'',
            plate_no:'',
            isLeadLoading:false,
        }
    }

    componentDidMount() {
        const {etc_card_no,plate_no} = this.state;
        this.props.blacklistStore.setPageSize(15);
        store = this.props.blacklistStore;
        this.props.blacklistStore.getBlacklist(page_num, 18, etc_card_no,plate_no);
    }


    handleTableChange = (pagination) => {
        const {etc_card_no,plate_no} = this.state;
        const {page_size} = this.props.blacklistStore;
        const pager = {...this.props.blacklistStore.pagination};
        pager.current = pagination.current;
        page_num = pager.current;
        this.props.blacklistStore.setCurrentPage(page_num);
        this.props.blacklistStore.setPagination(pager);
        this.props.blacklistStore.getBlacklist(page_num, page_size, etc_card_no,plate_no);
    }
    /**
     * 车牌号*/
    onChangePlateNo = (e) => {
        this.setState({plate_no: e.target.value});
    }
    /**
     * etc卡号*/
    onChangeEtcCardNo = (e) => {
        this.setState({etc_card_no: e.target.value});
    }

    onSearchClick = () => {
        const {etc_card_no,plate_no} = this.state;
        const {page_size} = this.props.blacklistStore;
        this.props.blacklistStore.getBlacklist(1, page_size, etc_card_no,plate_no);
    }

    onResetClick = () => {
        this.setState({
            etc_card_no:'',
            plate_no:''
        });
    }
    /**
     *黑名单录入
     */
    onBlacklistAdd = () => {
        this.props.blacklistStore.setTypeDialog(0);
        this.props.blacklistStore.setDialogData(null);
        this.props.blacklistStore.setIsShowDialog(true);
    }

    /**
     * 黑名单上传
     */
    onEngineLeadChange=()=>{
        // this.props.blacklistStore.getCurrentEngineXLSX();
        this.props.blacklistStore.setIsShowEngineDialog(true);

    }


    header = () => {
        return <div className="blacklist-table-header">
            <div className="blacklist-table-header-left">
                <Button type="primary" onClick={this.onBlacklistAdd} className="blacklist-table-header-button">录入黑名单</Button>
                <Button type="primary" onClick={this.onEngineLeadChange} className="blacklist-table-header-button">上传黑名单</Button>
            </div>
        </div>
    }

    render() {
        const {isShowLoading, blacklistList, isShowDialog, pagination,isShowBatchDialog,isShowEngineDialog,isShowLeadResuleDialog} = this.props.blacklistStore;
        const {etc_card_no, plate_no} = this.state;
        return <div className="blacklist-container">
            {<div className="blacklist-top-container">
                <Form className="blacklist-form" layout="inline">
                    <Form.Item label="ETC卡号" className="blacklist-form-item">
                        <Input size="small"
                               value={etc_card_no}
                               style={{width: 150, margin: 0}}
                               maxLength={20}
                               onChange={this.onChangeEtcCardNo}/>
                    </Form.Item>
                    <Form.Item label="车牌号" className="blacklist-form-item">
                        <Input size="small"
                               value={plate_no}
                               style={{width: 150, margin: 0}}
                               maxLength={8}
                               onChange={this.onChangePlateNo}/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="small" className="blacklist-button"
                            onClick={this.onSearchClick}>查询</Button>
                    <Button type="primary" size="small" className="blacklist-button"
                            onClick={this.onResetClick}>重置</Button>
                </Form>
            </div>}
            <Table className="blacklist-table"
                   columns={columns}
                   bordered={true}
                   loading={isShowLoading}
                   title={this.header}
                   size="small"
                   pagination={pagination}
                   onChange={this.handleTableChange}
                   dataSource={blacklistList}/>
            {isShowDialog ? <BlacklistDialog/> : null}
            {isShowEngineDialog?<BlacklistImportDialog/>:null}
            {isShowLeadResuleDialog?<ImportResultDialog/>:null}
        </div>
    }
}

export default EtcBlacklist;


const columns = [
    {
        title: 'ETC卡号',
        dataIndex: 'etc_card_no',
        key: 'etc_card_no',
        align: 'center'
    }, {
        title: '车牌号',
        dataIndex: 'plate_no',
        key: 'plate_no',
        align: 'center',
    },  {
        title: '车牌颜色',
        dataIndex: 'plate_color',
        key: 'plate_color',
        align: 'center',
        render: (record) => {
            let plate_color = "";
            if (record === 0) {
                plate_color = "蓝色";
            } else if (record === 1) {
                plate_color = "黄色";
            }else if (record === 2) {
                plate_color = "黑色";
            }else if (record === 3) {
                plate_color = "白色";
            }else if (record === 4) {
                plate_color = "渐变绿";
            }else if (record === 5) {
                plate_color = "黄绿色";
            }else if (record === 6) {
                plate_color = "蓝白色";
            } else {
                plate_color = "其他";
            }
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{plate_color}</p>);
        },
    }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center'
    },  {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                    store.setDialogData(record);
                    store.setIsShowDialog(true);
                    store.setTypeDialog(2)
                }}>
                    <Icon type="eye-o" style={{color: "#379b7f"}}/>
                    <p style={optionStyle.see}>查看</p>
                </div>
                <div style={optionStyle.item} onClick={() => {
                    store.setDialogData(record);
                    store.setIsShowDialog(true);
                    store.setTypeDialog(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定要删除么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.getDeleteBlacklist(record.id)
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
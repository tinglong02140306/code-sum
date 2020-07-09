import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal} from 'antd';
import './StationTerminal.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import StationSearchDialog from "../../../component/station/terminal/StationSearchDialog";
import TerminalAddDialog from "../../../component/station/terminal/TerminalAddDialog";
import {trim} from "../../../utils/trim";

let store = null;
@inject("stationTerminalStore")
@observer
class StationTerminal extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            terminal_id:'',
            merchant_id:'',
            affiliation:'',
            extend_no:'',
            company_id:'',
            affiliation_str:null,
        }
    }

    componentDidMount() {
        this.props.stationTerminalStore.getCompanyQuery();

        const {page_num,page_size,terminal_id,merchant_id,affiliation_str,extend_no,company_id} = this.state;
        store= this.props.stationTerminalStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id,
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            merchant_id:isEmpty(merchant_id)?null:trim(merchant_id),
            extend_no:isEmpty(extend_no)?null:trim(extend_no),
            // affiliation:isEmpty(affiliation_str)?null:trim(affiliation_str),
            company_id:isEmpty(company_id)?null:trim(company_id),
        }
        this.props.stationTerminalStore.getStationTerminalQuery(params);
    }

    componentWillUnmount() {
        if (this.props.stationTerminalStore.searchData){
            this.props.stationTerminalStore.setSearchData(null);
        }
    }

    onSearchClick = () => {
        const {page_num, page_size, terminal_id, merchant_id, affiliation_str,extend_no,company_id} = this.state;
        store= this.props.stationTerminalStore;
        store.setPageNum(page_num);
        const {searchData} = store;
        const params = {
            page_num:page_num,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id,
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            merchant_id:isEmpty(merchant_id)?null:trim(merchant_id),
            extend_no:isEmpty(extend_no)?null:trim(extend_no),
            // affiliation:isEmpty(affiliation_str)?null:trim(affiliation_str),
            company_id:isEmpty(company_id)?null:trim(company_id),
        }
        this.props.stationTerminalStore.getStationTerminalQuery(params);
    }

    onResetClick = () => {
        this.props.stationTerminalStore.setSearchData(null);
        this.setState({
            page_num:1,
            page_size:10,
            station_pk: '',
            terminal_id:'',
            merchant_id:'',
            affiliation:'',
            extend_no:'',
            company_id:'',
            affiliation_str:null,
        });
    }

    handleTableChange = (pagination) => {
        const {page_size,terminal_id,merchant_id,affiliation_str,extend_no,company_id} = this.state;
        const {searchData} = store;
        const pager = {...this.props.stationTerminalStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        store.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            station_pk: isEmpty(searchData)?null:searchData.id,
            terminal_id:isEmpty(terminal_id)?null:trim(terminal_id),
            merchant_id:isEmpty(merchant_id)?null:trim(merchant_id),
            extend_no:isEmpty(extend_no)?null:trim(extend_no),
            // affiliation:isEmpty(affiliation_str)?null:trim(affiliation_str),
            company_id:isEmpty(company_id)?null:trim(company_id),
        }
        this.props.stationTerminalStore.getStationTerminalQuery(params);
    };

    onChangeName = (e) => {
        this.props.stationTerminalStore.setTypeModal(3);
        this.props.stationTerminalStore.setIsShowSearchDialog(true);
    };

    onChangeTerminalId = (e) => {
        this.setState({terminal_id: e.target.value});
    };

    onChangeMerchantId = (e) => {
        this.setState({merchant_id: e.target.value});
    };
    onChangeExtendNo = (e) => {
        this.setState({extend_no: e.target.value});
    };
    onChangeCompanyId=(value)=>{
        this.setState({company_id:value});
    };
    selectCompanyOption=()=>{
        const {companyList} = this.props.stationTerminalStore;
        if (companyList.length) {
            return companyList&&companyList.map((item,index)=>{
                if(!index){
                    return  [<Select.Option key={null} >无</Select.Option>,
                        <Select.Option key={item.id} >{item.name}</Select.Option>]
                }
                return <Select.Option key={item.id} >{item.name}</Select.Option>
            });
        }else {
            return <Select.Option key={null} >无</Select.Option>
        }
    };

    onChangeAffiliation=(value)=>{
        this.setState({affiliation:value});
        if (value === ''){
            this.setState({affiliation_str:null});
        }else if (value === '0'){
            this.setState({affiliation_str:'壳牌'});
        }else if (value === '1'){
            this.setState({affiliation_str:'油团团'});
        }else if (value === '2'){
            this.setState({affiliation_str:'智慧油客'});
        }
    };

    addStation = () =>{
        if (this.props.stationTerminalStore.searchData){
            this.props.stationTerminalStore.setSearchData(null);
        }
        this.props.stationTerminalStore.setIsShowDialog(true);
        this.props.stationTerminalStore.setTypeModal(0)
    };
    header = () => {
        return <div>
            <Button type="primary" onClick={this.addStation}>添加终端信息</Button>
        </div>
    }

    render() {
        const {extend_no,terminal_id,merchant_id,affiliation,company_id} = this.state;
        const {isShowLoading,pagination,dataList,isShowDialog,isShowSearchDialog,searchData} = this.props.stationTerminalStore;
        store = this.props.stationTerminalStore;
        return (
            <div className="station-terminal-container">
                <div className="station-terminal-top-container">
                    <div className="station-terminal-top-form">
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="油站名称" className="station-terminal-form-item">
                                <Input size="small"
                                       type="button"
                                       value={searchData?searchData.name:""}
                                       style={{width: 200, marginTop: 8,alignItems:"left"}}
                                       onClick={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="终端编号" className="station-terminal-form-item">
                                <Input size="small"
                                       value={terminal_id}
                                       style={{width: 150, margin: 0}}
                                       onChange={this.onChangeTerminalId}/>
                            </Form.Item>
                            <Form.Item label="商户编号" className="station-terminal-form-item">
                                <Input size="small"
                                       value={merchant_id}
                                       style={{width: 150, margin: 0}}
                                       onChange={this.onChangeMerchantId}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="small" className="station-terminal-button" onClick={this.onSearchClick}>查询</Button>
                        </Form>
                        <Form className="station-terminal-form" layout="inline">
                            <Form.Item label="外部编号" className="station-terminal-form-item">
                                <Input size="small"
                                       value={extend_no}
                                       style={{width: 200, margin: 0}}
                                       onChange={this.onChangeExtendNo}/>
                            </Form.Item>
                            <Form.Item label="合作伙伴" className="station-terminal-form-item">
                                <Select className="search-info-item-input"
                                        size="small"
                                        value={company_id}
                                        style={{width: 150, margin: 0}}
                                        onChange={this.onChangeCompanyId}>
                                    {this.selectCompanyOption()}
                                </Select>
                            </Form.Item>
                            <Form.Item label="归属" className="search-info-form-item" style={{visibility:'hidden'}}>
                                <Select className="search-info-item-input"
                                        size="small"
                                        value={affiliation}
                                        style={{width: 180, margin: 0}}
                                        onChange={this.onChangeAffiliation}>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="0">壳牌</Select.Option>
                                    <Select.Option value="1">油团团</Select.Option>
                                    <Select.Option value="2">智慧油客</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" size="small" className="station-terminal-button"
                                    onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>

                </div>
                <div className="station-terminal-table-container">
                    <Table className='station-terminal-table'
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
                {isShowDialog?<TerminalAddDialog/>:null}
                {isShowSearchDialog?<StationSearchDialog/>:null}
            </div>

        );
    }
}

export default StationTerminal;

const columns = [
    {
        title: '终端编号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center'
    },
    {
        title: '商户编号',
        dataIndex: 'merchant_id',
        key: 'merchant_id',
        align: 'center'
    }, {
        title: '商户名',
        dataIndex: 'merchant_name',
        key: 'merchant_name',
        align: 'center',
    },{
        title: '油站名称',
        dataIndex: 'station_name',
        key: 'station_name',
        align: 'center',
    },
    // {
    //     title: '归属',
    //     dataIndex: 'affiliation',
    //     key: 'affiliation',
    //     align: 'center',
    // },
    {
        title: '合作伙伴',
        dataIndex: 'company_name',
        key: 'company_name',
        align: 'center',
    },
    {
        title: '外部编号',
        dataIndex: 'extend_no',
        key: 'extend_no',
        align: 'center',
    },
    {
        title: '是否默认',
        dataIndex: 'defaulted',
        key: 'defaulted',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record) {
                status = "是";
            } else {
                status = "否";
            }
            return (<p style={{marginTop:10}}>{status}</p>);
        },
    },
    {
        title: '操作',
        key: 'options',
        align: 'center',
        render: (record) => {
            return <div style={optionStyle.container}>
                <div style={optionStyle.item} onClick={() => {
                    store.setStationTerminalObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改</p>
                </div>
                <Popconfirm
                    title="确定删除该条数据吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteStationTerminal(record.id)
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
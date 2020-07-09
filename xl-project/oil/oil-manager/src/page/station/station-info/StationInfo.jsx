import React, {Component} from 'react';
import {Table, Icon, Button, Form, Select, Input, Popconfirm, Tooltip,Cascader,Dropdown,Menu,message} from 'antd';
import './StationInfo.scss';
import {observer, inject} from 'mobx-react';
import StationInfoDialog from '../../../component/station/station-info/StationInfoDialog'
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";
import provence from "../../../constants/provence"
import PaymentDialog from "../../../component/station/station-info/PaymentDialog";
const options = provence;
let store = null;

@inject("stationInfoStore")
@observer
class StationInfo extends Component {

    constructor() {
        super();
        this.state = {
            page_num: 1,
            page_size: 10,
            name: '',
            station_id: '',
            company_id: '',
            usage_status: '',
            province_code: '',
            province_name: '',
            has_price: '',
            support_payment:'',
            selectedRowKeys: [],
            station_id_array: [],
            collapsed: true,
            selectedRowNum:0,
            dropDown: false,
        }
    }

    componentDidMount() {

        this.props.stationInfoStore.setPlainOptions([]);//支持油品清空
        this.props.stationInfoStore.getCompanyQuery();
        this.props.stationInfoStore.getBrandQuery();
        this.props.stationInfoStore.getOilDetailQuery();

        const {page_num, page_size, name, station_id, company_id, usage_status,brand_id,province_code,has_price,support_payment} = this.state;
        store = this.props.stationInfoStore;
        store.setPageNum(page_num);
        const params = {
            page_num: page_num,
            page_size: page_size,
            name: isEmpty(name) ? null : trim(name),
            station_id: isEmpty(station_id) ? null : trim(station_id),
            company_id: isEmpty(company_id) ? null : company_id==="null"?null: trim(company_id),
            brand_id: isEmpty(brand_id) ? null : brand_id==="null"?null: trim(brand_id),
            // company_id: isEmpty(company_id) ? null : trim(company_id),
            usage_status: isEmpty(usage_status) ? null : trim(usage_status),
            support_payment: isEmpty(support_payment) ? null : trim(support_payment),
            province_code: isEmpty(province_code) ? null : trim(province_code),
            has_price: has_price,
        }
        this.props.stationInfoStore.getStationQuery(params);
    }

    onSearchClick = () => {
        const {page_num, page_size, name, station_id, company_id, usage_status,brand_id,province_code,has_price,support_payment} = this.state;
        store = this.props.stationInfoStore;
        store.setPageNum(page_num);
        const params = {
            page_num: page_num,
            page_size: page_size,
            name: isEmpty(name) ? null : trim(name),
            station_id: isEmpty(station_id) ? null : trim(station_id),
            company_id: isEmpty(company_id) ? null : company_id==="null"?null: trim(company_id),
            brand_id: isEmpty(brand_id) ? null : brand_id==="null"?null: trim(brand_id),
            usage_status: isEmpty(usage_status) ? null : trim(usage_status),
            support_payment: isEmpty(support_payment) ? null : trim(support_payment),
            province_code: isEmpty(province_code) ? null : trim(province_code),
            has_price: has_price,
        }
        this.props.stationInfoStore.getStationQuery(params);
    }

    onResetClick = () => {
        this.setState({
            page_num: 1,
            page_size: 10,
            name: '',
            station_id: '',
            company_id: '',
            brand_id: '',
            usage_status: '',
            province_code: '',
            province_name: '',
            has_price: '',
            support_payment: '',
        });
    }

    onChangeCollapse = () => {
        this.setState({collapsed: !this.state.collapsed});
    }

    handleTableChange = (pagination) => {
        const {page_size, name, station_id, company_id, usage_status,brand_id,has_price,province_code,support_payment} = this.state;
        const pager = {...this.props.stationInfoStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num: pager.current});
        this.props.stationInfoStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num: pager.current,
            page_size: page_size,
            name: isEmpty(name) ? null : trim(name),
            station_id: isEmpty(station_id) ? null : trim(station_id),
            company_id: isEmpty(company_id) ? null : company_id==="null"?null: trim(company_id),
            brand_id: isEmpty(brand_id) ? null : brand_id==="null"?null: trim(brand_id),
            province_code: isEmpty(province_code) ? null : trim(province_code),
            usage_status: isEmpty(usage_status) ? null : trim(usage_status),
            support_payment: isEmpty(support_payment) ? null : trim(support_payment),
            has_price: has_price,
        }
        this.props.stationInfoStore.getStationQuery(params);
    };

    onChangeName = (e) => {
        this.setState({name: e.target.value});
    };

    onChangeStationId = (e) => {
        this.setState({station_id: e.target.value});
    };

    onChangeUsageStatus = (value) => {
        this.setState({usage_status: value});
    };

    onSupportPayment = (value) => {
        this.setState({support_payment: value});
    };

    onChangeCompanyId = (value) => {
        this.setState({company_id: value});
    };

    onChangeBrandId = (value) => {
        this.setState({brand_id: value});
    };

    selectCompanyOption = () => {
        const {companyList} = this.props.stationInfoStore;
        if (companyList.length) {
            return companyList && companyList.map((item, index) => {
                if (!index) {
                    return [<Select.Option key={null}>无</Select.Option>,
                        <Select.Option key={item.id.toString()}>{item.name}</Select.Option>]
                }
                return <Select.Option key={item.id.toString()}>{item.name}</Select.Option>
            });
        } else {
            return <Select.Option key={null}>无</Select.Option>
        }
    };

    selectbrandOption = () => {
        const {brandList} = this.props.stationInfoStore;
        if (brandList.length) {
            return brandList && brandList.map((item, index) => {
                if (!index) {
                    return [<Select.Option key={null}>无</Select.Option>,
                        <Select.Option key={item.id.toString()}>{item.name}</Select.Option>]
                }
                return <Select.Option key={item.id.toString()}>{item.name}</Select.Option>
            });
        } else {
            return <Select.Option key={null}>无</Select.Option>
        }
    };

    addStation = () => {
        this.props.stationInfoStore.setTypeModal(0);
        if (this.props.stationInfoStore.searchData){
            store.setSearchData(null);
        }
        this.props.stationInfoStore.setIsShowDialog(true);
    };
    dropChange = () => {
        let dropDown = this.state.dropDown;
       this.setState({
           dropDown:!dropDown
       })
    };
    payChange = (e) => {
        const {selectedRowNum,station_id_array} = this.state;
        if (this.state.selectedRowNum>0){
            this.setState({dropDown:false});
            this.props.stationInfoStore.setPayType(e,selectedRowNum,station_id_array);
            // this.props.stationInfoStore.setStationIdArray(station_id_array);
            this.props.stationInfoStore.setIsShowPayDialog(true);
        }else {
            message.info("未选择油站");
        }

    };
    header = () => {
        const {selectedRowNum,dropDown} = this.state;
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <a className='drop-down-items' onClick={this.payChange.bind(this,1)}>添加支付方式</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a className='drop-down-items' onClick={this.payChange.bind(this,2)}>移除支付方式</a>
                </Menu.Item>
            </Menu>
        );
        return <div className='station-table-title'>
            <Button className='station-pay-button' type="default" onClick={this.payChange.bind(this,1)}><div style={{color:'1890ff'}}>支付方式</div></Button>
            <div style={{paddingTop:5, color:"#7e7e7e",fontSize:15}}>已选择{selectedRowNum}个加油站</div>

            {/*<Dropdown overlay={menu}>*/}
            {/*    <Button className='station-pay-button' type="default" onClick={this.payChange.bind(this,1)}>*/}
            {/*        支付方式 <Icon type="down" style={{color: "#1890ff"}} />*/}
            {/*    </Button>*/}
            {/*</Dropdown>*/}
            {/*<div className='drop-down-box' style={{display:dropDown?'flex':'none'}}>*/}
            {/*    <Button className='drop-down-items' onClick={this.payChange.bind(this,1)}>添加支付方式</Button>*/}
            {/*    <Button className='drop-down-items' onClick={this.payChange.bind(this,2)}>移除支付方式</Button>*/}
            {/*</div>*/}
        </div>
    }

    onCascaderChange = (value, selectedOptions) => {
        if (selectedOptions.length) {
            this.setState({
                province_code: selectedOptions[0].code,
                province_name: selectedOptions[0].value,
            })
        }else {
            this.setState({
                province_code: '',
                province_name: '',
            })
        }
    };

    onChangeHasPrice=(value)=>{
        this.setState({has_price:value});
    }

    onSelectChange = (selectedRowKeys) => {
        let num = selectedRowKeys.length;
        const arr = [];
        const {dataList} = this.props.stationInfoStore;
        selectedRowKeys.map((item) => {
            dataList.map((item2) => {
                if (item == item2.key) {
                    arr.push(item2.id);
                }
            });
        });
        this.setState({
            selectedRowKeys,
            selectedRowNum:num,
            station_id_array:arr,
        });
    }
    selectRow = (record) => {
        // console.log('record',JSON.stringify(record))
        const {selectedRowKeys} = this.state;
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            // selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1,record.key);
        } else {
            selectedRowKeys.push(record.key);
        }

        let num = selectedRowKeys.length;
        const arr = [];
        const {dataList} = this.props.stationInfoStore;
        selectedRowKeys.map((item) => {
            dataList.map((item2) => {
                if (item == item2.key) {
                    arr.push(item2.id);
                }
            });
        });
        this.setState({
            selectedRowKeys,
            selectedRowNum:num,
            station_id_array:arr,
        });
    }

    render() {
        const {isShowLoading, pagination, dataList, isShowDialog,isShowPayDialog} = this.props.stationInfoStore;
        const {has_price,collapsed,name, station_id, company_id, usage_status,brand_id,province_code,province_name,selectedRowKeys,support_payment} = this.state;
        store = this.props.stationInfoStore;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="station-info-container">
                <div className="station-info-top-containers">
                    <div className="station-info-form-container">
                        <Form className="station-info-form" layout="inline">
                            <Form.Item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;简称" className="station-info-form-item">
                                <Input size="small"
                                       value={name}
                                       style={{width: 150, margin: 5}}
                                       maxLength={100}
                                       onChange={this.onChangeName}/>
                            </Form.Item>
                            <Form.Item label="编号" className="station-info-form-item">
                                <Input size="small"
                                       value={station_id}
                                       style={{width: 150, margin: 5}}
                                       maxLength={20}
                                       onChange={this.onChangeStationId}/>
                            </Form.Item>
                            {/*<Form.Item label="合作伙伴" className="station-info-form-item">*/}
                            {/*    <Select className="station-info-item-inputs"*/}
                            {/*            size="small"*/}
                            {/*            value={company_id}*/}
                            {/*            style={{width: 150, margin: 5}}*/}
                            {/*            onChange={this.onChangeCompanyId}>*/}
                            {/*        {this.selectCompanyOption()}*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="是否配置油价" className="station-info-form-item">
                                <Select className="station-info-item-inputs"
                                        size="small"
                                        value={has_price}
                                        style={{width: 150, margin: 0}}
                                        onChange={this.onChangeHasPrice}>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="false">否</Select.Option>
                                    <Select.Option value="true">是</Select.Option>
                                </Select>
                            </Form.Item>
                            {/*<div className="organization-more"></div>*/}
                            <Button type="primary" htmlType="submit" size="small" className="station-info-button"
                                    onClick={this.onSearchClick}>查询</Button>
                        </Form>
                    </div>
                    <div className="station-info-form-container">
                        <Form className="station-info-form" layout="inline">
                            <Form.Item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;品牌" className="station-info-form-item">
                                <Select className="station-info-item-inputs"
                                        size="small"
                                        value={brand_id}
                                        style={{width: 150, margin: 5}}
                                        onChange={this.onChangeBrandId}>
                                    {this.selectbrandOption()}
                                </Select>
                            </Form.Item>
                            <Form.Item label="省份" className="station-info-form-item">
                                <Cascader className="station-info-item-inputs"
                                          options={options}
                                          style={{width: 150, margin: 5}}
                                          size="small"
                                          onChange={this.onCascaderChange}
                                          placeholder="请选择"
                                          value={[province_name]}
                                />
                            </Form.Item>
                            <Form.Item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用状态" className="station-info-form-item">
                                <Select className="station-info-item-inputs"
                                        size="small"
                                        value={usage_status}
                                        style={{width: 150, margin: 5}}
                                        onChange={this.onChangeUsageStatus}>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="0">正常</Select.Option>
                                    <Select.Option value="1">停用</Select.Option>
                                </Select>
                            </Form.Item>
                            {/*<div onClick={this.onChangeCollapse} className="organization-more">*/}
                            {/*    <a>更多</a>*/}
                            {/*    <Icon type={collapsed ? "down" : "up"} style={{marginRight: 5}}/>*/}
                            {/*</div>*/}
                            <Button type="primary" size="small" className="station-info-button"
                                    onClick={this.onResetClick}>重置</Button>
                        </Form>
                    </div>
                    <div className="station-info-form-container">
                        <Form className="station-info-form" layout="inline">
                            <Form.Item label="支付方式" className="station-info-form-item">
                                <Select className="station-info-item-inputs"
                                        size="small"
                                        value={support_payment}
                                        style={{width: 150, margin: 5}}
                                        onChange={this.onSupportPayment}
                                >
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="ONE_KEY">一键加油</Select.Option>
                                    <Select.Option value="QR_CODE">扫码加油</Select.Option>
                                    <Select.Option value="ETC_NO_SENSE">无感支付</Select.Option>
                                    <Select.Option value="ETC_CARD">ETC刷卡支付</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>

                    <div style={{display:"flex",flexDirection:"row",margin:10}}>
                        <Button type="primary" onClick={this.addStation}>添加油站信息</Button>
                        <div style={{paddingLeft:10,paddingTop:5, color:"#d15a52",fontSize:16}}>（注：未配置油价显示为红色） </div>
                        {/*<div style={{paddingLeft:10,paddingTop:5, color:"red",fontSize:16}}>加油站信息修改后，《附近加油站》中数据不会立即生效，请前往『缓存管理』，重置【油站信息缓存】使其生效。</div>*/}
                    </div>
                </div>
                <div className="station-info-table-container">
                    <Table className='station-info-table'
                           bordered={true}
                           size="small"
                           title={this.header}
                           rowSelection={rowSelection}
                           columns={columns}
                           loading={isShowLoading}
                           dataSource={dataList}
                           onChange={this.handleTableChange}
                           pagination={pagination}
                           scroll={{x: "120%"}}
                           rowClassName={(record, index) => record.has_price?'':'row-class'}
                           // onRow={(record) => ({onClick: () => {this.selectRow(record);},})}
                    >
                    </Table>
                </div>
                {isShowDialog ? <StationInfoDialog/> : null}
                {isShowPayDialog ? <PaymentDialog/> : null}
            </div>
        );
    }
}

export default StationInfo;

const columns = [
    {
        title: '编号',
        dataIndex: 'station_id',
        key: 'station_id',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    {
        title: '全称',
        dataIndex: 'full_name',
        key: 'full_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}>
                <p style={{
                minWidth: 30,
                maxWidth: 150,
                // display: 'flex',
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '简称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (record) => {
            return (<p style={{
                minWidth: 30,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>);
            },
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}>
                <p style={{
                minWidth: 30,
                maxWidth: 150,
                // display: 'flex',
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p>
            </Tooltip>);
        },
    },
    {
        title: '品牌名称',
        dataIndex: 'brand_name',
        key: 'brand_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip placement="bottom" title={record}><p style={{
                minWidth: 60,
                maxWidth: 100,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '在高速上',
        dataIndex: 'on_high',
        key: 'on_high',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record) {
                status = "是";
            } else {
                status = "否";
            }
            return (<p style={optionStyle.container}>{status}</p>);
        },
    },
    {
        title: '支持油号',
        dataIndex: 'support_oil_array',
        key: 'support_oil_array',
        align: 'center',
        render: (record) => {
            let arr = [];
            for (let i=0; i<record.length; i++){
                arr.push(record[i].oil_full_name);
            }
            let support_oil = arr.join(',');
            return (
                <p style={optionStyle.container}>{support_oil}</p>);
        },
    },
    {
        title: '支持支付',
        dataIndex: 'support_payments',
        key: 'support_payments',
        align: 'center',
        render: (record) => {
            let arr = [];
            if (record){
                for (let i=0; i<record.length; i++){
                    if (record[i] == 'ONE_KEY') {
                        arr.push('一键加油');
                    }
                    if (record[i] == 'QR_CODE') {
                        arr.push('扫码加油');
                    }
                    if (record[i] == 'ETC_NO_SENSE') {
                        arr.push('无感支付');
                    }
                    if (record[i] == 'ETC_CARD') {
                        arr.push('ETC刷卡支付');
                    }
                }
            }
            let support_oil = arr.join(',');
            return (
                <p style={optionStyle.container}>{support_oil}</p>);
        },
    },
    {
        title: '道路编号',
        dataIndex: 'road_code',
        key: 'road_code',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    {
        title: '道路名称',
        dataIndex: 'road_name',
        key: 'road_name',
        align: 'center',
        render: (record) => {
            return (<Tooltip style={{width:'100%'}} placement="bottom" title={record}><p style={{
                minWidth: 30,
                maxWidth: 100,
                // display: 'flex',
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: 0,
                margin: 0
            }}>{record}</p></Tooltip>);
        },
    },
    {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    {
        title: '联系电话',
        dataIndex: 'contact_phone',
        key: 'contact_phone',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    {
        title: '照片',
        dataIndex: 'photo_url',
        key: 'photo_url',
        align: 'center',
        render: (record) => {
            return (
                <div
                    style={optionStyle.container}
                    // onClick={() => {{isEmpty(record) ?[] : [store.setImageUrl(record)]}}}
                >
                    <img style={{width: 30, height: 30, display: record ? 'flex' : 'none'}} alt="图片" src={record}></img>
                </div>
            );
        },
    },
    {
        title: '合作伙伴',
        dataIndex: 'company_name',
        key: 'company_name',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    {
        title: '信联商户号',
        dataIndex: 'xl_merchant_id',
        key: 'xl_merchant_id',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    // {
    //     title: '外部编号',
    //     dataIndex: 'extend_no',
    //     key: 'extend_no',
    //     align: 'center',
    //     render: (record) => {
    //         return (<p style={optionStyle.container}>{record}</p>);
    //     },
    // },
    {
        title: '打印机编号',
        dataIndex: 'printer_no',
        key: 'printer_no',
        align: 'center',
        render: (record) => {
            return (<p style={optionStyle.container}>{record}</p>);
        },
    },
    // {
    //     title: '邮箱',
    //     dataIndex: 'email',
    //     key: 'email',
    //     align: 'center',
    //     render: (record) => {
    //         return (<p style={optionStyle.container}>{record}</p>);
    //     },
    // },
    {
        title: '使用状态',
        dataIndex: 'usage_status',
        key: 'usage_status',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record === "0") {
                status = "正常";
            } else {
                status = "停用";
            }
            return (<p style={optionStyle.container}>{status}</p>);
        },
    },
    {
        title: '操作',
        key: 'options',
        fixed: 'right',
        align: 'center',
        render: (record) => {
            let status = "";
            if (record.usage_status === "0") {
                status = "1";
            } else {
                status = "0";
            }
            const menu = (
                <Menu>
                    <Menu.Item key="1">
                        <div style={optionStyle.item} onClick={() => {
                            store.setStationInfoObject(record);
                            store.setTypeModal(1);
                            store.setIsShowDialog(true);
                        }}>
                            {/*<Icon type="edit" style={{color: "#1890ff"}}/>*/}
                            <p style={optionStyle.update}>修改</p>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <div style={optionStyle.item}
                             onClick={() => {
                                 store.setStationInfoObject(record);
                                 if (store.searchData){
                                     store.setSearchData(null);
                                 }
                                 store.setIsShowDialog(true);
                                 store.setTypeModal(2)
                             }}>
                            {/*<Icon type="eye-o" style={{color: "#379b7f"}}/>*/}
                            <p style={optionStyle.update}>查看</p>
                        </div>
                    </Menu.Item>
                </Menu>
            );
            return <div style={optionStyle.container}>
                <Popconfirm
                    title={record.usage_status === "0" ? "确定停用用该油站?" : "确定启用该油站?"} okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.changeStationStatus(record.id, status)
                    }}>
                    <div style={optionStyle.update}>
                        {/*<Icon type={record.usage_status === "0" ? "lock" : "unlock"} style={{color: record.usage_status === "0" ? "#8b3ca7" : "#518324"}}/>*/}
                        <p style={record.usage_status === "0" ? optionStyle.update : optionStyle.update}>{record.usage_status === "0" ? "停用" : "启用"}</p>
                    </div>
                </Popconfirm>
                <Popconfirm
                    title="确定删除该油站吗？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteStation(record.id)
                    }}>
                    <div style={optionStyle.update}>
                        {/*<Icon type="delete" style={{color: "#ff5501"}}/>*/}
                        <p style={optionStyle.update}>删除</p>
                    </div>
                </Popconfirm>
                <Dropdown overlay={menu}>
                    <a style={optionStyle.item}>
                        <p style={optionStyle.update}>更多</p>
                        <Icon type="down" style={{color: "#1890ff"}}/>
                    </a>
                </Dropdown>
            </div>
        }
    }];

const optionStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 30,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0
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
    lock: {
        margin: 2,
        color: "#8b3ca7"
    },
    unlock: {
        margin: 2,
        color: "#518324"
    },
    see: {
        margin: 2,
        color: "#379b7f"
    },
    text: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: 0,
        margin: 0,
    }
}
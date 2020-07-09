import React, {Component} from 'react';
import {Table,Icon,Button,Form,Select,Input,Popconfirm,Modal,message} from 'antd';
import './StationImage.scss';
import {observer, inject} from 'mobx-react';
import StationImgDialog from '../../../component/station/station-img/StationImgDialog'
import ImageBulkChanges from '../../../component/station/station-img/ImageBulkChanges'
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";

let store = null;
let  page_num = 1;

@inject("imageStore")
@observer
class StationImage extends Component {

    constructor() {
        super();
        this.state = {
            page_num:1,
            page_size:10,
            gas_station_name: '',
            xl_id: '',
            is_image:'',
            brand_id:'',
            selectedRowKeys:[],
            stationArray:[],
        }
    }
    componentDidMount() {

        const {stationArray} = this.props.imageStore;
        this.setState({stationArray:stationArray,selectedRowKeys:stationArray});
        this.props.imageStore.getBrandQuery();
        const {page_num,page_size,gas_station_name,xl_id,brand_id,is_image} = this.state;
        store= this.props.imageStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            gas_station_name: isEmpty(gas_station_name)?null:trim(gas_station_name),
            xl_id: isEmpty(xl_id)?null:trim(xl_id),
            brand_id: isEmpty(brand_id)?null:trim(brand_id),
            is_image: isEmpty(is_image)?null:trim(is_image),
        }
        this.props.imageStore.getStationImage(params);
    }

    onChangeStationName = (e) => {
        this.setState({gas_station_name: e.target.value});
    }

    onChangeXlId = (e) => {
        this.setState({xl_id: e.target.value});
    }

    onChangeBrandId = (value) => {
        this.setState({brand_id: value});
    };

    selectbrandOption = () => {
        const {brandList} = this.props.imageStore;
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

    onSelectChange = (selectedRowKeys) => {
        let num = selectedRowKeys.length;
        const arr = [];
        const {dataList} = this.props.imageStore;
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
            stationArray:arr,
        });
        this.props.imageStore.setStationArray(arr);
    }

    onChangeIsImg=(value)=>{
        this.setState({is_image:value});
    }

    onSearchClick = () => {
        const {page_num,page_size,gas_station_name,xl_id,brand_id,is_image} = this.state;
        store= this.props.imageStore;
        store.setPageNum(page_num);
        const params = {
            page_num:page_num,
            page_size:page_size,
            gas_station_name: isEmpty(gas_station_name)?null:trim(gas_station_name),
            xl_id: isEmpty(xl_id)?null:trim(xl_id),
            brand_id: isEmpty(brand_id)?null:trim(brand_id),
            is_image: isEmpty(is_image)?null:trim(is_image),
        }
        this.props.imageStore.getStationImage(params);
    }

    onResetClick = () => {
        this.setState({
            gas_station_name: '',
            xl_id: '',
            brand_id: '',
            is_image:'',
        });
    }
    //查看图片
    onPreviewImage = () => {
        this.props.imageStore.setIsCanPreview(true);
    }
    //取消查看
    handleCancel = () => {
        this.props.imageStore.setIsCanPreview(false);
    }
    handleTableChange = (pagination) => {
        // const {pageSize} = this.props.imageStore;
        // this.props.imageStore.getStationImage(pagination.current,pageSize);

        const {page_size,gas_station_name,xl_id,brand_id,is_image} = this.state;
        const pager = {...this.props.imageStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.imageStore.setPagination(pager);
        store.setPageNum(pager.current);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            gas_station_name: isEmpty(gas_station_name)?null:trim(gas_station_name),
            xl_id: isEmpty(xl_id)?null:trim(xl_id),
            brand_id: isEmpty(brand_id)?null:trim(brand_id),
            is_image: isEmpty(is_image)?null:trim(is_image),
        }
        this.props.imageStore.getStationImage(params);
    };

    updateImage = () =>{
        const {stationArray} = this.state;
        if (stationArray.length>0){
            this.props.imageStore.setIsShowBulkDialog(true);
        }else {
            message.info("未选择油站");
        }
    };

    header = () => {
        const {stationArray} = this.state;
        return <div style={{display:"flex",flexDirection:"row"}}>
            <Button type="primary" onClick={this.updateImage} disabled={!stationArray.length>0}>批量修改图片</Button>
        </div>
    }

    render() {
        const {isShowLoading,pagination,dataList,isShowDialog,isShowBulkDialog} = this.props.imageStore;
        const {gas_station_name,xl_id,is_image,brand_id,selectedRowKeys} = this.state;
        store = this.props.imageStore;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="station-image-container">
                <div className="station-image-top-container">
                    <Form className="station-image-form" layout="inline">
                        <Form.Item label="加油站名称" className="station-image-form-item">
                            <Input size="small"
                                   value={gas_station_name}
                                   style={{width: 150, margin: 0}}
                                   maxLength={100}
                                   onChange={this.onChangeStationName}/>
                        </Form.Item>
                        <Form.Item label="信联ID" className="station-image-form-item">
                            <Input size="small"
                                   value={xl_id}
                                   style={{width: 150, margin: 0}}
                                   maxLength={20}
                                   onChange={this.onChangeXlId}/>
                        </Form.Item>
                        <Form.Item label="品牌" className="station-image-form-item">
                            <Select className="station-info-item-inputs"
                                    size="small"
                                    value={brand_id}
                                    style={{width: 150, margin: 5}}
                                    onChange={this.onChangeBrandId}>
                                {this.selectbrandOption()}
                            </Select>
                        </Form.Item>
                        <Form.Item label="有无图片" className="station-image-form-item">
                            <Select className="terminal-dialog-item-input"
                                    size="small"
                                    value={is_image}
                                    style={{width: 150, margin: 0}}
                                    onChange={this.onChangeIsImg}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="false">无</Select.Option>
                                <Select.Option value="true">有</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" size="small" className="station-image-button"
                                onClick={this.onSearchClick}>查询</Button>
                        <Button type="primary" size="small" className="station-image-button"
                                onClick={this.onResetClick}>重置</Button>
                    </Form>
                </div>
                <div className="station-image-table-container">
                    <Table className='station-image-table'
                           bordered={true}
                           size="small"
                           title={this.header}
                           columns={columns}
                           loading={isShowLoading}
                           dataSource={dataList}
                           onChange={this.handleTableChange}
                           pagination={pagination}
                           rowSelection={rowSelection}
                    >
                    </Table>
                </div>
                <Modal visible={store.isCanPreview} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={store.image_url}/>
                </Modal>
                {isShowDialog?<StationImgDialog/>:null}
                {isShowBulkDialog?<ImageBulkChanges/>:null}
            </div>

        );
    }
}

export default StationImage;

const columns = [
    {
        title: '加油站名称',
        dataIndex: 'gas_station_name',
        key: 'gas_station_name',
        align: 'center'
    }, {
        title: '信联ID',
        dataIndex: 'xl_id',
        key: 'xl_id',
        align: 'center',
    },
    // {
    //     title: '图片链接',
    //     dataIndex: 'image_url',
    //     key: 'image_url',
    //     align: 'center',
    //
    // },
    {
        title: '油站图片',
        dataIndex: 'image_url',
        key: 'image_url',
        align: 'center',
        render: (record) => {
            return (
                <div style={optionStyle.container}
                     onClick={() => {
                    {isEmpty(record) ?[]
                        : [store.setImageUrl(record)]}}
                }>
                    <img style={{width:40,height:40,display:record?'flex':'none'}} alt="图片" src={record}></img>
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
                {/*<div style={optionStyle.item} onClick={() => {*/}
                    {/*store.setStationImgObject(record);*/}
                    {/*store.setIsShowDialog(true);*/}
                    {/*store.setTypeModal(2)*/}
                {/*}}>*/}
                    {/*<Icon type="eye-o" style={{color: "#379b7f"}}/>*/}
                    {/*<p style={optionStyle.see}>查看</p>*/}
                {/*</div>*/}
                <div style={optionStyle.item} onClick={() => {
                    store.setStationImgObject(record);
                    store.setIsShowDialog(true);
                    store.setTypeModal(1);
                }}>
                    <Icon type="edit" style={{color: "#1890ff"}}/>
                    <p style={optionStyle.update}>修改图片</p>
                </div>
                <Popconfirm
                    title="确定删除该图片么？" okText="是的" cancelText="取消"
                    onConfirm={() => {
                        store.deleteResource(record.id)
                    }}>
                    <div style={optionStyle.item}>
                        <Icon type="delete" style={{color: "#ff5501"}}/>
                        <p style={optionStyle.delete}>删除图片</p>
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
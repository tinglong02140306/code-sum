import React from "react";
import "./EtcOil.scss";
import {Button,Form,Table,Tooltip,Icon,Select,Popconfirm,Input } from 'antd';
import {inject, observer} from 'mobx-react';
import EtcOilDialog from "../../../component/wxapplet/etc-oil/EtcOilDialog";
const Option = Select.Option;
let store = null;

@inject("etcOilStore")
@observer
class EtcOil extends React.Component{

    constructor(){
        super();
        this.state={
            page_num:1,
            page_size:10,
            resource_type:0,
            resource_use:0
        };
    }

    componentDidMount(){
        const {page_num,page_size,resource_type,resource_use} = this.state;
        store= this.props.etcOilStore;
        const params = {
            page_num:page_num,
            page_size:page_size,
            resource_type:resource_type,
            resource_use:resource_use,
        }
        this.props.etcOilStore.getResourceList(params);
    }

    handleTableChange = (pagination) => {
        const {page_size,resource_type,resource_use} = this.state;
        const pager = {...this.props.etcOilStore.pagination};
        pager.current = pagination.current;
        this.setState({page_num:pager.current});
        this.props.etcOilStore.setPagination(pager);
        const params = {
            page_num:pager.current,
            page_size:page_size,
            resource_type:resource_type,
            resource_use:resource_use,
        }
        this.props.etcOilStore.getResourceList(params);
    }

    /**
     *录入
     */
    onAddClick=()=>{
        this.props.etcOilStore.setIsShowDialog(true);
        this.props.etcOilStore.setTypeModal(0);
    }

    /**
     *重置
     */
    onResetClick=()=>{
        const {setFieldsValue} = this.props.form;
        setFieldsValue({resource_type:0,resource_use:0,resource_name:''});
    }

    /**
     *提交
     */
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const params = values;
            params.page_num = this.state.page_num;
            params.page_size = this.state.page_size;
            this.props.etcOilStore.getResourceList(params);
        });
    }

    /**
     *头部 布局
     */
    header=()=>{
        return <div className="etc-oil-header-container">
            <Button type="primary" size="small" onClick={this.onAddClick}>录入</Button>
        </div>
    }

    render(){
        const {isShowDialog,resourceList,isLoadingTable,pagination} = this.props.etcOilStore;
        const {getFieldDecorator} = this.props.form;
        return <div className="etc-oil-container">
            <Form className="etc-oil-form" layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item  label="资源类型" className="etc-oil-form-item">
                    {getFieldDecorator('resource_type', {initialValue:0})
                        (<Select size="small">
                            <Option value={0}>全部</Option>
                            <Option value={1}>图片</Option>
                            <Option value={2}>视频</Option>
                            <Option value={3}>其它</Option>
                        </Select>)}
                </Form.Item>
                <Form.Item  label="资源用途" className="etc-oil-form-item">
                    {getFieldDecorator('resource_use', {initialValue:0})
                        (<Select size="small">
                            <Option value={0}>全部</Option>
                            <Option value={1}>小程序静态资源</Option>
                            <Option value={2}>小程序banner</Option>
                        </Select>)}
                </Form.Item>
                <Form.Item label="文件名" className="station-terminal-form-item">
                    {getFieldDecorator('resource_name', {initialValue:''})
                    (<Input
                        size="small"
                        placeholder="文件名"
                    />)}

                </Form.Item>
                <Button type="primary" htmlType="submit" size="small" className="etc-oil-button">查询</Button>
                <Button type="primary" size="small" className="etc-oil-button" onClick={this.onResetClick}>重置</Button>
            </Form>
            <Table className="etc-oil-table"
                columns={columns}
                bordered={true}
                title={this.header}
                dataSource={resourceList}
                size="small"
                pagination={pagination}
                onChange={this.handleTableChange}
                loading={isLoadingTable}
                scroll={{x: "110%"}}
            />
            {isShowDialog?<EtcOilDialog/>:null}
        </div>
    }
}

export default  Form.create({})(EtcOil);

const columns = [{
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align:'center',
    width:80,
  },{
    title: '资源名称',
    dataIndex: 'resource_name',
    key: 'resource_name',
    align:'center',
    render:(record)=>{
        return <Tooltip placement="bottom" title={record}>
                <p style={style}>{record}</p>
        </Tooltip>
    }
  },{
    title: '资源用途',
    dataIndex: 'resource_use',
    key: 'resource_use',
    align:'center',
    width:120,
    render:(record)=>{
        let type = '';
        if(record===1){
            type="小程序静态资源"
        }else{
            type="小程序banner"
        }
        return <p style={style}>{type}</p>
    }
  },{
    title: '目标链接',
    dataIndex: 'target_url',
    key: 'target_url',
    align:'center',
    render:(record)=>{
        return <Tooltip placement="bottom" title={record}>
                <p style={style}>{record}</p>
        </Tooltip>
    }
  },{
    title: '顺序',
    dataIndex: 'sequence',
    key: 'sequence',
    align:'center',
    render:(record)=>{
        return <p style={style}>{record}</p>
    }
  },{
    title: '机构号',
    dataIndex: 'org_id',
    key: 'org_id',
    align:'center',
    render:(record)=>{
        return <p style={style}>{record}</p>
    }
  },{
    title: '资源图片',
    dataIndex: 'file_url',
    key: 'file_url',
    align:'center',
    render:(record)=>{
        return <div style={style}
            // onClick={() => {
            //     {isEmpty(record) ?[]
            //         : [store.setImageUrl(record)]}}}
        >
            <img style={{width:23,height:23,display:record?'flex':'none'}} alt="图片" src={record}></img>
        </div>
    }
  },{
    title: '资源链接(正常)',
    dataIndex: 'file_url',
    key: 'file_url2',
    align:'center',
    render:(record)=>{
        return <Tooltip placement="bottom" title={record}>
                <p style={style}>{record}</p>
        </Tooltip>
    }
  },{
    title: '资源链接(大图)',
    dataIndex: 'big_file_url',
    key: 'big_file_url',
    align:'center',
    render:(record)=>{
        return <Tooltip placement="bottom" title={record}>
                <p style={style}>{record}</p>
        </Tooltip>
    }
  },{
    title: '资源类型',
    dataIndex: 'resource_type',
    key: 'resource_type',
    align:'center',
    width:100,
    render:(record)=>{
        let type = '';
        if(record===1){
            type="图片"
        }else if (record===2){
            type="视频"
        }else{
            type="其它"
        }
        return <p style={style}>{type}</p>
    }
  },{
    title: '背景色',
    dataIndex: 'background_color_hex',
    key: 'background_color_hex',
    align:'center',
    width:100,
    render:(record)=>{
        return <div style={background_color}>
            <div style={{backgroundColor:record,width:20,height:20,marginRight:5}}></div>
            <p style={style}>{record}</p>
        </div>
    }
  },
    {
        title: '所属地区',
        dataIndex: 'area_name',
        key: 'area_name',
        align:'center',
        width:100,
        render:(record)=>{
            return <Tooltip placement="bottom" title={record}>
                <p style={style}>{record}</p>
            </Tooltip>
        }
    },
    {
    title: '操作',
    key: 'options',
    align:'center',
    width:180,
    render:(record)=>{
        return <div style={option_container}>
           <div style={option_item} onClick={()=>{store.setIsShowDialog(true);store.setStoreItem(record);store.setTypeModal(1)}}>
                <Icon type="edit"></Icon>
                <p style={option_text}>修改</p>
           </div>
           <div style={option_item}>
                <Icon type="eye-o"></Icon>
                <p style={option_text} onClick={()=>{store.setIsShowDialog(true);store.setStoreItem(record);store.setTypeModal(2)}}>查看</p>
           </div>
           <Popconfirm
                title="确定要删除么？" okText="是的" cancelText="取消"
                onConfirm={()=>{store.delectResorce(record.id)}}>
                <div style={option_item}>
                    <Icon type="delete"></Icon>
                    <p style={option_text}>删除</p>
                </div>
            </Popconfirm>
           
        </div>
    }
  }];

  const style = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    margin:0,
    padding:0
  }

  const background_color = {
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
  }

  const resource_style={
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    margin:0,
    cursor:'pointer'
  }

  const separation={
      width:30,
      height:1,
      backgroundColor:'rgba(0, 0, 0, 0.4)'
  }

  const resource_text = {
      color:'rgba(0, 0, 0, 0.65)',
      margin:0,
      letterSpace:1
  }

  const option_container={
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }

  const option_item={
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:5,
    marginRight:5,
    cursor:'pointer'
  }
  
  const option_text={
      margin:0,
      marginLeft:2
  }



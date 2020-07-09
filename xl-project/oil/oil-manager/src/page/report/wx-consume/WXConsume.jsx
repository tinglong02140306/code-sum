import React from 'react';
import './WXConsume.scss';
import {inject,observer} from 'mobx-react';
import {Table,Button,message} from 'antd';
import Header from '../../../component/report/wx-report-header/Header';
import moment from 'moment';
import {getCurrentDate,getCurrentFirstDate,getDifferDate} from '../../../utils/utils';
import Footer from '../../../component/report/wx-report-footer/Footer';
const dateFormat = 'YYYY/MM/DD';
const defaultValue = [moment(getCurrentFirstDate(), dateFormat),moment(getCurrentDate(), dateFormat)];
const PAGE_SIZE = 10;
const PAGE_ALL = 999;
let PAGE_NUM = 1;

@inject('wxConsumeStore')
@observer
class  WXConsume extends React.Component{

  state={
    pickerValue:defaultValue,
    start:getCurrentFirstDate(),
    end:getCurrentDate(),
    isMerge:false
  }

  componentDidMount(){
    const start = getCurrentFirstDate();
    const end = getCurrentDate();
    this.props.wxConsumeStore.getConsumeList(PAGE_NUM,PAGE_SIZE,start,end);
  }

  /**
   *日期选择
   */
  onPickerChange = (dates, dateStrings) =>{
    const differ = getDifferDate(dateStrings[0],dateStrings[1]);
    if(differ<366){
      this.setState({
        pickerValue:dates,
        start:dateStrings[0],
        end:dateStrings[1]
      });
      this.props.wxConsumeStore.getConsumeList(PAGE_NUM,PAGE_SIZE,dateStrings[0],dateStrings[1]);
    }else{
      message.error("所属日期查询最大跨度为365天");
    }
   
  }

  /**
   *导出报表
   */
  exportFile=()=>{
    const {start,end,isMerge} = this.state;
    const {sumConsume} = this.props.wxConsumeStore;
    if(isMerge){
      this.props.wxConsumeStore.exportFile(start,end,sumConsume);
    }else{
      this.props.wxConsumeStore.getConsumeList(1,PAGE_ALL,start,end);
    }
    
  }

  /**
   *合并
   */
  mergeClick=()=>{
    const {isMerge} = this.state;
    const {amount,pagination} = this.props.wxConsumeStore;
    isMerge?(pagination.total = amount):(pagination.total = 1);
    this.setState({
      isMerge:!isMerge
    });
  }

  /**
   *计算
   */
  syncClick=()=>{
    const {start,end} = this.state;
    this.props.wxConsumeStore.getCalculate(PAGE_NUM,PAGE_SIZE,start,end);
  }

  /**
   *分页
   */
  onPageChange=(page)=>{
    PAGE_NUM = page.current;
    this.props.wxConsumeStore.pagination.current = page.current;
    const {start,end} = this.state;
    this.props.wxConsumeStore.getConsumeList(PAGE_NUM,PAGE_SIZE,start,end);
  }

  render(){
    const {pickerValue,isMerge} = this.state;
    const {isShowLoading,consumeList,pagination,sumConsume} = this.props.wxConsumeStore;
    
    return <div className="wx-consume-contianer">
      <div className="wx-consume-top">
        <p className="wx-consume-title">信联加油微信会员卡业务消费报表</p>
        <div className="wx-consume-right">
          <Button className="wx-consume-btn" 
            type="primary" 
            icon={isMerge?"folder-open":"folder"} 
            onClick={this.mergeClick} 
            size="small"
            disabled={isShowLoading||!consumeList.length}>{isMerge?"展开":"合并"}</Button>
          <Button className="wx-consume-btn" 
            type="primary" 
            icon="mobile"
            onClick={this.syncClick} 
            size="small"
            disabled={isShowLoading||!consumeList.length}>计算</Button>
          <Button className="wx-consume-btn" 
            type="primary" 
            icon="download" 
            onClick={this.exportFile} 
            size="small"
            disabled={isShowLoading||!consumeList.length}>导出</Button>
        </div> 
      </div>
      
      <Table className="wx-consume-table"
          bordered
          columns={columns}
          title={()=>Header(pickerValue,this.onPickerChange)}
          footer={()=>Footer()}
          size="small"
          pagination={pagination}
          dataSource={isMerge?sumConsume:consumeList}
          loading={isShowLoading}
          onChange={this.onPageChange}>
      </Table>
    </div>
  }
  
}

export default WXConsume;

const columns = [{
    title: '日期',
    dataIndex: 'consume_date',
    key: 'consume_date',
    align:'center'
  }, {
    title: '订单金额(元)',
    dataIndex: 'order_amount',
    key: 'order_amount',
    align:'center'
  }, {
    title: '折扣金额(元)',
    dataIndex: 'discount_amount',
    key: 'discount_amount',
    align:'center'
  }, {
    title: '实际消费金额(元)',
    key: 'actual_amount',
    dataIndex: 'actual_amount',
    align:'center'
  }, {
    title: '通道手续费(元)',
    key: 'fee',
    dataIndex: 'fee',
    align:'center'
  }, {
    title: '应入账金额(元)',
    key: 'enter_account_amount',
    dataIndex: 'enter_account_amount',
    align:'center'
  }];
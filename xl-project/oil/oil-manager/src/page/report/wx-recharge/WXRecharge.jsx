import React from 'react';
import './WXRecharge.scss';
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

@inject('wxChargeStore')
@observer
class  WXRecharge extends React.Component{

  state={
    pickerValue:defaultValue,
    start:getCurrentFirstDate(),
    end:getCurrentDate(),
    isMerge:false
  }

  componentDidMount(){
    const start = getCurrentFirstDate();
    const end = getCurrentDate();
    this.props.wxChargeStore.getChargeList(PAGE_NUM,PAGE_SIZE,start,end);
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
      this.props.wxChargeStore.getChargeList(PAGE_NUM,PAGE_SIZE,dateStrings[0],dateStrings[1]);
    }else{
      message.error("所属日期查询最大跨度为365天");
    }
  }

  /**
   *导出报表
   */
  exportFile=()=>{
    const {start,end,isMerge} = this.state;
    const {sumCharge} = this.props.wxChargeStore;
    if(isMerge){
      this.props.wxChargeStore.exportFile(start,end,sumCharge);
    }else{
      this.props.wxChargeStore.getChargeList(1,PAGE_ALL,start,end);
    }
  }

  /**
   *合并
   */
  mergeClick=()=>{
    const {isMerge} = this.state;
    const {amount,pagination} = this.props.wxChargeStore;
    isMerge?(pagination.total = amount):(pagination.total = 1);
    this.setState({
      isMerge:!isMerge
    });
  }

  /**
   *分页
   */
  onPageChange=(page)=>{
    PAGE_NUM = page.current;
    this.props.wxChargeStore.pagination.current = page.current;
    const {start,end} = this.state;
    this.props.wxChargeStore.getChargeList(PAGE_NUM,PAGE_SIZE,start,end);
  }

  render(){
    const {pickerValue,isMerge} = this.state;
    const {isShowLoading,chargeList,pagination,sumCharge} = this.props.wxChargeStore;
    return <div className="wx-recharge-contianer">
      <div className="wx-recharge-top">
        <p className="wx-recharge-title">信联加油微信会员卡业务充值报表</p>
        <div className="wx-recharge-right">
          <Button className="wx-recharge-btn" 
            type="primary" 
            icon={isMerge?"folder-open":"folder"} 
            onClick={this.mergeClick} 
            size="small"
            disabled={isShowLoading||!chargeList.length}>{isMerge?"展开":"合并"}</Button>
          <Button className="wx-recharge-btn" 
            type="primary" 
            icon="download" 
            onClick={this.exportFile} 
            size="small"
            disabled={isShowLoading||!chargeList.length}>导出</Button>
        </div> 
      </div>
      <Table className="wx-recharge-table"
          bordered
          columns={columns}
          title={()=>Header(pickerValue,this.onPickerChange)}
          footer={()=>Footer()}
          size="small"
          pagination={pagination}
          dataSource={isMerge?sumCharge:chargeList}
          loading={isShowLoading}
          onChange={this.onPageChange}>
      </Table>
    </div>
  }
  
}

export default WXRecharge;

const columns = [{
    title: '日期',
    dataIndex: 'recharge_date',
    key: 'recharge_date',
    align:'center'
  }, {
    title: '卡包充值额(元)',
    dataIndex: 'card_recharge_amount',
    key: 'card_recharge_amount',
    align:'center'
  }, {
    title: '扫码充值额(元)',
    dataIndex: 'scan_code_amount',
    key: 'scan_code_amount',
    align:'center'
  }, {
    title: '充值合计(元)',
    key: 'recharge_all_amount',
    dataIndex: 'recharge_all_amount',
    align:'center'
  }];
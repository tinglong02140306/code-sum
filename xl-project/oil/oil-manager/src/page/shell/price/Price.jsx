import React from 'react';
import './Price.scss';
import {Table, Button,DatePicker} from 'antd';
import {observer, inject} from 'mobx-react';
import {formatTime} from '../../../utils/utils';

let  page_num = 1;

@inject('shellPriceStore')
@observer
class Price extends React.Component{

    state = {
        start_value : null,
        end_value:null,
    }

    componentDidMount() {
        const {start_value,end_value} = this.state;
        this.props.shellPriceStore.setPageSize(18);
        this.props.shellPriceStore.getPriceList(page_num,18,formatTime(start_value),formatTime(end_value));
    }

    handleTableChange = (pagination) => {
        const {start_value,end_value} = this.state;
        const {pageSize} = this.props.shellPriceStore;
        this.props.shellPriceStore.getPriceList(pagination.current,pageSize,formatTime(start_value),formatTime(end_value));
    }

    onStartDateChange=(value)=>{
        this.setState({start_value:value});
    }

    onEndDateChange = (value)=>{
        this.setState({end_value:value});
    }

    disabledStartDate = (startValue) => {
        const end_value = this.state.end_value;
        if (!startValue || !end_value) {
          return false;
        }
        return startValue.valueOf() > end_value.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const start_value = this.state.start_value;
        if (!endValue || !start_value) {
          return false;
        }
        return endValue.valueOf() <= start_value.valueOf();
    }

    /**
     *查询
     */
    onRearchClick=()=>{
        page_num = 1;
        const {start_value,end_value} = this.state;
        const {pageSize} = this.props.shellPriceStore;
        this.props.shellPriceStore.getPriceList(page_num,pageSize,formatTime(start_value),formatTime(end_value));
    }

    /**
     *重置
     */
    onResetClick=()=>{
        this.setState({
            start_value : null,
            end_value:null,
        });
    }


    render(){
        const {start_value,end_value} = this.state;
        const {isShowLoading,pagination,priceList} = this.props.shellPriceStore;
        return <div className='shell-price-container'>
        <div className='shell-price-search-container' layout='inline'>
            <div className='shell-price-search-item'>
                <p>开始时间:</p>
                <DatePicker format="YYYY-MM-DD" 
                    value={start_value}
                    onChange={this.onStartDateChange}
                    disabledDate={this.disabledStartDate}></DatePicker>
            </div>
            <div className='shell-price-search-item'>
                <p>结束时间:</p>
                <DatePicker format="YYYY-MM-DD" 
                    value={end_value}
                    onChange={this.onEndDateChange}
                    disabledDate={this.disabledEndDate}></DatePicker>
            </div>
            <Button className='shell-price-btn' type='primary' onClick={this.onRearchClick}>查询</Button>
            <Button className='shell-price-btn' onClick={this.onResetClick}>重置</Button>
        </div>
        <Table className='shell-price-table'
            bordered={true}
            size="small"
            columns={columns}
            loading={isShowLoading}
            dataSource={priceList}
            onChange={this.handleTableChange}
            pagination={pagination}>
        </Table>
      </div>
    }
}

export default Price;

const columns = [
    {
        title: '导入日期',
        dataIndex: 'import_time',
        key: 'import_time',
        align: 'center',
    },
    {
        title: '终端号',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center',
    },
    {
        title: '终端名称',
        dataIndex: 'terminal_name',
        key: 'terminal_name',
        align: 'center',
    },
    {
        title: '油品',
        dataIndex: 'oil_detail',
        key: 'oil_detail',
        align: 'center',
    },
    {
        title: '油机价',
        dataIndex: 'list_price',
        key: 'list_price',
        align: 'center',
    },
    {
        title: '失败描述',
        dataIndex: 'failed_desc',
        key: 'failed_desc',
        align: 'center',
    },
];
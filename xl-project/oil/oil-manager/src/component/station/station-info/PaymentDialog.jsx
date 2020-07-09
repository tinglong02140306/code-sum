import React from "react";
import "../../../page/station/station-info/StationInfo.scss"
import {Input,Modal,Form,Button,Table} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {trim} from "../../../utils/trim";
import './StationInfoDialog.scss'

let store = null;
@inject("stationInfoStore")
@observer
class PaymentDialog extends React.Component{

    constructor(){
        super();
        this.state={
            page_num:1,
            page_size:5,
            road_code:'',
            selectedRowKeys:[],
            support_payments:[],
            station_id_array:[],
        }
    }

    componentDidMount() {
    }

    onCancel=()=>{
        this.props.stationInfoStore.setIsShowPayDialog(false);
        this.props.stationInfoStore.setPayType(1,0,[]);
    }

    onOk=()=>{
        const {station_id_array} = this.props.stationInfoStore;
        const {support_payments} = this.state;
        this.props.stationInfoStore.changeStationPayment(eval(JSON.stringify(station_id_array)),support_payments)
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys});
        const arr = [];
        selectedRowKeys.map((item) => {
            list.map((item2) => {
                if (item == item2.key) {
                    arr.push(item2.support_payments);
                }
            });
        });
        this.setState({
            support_payments:arr,
        });
    };

    selectRow = (record) => {
        const {selectedRowKeys} = this.state;
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            // selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1,record.key);
        } else {
            selectedRowKeys.push(record.key);
        }
        let num = selectedRowKeys.length;
        const arr = [];
        selectedRowKeys.map((item) => {
            list.map((item2) => {
                if (item == item2.key) {
                    arr.push(item2.support_payments);
                }
            });
        });
        this.setState({
            selectedRowKeys,
            support_payments:arr,
        });
    }

    render(){
        const {isShowPayDialog,isPayLoading,payType,payNum} = this.props.stationInfoStore;
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = {};
        pagination.pageSize = 99;
        pagination.hideOnSinglePage = true;
        pagination.showQuickJumper = true;
        let title = "";
        if (payType === 1) {
            // title = "添加支付方式";
            title = "批量设置支付方式";
        } else {
            title = "移除支付方式";
        }
        return (
            <Modal title={title}
                   width={500}
                   okType="primary"
                   footer={null}
                   onCancel={this.onCancel}
                   confirmLoading={isPayLoading}
                   visible={isShowPayDialog}>
                <div className="payment-dialog-container">
                    <div style={{marginBottom:10}}>为选中的{payNum}个加油站批量添加支付方式，请选择：</div>
                    <div style={{marginBottom:5,fontSize:12,color:'#B5781B'}}>注：将清空所选加油站的原支付方式并重新设置</div>
                    <div style={{marginBottom:5,fontSize:12,color:'#b5720a',marginLeft:25}}>不选则清空所选加油站的原支付方式。</div>
                    <div className="payment-table-container">
                        <Table className='payment-table'
                               rowSelection={rowSelection}
                               size="middle"
                               columns={columns}
                               dataSource={list}
                               pagination={pagination}
                               onRow={(record) => ({onClick: () => {this.selectRow(record);},})}
                        >
                        </Table>
                    </div>
                    <div className='payment-info-button-box'>
                        <Button type="primary" size="small" className="payment-info-button" loading={isPayLoading} onClick={this.onOk}>保存</Button>
                        <Button type="default" size="small" className="payment-info-button" onClick={this.onCancel}>取消</Button>
                    </div>
                </div>

            </Modal>
        )
    }
}

export default PaymentDialog;

const columns = [
    {
        title: '支付方式',
        dataIndex: 'payment',
        key: 'payment',
        align: 'left'
    },
];
const list = [
    {key:0,support_payments:'ONE_KEY',payment:'一键加油'},
    {key:1,support_payments:'QR_CODE',payment:'扫码加油'},
    {key:2,support_payments:'ETC_NO_SENSE',payment:'无感支付'},
    {key:3,support_payments:'ETC_CARD',payment:'ETC刷卡支付'},
]
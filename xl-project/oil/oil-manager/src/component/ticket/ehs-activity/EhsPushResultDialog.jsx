import React from 'react';
import {Modal, Table,Button,Tooltip} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("ehsActivityStore")
@observer
class EhsPushResultDialog extends React.Component {

    onCancel =()=>{
        this.props.ehsActivityStore.setIsShowLeadResultDialog(false);
    }

    render() {
        const {isShowLeadResultDialog,leadResult} = this.props.ehsActivityStore;
        console.log(leadResult.markArray);
        return (<Modal
            title="数据插入结果"
            width={1000}
            visible={isShowLeadResultDialog}
            onCancel={this.onCancel}
            footer={[<Button type="primary" key="back"
                             onClick={this.onCancel}>确定</Button>]}>
            <div style={{display:'flex',flexDirection:'column'}}>
                <div>
                    <div style={{fontSize:14,fontWeight:'bold',marginBottom:5,color:'#000000'}}>总共提交<span style={{color:"#000000"}}>{leadResult.amount}</span>条数据，其中<span style={{color:'#1bb158'}}>{leadResult.success_count}</span>条提交成功，<span style={{color:'#ff2128'}}>{leadResult.failed_count}</span>条提交失败</div>
                </div>
                <div style={{display:leadResult.failed_count==="0" ?'none':'block'}}>
                    <div style={{fontSize:15,fontWeight:'bold',marginBottom:10,color:'#000000'}}>提交失败列表</div>
                    <Table
                        scroll={{x: 900}}
                        bordered
                        size="small"
                        style={{width: 900, backgroundColor: "#fff", fontSize: 10, margin: 0, padding: 0}}
                        columns={columns}
                        dataSource={leadResult.markArray}
                        pagination={false}/>
                </div>

            </div>
        </Modal>);
    }
}

export default EhsPushResultDialog;


const columns = [{
    title: '姓名',
    dataIndex: 'real_name',
    key: 'real_name',
    render: (record) => {
        return (<p style={{
            width: 100,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (record) => {
        return (<p style={{
            width: 160,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}, {
    title: '证件号',
    dataIndex: 'cert_no',
    key: 'cert_no',
    render: (record) => {
        return (<p style={{
            width: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0
        }}>{record}</p>);
    },
}];
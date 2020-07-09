import React from 'react';
import {Modal, Table, Tooltip, Button, Checkbox} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("ehsActivityStore")
@observer
class EhsPushDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            checked: false,
            isVisiblePre:false
        }
    }

    onCancel = () => {
        this.props.ehsActivityStore.setIsShowLeadDialog(false);
    }

    onSubmit = () => {
        const {type} = this.props.ehsActivityStore;
        this.props.ehsActivityStore.getSubmitLead(this.props.ehsActivityStore.leadList,type);
    }

    onChangeCheck = (e) => {
        this.setState({
            checked: e.target.checked
        });
    }

    render() {
        const {checked} = this.state;
        const {isShowLeadDialog, leadList, isShowLeadLoading,type} = this.props.ehsActivityStore;
        return (<Modal
            title={type===10?"10元代金券投放":"300元代金券投放"}
            width={1000}
            visible={isShowLeadDialog}
            onCancel={this.onCancel}
            footer={[<Button onClick={this.onCancel} key="back">取消</Button>,
                <Button type="primary" key="submit"
                        disabled={!checked}
                        onClick={this.onSubmit}
                        loading={isShowLeadLoading}>提交</Button>]}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Table
                    scroll={{x: 900}}
                    bordered
                    size="small"
                    style={{width: 900, backgroundColor: "#fff", fontSize: 10, margin: 0, padding: 0}}
                    columns={columns}
                    dataSource={leadList}
                    pagination={false}/>
                <Checkbox style={{marginTop: 20}}
                          onChange={this.onChangeCheck}>共计{leadList? leadList.length : 0}条,确认</Checkbox>
            </div>
        </Modal>);
    }
}

export default EhsPushDialog;

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
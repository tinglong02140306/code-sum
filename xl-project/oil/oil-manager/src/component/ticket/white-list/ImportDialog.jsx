import React from 'react';
import { Modal, Table, Input, Form, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import './ImportDialog.scss';
import { XLSXExport } from '../../../utils/utils';
// import { formatData } from "../../utils/formatDate";

@inject("WhiteListStore")
@observer
class BlacklistImportDialog extends React.Component {

    state = {
        uploadFileName: '还未选择文件',
        file: '',
        fileHint: ''
    }

    onFileChange = (e) => {
        const file = e.target.files[0];
        this.setState({
            uploadFileName: file && file.name,
            file: file
        });
    }

    onOk = () => {
        const { file, uploadFileName } = this.state;
        this.setState({ fileHint: file ? '' : '请选择要上传的文件' });

        this.props.form.validateFields((err, values) => {
            if (err) return;//检查Form表单填写的数据是否满足rules的要求
            console.log(JSON.stringify(values))
            // this.props.onOk(values);//调用父组件给的onOk方法并传入Form的参数。
            let act_code = values.act_code ? values.act_code : null
            if (file) this.props.WhiteListStore.getUploadFile(uploadFileName, file, act_code);
        })
    }

    onCancel = () => {
        this.props.form.resetFields();//重置Form表单的内容
        this.props.WhiteListStore.setIsShowEngineDialog(false);
    }

    /**
     * 下载文件模版
     */
    onDownLoadTemplet = () => {
        const templet = [
            ['银行卡号', '操作人员', '录入时间'],
            ['65003123****3241', '陈欢', '20200240  11:10:32'],
        ];
        XLSXExport(templet, 'Sheet', '白名单模版');
    }


    render() {
        const { current_file_url, current_file_date, current_file_name, isShowEngineDialog, isShowEngineLoading } = this.props.WhiteListStore;
        const { uploadFileName, fileHint } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return <Modal width={700}
            okText="提交"
            cancelText="取消" centered={true}
            confirmLoading={isShowEngineLoading}
            visible={isShowEngineDialog}
            title='白名单导入'
            onOk={this.onOk} onCancel={this.onCancel}>
            <div className='blacklist-import-container'>
                <Form className='blacklist-import-current-container'
                    method='get' action='https://static.firefoxchina.cn/img/201903/8_5c7dd7d5d8aa20.jpg'>
                    <div className='blacklist-import-label'>正在使用的文件:</div>
                    <a href={current_file_url || '暂无'} download={current_file_name || '暂无'}>{current_file_name || '暂无'}</a>
                    <div className='blacklist-import-current-time'>
                        <div className='blacklist-import-label'>上传时间:</div>
                        <div className='blacklist-import-content'>{current_file_date || '暂无'}</div>
                    </div>
                </Form>
                <div className='blacklist-import-templet-container'>
                    <div className='blacklist-import-templet'>
                        <div className='blacklist-import-label' onClick={this.onDownLoad}>文件模板:</div>
                        <div className='blacklist-import-templet-download' onClick={this.onDownLoadTemplet}>下载文件模板</div>
                    </div>
                    <Table className='blacklist-import-table'
                        columns={columns} bordered={true}
                        dataSource={dataSource} size='small' pagination={false}></Table>
                    <div className='blacklist-import-table-hint'>*所有单元格格式必须为文本格式,文件名不能带空格</div>
                </div>
                <div className='blacklist-import-templet-container'>
                    <Form className="box" layout="inline">
                        <div className="content-box">
                            <Form.Item className="box-item" label="活动代码">
                                {getFieldDecorator('act_code', { rules: [{ required: true, message: '活动代码' }] })(<Input placeholder="请输入活动代码" />)}
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div className='blacklist-import-upload-container'>
                    <div className='blacklist-import-label'>上传文件:</div>
                    <div className='blacklist-import-upload-box'>
                        <Button type='primary' className='blacklist-import-upload-btn'>选择文件</Button>
                        <Input className='engine-lead-upload-input'
                            ref={ref => this.input = ref}
                            type='file' accept='.xlsx,.xls'
                            onChange={this.onFileChange} />
                        <span style={{ visibility: fileHint ? "visible" : "hidden" }}>{fileHint}</span>
                    </div>
                    <div className='blacklist-import-file-name'>{uploadFileName}</div>
                </div>
            </div>
        </Modal>
    }
}
export default Form.create()(BlacklistImportDialog);

const columns = [
    {
        title: '银行卡号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center'
    }, {
        title: '操作人员',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center'
    }, {
        title: '录入时间',
        dataIndex: 'desc',
        key: 'desc',
        align: 'center'
    }];

const dataSource = [{
    mobile: '65003123****3241',
    amount: "陈欢",
    desc: "20200240  11:10:32",
    key: '1'
}];
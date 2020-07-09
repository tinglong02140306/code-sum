import React from 'react';
import {Modal,Table,Input,Form, Button} from 'antd';
import {inject,observer} from 'mobx-react';
import './FeeImportDialog.scss';
import {XLSXExport} from '../../../utils/utils';

@inject("feeImportStore")
@observer
class EngineLeadDialog extends React.Component{

    state={
        uploadFileName:'还未选择文件',
        file:'',
        fileHint:''
    }

    onFileChange=(e)=>{
        const file = e.target.files[0];
        this.setState({
            uploadFileName:file&&file.name,
            file:file
        });
    }

    onOk=()=>{
        const {file,uploadFileName} = this.state;
        this.setState({fileHint:file?'':'请选择要上传的文件'});
        if(file) this.props.feeImportStore.getUploadFeeFile(uploadFileName,file);
    }

    onCancel=()=>{
        this.props.feeImportStore.setIsShowImportDialog(false);
    }

    /**
     * 下载文件模版
     */
    onDownLoadTemplet=()=>{
        const templet = [
            ['日期','产品名称','产品类型','通道手续费'],
            ['2019-03-07','微信会员卡','000000001','65312.58'],
        ];
        XLSXExport(templet,'Sheet','通道费导入模版');
    }


    render() {
        const {current_file_url,current_file_date,current_file_name,isShowImportDialog,isShowImportLoading} = this.props.feeImportStore;
        const {uploadFileName,fileHint} = this.state;
        return <Modal width={700}
                      okText="提交"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowImportLoading}
                      visible={isShowImportDialog}
                      title='通道手续费导入'
                      onOk={this.onOk} onCancel={this.onCancel}>
            <div className='fee-import-container'>
                <Form className='fee-import-current-container'
                      onSubmit={this.handleSubmit}
                      method='get' action='https://static.firefoxchina.cn/img/201903/8_5c7dd7d5d8aa20.jpg'>
                    <div className='fee-import-label'>正在使用的文件:</div>
                    <a href={current_file_url||'暂无'} download={current_file_name||'暂无'}>{current_file_name||'暂无'}</a>
                    <div className='fee-import-current-time'>
                        <div className='fee-import-label'>上传时间:</div>
                        <div className='fee-import-content'>{current_file_date||'暂无'}</div>
                    </div>
                </Form>
                <div className='fee-import-templet-container'>
                    <div className='fee-import-templet'>
                        <div className='fee-import-label' onClick={this.onDownLoad}>文件模板:</div>
                        <div className='fee-import-templet-download' onClick={this.onDownLoadTemplet}>下载文件模板</div>
                    </div>
                    <Table className='fee-import-table'
                           columns={columns} bordered={true}
                           dataSource={dataSource} size='small' pagination={false}></Table>
                    <div className='fee-import-table-hint'>*所有单元格格式必须为文本格式,文件名不能带空格</div>
                </div>
                <div className='fee-import-upload-container'>
                    <div className='fee-import-label'>上传文件:</div>
                    <div className='fee-import-upload-box'>
                        <Button type='primary' className='fee-import-upload-btn'>选择文件</Button>
                        <Input className='fee-import-upload-input'
                               ref = {ref=>this.input=ref}
                               type='file' accept='.xlsx,.xls'
                               onChange={this.onFileChange}/>
                        <span style={{visibility:fileHint?"visible":"hidden"}}>{fileHint}</span>
                    </div>
                    <div className='fee-import-file-name'>{uploadFileName}</div>
                </div>
            </div>
        </Modal>
    }
}
export default EngineLeadDialog;

const columns = [
    {
        title: '日期',
        dataIndex: 'import_time',
        key: 'import_time',
        align: 'center'
    },{
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        align: 'center'
    },{
        title: '产品类型',
        dataIndex: 'product_type',
        key: 'product_type',
        align: 'center'
    },{
        title: '通道手续费',
        dataIndex: 'fee',
        key: 'fee',
        align: 'center'
    }
];

const dataSource=[{
    import_time:'2019-03-01',
    product_name:'微信会员卡',
    product_type:'000000001',
    fee:'65312.58',
    key:'1'
}];
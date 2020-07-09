import React from 'react';
import {Modal,Table,Input,Form, Button} from 'antd';
import {inject,observer} from 'mobx-react';
import './GoldImportDialog.scss';
import {XLSXExport} from '../../../utils/utils';

@inject("goldStore")
@observer
class BlacklistImportDialog extends React.Component{

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
        if(file) this.props.goldStore.getUploadPriceFile(uploadFileName,file);
    }

    onCancel=()=>{
        this.props.goldStore.setIsShowEngineDialog(false);
    }

    /**
     * 下载文件模版
     */
    onDownLoadTemplet=()=>{
        const templet = [
            ['手机号','金额','描述','ETC卡号'],
            ['187xxx','100.00','通行费5折','3701xxx'],
        ];
        XLSXExport(templet,'Sheet','加油金模版');
    }


    render() {
        const {current_file_url,current_file_date,current_file_name,isShowEngineDialog,isShowEngineLoading} = this.props.goldStore;
        const {uploadFileName,fileHint} = this.state;
        return <Modal width={700}
                      okText="提交"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowEngineLoading}
                      visible={isShowEngineDialog}
                      title='加油金导入'
                      onOk={this.onOk} onCancel={this.onCancel}>
            <div className='blacklist-import-container'>
                <Form className='blacklist-import-current-container'
                      onSubmit={this.handleSubmit}
                      method='get' action='https://static.firefoxchina.cn/img/201903/8_5c7dd7d5d8aa20.jpg'>
                    <div className='blacklist-import-label'>正在使用的文件:</div>
                    <a href={current_file_url||'暂无'} download={current_file_name||'暂无'}>{current_file_name||'暂无'}</a>
                    <div className='blacklist-import-current-time'>
                    <div className='blacklist-import-label'>上传时间:</div>
                    <div className='blacklist-import-content'>{current_file_date||'暂无'}</div>
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
                <div className='blacklist-import-upload-container'>
                    <div className='blacklist-import-label'>上传文件:</div>
                    <div className='blacklist-import-upload-box'>
                        <Button type='primary' className='blacklist-import-upload-btn'>选择文件</Button>
                        <Input className='engine-lead-upload-input'
                               ref = {ref=>this.input=ref}
                               type='file' accept='.xlsx,.xls'
                               onChange={this.onFileChange}/>
                        <span style={{visibility:fileHint?"visible":"hidden"}}>{fileHint}</span>
                    </div>
                    <div className='blacklist-import-file-name'>{uploadFileName}</div>
                </div>
            </div>
        </Modal>
    }
}
export default BlacklistImportDialog;

const columns = [
   {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center'
    },{
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center'
    },{
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        align: 'center'
    }, {
        title: 'ETC卡号',
        dataIndex: 'etc_card_no',
        key: 'etc_card_no',
        align: 'center'
    },
];

const dataSource=[{
    mobile:'187xxx',
    amount:"100.00",
    desc:"通行费5折",
    etc_card_no:'3701xxx',
    key:'1'
}];
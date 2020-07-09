import React from 'react';
import {Modal,Table,Input,Form, Button} from 'antd';
import {inject,observer} from 'mobx-react';
import './EngineLeadDialog.scss';
import {XLSXExport} from '../../../../utils/utils';

@inject("terminalStore")
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
        if(file) this.props.terminalStore.getUploadPriceFile(uploadFileName,file);
    }

    onCancel=()=>{
        this.props.terminalStore.setIsShowEngineDialog(false);
    }

    /**
     * 下载文件模版
     */
    onDownLoadTemplet=()=>{
        const templet = [
            ['日期','站点','油品分类','油机价','优惠金额','终端号'],
            ['2019-03-01','潍坊市玉清东街加油站','92#汽油','6.46','0.45','370700004880001'],
        ];
        XLSXExport(templet,'Sheet','油机价导入模版');
    }


    render() {
        const {current_file_url,current_file_date,current_file_name,current_file_amount,isShowEngineDialog,isShowEngineLoading} = this.props.terminalStore;
        const {uploadFileName,fileHint} = this.state;
        return <Modal width={700}
                      okText="提交"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowEngineLoading}
                      visible={isShowEngineDialog}
                      title='油机价导入'
                      onOk={this.onOk} onCancel={this.onCancel}>
            <div className='engine-lead-container'>
                <Form className='engine-lead-current-container' 
                    onSubmit={this.handleSubmit}
                    method='get' action='https://static.firefoxchina.cn/img/201903/8_5c7dd7d5d8aa20.jpg'>
                    <div className='engine-lead-label'>正在使用的文件:</div>
                    <a href={current_file_url||'暂无'} download={current_file_name||'暂无'}>{current_file_name||'暂无'}</a>
                    <div className='engine-lead-current-time'>
                        <div className='engine-lead-label'>上传时间:</div>
                        <div className='engine-lead-content'>{current_file_date||'暂无'}</div>
                    </div>
                </Form>
                <div className='engine-lead-table-hint-1'>文件导入记录数量:{current_file_amount}条</div>
                <div className='engine-lead-templet-container'>
                    <div className='engine-lead-templet'>
                        <div className='engine-lead-label' onClick={this.onDownLoad}>文件模板:</div>
                        <div className='engine-lead-templet-download' onClick={this.onDownLoadTemplet}>下载文件模板</div>
                    </div>
                    <Table className='engine-lead-table' 
                        columns={columns} bordered={true} 
                        dataSource={dataSource} size='small' pagination={false}></Table>
                    <div className='engine-lead-table-hint'>*所有单元格格式必须为文本格式,文件名不能带空格</div>
                </div>
                <div className='engine-lead-upload-container'>
                    <div className='engine-lead-label'>上传文件:</div>
                    <div className='engine-lead-upload-box'>
                        <Button type='primary' className='engine-lead-upload-btn'>选择文件</Button>
                        <Input className='engine-lead-upload-input' 
                            ref = {ref=>this.input=ref}
                            type='file' accept='.xlsx,.xls' 
                            onChange={this.onFileChange}/>
                        <span style={{visibility:fileHint?"visible":"hidden"}}>{fileHint}</span>
                    </div>
                    <div className='engine-lead-file-name'>{uploadFileName}</div>
                </div>
            </div>
        </Modal>
    }
}
export default EngineLeadDialog;

const columns = [
    {
        title: '日期',
        dataIndex: 'terminal_id',
        key: 'terminal_id',
        align: 'center'
    },{
        title: '站点',
        dataIndex: 'terminal_name',
        key: 'terminal_name',
        align: 'center'
    },{
        title: '油品分类',
        dataIndex: 'group_name',
        key: 'group_name',
        align: 'center'
    },{
        title: '油机价',
        dataIndex: 'pos_oil',
        key: 'pos_oil',
        align: 'center'
    },{
        title: '优惠金额',
        dataIndex: 'discount_amount',
        key: 'discount_amount',
        align: 'center'
    },{
        title: '终端号',
        dataIndex: 'cost_price',
        key: 'cost_price',
        align: 'center'
    },
];

const dataSource=[{
    terminal_id:'2019-03-01',
    terminal_name:'潍坊市玉清东街加油站',
    group_name:'92#汽油',
    pos_oil:'6.46',
    cost_price:'370700004880001',
    key:'1',
    discount_amount:"0.45"
}];
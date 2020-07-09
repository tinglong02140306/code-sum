import React from 'react';
import {Modal,Form} from 'antd';
import {inject,observer} from 'mobx-react';
import './ExportResultDialog.scss';

@inject("orderStore")
@observer
class ExportResultDialog extends React.Component{

    onOk=()=>{
        this.props.orderStore.setIsShowExportResultDialog(false);
    }

    onCancel=()=>{
        this.props.orderStore.setIsShowExportResultDialog(false);
    }

    render() {
        const {isShowExportResultDialog,check_result_file_url,file_name,file_date,type} = this.props.orderStore;
        if (type===1){
            return(
                <Modal width={400}
                       okText="确定"
                       cancelText="取消" centered={true}
                       visible={isShowExportResultDialog}
                       title='导出文件'
                       onOk={this.onOk}
                       onCancel={this.onCancel}>
                    <div className='export-result-container'>
                        <div className='export-result-top'>
                            <p className='export-result-title'>点击下载：</p>
                            <a href={check_result_file_url} download={check_result_file_url}>消费流水.xlsx</a>
                        </div>

                    </div>
                </Modal>
            )
        }else if (type===2){
           return(
               <Modal width={600}
                      okText="确定"
                      cancelText="取消" centered={true}
                      visible={isShowExportResultDialog}
                      title='导出文件'
                      onOk={this.onOk}
                      onCancel={this.onCancel}>
                   <div className='export-result-container'>
                       <div className="order-export-result-hint">（注：由于数据量大，生成导出文件可能不会及时生成，请耐心等待） </div>
                       <Form className='export-result-current-container'
                             method='get' action='https://static.firefoxchina.cn/img/201903/8_5c7dd7d5d8aa20.jpg'>
                           <div className='export-result-lead-label'>点击下载文件:</div>
                           <a href={check_result_file_url||'暂无'} download={check_result_file_url||'暂无'}>{file_name||'暂无'}</a>
                           <div className='export-result-current-time'>
                               <div className='export-result-lead-label'>生成时间:</div>
                               <div className='export-result-lead-content'>{file_date||'暂无'}</div>
                           </div>
                       </Form>
                   </div>
               </Modal>
           )
        }else {
            return(
                <Modal width={500}
                       okText="确定"
                       cancelText="取消" centered={true}
                       visible={isShowExportResultDialog}
                       title='导出文件'
                       onOk={this.onOk}
                       onCancel={this.onCancel}>
                    <div className='export-result-container'>
                        <div className='export-result-lead-label'>加载失败！</div>
                        <div className="order-export-result-hint">（失败:数据量太大，生成文件超时，可去"文件下载"查询结果。） </div>

                    </div>
                </Modal>
            )
        }

    }
}
export default ExportResultDialog;

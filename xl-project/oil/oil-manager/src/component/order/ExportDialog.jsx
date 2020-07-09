import React from 'react';
import {Modal,Table,Input,Form, Button,DatePicker,message} from 'antd';
import {inject,observer} from 'mobx-react';
import './ExportDialog.scss';
import moment from 'moment';
import {getCurrentDate, getCurrentFirstDate, getDifferDate} from '../../utils/utils';

// const {RangePicker} = DatePicker;
// const dateFormat = 'YYYY/MM/DD';

@inject("orderStore")
@observer
class ExportDialog extends React.Component{

    state={
        // start_export: moment(getCurrentFirstDate(), dateFormat),
        // end_export: moment(getCurrentDate(), dateFormat),
        start_export: moment(getCurrentFirstDate()),
        end_export: moment(getCurrentDate()),
        showSuccess:false,

    }

    componentDidMount(){
        const {params} = this.props.orderStore;



        if(params.start_date != null || params.end_date != null ){

            const differ = getDifferDate(params.start_date, params.end_date);
            if (differ < 31) {
                this.setState({
                    // start_export: moment(params.start_date,dateFormat),
                    start_export: moment(params.start_date),
                    end_export: moment(params.end_date),
                });
            } else {
                message.error("导出日期最大跨度为31天");
            }


            // this.setState({
            //     // start_export: moment(params.start_date,dateFormat),
            //     start_export: moment(params.start_date),
            //
            // });
        }

        // if(params.end_date != null){
        //     this.setState({
        //         // end_export: moment(params.end_date,dateFormat),
        //         end_export: moment(params.end_date),
        //
        //     });
        // }
    }

    onOk=()=>{
        const {start_export,end_export,showSuccess} = this.state;

        if (showSuccess) {
            this.props.orderStore.setIsShowExportDialog(false);
        }else {

            // this.props.orderStore.getConsumeFlowDownload(start_export,end_export);
            const differ = getDifferDate(start_export, end_export);
            if (differ < 31) {
                this.props.orderStore.getConsumeFlowDownload(start_export,end_export);
            } else {
                message.error("导出日期最大跨度为31天");
            }

            // this.setState({
            //     showSuccess:true,
            // })
            // this.props.orderStore.setIsShowEngineLoading(false);

        }
    }

    onCancel=()=>{
        this.props.orderStore.setIsShowExportDialog(false);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end_export;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_export;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onStartChange = (value) => {

        this.onChange('start_export', value);

        // const differ = getDifferDate(value, this.state.end_export);
        // if (differ < 31) {
        //     this.onChange('start_export', value);
        // } else {
        //     message.error("导出日期最大跨度为31天");
        // }
        // this.setState({
        //     start_export: value,
        // });
    }

    onEndChange = (value) => {
        const differ = getDifferDate(this.state.start_export, value);
        if (differ < 31) {
            this.onChange('end_export', value);
        } else {
            message.error("导出日期最大跨度为31天");
        }
        // this.setState({
        //     end_export: value,
        //
        // });
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    /**
     *日期选择
     */
    onPickerChange = (dateStrings) => {
        const differ = getDifferDate(dateStrings[0], dateStrings[1]);
        if (differ < 31) {
            this.setState({
                start_export: dateStrings[0],
                end_export: dateStrings[1]
            });

        } else {
            message.error("所属日期查询最大跨度为31天");
        }
    };

    render() {
        const {isShowExportDialog,isShowEngineLoading,params} = this.props.orderStore;
        const {start_export,end_export,showSuccess} = this.state;
        if (showSuccess) {
            return (
                <Modal width={500}
                       okText="确定"
                       cancelText="取消" centered={true}
                       confirmLoading={isShowEngineLoading}
                       visible={isShowExportDialog}
                       title='生成导出文件'
                       onOk={this.onOk}
                       onCancel={this.onCancel}>
                    <div className='export-container'>
                        <div className="export-hint-text">提交成功，可去"文件下载"查看并下载</div>
                        {/*<div className="order-export-hint">（注：由于数据量大，生成导出文件可能不会及时生成，请耐心等待） </div>*/}

                    </div>
                </Modal>
            )
        }else {

           return(
               <Modal width={500}
                      okText="确定"
                      cancelText="取消" centered={true}
                      confirmLoading={isShowEngineLoading}
                      visible={isShowExportDialog}
                      title='生成导出文件'
                      onOk={this.onOk}
                      onCancel={this.onCancel}>
                   <div className='export-container'>
                       <Form className='export-date-container'
                             onSubmit={this.handleSubmit}>
                           <div className="export-header-date">
                               <p className="export-header-text">选择导出区间：</p>
                               <div className="export-header-date-item">
                                   <DatePicker
                                       size="small"
                                       disabledDate={this.disabledStartDate}
                                       format="YYYY-MM-DD"
                                       value={start_export}
                                       placeholder="开始日期"
                                       onChange={this.onStartChange}
                                       className="order-data-picker"/>
                               </div>
                               <div className="export-header-date">
                                   <DatePicker
                                       size="small"
                                       disabledDate={this.disabledEndDate}
                                       format="YYYY-MM-DD"
                                       value={end_export}
                                       placeholder="结束日期"
                                       onChange={this.onEndChange}
                                       className="order-data-picker"/>
                               </div>
                           </div>
                           <div className="order-export-hint">（注：默认导出当前月流水,最大可导出31天的数据） </div>
                       </Form>

                   </div>
               </Modal>
           )
        }

    }
}
export default ExportDialog;
{/*<RangePicker*/}
{/*style={{width:250}}*/}
{/*format="YYYY-MM-DD"*/}
{/*value={[start_export,end_export]}*/}
{/*onChange={this.onPickerChange}*/}
{/*/>*/}
//

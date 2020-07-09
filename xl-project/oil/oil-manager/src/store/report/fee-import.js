import {observable, action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';

class FeeImportStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading =isShowLoading;
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    @observable pageSize = 10;
    @action setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable oilPriceObject ={};
    @action setOilPriceObject(oilPriceObject){
        this.oilPriceObject = oilPriceObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }
    /**
     * 查询列表
     */
    @observable feeList = null;
    @action getFeeList(page_num,page_size){
        this.setIsShowLoading(true);
        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        http.post('/website/report/query-report-passage-fee',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.pageSize;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.feeList = response.data;
        },err=>{
            this.setIsShowLoading(false);
            message.error(err);
        });
    }

    @observable isShowImportDialog = false;
    @action setIsShowImportDialog(isShowImportDialog){
        this.isShowImportDialog = isShowImportDialog;
    }

    @observable isShowImportLoading = false;
    @action setIsShowImportLoading(isShowImportLoading){
        this.isShowImportLoading = isShowImportLoading;
    }

    @observable isShowImportResuleDialog = false;
    @action setIsShowImportResuleDialog(isShowImportResuleDialog){
        this.isShowImportResuleDialog = isShowImportResuleDialog;
    }

    @observable isShowImportResultLoading = false;
    @action setIsShowImportResultLoading(isShowImportResultLoading){
        this.isShowImportResultLoading = isShowImportResultLoading;
    }

    /**
     * 获取当前文件
     */
    @observable current_file_url = '';
    @observable current_file_date = '';
    @observable current_file_name = '';
    @action getCurrentXLSX(){
        this.isShowLoading = true;
        http.post('/website/report/report-passage-fee-file-query',null,response=>{
            this.isShowLoading = false;
            this.current_file_url = response.current_oil_price_file_url;
            this.current_file_date=response.current_oil_price_file_date;
            this.current_file_name=response.current_oil_price_file_name;
            this.setIsShowImportDialog(true);
        },err=>{
            this.isShowLoading = false;
            message.error(err);
        });
    }

    /**
     * 上传通道手续费文件
     */
    @observable uploadResult = {};
    @action getUploadFeeFile(fileName,file){
        this.setIsShowImportLoading(true);
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('file', file);
        http.postFile('/website/report/upload-report-passage-fee',formData,response=>{
            this.uploadResult.success_count = response.success_count;
            this.uploadResult.failed_count = response.failed_count;
            this.uploadResult.check_result_file_urk = response.check_result_file_url;
            this.setIsShowImportLoading(false);
            this.setIsShowImportDialog(false);
            this.setIsShowImportResuleDialog(true);

        },err=>{
            this.setIsShowImportLoading(false);
            message.error(err);
        });
    }

}

export default FeeImportStore;

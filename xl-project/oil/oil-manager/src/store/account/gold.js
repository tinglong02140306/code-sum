import {observable,action} from "mobx";
import http from "../../http/http";
import {message} from "antd";

class GoldStore {

    @observable isShowEngineDialog = false;
    @action setIsShowEngineDialog(isShowEngineDialog){
        this.isShowEngineDialog = isShowEngineDialog;
    }

    @observable isShowEngineLoading = false;
    @action setIsShowEngineLoading(isShowEngineLoading){
        this.isShowEngineLoading = isShowEngineLoading;
    }

    @observable isShowLeadResuleDialog = false;
    @action setIsShowLeadResuleDialog(isShowLeadResuleDialog){
        this.isShowLeadResuleDialog = isShowLeadResuleDialog;
    }

    @observable isShowLeadResultLoading = false;
    @action setIsShowLeadResultLoading(isShowLeadResultLoading){
        this.isShowLeadResultLoading = isShowLeadResultLoading;
    }

    @observable isShowBatchDialog= false;
    @action setIsShowBatchDialog(isShowBatchDialog){
        this.isShowBatchDialog = isShowBatchDialog;
    }

    @observable isShowBatchLoading = false;
    @action setIsShowBatchLoading(isShowBatchLoading){
        this.isShowBatchLoading = isShowBatchLoading;
    }

    @observable page_size = 10;
    @action setPageSize(page_size){
        this.page_size = page_size;
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    @observable currentPage = 1;
    @action setCurrentPage(currentPage){
        this.currentPage = currentPage;
    }
    @observable isShowSubDialog= false;
    @action setIsShowSubDialog(isShowSubDialog){
        this.isShowSubDialog = isShowSubDialog;
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }

    //查询账单明细
    @observable accountList = [];
    @action getAccountList(page_num,page_size){
        this.setIsShowLoading(true);

        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        http.post('/website/account/balance-log-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.size = 'small';
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{
                item.key = item.id;
            });
            this.accountList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //导入加油金
    @observable uploadResult = {};
    @action getUploadPriceFile(fileName,file){
        this.setIsShowEngineLoading(true);
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('file', file);
        http.postFile('/website/account/balance-file-upload',formData,response=>{
            console.log(JSON.stringify(response));
            this.uploadResult.success_count = response.success_count;
            this.uploadResult.failed_count = response.failed_count;
            this.uploadResult.check_result_file_urk = response.check_result_file_url;
            this.setIsShowEngineLoading(false);
            this.setIsShowEngineDialog(false);
            this.setIsShowLeadResuleDialog(true);
        },err=>{
            this.setIsShowEngineLoading(false);
            message.error(err);
        });
    }

    /**
     * 获取当前文件
     */
    @observable current_file_url = '';
    @observable current_file_date = '';
    @observable current_file_name = '';
    @action getCurrentEngineXLSX(){
        this.isShowLoading = true;
        http.post('/website/account/balance-file-result',null,response=>{
            this.isShowLoading = false;
            this.current_file_url = response.result_url;
            this.current_file_date=response.result_file_date;
            this.current_file_name=response.result_file_name;
            this.setIsShowEngineDialog(true);
        },err=>{
            this.isShowLoading = false;
            message.error(err);
        });
    }

}

export default GoldStore;
import { observable, action } from "mobx";
import { isEmpty } from "../../utils/isEmpty";
import XLSX from 'xlsx';
import http from '../../http/http';
import { message } from "antd";
import { formatData } from "../../utils/formatDate";

class WhiteListStore {

    @observable isShowEngineDialog = false;
    @action setIsShowEngineDialog(isShowEngineDialog) {
        this.isShowEngineDialog = isShowEngineDialog;
    }

    @observable isShowEngineLoading = false;
    @action setIsShowEngineLoading(isShowEngineLoading) {
        this.isShowEngineLoading = isShowEngineLoading;
    }

    // @observable isShowLeadResuleDialog = false;
    // @action setIsShowLeadResuleDialog(isShowLeadResuleDialog) {
    //     this.isShowLeadResuleDialog = isShowLeadResuleDialog;
    // }

    // @observable isShowLeadResultLoading = false;
    // @action setIsShowLeadResultLoading(isShowLeadResultLoading) {
    //     this.isShowLeadResultLoading = isShowLeadResultLoading;
    // }

    @observable page_size = 15;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable currentPage = 1;
    @action setCurrentPage(currentPage) {
        this.currentPage = currentPage;
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }
    // 增加白名单 加载状态
    @observable loadingAdd = false;
    @action setLoadingAdd(isShow) {
        this.loadingAdd = isShow;
    }

    // 增加白名单
    @action addWhiteItem(params, callback) {
        this.loadingAdd = true;
        http.post('/website/pay-discount/bank-white/add', params, res => {
            message.info("白名单添加成功");
            this.loadingAdd = false;
            callback();
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    // 删除白名单
    @action deleteEvt(params) {
        this.loadingAdd = true;
        http.post('/website/pay-discount/bank-white/remove', params, res => {
            message.info("白名单删除成功");
            this.loadingAdd = false;
            this.getAccountList({ page_num: this.currentPage, page_size: this.page_size })
        }, err => {
            this.loadingAdd = false;
            message.error(err);
        });
    }

    //查询白名单列表
    @observable accountList = [];
    @action getAccountList(params) {
        this.setIsShowLoading(true);
        http.post('/website/pay-discount/bank-white/query', params, response => {
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = params.page_num;
            pagination.size = 'small';
            pagination.showTotal = () => {
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data && response.data.map(item => {
                item.key = item.id;
            });
            this.accountList = response.data;
        }, err => {
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //导入白名单
    @observable uploadResult = {};
    @action getUploadFile(fileName, file, act_code) {
        this.setIsShowEngineLoading(true);
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('file', file);
        formData.append('actCode', act_code);
        http.postFile('/website/pay-discount/bank-white/import', formData, response => {
            message.info("导入成功");
            console.log(JSON.stringify(response));
            // this.uploadResult.success_count = response.success_count;
            // this.uploadResult.failed_count = response.failed_count;
            // this.uploadResult.check_result_file_urk = response.check_result_file_url;
            this.setIsShowEngineLoading(false);
            this.setIsShowEngineDialog(false);
            // this.setIsShowLeadResuleDialog(true);
            this.getAccountList({ page_num: this.currentPage, page_size: this.page_size });
        }, err => {
            // this.setIsShowEngineLoading(false);
            message.error(err);
        });
    }


    /**
     * 获取当前文件
     */
    // @observable current_file_url = '';
    // @observable current_file_date = '';
    // @observable current_file_name = '';
    // @action getCurrentEngineXLSX() {
    //     this.isShowLoading = true;
    //     http.post('/website/account/balance-file-result', null, response => {
    //         this.isShowLoading = false;
    //         this.current_file_url = response.result_url;
    //         this.current_file_date = response.result_file_date;
    //         this.current_file_name = response.result_file_name;
    //         this.setIsShowEngineDialog(true);
    //     }, err => {
    //         this.isShowLoading = false;
    //         message.error(err);
    //     });
    // }
}

export default WhiteListStore;
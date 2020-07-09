import {observable,action} from "mobx";
import http from "../../http/http";
import {isEmpty} from "../../utils/isEmpty";
import {message} from "antd";

class BlacklistStore {

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

    /**
     * 获取当前文件
     */
    @observable current_file_url = '';
    @observable current_file_date = '';
    @observable current_file_name = '';
    @action getCurrentEngineXLSX(){
        this.isShowLoading = true;
        http.post('/website/shell/current-oil-price-file-query',null,response=>{
            this.isShowLoading = false;
            this.current_file_url = response.current_oil_price_file_url;
            this.current_file_date=response.current_oil_price_file_date;
            this.current_file_name=response.current_oil_price_file_name;
            this.setIsShowEngineDialog(true);
        },err=>{
            this.isShowLoading = false;
            message.error(err);
        });
    }

    @observable uploadResult = {};
    @action getUploadPriceFile(fileName,file){
        this.setIsShowEngineLoading(true);
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('file', file);
        http.postFile('/website/etcblack/upload-etc-black-list-file',formData,response=>{
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

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable typeDialog = 0;//0:新增 1:修改 2:查看
    @action setTypeDialog(typeDialog){
        this.typeDialog = typeDialog;
    }

    @observable dialogData= null;
    @action setDialogData(dialogData){
        this.dialogData = dialogData;
    }

    @observable etc_card_no = '';
    @action setEtcCardNo(etc_card_no){
        this.etc_card_no = etc_card_no;
    }

    @observable plate_no = '';
    @action setPlateNo(plate_no){
        this.plate_no = plate_no;
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }

    @observable blacklistList = [];
    @action getBlacklist(page_num,page_size,etc_card_no,plate_no){
        this.setIsShowLoading(true);
        this.setEtcCardNo(etc_card_no);
        this.setPlateNo(plate_no);

        const params = {
            page_num:page_num,
            page_size:page_size,
            etc_card_no:isEmpty(etc_card_no)?null:etc_card_no,
            plate_no:isEmpty(plate_no)?null:plate_no,
        }
        http.post('/website/etcblack/query-etc-black-list',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.size = 'small';
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{
                item.key = item.id;
            });
            this.blacklistList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }


    @action getAddBlacklist(etc_card_no,plate_no,plate_color,mobile){
        this.setIsShowSubDialog(true);
        const params = {
            etc_card_no:etc_card_no,
            plate_no:plate_no,
            plate_color:plate_color,
            mobile:mobile
        }
        http.post('/website/etcblack/add-etc-black-list',params,()=>{
            message.info("录入成功");
            this.setIsShowSubDialog(false);
            this.setIsShowDialog(false);
            this.getBlacklist(1,this.page_size,this.etc_card_no,this.plate_no);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    }

    @action getUpdateBlacklist(id,etc_card_no,plate_no,plate_color,mobile,currentPage){
        this.setIsShowSubDialog(true);
        const params = {
            id:id,
            etc_card_no:etc_card_no,
            plate_no:plate_no,
            plate_color:plate_color,
            mobile:mobile
        }
        http.post('/website/etcblack/update-etc-black-list',params,()=>{
            message.info("修改成功");
            this.setIsShowSubDialog(false);
            this.setIsShowDialog(false);
            this.getBlacklist(currentPage,this.page_size,this.etc_card_no,this.plate_no);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    }

    @action getDeleteBlacklist(id){
        const params = {
            id:id,
        }
        http.post('/website/etcblack/delete-etc-black-list',params,()=>{
            message.info('删除成功');
            this.setIsShowSubDialog(false);
            this.getBlacklist(this.currentPage,this.page_size,this.etc_card_no,this.plate_no);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    }
}

export default BlacklistStore;
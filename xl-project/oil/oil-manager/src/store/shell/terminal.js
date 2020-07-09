import {observable,action} from "mobx";
import http from "../../http/http";
import {isEmpty} from "../../utils/isEmpty";
import {message} from "antd";

class TerminalStore {

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
    @observable current_file_amount = 0;
    @action getCurrentEngineXLSX(){
        this.isShowLoading = true;
        http.post('/website/shell/current-oil-price-file-query',null,response=>{
            this.isShowLoading = false;
            this.current_file_url = response.current_oil_price_file_url;
            this.current_file_date=response.current_oil_price_file_date;
            this.current_file_name=response.current_oil_price_file_name;
            this.current_file_amount=response.amount||0;
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
        http.postFile('/website/shell/upload-oil-price-file',formData,response=>{
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

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }

    @observable terminal_id='';
    @action setTerminalId(terminal_id){
        this.terminal_id = terminal_id;
    }

    @observable terminal_name='';
    @action setTerminalName(terminal_name){
        this.terminal_name = terminal_name;
    }

    @observable group_id = '';
    @action setGroupId(group_id){
        this.group_id= group_id;
    }

    @observable oil_detail_id = '';
    @action setOilDetailId(oil_detail_id){
        this.oil_detail_id= oil_detail_id;
    }

    @observable terminalList = [];
    @action getTerminalList(page_num,page_size,terminal_id,terminal_name,group_id,oil_detail_id){
        this.setIsShowLoading(true);
        this.setTerminalId(terminal_id);
        this.setTerminalName(terminal_name);
        this.setGroupId(group_id);
        this.setOilDetailId(oil_detail_id);

        const params = {
            page_num:page_num,
            page_size:page_size,
            terminal_id:isEmpty(terminal_id)?null:terminal_id,
            terminal_name:isEmpty(terminal_name)?null:terminal_name,
            group_id:group_id===0?0:isEmpty(group_id)?null:group_id,
            oil_detail_id:oil_detail_id===0?0:isEmpty(oil_detail_id)?null:oil_detail_id
        }

        http.post('/website/shell/terminal-query',params,response=>{
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
            this.terminalList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    /**
    *立即更新全部
    */
    @action getUpdateNow(){
        this.setIsShowLoading(true);
        http.post('/website/shell/shell-oil-price-update',null,response=>{
            this.setIsShowLoading(false);
            message.info("更新完成");
            this.getTerminalList(1,18);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    /**
     *立即更新柴油
     */
    @action getUpdateDiesel(){
        this.setIsShowLoading(true);
        http.post('/website/shell/shell-diesel-oil-price-update',null,response=>{
            this.setIsShowLoading(false);
            message.info("更新完成");
            this.getTerminalList(1,18);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable oilList = [];
    @action getOilList(){
        http.post('/website/shell/oil-detail-query',null,response=>{
            this.oilList = response.data;
        },err=>{
            message.error(err)
        });
    }

    @observable groupList = [];
    @action getGroupList(){
        this.setIsShowLoading(true);
        http.post('/website/shell/terminal-group-query',null,response=>{
            this.groupList = response.data;
            this.setIsShowDialog(true);
            this.setIsShowLoading(false);
        },err=>{
            message.error(`终端分组数据获取失败,${err}`);
            this.setIsShowLoading(false);
        });
    }

    @action getGroupData(){
        http.post('/website/shell/terminal-group-query',null,response=>{
            this.setIsShowLoading(false);
            this.groupList = response.data;
        },err=>{
            message.error(`终端分组数据获取失败,${err}`);
            this.setIsShowLoading(false);
        });
    }

    @action getAddTerminalData(){
        this.setIsShowLoading(true);
        http.post('/website/shell/oil-detail-query',null,response=>{
            this.oilList = response.data;
            http.post('/website/shell/terminal-group-query',null,response=>{
                this.setIsShowLoading(false);
                this.groupList = response.data;
                this.setIsShowDialog(true);
            },()=>{
                this.setIsShowLoading(false);
                message.error("终端分组数据获取失败!");
            })
        },()=>{
            this.setIsShowLoading(false);
            message.error("油品类型数据获取失败!");
        });
    }

    @action getBatchUpdateData(){
        this.setIsShowLoading(true);
        http.post('/website/shell/oil-detail-query',null,response=>{
            this.oilList = response.data;
            http.post('/website/shell/terminal-group-query',null,response=>{
                this.setIsShowLoading(false);
                this.groupList = response.data;
                this.setIsShowBatchDialog(true);
            },()=>{
                this.setIsShowLoading(false);
                message.error("终端分组数据获取失败!");
            })
        },()=>{
            this.setIsShowLoading(false);
            message.error("油品类型数据获取失败!");
        });
    }

    @action getBatchUpdate(group_id,oil_detail_id,cost_price,list_price){
        this.setIsShowBatchLoading(true);
        const params = {
            group_id:group_id,
            oil_detail_id:oil_detail_id,
            // cost_price:cost_price||null,
            list_price:list_price||null
        }

        http.post('/website/shell/terminal-price-batch-update',params,()=>{
            this.setIsShowBatchLoading(false);
            message.info("批量修改成功");
            this.setIsShowBatchDialog(false);
            this.getTerminalList(1,this.page_size,this.terminal_id,this.terminal_name,this.group_id);
        },err=>{
            this.setIsShowBatchLoading(false);
            message.error(err);
        });
    }

    @action getAddTerminal(terminal_id,oil_detail_id,cost_price,list_price,terminal_name,group_id,discount_amount,xl_price){
        this.setIsShowSubDialog(true);
        const params = {
            terminal_id:terminal_id,
            oil_detail_id:oil_detail_id,
            // cost_price:cost_price,
            list_price:list_price,
            terminal_name:terminal_name,
            group_id:group_id,
            discount_amount:discount_amount,
            // xl_price:xl_price
        }
        console.log(JSON.stringify(params));
        http.post('/website/shell/terminal-add',params,()=>{
            message.info("录入成功");
            this.setIsShowSubDialog(false);
            this.setIsShowDialog(false);
            this.getTerminalList(1,this.page_size,this.terminal_id,this.terminal_name,this.group_id);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    } 

    @action getUpdateTerminal(id,cost_price,list_price,terminal_name,group_id,discount_amount,xl_price,currentPage){
        this.setIsShowSubDialog(true);
        const params = {
            id:id,
            // cost_price:cost_price,
            list_price:list_price,
            terminal_name:terminal_name,
            group_id:group_id,
            discount_amount:discount_amount,
            // xl_price:xl_price,
        }
        http.post('/website/shell/terminal-update',params,()=>{
            message.info("修改成功");
            this.setIsShowSubDialog(false);
            this.setIsShowDialog(false);
            this.getTerminalList(currentPage,this.page_size,this.terminal_id,this.terminal_name,this.group_id);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    } 

    @action getDelectTerminal(id){
        const params = {
            id:id,
        }
        http.post('/website/shell/terminal-remove',params,()=>{
            message.info('删除成功');
            this.setIsShowSubDialog(false);
            this.getTerminalList(this.currentPage,this.page_size,this.terminal_id,this.terminal_name,this.group_id);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowSubDialog(false);
        });
    } 
}

export default TerminalStore;
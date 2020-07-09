import {observable, action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';
import {oilIdJson} from '../../utils/utils';

class GroupStore {
    @observable isShowLoading = false;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable typeDialog = 0;//0:新增 1:修改 2:全量修改
    @action setTypeDialog(typeDialog) {
        this.typeDialog = typeDialog;
    }

    @observable pageSize = 10;

    @action setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    @observable dialogData = null;

    @action setDialogData(dialogData) {
        this.dialogData = dialogData;
    }

    @observable groupList = [];

    @action getGroupList() {
        this.setIsShowLoading(true);
        http.post('/website/shell/terminal-group-query', null, response => {
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.pageSize;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data && response.data.map(item => {
                item.key = item.id;
                const oils = oilIdJson(item.cost_price);
                for (const key in oils) {
                    if (oils.hasOwnProperty(key)) {
                        const value = oils[key];
                        item[key] = value;
                    }
                }    
            });
            this.groupList = response.data;
        }, err => {
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @action getAddGroup(group_name,cost_price,valid_time,invalid_time,xl_price_formula_gas,xl_price_formula_diesel) {
        this.setIsShowSubmitLoading(true);
        const params = {group_name: group_name,
            cost_price:cost_price,
            valid_time:valid_time,
            invalid_time:invalid_time,
            xl_price_formula_diesel:xl_price_formula_diesel,
            xl_price_formula_gas:xl_price_formula_gas,
        };
        http.post('/website/shell/terminal-group-add',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowGroupDialog(false);
            message.info("添加成功");
            this.getGroupList();
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    @action getUpdateGroup(id,group_name,cost_price,valid_time,invalid_time,xl_price_formula_gas,xl_price_formula_diesel) {
        this.setIsShowSubmitLoading(true);
        const params = {id: id, 
            group_name: group_name,
            cost_price:cost_price,
            valid_time:valid_time,
            invalid_time:invalid_time,
            xl_price_formula_gas:xl_price_formula_gas,
            xl_price_formula_diesel:xl_price_formula_diesel,
        };
        http.post('/website/shell/terminal-group-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowGroupDialog(false);
            this.getGroupList();
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    @action getUpdateAll(cost_price,valid_time,invalid_time,xl_price_formula_gas,xl_price_formula_diesel){
        this.setIsShowSubmitLoading(true);
        const params = {
            cost_price:cost_price,
            valid_time:valid_time,
            invalid_time:invalid_time,
            xl_price_formula_gas:xl_price_formula_gas,
            xl_price_formula_diesel:xl_price_formula_diesel,
        };
        http.post('/website/shell/terminal-group-list-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowGroupDialog(false);
            this.getGroupList();
            message.info("批量修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    @action getDeleteGroup(id) {
        this.setIsShowLoading(true);
        const params = {id: id};
        http.post('/website/shell/terminal-group-remove',params,()=>{
            this.getGroupList();
            message.info("删除成功");
        },err=>{
            this.setIsShowLoading(false);
        });
    }

    @observable isShowGroupDialog = false;

    @action setIsShowGroupDialog(isShowGroupDialog) {
        this.isShowGroupDialog = isShowGroupDialog;
    }

    @observable isShowSubmitLoading = false;

    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }
}

export default GroupStore;
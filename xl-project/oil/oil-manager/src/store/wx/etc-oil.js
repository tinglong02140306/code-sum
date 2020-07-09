
import {action, observable} from "mobx";
import http from "../../http/http";
import {message} from 'antd';
import {isEmpty} from "../../utils/isEmpty";
import {formatData} from "../../utils/formatDate";

class EtcOilStore {

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    @observable isLoadingTable = false;
    @action setIsLoadingTable(isLoadingTable){
        this.isLoadingTable = isLoadingTable;
    }

    @observable isShowDialog=false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable params = null;
    @action setParams(params){
        this.params = params;
    }

    @observable resourceList = [];
    @action getResourceList(params){
        this.isLoadingTable = true;
        this.params = params;
        params.resource_type = params.resource_type===0?null:params.resource_type;
        params.resource_use = params.resource_use===0?null:params.resource_use;
        params.resource_name = isEmpty(params.resource_name)?null:params.resource_name;
            http.post('/website/admin/param/static-resource-query',params,response=>{
            this.isLoadingTable = false;
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = params.page_size;
            pagination.current = params.page_num;
            pagination.showQuickJumper = true;
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{
                item.key = item.id;
            });
            this.resourceList= response.data;
        },err=>{
            this.isLoadingTable = false;
            message.error(err);
        });
    }

    @observable storeItem = null;
    @action setStoreItem(storeItem){
        this.storeItem = storeItem
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @action delectResorce(id){
        http.post('/website/admin/param/static-resource-remove',{id:id},response=>{
            message.info("删除成功");
            this.getResourceList(this.params);
        },err=>{
            message.error(err);
        });
    }


}

export default EtcOilStore;
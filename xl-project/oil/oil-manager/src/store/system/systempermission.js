import {observable,action} from 'mobx';
import http from "../../http/http";
import {addKeyId} from "../../utils/addKeyId";
import {message} from "antd/lib/index";

class SystemRole {
    @observable isShowDialog = false;
    @observable type = 1; //1 : 修改 2:新增 3:查看
    @action setIsShowDialog(isShowDialog,type){
        this.isShowDialog = isShowDialog;
        this.type = type;
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }


    @observable systemItemPermission = {};
    @action setSystemItemPermission(systemItemPermission){
        this.systemItemPermission = systemItemPermission;
    }

    //添加新权限
    @action getAddPermission(permission_name,permission_value) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            permission_name: permission_name,
            permission_value: permission_value,
        };
        http.post('/website/admin/permission-add',reqData,()=>{
            this.setIsShowLoading(false);
            message.info("添加成功");
            this.getPermissionList(1);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //修改权限
    @action getUpdatePermissionList(id,permission_name,permission_value){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
            permission_name: permission_name,
            permission_value: permission_value,
        };
        http.post('/website/admin/permission-update',reqData,()=>{
            message.info("修改成功");
            this.getPermissionList(1);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //删除权限
    @action deletePermissionList(id){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
        };
        http.post('/website/admin/permission-remove',reqData,response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getPermissionList(1);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }
    @observable searchPermissionId =""
    @action setSearchPermissionId(id){
        this.searchPermissionId = id;
    }

    @observable searchPermissionName =""
    @action setSearchPermissionName(permission_name){
        this.searchPermissionName = permission_name;
    }

    @observable searchPermissionValue = "";
    @action setSearchPermissionValue(permission_value){
        this.searchPermissionValue = permission_value;
    }


    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }
    //请求数据列表
    @observable permissionList = [];
    @action getPermissionList(page_num) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
        };
        http.post('/website/admin/permission-query',reqData,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            this.permissionList = addKeyId(response.data);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }
}
export default SystemRole;
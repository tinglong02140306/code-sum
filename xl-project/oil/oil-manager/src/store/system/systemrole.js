import {observable,action} from 'mobx';
import http from "../../http/http";
import {addKeyIdPermission} from "../../utils/addKeyIdPermission";
import {trim} from "../../utils/trim";
import {isEmpty} from "../../utils/isEmpty";
import {addPermissionTreeKey} from "../../utils/addPermissionTreeKey";
import {addPagesTreeKey} from "../../utils/addPagesTreeKey";
import {message} from "antd/lib/index";

class SystemRole {
    @observable isShowDialog = false;
    @observable type = 1; //1 : 修改  2:新增
    @action setIsShowDialog(isShowDialog,type){
        this.isShowDialog = isShowDialog;
        this.type = type;
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }
    @observable systemItemRole = {};
    @action setSystemItemRole(systemItemRole){
        this.systemItemRole = systemItemRole;
    }

    @observable isShowCheckDialog = false;
    @action setIsShowCheckDialog(isShowCheckDialog){
        this.isShowCheckDialog = isShowCheckDialog;
    }
    @observable isShowCheckLoading = false;
    @action setIsShowCheckLoading(isShowCheckLoading){
        this.isShowCheckLoading = isShowCheckLoading;
    }

    @observable selectPermission=[];
    @action setSelectPermission(selectPermission){
        this.selectPermission=selectPermission;
    }

    //添加新角色
    @action getAddRole(role_name,role_description,permission_id_array,page_id_array){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            role_name:isEmpty(role_name)?null:trim(role_name),
            role_description:isEmpty(role_description)?null:trim(role_description),
            // permission_id_array:isEmpty(permission_id_array)?null:trim(permission_id_array)
            permission_id_array: permission_id_array,
            page_id_array: page_id_array,

        };
        http.post('/website/admin/role-add',reqData,()=>{
            message.info("添加成功");
            this.getRoleList(1);
            this.setIsShowDialog(false);
            this.setIsShowLoading(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //修改角色
    @action getUpdateRole(id,role_name,role_description,permission_id_array,page_id_array){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
            role_name:isEmpty(role_name)?null:trim(role_name),
            role_description:isEmpty(role_description)?null:trim(role_description),
            permission_id_array: permission_id_array,
            page_id_array: page_id_array,
        };
        http.post('/website/admin/role-update',reqData,response=>{
            message.info("修改成功");
            this.getRoleList(1);
            this.setIsShowDialog(false);
            this.setIsShowLoading(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //删除角色
    @action deleteRole(id){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id:id,
        };
        http.post('/website/admin/role-remove',reqData,response=>{
            message.info("删除成功");
            this.getRoleList(1);
            this.setIsShowDialog(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable systemItemUser = {};
    @action setSystemItemUser(systemItemUser){
        this.systemItemUser = systemItemUser;
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }
    @observable searchRoleId =""
    @action setSearchRoleId(id){
        this.searchRoleId = id;
    }

    @observable searchRoleName =""
    @action setSearchRoleName(role_name){
        this.searchRoleName = role_name;
    }

    @observable searchRoleDescription = "";
    @action setSearchRoleDescription(role_description){
        this.searchRoleDescription = role_description;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }
    //页面列表
    @observable pagesList = [];
    @action getPagesList(page_num) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_num: page_num,
            page_size: 999,
        };
        http.post('/website/webpage/web-page-query',reqData,response=>{
            this.pagesList = addPagesTreeKey(response.data);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }
    //请求数据列表
    @observable permissionList = [];
    @observable roleList = [];
    @action getRoleList(page_num, callBack) {

        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            page_num: page_num,
            page_size: this.page_size,
        };
        const reqDataPermission = {
            page_num: page_num,
            page_size: 999,
        };
        const reqDataPages = {
            page_num: page_num,
            page_size: 999,
        };
        http.post('/website/admin/permission-query',reqDataPermission,response=>{
            this.permissionList = addPermissionTreeKey(response.data);
            http.post('/website/admin/page-query',reqDataPages,response=>{
                this.pagesList = addPagesTreeKey(response.data);
                http.post('/website/admin/role-query',reqData,response=>{
                    this.setIsShowLoading(false);
                    const pagination = {};
                    pagination.pageSize = this.page_size;
                    pagination.current = page_num;
                    pagination.total=response.amount;
                    pagination.showQuickJumper = true;
                    pagination.showTotal=()=>{
                        return `总共 ${response.amount} 条数据`;
                    }
                    this.setPagination(pagination);
                    this.roleList = addKeyIdPermission(response.data,this.permissionList,this.pagesList);
                },err=>{
                    message.error(err);
                    this.setIsShowLoading(false);
                });
            },err=>{
                message.error(err);
                this.setIsShowLoading(false);
            });
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }


}
export default SystemRole;
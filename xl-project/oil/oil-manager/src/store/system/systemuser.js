import {
    observable,
    action
} from 'mobx';
import {
    addKeyId
} from "../../utils/addKeyId";
import {
    trim
} from "../../utils/trim";
import {
    isEmpty
} from "../../utils/isEmpty";
import http from "../../http/http";
import {
    addTreeKeyUser
} from "../../utils/addTreeKeyUser";
import {
    message
} from 'antd';

class SystemUser {

    @observable isShowAddUpdateDialog = false;
    @observable type = 1; //1 : 修改  2:新增
    @action setIsShowAddUpdateDialog(isShowDialog, type) {
        this.isShowAddUpdateDialog = isShowDialog;
        this.type = type;
    }

    @observable isShowAddUpdateLoading = false;

    @action setIsShowAddUpdateLoading(isShowAddUpdateLoading) {
        this.isShowAddUpdateLoading = isShowAddUpdateLoading;
    }

    @observable selectRole = [];

    @action setSelectRole(selectRole) {
        this.selectRole = selectRole;
    }

    @observable roleList = [];
    @action getRoleList() {
        const reqData = {
            page_num: 1,
            page_size: 999
        }
        http.post('/website/admin/role-query',reqData,response=>{
            // response.data&&response.data.map((item,index)=>{
            //     item.key = index;
            //     return item;
            // });
            this.roleList = response.data;
            // this.roleList = addTreeKeyUser(response.data);
        },err=>{
            message.error(err);
        });
    }

    @observable showPsw = false;
    @action setShowPsw(showPsw){
        this.showPsw = showPsw;
    }

    @observable addUserName = "";
    @observable addPsw = "";

    //添加新用户
    @action getAddUser(username, mobile, real_name, role_id_array, partner, partner_id,role_id) {
        this.setIsShowAddUpdateLoading(true);
        const reqData = {
            username: isEmpty(username) ? null : trim(username),
            mobile: isEmpty(mobile) ? null : trim(mobile),
            real_name: isEmpty(real_name) ? null : trim(real_name),
            partner_id: partner_id,
            role_id: role_id,
            partner: partner,
        };
        http.post('/website/admin/user-add',reqData,response=>{
            this.setIsShowAddUpdateLoading(false);
            this.setIsShowAddUpdateDialog(false);
            this.addUserName= username;
            this.addPsw = response.password;
            this.setShowPsw(true);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowAddUpdateLoading(false);
        });
    }

    //修改用户信息
    @action getUpdateUser(id, mobile, real_name, role_id_array, partner, partner_id,role_id) {
        this.setIsShowAddUpdateLoading(true);
        const reqData = {
            id: id,
            mobile: isEmpty(mobile) ? null : trim(mobile),
            real_name: isEmpty(real_name) ? null : trim(real_name),
            // role_id_array: role_id_array,
            partner_id: partner_id,
            partner: partner,
            role_id: role_id,
        };
        http.post('/website/admin/user-update',reqData,()=>{
            this.setIsShowAddUpdateLoading(false);
            this.setIsShowAddUpdateDialog(false);
            message.info("修改成功");
            this.getUserList(this.page_num, this.username, this.searchMobile, this.searchRealName, this.searchLocked);
        },err=>{
            message.error(err);
            this.setIsShowAddUpdateLoading(false);
        });
    }


    @observable isShowPreviewResetDialog = false;
    @observable previewResetType = 3; //3 : 查看 4:重置密码
    @action setIsShowPreviewResetDialog(isShowPreviewResetDialog, previewResetType) {
        this.isShowPreviewResetDialog = isShowPreviewResetDialog;
        this.previewResetType = previewResetType;
    }

    @observable isShowPreviewResetLoading = false;

    @action setIsShowPreviewResetLoading(isShowPreviewResetLoading) {
        this.isShowPreviewResetLoading = isShowPreviewResetLoading;
    }

    //重置密码
    @action getResetPassword(recode) {
        this.setIsShowPreviewResetLoading(true);
        const reqData = {
            id: recode.id,
        }
        http.post('/website/admin/user-password-reset',reqData,response=>{
            this.setIsShowPreviewResetLoading(false);
            this.setIsShowPreviewResetDialog(false);
            message.info("重置密码成功");
            this.addUserName= recode.username;
            this.addPsw = response.password;
            this.setShowPsw(true);
        },err=>{
            message.error(err);
            this.setIsShowPreviewResetLoading(false);
        });
    }

    @observable isShowLoading = false;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable systemItemUser = {};

    @action setSystemItemUser(systemItemUser) {
        this.systemItemUser = systemItemUser;
    }

    //删除用户
    @action deleteUser(id) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id: id
        }
        console.log("/website/admin/user-remove");
        http.post('/website/admin/user-remove',reqData,response=>{
            message.info("删除成功");
            this.getUserList(this.page_num, this.username, this.searchMobile, this.searchRealName, this.searchLocked);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //锁定用户
    @action getLockUser(id) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id: id
        }
        http.post('/website/admin/user-lock',reqData,response=>{
            message.info("锁定成功");
            this.getUserList(this.page_num, this.username, this.searchMobile, this.searchRealName, this.searchLocked);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //用户解锁
    @action getUnLockUser(id, role_id_array) {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const reqData = {
            id: id,
            role_id_array: role_id_array
        }
        http.post('/website/admin/user-unlock',reqData,response=>{
            message.info("解锁成功");
            this.getUserList(this.page_num, this.username, this.searchMobile, this.searchRealName, this.searchLocked);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }


    @observable searchMobile = ""

    @action setSearchMobile(mobile) {
        this.searchMobile = mobile;
    }

    @observable searchRealName = "";

    @action setSearchRealName(real_name) {
        this.searchRealName = real_name;
    }

    @observable username = "";

    @action setUserName(username) {
        this.username = username;
    }

    @observable searchLocked = "";

    @action setSearchLocked(locked) {
        this.searchLocked = locked;
    }

    @action setSearchInfo(username, searchMobile, searchRealName, searchLocked) {
        this.username = username;
        this.searchMobile = searchMobile;
        this.searchLocked = searchLocked;
        this.searchRealName = searchRealName;
    }

    @observable page_size = 10;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }
    @observable page_num = 1;
    @action setPageNum(page_num) {
        this.page_num = page_num;
    }

    @observable disableFetch = false;
    @action setDisableFetch(disableFetch){
        this.disableFetch = disableFetch;
    }

    @observable partnerList = [];
    @observable defaultPartnerId = null;

    @action getPartnerList() {
        const reqDataRole = {
            page_num: 1,
            page_size: 999
        }
        http.post('/website/partner/top-query',reqDataRole,response=>{
            this.partnerList = response.data;
            this.defaultPartnerId = response.data && response.data[0] && response.data[0].partner_id;
            this.setDisableFetch(false);
            this.partnerList = response.data;
        },err=>{
            message.error(err);
            this.setDisableFetch(false);
        });
    }

    //列表
    @observable userList = [];

    @action getUserList(page_num, username, real_name, mobile, locked) {
        this.setPageNum(page_num);
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        this.setSearchInfo(username, mobile, real_name, locked);
        const reqData = {
            page_num: this.page_num,
            page_size: this.page_size,
            username: isEmpty(this.username) ? null : trim(this.username),
            // mobile: isEmpty(this.searchMobile) ? null : trim(this.searchMobile),
            real_name: isEmpty(this.searchRealName) ? null : trim(this.searchRealName),
            // locked: locked
        }

        const reqDataRole = {
            page_num: 1,
            page_size: 999
        }
        http.post('/website/admin/user-query',reqData,response=>{
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.userList = response.data;
            // this.userList = addKeyId(response.data, this.roleList);
            this.setIsShowLoading(false);
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
        // http.post('/website/admin/role-query',reqDataRole,response=>{
        //     this.roleList = addTreeKeyUser(response.data);
        // },err=>{
        //     message.error(err);
        //     this.setIsShowLoading(false);
        // });
    }
}

export default SystemUser;
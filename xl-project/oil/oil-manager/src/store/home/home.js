import {observable,action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';
import Store from '../store';


class HomeStore {
    constructor(){
        this.store = new Store();
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }

    @observable isShowPasswordDialog = false;
    @action setIsShowPasswordDialog(isShowPasswordDialog){
        this.isShowPasswordDialog = isShowPasswordDialog;
    }

    @observable isShowUpdateLoading = false;
    @action setIsShowUpdateLoading(isShowUpdateLoading){
        this.isShowUpdateLoading= isShowUpdateLoading;
    }

    //是否已重置
    @observable isBeenReset = false;
    @action setIsBeenReset(isBeenReset){
        this.isBeenReset= isBeenReset;
    }
    //退出成功
    @observable isLogOut = false;
    @action setLogOut(isLogOut){
        this.isLogOut= isLogOut;
    }


    //重置密码
    @action getResetPassword(old_password,new_password){
        if (!this.isShowUpdateLoading) {
            this.setIsShowUpdateLoading(true);
        }
        const reqData = {
            old_password: old_password,
            new_password: new_password,
        };
        http.post('/website/user/user-password-update',reqData,()=>{
            message.info("重置成功,请重新登录");
            this.setIsShowPasswordDialog(false);
            // this.setIsBeenReset(true);
            this.setIsTokenOut(true);
        },err=>{
            message.error(err);
            this.setIsShowUpdateLoading(false);
        });
    }

    //退出登录
    @action getLogOut(callBack){
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/user/user-logout',null,()=>{
            this.setIsShowLoading(false);
            callBack(true);
        },err=>{
            callBack(false);
            this.setIsShowLoading(false);
            message.error(err);
        });
    }

    @observable isTokenOut = false;
    @action setIsTokenOut(isTokenOut) {
        this.isTokenOut = isTokenOut;
    }

}

export default new HomeStore();
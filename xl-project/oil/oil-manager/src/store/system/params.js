import {observable, action} from 'mobx';
import http from '../../http/http';
import {message} from 'antd';
class Params {

    @observable result = {};
    @action getParams() {
        http.post('/website/admin/refresh-sys-params',null,response=>{
            message.info(response.result_msg);
        },err=>{
            message.error(err);
        });
    }


    @action getSysParams() {
        http.post('/website/admin/refresh-sys-map',null,response=>{
            message.info(response.result_msg);
        },err=>{
            message.error(err);
        });
    }

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    //重置位置缓存
    @action resetAllGeo() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/reset-all-geo',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }

    //重置油价缓存
    @action resetAllPrice() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/reset-all-price',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }

    //重置油站信息缓存
    @action resetAllEntity() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/reset-all-entity',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }

    //重置微信小程序油站信息缓存
    @action resetWxEntity() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/reset-all-station-entity',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }

    //生成加油站数据文件
    @action buildStationData() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/build-station-data-file',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }

    //智慧油客获取信息
    @action getStationZhyk() {
        this.setIsShowLoading(true)
        http.post('/website/gasstation/get-station-from-zhyk',null,response=>{
            this.setIsShowLoading(false)
            message.info(response.result_msg);
        },err=>{
            this.setIsShowLoading(false)
            message.error(err);
        });
    }
}

export default Params;
import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
class ImageStore {


    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @observable stationArray = [];
    @action setStationArray(stationArray){
        this.stationArray = stationArray;
    }

    @observable isShowBulkDialog= false;
    @action setIsShowBulkDialog(isShowBulkDialog){
        this.isShowBulkDialog = isShowBulkDialog;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable stationImgObject ={};
    @action setStationImgObject(stationImgObject){
        this.stationImgObject = stationImgObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }

    @observable image_url = "";
    @action setImageUrl(image_url) {
        this.image_url = image_url;
        this.setIsCanPreview(true);
    }
    @observable isCanPreview = false;
    @action setIsCanPreview(isCanPreview) {
        this.isCanPreview = isCanPreview;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;
    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable page_num = 0;
    @action setPageNum(page_num) {
        this.page_num = page_num;
    }

    @observable params = null;
    @action setParams(params){
        this.params = params;
    }

    //品牌查询
    @observable brandList = [];
    @action getBrandQuery() {
        this.setIsShowLoading(true);
        const params = {
            page_num:0,
            page_size:0
        }
        http.post('/website/gasstation/brand-query',params,response=>{
            this.setIsShowLoading(false);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });

            this.brandList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable dataList = [];//加油站图片查询
    @action getStationImage(params) {
        // const params = {
        //     gas_station_name: isEmpty(gas_station_name)?null:trim(gas_station_name),
        //     xl_id: isEmpty(xl_id)?null:trim(xl_id),
        //     is_image: isEmpty(is_image)?null:trim(is_image),
        //
        // };
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/gasstation/station-image-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = this.page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });

            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //修改油站图片
    @action getUpdateStationImg(id,file) {
        this.setIsShowSubmitLoading(true);
        const params = {
            id: id,
            file: file,
        };
        http.post('/website/gasstation/station-image-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getStationImage();
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteResource(id){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/station-image-remove',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getStationImage(this.params);
        },err=>{
            message.error(err);
        });
    }

}

export default ImageStore;
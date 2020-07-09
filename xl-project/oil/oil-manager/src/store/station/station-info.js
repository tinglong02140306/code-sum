import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
import {formatData} from "../../utils/formatDate";
class StationInfoStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable plainOptions= [];
    @action setPlainOptions(plainOptions){
        this.plainOptions = plainOptions;
    }

    @observable stationInfoObject ={};
    @action setStationInfoObject(stationInfoObject){
        this.stationInfoObject = stationInfoObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
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

    @observable isShowPayDialog= false;
    @action setIsShowPayDialog(isShowPayDialog){
        this.isShowPayDialog = isShowPayDialog;
    }

    @observable payType = 1;//1:添加2:移除
    @observable payNum = 0;//油站个数
    @observable station_id_array = [];//油站数组
    @action setPayType(payType,payNum,station_id_array){
        this.payType = payType;
        this.payNum = payNum;
        this.station_id_array = station_id_array;
    }

    @observable showSelect = false;//油站数组
    @action setShowSelect(showSelect){
        this.showSelect = showSelect;
    }

    // @observable station_id_array = [];//油站数组
    // @action setStationIdArray(station_id_array){
    //     this.station_id_array = station_id_array;
    //     console.log(station_id_array);
    // }

    @observable isPayLoading = false;
    @action setIsPayLoading(isPayLoading) {
        this.isPayLoading = isPayLoading;
    }

    @observable isShowRoadDialog= false;
    @action setIsShowRoadDialog(isShowRoadDialog){
        this.isShowRoadDialog = isShowRoadDialog;
    }

    @observable isShowRoadLoading = false;
    @action setIsShowRoadLoading(isShowRoadLoading) {
        this.isShowRoadLoading = isShowRoadLoading;
    }

    @observable roadPagination = {};
    @action setRoadPagination(roadPagination) {
        this.roadPagination = roadPagination;
    }

    @observable road_page_size = 10;
    @action setRoadPageSize(road_page_size) {
        this.road_page_size = road_page_size;
    }

    @observable road_page_num = 0;
    @action setRoadPageNum(road_page_num) {
        this.road_page_num = road_page_num;
    }

    @observable roadParams = null;
    @action setRoadParams(roadParams){
        this.roadParams = roadParams;
    }

    @observable roadData = null;
    @action setRoadData(roadData){
        this.roadData = roadData;
    }

    //合作伙伴列表查询
    @observable companyList = [];
    @action getCompanyQuery() {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        const params = {
            page_num:0,
            page_size:0
        }
        http.post('/website/gasstation/company-query',params,response=>{
            this.setIsShowLoading(false);
            response.data&&response.data.map((item,index)=>{item.key = index;});
            this.companyList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    //油品查询
    @observable oilDetailList = [];
    @action getOilDetailQuery() {
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/gasstation/oil-detail-query','',response=>{
            this.setIsShowLoading(false);
            response.data&&response.data.map((item,index)=>{item.key = index;});
            this.oilDetailList = response.data;
            for (let i=0; i<response.data.length; i++){
                if (response.data[i].oil_type){
                    this.plainOptions.push({label:response.data[i].oil_level+response.data[i].oil_code+response.data[i].oil_type , value: response.data[i].xl_oil_code})
                }else {
                    this.plainOptions.push({label:response.data[i].oil_level+response.data[i].oil_code , value: response.data[i].xl_oil_code})
                }
            }
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
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

    //道路列表查询
    @observable roadList = [];
    @action getRoadQuery(roadParams) {
        console.log(JSON.stringify(roadParams));
        this.roadParams = roadParams;
        if (!this.isShowRoadLoading) {
            this.setIsShowRoadLoading(true);
        }
        http.post('/website/gasstation/road-query',roadParams,response=>{
            this.setIsShowRoadLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.road_page_size;
            pagination.current = this.road_page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setRoadPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });

            this.roadList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowRoadLoading(false);
        });
    }

    //列表查询
    @observable dataList = [];
    @action getStationQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        console.log(JSON.stringify(params))
        http.post('/website/gasstation/station-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = this.page_num;
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

    //增加
    // @action addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no) {
    @action addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments) {
        this.setIsShowSubmitLoading(true);
        const params = {
            full_name:isEmpty(full_name)?null:trim(full_name),
            name:isEmpty(name)?null:name,
            province_code:isEmpty(province_code)?null:province_code,
            province_name:isEmpty(province_name)?null:province_name,
            city_code:isEmpty(city_code)?null:city_code,
            city_name:isEmpty(city_name)?null:city_name,
            county_code:isEmpty(county_code)?null:county_code,
            county_name:isEmpty(county_name)?null:county_name,
            address:isEmpty(address)?null:trim(address),
            coordinate:isEmpty(coordinate)?null:trim(coordinate),
            brand_id:isEmpty(brand_id)?null:Number(brand_id),
            on_high:isEmpty(on_high)?null:on_high,
            support_oil:isEmpty(support_oil)?null:support_oil,
            road_id:isEmpty(road_id)?null:road_id,
            road_code:isEmpty(road_code)?null:road_code,
            road_name:isEmpty(road_name)?null:road_name,
            contact_person:isEmpty(contact_person)?null:contact_person,
            contact_phone:isEmpty(contact_phone)?null:contact_phone,
            company_id:isEmpty(company_id)?null:Number(company_id),
            xl_merchant_id:isEmpty(xl_merchant_id)?null:xl_merchant_id,
            // extend_no:isEmpty(extend_no)?null:extend_no,
            email:isEmpty(email)?null:trim(email),
            printer_no:isEmpty(printer_no)?null:trim(printer_no),
            support_payments:isEmpty(support_payments)?null:support_payments,
        };
        console.log(JSON.stringify(params));
        http.post('/website/gasstation/station-add',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            // this.setPlainOptions([]);
            this.getStationQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //修改
    // @action updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no) {
    @action updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments) {
        this.setIsShowSubmitLoading(true);
        const params = {
            id:isEmpty(id)?null:id,
            full_name:isEmpty(full_name)?null:trim(full_name),
            name:isEmpty(name)?null:name,
            province_code:isEmpty(province_code)?null:province_code,
            province_name:isEmpty(province_name)?null:province_name,
            city_code:isEmpty(city_code)?null:city_code,
            city_name:isEmpty(city_name)?null:city_name,
            county_code:isEmpty(county_code)?null:county_code,
            county_name:isEmpty(county_name)?null:county_name,
            address:isEmpty(address)?null:trim(address),
            coordinate:isEmpty(coordinate)?null:trim(coordinate),
            brand_id:isEmpty(brand_id)?null:Number(brand_id),
            on_high:isEmpty(on_high)?null:on_high,
            support_oil:isEmpty(support_oil)?null:support_oil,
            road_id:isEmpty(road_id)?null:road_id,
            road_code:isEmpty(road_code)?null:road_code,
            road_name:isEmpty(road_name)?null:road_name,
            contact_person:isEmpty(contact_person)?null:contact_person,
            contact_phone:isEmpty(contact_phone)?null:contact_phone,
            company_id:isEmpty(company_id)?null:Number(company_id),
            xl_merchant_id:isEmpty(xl_merchant_id)?null:xl_merchant_id,
            // extend_no:isEmpty(extend_no)?null:extend_no,
            email:isEmpty(email)?null:trim(email),
            printer_no:isEmpty(printer_no)?null:trim(printer_no),
            support_payments:isEmpty(support_payments)?null:support_payments,
        };
        console.log(JSON.stringify(params));
        http.post('/website/gasstation/station-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            // this.setPlainOptions([]);
            this.getStationQuery(this.params);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteStation(id){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/station-remove',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getStationQuery(this.params);
        },err=>{
            message.error(err);
        });
    }
    //状态变更
    @action changeStationStatus(id,usage_status){
        this.setIsShowLoading(true);
        http.post('/website/gasstation/station-status-change',{id:id,usage_status:usage_status},response=>{
            this.setIsShowLoading(false);
            message.info("设置成功");
            this.getStationQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

    //批量修改支付方式
    @action changeStationPayment(station_id_array,support_payments){
        const params = {
            station_id_array:station_id_array,
            support_payments:support_payments
        }
        console.log('params',params)
        this.setIsPayLoading(true);
        http.post('/website/gasstation/change-station-payment',params,response=>{
            this.setIsPayLoading(false);
            message.info("修改成功");
            this.setIsShowPayDialog(false);
            this.setPayType(1,0,[]);
            this.getStationQuery(this.params);
            this.setShowSelect(false);
        },err=>{
            this.setIsPayLoading(false);
            message.error(err);
        });
    }

}

export default StationInfoStore;
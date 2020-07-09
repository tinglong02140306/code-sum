import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
import {addTreeKeyBrand} from "../../utils/utils";

class DiscountStationStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable typeModal = 0;//0:新增 1:修改 2 :查看 3：查询
    @action setTypeModal(typeModal){
        this.typeModal = typeModal;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable stationTerminalObject ={};
    @action setStationTerminalObject(stationTerminalObject){
        this.stationTerminalObject = stationTerminalObject;
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

    @observable isShowSearchDialog= false;
    @action setIsShowSearchDialog(isShowSearchDialog){
        this.isShowSearchDialog = isShowSearchDialog;
    }

    @observable isShowSearchLoading = false;
    @action setIsShowSearchLoading(isShowSearchLoading) {
        this.isShowSearchLoading = isShowSearchLoading;
    }

    @observable searchPagination = {};
    @action setSearchPagination(searchPagination) {
        this.searchPagination = searchPagination;
    }

    @observable search_page_size = 5;
    @action setSearchPageSize(search_page_size) {
        this.search_page_size = search_page_size;
    }

    @observable search_page_num = 0;
    @action setSearchPageNum(search_page_num) {
        this.search_page_num = search_page_num;
    }

    @observable searchParams = null;
    @action setSearchParams(searchParams){
        this.searchParams = searchParams;
    }

    @observable searchData = null;
    @action setSearchData(searchData){
        this.searchData = searchData;
    }

    @observable operationData = null;
    @action setOperationData(operationData){
        this.operationData = operationData;
    }

    @observable isShowResultDialog= false;
    @observable type = 1; //1 : 返回结果  2:直接查看 3:请求失败
    @action setIsShowResultDialog(isShowResultDialog,type){
        this.isShowResultDialog = isShowResultDialog;
        this.type = type;
    }
    @observable failed_array = [];

    //折扣列表查询
    @observable discountDataList = [];
    @action getDiscountQuery(page_num,page_size) {
        http.post('/website/discount/discount_query',{page_num:page_num,page_size:page_size},response=>{
            this.discountDataList = response.data;
        },err=>{
            message.error(err);
        });
    }

    //合作伙伴列表查询
    @observable companyList = [];
    @action getCompanyQuery() {
        if (!this.isShowSearchLoading) {
            this.setIsShowSearchLoading(true);
        }
        const params = {
            page_num:0,
            page_size:0
        }
        http.post('/website/gasstation/company-query',params,response=>{
            this.setIsShowSearchLoading(false);
            response.data&&response.data.map((item,index)=>{item.key = index;});
            this.companyList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowSearchLoading(false);
        });
    }

    //油站列表查询
    @observable stationList = [];
    @action getStationQuery(params) {
        // this.params = params;
        if (!this.isShowSearchLoading) {
            this.setIsShowSearchLoading(true);
        }
        console.log(JSON.stringify(params));
        http.post('/website/gasstation/station-query',params,response=>{
            this.setIsShowSearchLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.search_page_size;
            pagination.current = this.search_page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setSearchPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.stationList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowSearchLoading(false);
        });
    }

    /**
     * 品牌列表
     * @type {Array}
     */
        //品牌查询
    @observable brandList = [];
    @action getBrandQuery() {
        const params = {
            page_num: 0,
            page_size: 0
        }
        http.post('/website/gasstation/brand-query', params, response => {
            // console.log('brandList'+this.brandList);
            this.brandList = addTreeKeyBrand(response.data);
        }, err => {
            message.error(err);
        });
    }

    //油站关联列表查询
    @observable dataList = [];
    @action getDiscountStationQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        console.log(JSON.stringify(params));
        http.post('/website/discount/discount_station_query',params,response=>{
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
    @action addDiscountStation(discount_id,discount_name,station_array) {
        this.setIsShowSubmitLoading(true);
        const params = {
            discount_id:discount_id,
            discount_name:discount_name,
            station_array:station_array,
        };
        http.post('/website/discount/discount_station_add',params,response=>{
            this.setIsShowSubmitLoading(false);
            if (this.operationData){
                this.setOperationData(null);
            }
            if (response.failed_array){
                this.failed_array = response.failed_array;
                this.setIsShowResultDialog(true);
            }
            this.setIsShowDialog(false);
            this.getDiscountStationQuery(this.params);
            message.info("添加成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    //删除
    @action deleteDiscountStation(id){
        this.setIsShowLoading(true);
        http.post('/website/discount/discount_station_delete',{id:id},response=>{
            this.setIsShowLoading(false);
            message.info("删除成功");
            this.getDiscountStationQuery(this.params);
        },err=>{
            message.error(err);
        });
    }

    @observable isShowSpinLoading = false;
    @action setIsShowSpinLoading(isShowSpinLoading) {
        this.isShowSpinLoading = isShowSpinLoading;
    }

    /**
     * Modal 显示隐藏设置油站
     * @type {boolean}
     */
    @observable isShowActivityStationSetModal = false;
    @action setIsShowActivityStationSetModal(typeModal, isShowActivityStationSetModal, activityObject) {
        this.isShowActivityStationSetModal = isShowActivityStationSetModal;
        this.activityObject = activityObject;
    }

    /**
     * 提交loading
     * @type {boolean}
     */
    @observable isShowActivityManageModalLoading = false;
    @action setIsShowActivityManageModalLoading(isShowActivityManageModalLoading) {
        this.isShowActivityManageModalLoading = isShowActivityManageModalLoading
    }

    //油站混合查询
    @observable stationMultiList = [];
    @action getStationMultiQuery(brand_id_array, province_code_array) {
        const params = {
            page_num: 1,
            page_size: 0,
            brand_id_array: brand_id_array,
            province_code_array: province_code_array,
        }
        if (!this.isShowSpinLoading) {
            this.setIsShowSpinLoading(true);
        }
        http.post('/website/gasstation/station-multi-query', params, response => {
            this.setIsShowSpinLoading(false);
            const mockData = [];
            response.data && response.data.map((item, index) => {
                item.key = index;
                //处理穿梭框数据
                const data = {
                    key: item.id,
                    title: item.name,
                    description: item.full_name,
                };
                mockData.push(data);
            });
            this.stationMultiList = mockData;
        }, err => {
            message.error(err);
            this.setIsShowSpinLoading(false);
        });
    }

}

export default DiscountStationStore;
import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {trim} from "../../utils/trim";
class BillTicketStore {

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

    //列表查询
    @observable dataList = [];
    @action getOrderTicketQuery(params) {
        this.params = params;
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        console.log(JSON.stringify(params));
        http.post('/website/bill-fix/order-query-ticket',params,response=>{
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

    //打印小票
    @action billFixPrintTicket(order_no){
        this.setIsShowLoading(true);
        http.post('/website/bill-fix/print-ticket',{order_no:order_no},response=>{
            this.setIsShowLoading(false);
            message.info("操作成功");
            this.getOrderTicketQuery(this.params);
        },err=>{
            this.setIsShowLoading(false);
            message.error(err);
        });
    }

}

export default BillTicketStore;
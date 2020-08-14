import {observable,action} from 'mobx';
import XLSX from 'xlsx';
import {isEmpty} from '../../utils/isEmpty';
import http from "../../http/http";
import {formatData} from "../../utils/formatDate";
import {formatTime} from "../../utils/formatTime";
import {message} from 'antd';
import {menus} from "../../page/login/menus";
class OrderStore {

    @observable isShowOrderDialog= false;
    @action setIsShowOrderDialog(isShowOrderDialog){
        this.isShowOrderDialog = isShowOrderDialog;
    }

    @observable isShowOrderChildrenDialog=false;
    @action setIsShowOrderChildrenDialog(isShowOrderChildrenDialog){
        this.isShowOrderChildrenDialog = isShowOrderChildrenDialog;
    }

    @observable isShowOrderLoading=false;
    @action setIsShowOrderLoading(isShowOrderLoading){
        this.isShowOrderLoading = isShowOrderLoading;
    }
    @observable isShowButtonLoading=false;
    @action setIsShowButtonLoading(isShowButtonLoading){
        this.isShowButtonLoading = isShowButtonLoading;
    }

    @observable orderChildrenObject ={};
    @action setOrderChildrenObject(orderChildrenObject){
        this.orderChildrenObject = orderChildrenObject;
    }

    @observable pagination = {};
    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable orderList=[];
    @action getOrderList(page_num,page_size,start_date,end_date,partner_id,
                         order_no,card_id,out_user_id,out_order_no,oil_type,terminal_id,order_status,etc_card_no,channel,user_mobile,xlpay_order_no){
        this.setIsShowOrderLoading(true);
        let reqData = {
            page_num: page_num,
            page_size: page_size,
            channel:isEmpty(channel)?null:channel,
            // card_id:isEmpty(card_id)?null:card_id,
            order_no:isEmpty(order_no)?null:order_no,
            terminal_id:isEmpty(terminal_id)?null:terminal_id,
            order_status:isEmpty(order_status)?null:order_status,
            // start_date:isEmpty(start_date)?null:formatData(start_date),
            // end_date:isEmpty(end_date)?null:formatData(end_date),

            start_time:isEmpty(start_date)?null:formatTime(start_date),
            end_time:isEmpty(end_date)?null:formatTime(end_date),
            station_id: isEmpty(this.searchData)?null:this.searchData.id,
            mobile:isEmpty(user_mobile)?null:user_mobile,
            xlpay_order_no:isEmpty(xlpay_order_no)?null:xlpay_order_no,

            // oil_type:oil_type===2?null:oil_type,
        };
        if (channel===0){
            let reqData0 = {
                partner_id:isEmpty(partner_id)?null:partner_id,
                // out_order_no:isEmpty(out_order_no)?null:out_order_no,
                // out_user_id:isEmpty(out_user_id)?null:out_user_id,
            };
            reqData={...reqData,...reqData0};
        }
        // if (channel===3){
        //     let reqData3 = {
        //         etc_card_no:isEmpty(etc_card_no)?null:etc_card_no,
        //     };
        //     reqData={...reqData,...reqData3};
        // }

        this.setParams(reqData);
        console.log('sss==',reqData);

        http.post('/website/stat/consume-flow-query',reqData,response=>{
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize =page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{
                item.key=item.order_no;
                item.sub_bill_array&&item.sub_bill_array.map(item=>{
                    item.key=item.sub_order_no;
                });
            });
            this.orderList=response.data||[];
            this.setIsShowOrderLoading(false);
        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    //请求合作方数据列表
    @observable partnerList = [];
    @action getPartnerList() {
        const reqData = {
            page_num: 1,
            page_size: 0,
        };
        http.post("/website/partner/top-simple-query", reqData, (response) => {
            response.data&&response.data.map(item=>{item.key = item.partner_id});
            this.partnerList = response.data
        }, (err) => {
            message.error(err);
        });
    }

    //全部导出
    @action getExportAllData(page_num,page_size,start_date,end_date,partner_id,
                             order_no,card_id,out_user_id,out_order_no,oil_type,terminal_id,order_status,etc_card_no,channel,user_mobile,xlpay_order_no) {
        this.setIsShowButtonLoading(true);
        let reqData = {
            page_num: page_num,
            page_size: page_size,
            channel:isEmpty(channel)?null:channel,
            order_no:isEmpty(order_no)?null:order_no,
            terminal_id:isEmpty(terminal_id)?null:terminal_id,
            order_status:isEmpty(order_status)?null:order_status,
            start_time:isEmpty(start_date)?null:formatTime(start_date),
            end_time:isEmpty(end_date)?null:formatTime(end_date),
            station_id: isEmpty(this.searchData)?null:this.searchData.id,
            mobile:isEmpty(user_mobile)?null:user_mobile,
            xlpay_order_no:isEmpty(xlpay_order_no)?null:xlpay_order_no,
        };

        if (channel===0){
            let reqData0 = {
                partner_id:isEmpty(partner_id)?null:partner_id,
            };
            reqData={...reqData,...reqData0};
        }

        http.post('/website/stat/consume-flow-query',this.params,response=>{
            this.setIsShowButtonLoading(false);
            response.data&&response.data.map(item=>{item.key= item.id;});
            this.exportFile(this.getExcelData(response.data), 1);
        },err=>{
            this.setIsShowButtonLoading(false);
            message.error(err);
        });
    }

    //勾选导出
    @action getExportSomeData(selectedRowKeys) {
        const selectedArray = [];
        const dataList = this.orderList;
        for (let i = 0; i < selectedRowKeys.length; i++) {
            const key = selectedRowKeys[i];
            for (let j = 0; j < dataList.length; j++) {
                if (dataList[j].key === key) {
                    selectedArray.push(dataList[j]);
                    break;
                }
            }
        }
        this.exportFile(this.getExcelData(selectedArray), 1);
    }

    //导出xlsx文件 type 1：导出文件 2：模板
    exportFile(data, type) {
        console.log(data);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "消费流水.xlsx")

    };

    //将数据转换为 Excel能接受的数据
    @action getExcelData(list) {
        const excelArray = [];
        const excelTitle = ["合作方名称","消费订单号","订单状态", "支付方式","消费时间", "总金额", "折扣金额", "实际金额","油品类型","油品单价","油品数量","油品详情","终端编号","卡号","用户手机号","用户名","第三方订单号","ETC卡号","备注"];
        excelArray.push(excelTitle);
        for (let i = 0; i < list.length; i++) {
            let excelItem = [];
            const item = list[i];

            let model_flag = "";
            if (item.model_flag === 2) {
                model_flag = "壳牌";
            }

            let orderStatus = "";
            if (item.order_status === "00") {
                orderStatus = "订单创建";
            } else if (item.order_status === "01") {
                orderStatus = "支付成功";
            }else if (item.order_status === "02") {
                orderStatus = "支付失败";
            }else if (item.order_status === "03") {
                orderStatus = "消费成功";
            } else if (item.order_status === "04") {
                orderStatus = "消费失败";
            } else if (item.order_status === "05") {
                orderStatus = "订单取消";
            }else if (item.order_status === "05") {
                orderStatus = "冲正成功";
            }else if (item.order_status === "07") {
                orderStatus = "冲正失败";
            }
            let payWay = "";
            if (item.order_payment === "01") {
                payWay = "余额支付";
            } else if (item.order_payment === "02") {
                payWay = "银联支付";
            } else if (item.order_payment === "03") {
                payWay = "支付宝支付";
            } else if (item.order_payment === "04") {
                payWay = "微信支付";
            } else if (item.order_payment === "05") {
                payWay = "合作方支付";
            }
            let oilType = "";
            if (item.oil_type === "0") {
                oilType = "汽油";
            } else {
                oilType = "柴油"
            }
            excelItem = [
                item.partner_name,
                item.order_no,
                orderStatus,
                payWay,
                item.consume_time,
                item.total_amount,
                item.discount_amount,
                item.actual_amount,
                oilType,
                item.oil_price,
                item.oil_num,
                item.oil_detail,
                item.terminal_id,
                item.card_id,
                item.user_mobile,
                item.user_name,
                item.out_order_no,
                item.etc_card_no,
                model_flag,
            ];
            excelArray.push(excelItem);
        }
        return excelArray;
    }

    @observable isShowExportDialog= false;
    @action setIsShowExportDialog(isShowExportDialog){
        this.isShowExportDialog = isShowExportDialog;
    }

    @observable isShowExportResultDialog= false;
    @observable type = 1; //1 : 返回结果  2:直接查看 3:请求失败
    @action setIsShowExportResultDialog(isShowExportResultDialog,type){
        this.isShowExportResultDialog = isShowExportResultDialog;
        this.type = type;
    }

    @observable isShowEngineLoading = false;
    @action setIsShowEngineLoading(isShowEngineLoading){
        this.isShowEngineLoading = isShowEngineLoading;
    }

    @observable params = null;
    @action setParams(params){
        this.params = params;
    }

    //开票地址
    @observable showAUrl = false;
    @action setShowAUrl(showAUrl){this.showAUrl = showAUrl;}
    @observable applyUrl = '';
    @action setApplyUrl(applyUrl){this.applyUrl = applyUrl;}

    //返券明细
    @observable isShowDrawer = false;
    @action setIsShowDrawer(isShowDrawer){this.isShowDrawer = isShowDrawer;}
    @observable consumeCouponList = null;
    @action setIsConsumeCouponList(consumeCouponList){this.consumeCouponList = consumeCouponList;}

    //油站查询信息
    @observable isShowSearchDialog = false;
    @action setIsShowSearchDialog(isShowSearchDialog){this.isShowSearchDialog = isShowSearchDialog;}
    @observable searchData = null;
    @action setSearchData(searchData){this.searchData = searchData;}
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

    //导出所选区间文件
    @action getConsumeFlowDownload(start_date,end_date){
        this.setIsShowEngineLoading(true);
        let reqData = {
            page_size:0,
            page_num:0,
            channel:isEmpty(this.params.channel)?null:this.params.channel,
            card_id:isEmpty(this.params.card_id)?null:this.params.card_id,
            order_no:isEmpty(this.params.order_no)?null:this.params.order_no,
            terminal_id:isEmpty(this.params.terminal_id)?null:this.params.terminal_id,
            order_status:isEmpty(this.params.order_status)?null:this.params.order_status,
            start_date:isEmpty(start_date)?null:formatData(start_date),
            end_date:isEmpty(end_date)?null:formatData(end_date),
        };

        if (this.params.channel===0){
            let reqData0 = {
                partner_id:isEmpty(this.params.partner_id)?null:this.params.partner_id,
                out_order_no:isEmpty(this.params.out_order_no)?null:this.params.out_order_no,
            };
            reqData={...reqData,...reqData0};

        }
        if (this.params.channel===3){
            let reqData3 = {
                etc_card_no:isEmpty(this.params.etc_card_no)?null:this.params.etc_card_no,
            };
            reqData={...reqData,...reqData3};
        }

        console.log("reqData==",JSON.stringify(reqData));
        http.post('/website/stat/consume-flow-download',this.params,response=>{

            this.check_result_file_url = response.check_result_file_url;
            this.setIsShowEngineLoading(false);
            this.setIsShowExportDialog(false);
            this.setIsShowExportResultDialog(true,1);

        },err=>{
            this.setIsShowEngineLoading(false);
            this.setIsShowExportDialog(false);
            message.error(err);
            this.setIsShowExportResultDialog(true,3);
        });
    }

    @observable check_result_file_url='';
    @observable file_name='';
    @observable file_date='';
    @action getConsumeFlowDownloadUrl(){
        this.setIsShowOrderLoading(true);
        http.post('/website/stat/consume-flow-download-url',null,response=>{

            this.check_result_file_url = response.check_result_file_url;
            this.file_name = response.file_name;
            this.file_date = response.file_date;
            this.setIsShowOrderLoading(false);
            this.setIsShowExportResultDialog(true,2);

        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    //打印小票
    @action billFixPrintTicket(order_no){
        this.setIsShowOrderLoading(true);
        http.post('/website/stat/print-pos',{order_no:order_no},response=>{
            this.setIsShowOrderLoading(false);
            message.info("操作成功");
            // this.getOrderTicketQuery(this.params);
        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    //开票地址
    @action invoiceApplyUrl(order_no){
        this.setIsShowOrderLoading(true);
        http.post('/website/stat/invoice-apply-url',{order_no:order_no},response=>{
            this.setIsShowOrderLoading(false);
            if (response.apply_url){
                this.setApplyUrl(response.apply_url);
                this.setShowAUrl(true);
            }else {
                message.info("获取失败");
            }

        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    @observable order_no = '';
    @action setOrderNo(order_no){
        this.order_no = order_no;
    }
    //返券明细
    @observable consumePagination = {};
    @action setConsumePagination(consumePagination) {
        this.consumePagination = consumePagination;
    }
    @action consumeCoupon(order_no){
        this.setIsShowOrderLoading(true);
        this.setOrderNo(order_no);
        http.post('/website/stat/consume-coupon',{order_no:order_no},response=>{
            const pagination = {};
            pagination.pageSize = 99;
            pagination.hideOnSinglePage = true;
            pagination.showQuickJumper = true;
            this.setConsumePagination(pagination);
            this.setIsShowOrderLoading(false);
            this.setIsShowDrawer(true);
            response.data&&response.data.map((item,index)=>item.key=index);
            this.consumeCouponList = response.data;
        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    //核销
    @action couponWriteOff(id){
        this.setIsShowOrderLoading(true);
        http.post('/website/stat/coupon-write-off',{id:id},response=>{
            this.setIsShowOrderLoading(false);
            message.info("操作成功");
        },err=>{
            this.setIsShowOrderLoading(false);
            message.error(err);
        });
    }

    //撤销
    @action couponInvalid(id){
        this.setIsShowOrderLoading(true);
        http.post('/website/stat/coupon-invalid',{id:id},response=>{
            this.setIsShowOrderLoading(false);
            message.info("操作成功");
            this.consumeCoupon(this.order_no);
        },err=>{
            this.setIsShowOrderLoading(false);
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

}



export default OrderStore;
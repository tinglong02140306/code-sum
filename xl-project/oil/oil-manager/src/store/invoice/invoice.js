import http from '../../http/http';
import {isEmpty} from "../../utils/isEmpty";
import {observable, action} from 'mobx';
import XLSX from 'xlsx';
import {message} from 'antd';
import {formatData} from "../../utils/formatDate";
const title = ["序号", "机构号", "公司名称","公司税号", "公司地址", "公司联系方式", "开户行名称", "开户行号", "货物名称", "计量单位", "数量", "单价", "金额", "税率", "创建时间","标记号", "发票号"];

class InvoiceStore {

    @observable isShowLeadResultDialog = false;

    @action setIsShowLeadResultDialog(isShowLeadResultDialog) {
        this.isShowLeadResultDialog = isShowLeadResultDialog;
    }

    @observable isShowLeadLoading = false;

    @action setIsShowLeadLoading(isShowLeadLoading) {
        this.isShowLeadLoading = isShowLeadLoading;
    }

    @observable isShowInvoiceDialog = false;
    @observable type = 1;//1:查看  2:添加发票号

    @action setIsShowInvoiceDialog(isShowInvoiceDialog,type) {
        this.isShowInvoiceDialog = isShowInvoiceDialog;
        this.type = type;
    }

    @observable invoiceObject = {};

    @action setInvoiceObject(invoiceObject) {
        this.invoiceObject = invoiceObject;
    }

    @observable isShowInvoiceLoading = false;

    @action setIsShowInvoiceLoading(isShowLoading) {
        this.isShowInvoiceLoading = isShowLoading;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    @observable page_num = 1;

    @action setPageNum(page_num) {
        this.page_num = page_num;
    }

    @observable org_id;
    @observable org_tax_no;
    @observable printed;
    @observable invoice_no;
    @observable pre_invoice_mark_no;
    @observable start_date;
    @observable end_date;

    @observable invoiceList = [];

    @action getInvoiceList(page_num, page_size, org_id, org_tax_no, printed, invoice_no, pre_invoice_mark_no,start_date,end_date) {
        this.setIsShowInvoiceLoading(true);
        this.org_id = org_id;
        this.org_tax_no = org_tax_no;
        this.printed = printed;
        this.invoice_no = invoice_no;
        this.pre_invoice_mark_no = pre_invoice_mark_no;
        this.start_date = start_date;
        this.end_date = end_date;
        const reqData = {
            page_num: page_num,
            page_size: page_size,
            org_id: isEmpty(org_id) ? null : org_id,
            org_tax_no: isEmpty(org_tax_no) ? null : org_tax_no,
            printed: printed === "no" ? null : printed,
            invoice_no: isEmpty(invoice_no) ? null : invoice_no,
            pre_invoice_mark_no: isEmpty(pre_invoice_mark_no) ? null : pre_invoice_mark_no,
            start_date:isEmpty(start_date)?null:formatData(start_date),
            end_date:isEmpty(end_date)?null:formatData(end_date)
        };
        http.post('/website/invoice/vat-invoice-query',reqData,response=>{
            this.setIsShowInvoiceLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.id});
            this.invoiceList= response.data;
        },err=>{
            message.error(err);
            this.setIsShowInvoiceLoading(false);
        });
    }

    //勾选导出
    @action getExportSomeData(selectedRowKeys) {
        const selectedArray = [];
        const invoiceList = this.invoiceList;
        for (let i = 0; i < selectedRowKeys.length; i++) {
            const key = selectedRowKeys[i];
            for (let j = 0; j < invoiceList.length; j++) {
                if (invoiceList[j].key === key) {
                    selectedArray.push(invoiceList[j]);
                    break;
                }
            }
        }
        this.exportFile(this.getExcelData(selectedArray));
    }


    //将数据转换为 Excel能接受的数据
    @action getExcelData(list) {
        const excelArray = [];
        const excelTitle = ["序号", "机构号", "公司名称","公司税号", "公司地址", "公司联系方式", "开户行名称", "开户行号", "货物名称", "计量单位", "数量", "单价", "金额", "税率", "创建时间","标记号", "发票号"];
        excelArray.push(excelTitle);
        for (let i = 0; i < list.length; i++) {
            let excelItem = [];
            const item = list[i];
            excelItem = [item.id,
                item.org_id,
                item.org_name,
                item.org_tax_no,
                item.org_address,
                item.org_mobile,
                item.org_bank_name,
                item.org_bank_account_id,
                item.oil_name,
                item.oil_unit,
                item.oil_num,
                item.oil_price,
                item.amt,
                item.fax_rat,
                item.gmt_create,
                item.pre_invoice_mark_no,
                item.invoice_no];
            excelArray.push(excelItem);
        }
        return excelArray;
    }

    @observable isShowExportLoading = false;

    @observable setIsShowExportLoading(isShowExportSomeLoading) {
        this.isShowExportLoading = isShowExportSomeLoading;
    }

    //全部导出
    @action getExportAllData() {
        this.setIsShowExportLoading(true);
        const reqData = {
            page_num: 1,
            page_size: this.pagination.total,
            org_id: isEmpty(this.org_id) ? null : this.org_id,
            org_tax_no: isEmpty(this.org_tax_no) ? null : this.org_tax_no,
            printed: this.printed === "no" ? null : this.printed,
            invoice_no: isEmpty(this.invoice_no) ? null : this.invoice_no,
            pre_invoice_mark_no: isEmpty(this.pre_invoice_mark_no) ? null : this.pre_invoice_mark_no,
            start_date:isEmpty(this.start_date)?null:formatData(this.start_date),
            end_date:isEmpty(this.end_date)?null:formatData(this.end_date)
        }

        http.post('/website/invoice/vat-invoice-query',reqData,response=>{
            this.setIsShowExportLoading(false);
            response.data&&response.data.map(item=>{item.key=item.id});
            this.exportFile(this.getExcelData(response.data));
        },err=>{
            message.error(err);
            this.setIsShowExportLoading(false);
        });
    }

    //导出xlsx文件
    exportFile(data) {
        console.log(data);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "发票.xlsx")
    };

    @observable isShowLeadDialog = false;

    @action setIsShowLeadDialog(isShoeLeadLoading) {
        this.isShowLeadDialog = isShoeLeadLoading;
    }

    @observable leadList = [];

    @action setLeadList(leadList) {
        this.leadList = leadList;
    }

    //导入文件处理
    handleFile(file/*:File*/) {
        this.setIsShowLeadDialog(true);
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log(data);
            
            this.setLeadList(this.changeToList(data));
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };

    //导入数据转换
    changeToList(list) {
        if (list.length > 0 && list[0].toString() === title.toString()) {
            const invoiceList = [];
            for (let i = 1; i < list.length; i++) {
                const listObject = list[i];
                if (listObject.length >= 17) {
                    if (isEmpty(listObject[0]) || isEmpty(listObject[1])||isEmpty(listObject[16])) {
                        message.error("数据格式错误");
                        break;
                    } else {
                        if(listObject[15].length >= 30){
                            message.error("标记号不能长于30位");
                            break;
                        }
                        if(listObject[16].length >=30){
                            message.error("发票号不能长于30位");
                            break;
                        }
                        const object = {
                            id: listObject[0],
                            org_id: listObject[1],
                            org_name: listObject[2],
                            org_tax_no: listObject[3],
                            org_address: listObject[4],
                            org_mobile: listObject[5],
                            org_bank_name: listObject[6],
                            org_bank_account_id: listObject[7],
                            oil_name: listObject[8],
                            oil_unit: listObject[9],
                            oil_num: listObject[10],
                            oil_price: listObject[11],
                            amt: listObject[12],
                            fax_rat: listObject[13],
                            gmt_create: new Date(listObject[14]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(listObject[14]).toTimeString().substr(0, 8),
                            pre_invoice_mark_no: listObject[15],
                            invoice_no: listObject[16],
                            key: listObject[0]
                        };
                        invoiceList.push(object);
                    }
                } else {
                    message.error("数据格式错误");
                    break;
                }
            }
            return invoiceList;
        } else {
            message.error("数据格式错误");
            return;
        }
    }

    @action getSubmitLead(list) {
        this.setIsShowLeadLoading(true);
        const reqList = [];
        for (let i = 0; i < list.length; i++) {
            const objet = list[i];
            const reqData = {
                id: objet.id,
                invoice_no: objet.invoice_no,
                pre_invoice_mark_no: objet.pre_invoice_mark_no

            }
            reqList.push(reqData);
        }
        http.post('/website/invoice/vat-invoice-update',reqList,response=>{
            response.markArray =  this.getFailLeadList(list,response.failed_pre_invoice_mark_no_array);
            this.setLeadResult(response);
        },err=>{
            message.error(err);
            this.setIsShowLeadLoading(false);
        });
    }

    @action getFailLeadList(list,failed_pre_invoice_mark_no_array){
        const markArray = [];
        for (let i = 0; i < failed_pre_invoice_mark_no_array.length; i++) {
            const mark_no = failed_pre_invoice_mark_no_array[i];
            for (let j = 0; j < list.length; j++) {
                if (list[j].pre_invoice_mark_no===mark_no){
                    markArray.push(list[j]);
                    break
                }
            }
        }
        this.setIsShowLeadLoading(false);
        this.setIsShowLeadResultDialog(true);
        this.setIsShowLeadDialog(false);
        return markArray;

    }

    @observable leadResult = {};
    @action setLeadResult(leadResult) {
        this.leadResult = leadResult;
    }


    //单条更新
    @action getUpdateInvoiceSingle(id,invoice_no,pre_invoice_mark_no){
        this.setIsShowLeadLoading(true);
        const reqData = {
            id:id,
            invoice_no: invoice_no,
            pre_invoice_mark_no: pre_invoice_mark_no,
        };
        http.post('/website/invoice/vat-invoice-update-single',reqData,response=>{
            this.setIsShowLeadLoading(false);
            this.setIsShowInvoiceDialog(false);
            response.success_count === 1?message.info("发票号添加成功"):message.error("发票号添加失败")
            this.getInvoiceList(1, this.page_size);
        },err=>{
            message.error(err);
            this.setIsShowLeadLoading(false);
        });
    }
}

export default InvoiceStore;
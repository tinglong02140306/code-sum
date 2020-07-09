import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import XLSX from 'xlsx';
import http from '../../http/http';
import {message} from "antd";
import {formatData} from "../../utils/formatDate";
const title = ["交易日期", "订单金额", "实际消费金额","折扣金额","手续费"];

class WaterCollectStore {


    @observable isShowLoading = false;

    @action setIsShowLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }


    @observable isShowExportLoading = false;

    @observable setIsShowExportLoading(isShowExportSomeLoading) {
        this.isShowExportLoading = isShowExportSomeLoading;
    }

    @observable dataList = [];//商户流水统计
    @action getConsumeList(page_num, page_size, start_date, end_date) {
        this.pageSize = page_size;
        const params = {
            page_num: page_num,
            page_size: page_size,
            start_date: isEmpty(start_date) ? null : formatData(start_date),
            end_date: isEmpty(end_date) ? null : formatData(end_date),

        }
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/stat/consume-statistical-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>item.key=index);
            this.dataList = response.data;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }


    //全部导出
    @action getExportAllData(page_num, page_size, start_date, end_date) {
        this.setIsShowExportLoading(true);
        const reqData = {
            page_num: 1,
            page_size: 999999,
            start_date: isEmpty(start_date) ? null : formatData(start_date),
            end_date: isEmpty(end_date) ? null : formatData(end_date),
        }

        http.post('/website/stat/consume-statistical-query',reqData,response=>{
            this.setIsShowExportLoading(false);
            response.data&&response.data.map((item,index)=>{item.key=index})
            this.exportFile(this.getExcelData(response.data), 1);
        },err=>{
            message.error(err);
            this.setIsShowExportLoading(false);
        });

    }

    //导出xlsx文件 type 1：导出文件 2：模板
    exportFile(data, type) {
        console.log(data);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "流水统计表.xlsx")
    };

    //将数据转换为 Excel能接受的数据
    @action getExcelData(list) {
        const excelArray = [];
        const excelTitle = ["交易日期", "订单金额", "实际消费金额","折扣金额","手续费"];
        excelArray.push(excelTitle);
        for (let i = 0; i < list.length; i++) {
            let excelItem = [];
            const item = list[i];

            excelItem = [
                item.consume_date,
                item.amount,
                item.consumeAmount,
                item.discount,
                item.fee,
            ];
            excelArray.push(excelItem);
        }
        return excelArray;
    }


}

export default WaterCollectStore;
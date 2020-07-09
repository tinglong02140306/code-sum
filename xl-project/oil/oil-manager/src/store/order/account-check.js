import {observable,action} from 'mobx';
import {isEmpty} from "../../utils/isEmpty";
import http from '../../http/http';
import {message} from "antd";
import {formatData} from "../../utils/formatDate";
import {trim} from "../../utils/trim";
import xlsxUtils from "../../utils/xlsx.utils.min";
import saveAs from "../../utils/saveAs.min";

class AccountCheckStore {


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

    //请求合作方列表
    @observable partnerList = [];
    @action getPartnerList() {
        const reqData = {
            page_num: 1,
            page_size: 0,
        };
        http.post("/website/partner/top-query", reqData, (response) => {
            response.data&&response.data.map(item=>{item.key = item.partner_id});
            this.partnerList = response.data
        }, (err) => {
            message.error(err);
            this.setIsShowLoading(false);
        });
    }

    @observable dataList = [];//商户流水统计
    @action getAccountCheckList(partner_id, bill_date) {
        const params = {
            partner_id: isEmpty(partner_id) ? null : trim(partner_id),
            bill_date: isEmpty(bill_date) ? null : formatData(bill_date),
        }
        if (!this.isShowLoading) {
            this.setIsShowLoading(true);
        }
        http.post('/website/stat/query_partner_account_checking',params,response=>{
            this.setIsShowLoading(false);
            let dealAList = [{'brand':'壳牌','oil_type':'汽油','bill_count':response.shell_gas.bill_count,'oil_num':response.shell_gas.oil_num?response.shell_gas.oil_num:0,'bill_amount':response.shell_gas.bill_amount?response.shell_gas.bill_amount:0,'payable_amount':response.shell_gas.payable_amount?response.shell_gas.payable_amount:0},
                {'brand':'壳牌','oil_type':'柴油','bill_count':response.shell_diesel.bill_count,'oil_num':response.shell_diesel.oil_num?response.shell_diesel.oil_num:0,'bill_amount':response.shell_diesel.bill_amount?response.shell_diesel.bill_amount:0,'payable_amount':response.shell_diesel.payable_amount?response.shell_diesel.payable_amount:0},
                {'brand':'壳牌','oil_type':'小计','bill_count':response.shell_subtotal.bill_count,'oil_num':response.shell_subtotal.oil_num?response.shell_subtotal.oil_num:0,'bill_amount':response.shell_subtotal.bill_amount?response.shell_subtotal.bill_amount:0,'payable_amount':response.shell_subtotal.payable_amount?response.shell_subtotal.payable_amount:0},
                {'brand':'非壳牌','oil_type':'汽油','bill_count':response.not_shell_gas.bill_count,'oil_num':response.not_shell_gas.oil_num?response.not_shell_gas.oil_num:0,'bill_amount':response.not_shell_gas.bill_amount?response.not_shell_gas.bill_amount:0,'payable_amount':response.not_shell_gas.payable_amount?response.not_shell_gas.payable_amount:0},
                {'brand':'非壳牌','oil_type':'柴油','bill_count':response.not_shell_diesel.bill_count,'oil_num':response.not_shell_diesel.oil_num?response.not_shell_diesel.oil_num:0,'bill_amount':response.not_shell_diesel.bill_amount?response.not_shell_diesel.bill_amount:0,'payable_amount':response.not_shell_diesel.payable_amount?response.not_shell_diesel.payable_amount:0},
                {'brand':'非壳牌','oil_type':'小计','bill_count':response.not_shell_subtotal.bill_count,'oil_num':response.not_shell_subtotal.oil_num?response.not_shell_subtotal.oil_num:0,'bill_amount':response.not_shell_subtotal.bill_amount?response.not_shell_subtotal.bill_amount:0,'payable_amount':response.not_shell_subtotal.payable_amount?response.not_shell_subtotal.payable_amount:0},
                {'brand':'总计','oil_type':'汽油','bill_count':response.total_gas.bill_count,'oil_num':response.total_gas.oil_num?response.total_gas.oil_num:0,'bill_amount':response.total_gas.bill_amount?response.total_gas.bill_amount:0,'payable_amount':response.total_gas.payable_amount?response.total_gas.payable_amount:0},
                {'brand':'总计','oil_type':'柴油','bill_count':response.total_diesel.bill_count,'oil_num':response.total_diesel.oil_num?response.total_diesel.oil_num:0,'bill_amount':response.total_diesel.bill_amount?response.total_diesel.bill_amount:0,'payable_amount':response.total_diesel.payable_amount?response.total_diesel.payable_amount:0},
                {'brand':'总计','oil_type':'合计','bill_count':response.total_subtotal.bill_count,'oil_num':response.total_subtotal.oil_num?response.total_subtotal.oil_num:0,'bill_amount':response.total_subtotal.bill_amount?response.total_subtotal.bill_amount:0,'payable_amount':response.total_subtotal.payable_amount?response.total_subtotal.payable_amount:0}];

            dealAList&&dealAList.map((item,index)=>item.key=index);
            this.dataList = dealAList;
        },err=>{
            message.error(err);
            this.setIsShowLoading(false);
        });
    }
    //测试导出合并表格
    @action downloadExl() {
        const head = {
            "A1": {"v": "品牌"},
            "B1": {"v": "油品"},
            "C1": {"v": "订单数量"},
            "D1": {"v": "油品升量"},
            "E1": {"v": "订单金额"},
            "F1": {"v": "应付金额"},
            /*s为开始,e结束 c:开始/结束列 r:开始/结束取值范围; */
            "!merges": [
                {"s": {"c": 0, "r": 1}, "e": {"c": 0, "r": 3}},
                {"s": {"c": 0, "r": 4}, "e": {"c": 0, "r": 6}},
                {"s": {"c": 0, "r": 7}, "e": {"c": 0, "r": 9}},
            ],
            'style':{
                'color':'red'
            }
        };
        const keyMap = [
            "brand",
            "oil_type",
            "bill_count",
            "oil_num",
            "bill_amount",
            "payable_amount",
        ];

        //将null转换空字符串
        for (let i = 0; i < this.dataList.length; i++) {

            let dic = this.dataList[i];
            let valuesArray = Object.values(dic);
            let keysArray = Object.keys(dic);

            for (let j = 0; j < valuesArray.length; j++) {
                let data = valuesArray[j];
            if (data == null) {
                dic[keysArray[j]] = "";
            }
        }
    }

    if (this.dataList.length > 0) {
    const data = xlsxUtils.format2Sheet(this.dataList, 0, 1, keyMap);//偏移2行按keyMap顺序转换
    const dataKeys = Object.keys(data);
    for (const k in head) data[k] = head[k];//追加列头
    const wb = xlsxUtils.format2WB(data, undefined, undefined, "A1:" + dataKeys[dataKeys.length - 1]);
    const blob = xlsxUtils.format2Blob(wb);
    saveAs(URL.createObjectURL(blob), "对账数据表.xlsx");
} else {
    message.info("无可导出的数据");
        }
    };

}

export default AccountCheckStore;

// //全部导出
// @action getExportAllData(partner_id,bill_date) {
//     this.setIsShowExportLoading(true);
//     const reqData = {
//         start_date: isEmpty(partner_id) ? null : trim(partner_id),
//         bill_date: isEmpty(bill_date) ? null : formatData(bill_date),
//     }
//
//     http.post('/website/stat/query_partner_account_checking',reqData,response=>{
//         this.setIsShowExportLoading(false);
//         let dealAList = [{'brand':'壳牌','oil_type':'汽油','bill_count':response.shell_gas.bill_count,'oil_num':response.shell_gas.oil_num,'payable_amount':response.shell_gas.payable_amount},
//             {'brand':'壳牌','oil_type':'柴油','bill_count':response.shell_diesel.bill_count,'oil_num':response.shell_diesel.oil_num,'payable_amount':response.shell_diesel.payable_amount},
//             {'brand':'壳牌','oil_type':'小计','bill_count':response.shell_subtotal.bill_count,'oil_num':response.shell_subtotal.oil_num,'payable_amount':response.shell_subtotal.payable_amount},
//             {'brand':'非壳牌','oil_type':'汽油','bill_count':response.not_shell_gas.bill_count,'oil_num':response.not_shell_gas.oil_num,'payable_amount':response.not_shell_gas.payable_amount},
//             {'brand':'非壳牌','oil_type':'柴油','bill_count':response.not_shell_diesel.bill_count,'oil_num':response.not_shell_diesel.oil_num,'payable_amount':response.not_shell_diesel.payable_amount},
//             {'brand':'非壳牌','oil_type':'小计','bill_count':response.not_shell_subtotal.bill_count,'oil_num':response.not_shell_subtotal.oil_num,'payable_amount':response.not_shell_subtotal.payable_amount},
//             {'brand':'总计','oil_type':'汽油','bill_count':response.total_gas.bill_count,'oil_num':response.total_gas.oil_num,'payable_amount':response.total_gas.payable_amount},
//             {'brand':'总计','oil_type':'柴油','bill_count':response.total_diesel.bill_count,'oil_num':response.total_diesel.oil_num,'payable_amount':response.total_diesel.payable_amount},
//             {'brand':'总计','oil_type':'合计','bill_count':response.total_subtotal.bill_count,'oil_num':response.total_subtotal.oil_num,'payable_amount':response.total_subtotal.payable_amount}];
//
//         dealAList&&dealAList.map((item,index)=>item.key=index);
//         this.exportFile(this.getExcelData(dealAList), 1);
//     },err=>{
//         message.error(err);
//         this.setIsShowExportLoading(false);
//     });
//
// }
//
// //导出xlsx文件 type 1：导出文件 2：模板
// exportFile(data, type) {
//     const ws = XLSX.utils.aoa_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
//     XLSX.writeFile(wb, "对账数据表.xlsx")
// };
//
// //将数据转换为 Excel能接受的数据
// @action getExcelData(list) {
//     const excelArray = [];
//     const excelTitle = ["品牌", "油品", "订单数量","油品升量","应付金额"];
//     excelArray.push(excelTitle);
//     for (let i = 0; i < list.length; i++) {
//         let excelItem = [];
//         const item = list[i];
//         excelItem = [
//             item.brand,
//             item.oil_type,
//             item.bill_count,
//             item.oil_num,
//             item.payable_amount,
//         ];
//         excelArray.push(excelItem);
//     }
//     return excelArray;
// }
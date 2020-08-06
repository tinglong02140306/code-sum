import { observable, action } from 'mobx';
import http from "../../http/http";
import { formatData } from "../../utils/formatDate";
import saveAs from "../../utils/saveAs.min";
import xlsxUtils from "../../utils/xlsx.utils.min";
import utils from "../../utils/utils";
import { exportMergeCell } from '../../utils/utils';

import { message } from "antd/lib/index";
import { isEmpty } from "../../utils/isEmpty";

class OilProduct {

    @observable isShowLoading = false;

    @action setIsShowOilLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable oilProductList = [];
    @observable product_data = [];
    @observable business_type_array = [];//业务类型（首列标题）
    @observable business_data_count_array = [];//产品类型个数
    @action getOilProductList(start_date, end_date) {
        this.oilProductList = [];
        this.product_data = [];
        this.business_type_array = [];//业务类型（首列标题）
        this.business_data_count_array = [];//产品类型个数
        this.setIsShowOilLoading(true);
        const params = {
            start_date: isEmpty(start_date) ? null : formatData(start_date),
            end_date: isEmpty(end_date) ? null : formatData(end_date),
        }
        http.post("/website/stat/oil-query", params, response => {
            this.setIsShowOilLoading(false);
            const pagination = {};
            pagination.pageSize = 20;
            pagination.hideOnSinglePage = true;
            pagination.showQuickJumper = true;
            this.setPagination(pagination);
            let dicArray = response["data"];
            dicArray && dicArray.map((item, index) => {
                const business_type = item["business_type"];
                this.business_type_array[index] = business_type;
                // 获取 business_data
                this.product_data = this.product_data.concat(item["business_data"]);
                // 获取 business_data 的 count
                this.business_data_count_array[index] = item["business_data"].length;
                this.product_data && this.product_data.map((item, index) => {
                    item.key = index;
                });
                this.oilProductList = this.product_data;
            })
        }, err => {
            this.setIsShowOilLoading(false);
            message.error(err);
        });
    }

    //测试导出合并表格
    @action downloadExl() {
        let A = "A";
        let i = 2 + this.business_data_count_array[0];
        let j = i + this.business_data_count_array[1];
        let s = i + 1;
        let Aj = A + s;
        let k = j + 1;
        let Ak = A + k;
        let B = "B";
        let Bk = B + k;
        const head = {
            "A1": { "v": "业务类型" },
            "B1": { "v": "产品类型" },
            "C1": { "v": "         本金消费" },
            "D1": { "v": "" },
            "E1": { "v": "" },
            "F1": { "v": "         积分消费" },
            "G1": { "v": "" },
            "H1": { "v": "" },
            "I1": { "v": "           合计" },
            "J1": { "v": "" },
            "K1": { "v": "" },
            "A2": { "v": "" },
            "B2": { "v": "" },
            "C2": { "v": "消费金额" },
            "D2": { "v": "折扣金额" },
            "E2": { "v": "实际金额" },
            "F2": { "v": "消费金额" },
            "G2": { "v": "折扣金额" },
            "H2": { "v": "实际金额" },
            "I2": { "v": "消费金额" },
            "J2": { "v": "折扣金额" },
            "K2": { "v": "实际金额" },
            "A3": { "v": this.business_type_array[0] },
            [Aj]: { "v": this.business_type_array[1] },
            [Ak]: { "v": "      总计" },
            [Bk]: { "v": "" },

            /*s为开始,e结束 c:开始/结束列 r:开始/结束取值范围; */
            "!merges": [
                { "s": { "c": 2, "r": 0 }, "e": { "c": 4, "r": 0 } },
                { "s": { "c": 5, "r": 0 }, "e": { "c": 7, "r": 0 } },
                { "s": { "c": 8, "r": 0 }, "e": { "c": 10, "r": 0 } },
                { "s": { "c": 1, "r": 0 }, "e": { "c": 1, "r": 1 } },
                { "s": { "c": 0, "r": 0 }, "e": { "c": 0, "r": 1 } },
                { "s": { "c": 0, "r": 2 }, "e": { "c": 0, "r": i - 1 } },
                { "s": { "c": 0, "r": i }, "e": { "c": 0, "r": j - 1 } },
                { "s": { "c": 0, "r": k - 1 }, "e": { "c": 1, "r": k - 1 } },
            ]
        };

        const keyMap = [
            "product_type",
            "capital_consume_amount",
            "capital_discount_amount",
            "capital_actual_amount",
            "integral_consume_amount",
            "integral_discount_amount",
            "integral_actual_amount",
            "total_consume_amount",
            "total_discount_amount",
            "total_actual_amount",
            "product_total"];//通过设置数组让导出时可以按顺序显示

        // exportMergeCell(this.product_data,head,keyMap,"加油产品消费报表.xlsx");

        //将null转换空字符串
        for (let i = 0; i < this.product_data.length; i++) {

            let dic = this.product_data[i];

            let valuesArray = Object.values(dic);
            let keysArray = Object.keys(dic);

            for (let j = 0; j < valuesArray.length; j++) {

                let data = valuesArray[j];
                if (data == null) {
                    dic[keysArray[j]] = "";
                }
            }

        }
        if (this.product_data.length > 0) {
            const data = xlsxUtils.format2Sheet(this.product_data, 1, 2, keyMap);//偏移2行按keyMap顺序转换
            const dataKeys = Object.keys(data);
            for (const k in head) data[k] = head[k];//追加列头
            const wb = xlsxUtils.format2WB(data, undefined, undefined, "A1:" + dataKeys[dataKeys.length - 1]);
            const blob = xlsxUtils.format2Blob(wb);
            saveAs(URL.createObjectURL(blob), "加油产品消费报表.xlsx");
        } else {
            message.info("无可导出的数据");
        }
    };

}

export default OilProduct;

const response = {
    "data": [
        {
            "business_type": "企业",
            "business_data": [
                {
                    "product_type": "中储",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "56卡包",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "总计",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                }
            ]
        },
        {
            "business_type": "个人",
            "business_data": [
                {
                    "product_type": "油团团",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "货车帮",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "油团团",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "货车帮",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                },
                {
                    "product_type": "总计",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                }
            ]
        },
        {
            "business_type": "总计",
            "business_data": [
                {
                    "product_type": "总计",
                    "capital_consume_amount": "100.21",
                    "capital_discount_amount": "12.36",
                    "capital_actual_amount": "451.36",
                    "integral_consume_amount": "100.21",
                    "integral_discount_amount": "12.36",
                    "integral_actual_amount": "451.36",
                    "total_consume_amount": "100.21",
                    "total_discount_amount": "12.36",
                    "total_actual_amount": "451.36"
                }
            ]
        }
    ]
}
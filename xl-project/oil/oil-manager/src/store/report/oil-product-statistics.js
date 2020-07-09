import {observable, action} from 'mobx';
import http from "../../http/http";
import {formatData} from "../../utils/formatDate";
import saveAs from "../../utils/saveAs.min";
import xlsxUtils from "../../utils/xlsx.utils.min";
import { exportMergeCell} from '../../utils/utils';
import {message} from "antd/lib/index";
import {isEmpty} from "../../utils/isEmpty";

class OilProductStatistics {

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
        };
        http.post("/website/report/consumption-data-for-each-product", params, response => {
            this.setIsShowOilLoading(false);
            const pagination = {};
            pagination.pageSize = 99;
            pagination.hideOnSinglePage = true;
            pagination.showQuickJumper = true;
            this.setPagination(pagination);
            let dicArray = response["data"];
            dicArray && dicArray.map((item,index) => {
                const business_type = item["business_name"];
                this.business_type_array[index] = business_type;
                if (item["business_data"]==null){
                    item["business_data"]=[];
                }
                // 获取 business_data
                this.product_data = this.product_data.concat(item["business_data"]);
                //拼接total
                this.product_data = this.product_data.concat(item["total"]);
                // 获取 business_data 的 count
                this.business_data_count_array[index] = item["business_data"].length+1;

                this.product_data&&this.product_data.map((item,index)=>{
                    item.key = index;
                });
                this.cardStatisticsList=this.product_data;
                this.product_data&&this.product_data.map((item,index)=>{
                    item.key = index;
                });
                this.oilProductList=this.product_data;
            });
        }, err => {
            this.setIsShowOilLoading(false);
            message.error(err);
        });
    }

    //测试导出合并表格
    @action downloadExl(start_date, end_date) {

        //单元格结构
        let head = {
            "A1": {"v": "                          加油各产品消费统计报表                            "},
            "A2": {"v": [`制表单位：加油事业部     所属日期:${start_date}-${end_date}     单位：元 `]},
            "A3": {"v": "业务类型"},
            "B3": {"v": "产品类型"},
            "C3": {"v": "订单金额"},
            "D3": {"v": "增值服务费"},
            "E3": {"v": "收入小计"},
            "F3": {"v": "折扣金额"},
            "G3": {"v": "实际消费金额"},
        };
        /*s为开始,e结束 c:开始/结束列 r:开始/结束取值范围; */
        let mergesArr= [
            {"s": {"c": 0, "r": 0}, "e": {"c": 6, "r": 0}},
            {"s": {"c": 0, "r": 1}, "e": {"c": 6, "r": 1}},
        ]
        let row = 4;
        let row2 = 4;
        let head2 = {};
        for (let i = 0; i < this.business_data_count_array.length; i++) {
            let Ai = [`A${row}`];
            head2={
                [Ai]: {"v": this.business_type_array[i]}
            }
            head = {...head,...head2};
            row += this.business_data_count_array[i];
            mergesArr.push({"s": {"c": 0, "r": row2-1}, "e": {"c": 0, "r": row-2}});

            row2 += this.business_data_count_array[i];
        }
        let Ak = [`A${row}`];
        let head3 = {[Ak]: {"v": "分管领导：    负责人：    复核人：    制表人：    制表日期：  "}};
        mergesArr.push({"s": {"c": 0, "r": row-2}, "e": {"c": 1, "r": row-2}});
        mergesArr.push({"s": {"c": 0, "r": row-1}, "e": {"c": 6, "r": row-1}});
        let merges = {"!merges": mergesArr}
        head = {...head,...head3,...merges};

        const keyMap = [
            "product_name",
            "amount",
            "service_charge",
            "subtotal_income",
            "discount",
            "consume_amount",];//通过设置数组让导出时可以按顺序显示

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
            let product_data1 = this.product_data.concat();
            // let product_data1 = JSON.parse(JSON.stringify(this.product_data));
            product_data1.push({"accounts_payable":"","amount":"","consume_amount":"","discount":"","fee":"","product_name":"","product_type":"","service_charge":"","subtotal_income":"","key":""})

            const data = xlsxUtils.format2Sheet(product_data1, 1, 3, keyMap);//偏移3行按keyMap顺序转换
            const dataKeys = Object.keys(data);
            for (const k in head) data[k] = head[k];//追加列头
            const wb = xlsxUtils.format2WB(data, undefined, undefined, "A1:" + dataKeys[dataKeys.length - 1]);
            const blob = xlsxUtils.format2Blob(wb);
            saveAs(URL.createObjectURL(blob), "加油各产品消费统计报表.xlsx");
        } else {
            message.info("无可导出的数据");
        }
    };

}

export default OilProductStatistics;

const response = {
    "data": [
        {
            "business_data": [
                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "ETC加油-银行卡",
                    "product_type": "301010003-02",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                },

                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "ETC加油-微信",
                    "product_type": "301010003-04",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                }
            ],
            "business_name": "ETC加油",
            "business_type": "1",
            "total": {
                "accounts_payable": 17600,
                "amount": 16000,
                "consume_amount": 17600,
                "discount": 1600,
                "fee": 0,
                "product_name": "小计",
                "product_type": "000000001",
                "service_charge": 3200,
                "subtotal_income": 19200
            }
        },
        {
            "business_data": [
                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "ETC加油-银行卡",
                    "product_type": "301010003-02",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                },

                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "ETC加油-微信",
                    "product_type": "301010003-04",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                }
            ],
            "business_name": "ETC加油",
            "business_type": "1",
            "total": {
                "accounts_payable": 17600,
                "amount": 16000,
                "consume_amount": 17600,
                "discount": 1600,
                "fee": 0,
                "product_name": "小计",
                "product_type": "000000001",
                "service_charge": 3200,
                "subtotal_income": 19200
            }
        },
        {
            "business_data": [
                {
                    "accounts_payable": 7700,
                    "amount": 7000,
                    "consume_amount": 7700,
                    "discount": 700,
                    "fee": 0,
                    "product_name": "APP加油-中储智运",
                    "product_type": "301010003",
                    "service_charge": 1400,
                    "subtotal_income": 8400
                },
                {
                    "accounts_payable": 7700,
                    "amount": 7000,
                    "consume_amount": 7700,
                    "discount": 700,
                    "fee": 0,
                    "product_name": "APP加油-高速ETC",
                    "product_type": "301010005",
                    "service_charge": 1400,
                    "subtotal_income": 8400
                },
                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "APP加油--油团团",
                    "product_type": "301010006",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                },
                {
                    "accounts_payable": 7700,
                    "amount": 7000,
                    "consume_amount": 7700,
                    "discount": 700,
                    "fee": 0,
                    "product_name": "APP加油-找油网",
                    "product_type": "301010008",
                    "service_charge": 1400,
                    "subtotal_income": 8400
                },
                {
                    "accounts_payable": 7700,
                    "amount": 7000,
                    "consume_amount": 7700,
                    "discount": 700,
                    "fee": 0,
                    "product_name": "APP加油-联动",
                    "product_type": "301010009",
                    "service_charge": 1400,
                    "subtotal_income": 8400
                },
                {
                    "accounts_payable": 8800,
                    "amount": 8000,
                    "consume_amount": 8800,
                    "discount": 800,
                    "fee": 0,
                    "product_name": "APP加油-G7",
                    "product_type": "301010010",
                    "service_charge": 1600,
                    "subtotal_income": 9600
                }
            ],
            "business_name": "APP加油",
            "business_type": "2",
            "total": {
                "accounts_payable": 48400,
                "amount": 44000,
                "consume_amount": 48400,
                "discount": 4400,
                "fee": 0,
                "product_name": "小计",
                "product_type": "000000001",
                "service_charge": 8800,
                "subtotal_income": 52800
            }
        },
        {
            "business_data": [
            ],
            "business_name": "合计",
            "business_type": "3",
            "total": {
                "accounts_payable": 17600,
                "amount": 16000,
                "consume_amount": 17600,
                "discount": 1600,
                "fee": 0,
                "product_name": "合计",
                "product_type": "000000001",
                "service_charge": 3200,
                "subtotal_income": 19200
            }
        },
    ]
}
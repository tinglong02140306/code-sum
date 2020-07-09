import {observable,action} from 'mobx';
import {XLSXExport} from '../../utils/utils';
import http from '../../http/http';
import {message} from 'antd';
const CONSUME_PARAMS = ['consume_date','order_amount','discount_amount','actual_amount','fee','enter_account_amount'];

class WXConsumeStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading = isShowLoading;
    }

    /**
     *是否合并数据
     */
    @observable merge = false;
    @action setIsMerge(merge){
        this.merge = merge;
    }

    /**
     *分页
     */
    @observable pagination = {
        current:1
    }

    /**
     * 导出报表
     * @param {*} start 
     * @param {*} end 
     */
    @action exportFile(start,end,exportData){
        const data = [];
        const title = [
            [`制表单位：加油事业部     所属日期:${start}-${end}       单位：元   `],
            ["日期", "订单金额(元)", "折扣金额(元)", "实际消费金额(元)", "通道手续费(元)", "应入账金额(元)"],
        ];
        const footer = [
            ["备注：                                                           "],
            ["部门分管领导：      部门负责人：         制表：          制表日期： "]
        ];
        const content = [];
        exportData&&exportData.map(item=>{
            const arr = [];
            arr.push(item[CONSUME_PARAMS[0]]);
            arr.push(item[CONSUME_PARAMS[1]]);
            arr.push(item[CONSUME_PARAMS[2]]);
            arr.push(item[CONSUME_PARAMS[3]]);
            arr.push(item[CONSUME_PARAMS[4]]);
            arr.push(item[CONSUME_PARAMS[5]]);
            content.push(arr);
        });
        const dataSource = data.concat(title,content,footer);
        XLSXExport(dataSource,'Sheet1',`${start}-${end}微信会员卡业务消费报表`);
    }

    /**
     * 计算
     * @param {*} page_num 
     * @param {*} page_size 
     * @param {*} start 
     * @param {*} end 
     */
    @action getCalculate(page_num,page_size,start,end){
        this.isShowLoading = true;
        const params = {
            page_num:page_num,
            page_size:page_size,
            start_date:start,
            end_date:end
        }
        http.post('/website/report/wechat-calculate-enter-account',params,res=>{
            this.isShowLoading = false;
            if(res&&res.data){
                this.amount = res.amount;
                this.pagination.total = res.amount;
                this.pagination.pageSize = page_size;
                this.pagination.showQuickJumper = true;
                if(res&&res.data.length<page_size){
                    res.data.push(res.total);
                }
                const dataList = res&&res.data.map((item,index)=>{
                    item.key = index;
                    return item;
                });
                this.consumeList = dataList;
            }
        },err=>{
            this.isShowLoading = false;
            message.error(err);
        });
    }

    /**
     *获取数据 全部数据
     *page_num
     *page_size
     *start 开始日期
     *end 结束日期
     *merge 是否合并
     */
    @observable pageAll = 1;
    @observable consumeList = [];
    @observable sumConsume = [];
    @observable amount = 0;
    @action getConsumeList(page_num,page_size,start,end){
        this.isShowLoading = true;
        const params = {
            page_num:page_num,
            page_size:page_size,
            start_date:start,
            end_date:end
        }
        http.post('/website/report/wechat-card-consume-query',params,res=>{
            this.isShowLoading = false;
            if(res.total) res.total.key = 999;
            if(page_size>=999){//导出全部
                res.data.push(res.total);
                this.exportFile(start,end,res.data);
            }else{
                this.amount = res.amount+1;
                this.pagination.total = res.amount+1;
                this.pagination.pageSize = page_size;
                this.pagination.showQuickJumper = true;
                this.sumConsume = [res.total];
                if(res&&res.data.length<page_size){
                    res.data.push(res.total);
                }
                if(res&&res.data){
                    const list = res.data.map((item,index)=>{
                        item.key = index;
                        return item;
                    });
                    this.consumeList = list;
                }
            }
            
        },err=>{
            this.isShowLoading = false;
            message.error(err);
        });
    }
}

export default WXConsumeStore;
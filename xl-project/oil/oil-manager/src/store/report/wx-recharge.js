import {observable,action} from 'mobx';
import {XLSXExport} from '../../utils/utils';
import http from '../../http/http';
import {message} from 'antd';
const PAGE_SIZE = 20;

class WXChargeStore {

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
            ["日期", "卡包充值额(元)", "扫码充值额(元)", "充值合计(元)"],
        ];
        const footer = [
            ["备注：                                                           "],
            ["部门分管领导：      部门负责人：         制表：          制表日期： "]
        ];
        const content = [];
        exportData&&exportData.map(item=>{
            const arr = [];
            arr.push(item.recharge_date);
            arr.push(item.card_recharge_amount);
            arr.push(item.scan_code_amount);
            arr.push(item.recharge_all_amount);
            content.push(arr);
        });
        const dataSource = data.concat(title,content,footer);
        XLSXExport(dataSource,'Sheet1',`${start}-${end}微信会员卡业务充值报表`);
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
    @observable chargeList = [];
    @observable sumCharge = [];
    @observable amount = 0;
    @action getChargeList(page_num,page_size,start,end){
        const params = {
            page_num:page_num,
            page_size:page_size,
            start_date:start,
            end_date:end
        }
        this.isShowLoading = true;
        http.post('/website/report/wechat-card-recharge-query',params,res=>{
            this.isShowLoading = false;
            if(res.total){ 
                res.total.key=999;
            }
            if(page_size>=999){//导出全部
                res.data.push(res.total);
                this.exportFile(start,end,res.data);
            }else{
                this.amount = res.amount+1;
                this.pagination.total = res.amount+1;
                this.pagination.pageSize = page_size;
                this.pagination.showQuickJumper = true;
                this.sumCharge = [res.total];
                if(res&&res.data.length<page_size){
                    res.data.push(res.total);
                }
                if(res&&res.data){
                    const list = res.data.map((item,index)=>{
                        item.key = index;
                        return item;
                    });
                    this.chargeList = list;
                }
            }
           
        },err=>{
            message.error(err);
            this.isShowLoading = false;
        });
    }
}

export default WXChargeStore;
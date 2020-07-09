import {observable, action} from 'mobx';
import http from "../../http/http";
import {message} from 'antd';

class OilPriceStore {

    @observable isShowLoading = false;
    @action setIsShowLoading(isShowLoading){
        this.isShowLoading =isShowLoading;
    }

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    @observable pageSize = 10;
    @action setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    @observable isShowDialog= false;
    @action setIsShowDialog(isShowDialog){
        this.isShowDialog = isShowDialog;
    }

    @observable oilPriceObject ={};
    @action setOilPriceObject(oilPriceObject){
        this.oilPriceObject = oilPriceObject;
    }

    @observable isShowSubmitLoading = false;
    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }

    @observable oilPriceList = null;
    @action getOilPriceList(page_num,page_size){
        this.setIsShowLoading(true);
        const params = {
            page_num:page_num,
            page_size:page_size,
        }
        http.post('/website/shell/oil-market-price-query',params,response=>{
            this.setIsShowLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.pageSize;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map((item,index)=>{
                item.key = index;
            });
            this.oilPriceList = response.data;
        },err=>{
            this.setIsShowLoading(false);
            message.error(err);
        });
    }


    @action getUpdateOilPrice(id,no_eighty_nine_gasoline,no_ninety_two_gasoline, no_ninety_five_gasoline, no_zero_diesel_oil, no_ninety_eight_gasoline, no_one_diesel_oil, no_e_ninety_two_gasoline, no_two_diesel_oil) {
        this.setIsShowSubmitLoading(true);
        const params = {
            id: id,
            no_eighty_nine_gasoline: no_eighty_nine_gasoline,
            no_ninety_two_gasoline:no_ninety_two_gasoline,
            no_ninety_five_gasoline:no_ninety_five_gasoline,
            no_zero_diesel_oil:no_zero_diesel_oil,
            no_ninety_eight_gasoline:no_ninety_eight_gasoline,
            no_one_diesel_oil:no_one_diesel_oil,
            no_e_ninety_two_gasoline:no_e_ninety_two_gasoline,
            no_two_diesel_oil:no_two_diesel_oil
        };
        http.post('/website/shell/oil-market-price-update',params,response=>{
            this.setIsShowSubmitLoading(false);
            this.setIsShowDialog(false);
            this.getOilPriceList(1,this.pageSize);
            message.info("修改成功");
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }


}

export default OilPriceStore;

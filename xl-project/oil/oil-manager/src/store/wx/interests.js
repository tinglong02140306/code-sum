import {action, observable} from "mobx";
import http from "../../http/http";
import {message} from 'antd';
import {coupons} from '../../utils/test'

class InterestStore {

    @observable pagination = {};
    @action setPagination(pagination){
        this.pagination = pagination;
    }

    //Dialog中的loading
    @observable showLoadingDialog = false;
    @action setShowLoadingDialog(showLoadingDialog){
        this.showLoadingDialog = showLoadingDialog;
    }

    //页面的loading
    @observable showLoadingPage = false;
    @action setShowLoadingPage(showLoadingPage){
        this.showLoadingPage = showLoadingPage;
    }

    //展示Dialog
    @observable type = 0; //0:新增 1:查看 2:修改
    @observable isShowDialog=false;
    @action setIsShowDialog(isShowDialog,type){
        this.isShowDialog = isShowDialog;
        this.type = type;
    }

    @observable showData = null;
    @action setShowData(showData){
        this.showData = showData;
    }

    @observable activityList = [];//活动列表
    /**
     * 活动列表
     */
    @action getActivityList(page_num, page_size) {
        this.pageSize = page_size;
        const params = {
            page_num: page_num,
            page_size: page_size,
        }
        http.post('/website/coupon/activity-query',params,response=>{
            this.activityList = response.data;
            // console.log(JSON.stringify(response.data))
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
        },err=>{
            message.error(err);
        });
    }


    //优惠权益增加
    @action addInterests(params){
        console.log(params);
        this.setShowLoadingPage(true);
        http.post('/website/equity/equity-add',params,response=>{
            this.setShowLoadingPage(false);
            this.setIsShowDialog(false);
            message.info("添加成功");
            this.getInterestsList(1,15);
        },err=>{
            message.error(err);
            this.setShowLoadingPage(false);
        });
    }

    
    //优惠权益删除
    @action deleteInterests(id){
        const params = {id:id}
        this.setShowLoadingPage(true);
        http.post('/website/equity/equity-remove',params,response=>{
            this.setShowLoadingPage(false);
            this.setIsShowDialog(false);
            message.info("删除成功");
            this.getInterestsList(1,15);
        },err=>{
            message.error(err);
            this.setShowLoadingPage(false);
        });
    }

    //优惠权益修改
    @action updateInterests(params){
        console.log(params);
        this.setShowLoadingPage(true);
        http.post('/website/equity/equity-update',params,response=>{
            this.setShowLoadingPage(false);
            this.setIsShowDialog(false);
            message.info("修改成功");
            this.getInterestsList(1,15);
        },err=>{
            message.error(err);
            this.setShowLoadingPage(false);
        });
    }

    //数据列表
    @observable interestsList = [];
    @action getInterestsList(page_num, page_size){
        this.setShowLoadingPage(true);
        const params = {
            page_num:page_num,
            page_size:page_size
        }
        http.post('/website/equity/equity-query',params,response=>{
            this.setShowLoadingPage(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = page_size;
            pagination.current = page_num;
            pagination.showTotal=()=>{
                return `总共 ${response.amount} 条数据`;
            }
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.id});
            this.interestsList = response.data;
        },err=>{
            message.error(err);
            this.setShowLoadingPage(false);
        });
        // setTimeout(()=>{
        //     this.setShowLoadingPage(false);
        //     const pagination = {};
        //     pagination.total = 3;
        //     pagination.pageSize = page_size;
        //     pagination.current = page_num;
        //     pagination.showTotal=()=>{
        //         return `总共 ${3} 条数据`;
        //     }
        //     this.setPagination(pagination);
        //     coupons.map(item=>{item.key=item.id});
        //     this.interestsList = coupons;
        // },1000)
    }

}

export default InterestStore;
import {observable, action} from 'mobx';
import {message} from 'antd';
import http from '../../http/http';

class ServiceStore {

    @observable isShowSubmitLoading = false;

    @action setIsShowSubmitLoading(isShowSubmitLoading) {
        this.isShowSubmitLoading = isShowSubmitLoading;
    }

    @observable quartzObject = {};

    @action setQuartzObject(quartzObject) {
        this.quartzObject = quartzObject;
    }

    //定时任务保存
    @action getSaveQuartz(job_name, job_group, job_description, cron_expression) {
        const reqData = {
            job_name: job_name,
            job_group: job_group,
            job_description: job_description,
            cron_expression: cron_expression,
        }
        this.setIsShowSubmitLoading(true);
        http.post('/website/quartz/save',reqData,response=>{
            this.setIsShowSubmitLoading(false);
            message.info("提交成功");
            this.setIsShowQuartzDialog(false);
            this.getServiceList(1);
        },err=>{
            message.error(err);
            this.setIsShowSubmitLoading(false);
        });
    }

    @observable isShowLoading = false;

    @action setIsShoeLoading(isShowLoading) {
        this.isShowLoading = isShowLoading;
    }

    @observable isShowQuartzDialog = false;

    @action setIsShowQuartzDialog(isShowQuartzDialog) {
        this.isShowQuartzDialog = isShowQuartzDialog;
    }

    @observable serviceList = [];

    @action getServiceList(page_num) {
        if (!this.isShowLoading) {
            this.setIsShoeLoading(true);
        }
        http.post('/website/quartz/query',null,response=>{
            this.setIsShoeLoading(false);
            const pagination = {};
            pagination.total = response.amount;
            pagination.pageSize = this.page_size;
            pagination.current = page_num;
            pagination.showQuickJumper = true;
            this.setPagination(pagination);
            response.data&&response.data.map(item=>{item.key=item.id});
            this.serviceList = response.data;
        },err=>{
            message.error(err);
            this.setIsShoeLoading(false);
        });
    }

    @observable pagination = {};

    @action setPagination(pagination) {
        this.pagination = pagination;
    }

    @observable page_size = 10;

    @action setPageSize(page_size) {
        this.page_size = page_size;
    }

    //定时任务删除
    @action getQuartzRemove(job_name, job_group) {
        const reqDate = {
            job_name: job_name,
            job_group: job_group,
        }
        this.setIsShoeLoading(true);
        http.post('/website/quartz/remove',reqDate,response=>{
            this.getServiceList(1);
            message.info("该任务已删除");
        },err=>{
            message.error(err);
            this.setIsShoeLoading(false);
        });
    }

    //定时任务暂停
    @action getQuartzPause(job_name, job_group) {
        const reqDate = {
            job_name: job_name,
            job_group: job_group,
        }
        this.setIsShoeLoading(true);
        http.post('/website/quartz/pause',reqDate,response=>{
            this.getServiceList(1);
            message.info("该任务已暂停");
        },err=>{
            message.error(err);
            this.setIsShoeLoading(false);
        });
    }

    @action getQuartzResume(job_name, job_group) {
        const reqDate = {
            job_name: job_name,
            job_group: job_group,
        }
        this.setIsShoeLoading(true);
        http.post('/website/quartz/resume',reqDate,response=>{
            this.getServiceList(1);
            message.info("该任务已恢复");
        },err=>{
            message.error(err);
            this.setIsShoeLoading(false);
        });
    }

}

export default ServiceStore;
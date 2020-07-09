package com.iflytek.sgy.wjewt.service;

import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;

import java.util.List;

/**
 *
 * Created by Administrator on 2018/1/10.
 */
public interface IServiceEvent {

    /**
     * 获取指定申请对应的提醒事件列表，按照时间正序排列
     * @param id
     *      申请ID
     * @return
     */
    public List<ServiceYjncTasks> findTask(String id);


    /**
     * 获取第一次通知成功的时间
     * @param id
     * @return
     */
    public ServiceYjncTasks getFirstSuccess(String id,String type);
}

package com.iflytek.sgy.wjewt.service.impl;

import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.service.IServiceEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Service
public class ServiceEventImpl implements IServiceEvent {

    @Autowired
    private ServiceYjncTasksDao serviceYjncTasksDao;

    /**
     * 获取指定申请对应的提醒事件列表，按照时间正序排列
     * @param id
     *      申请ID
     * @return
     */
    public List<ServiceYjncTasks> findTask(String id){
        return serviceYjncTasksDao.findTask(id);
    }

    /**
     * 获取第一次通知成功的时间
     *
     * @param id
     * @return
     */
    @Override
    public ServiceYjncTasks getFirstSuccess(String id,String type) {
        return serviceYjncTasksDao.getFirstSuccess(id,type);
    }
}

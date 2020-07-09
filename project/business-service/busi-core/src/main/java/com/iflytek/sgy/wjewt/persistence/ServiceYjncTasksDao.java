package com.iflytek.sgy.wjewt.persistence;

import com.iflytek.sgy.wjewt.base.BaseDao;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * 一键挪车提醒事件列表
 * Created by Administrator on 2018/1/10.
 */
@Repository
public class ServiceYjncTasksDao extends BaseDao<ServiceYjncTasks> {

    /**
     * 获取指定申请对应的提醒事件列表，按照时间正序排列
     *      申请ID
     * @return
     */
    public List<ServiceYjncTasks> findTask(String id){
        StringBuilder hql = new StringBuilder("SELECT  EVENT_NAME, EVENT_TIME, EVENT_STATUS, EVENT_CONTENT FROM SERVICE_YJNC_TASKS T WHERE T.APPLY_ID = ? AND (T.EVENT_TYPE = ? OR T.EVENT_TYPE = ? ) ORDER BY EVENT_TIME DESC");;
        return findBySql(hql.toString(),ServiceYjncTasks.class,id,SysCode.EVENT_TYPE.SMS,SysCode.EVENT_TYPE.TEL);
    }

    /**
     *
     * @param tasks
     */
    synchronized public void saveTask(ServiceYjncTasks tasks){
        saveOrUpdate(tasks);
    }


    /**
     * 更新Type
     * @param taskId
     * @param type
     */
    synchronized public void  updateTaskType(String taskId,String type){
       createSqlQuery("update service_yjnc_tasks set event_type = :type where id= :id ").setParameter("type",type).setParameter("id",taskId).executeUpdate();
    }


    /**
     * 获取申请第一次通知成功事件对象，如果没有成功，则返回第一次失败对象
     * @param id
     *      申请ID
     *  @param type
     *      事件类型
     * @return
     */
    public ServiceYjncTasks getFirstSuccess(String id,String type){
        StringBuilder sql = new StringBuilder("SELECT  EVENT_NAME, EVENT_TIME, EVENT_STATUS, EVENT_CONTENT FROM SERVICE_YJNC_TASKS T WHERE T.APPLY_ID = ? AND T.EVENT_TYPE = ?  ORDER BY T.EVENT_TIME ASC");
        List<ServiceYjncTasks> list = findBySql(sql.toString(),ServiceYjncTasks.class,id,type);
        if (!CollectionUtils.isEmpty(list)) {
            for (ServiceYjncTasks task : list) {
                if (StringUtils.equalsIgnoreCase(task.getEventStatus(), SysCode.EVENT_STATUS.SUCCESS)) {
                    return task;
                }
            }
            return list.get(0);
        }else {
            return null;
        }
    }

}

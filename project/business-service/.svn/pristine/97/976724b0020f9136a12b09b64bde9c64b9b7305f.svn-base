package com.iflytek.sgy.wjewt.service.impl;

import com.alibaba.fastjson.JSON;
import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncApplyDao;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.service.IServiceYjncApply;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.MessageFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Service
public class ServiceYjncApplyImpl implements IServiceYjncApply {

    @Autowired
    private ServiceYjncApplyDao serviceYjncApplyDao;



    Logger logger = LoggerFactory.getLogger(this.getClass());


    /**
     * 获取挪车申请信息
     *
     * @param id
     * @return
     */
    @Override
    public ServiceYjncApply getApply(String id) {
        return serviceYjncApplyDao.findUniqueBy("id",id);
    }


    /**
     * 根据查询条件获取挪车申请列表
     *
     * @param apply
     */
    @Override
    public List<ServiceYjncApply> findQuery(ServiceYjncApply apply) {
        return serviceYjncApplyDao.findQuery(apply);
    }

    /**
     * 根据查询条件查询挪车信息
     *
     * @param page
     * @param serviceYjncApply
     * @return
     */
    @Override
    public Page<ServiceYjncApply> pageQuery(Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply) {
        return serviceYjncApplyDao.pageQuery(page,serviceYjncApply);
    }

    /**
     * 提交挪车申请
     *
     * @param serviceYjncApply
     * @return
     */
    @Override
    @Transactional
    public ResultMsg submitApply(ServiceYjncApply serviceYjncApply) {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        logger.info(MessageFormat.format("申请提交时间:{0}:{1}:{2}",calendar.get(Calendar.HOUR_OF_DAY),calendar.get(Calendar.MINUTE),calendar.get(Calendar.SECOND)));
        serviceYjncApply.setApplyTime(date);
        serviceYjncApply.setDeleteState(SysCode.DELETE_STATE.UNDELETED);
        serviceYjncApply.setStatus(SysCode.MOVE_STATUS.WATING);
        serviceYjncApplyDao.saveOrUpdate(serviceYjncApply);
        return ResultMsg.success("提交成功！",serviceYjncApply.getId());
    }

    /**
     * 移车申请完成，包括 成功、失败、取消 状态的改变
     *
     * @param id
     * @param status
     * @return
     */
    @Override
    @Transactional
    public ResultMsg finish(String id, String status,String userName) {
        int res = serviceYjncApplyDao.updateStatus(id,status,userName);
        if(res > 0){
            return ResultMsg.success("更新成功！",null);
        }else {
            return ResultMsg.fail("更新失败！",null);
        }
    }


    /**
     * 保存催办状态
     *
     * @param id
     */
    @Override
    @Transactional
    public void press(String id) {
        serviceYjncApplyDao.updatePressed(id);
    }

    /**
     * 提交评价
     * @return
     */
    @Override
    @Transactional
    public ResultMsg evaluate(ServiceYjncApply apply) {
        if (checkFinished(apply.getId())) {
          return ResultMsg.fail("申请已经完成，无法再次提交评价",null);
        }else {
            int res = serviceYjncApplyDao.evaluate(apply);
            if(res > 0){
                return ResultMsg.success("更新成功！",null);
            }else {
                return ResultMsg.fail("更新失败！",null);
            }
        }
    }


    /**
     * 查询用户待移车状态申请
     * @param userId
     *          用户ID
     * @return
     */
    @Override
    public String hasApplying(String userId) {
       return serviceYjncApplyDao.findApplying(userId,SysCode.MOVE_STATUS.WATING);
    }

    /**
     * 获取用户是否有带评价申请
     *
     * @param userId
     * @return
     */
    @Override
    public String hasEvaluating(String userId) {
        return serviceYjncApplyDao.findApplying(userId,SysCode.MOVE_STATUS.EVALUATING);
    }

    /**
     * 检查此申请是否已经完成，避免重复访问页面
     *
     * @param id 申请ID
     * @return 检查结果，已完成 true 未完成 false
     */
    @Override
    public boolean checkFinished(String id) {
       Object o =  serviceYjncApplyDao.findWithStatus(id,SysCode.MOVE_STATUS.SUCCESS,SysCode.MOVE_STATUS.FAIL);
       return o != null;
    }

    /**
     * 检测ID的申请 是否数据此用户
     * @param id
     * @param userId
     * @return
     */
    @Override
    public  boolean checkApplyUserAccess(String id,String userId){
        Object o = serviceYjncApplyDao.checkUserApplyAccess(id, userId);
        return  o != null;
    }
}

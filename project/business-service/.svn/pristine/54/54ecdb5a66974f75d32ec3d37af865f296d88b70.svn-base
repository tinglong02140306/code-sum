package com.iflytek.sgy.wjewt.services.yjnc.service.impl;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.dto.DriverInfo;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.redis.SysConfigCache;
import com.iflytek.sgy.wjewt.redis.UserApplyNumberCache;
import com.iflytek.sgy.wjewt.service.IServiceYjncApply;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import com.iflytek.sgy.wjewt.services.yjnc.service.CarMoveBusinessService;
import com.iflytek.sgy.wjewt.services.yjnc.service.IBusinessUserService;
import com.iflytek.sgy.wjewt.services.yjnc.service.IDriverInfoService;
import com.iflytek.sgy.wjewt.services.yjnc.service.events.EventHandlerFactory;
import com.iflytek.sgy.wjewt.services.yjnc.service.events.TELEventHandler;
import org.apache.commons.lang.StringUtils;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/10.
 */
@Service
public class CarMoveBusinessServiceImpl implements CarMoveBusinessService {

    @Autowired
    private IServiceYjncApply iServiceYjncApply;

    @Autowired
    private SysConfigCache sysConfigCache;

    /**
     * 用户申请次数缓存
     */
    @Autowired
    private UserApplyNumberCache userApplyNumberCache;

    @Autowired
    private IBusinessUserService businessUserService;

    @Autowired
    private IDriverInfoService driverInfoService;





    @Autowired
    private EventHandlerFactory eventHandlerFactory;

    @Autowired
    private ServiceYjncTasksDao serviceYjncTasksDao;

    @Autowired
    private TELEventHandler telEventHandler;

    /**
     * 获取挪车申请信息
     *
     * @param id
     * @return
     */
    @Override
    public ServiceYjncApply getApply(String id) {
        return iServiceYjncApply.getApply(id);
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
        return iServiceYjncApply.pageQuery(page,serviceYjncApply);
    }

    /**
     * 提交挪车申请
     *
     * @param serviceYjncApply
     * @return
     */
    @Override
    @Transactional
    public ResultMsg submitApply(ServiceYjncApply serviceYjncApply,HttpServletRequest request) {

        Map<String,Object> userInfo  = businessUserService.getUserInfo(request);
        String userId = (String)userInfo.get("userId");

        //校验用户申请xianzhi
        if (checkApplyNum(userId)){
            return ResultMsg.fail("您的手机号今天已经有'"+sysConfigCache.getConfig("LIMIT_NUM")+"'次挪车申请记录，今天不能再申请挪车了喔",null);
        }

        //查询车主信息
        DriverInfo driverInfo = driverInfoService.getDriverInfo(serviceYjncApply.getCarPlateNum(),serviceYjncApply.getCarPlateType());

        if (driverInfo == null){
            return ResultMsg.fail("联系不到车主，请尝试其它挪车方式",null);
        }

        serviceYjncApply.setApplyerUserId(userId);
        if (userInfo.get("mobile") != null){
            serviceYjncApply.setApplyerMobile((String)userInfo.get("mobile"));
        }
        if (userInfo.get("name") != null && StringUtils.isNotBlank((String)userInfo.get("name"))){
            serviceYjncApply.setApplyerName((String)userInfo.get("name"));
        }else if (userInfo.get("nickname") != null && StringUtils.isNotBlank((String)userInfo.get("nickname"))){
            serviceYjncApply.setApplyerName((String)userInfo.get("nickname"));
        }
        serviceYjncApply.setDriverMobile(driverInfo.getMobile());
        serviceYjncApply.setDriverName(driverInfo.getName());
        if (StringUtils.isBlank(serviceYjncApply.getSmsOrNot())){
            serviceYjncApply.setSmsOrNot(SysCode.YES_NO.YES);
        }

        iServiceYjncApply.submitApply(serviceYjncApply);
        //开启通知
        eventHandlerFactory.startEvent(serviceYjncApply);

        userApplyNumberCache.addCache(userId);
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
    public ResultMsg finish(String id, String status, HttpServletRequest request) {
        Map<String,Object> userInfo =  businessUserService.getUserInfo();
        ResultMsg resultMsg = iServiceYjncApply.finish(id,status,(String)userInfo.get("name"));
        return resultMsg;
    }

    /**
     * 提交评价
     * @return
     */
    @Override
    public ResultMsg evaluate(ServiceYjncApply apply) {
       return iServiceYjncApply.evaluate(apply);

    }

    /**
     * 查询用户待移车状态申请
     * @param userId
     *          用户ID
     * @return
     */
    @Override
    public String hasApplying(String userId) {
      return iServiceYjncApply.hasApplying(userId);
    }

    /**
     * 获取用户是否有带评价申请
     *
     * @param userId
     * @return
     */
    @Override
    public String hasEvaluating(String userId) {
        return iServiceYjncApply.hasEvaluating(userId);
    }

    /**
     * 催一催
     *
     * @param id
     * @return
     */
    @Override
    public ResultMsg pressApply(String id) {
       ServiceYjncApply serviceYjncApply = iServiceYjncApply.getApply(id);
       Date applyDate = serviceYjncApply.getApplyTime();
       Date current = new Date();
       int limit = Integer.valueOf(sysConfigCache.getConfig("PRESS_TIME"));
       long time =(current.getTime()-applyDate.getTime())/1000/60;
       //检测间隔时间
        if (time < limit ){
            return ResultMsg.fail("未到催办时间，请耐心等待！",null);
        }
        if (time > 60){
            return ResultMsg.fail("移车时间已过期，无法再次催办，请选择其他移车方式！",null);
        }
        //催促标识
        serviceYjncApply.setPressed(true);
        serviceYjncApply.setPressedOrNot(SysCode.YES_NO.YES);
        iServiceYjncApply.press(id);
        eventHandlerFactory.startEvent(serviceYjncApply);
        return ResultMsg.success("催办已发起，请耐心等待！",null);
    }

    /**
     * 获取电话接听状态
     *
     * @param taskId
     * @param status
     */
    @Override
    @Transactional
    public void insertDialState(String taskId, String status) {
        //获取电话初始事件信息
        ServiceYjncTasks task = serviceYjncTasksDao.findUniqueBy("id",taskId);

        //防止同一事件多次提交
        if (StringUtils.equalsIgnoreCase(SysCode.EVENT_STATUS.SUCCESS,task.getEventStatus()) || StringUtils.equalsIgnoreCase(SysCode.EVENT_STATUS.FAIL,task.getEventStatus())){
            return;
        }

        //如果已接听，或者已经拨打过一次，则直接存储结果
        if (StringUtils.equalsIgnoreCase(SysCode.EVENT_STATUS.SUCCESS,status) || StringUtils.equalsIgnoreCase(task.getEventType(),SysCode.EVENT_TYPE.DIALED) ){
                task.setEventType(SysCode.EVENT_TYPE.TEL);
                task.setEventStatus(status);
                task.setEventTime(new Date());
                task.setEventName(task.getEventName().concat(StringUtils.equalsIgnoreCase(SysCode.EVENT_STATUS.SUCCESS,status)? "已接听":"未接听"));
                serviceYjncTasksDao.saveTask(task);
        }else {
            //否则设置拨打状态，同时再次执行重播
            serviceYjncTasksDao.updateTaskType(task.getId(),SysCode.EVENT_TYPE.DIALED);
            telEventHandler.retrySend(task.getTargetObject(),task.getEventContent(),taskId);
        }

    }

    /**
     * 检查此申请是否已经完成，避免重复访问页面
     *
     * @param id 申请ID
     * @return 检查结果，已完成 true 未完成 false
     */
    @Override
    public boolean checkFinished(String id) {
        return StringUtils.isNotBlank(id) && iServiceYjncApply.checkFinished(id);
    }

    /**
     * 检测当前用户是否
     *
     * @param id
     * @param userId
     * @return
     */
    @Override
    public boolean checkUserAccess(String id, String userId) {
        return iServiceYjncApply.checkApplyUserAccess(id, userId);
    }

    /**
     * 检测用户当日申请次数
     * @param userId
     * @return
     */
    private boolean checkApplyNum(String userId){
        int num =  userApplyNumberCache.getNumber(userId);
        String limit = sysConfigCache.getConfig("LIMIT_NUM");
        return num >= Integer.valueOf(limit);
    }
}

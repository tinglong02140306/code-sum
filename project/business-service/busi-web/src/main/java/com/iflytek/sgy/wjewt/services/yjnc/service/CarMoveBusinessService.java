package com.iflytek.sgy.wjewt.services.yjnc.service;


import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.base.ResultMsg;

import javax.servlet.http.HttpServletRequest;

/**
 * 一键挪车业务服务接口
 * Created by Administrator on 2018/1/10.
 */
public interface CarMoveBusinessService {

    /**
     * 获取挪车申请信息
     * @param id
     * @return
     */
    public ServiceYjncApply getApply(String id);

    /**
     * 根据查询条件查询挪车信息
     * @param page
     * @param serviceYjncApply
     * @return
     */
    public Page<ServiceYjncApply> pageQuery(Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply);

    /**
     * 提交挪车申请
     * @param serviceYjncApply
     * @return
     */
    public ResultMsg submitApply(ServiceYjncApply serviceYjncApply,HttpServletRequest request);


    /**
     * 移车申请完成，包括 成功、失败、取消 状态的改变
     * @param status
     * @return
     */
    public ResultMsg finish(String id, String status, HttpServletRequest request);

    /**
     * 提交评价及移车结果
     * @return
     */
    public ResultMsg evaluate(ServiceYjncApply apply);


    /**
     * 获取用户是否含有待处理状态申请
     * @param userId
     *          用户ID
     * @return
     */
    public String hasApplying(String userId);

    /**
     * 获取用户是否有带评价申请
     * @param userId
     * @return
     */
    public String hasEvaluating(String userId);


    /**
     * 催一催
     * @param id
     * @return
     */
    public ResultMsg pressApply(String id);


    /**
     * 获取电话接听状态
     * @param taskId
     * @param status
     */
    public void insertDialState(String taskId,String status);

    /**
     * 检查此申请是否已经完成，避免重复访问页面
     *
     * @param id 申请ID
     * @return 检查结果，已完成 true 未完成 false
     */
    public boolean checkFinished(String id);


    /**
     * 检测当前用户是否
     * @param id
     * @return
     */
    public boolean checkUserAccess(String id,String userId);
}

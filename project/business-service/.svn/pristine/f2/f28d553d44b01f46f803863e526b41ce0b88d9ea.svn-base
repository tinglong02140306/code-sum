package com.iflytek.sgy.wjewt.service;


import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.base.ResultMsg;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
public interface IServiceYjncApply {

    /**
     * 获取挪车申请信息
     * @param id
     * @return
     */
    public ServiceYjncApply getApply(String id);

    /**
     * 根据查询条件获取挪车申请列表
     */
    public List<ServiceYjncApply> findQuery(ServiceYjncApply apply);

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
    public ResultMsg submitApply(ServiceYjncApply serviceYjncApply);


    /**
     * 移车申请完成，包括 成功、失败、取消 状态的改变
     * @param id
     * @param status
     * @return
     */
    public ResultMsg finish(String id,String status,String userName);

    /**
     * 保存催办状态
     * @param id
     */
    public void press(String id);

    /**
     * 提交评价
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
     *      用户ID
     * @return
     *      如果有待评价的申请，则返回对应的申请ID，否则返回Null
     */
    public String hasEvaluating(String userId);


    /**
     * 检查此申请是否已经完成，避免重复访问页面
     * @param id
     *      申请ID
     * @return
     *      检查结果，已完成 true 未完成 false
     */
    public boolean checkFinished(String id);

    /**
     * 检测ID的申请 是否数据此用户
     * @param id
     * @param userId
     * @return
     */
    public  boolean checkApplyUserAccess(String id,String userId);


}

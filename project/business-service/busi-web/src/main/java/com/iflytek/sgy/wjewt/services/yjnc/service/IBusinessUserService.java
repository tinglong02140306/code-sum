package com.iflytek.sgy.wjewt.services.yjnc.service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * 用户相关信息获取接口
 * Created by Administrator on 2018/1/12.
 */
public interface IBusinessUserService{

    /**
     * 获取当前用户信息
     * @return
     */
    public Map<String,Object> getUserInfo();

    /**
     * 获取当前用户信息
     * @return
     */
    public Map<String,Object> getUserInfo(HttpServletRequest request);

    /**
     * 获取当前用户绑定账户信息
     * @return
     */
    public List<Map<String, Object>> getCurrentUserBindAccount();


    /**
     * 获取当前用户ID
     */
    public String getCurrentUserId(HttpServletRequest request);


    /**
     * 获取当前用户申请次数
     * @return
     */
    public int getCurrentUserApplyNumber(HttpServletRequest request);




}

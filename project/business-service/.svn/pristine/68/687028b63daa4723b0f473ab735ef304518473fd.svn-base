package com.iflytek.sgy.wjewt.services.yjnc.service.impl;

import bingo.jmt.client.web.service.JmtClientService;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.redis.UserApplyNumberCache;
import com.iflytek.sgy.wjewt.services.yjnc.service.IBusinessUserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * 获取用户信息接口
 * Created by Administrator on 2018/1/12.
 */
@Service
public class BusinessUserServiceImpl implements IBusinessUserService {

    JmtClientService clientService = new JmtClientService();


    @Autowired
    private UserApplyNumberCache userApplyNumberCache;

    @Autowired
    private ApplicationConstants applicationConstants;

    /**
     * 获取当前用户信息
     *
     * @return
     */
    @Override
    public Map<String, Object> getUserInfo() {
        //获取登陆警民通云平台用户详细信息
        Map<String, Object> result = clientService.getCurrentUserDetail(applicationConstants.getCLIENT_ID());
        if (result.get("code").toString().equals("1")) {
            //成功获取用户信息
            Map<String, Object> userDetail = (Map<String, Object>) result.get("data");
            return userDetail;

        } else {
            System.out.println("获取用户信息失败");
            return null;
        }
    }

    @Override
    public Map<String, Object> getUserInfo(HttpServletRequest request) {
        Object userDetail = (request == null) ? null : request.getSession().getAttribute("userDetail");
        if (userDetail == null || !(userDetail instanceof Map)) {
            userDetail = getUserInfo();
            request.getSession().setAttribute("userDetail", userDetail);
        }
        return userDetail == null ? null : (Map<String, Object>) userDetail;
    }


    /**
     * 获取当前用户绑定账户信息
     *
     * @return
     */
    @Override
    public List<Map<String, Object>> getCurrentUserBindAccount() {
        Map<String, Object> userDetail = getUserInfo();
        if (userDetail != null) {
            return (List<Map<String, Object>>) userDetail.get("bindlist");
        } else {
            return null;
        }
    }

    /**
     * 获取当前用户ID
     */
    @Override
    public String getCurrentUserId(HttpServletRequest request) {
        Map<String, Object> userDetail = getUserInfo(request);
        if (userDetail != null) {
            return (String) userDetail.get("userId");
        }
        return null;
    }

    /**
     * 获取当前用户申请次数
     *
     * @return
     */
    @Override
    public int getCurrentUserApplyNumber(HttpServletRequest request) {
        String userId = getCurrentUserId(request);
        if (StringUtils.isNotBlank(userId)) {
            return userApplyNumberCache.getNumber(userId);
        } else {
            return 0;
        }
    }
}

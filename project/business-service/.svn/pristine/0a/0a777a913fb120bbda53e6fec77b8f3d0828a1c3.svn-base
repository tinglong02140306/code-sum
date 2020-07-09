package com.iflytek.sgy.wjewt.controller;

import com.iflytek.sgy.wjewt.redis.SysConfigCache;
import com.iflytek.sgy.wjewt.service.IServiceSysConfig;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 系统配置Controller
 * Created by Administrator on 2018/1/10.
 */
@Controller
public class SysConfigController {

    @Autowired
    private IServiceSysConfig iServiceSysConfig;

    @Autowired
    private SysConfigCache sysConfigCache;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 查询所有系统配置项
     * @return
     */
    @RequestMapping("/sys/configs")
    @ResponseBody
    public ResultMsg listSysConfig(){
        return ResultMsg.success(iServiceSysConfig.findAll());
    }

    /**
     * 根据Key 查询指定配置项
     * @param key
     * @return
     */
    @RequestMapping("/sys/getConfig")
    @ResponseBody
    public ResultMsg getServiceConfig(String key){
        return ResultMsg.success(sysConfigCache.getConfig(key));
    }

    /**
     * 设置配置项
     * @param request
     * @return
     */
    @RequestMapping(value = "/sys/setConfig", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg setConfig(HttpServletRequest request){
        try {
            iServiceSysConfig.setConfig(request.getParameterMap());
            sysConfigCache.update();
            return new ResultMsg(true,"操作成功！",null);
        }catch (Exception e){
            logger.error("保存失败",e);
            return new ResultMsg(false,"操作保存失败",e.getMessage());
        }

    }

}

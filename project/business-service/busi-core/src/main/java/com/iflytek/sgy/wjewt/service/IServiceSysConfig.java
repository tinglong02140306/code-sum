package com.iflytek.sgy.wjewt.service;

import com.iflytek.sgy.wjewt.domain.entity.ServiceSysConfig;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/10.
 */
public interface IServiceSysConfig {

    /**
     * 获取所有系统配置项
     * @return
     */
    public List<ServiceSysConfig> findAll();


    /**
     * 获取指定配置项
     * @param key
     *      配置项KEY
     * @return
     */
    public ServiceSysConfig getSysConfig(String key);


    /**
     * 保存或更新配置信息
     * @param map
     */
    public void setConfig(Map<String,String []> map);
}

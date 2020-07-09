package com.iflytek.sgy.wjewt.service.impl;

import com.iflytek.sgy.wjewt.domain.entity.ServiceSysConfig;
import com.iflytek.sgy.wjewt.persistence.ServiceSysConfigDao;
import com.iflytek.sgy.wjewt.service.IServiceSysConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/10.
 */
@Service("iServiceSysConfig")
public class ServiceSysConfigImpl implements IServiceSysConfig {

    @Autowired
    private ServiceSysConfigDao serviceSysConfigDao;

    /**
     * 获取所有系统配置项
     *
     * @return
     */
    @Override
    public List<ServiceSysConfig> findAll() {
        return serviceSysConfigDao.findAll();
    }

    /**
     * 获取指定配置项
     * @param key
     *      配置项KEY
     * @return
     */
    @Override
    public ServiceSysConfig getSysConfig(String key) {
        return serviceSysConfigDao.findUniqueBy("key",key);
    }

    /**
     * 保存或更新配置信息
     *
     * @param map
     */
    @Override
    @Transactional
    public void setConfig(Map<String, String []> map) {
        Iterator<Map.Entry<String,String[]>> iterator = map.entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry<String,String []> entry = iterator.next();
            serviceSysConfigDao.updateConfig(entry.getKey(),entry.getValue()[0]);
        }
    }
}

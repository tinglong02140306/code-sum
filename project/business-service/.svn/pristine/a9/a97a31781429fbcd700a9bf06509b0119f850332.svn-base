package com.iflytek.sgy.wjewt.redis;

import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceSysConfig;
import com.iflytek.sgy.wjewt.service.IServiceSysConfig;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;

/**
 * 系统配置缓存
 * Created by Administrator on 2018/1/11.
 */
@Service
public class SysConfigCache implements InitializingBean {


    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private IServiceSysConfig iServiceSysConfig;


    @Override
    public void afterPropertiesSet() throws Exception {
        load();
    }

    public void load() {
        List<ServiceSysConfig> serviceSysConfigs = iServiceSysConfig.findAll();
        Map<String, String> sysConfigs = new HashMap<String, String>();
        for (ServiceSysConfig config : serviceSysConfigs) {
            try {
                Field codeFiled = ServiceSysConfig.class.getDeclaredField("key");
                codeFiled.setAccessible(true);
                Field nameField = ServiceSysConfig.class.getDeclaredField("value");
                nameField.setAccessible(true);
                String key = (String) codeFiled.get(config);
                String value = (String) nameField.get(config);
                sysConfigs.put(key, value);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            }
        }
        redisUtil.setHash(SysCode.SYSCONFIG_CACHE_PREFIX, sysConfigs);
    }

    /**
     * 根据Key获取配置缓存，如果没有则加载缓存
     *
     * @param key
     * @return
     */
    public String getConfig(String key) {
        Map<String,String> configs = getConfigs();
        return configs.get(key);
    }


    /**
     * 更新缓存
     */
    public void update() {
        redisUtil.removePattern(SysCode.SYSCONFIG_CACHE_PREFIX);
        load();
    }

    /**
     * 获取所有系统配置项缓存
     *
     * @return
     */
    public Map<String, String> getConfigs() {
       Map<String,String > sysConfig = redisUtil.getHash(SysCode.SYSCONFIG_CACHE_PREFIX);
        if (sysConfig == null) {
            update();
            return redisUtil.getHash(SysCode.SYSCONFIG_CACHE_PREFIX);
        } else {
            return sysConfig;
        }
    }
}

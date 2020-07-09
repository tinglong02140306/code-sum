package com.iflytek.sgy.wjewt.persistence;

import com.iflytek.sgy.wjewt.base.BaseDao;
import com.iflytek.sgy.wjewt.domain.entity.ServiceSysConfig;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Repository
public class ServiceSysConfigDao extends BaseDao<ServiceSysConfig> {

    /**
     * 获取所有系统配置项
     * @return
     */
    public List<ServiceSysConfig> findAll(){
        return find("from ServiceSysConfig");
    }


    /**
     * 更新系统配置项
     * @param key
     * @param value
     */
    public void updateConfig(String key,String value){
        createSqlQuery("update SERVICE_SYS_CONFIG set value = :value where key=:key").setParameter("key",key).setParameter("value",value).executeUpdate();
    }


}

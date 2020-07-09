package com.iflytek.sgy.wjewt.redis;

import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceSysConfig;
import com.iflytek.sgy.wjewt.service.IServiceSysConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;

/**
 * 用户剩余申请次数缓存
 * Created by Administrator on 2018/1/11.
 */
@Service
public class UserApplyNumberCache {


    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private IServiceSysConfig iServiceSysConfig;



    /**
     * 设置用户缓存
     * @param userId
     */
    synchronized public void addCache(String userId){
        redisUtil.increment(SysCode.USERAPPLY_CACHE_PREFIX+userId,getExpire());
    }

    /**
     * 获取用户申请次数缓存
     * @param userId
     * @return
     */
    public int getNumber(String userId){
        Object value = redisUtil.get(SysCode.USERAPPLY_CACHE_PREFIX+userId);
        if (value == null){
            return 0;
        }else {
            return Integer.valueOf((String)value);
        }
    }

    /**
     * 获取缓存过期时间单位 秒
     */
    public long getExpire(){
        Calendar currentTime = Calendar.getInstance();
        Calendar expireCalender = Calendar.getInstance();
        ServiceSysConfig sysConfigEnd = iServiceSysConfig.getSysConfig("SERVICE_END");
        String [] value = sysConfigEnd.getValue().split(":");
        expireCalender.set(Calendar.HOUR_OF_DAY,Integer.valueOf(value[0]));
        expireCalender.set(Calendar.MINUTE,Integer.valueOf(value[1]));
        expireCalender.set(Calendar.SECOND,59);
        return (expireCalender.getTimeInMillis() -currentTime.getTimeInMillis())/1000;
    }

}

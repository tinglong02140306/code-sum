package com.iflytek.sgy.wjewt.redis;

import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.base.SysCode;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.io.Serializable;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by Administrator on 2017/9/18.
 */
public class RedisUtil {

    private RedisTemplate<Serializable, Object> redisTemplate;

    /**
     * 批量删除对应的value
     *
     * @param keys
     */
    public void remove(final String... keys) {
        for (String key : keys) {
            remove(key);
        }
    }

    /**
     * 批量删除key
     *
     * @param pattern
     */
    public void removePattern(final String pattern) {
        Set<Serializable> keys = redisTemplate.keys(pattern);
        if (keys.size() > 0)
            redisTemplate.delete(keys);
    }

    /**
     * 删除对应的value
     *
     * @param key
     */
    public void remove(final String key) {
        if (exists(key)) {
            redisTemplate.delete(key);
        }
    }

    /**
     * 判断缓存中是否有对应的value
     *
     * @param key
     * @return
     */
    public boolean exists(final String key) {
        return redisTemplate.hasKey(key);
    }

    /**
     * 自增加1,默认自增1 ，超时设置单位秒
     * @param key
     */
    public void increment(String key,long expire){
        ValueOperations<Serializable, Object> operations =  redisTemplate.opsForValue();
        operations.increment(key,1);
        redisTemplate.expire(key,expire,TimeUnit.SECONDS);
    }

    /**
     * 自增加
     * @param key
     */
    public void increment(String key,int increment,long expire,TimeUnit timeUnit){
        ValueOperations<Serializable, Object> operations =  redisTemplate.opsForValue();
        operations.increment(key,increment);
        redisTemplate.expire(key,expire,timeUnit);
    }



    /**
     * 读取缓存
     *
     * @param key
     * @return
     */
    public Object get(final String key) {
        Object result = null;
        ValueOperations<Serializable, Object> operations = redisTemplate
                .opsForValue();
        result = operations.get(key);
        return result;
    }

    /**
     * 获取Hash信息
     * @param key
     * @return
     */
    public <HK,HV> Map<HK,HV> getHash(String key){
        HashOperations<Serializable,HK,HV> operations = redisTemplate.opsForHash();
        return operations.entries(key);
    }

    /**
     * 写入缓存
     *
     * @param key
     * @param value
     * @return
     */
    public boolean set(final String key, Object value) {
        boolean result = false;
        try {
            ValueOperations<Serializable, Object> operations = redisTemplate
                    .opsForValue();
            operations.set(key, value);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 设置HASH值
     * @param key
     * @param map
     * @return
     */
    public  boolean setHash(String key,Map<String,String> map){
        boolean result = false;
        try {
            HashOperations<Serializable,String,String> operations = redisTemplate.opsForHash();
            operations.putAll(key,map);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 写入缓存
     *
     * @param key
     * @param value
     * @return
     */
    public boolean set(final String key, Object value, Long expireTime) {
        boolean result = false;
        try {
            ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
            operations.set(key, value);
            redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public void setRedisTemplate(
            RedisTemplate<Serializable, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 写入缓存
     *
     * @param map
     * @return
     */
    public boolean mset(Map<String,Object> map) {
        boolean result = false;
        try {
            ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
            operations.multiSet(map);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public List getPattern(String keyPattren){
        Set<Serializable> keys = redisTemplate.keys(keyPattren);
        if (keys !=null && keys.size() > 0){
            try {
                ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
                return operations.multiGet(keys);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return null;
    }


    public Set<Serializable>  getKeys(String keyPattern){
        Set<Serializable> keys = redisTemplate.keys(keyPattern);
        return keys;
    }

    /**
     * 根据类型简拼获取缓存字典列表
     * @param lxjp
     * @return
     */
    public List getCacheDictList(String lxjp){
        Set<Serializable> keys = redisTemplate.keys(SysCode.DICT_CACHE_PREFIX+"*");
        List<JSONObject> list = new ArrayList<JSONObject>();
        Iterator iterator = keys.iterator();
        while (iterator.hasNext()){
          String redisKey =  (String)iterator.next();
          String code = redisKey.replace(SysCode.DICT_CACHE_PREFIX+lxjp+":","");
          Object name = get(redisKey);
          JSONObject object = new JSONObject();
          object.put("code",code);
          object.put("name",name);
          list.add(object);
        }
        return list;
    }

}

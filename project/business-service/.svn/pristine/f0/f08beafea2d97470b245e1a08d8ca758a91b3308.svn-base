package com.iflytek.sgy.wjewt.redis;


import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceDictionary;
import com.iflytek.sgy.wjewt.service.IServiceDictionanry;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;


/**
 * 系统通用字典缓存
 * Created by Administrator on 2017/9/22.
 */
public class DictCache implements InitializingBean {

    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private IServiceDictionanry iServiceDictionanry;


    /**
     * 默认数据编码字段属性名
     */
    public String codeFieldName = "code";
    /**
     * 默认数据值字段属性名
     */
    public String nameFieldName = "name";

    /**
     * 默认数据类型简拼属性名
     */
    public String lxjpFielddName = "type";


    public String getCodeFieldName() {
        return codeFieldName;
    }

    public void setCodeFieldName(String codeFieldName) {
        this.codeFieldName = codeFieldName;
    }

    public String getNameFieldName() {
        return nameFieldName;
    }

    public void setNameFieldName(String nameFieldName) {
        this.nameFieldName = nameFieldName;
    }

    public String getLxjpFielddName() {
        return lxjpFielddName;
    }

    public void setLxjpFielddName(String lxjpFielddName) {
        this.lxjpFielddName = lxjpFielddName;
    }


    /**
     * 根据类型简拼获取字典项列表
     * @param lxjp
     *      类型简拼
     * @return
     */
    public List getDictList(String lxjp){
        return redisUtil.getCacheDictList(lxjp);
    }

    /**
     * 获取缓存数据加载
     * @return
     */
    protected void setCache(String lxjp,String code,String name) {
        redisUtil.set(SysCode.DICT_CACHE_PREFIX+lxjp+":"+code,name);
    }

    /**
     * 获取指定字典缓存
     * @param lxjp
     *      字典类型
     * @param code
     *      字典编码
     * @return
     */
    public String getCache(String lxjp,String code){
        return (String)redisUtil.get(SysCode.DICT_CACHE_PREFIX+lxjp+":"+code);
    }


    public void afterPropertiesSet() throws Exception {
        String [] str = this.clearCaches();
        if ( str != null && str.length>0){
            for (String c:str){
                redisUtil.removePattern(SysCode.DICT_CACHE_PREFIX+c+":*");
            }
        }
        load();
    }

    /**
     * 默认加载getData()的数据，可以进行重载，调用setCache(String lxjp,String code,String name) 方法自定义加载缓存数据
     */
    public void load(){
            List list = getData();
            try {
                for (Object item:list){
                    Class clazz = item.getClass();
                    if (clazz.equals(Map.class) || clazz.equals(JSONObject.class)){
                        Map map = (Map)item;
                        String code =(String)map.get(codeFieldName);
                        String name =(String)map.get(nameFieldName);
                        String lxjp =(String)map.get(lxjpFielddName);
                        redisUtil.set(SysCode.DICT_CACHE_PREFIX+lxjp+":"+code,name);
                    }else {
                        Field codeFiled = clazz.getDeclaredField(codeFieldName);
                        codeFiled.setAccessible(true);
                        Field nameField = clazz.getDeclaredField(nameFieldName);
                        nameField.setAccessible(true);
                        Field lxjpField = clazz.getDeclaredField(lxjpFielddName);
                        lxjpField.setAccessible(true);
                        String code = (String) codeFiled.get(item);
                        String name = (String) nameField.get(item);
                        String lxjp = (String) lxjpField.get(item);
                        redisUtil.set(SysCode.DICT_CACHE_PREFIX+lxjp+":"+code,name);
                    }
                }
            } catch (NoSuchFieldException e) {
                System.out.println("属性名错误，无法解析当前数据！");
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                System.out.println("无法获取此属性的值，请确认属性是否为私有！");
                e.printStackTrace();
            }
    }

    /**
     * 加载数据
     * @return
     */
    public List getData(){
        List<ServiceDictionary> list = iServiceDictionanry.getDictionary(null);
        return list;
    }

    /**
     * 指定初始化时要删除的缓存类型简拼，返回字符串数组
     *    eg.  return new String[]{"SEX,"XZQH"};
     * 注意谨慎设置此项，因为此处设置的类型简拼，在初始化时会全部清空
     * @return
     */
    public String [] clearCaches(){
        return new String[]{"PLATE_TYPE","REASON_TYPE","MOVE_STATUS","EVALUATE_LEVEL","EVALUATE_LEVEL","APPLY_SOURCE","EVENT_TYPE"};
    }




}

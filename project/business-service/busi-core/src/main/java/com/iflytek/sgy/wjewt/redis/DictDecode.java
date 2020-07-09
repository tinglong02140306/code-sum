package com.iflytek.sgy.wjewt.redis;

import com.iflytek.sgy.wjewt.base.SysCode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * 字典解码服务
 * Created by Administrator on 2017/9/22.
 */
@Service
public class DictDecode {

    /**
     * 注入redis工具
     */
    @Autowired
    private RedisUtil redisUtil;


    /**
     * 解码数据列表
     *
     * @param o
     */
    public void decode(Object o) {
        if (o == null) {
            return;
        }
        if (o instanceof List) {
            List list = (List) o;
            decode(list);
        } else {
            List<Field> anaotationFields = new ArrayList<Field>();
            Class clazz = o.getClass();
            //获取所有带注解的属性
            Field[] fields = clazz.getDeclaredFields();
            for (Field f : fields) {
                f.setAccessible(true);
                if (f.getAnnotation(DictCode.class) != null) {
                    anaotationFields.add(f);
                }
            }
            decodeObject(o, anaotationFields);
        }
    }

    /**
     * 将指定对象的所有DictCache注解的字段进行翻译
     *
     * @param o
     * @param fields
     */
    private void decodeObject(Object o, List<Field> fields) {
        if (o != null && fields != null && fields.size() > 0) {
            for (Field field : fields) {
                String dataFiledName = field.getAnnotation(DictCode.class).field();
                String lxjp = field.getAnnotation(DictCode.class).lxjp();
                try {
                    Field dataField = o.getClass().getDeclaredField(dataFiledName);
                    dataField.setAccessible(true);
                    String code = (String) dataField.get(o);
                    if (StringUtils.isNotBlank(code)){
                        Object val = redisUtil.get(SysCode.DICT_CACHE_PREFIX + lxjp + ":" + code);
                        if (val == null) {
                            System.out.println("未查到缓存：" + SysCode.DICT_CACHE_PREFIX + lxjp + ":" + code);
                        } else {
                            field.set(o, (String) val);
                        }
                    }
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 解码数据列表
     *
     * @param list
     */
    public void decode(List list) {
        if (list != null && list.size() > 0) {
            List<Field> anaotationFields = new ArrayList<Field>();
            Class clazz = list.get(0).getClass();
            //获取所有带注解的属性
            Field[] fields = clazz.getDeclaredFields();
            for (Field f : fields) {
                f.setAccessible(true);
                if (f.getAnnotation(DictCode.class) != null) {
                    anaotationFields.add(f);
                }
            }
            //处理数据
            for (Object o : list) {
                decodeObject(o, anaotationFields);
            }
        }
    }

}

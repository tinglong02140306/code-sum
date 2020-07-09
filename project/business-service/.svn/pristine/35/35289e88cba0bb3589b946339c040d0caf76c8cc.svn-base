package com.iflytek.sgy.wjewt.persistence;

import com.iflytek.sgy.social.orm.tools.SqlMaker;
import com.iflytek.sgy.wjewt.base.BaseDao;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceDictionary;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Repository
public class ServiceDictionaryDao extends BaseDao<ServiceDictionary> {


    /**
     * 根据类型获取对应的字典项列表数据
     *
     * @param type 字典类型
     * @return
     */
    public List<ServiceDictionary> getDictionary(String type) {
        SqlMaker sqlMaker = SqlMaker.getInstance("from ServiceDictionary where 1=1 ");
        sqlMaker.eq("type", type);
        sqlMaker.eq("enable", SysCode.DICT_ENABLE.ENABLED);
        sqlMaker.getSql().append(" order by orderNum asc");
        return find(sqlMaker.getSqlString(), sqlMaker.getValues());
    }

    /**
     * 根据字典类型和字典值获取字典,如果没有查询到字典项，则构造一个与code参数相同的字典值返回，避免出现业务逻辑异常
     *
     * @param code 字典值
     * @param type 字典类型
     * @return
     */
    public ServiceDictionary getDictionary(String code, String type) {
        SqlMaker sqlMaker = SqlMaker.getInstance("from ServiceDictionary where 1=1 ");
        sqlMaker.eq("type", type);
        sqlMaker.eq("code", code);
        sqlMaker.eq("enable", SysCode.DICT_ENABLE.ENABLED);
        sqlMaker.getSql().append(" order by orderNum asc");
        List<ServiceDictionary> list = find(sqlMaker.getSqlString(), sqlMaker.getValues());
        if (!CollectionUtils.isEmpty(list)) {
            return list.get(0);
        } else {
            return new ServiceDictionary(code, code, type, 0l, SysCode.DICT_ENABLE.DISABLED);
        }
    }

}

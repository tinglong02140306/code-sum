package com.iflytek.sgy.wjewt.service.impl;

import com.iflytek.sgy.wjewt.domain.entity.ServiceDictionary;
import com.iflytek.sgy.wjewt.persistence.ServiceDictionaryDao;
import com.iflytek.sgy.wjewt.service.IServiceDictionanry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Service
public class ServiceDictionanryImpl implements IServiceDictionanry {

    @Autowired
    private ServiceDictionaryDao serviceDictionaryDao;

    /**
     * 根据类型获取对应的字典项列表数据
     *
     * @param type 字典类型
     * @return
     */
    @Override
    public List<ServiceDictionary> getDictionary(String type) {
        return serviceDictionaryDao.getDictionary(type);
    }

    /**
     * 根据字典类型和字典值获取字典,如果没有查询到字典项，则构造一个与code参数相同的字典值返回，避免出现业务逻辑异常
     *
     * @param code 字典值
     * @param type 字典类型
     * @return
     */
    @Override
    public ServiceDictionary getDictionary(String code, String type) {
        return serviceDictionaryDao.getDictionary(code,type);
    }
}

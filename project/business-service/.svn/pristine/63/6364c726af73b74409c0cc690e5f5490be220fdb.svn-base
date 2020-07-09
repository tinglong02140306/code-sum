package com.iflytek.sgy.wjewt.service;

import com.iflytek.sgy.wjewt.domain.entity.ServiceDictionary;

import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
public interface IServiceDictionanry {

    /**
     * 根据类型获取对应的字典项列表数据
     *
     * @param type 字典类型
     * @return
     */
    public List<ServiceDictionary> getDictionary(String type);

    /**
     * 根据字典类型和字典值获取字典,如果没有查询到字典项，则构造一个与code参数相同的字典值返回，避免出现业务逻辑异常
     *
     * @param code 字典值
     * @param type 字典类型
     * @return
     */
    public ServiceDictionary getDictionary(String code, String type);

}

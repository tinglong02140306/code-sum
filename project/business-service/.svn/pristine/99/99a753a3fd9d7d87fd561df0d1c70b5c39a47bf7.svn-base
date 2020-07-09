package com.iflytek.sgy.wjewt.controller;

import com.iflytek.sgy.wjewt.base.ResultMsg;
import com.iflytek.sgy.wjewt.domain.entity.ServiceDictionary;
import com.iflytek.sgy.wjewt.service.IServiceDictionanry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 系统字典业务Controller
 * Created by Administrator on 2018/1/10.
 */
@Controller
public class ServiceDictionaryController {

    @Autowired
    private IServiceDictionanry iServiceDictionanry;


    /**
     * 根据字典类型获取字典项
     *
     * @param type
     * @return
     */
    @RequestMapping(value = "/dict/type")
    @ResponseBody
    public ResultMsg getDict(String type) {
        List<ServiceDictionary> list = iServiceDictionanry.getDictionary(type);
        return ResultMsg.success(list);
    }

    /**
     * 根据字典编码和字典类型获取字典
     *
     * @param code 字典编码
     * @param type 字典类型
     * @return
     */
    @RequestMapping("/dict/get")
    @ResponseBody
    public ResultMsg getDict(String code, String type) {
        ServiceDictionary serviceDictionary = iServiceDictionanry.getDictionary(code, type);
        return ResultMsg.success(serviceDictionary);
    }

}

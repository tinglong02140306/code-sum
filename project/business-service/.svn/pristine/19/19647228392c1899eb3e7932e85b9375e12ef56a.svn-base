package com.iflytek.sgy.wjewt.controller;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import com.iflytek.sgy.wjewt.domain.dto.RecordDateCount;
import com.iflytek.sgy.wjewt.domain.entity.ServiceVoiceRecord;
import com.iflytek.sgy.wjewt.service.IVoiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class VoiceRecordController {

    @Autowired
    IVoiceRecordService voiceRecordService;

    /**
     * 分页查询呼叫记录
     * @param page
     * @param state
     * @param plateNum
     * @param beginTime
     * @param endTime
     * @return
     */
    @RequestMapping(value = "/voiceRecord/page")
    @ResponseBody
    public ResultMsg pageRecord(Page<ServiceVoiceRecord> page,String state,String plateNum,String beginTime,String endTime){
        Page<ServiceVoiceRecord> recordPage = voiceRecordService.findVoiceRecordPage(page, plateNum,state,  beginTime, endTime);
        return ResultMsg.success(recordPage);
    }

    /**
     * 获取呼叫统计信息
     * @return
     */
    @RequestMapping(value = "/voiceRecord/static")
    @ResponseBody
    public ResultMsg statics(){
        Long total = voiceRecordService.findAllCount();
        Long month = voiceRecordService.findMonthCount();
        List<RecordDateCount> list = voiceRecordService.findWeekCount();
        Map<String,Object> map = new HashMap<>();
        map.put("total",total);
        map.put("month",month);
        map.put("dataCount",list);
        return ResultMsg.success(map);
    }
}

package com.iflytek.sgy.wjewt.service;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.domain.dto.RecordDateCount;
import com.iflytek.sgy.wjewt.domain.entity.ServiceVoiceRecord;

import java.util.List;

/**
 * 语音呼叫数据接口服务
 */
public interface IVoiceRecordService {


    /**
     * 根据查询条件分页查询呼叫记录
     * @param platNum
     *      车牌号
     * @param stat
     *      状态 1：呼入，2：呼出
     * @param beginTime
     *       呼叫时间 最小时间
     * @param endTime
     *       呼叫时间 最大时间
     * @return
     */
    public Page<ServiceVoiceRecord> findVoiceRecordPage(Page<ServiceVoiceRecord> page,String platNum, String stat, String beginTime, String endTime);


    /**
     * 获取呼叫总量
     * @return
     */
    public Long findAllCount();


    /**
     * 获取当月呼叫总量
     * @return
     */
    public Long findMonthCount();


    /**
     * 获取最近一周（不包括今天）的每天呼叫量
     * @return
     */
    public List<RecordDateCount> findWeekCount();

}

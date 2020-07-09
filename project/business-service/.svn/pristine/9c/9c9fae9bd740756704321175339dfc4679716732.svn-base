package com.iflytek.sgy.wjewt.service;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.domain.dto.RecordDateCount;
import com.iflytek.sgy.wjewt.domain.entity.ServiceVoiceRecord;
import com.iflytek.sgy.wjewt.persistence.ServiceVoiceRecordDao;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VoiceRecordServiceImpl implements IVoiceRecordService {

    @Autowired
    ServiceVoiceRecordDao serviceVoiceRecordDao;

    /**
     * 根据查询条件分页查询呼叫记录
     *
     * @param platNum   车牌号
     * @param stat      状态 1：呼入，2：呼出
     * @param beginTime 呼叫时间 最小时间
     * @param endTime   呼叫时间 最大时间
     * @return
     */
    @Override
    public Page<ServiceVoiceRecord> findVoiceRecordPage(Page<ServiceVoiceRecord> page,String platNum, String stat, String beginTime, String endTime) {
        if (StringUtils.equalsIgnoreCase(stat,"1")){
            page.setTotal(0);
            page.setRows(new ArrayList<ServiceVoiceRecord>());
            return page;
        }else {
            return serviceVoiceRecordDao.findRecordPage(page,platNum,beginTime,endTime);
        }

    }

    /**
     * 获取呼叫总量
     *
     * @return
     */
    @Override
    public Long findAllCount() {
        return serviceVoiceRecordDao.findAllCount();
    }

    /**
     * 获取当月呼叫总量
     *
     * @return
     */
    @Override
    public Long findMonthCount() {
        return serviceVoiceRecordDao.findMonthCount();
    }

    /**
     * 获取最近一周（不包括今天）的每天呼叫量
     *
     * @return
     */
    @Override
    public List<RecordDateCount> findWeekCount() {
        return serviceVoiceRecordDao.findDateCount();
    }
}

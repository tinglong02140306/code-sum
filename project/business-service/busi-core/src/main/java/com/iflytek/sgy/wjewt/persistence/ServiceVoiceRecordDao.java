package com.iflytek.sgy.wjewt.persistence;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.social.orm.tools.SqlMaker;
import com.iflytek.sgy.wjewt.base.BaseDao;
import com.iflytek.sgy.wjewt.domain.dto.RecordDateCount;
import com.iflytek.sgy.wjewt.domain.entity.ServiceVoiceRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class ServiceVoiceRecordDao extends BaseDao<ServiceVoiceRecord> {

    @Autowired
    JdbcTemplate jdbcTemplate;

    /**
     * 根据查询条件查询呼叫记录
     * @param plateNum
     *      车牌号
     * @param beginTime
     *      查询开始时间
     * @param endTime
     *      查询结束时间
     * @return
     */
    public Page<ServiceVoiceRecord> findRecordPage(Page<ServiceVoiceRecord> page,String plateNum,String beginTime,String endTime){

        SqlMaker sqlMaker = SqlMaker.getInstance("from ServiceVoiceRecord WHERE 1=1 ");
        sqlMaker.like("plateNum","plateNum",plateNum);
        sqlMaker.ge("to_char(createTime,'yyyy-MM-dd HH24:MI:SS')","beginTime",beginTime);
        sqlMaker.le("to_char(createTime,'yyyy-MM-dd HH24:MI:SS')","endTime",endTime);
        return findPage(page,sqlMaker.getSqlString(),sqlMaker.getValues());
    }


    /**
     * 获取总呼叫量
     * @return
     */
    public Long findAllCount(){
       Object result = createSqlQuery("select count(1) countNum from SERVICE_VOICE_RECORD").uniqueResult();
       if (result != null){
           return ((BigDecimal)result).longValue();
       }else {
           return 0l;
       }
    }

    /**
     * 获取当月呼出
     * @return
     */
    public Long findMonthCount(){
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH,1);
        String time =new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
        Object result = createSqlQuery("select count(1) countNum from SERVICE_VOICE_RECORD where to_char(createTime,'yyyyMMdd') >= ?").setParameter(0,time).uniqueResult() ;
        if (result != null){
            return ((BigDecimal)result).longValue();
        }else {
            return 0l;
        }
    }

    /**
     * 获取近一周每天统计量
     * @return
     */
    public List<RecordDateCount> findDateCount(){
        //获取日历实体
        Calendar calendar = Calendar.getInstance();
        //时间设置为0点0分0秒
        calendar.set(Calendar.HOUR_OF_DAY,0);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);
        //今天凌晨时间
        String today = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format( calendar.getTime());

        //7天前凌晨时间
        calendar.add(Calendar.DATE,-7);
        String startDay = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format( calendar.getTime());

        String sql = "select  countDate,count(countDate) countNum from(  " +
                "select to_char(CREATETIME,'yyyyMMdd') countDate from  SERVICE_VOICE_RECORD t where t.CREATETIME > to_date(?,'yyyy-MM-dd hh24:mi:ss') and t.CREATETIME < to_date(?,'yyyy-MM-dd hh24:mi:ss') )group by  countDate order by countDate asc";
        List<RecordDateCount> list = jdbcTemplate.query(sql,new String[]{startDay,today},new BeanPropertyRowMapper<RecordDateCount>(RecordDateCount.class));

        Map<String,RecordDateCount> count = buidCountMap(calendar);

        for (RecordDateCount recordDateCount:list){
            String d = recordDateCount.getCountDate();
            if (count.containsKey(d)){
                count.put(d,recordDateCount);
            }
        }
        List<RecordDateCount> resultList = new ArrayList<>(count.values());
        Collections.sort(resultList);
        //处理日期
        for (RecordDateCount recordDateCount:resultList){
            recordDateCount.resetDateFormat();
        }
        return resultList;
    }

    /**
     * 根据开始时间，构造7天的默认结果
     * @param calendar
     *      开始时间日历
     * @return
     */
    public Map<String,RecordDateCount> buidCountMap(Calendar calendar){
        SimpleDateFormat simpleDateFormat =new SimpleDateFormat("yyyyMMdd");
        Map<String,RecordDateCount> count = new HashMap<>();
        String d = simpleDateFormat.format(calendar.getTime());
        count.put(d,new RecordDateCount(d));
        for (int i = 0;i < 6;i++){
            calendar.add(Calendar.DATE,1);
            d = simpleDateFormat.format(calendar.getTime());
            count.put(d,new RecordDateCount(d));
        }
        return count;
    }
}

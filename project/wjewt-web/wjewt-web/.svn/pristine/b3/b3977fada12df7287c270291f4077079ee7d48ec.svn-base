package com.iflytek.sgy.wjewt.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * 请求记录日志
 */
@Service
public class RequestRecordService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    Logger logger = LoggerFactory.getLogger(this.getClass());


    /**
     * 记录请求
     * @param request
     */
    public void  record(HttpServletRequest request){
        try {
            logger.info("记录请求日志 [{}]",request.getRequestURI());
            String uid = UUID.randomUUID().toString().replace("-","");
            String url = request.getRequestURI();
            String createTime =  new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date());
            String sql = "insert into t_wjewt_request_record (ID, REQUEST, CREATETIME)values ('"+uid+"','"+url+"', '"+createTime+"')";
            jdbcTemplate.execute(sql);
        }catch (Exception e){
            logger.error("请求日志保存失败！");
        }
    }
}

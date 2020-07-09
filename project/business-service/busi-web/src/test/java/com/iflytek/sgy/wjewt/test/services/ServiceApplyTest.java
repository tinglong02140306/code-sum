package com.iflytek.sgy.wjewt.test.services;

import com.iflytek.sgy.wjewt.test.RandomValue;
import com.iflytek.sgy.wjewt.test.base.BaseTest;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

/**
 * Created by Administrator on 2018/2/1.
 */
public class ServiceApplyTest extends BaseTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void baseTest(){
        Assert.assertTrue(true);
    }

    public void testInsert() {
        for (int i = 0; i < 6685; i++) {
            testBatch();
        }
    }


    public void testBatch() {
        jdbcTemplate.batchUpdate("insert into veh_temp (hpzl, hphm, sjhm, cjhhsw) values ( ? ,? ,?, ?)", new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
                Map<String, String> map = RandomValue.getAddress();
                preparedStatement.setString(1, "02");
                preparedStatement.setString(2, map.get("hphm"));
                preparedStatement.setString(3, map.get("tel"));
                preparedStatement.setString(4, map.get("cjhhsw"));
            }

            @Override
            public int getBatchSize() {
                return 1000;
            }
        });
    }


}

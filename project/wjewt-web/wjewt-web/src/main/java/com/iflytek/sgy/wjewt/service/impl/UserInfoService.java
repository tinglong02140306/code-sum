package com.iflytek.sgy.wjewt.service.impl;

import com.iflytek.sgy.social.user.api.dto.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Administrator on 2018/4/2.
 */
@Service("userInfoService")
public class UserInfoService {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    /**
     * 根据ID获取用户信息
     *
     * @param id 用户ID
     * @return
     */
    public User getUserInfo(String id) {
        if (StringUtils.isNotBlank(id)) {
            String sql = "SELECT ID,NAME,NICKNAME,CARD_NUM SFZH,PICTURE AS PHOTOURL,PHONE,SEX from SSO_USER  WHERE ID=?";
            try {
                final User user = jdbcTemplate.queryForObject(sql, new String[]{id}, new RowMapper<User>() {
                    @Override
                    public User mapRow(ResultSet resultSet, int i) throws SQLException {
                        User user1 = new User();
                        user1.setId(resultSet.getString("ID"));
                        user1.setName(resultSet.getString("NAME"));
                        user1.setNickName(resultSet.getString("NICKNAME"));
                        user1.setSfzh(resultSet.getString("SFZH"));
                        user1.setPhotoUrl(resultSet.getString("PHOTOURL"));
                        user1.setSex(resultSet.getString("SEX"));
                        return user1;
                    }
                });
                return user;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } else {
            return null;
        }
    }

}

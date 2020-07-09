package com.iflytek.sgy.wjewt.domain.dto;

/**
 * 车主相关信息
 * Created by Administrator on 2018/1/12.
 */
public class DriverInfo {

    /**
     * 车主姓名
     */
    private String name;

    /**
     * 车主手机号
     */
    private String mobile;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public DriverInfo() {
    }

    public DriverInfo(String name, String mobile) {
        this.name = name;
        this.mobile = mobile;
    }
}

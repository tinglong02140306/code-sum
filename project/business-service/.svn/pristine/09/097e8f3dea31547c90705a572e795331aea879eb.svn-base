package com.iflytek.sgy.wjewt.domain.entity;

import org.hibernate.annotations.AccessType;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@javax.persistence.Entity
@javax.persistence.Table(name = "SERVICE_DICTIONARY")
@AccessType("field")
@GenericGenerator(name = "system_uuid", strategy = "uuid")
public class ServiceDictionary {
    public ServiceDictionary() {

    }

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(generator = "system_uuid")
    private String id;
    /**
     * 字典编码
     */
    @Column(name = "CODE", length = 20)
    private String code;
    /**
     * 字典名称
     */
    @Column(name = "NAME", length = 50)
    private String name;
    /**
     * 字典类型
     */
    @Column(name = "TYPE", length = 20)
    private String type;
    /**
     * 字典排序
     */
    @Column(name = "ORDER_NUM", length = 22)
    private Long orderNum;
    /**
     * 有效性,0：无效，1：有效
     */
    @Column(name = "ENABLE", length = 1)
    private String enable;

    /**
     * 主键ID
     */
    public String getId() {
        return this.id;
    }

    /**
     * 主键ID
     *
     * @param id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * 字典编码
     */
    public String getCode() {
        return this.code;
    }

    /**
     * 字典编码
     *
     * @param code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 字典名称
     */
    public String getName() {
        return this.name;
    }

    /**
     * 字典名称
     *
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 字典类型
     */
    public String getType() {
        return this.type;
    }

    /**
     * 字典类型
     *
     * @param type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 字典排序
     */
    public Long getOrderNum() {
        return this.orderNum;
    }

    /**
     * 字典排序
     *
     * @param orderNum
     */
    public void setOrderNum(Long orderNum) {
        this.orderNum = orderNum;
    }

    /**
     * 有效性,0：无效，1：有效
     */
    public String getEnable() {
        return this.enable;
    }

    /**
     * 有效性,0：无效，1：有效
     *
     * @param enable
     */
    public void setEnable(String enable) {
        this.enable = enable;
    }



    public ServiceDictionary(String code, String name, String type, Long orderNum, String enable) {
        this.code = code;
        this.name = name;
        this.type = type;
        this.orderNum = orderNum;
        this.enable = enable;
    }
}
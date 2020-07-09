package com.iflytek.sgy.wjewt.domain.entity;

import org.hibernate.annotations.AccessType;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * 语音呼叫记录
 */
@javax.persistence.Entity
@javax.persistence.Table(name = "SERVICE_VOICE_RECORD")
@AccessType("field")
public class ServiceVoiceRecord implements Serializable {
    private static final long serialVersionUID = -7001068949741821970L;

    @Id
    private String id;

    @Column(name = "PLATENUM")
    private String plateNum;

    @Column(name = "CREATETIME")
    private String createTime;

    @Column(name = "APPLYER")
    private String applyer;

    @Column(name = "APPLYTIME")
    private String applyTime;

    @Column(name = "EVENTTYPE")
    private String eventType;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlateNum() {
        return plateNum;
    }

    public void setPlateNum(String plateNum) {
        this.plateNum = plateNum;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getApplyer() {
        return applyer;
    }

    public void setApplyer(String applyer) {
        this.applyer = applyer;
    }

    public String getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(String applyTime) {
        this.applyTime = applyTime;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
}

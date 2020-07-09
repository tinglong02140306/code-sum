package com.iflytek.sgy.wjewt.domain.entity;

import com.iflytek.sgy.wjewt.redis.DictCode;
import org.hibernate.annotations.AccessType;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@javax.persistence.Entity
@javax.persistence.Table(name = "SERVICE_YJNC_TASKS")
@AccessType("field")
@GenericGenerator(name = "system_uuid", strategy = "uuid")
public class ServiceYjncTasks implements Serializable{
    private static final long serialVersionUID = -255424423611629038L;

    public ServiceYjncTasks() {

    }

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(generator = "system_uuid")
    private String id;
    /**
     * 申请ID,关联申请表主键ID
     */
    @Column(name = "APPLY_ID", length = 50)
    private String applyId;
    /**
     * 事件名称
     */
    @Column(name = "EVENT_NAME", length = 50)
    private String eventName;
    /**
     * 事件类型，字典@EVENT_TYPE：1：发短信，2：打电话
     */
    @Column(name = "EVENT_TYPE", length = 20)
    private String eventType;
    /**
     * 操作对象，手机号或者微信号或者QQ或者邮箱等
     */
    @Column(name = "TARGET_OBJECT", length = 100)
    private String targetObject;
    /**
     * 事件发生时间,日期类型
     */
    @Column(name = "EVENT_TIME", length = 7)
    @Temporal(TemporalType.TIMESTAMP)
    private Date eventTime;
    /**
     * 事件结果状态  状态字典@EVENT_STATUS：1：失败，2：成功
     */
    @Column(name = "EVENT_STATUS", length = 1)
    private String eventStatus;


    @Transient
    @DictCode(lxjp ="EVENT_STATUS",field = "eventStatus")
    private String eventStatusMc;

    /**
     * 事件操作内容
     */
    @Column(name = "EVENT_CONTENT", length = 500)
    private String eventContent;

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
     * 申请ID,关联申请表主键ID
     */
    public String getApplyId() {
        return this.applyId;
    }

    /**
     * 申请ID,关联申请表主键ID
     *
     * @param applyId
     */
    public void setApplyId(String applyId) {
        this.applyId = applyId;
    }

    /**
     * 事件名称
     */
    public String getEventName() {
        return this.eventName;
    }

    /**
     * 事件名称
     *
     * @param eventName
     */
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    /**
     * 事件类型，字典@EVENT_TYPE：1：发短信，2：打电话
     */
    public String getEventType() {
        return eventType;
    }

    /**
     * 事件类型，字典@EVENT_TYPE：1：发短信，2：打电话
     *
     * @param eventType
     */
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    /**
     * 操作对象，手机号或者微信号或者QQ或者邮箱等
     */
    public String getTargetObject() {
        return this.targetObject;
    }

    /**
     * 操作对象，手机号或者微信号或者QQ或者邮箱等
     *
     * @param targetObject
     */
    public void setTargetObject(String targetObject) {
        this.targetObject = targetObject;
    }

    /**
     * 事件发生时间,日期类型
     */
    public Date getEventTime() {
        return this.eventTime;
    }

    /**
     * 事件发生时间,日期类型
     *
     * @param eventTime
     */
    public void setEventTime(Date eventTime) {
        this.eventTime = eventTime;
    }

    /**
     * 事件结果状态  状态字典@EVENT_STATUS：1：失败，2：成功
     */
    public String getEventStatus() {
        return this.eventStatus;
    }

    /**
     * 事件结果状态  状态字典@EVENT_STATUS：1：失败，2：成功
     *
     * @param eventStatus
     */
    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }

    /**
     * 事件操作内容
     */
    public String getEventContent() {
        return this.eventContent;
    }

    /**
     * 事件操作内容
     *
     * @param eventContent
     */
    public void setEventContent(String eventContent) {
        this.eventContent = eventContent;
    }

    public String getEventStatusMc() {
        return eventStatusMc;
    }

    public void setEventStatusMc(String eventStatusMc) {
        this.eventStatusMc = eventStatusMc;
    }
}
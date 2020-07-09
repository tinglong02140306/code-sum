package com.iflytek.sgy.wjewt.domain.entity;

import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.redis.DictCode;
import org.apache.commons.lang.StringUtils;
import org.hibernate.annotations.AccessType;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.text.MessageFormat;
import java.util.Date;

@javax.persistence.Entity
@javax.persistence.Table(name = "SERVICE_YJNC_APPLY")
@AccessType("field")
@GenericGenerator(name = "system_uuid", strategy = "uuid")
public class ServiceYjncApply implements Serializable{
    private static final long serialVersionUID = 2432733092291911709L;

    public ServiceYjncApply() {

    }

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(generator = "system_uuid")
    private String id;
    /**
     * 申请者用户ID
     */
    @Column(name = "APPLYER_USER_ID", length = 50)
    private String applyerUserId;
    /**
     * 申请提交者姓名
     */
    @Column(name = "APPLYER_NAME", length = 50)
    private String applyerName;
    /**
     * 申请者手机号
     */
    @Column(name = "APPLYER_MOBILE", length = 20)
    private String applyerMobile;
    /**
     * 移车车牌类型字典@PLATE_TYPE，02：蓝色车牌（小型汽车），01：黄色车牌（大型汽车），99：其他车牌
     */
    @Column(name = "CAR_PLATE_TYPE", length = 2)
    private String carPlateType;

    /**
     * 车牌类型字典名称
     */
    @Transient
    @DictCode(lxjp = "PLATE_TYPE",field = "carPlateType")
    private String carPlateTypeText;


    /**
     * 移车车牌号,默认只支持安徽省 皖 开头的车牌
     */
    @Column(name = "CAR_PLATE_NUM", length = 10)
    private String carPlateNum;
    /**
     * 车主手机号
     */
    @Column(name = "DRIVER_MOBILE", length = 20)
    private String driverMobile;
    /**
     * 车主姓名
     */
    @Column(name = "DRIVER_NAME", length = 50)
    private String driverName;
    /**
     * 定位地址文本
     */
    @Column(name = "ADDRESS", length = 200)
    private String address;
    /**
     * 定位坐标X
     */
    @Column(name = "POINT_X", length = 50)
    private String pointX;
    /**
     * 定位坐标Y
     */
    @Column(name = "POINT_Y", length = 50)
    private String pointY;
    /**
     * 挪车原因编码字典@REASON_TYPE，1：您爱车挡道，请挪车，2：您车门窗灯未关，3：您违规停车，请挪车，4：急需挪车，请速来
     */
    @Column(name = "REASON_TYPE", length = 1)
    private String reasonType;

    @Transient
    @DictCode(lxjp = "REASON_TYPE",field = "reasonType")
    private String reasonText;
    /**
     * 申请提交时间,日期类型
     */
    @Column(name = "APPLY_TIME", length = 7)
    @Temporal(TemporalType.TIMESTAMP)
    private Date applyTime;


    /**
     * 查询条件，申请时间开始
     */
    @Transient
    private String applyTimeBegin;

    /**
     * 查询条件，申请时间结束
     */
    @Transient
    private String applyTimeEnd;

    /**
     * 最后更新人登录名
     */
    @Column(name = "LAST_UPDATE_USER", length = 30)
    private String lastUpdateUser;
    /**
     * 最后更新时间,日期类型
     */
    @Column(name = "LAST_UPDATE_TIME", length = 7)
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdateTime;

    /**
     * 挪车耗时
     */
    @Transient
    private String spendTime;

    /**
     * 现场照片信息，最多三张，存储Fastdfs文件路径，逗号，隔开
     */
    @Column(name = "PICTURES", length = 300)
    private String pictures;
    /**
     * 车主挪车态度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     */
    @Column(name = "DRIVER_ATTITUDE_RANK", length = 1)
    private String driverAttitudeRank;

    @Transient
    @DictCode(lxjp = "EVALUATE_LEVEL",field = "driverAttitudeRank")
    private String driverAttitudeRankText;

    /**
     * 车主挪车速度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     */
    @Column(name = "DRIVER_SPEED_RANK", length = 1)
    private String driverSpeedRank;

    /**
     *
     */
    @Transient
    @DictCode(lxjp = "EVALUATE_LEVEL",field = "driverSpeedRank")
    private String driverSpeedRankText;

    /**
     * 评价内容
     */
    @Column(name = "EVALUATE_CONTENT", length = 1000)
    private String evaluateContent;
    /**
     * 移车状态字典@MOVE_STATUS：1：待挪车，2：挪车成功，3：挪车失败 4：待评价
     */
    @Column(name = "STATUS", length = 1)
    private String status;

    @Transient
    @DictCode(lxjp = "MOVE_STATUS",field = "status")
    private String statusMc;

    /**
     * 申请来源平台字典@APPLY_SOURCE，1：一网通APP,2：微信
     */
    @Column(name = "APLLY_PLATEFORM", length = 1)
    private String apllyPlateform;
    /**
     * 删除状态,0：未删除，1：已删除，逻辑删除字段
     */
    @Column(name = "DELETE_STATE", length = 1)
    private String deleteState;


    /**
     * 是否为催一催
     */
    @Transient
    private boolean isPressed = false;

    /**
     * 是否短信通知,字典 @YES_NO 0：否，1：是
     */
    @Column(name = "SMS_OR_NOT", length = 1)
    private String smsOrNot;

    /**
     * 是否电话通知,字典 @YES_NO 0：否，1：是
     */
    @Column(name = "TEL_OR_NOT", length = 1)
    private String telOrNot;

    /**
     * 是否已催办,字典 @YES_NO 0：否，1：是
     */
    @Column(name = "PRESSED_OR_NOT", length = 1)
    private String pressedOrNot;




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
     * 申请者用户ID
     */
    public String getApplyerUserId() {
        return this.applyerUserId;
    }

    /**
     * 申请者用户ID
     *
     * @param applyerUserId
     */
    public void setApplyerUserId(String applyerUserId) {
        this.applyerUserId = applyerUserId;
    }

    /**
     * 申请提交者姓名
     */
    public String getApplyerName() {
        return this.applyerName;
    }

    /**
     * 申请提交者姓名
     *
     * @param applyerName
     */
    public void setApplyerName(String applyerName) {
        this.applyerName = applyerName;
    }

    /**
     * 申请者手机号
     */
    public String getApplyerMobile() {
        return this.applyerMobile;
    }

    /**
     * 申请者手机号
     *
     * @param applyerMobile
     */
    public void setApplyerMobile(String applyerMobile) {
        this.applyerMobile = applyerMobile;
    }

    /**
     * 移车车牌类型字典@PLATE_TYPE，1：蓝色车牌（小型汽车），2：黄色车牌（大型汽车），9：其他车牌
     */
    public String getCarPlateType() {
        return this.carPlateType;
    }

    /**
     * 移车车牌类型字典@PLATE_TYPE，02：蓝色车牌（小型汽车），01：黄色车牌（大型汽车），99：其他车牌
     *
     * @param carPlateType
     */
    public void setCarPlateType(String carPlateType) {
        this.carPlateType = carPlateType;
    }

    public String getCarPlateTypeText() {
        return carPlateTypeText;
    }

    public void setCarPlateTypeText(String carPlateTypeText) {
        this.carPlateTypeText = carPlateTypeText;
    }

    /**
     * 移车车牌号,默认只支持安徽省 皖 开头的车牌
     */
    public String getCarPlateNum() {
        return this.carPlateNum;
    }

    /**
     * 移车车牌号,默认只支持安徽省 皖 开头的车牌
     *
     * @param carPlateNum
     */
    public void setCarPlateNum(String carPlateNum) {
        this.carPlateNum = carPlateNum;
    }

    /**
     * 车主手机号
     */
    public String getDriverMobile() {
        return this.driverMobile;
    }

    /**
     * 车主手机号
     *
     * @param driverMobile
     */
    public void setDriverMobile(String driverMobile) {
        this.driverMobile = driverMobile;
    }

    /**
     * 车主姓名
     */
    public String getDriverName() {
        return this.driverName;
    }

    /**
     * 车主姓名
     *
     * @param driverName
     */
    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    /**
     * 定位地址文本
     */
    public String getAddress() {
        if(StringUtils.endsWith(this.address,"附近")){
            return this.address;
        }else {
            return this.address.concat("附近");
        }

    }

    /**
     * 定位地址文本
     *
     * @param address
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * 定位坐标X
     */
    public String getPointX() {
        return this.pointX;
    }

    /**
     * 定位坐标X
     *
     * @param pointX
     */
    public void setPointX(String pointX) {
        this.pointX = pointX;
    }

    /**
     * 定位坐标Y
     */
    public String getPointY() {
        return this.pointY;
    }

    /**
     * 定位坐标Y
     *
     * @param pointY
     */
    public void setPointY(String pointY) {
        this.pointY = pointY;
    }

    /**
     * 挪车原因编码字典@REASON_TYPE，1：您爱车挡道，请挪车，2：您车门窗灯未关，3：您违规停车，请挪车，4：急需挪车，请速来
     */
    public String getReasonType() {
        return this.reasonType;
    }

    /**
     * 挪车原因编码字典@REASON_TYPE，1：您爱车挡道，请挪车，2：您车门窗灯未关，3：您违规停车，请挪车，4：急需挪车，请速来
     *
     * @param reasonType
     */
    public void setReasonType(String reasonType) {
        this.reasonType = reasonType;
    }

    public String getReasonText() {
        return reasonText;
    }

    public void setReasonText(String reasonText) {
        this.reasonText = reasonText;
    }

    /**
     * 申请提交时间,日期类型
     */
    public Date getApplyTime() {
        return this.applyTime;
    }

    /**
     * 申请提交时间,日期类型
     *
     * @param applyTime
     */
    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }

    public String getSpendTime() {
        return spendTime;
    }

    public void setSpendTime(String spendTime) {
        this.spendTime = spendTime;
    }

    /**
     * 最后更新人登录名
     */
    public String getLastUpdateUser() {
        return this.lastUpdateUser;
    }

    /**
     * 最后更新人登录名
     *
     * @param lastUpdateUser
     */
    public void setLastUpdateUser(String lastUpdateUser) {
        this.lastUpdateUser = lastUpdateUser;
    }

    /**
     * 最后更新时间,日期类型
     */
    public Date getLastUpdateTime() {
        return this.lastUpdateTime;
    }

    /**
     * 最后更新时间,日期类型
     *
     * @param lastUpdateTime
     */
    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    /**
     * 现场照片信息，最多三张，存储Fastdfs文件路径，逗号，隔开
     */
    public String getPictures() {
        return this.pictures;
    }

    /**
     * 现场照片信息，最多三张，存储Fastdfs文件路径，逗号，隔开
     *
     * @param pictures
     */
    public void setPictures(String pictures) {
        this.pictures = pictures;
    }

    /**
     * 车主挪车态度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     */
    public String getDriverAttitudeRank() {
        return this.driverAttitudeRank;
    }

    /**
     * 车主挪车态度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     *
     * @param driverAttitudeRank
     */
    public void setDriverAttitudeRank(String driverAttitudeRank) {
        this.driverAttitudeRank = driverAttitudeRank;
    }

    /**
     * 车主挪车速度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     */
    public String getDriverSpeedRank() {
        return this.driverSpeedRank;
    }

    /**
     * 车主挪车速度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评
     *
     * @param driverSpeedRank
     */
    public void setDriverSpeedRank(String driverSpeedRank) {
        this.driverSpeedRank = driverSpeedRank;
    }

    public String getDriverAttitudeRankText() {
        return driverAttitudeRankText;
    }

    public void setDriverAttitudeRankText(String driverAttitudeRankText) {
        this.driverAttitudeRankText = driverAttitudeRankText;
    }

    public String getDriverSpeedRankText() {
        return driverSpeedRankText;
    }

    public void setDriverSpeedRankText(String driverSpeedRankText) {
        this.driverSpeedRankText = driverSpeedRankText;
    }

    /**
     * 评价内容
     */
    public String getEvaluateContent() {
        return this.evaluateContent;
    }

    /**
     * 评价内容
     *
     * @param evaluateContent
     */
    public void setEvaluateContent(String evaluateContent) {
        this.evaluateContent = evaluateContent;
    }

    /**
     * 移车状态字典@MOVE_STATUS：1：待挪车，2：挪车成功，3：挪车失败，4：取消挪车
     */
    public String getStatus() {
        return this.status;
    }

    /**
     * 移车状态字典@MOVE_STATUS：1：待挪车，2：挪车成功，3：挪车失败，4：待评价
     *
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusMc() {
        return statusMc;
    }

    public void setStatusMc(String statusMc) {
        this.statusMc = statusMc;
    }

    /**
     * 申请来源平台字典@APPLY_SOURCE，1：一网通APP,2：微信
     */
    public String getApllyPlateform() {
        return this.apllyPlateform;
    }

    /**
     * 申请来源平台字典@APPLY_SOURCE，1：一网通APP,2：微信
     *
     * @param apllyPlateform
     */
    public void setApllyPlateform(String apllyPlateform) {
        this.apllyPlateform = apllyPlateform;
    }

    /**
     * 删除状态,0：未删除，1：已删除，逻辑删除字段
     */
    public String getDeleteState() {
        return this.deleteState;
    }

    /**
     * 删除状态,0：未删除，1：已删除，逻辑删除字段
     *
     * @param deleteState
     */
    public void setDeleteState(String deleteState) {
        this.deleteState = deleteState;
    }

    public String getApplyTimeBegin() {
        return applyTimeBegin;
    }

    public void setApplyTimeBegin(String applyTimeBegin) {
        this.applyTimeBegin = applyTimeBegin;
    }

    public String getApplyTimeEnd() {
        return applyTimeEnd;
    }

    public void setApplyTimeEnd(String applyTimeEnd) {
        this.applyTimeEnd = applyTimeEnd;
    }

    public boolean isPressed() {
        return isPressed;
    }

    public void setPressed(boolean pressed) {
        isPressed = pressed;
    }

    public String getSmsOrNot() {
        return smsOrNot;
    }

    public void setSmsOrNot(String smsOrNot) {
        this.smsOrNot = smsOrNot;
    }

    public String getTelOrNot() {
        return telOrNot;
    }

    public void setTelOrNot(String telOrNot) {
        this.telOrNot = telOrNot;
    }

    public String getPressedOrNot() {
        return pressedOrNot;
    }

    public void setPressedOrNot(String pressedOrNot) {
        this.pressedOrNot = pressedOrNot;
    }

    public void init(){
        if (StringUtils.equalsIgnoreCase(status, SysCode.MOVE_STATUS.FAIL)||StringUtils.equalsIgnoreCase(status, SysCode.MOVE_STATUS.SUCCESS)){
            Long t =  this.lastUpdateTime.getTime() - this.applyTime.getTime();
            this.spendTime = timeString(t);
        }else {
            this.spendTime ="-";
        }
    }

    /**
     * 时间差日期转换
     * @param time
     * @return
     */
    private String timeString(Long time){
        Long minite = Long.valueOf(1000*60);
        Long hour =minite*60;
        Long day = hour*24;

        if (time < minite){
            return time/1000+"秒";
        }else if (time < hour){
            return time/minite+"分";
        }else if (time < day){
            long h = time/hour;
            long m = (time % hour)/minite;
            return MessageFormat.format("{0}小时{1}分",h,m);
        }else {
            return "大于1天";
        }
    }
}
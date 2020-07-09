package com.iflytek.sgy.wjewt.services.yjnc.domain.dto;

import com.alibaba.fastjson.annotation.JSONField;

public class VoiceStatusDTO {

	public String event;

	/**
	 * 号码内部编号
	 */
	@JSONField(name = "tel_uid")
	public long telUid;
	
	/**
	 * 业务系统自定义编号
	 */
	@JSONField(name = "out_uid")
	public String outUid;
	
	/**
	 * 被叫电话号码
	 */
	@JSONField(name = "tel_num")
	public String telNum;
	
	/**
	 * 呼叫状态（1 - 正在呼叫、2 - 呼叫完成）
	 */
	@JSONField(name = "dial_state")
	public int dialState;
	
	/**
	 * 总呼叫次数
	 */
	@JSONField(name = "dial_times")
	public int dialTimes;
	
	/**
	 * 对方是否振铃（0 - 未振铃、1 - 振铃）
	 */
	@JSONField(name = "caller_ring")
	public int callerRing;
	
	/**
	 * 对方是否应答（0 - 未应答、1 - 应答）
	 */
	@JSONField(name = "caller_answer")
	public int callerAnswer;
	
	/**
	 * 开始呼叫时间
	 */
	@JSONField(name = "dial_time")
	public String dialTime;
	
	/**
	 * 号码开始振铃时间
	 */
	@JSONField(name = "time_caller_ring")
	public String timeCallerRing;
	
	/**
	 * 号码振铃秒数
	 */
	@JSONField(name = "sec_caller_ring")
	public long secCallerRing;
	
	@JSONField(name = "time_caller_answer")
	public String timeCallerAnswer;
	
	/**
	 * 号码通话秒数
	 */
	@JSONField(name = "sec_caller_talk")
	public double sec_caller_talk;

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public long getTelUid() {
		return telUid;
	}

	public void setTelUid(long telUid) {
		this.telUid = telUid;
	}

	public String getOutUid() {
		return outUid;
	}

	public void setOutUid(String outUid) {
		this.outUid = outUid;
	}

	public String getTelNum() {
		return telNum;
	}

	public void setTelNum(String telNum) {
		this.telNum = telNum;
	}

	public int getDialState() {
		return dialState;
	}

	public void setDialState(int dialState) {
		this.dialState = dialState;
	}

	public int getDialTimes() {
		return dialTimes;
	}

	public void setDialTimes(int dialTimes) {
		this.dialTimes = dialTimes;
	}

	public int getCallerRing() {
		return callerRing;
	}

	public void setCallerRing(int callerRing) {
		this.callerRing = callerRing;
	}

	public int getCallerAnswer() {
		return callerAnswer;
	}

	public void setCallerAnswer(int callerAnswer) {
		this.callerAnswer = callerAnswer;
	}

	public String getDialTime() {
		return dialTime;
	}

	public void setDialTime(String dialTime) {
		this.dialTime = dialTime;
	}

	public String getTimeCallerRing() {
		return timeCallerRing;
	}

	public void setTimeCallerRing(String timeCallerRing) {
		this.timeCallerRing = timeCallerRing;
	}

	public long getSecCallerRing() {
		return secCallerRing;
	}

	public void setSecCallerRing(long secCallerRing) {
		this.secCallerRing = secCallerRing;
	}

	public String getTimeCallerAnswer() {
		return timeCallerAnswer;
	}

	public void setTimeCallerAnswer(String timeCallerAnswer) {
		this.timeCallerAnswer = timeCallerAnswer;
	}

	public double getSec_caller_talk() {
		return sec_caller_talk;
	}

	public void setSec_caller_talk(double sec_caller_talk) {
		this.sec_caller_talk = sec_caller_talk;
	}
}

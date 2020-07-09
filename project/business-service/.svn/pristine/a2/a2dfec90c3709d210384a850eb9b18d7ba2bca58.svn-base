package com.iflytek.sgy.wjewt.services.base;

import java.io.Serializable;

/**
* 消息推送参数封装
* @author: yanzhang9
* @createTime: 2017年1月17日 下午4:13:15
 */
public class MsgExtends implements Serializable {
	
	private static final long serialVersionUID = 1L;
	//推送类型
	private String pushType;
	//消息类型
	private String msgPushType;
	//离线时间
	private String expires;
	//仅Android用, 通知消息附带的应用自定义内容、或存透传消息（msg_type为1),大小最大为2048B
	private String extra_content;
	//1开发环境 2生产环境（仅IOS推送用）
	private String environment;
	
	/**
	 * @return the pushType
	 */
	public String getPushType() {
		return pushType;
	}
	/**
	 * @param pushType the pushType to set
	 */
	public void setPushType(String pushType) {
		this.pushType = pushType;
	}
	/**
	 * @return the msgPushType
	 */
	public String getMsgPushType() {
		return msgPushType;
	}
	/**
	 * @param msgPushType the msgPushType to set
	 */
	public void setMsgPushType(String msgPushType) {
		this.msgPushType = msgPushType;
	}
	/**
	 * @return the expires
	 */
	public String getExpires() {
		return expires;
	}
	/**
	 * @param expires the expires to set
	 */
	public void setExpires(String expires) {
		this.expires = expires;
	}
	/**
	 * @return the extra_content
	 */
	public String getExtra_content() {
		return extra_content;
	}
	/**
	 * @param extra_content the extra_content to set
	 */
	public void setExtra_content(String extra_content) {
		this.extra_content = extra_content;
	}
	public String getEnvironment() {
		return environment;
	}
	public void setEnvironment(String environment) {
		this.environment = environment;
	}

	
}

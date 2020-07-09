package com.iflytek.sgy.wjewt.services.yjnc.domain.dto;

import java.io.Serializable;

public class MsgDto implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String title;
	private String content;
	private String goPath;
	private String type;
	private String url;
	private String areaCode;
	private String msgPushType;
	//消息来源
	private String resource;
	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}
	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}
	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}
	/**
	 * @param content the content to set
	 */
	public void setContent(String content) {
		this.content = content;
	}
	/**
	 * @return the goPath
	 */
	public String getGoPath() {
		return goPath;
	}
	/**
	 * @param goPath the goPath to set
	 */
	public void setGoPath(String goPath) {
		this.goPath = goPath;
	}
	/**
	 * @return the areaCode
	 */
	public String getAreaCode() {
		return areaCode;
	}
	/**
	 * @param areaCode the areaCode to set
	 */
	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
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
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}
	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
	}
	public String getResource() {
		return resource;
	}
	public void setResource(String resource) {
		this.resource = resource;
	}
	
	
}

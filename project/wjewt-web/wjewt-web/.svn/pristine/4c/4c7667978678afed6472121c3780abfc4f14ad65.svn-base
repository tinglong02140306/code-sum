package com.iflytek.sgy.wjewt.exception;

import java.io.Serializable;

/**
 * 定义异常返回数据<br/>
 ****************<br/>
 * 说明：<br/>
 * code:错误编码<br/>
 * message:错误信息<br/>
 * className:异常类<br/>
 * data:返回的数据<br/>
 *****************<br/>
 * date: 2016年1月23日 下午1:30:19 <br/>
 */
public class ErrorResult implements Serializable {
	private static final long serialVersionUID = -2399353048688907090L;
	
	/**
	 * 错误码
	 */
	private String code;
	
	/**
	 * 错误信息
	 */
	private String message;
	
	/**
	 * 错误异常类
	 */
	private String className;
	
	/**
	 * 返回的数据
	 */
	private Object data;
	
	/**
	 * 默认构造函数
	 */
	public ErrorResult() {
	}
	
	public ErrorResult(ErrorEnum errorEnum) {
		super();
		this.code = errorEnum.name();
		this.message = errorEnum.getMessage();
	}
	
	public ErrorResult(ErrorEnum errorEnum, String className) {
		super();
		this.code = errorEnum.name();
		this.message = errorEnum.getMessage();
		this.className = className;
	}
	
	public ErrorResult(ErrorEnum errorEnum, String className, Object data) {
		super();
		this.code = errorEnum.name();
		this.message = errorEnum.getMessage();
		this.className = className;
		this.data = data;
	}

	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
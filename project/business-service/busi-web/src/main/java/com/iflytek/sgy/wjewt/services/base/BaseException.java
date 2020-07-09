package com.iflytek.sgy.wjewt.services.base;

/**
 * ClassName: BaseException <br/>
 * Function: 定义基础异常. <br/>
 * date: 2015年12月21日 下午8:44:47 <br/>
 * @author ycli7
 */
public class BaseException extends RuntimeException {
	private static final long serialVersionUID = -105500584464532362L;
	
	/**
	 * 错误码
	 */
	protected String code;
	
	/**
	 * 随异常返回的数据
	 */
	protected Object data;
	
	public BaseException() {}
	public BaseException(String code, String message) {
		super(message);
		this.code = code;
	}
	public BaseException(String code, String message, Object data) {
		super(message);
		this.code = code;
		this.data = data;
	}
	
	/**
	 * 
	 * 重写fillInStackTrace，提升异常对象构造性能
	 * 
	 */
	@Override
	public Throwable fillInStackTrace() {
		return this;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}

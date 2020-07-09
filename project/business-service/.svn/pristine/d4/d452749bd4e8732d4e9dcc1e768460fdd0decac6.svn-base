package com.iflytek.sgy.wjewt.services.yjnc.exception;

import com.iflytek.sgy.wjewt.services.base.BaseException;

/**
 * Function: 定义业务异常. <br/>
 * @author ycli7
 */
public class YjncException extends BaseException {
	private static final long serialVersionUID = 3231937621854258441L;
	
	public YjncException() {}
	public YjncException(String code, String message) {
		super(code, message);
	}
	public YjncException(ErrorEnum error) {
		super(error.name(), error.getMessage());
	}
	public YjncException(ErrorEnum error, String message) {
		super(error.name(), message);
	}
	
	public static void throwsException(ErrorEnum error) throws YjncException {
		YjncException exception = new YjncException(error.name(), error.getMessage());
		throw exception;
	}
	
	public static void throwsException(ErrorEnum error, Object data) throws YjncException {
		YjncException exception = new YjncException(error.name(), error.getMessage());
		exception.setData(data);
		throw exception;
	}
}

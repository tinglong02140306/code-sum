package com.iflytek.sgy.wjewt.exception;

import com.iflytek.sgy.wjewt.base.BaseException;

/**
 * Function: 定义业务异常. <br/>
 * @author ycli7
 */
public class WjewtException extends BaseException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 3231937621854258441L;
	
	public WjewtException() {}
	public WjewtException(String code, String message) {
		super(code, message);
	}
	public WjewtException(ErrorEnum error) {
		super(error.name(), error.getMessage());
	}
}

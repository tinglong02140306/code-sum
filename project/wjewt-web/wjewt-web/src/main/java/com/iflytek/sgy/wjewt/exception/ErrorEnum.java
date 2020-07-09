package com.iflytek.sgy.wjewt.exception;

/**
 * 定义错误枚举
 * @author ycli7
 *
 */
public enum ErrorEnum {

	INTERNAL_SERVER_ERROR("服务出错，请稍后重试"),
	LOAD_ERROR("加载失败"),
	PASSWORD_ERROR("原密码错误"),
	QR_CODE_ERROR("无法识别此二维码"),
	QR_CODE_NULL("二维码不能为空"),
	CHANGE_PASSWORD_ERROR("修改密码出错，请稍后重试！"),
	;
	
	private String message;
	
	ErrorEnum(String message){
		this.message = message;
	}
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

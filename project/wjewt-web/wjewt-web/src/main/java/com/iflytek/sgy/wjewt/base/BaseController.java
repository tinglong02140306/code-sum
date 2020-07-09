package com.iflytek.sgy.wjewt.base;

import java.beans.PropertyEditorSupport;
import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.iflytek.sgy.wjewt.exception.ErrorEnum;
import com.iflytek.sgy.wjewt.exception.ErrorResult;
import com.iflytek.sgy.social.utils.StringUtils;

public abstract class BaseController {

	protected final Logger logger = LoggerFactory.getLogger(getClass());
	@InitBinder
	public void initBinder(WebDataBinder binder) {
		final String[] dateFormat = new String[]{"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "yyyyMMddHHmmss"};
		// Date 类型转换
		binder.registerCustomEditor(Date.class, new PropertyEditorSupport() {
			@Override
			public void setAsText(String text) {
				if (StringUtils.isNotBlank(text)) {
					try {
						setValue(DateUtils.parseDate(text, dateFormat));
					} catch (ParseException e) {
						logger.warn("转换时间格式错误，转换前的时间文本为：{}", text);
					}
				}
			}
		});
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	protected ErrorResult exceptionHandler(Exception exception) {
		logger.warn("加载错误", exception);
		ErrorResult errorResult = new ErrorResult(ErrorEnum.LOAD_ERROR, exception.getClass().getSimpleName());
		return errorResult;
	}
	
	@ExceptionHandler(BaseException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	protected ErrorResult baseExceptionHandler(BaseException exception) {
		logger.info("捕获业务异常", exception);
		ErrorResult errorResult = new ErrorResult();
		errorResult.setCode(exception.getCode());
		errorResult.setMessage(exception.getMessage());
		errorResult.setClassName(exception.getClass().getSimpleName());
		return errorResult;
	}
}

package com.iflytek.sgy.wjewt.web.filter;

/*
 * Copyright @ 2015 com.iflysse.trains
 * portal 下午7:46:26
 * All right reserved.
 *
 */

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**
 * httpServletRequest包装类,在getParameter过滤xss
 * 
 * @desc: portal
 * @author: jnli2@iflytek.com
 * @createTime: 2015年2月4日 下午7:47:31
 * @history:
 * @version: v1.0
 */
public class XssHttpServletRequestWrapper extends HttpServletRequestWrapper {

	public XssHttpServletRequestWrapper(HttpServletRequest servletRequest) {
		super(servletRequest);

	}

	@Override
	public String[] getParameterValues(String parameter) {

		String[] values = super.getParameterValues(parameter);
		if (values == null) {
			return null;
		}

		int count = values.length;
		String[] encodedValues = new String[count];
		for (int i = 0; i < count; i++) {
			encodedValues[i] = cleanXSS(values[i]);
		}
		return encodedValues;
	}

	@Override
	public String getParameter(String parameter) {
		String value = super.getParameter(parameter);
		if (value == null) {
			return null;
		}
		return cleanXSS(value);
	}

	@Override
	public String getHeader(String name) {
		String value = super.getHeader(name);
		if (value == null) {
			return null;
		}
		return cleanXSS(value);
	}

	private String cleanXSS(String value) {

		// You'll need to remove the spaces from the html entities below
		value = value.replaceAll("<", "＜").replaceAll(">", "＞");
		value = value.replaceAll("'", "‘");
		value = value.replaceAll("#", "＃");
		if (value.contains("#")) {
			System.out.println(value);
		}
		value = value.replaceAll("&", "＆");

		value = value.replaceAll("eval\\((.*)\\)", "");
		value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
		// 此处可能对传参产生影响,传递alert可能会被过滤
		value = value.replaceAll("onmouse", "").replace("alert", "ALERT");

		return value;

	}
}

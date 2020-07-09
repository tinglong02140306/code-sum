package com.iflytek.sgy.wjewt.web.filter;

/*
 * Copyright @ 2015 com.iflysse.trains
 * portal 下午7:45:22
 * All right reserved.
 *
 */

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

/**
 * 
 * @desc: portal
 * @author: jnli2@iflytek.com
 * @createTime: 2015年2月4日 下午7:49:40
 * @history:
 * @version: v1.0
 */
public class XssEscapeFilter implements Filter {


	FilterConfig filterConfig = null;
	/**排除url**/
	private String excludedUrl;  
	private String[] excludedUrlArray;


	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		//排除url
    	excludedUrl = filterConfig.getInitParameter("excludedUrl");
    	if(StringUtils.isNotBlank(excludedUrl)){
    		excludedUrlArray = excludedUrl.split(",");
    	}

	}

	public void destroy() {
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		boolean isExcludedUrl = false;
    	//判断是否在过滤url之外
    	if(null != excludedUrlArray && excludedUrlArray.length > 0 ){
    		for (String url : excludedUrlArray) {
        		if(((HttpServletRequest) request).getServletPath().equals(url)){ 
        			isExcludedUrl = true;
        			break;
        		}
    		}
    	}

    	if(isExcludedUrl){
    		//不做过滤
    		chain.doFilter(request, response);
    	}else{
    		XssHttpServletRequestWrapper xssRequest = new XssHttpServletRequestWrapper(
                    (HttpServletRequest) request);
    		chain.doFilter(xssRequest, response);
    	}
    	
	}
}

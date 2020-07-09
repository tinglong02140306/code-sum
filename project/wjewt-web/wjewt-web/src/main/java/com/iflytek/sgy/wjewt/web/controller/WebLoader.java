/**
 * <br>
 * Copyright 2011 IFlyTek. All rights reserved.<br>
 * <br>			 
 * Package: com.iflytek.support <br>
 * FileName: WebLoad.java <br>
 * <br>
 * @version
 * @author xmzhu2
 * @created 2013-6-6
 * @last Modified
 * @history
 */

package com.iflytek.sgy.wjewt.web.controller;

import javax.servlet.ServletContext;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.ServletContextAware;

import com.iflytek.sgy.wjewt.config.ApplicationConfig;




/**
 * WebLoader
 *
 * @author xkfeng
 * @lastModified
 * @history
 */
@Controller
public class WebLoader implements ApplicationContextAware, ServletContextAware {
	
	@Autowired
	ApplicationConfig applicationConfig;

    /**
     * servletContext
     */
    static public ServletContext servletContext;

    /**
     * @author scrum
     * @created 2013-6-23 下午03:38:30
     * @lastModified
     * @history
     * @see org.springframework.context.ApplicationContextAware#setApplicationContext(org.springframework.context.ApplicationContext)
     */
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
    }

    /**
     * @author xmzhu2
     * @created 2013-6-6 下午5:14:46
     * @lastModified
     * @history
     * @see org.springframework.web.context.ServletContextAware#setServletContext(javax.servlet.ServletContext)
     */
    public void setServletContext(ServletContext arg0) {
    	arg0.setAttribute("CONFIGPATH", applicationConfig.configpath);
    	servletContext = arg0;
    }
}

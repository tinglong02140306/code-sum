package com.iflytek.sgy.wjewt.services.support;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * Created by Administrator on 2018/2/5.
 */
public class SecurityInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies != null) {
            Cookie cookie = cookies[0];
            if (cookie != null) {
                // serlvet 2.5 不支持在 Cookie 上直接设置 HttpOnly 属性.
                String value = cookie.getValue();

                StringBuilder builder = new StringBuilder();
                builder.append("JSESSIONID=" + value + "; ");
                builder.append("Secure; ");
                builder.append("HttpOnly; ");

                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.HOUR, 1);
                Date date = calendar.getTime();
                Locale locale = Locale.CHINA;

                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss",locale);
                builder.append("Expires=" + sdf.format(date));

                httpServletResponse.setHeader("Set-Cookie", builder.toString());
            }
        }


    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}

package com.iflytek.sgy.wjewt.redis;

import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created by Administrator on 2017/9/22.
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Component
public @interface DictCode {
    /**
     * 类型简拼
     * @return
     */
    String lxjp() ;

    /**
     *
     * @return
     */
    String field() ;
}

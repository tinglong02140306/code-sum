package com.iflytek.sgy.wjewt.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.interceptor.DefaultKeyGenerator;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Cache配置
 * @author ycli7
 *
 */
@Configuration  
@ComponentScan(basePackages = "com.iflytek.sc")  
@EnableCaching(proxyTargetClass = true)  
public class CacheConfig implements CachingConfigurer {  
    @Bean  
    @Override  
	public CacheManager cacheManager() {
		ConcurrentMapCacheManager ConcurrentMapCacheManager = new ConcurrentMapCacheManager();
		return ConcurrentMapCacheManager;
	}
  
    @Bean  
    @Override  
    public KeyGenerator keyGenerator() {  
        return new DefaultKeyGenerator();  
    }  
} 
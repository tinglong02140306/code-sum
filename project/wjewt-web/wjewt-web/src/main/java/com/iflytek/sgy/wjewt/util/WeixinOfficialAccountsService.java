package com.iflytek.sgy.wjewt.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.iflytek.sgy.social.support.redis.RedisUtils;
import com.iflytek.sgy.social.uop.api.dto.WeixinOfficialAccountsConfig;
import com.iflytek.sgy.social.utils.StringUtils;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.exception.ErrorEnum;
import com.iflytek.sgy.wjewt.exception.WjewtException;

@Component
public class WeixinOfficialAccountsService {

	private Logger logger = LoggerFactory.getLogger(getClass());
	
	private RestTemplate restTemplate;
	
	@Autowired
	private ApplicationConfig config;
	
	@Autowired
	private HttpServletRequest request;
	
	@PostConstruct
	public synchronized void init() {
		if (restTemplate == null) {
			restTemplate = new RestTemplate();
			// 获取RestTemplate默认配置好的所有转换器
			List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
			for (int index = 0; index < messageConverters.size(); index++) {
				HttpMessageConverter<?> converter = messageConverters.get(index);
				if (converter instanceof MappingJackson2HttpMessageConverter) {
					// 移除掉默认的MappingJackson2HttpMessageConverter
					messageConverters.remove(index);
				}
			}
			// 添加上fastjson的转换器
			messageConverters.add(new FastJsonHttpMessageConverter());
		}
	}

	public WeixinOfficialAccountsConfig getWeixinConfig() {
		try {
			//随机数
			String nonceStr = UUID.randomUUID().toString().replaceAll("-", "").substring(10, 26);
			//时间戳
			String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
			//请求的url
			String url = request.getRequestURL().toString();
			if ("https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"))) {
				url = url.replaceFirst("http://", "https://");
			}
			String queryurl = request.getQueryString();
			if (StringUtils.isNotBlank(queryurl) && !"null".equals(queryurl)) {
				url += "?" + queryurl;
			}
			//微信ticket
			String ticket = getJsapiTicket();
			
			//对参数进行排序
			List<String> paramList = new ArrayList<String>();
			paramList.add("jsapi_ticket=" + ticket);
			paramList.add("noncestr=" + nonceStr);
			paramList.add("timestamp=" + timestamp);
			paramList.add("url=" + url);
			Collections.sort(paramList);
			String result = "";
			for (String p : paramList) {
				if (paramList.indexOf(p) > 0) {
					result += "&";
				}
				result += p;
			}
			
			//进行sha1签名
			String sign = DigestUtils.sha1Hex(result);
			WeixinOfficialAccountsConfig weixinConfig = new WeixinOfficialAccountsConfig();
			weixinConfig.setAppId(config.weixinMpAppId);
			weixinConfig.setNonceStr(nonceStr);
			weixinConfig.setSignature(sign);
			weixinConfig.setTimestamp(timestamp);
			if (logger.isDebugEnabled()) {
				logger.debug("获取的微信配置为：{}", JSON.toJSONString(weixinConfig));
				logger.debug("获取的微信ticket为：{}", ticket);
			}
			return weixinConfig;
		} catch (Exception e) {
			logger.warn("获取微信配置错误", e);
		}
		return null;
	}
	
	public String getAccessToken(String wxAppId, String wxSecret) {
		//缓存token
		String accessToken = RedisUtils.getString("weixin:token:");
		if(StringUtils.isNotBlank(accessToken)){
			logger.debug("缓存的token为:{}", accessToken);
			return accessToken;
		}
		
        //发送get请求
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wxAppId +"&secret=" +wxSecret;
		WxAccessToken wxAccessToken = restTemplate.getForObject(requestUrl, WxAccessToken.class);
		if(wxAccessToken == null){
			logger.warn("获取微信access_token失败");
			throw new WjewtException(ErrorEnum.LOAD_ERROR.name(), "获取微信access_token失败");
		}
		accessToken = wxAccessToken.access_token;
		logger.debug("获取到的微信token为:{}", accessToken);
		
		//缓存access_token
		RedisUtils.setValue("weixin:token:", accessToken, wxAccessToken.expires_in - 30);
		return accessToken;
	}
	
	private String getJsapiTicket(){
		String accessToken = getAccessToken(config.weixinMpAppId, config.weixinMpAppSecret);
		String ticket = getJsapiTicket(accessToken);
		return ticket;
	}
	
	private String getJsapiTicket(String wxAccessToken){
		//缓存ticket
		String ticket = (String) RedisUtils.getString("weixin:ticket:");
		if(StringUtils.isNotBlank(ticket)){
			logger.debug("缓存的ticket为:{}", ticket);
			return ticket;
		}
		
		//发送get请求
		String requestUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=" + wxAccessToken;
		JsapiTicket jsapiTicket = restTemplate.getForObject(requestUrl, JsapiTicket.class);;
		if(jsapiTicket == null || !"0".equals(jsapiTicket.errcode)){
			logger.warn("获取微信jsapi_ticket失败，微信返回的错误消息：{}", jsapiTicket.errmsg);
			throw new WjewtException(ErrorEnum.LOAD_ERROR.name(), "获取微信jsapi_ticket失败");
		}
		ticket = jsapiTicket.ticket;
		
		//缓存access_token
		RedisUtils.setValue("weixin:ticket:", ticket, jsapiTicket.expires_in - 30);
		return ticket;
	}
	
	static class WxAccessToken {
		private String access_token;
		private long expires_in;
		public String getAccess_token() {
			return access_token;
		}
		public void setAccess_token(String access_token) {
			this.access_token = access_token;
		}
		public long getExpires_in() {
			return expires_in;
		}
		public void setExpires_in(long expires_in) {
			this.expires_in = expires_in;
		}
	}
	
	static class JsapiTicket {
		private String errcode;
		private String errmsg;
		private String ticket;
		private long expires_in;
		public String getErrcode() {
			return errcode;
		}
		public void setErrcode(String errcode) {
			this.errcode = errcode;
		}
		public String getErrmsg() {
			return errmsg;
		}
		public void setErrmsg(String errmsg) {
			this.errmsg = errmsg;
		}
		public String getTicket() {
			return ticket;
		}
		public void setTicket(String ticket) {
			this.ticket = ticket;
		}
		public long getExpires_in() {
			return expires_in;
		}
		public void setExpires_in(long expires_in) {
			this.expires_in = expires_in;
		}
	}

}

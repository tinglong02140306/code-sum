package com.iflytek.sgy.wjewt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApplicationConfig {

//	@Value("${tjfx.defaultProvince}")
//	private String defaultProvince;
//
//	// uaac应用编码
//	@Value("${uaac.client.appCode}")
//	private String uaacAppCode;
//	
//	//uaac根权限编码
//	@Value("${uaac.root.auth.code}")
//	private String uaacAuthCode;
//
//	@Value("${application.rootxzqh}")
//	private String rootXzqh;
	/**
	* 登录用户id请求rest接口
	*/
	@Value("${GETUSERID_URL}")
	private String GETUSERID_URL;

	@Value("${fastdfs_address}")
	public String fastdfsAddress;
	
    @Value("${weixin.mp.appId}")
    public String weixinMpAppId;
    @Value("${weixin.mp.appSecret}")
    public String weixinMpAppSecret;
	@Value("${weixin.h5.index}")
	public String wxIndex;

    /**
     * 评论系统标识
     */
    @Value("${comment.uop}")
    public String commentUop;
    
	
	/**
	 * 支付成功跳转地址
	 */
	@Value("${PAY_SUCCESS_JUMP_URL}")
	public String paySuccessJumpUrl; 
	
	/**
	 * 缴款识别码正则表达式
	 */
	@Value("${PAY_CODE_PATTERN}")
	public String payCodePattern;

	/**
	 * 是否开启扫码
	 */
	@Value("${SCAN_FLG}")
	public String sacanDealFlg;

	/**
	 * H5站点地址端口
	 */
	@Value("${configpath}")
	public String configpath;

//	public String getRootXzqh() {
//		return rootXzqh;
//	}
//
//	public void setRootXzqh(String rootXzqh) {
//		this.rootXzqh = rootXzqh;
//	}
//
//	public String getDefaultProvince() {
//		return defaultProvince;
//	}
//	public void setDefaultProvince(String defaultProvince) {
//		this.defaultProvince = defaultProvince;
//	}
//	public String getUaacAppCode() {
//		return uaacAppCode;
//	}
//	public void setUaacAppCode(String uaacAppCode) {
//		this.uaacAppCode = uaacAppCode;
//	}
//	public String getUaacAuthCode() {
//		return uaacAuthCode;
//	}
//	public void setUaacAuthCode(String uaacAuthCode) {
//		this.uaacAuthCode = uaacAuthCode;
//	}

	public String getGETUSERID_URL() {
		return GETUSERID_URL;
	}

	public void setGETUSERID_URL(String gETUSERID_URL) {
		GETUSERID_URL = gETUSERID_URL;
	}
	
}

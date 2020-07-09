package com.iflytek.sgy.wjewt.services.base;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 系统配置常量
 * Created by Administrator on 2018/1/15.
 */
@Service
public class ApplicationConstants {
	
	@Value("${JMT.CLIENT.ID}")
	public String CLIENT_ID;
	@Value("${fdfs_http_prefix}")
	public String FDFS_HTTP;
	
	@Value("${yjnc.tel.url}")
	public String telUrl;
	@Value("${yjnc.tel.user}")
	public String telUser;
	@Value("${yjnc.tel.corp}")
	public String telCorp;
	@Value("${yjnc.tel.pwd_md5}")
	public String telPwdMd5;
	@Value("${yjnc.tel.batch}")
	public int telBatch;
	@Value("${yjnc.tel.timeout}")
	public int telTimeout;
	
    @Value("${weixin.mp.appId}")
    public String weixinMpAppId;
    @Value("${weixin.mp.appSecret}")
    public String weixinMpAppSecret;
    @Value("${weixin.h5.index}")
    public String wxIndex;
    @Value("${weixin.h5.downloadUrl}")
    public String downloadUrl;

	//是否发送短信true-发送,false-不发送
	@Value("${message.isSend}")
	public boolean isSendSms;
	/**
	 * 消息发送系统
	 */
	@Value("${message.senderSystem}")
	public String senderSystem;
	/**
	 *消息授权码
	 */
	@Value("${message.authCode}")
	public String authCode;
	/**
	 * 加密接口安全码
	 */
	@Value("${message.securityKey}")
	public String securityKey;
	/**
	 * 消息加密rest接口地址
	 */
	@Value("${message.url.prefix}/encrypt")
	public String encryptMsgUrl;
	/**
	 * 消息接收系统
	 */
	@Value("${message.receiverSystem}")
	public String receiverSystem;
	/**
	 * 消息中心短信接口前缀
	 */
	@Value("${message.url.prefix}")
	public String messageUrlPrefix;

	/**
	 * 获取用户did接口url
	 */
	@Value("${get_userdid_url}")
	public String getUserDidUrl;

	@Value("${ocr_scan_url}")
	public String ocrUrl;



    public String getCLIENT_ID() {
        return CLIENT_ID;
    }

    public void setCLIENT_ID(String CLIENT_ID) {
        this.CLIENT_ID = CLIENT_ID;
    }

	public String getFDFS_HTTP() {
		return FDFS_HTTP;
	}

	public void setFDFS_HTTP(String FDFS_HTTP) {
		this.FDFS_HTTP = FDFS_HTTP;
	}
}

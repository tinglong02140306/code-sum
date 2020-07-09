package com.iflytek.sgy.wjewt.services.yjnc.service.events;

import java.text.MessageFormat;
import java.util.Calendar;
import java.util.Date;

import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.redis.DictCache;
import com.iflytek.sgy.wjewt.services.base.MessageConvert;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.http.HttpEntity;
import org.springframework.util.Assert;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import bingo.jmt.client.web.common.ClientConfigPlaceHolder;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;

/**
 * 发送短信事件处理器
 * Created by Administrator on 2018/1/10.
 */
public class SMSEventHandler implements EventHandler,ApplicationContextAware {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    private ApplicationContext applicationContext;


    @Value("${sms.notice.template}")
    private String smsNoticeTemplate;

    @Autowired
    private ServiceYjncTasksDao serviceYjncTasksDao;

	@Autowired
	private ApplicationConstants config;

	@Autowired
    private RestTemplate restTemplate;

    /**
     * 执行事件处理
     *
     * @param apply
     * @return
     */
    @Override
    public void doEvent(ServiceYjncApply apply) {
        if (StringUtils.equalsIgnoreCase(SysCode.YES_NO.YES,apply.getSmsOrNot())){
            ServiceYjncTasks yjncTask=new ServiceYjncTasks();
            yjncTask.setApplyId(apply.getId());
            String seceretNum=apply.getCarPlateNum().substring(0,3).concat("**").concat(apply.getCarPlateNum().substring(5));
            String reason= MessageConvert.getSmsReasonText(apply.getReasonType());
            String content = MessageFormat.format(smsNoticeTemplate,seceretNum,apply.getAddress(),reason);
            yjncTask.setEventContent(content);
            yjncTask.setEventType(SysCode.EVENT_TYPE.SMS);
            yjncTask.setTargetObject(apply.getDriverMobile());
            Date date = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            logger.info(MessageFormat.format("短信发送时间:{0}:{1}:{2}",calendar.get(Calendar.HOUR_OF_DAY),calendar.get(Calendar.MINUTE),calendar.get(Calendar.SECOND)));
            yjncTask.setEventTime(date);
            //调用短信接口发送短信，并获取发送状态
            try {
                boolean res = retrySend(yjncTask.getTargetObject(), content);
                yjncTask.setEventStatus(res ? SysCode.EVENT_STATUS.SUCCESS:SysCode.EVENT_STATUS.FAIL);
                if (res){
                    yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("短信已通知"));
                }else {
                    yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("短信通知失败"));
                }
            }catch (Exception e){
                logger.error("短信发送异常！",e);
                yjncTask.setEventStatus(SysCode.EVENT_STATUS.FAIL);
                yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("短信通知失败"));
            }
            serviceYjncTasksDao.saveTask(yjncTask);
            logger.debug("执行短信通知功能：{}", JSON.toJSONString(yjncTask));
        }
    }

    /**
     * 处理重发策略
     * @param phone
     * @param content
     * @return
     */
    private boolean retrySend(String phone,String content){
        boolean res = doSend(phone, content);
        //如果不成功则在执行重发一次
        if (!res){
            return doSend(phone,content);
        }else {
            return res;
        }
    }

    /**
     * 发送短信
     * @param phone
     *      电话号码
     * @param content
     *      短信内容
     * @return
     */
    private boolean doSend(String phone, String content) {
    	Assert.hasText(phone, "发送号码未设置");
    	Assert.hasText(content, "发送内容为空");

    	LinkedMultiValueMap<String, Object> requestParams = new LinkedMultiValueMap<>();
    	ClientConfigPlaceHolder.getClientConfig().setAppCode(config.CLIENT_ID);
		requestParams.add("appCode", ClientConfigPlaceHolder.getClientConfig().getAppCode());
		requestParams.add("phone", phone);
		requestParams.add("content", content);

		// 发送短信并查看结果
		String resourceUri = "/sdkUnCheck/sendSms";
		String signatureUrl = ClientConfigPlaceHolder.signatureUrl(resourceUri, requestParams.toSingleValueMap());

		String requestUrl = ClientConfigPlaceHolder.getClientConfig().getJmtServiceEndPoint() + signatureUrl;
		HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestParams, null);
		JSONObject result = restTemplate.postForObject(requestUrl, requestEntity, JSONObject.class);
		logger.debug("请求短信通知接口的返回报文：{}", result);
		if (result.getInteger("code") == 1) {
			// 发送成功
			return true;
		}
		return false;
	}
	
    /**
     * 获取实例
     *
     * @return
     */
    @Override
    public EventHandler getInstance() {
        return applicationContext.getBean("smsEventHandler",SMSEventHandler.class);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}

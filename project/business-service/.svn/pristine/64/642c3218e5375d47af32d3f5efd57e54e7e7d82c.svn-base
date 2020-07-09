package com.iflytek.sgy.wjewt.services.yjnc.service.events;

import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.redis.DictCache;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.services.base.MessageConvert;
import com.iflytek.sgy.wjewt.services.yjnc.domain.dto.VoiceStatusDTO;

/**
 * 语音电话事件处理器
 * Created by Administrator on 2018/1/10.
 */
public class TELEventHandler implements EventHandler,ApplicationContextAware {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    private ApplicationContext applicationContext;

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    @Value("${tel.notice.template}")
    private String telNoticeTemplate;

    @Autowired
    private DictCache dictCache;

    @Autowired
    private ServiceYjncTasksDao serviceYjncTasksDao;
    
	@Autowired
	private ApplicationConstants config;
	
	@Autowired
    private RestTemplate restTemplate;

    /**
     * 执行事件处理，并返回执行结果
     *
     * @param apply
     * @return
     */
    @Override
    public void doEvent(ServiceYjncApply apply) {
        if (StringUtils.equalsIgnoreCase(SysCode.YES_NO.YES,apply.getTelOrNot())){
            ServiceYjncTasks yjncTask=new ServiceYjncTasks();
            yjncTask.setApplyId(apply.getId());
			String reason= MessageConvert.getSmsReasonText(apply.getReasonType());
			String num = apply.getCarPlateNum();
            String content = MessageFormat.format(telNoticeTemplate,num.charAt(1),num.substring(num.length()-2),apply.getAddress(),reason);
            yjncTask.setEventContent(content);
            yjncTask.setEventType(SysCode.EVENT_TYPE.TEMP_STATE);
            yjncTask.setTargetObject(apply.getDriverMobile());
            Date date = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            logger.info(MessageFormat.format("电话发送时间:{0}:{1}:{2}",calendar.get(Calendar.HOUR_OF_DAY),calendar.get(Calendar.MINUTE),calendar.get(Calendar.SECOND)));
            yjncTask.setEventTime(date);
			yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("电话"));
			serviceYjncTasksDao.saveTask(yjncTask);
			logger.debug("执行电话通知功能：{}", JSON.toJSONString(yjncTask));
            try {
               boolean res  =  retrySend(yjncTask.getTargetObject(), content, yjncTask.getId());
               if (!res){
               		yjncTask.setEventType(SysCode.EVENT_TYPE.TEL);
               		yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("电话未接听"));
               		yjncTask.setEventStatus(SysCode.EVENT_STATUS.FAIL);
				   serviceYjncTasksDao.saveTask(yjncTask);
			   }
            }catch (Exception e){
                logger.error("电话语音异常！",e);
				yjncTask.setEventType(SysCode.EVENT_TYPE.TEL);
				yjncTask.setEventName((apply.isPressed() ? "第二次":"").concat("电话未接听"));
				yjncTask.setEventStatus(SysCode.EVENT_STATUS.FAIL);
				serviceYjncTasksDao.saveTask(yjncTask);
            }

        }
    }

	/**
	 * 处理重发策略
	 * @param phone
	 * @param content
	 * @return
	 */
	public boolean retrySend(String phone,String content,String taskId){
		boolean res = doSend(phone, content,taskId);
		//如果接口调用失败怎重新调用一次
		if (!res){
			return doSend(phone,content,taskId);
		}else {
			return res;
		}
	}
	
	private boolean doSend(String phone, String content, String taskID) {
		JSONObject queryParams = new JSONObject();
		queryParams.put("cmd", "send_voice");
		queryParams.put("corp", config.telCorp);
		queryParams.put("user", config.telUser);
		queryParams.put("pwd_md5", config.telPwdMd5);
		queryParams.put("tel_num", phone);
		queryParams.put("out_uid", taskID);
		queryParams.put("batch", config.telBatch);
		Date timeoutDate = DateUtils.addMinutes(new Date(), config.telTimeout);
		queryParams.put("end_time", sdf.format(timeoutDate));
		queryParams.put("queue", true);
		//TTS|开始，表示是文本内容
		queryParams.put("context", "TTS|" + content);
//		queryParams.put("out_uid", "");
		
		String requestUrl = config.telUrl;
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<JSONObject> requestEntity = new HttpEntity<>(queryParams, headers);
		String resultString = restTemplate.postForObject(requestUrl, requestEntity, String.class);
		JSONObject resultJson = JSON.parseObject(resultString);
		if (resultJson == null) {
			return false;
		}
		logger.debug("请求电话通知接口的返回报文：{}", resultJson.toJSONString());
		if ("0".equals(resultJson.getString("result"))) {
			return true;
		}
		return false;
	}
	
	/**
	 * 获取电话通知状态
	 * @return 电话通知状态
	 */
	public VoiceStatusDTO getTelStatus(String applyId) {
		JSONObject queryParams = new JSONObject();
		queryParams.put("cmd", "voice_status");
		queryParams.put("corp", config.telCorp);
		queryParams.put("out_uid", applyId);
		
		String requestUrl = config.telUrl;
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<JSONObject> requestEntity = new HttpEntity<>(queryParams, headers);
		String resultString = restTemplate.postForObject(requestUrl, requestEntity, String.class);
		VoiceStatusDTO voiceStatus = JSON.parseObject(resultString, VoiceStatusDTO.class);
		
		if (logger.isDebugEnabled()) {
			logger.debug("请求电话状态接口的返回报文：{}", JSON.toJSONString(voiceStatus));
		}
		return voiceStatus;
	}
	
	public static void main(String[] args) {
		JSONObject queryParams = new JSONObject();
		queryParams.put("cmd", "voice_status");
		queryParams.put("corp", "eTong1001");
		queryParams.put("tel_num", "13155160739");
		
		String requestUrl = "http://106.14.168.245:8001/io/sdk.ashx";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<JSONObject> requestEntity = new HttpEntity<>(queryParams, headers);
		RestTemplate restTemplate = new RestTemplate();
		String resultString = restTemplate.postForObject(requestUrl, requestEntity, String.class);
		VoiceStatusDTO result = JSON.parseObject(resultString, VoiceStatusDTO.class);
		System.out.println(JSON.toJSONString(result));
	}
    
    /**
     * 获取实例
     *
     * @return
     */
    @Override
    public EventHandler getInstance() {
        return applicationContext.getBean("telEventHandler",TELEventHandler.class);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}

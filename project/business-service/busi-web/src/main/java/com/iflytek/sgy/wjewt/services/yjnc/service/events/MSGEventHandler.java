package com.iflytek.sgy.wjewt.services.yjnc.service.events;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.persistence.ServiceYjncTasksDao;
import com.iflytek.sgy.wjewt.services.base.*;
import com.iflytek.sgy.wjewt.services.utils.HttpUtil;
import com.iflytek.sgy.wjewt.services.yjnc.domain.dto.MsgDto;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.*;

/**
 * Created by Administrator on 2018/3/22.
 */
public class MSGEventHandler implements EventHandler, ApplicationContextAware {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    private ApplicationContext applicationContext;

    @Value("${sms.notice.template}")
    private String smsNoticeTemplate;

    @Autowired
    private ServiceYjncTasksDao serviceYjncTasksDao;

    @Autowired
    private ApplicationConstants config;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 执行申请事件处理，并返回执行结果
     *
     * @param apply
     * @return
     */
    @Override
    public void doEvent(ServiceYjncApply apply) {
        ServiceYjncTasks yjncTask = new ServiceYjncTasks();
        yjncTask.setApplyId(apply.getId());
        String seceretNum = apply.getCarPlateNum().substring(0, 3).concat("**").concat(apply.getCarPlateNum().substring(5));
        String reason = MessageConvert.getSmsReasonText(apply.getReasonType());
        String content = MessageFormat.format(smsNoticeTemplate, seceretNum, apply.getAddress(), reason);
        yjncTask.setEventContent(content);
        yjncTask.setEventType(SysCode.EVENT_TYPE.MSG);
        yjncTask.setTargetObject(apply.getDriverMobile());
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        logger.info(MessageFormat.format("消息推送时间:{0}:{1}:{2}", calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), calendar.get(Calendar.SECOND)));
        yjncTask.setEventTime(date);
        //调用短信接口发送短信，并获取发送状态
        try {
            sendMessage(yjncTask);
            yjncTask.setEventStatus(SysCode.EVENT_STATUS.SUCCESS);
            yjncTask.setEventName("消息推送成功");
        } catch (Exception e) {
            logger.error("消息推送异常！", e);
            yjncTask.setEventStatus(SysCode.EVENT_STATUS.FAIL);
            yjncTask.setEventName("消息推送失败");
        }
        serviceYjncTasksDao.saveTask(yjncTask);
        logger.debug("执行消息推送功能：{}", JSON.toJSONString(yjncTask));
    }

    /**
     * 获取实例
     *
     * @return
     */
    @Override
    public EventHandler getInstance() {
        return applicationContext.getBean("msgEventHandler", MSGEventHandler.class);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    /**
     * 根据用户id获取did
     *
     * @param userId
     * @param dvcType 设备类型：Android/IOS
     * @return String
     * @author: admin4
     * @createTime: 2017年12月20日 下午3:21:20
     * @history:
     */
    private String getUserDids(String userId, String dvcType) {
        if (StringUtils.isNotEmpty(userId)) {
            try {
                String result = HttpUtil.doGet(config.getUserDidUrl + userId,
                        null);
                logger.debug("用户did获取结果：" + result);
                JSONObject jsonResult = JSONObject.parseObject(result);
                if (jsonResult != null && jsonResult.getBoolean("flag")) {
                    JSONObject data = jsonResult.getJSONObject("data");
                    if (data.containsKey(userId)) {
                        if (data.getString(userId).contains(dvcType)) {
                            return data.getString(userId).replace(":",
                                    "_");
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("获取用户did失败" + userId);
            }
        }
        return null;
    }

    /**
     * ｛发送系统消息｝
     * <p>
     * void
     *
     * @author xfzhu3
     * @created 2017年12月15日 下午3:43:24
     * @lastModified
     * @history
     */
    private void sendMessage(ServiceYjncTasks tasks) {
        MsgDto msg = new MsgDto();
        msg.setTitle("移车通知提醒");
        msg.setContent(tasks.getEventContent());
        msg.setResource("XTTZ");
        String userId =  getUserId( tasks.getTargetObject());
        //TODO 测试模拟现网用户ID，李亚的用户ID
        //userId = "2c9e84c56092e64c016092f5b116000a";
        if (StringUtils.isBlank(userId)){
            return ;
        }

        // 发送推送（Android,IOS）
        String androidDid = getUserDids(userId, SysCode.DVC_TYPE.ANDROID_APPID);
        if (StringUtils.isNotBlank(androidDid)) {
            androidDid = androidDid.replace("Android", SysCode.DVC_TYPE.ANDROID);
        }
        if (StringUtils.isNotEmpty(androidDid)) {
            sendMsg(msg, userId + "_" + androidDid,
                    SysCode.DVC_TYPE.ANDROID_APPID);
        }
        String iosDid = getUserDids(userId, SysCode.DVC_TYPE.IOS_APPID);
        if (StringUtils.isNotBlank(iosDid)) {
            iosDid = iosDid.replace("IOS", SysCode.DVC_TYPE.IOS);
        }
        if (StringUtils.isNotEmpty(iosDid)) {
            sendMsg(msg, userId + "_" + iosDid, SysCode.DVC_TYPE.IOS_APPID);
        }
    }

    /**
     * app推送
     *
     * @param msgDto 推送的实体参数
     * @param userId 推送的用户
     * @param appid  void 推送的应用id
     * @author: yanzhang9
     * @createTime: 2017年2月27日 下午7:24:13
     */
    private void sendMsg(MsgDto msgDto, String userId, String appid) {
        logger.info("app推送appid:{},nowDate:{}===============", appid,
                new Date());
        logger.info("app推送userId:{},nowDate:{}===============", userId,
                new Date());
        MsgContent msg = new MsgContent();
        msg.setAuthCode(config.authCode);
        msg.setSenderUser("管理员");
        msg.setSenderSystem(config.senderSystem);
        msg.setReceiverSystem(config.receiverSystem);
        msg.setTitle(msgDto.getTitle());
        msg.setContent(msgDto.getContent());
        msg.setSecurityKey(config.securityKey);

        // 发送内容和title加密
        try {
            msg.setSource(msg.getContent());// 明文内容
            String res = HttpUtil.httpPost(config.encryptMsgUrl, msg);
            String content = com.alibaba.fastjson.JSONObject.parseObject(res)
                    .getString("data");
            msg.setContent(content);
            msg.setSource(msg.getTitle());// 明文标题
            String res1 = HttpUtil.httpPost(config.encryptMsgUrl, msg);
            String title = com.alibaba.fastjson.JSONObject.parseObject(res1)
                    .getString("data");
            msg.setTitle(title);
        } catch (IOException e) {
            logger.error("调用消息明文加密服务接口失败，url=" + config.encryptMsgUrl, e);
        }

        // 将list转成以逗号隔开的字符串
        msg.setMsgType(SysCode.MsgType.APP_PUSH);// app推送
        // app推送扩展信息
        MsgExtends extendVo = new MsgExtends();
        // pushType 0单推 1app群推 2列表推 3tag推
        extendVo.setPushType("0");
        extendVo.setMsgPushType("1");// 1透传
        extendVo.setExpires("");// 过期时间，讯推默认保存7天
        if (!config.isSendSms) {
            extendVo.setEnvironment("2");
        }

        // Android端接收的实体
        PushMessage pushMsg = new PushMessage();
        if (StringUtils.isNotBlank(msgDto.getGoPath())) {
            pushMsg.setIsAction("1");
        }
        pushMsg.setTitle(msgDto.getTitle());
        pushMsg.setContent(msgDto.getContent());

        extendVo.setExtra_content(JSONObject
                .toJSONString(pushMsg));
        msg.setExtendVo(extendVo);
        String extend = "{kind:'" + appid + "'}";
        msg.setExtend(extend);

        // 存储分批发送的用户信息
        // 接收人，多个以“,”分隔(app推送：必须是userId+_+did(用户设备ID)+_+dvc_type(设备类型) 组合在一起 例如：
        // usrId_did_dvc_type)
        msg.setReceiverUser(userId);
        String resultCode = null;
        try {
            // 发送参数固定，去掉多余参数
            msg.setSecurityKey(null);
            msg.setSource(null);
            resultCode = HttpUtil.httpPost(config.messageUrlPrefix + "/send",
                    msg);
            logger.info("推送发送结果" + resultCode);
        } catch (IOException e) {
            logger.error("发送 POST请求出现异常！返回错误码：" + resultCode, e);
        }
    }

    /**
     * 根据用户手机号获取对应的账户ID
     *
     * @param phone
     * @return
     */
    public String getUserId(String phone) {

        try {
            Map<String,Object> map   =  jdbcTemplate.queryForMap("select ID from sso_user t where t.phone = ?",phone);
            Object idObject = map.get("ID");
            return (String)idObject;
        }catch (EmptyResultDataAccessException e){
            logger.info("未查询到对应的用户ID，取消推送流程！");
            return null;
        }
    }
}

package com.iflytek.sgy.wjewt.services.activemq;

import com.alibaba.fastjson.JSON;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.services.yjnc.service.events.EventHandlerFactory;
import org.apache.activemq.command.ActiveMQObjectMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
/**
 * 处理事件监听器
 * Created by Administrator on 2018/1/10.
 */
public class EventExcuterListener  implements MessageListener {

   @Autowired
    EventHandlerFactory eventHandlerFactory;



    Logger logger = LoggerFactory.getLogger(EventExcuterListener.class);

    @Override
    public void onMessage(Message message) {

        try {
            Object object = ((ActiveMQObjectMessage) message).getObject();
            if (object != null){
                logger.debug("监听处理申请：{}", JSON.toJSONString(object));
                ServiceYjncApply apply = (ServiceYjncApply)object;
                eventHandlerFactory.startEvent(apply);
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

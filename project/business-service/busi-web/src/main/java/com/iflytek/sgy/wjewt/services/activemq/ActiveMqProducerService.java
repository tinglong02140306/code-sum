package com.iflytek.sgy.wjewt.services.activemq;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.io.Serializable;

/**
 * 队列发送方服务
 * Created by Administrator on 2017/12/6.
 */
public class ActiveMqProducerService {

    @Autowired
    private JmsTemplate jmsTemplate;



    /**
     * 向指定队列发送消息
     */
    public synchronized void sendMessage(Destination destination, final String msg) {
        System.out.println("向队列" + destination.toString() + "发送了消息------------" + msg);
        jmsTemplate.send(destination, new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                return session.createTextMessage(msg);
            }
        });
    }

    /**
     * 向默认队列发送消息
     */
    public synchronized void sendTextMessage(final String msg) {
        String destination =  jmsTemplate.getDefaultDestination().toString();
        System.out.println("向队列" +destination+ "发送了消息------------" + msg);
        jmsTemplate.send(new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                return session.createTextMessage(msg);
            }
        });
    }

    /**
     * 向队列发送消息
     */
    public synchronized void sendObjMessage(final Serializable objMessage) {
        jmsTemplate.send(new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                return session.createObjectMessage(objMessage);
            }
        });
    }

    /**
     * 向队列发送消息
     */
    public synchronized void sendObjMessage(final Serializable objMessage,String destination) {
        if (StringUtils.isBlank(destination)){
            destination = jmsTemplate.getDefaultDestinationName();
        }
        jmsTemplate.send(destination,new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                return session.createObjectMessage(objMessage);
            }
        });
    }





}

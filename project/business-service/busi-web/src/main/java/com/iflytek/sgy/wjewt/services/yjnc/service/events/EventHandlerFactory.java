package com.iflytek.sgy.wjewt.services.yjnc.service.events;

import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 时间处理工厂
 * Created by Administrator on 2018/1/11.
 */
public class EventHandlerFactory implements InitializingBean {

    @Autowired
    List<EventHandler> eventHandlers;

    public List<EventHandler> getEventHandlers() {
        return eventHandlers;
    }

    public void setEventHandlers(List<EventHandler> eventHandlers) {
        this.eventHandlers = eventHandlers;
    }

    /**
     * 线程池最大线程数
     */
    private int threadSize = 8;

    private ExecutorService executorService;


    /**
     * 执行事件处理
     *
     * @param apply
     */
    public void startEvent(final ServiceYjncApply apply) {
        for (EventHandler eh : eventHandlers) {
            final EventHandler handler = eh.getInstance();
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        handler.doEvent(apply);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        executorService = Executors.newFixedThreadPool(threadSize);
    }
}

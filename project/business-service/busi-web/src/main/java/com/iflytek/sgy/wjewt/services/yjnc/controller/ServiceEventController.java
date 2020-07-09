package com.iflytek.sgy.wjewt.services.yjnc.controller;

import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.service.IServiceEvent;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 事件处理查询
 * Created by Administrator on 2018/1/15.
 */
@Controller
public class ServiceEventController {

    @Autowired
    private IServiceEvent iServiceEvent;


    /**
     * 根据申请ID，获取对应的通知事件列表
     * @param id
     * @return
     */
    @RequestMapping(value = "/task/list", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg getEvent(String id){
        List<ServiceYjncTasks> tasks = iServiceEvent.findTask(id);
        return ResultMsg.success(tasks);
    }
}

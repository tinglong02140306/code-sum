package com.iflytek.sgy.wjewt.controller;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.redis.DictDecode;
import com.iflytek.sgy.wjewt.service.IServiceEvent;
import com.iflytek.sgy.wjewt.service.IServiceYjncApply;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 一键挪车管理页面
 * Created by Administrator on 2018/1/16.
 */
@Controller
public class MoveCarManagerController {

    Logger logger = LoggerFactory.getLogger(MoveCarManagerController.class);


    @Autowired
    private IServiceYjncApply iServiceYjncApply;

    @Autowired
    private IServiceEvent iServiceEvent;

    @Autowired
    private ApplicationConstants applicationConstants;

    @Autowired
    private DictDecode dictDecode;


    /**
     * 主页管理页
     * @param model
     * @return
     */
    @RequestMapping(value = {"","/"},method = RequestMethod.GET)
    public String index(Model model){
        model.addAttribute("fdfsHttp", applicationConstants.getFDFS_HTTP());
        return "/page/remove-car-list";
    }
   
    /**
     * 通用页面跳转
     * @param model
     */
    @RequestMapping(value = "/page/*",method = RequestMethod.GET)
    public void page(Model model){
        model.addAttribute("fdfsHttp",applicationConstants.getFDFS_HTTP());
    }

    /**
     * 分页查询挪车申请记录
     *
     * @param page             分页条件
     * @param serviceYjncApply 查询条件
     * @return
     */
    @RequestMapping(value = "/apply/page")
    @ResponseBody
    public ResultMsg pageQuery(Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply) {
        Page<ServiceYjncApply> resultPage = iServiceYjncApply.pageQuery(page, serviceYjncApply);
        dictDecode.decode(resultPage.getRows());
        for (ServiceYjncApply apply:resultPage.getRows()){
            apply.init();
        }
        return ResultMsg.success(resultPage);
    }

    /**
     * 根据ID获取移车申请信息
     *
     * @param id 移车申请ID
     * @return
     */
    @RequestMapping("/apply/get")
    @ResponseBody
    public ResultMsg getApply(String id) {
        ServiceYjncApply apply = iServiceYjncApply.getApply(id);
        return ResultMsg.success(apply);
    }


    /**
     * 申请详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/apply/detail")
    @ResponseBody
    public ResultMsg getDetail(String id) {
        try {
            ServiceYjncApply serviceYjncApply = iServiceYjncApply.getApply(id);
            dictDecode.decode(serviceYjncApply);
            ServiceYjncTasks msgTask = iServiceEvent.getFirstSuccess(id, SysCode.EVENT_TYPE.SMS);
            dictDecode.decode(msgTask);
            ServiceYjncTasks telTask = iServiceEvent.getFirstSuccess(id, SysCode.EVENT_TYPE.TEL);
            dictDecode.decode(telTask);
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("msgTask", msgTask);
            result.put("telTask", telTask);
            result.put("applyInfo", serviceYjncApply);
            return ResultMsg.success("加载成功", result);
        } catch (Exception e) {
            logger.error("数据加载失败！", e);
            return ResultMsg.fail("加载失败", null);
        }
    }



}

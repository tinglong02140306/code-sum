package com.iflytek.sgy.wjewt.services.yjnc.controller;

import java.text.MessageFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.redis.UserApplyNumberCache;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncTasks;
import com.iflytek.sgy.wjewt.redis.DictDecode;
import com.iflytek.sgy.wjewt.redis.SysConfigCache;
import com.iflytek.sgy.wjewt.service.IServiceEvent;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.services.yjnc.domain.dto.WeixinOfficialAccountsConfig;
import com.iflytek.sgy.wjewt.services.yjnc.service.CarMoveBusinessService;
import com.iflytek.sgy.wjewt.services.yjnc.service.IBusinessUserService;
import com.iflytek.sgy.wjewt.services.yjnc.service.IWeixinOfficialAccountsService;

/**
 * 挪车申请业务控制器Controller
 * Created by Administrator on 2018/1/10.
 */
@Controller
public class ServiceApplyController {

    Logger logger = LoggerFactory.getLogger(ServiceApplyController.class);

    @Autowired
    private CarMoveBusinessService carMoveBusinessService;

    @Autowired
    private DictDecode dictDecode;


    @Autowired
    private SysConfigCache sysConfigCache;


    @Autowired
    private IBusinessUserService businessUserService;

    @Autowired
    private IServiceEvent iServiceEvent;

    @Autowired
    private ApplicationConstants applicationConstants;

    /**
     * 微信公众号
     */
    @Autowired
    private IWeixinOfficialAccountsService weixinOfficialAccountsService;

    @Autowired
    private UserApplyNumberCache userApplyNumberCache;

    /**
     * 首页
     *
     * @return
     */
    @RequestMapping(value = {"", "/", "/index"}, method = RequestMethod.GET)
    public String indexPage(Model model, HttpServletRequest request) {
        return "redirect:/h5/remove-car-app";
    }


    /**
     * 自定义错误页面
     * @param model
     * @param request
     * @return
     */
    @RequestMapping(value = "/error/*",method = RequestMethod.GET)
    public String error(Model model,HttpServletRequest request){
        String userAgent = request.getHeader("User-Agent");
        model.addAttribute("ua", userAgent);
        model.addAttribute("appurl", applicationConstants.downloadUrl);
        //微信浏览器单独处理
        if (userAgent != null && userAgent.contains("MicroMessenger")) {
            WeixinOfficialAccountsConfig weixinConfig = weixinOfficialAccountsService.getWeixinConfig();
            model.addAttribute("weixinConfig", weixinConfig);
            model.addAttribute("wxIndex", applicationConstants.wxIndex);
        }
        return request.getServletPath();
    }


    /**
     * userDetail的结构如下：
     * {
     * "userId":"sdfsdf-dsfsdf-334sdfsdf" ,  //用户ID
     * "name":"",//用户名
     * "fullName":"***",//全名
     * "nickname":"jack",     //昵称
     * "chineseSurname":"*",   //中文姓
     * "chineseName":"**",    //中文名
     * "spellSurname":"xing" ,   //拼音姓
     * "spellName":"xingxing",   //拼音名
     * "cardNum":"4423********2356",   //证件号码
     * "cardType":"111",   //证件类型（111:居民身份证。详细参考GA/T 517-2004）
     * "socialNum":"4423********2356",   //社保编号
     * "sex":1 ,    //性别 (0:女，1：男)
     * "rank":1，  //用户级别（0：匿名，1：注册，2：实名）
     * "realnameAuth":0,   //实名认证（0：未实名，1：实名认证）
     * "realnameAuthType":0,  //认证类型（0：未认证1：地市认证2：银行认证3：运营商认证）
     * "realnameAuthSource"："",  //认证源（车管所、移动、联通、电信、银联...）
     * "email":"**@163.com",  //邮件
     * "mobile":"137********",   //手机
     * "telephone":"010-*****",   //固话
     * "birthday":"1970-01-01",    //生日
     * "picture":"",     //头像
     * "description":"" ,   //描述
     * "nation":"01",   //民族（01:汉族。详细参考GB/T 3304-1991）
     * "education":"20",  //学历（20:大学本科,30:专科教育。详细参考GB/T 4658-2006）
     * "overseas":"",  //外籍（港澳台侨属(1:香港同胞亲属,2:澳门同胞亲属,3:台湾同胞亲属,4:海外侨胞亲属。详细参考GB-T 2261.5-2003)）
     * "marriage":"10",  //婚姻（10:未婚,20:已婚,30:离异,40:离婚,90:未说明的婚姻情况。详细参考 GB/T 2261.2-2003）
     * "international":"CHN",   //国籍（国籍(CHN:中国。详细参考国别代码)）
     * "regaddress":"",  //户籍
     * "curaddress":"",   //现住址,
     * "workuint":"",   //工作单位,
     * "homephone":"",   //家庭电话,
     * "rprType":"", //户籍类型（0:市内,1:省内市外,2:省外）,
     * "remark":"",  //备注,
     * "birthPlace":"",  //出生地
     * "bindlist":[
     * {
     * syscode:'wx',//绑定的第三方账号的CODE值
     * sysname:'微信',//绑定的第三账号的系统名称
     * sysuserid:'wx111111' //绑定的第三方账号的userid
     * }
     * ]
     * }
     */
    /**
     * 页面通用跳转
     */
    @RequestMapping(value = {"/h5/*"}, method = RequestMethod.GET)
    public String goPage(Model model, HttpServletRequest request){
        String sessionId = request.getRequestedSessionId();
        //获取用户信息
        logger.info("test-session[{}]页面控制器开始",sessionId);
        Map<String, Object> userInfo = businessUserService.getUserInfo(request);
        logger.info("test-session[{}]获取用户信息完成",sessionId);
        String userId = (String) userInfo.get("userId");
        //尝试获取id 参数，如果含id，进行用户所属权限检查，排除越权操作的可能
        String id = request.getParameter("id");
        logger.info("test-session[{}]开始检测非法操作",sessionId);
        if (StringUtils.isNotBlank(id) && !carMoveBusinessService.checkUserAccess(id,userId)){
            logger.info("test-session[{}]检测到非法操作的移车",sessionId);
            return "redirect:/h5/remove-car-app";
        }
        //如果为带挪车页面或者带评价页面，需要验证此申请是否已经完成
        if (StringUtils.equalsIgnoreCase(request.getServletPath(), "/h5/remove-car-evaluate") ||StringUtils.equalsIgnoreCase(request.getServletPath(), "/h5/pre-move-car")  ){
            logger.info("test-session[{}]开始检测未完成的挪车信息",sessionId);
            if (carMoveBusinessService.checkFinished(request.getParameter("id"))){
                logger.info("test-session[{}]检测到未完成的挪车信息",sessionId);
                return "redirect:/h5/remove-car-app";
            }
        }
       if (!StringUtils.equalsIgnoreCase(request.getServletPath(), "/h5/remove-car-evaluate")) {
            //判断用户是否有待评价的申请
           logger.info("test-session[{}]检测是否含有带评价",sessionId);
            String evaluatingId = carMoveBusinessService.hasEvaluating(userId);
            logger.info("test-session[{}]带评价检测结果 {}",sessionId,evaluatingId);
            if (StringUtils.isNotBlank(evaluatingId)) {
                return "redirect:/h5/remove-car-evaluate?id=" + evaluatingId + "&redirect=true";
            }

            //带挪车页面与带评价页面不执行判断重定向，避免异常数据导致重定向死循环
            if (!StringUtils.equalsIgnoreCase(request.getServletPath(), "/h5/pre-move-car")) {
                //判断用户是否有待挪车的申请
                logger.info("test-session[{}]检测是否含有待挪车申请",sessionId);
                String applyingId = carMoveBusinessService.hasApplying(userId);
                logger.info("test-session[{}]带挪车申请检测结果{}",sessionId,applyingId);
                if (StringUtils.isNotBlank(applyingId)) {
                    return "redirect:/h5/pre-move-car?id=" + applyingId + "&redirect=true";
                }
            }
        }

        logger.info("test-session[{}]开始加载初始化数据",sessionId);
        Map<String, String> map = sysConfigCache.getConfigs();
        logger.info("test-session[{}]配置缓存获取完成",sessionId);
        Iterator<Map.Entry<String, String>> iterator = map.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            model.addAttribute(entry.getKey(), entry.getValue());
        }
        logger.info("test-session[{}]配置缓存处理完成",sessionId);
        model.addAttribute("applyNumber", businessUserService.getCurrentUserApplyNumber(request));
        logger.info("test-session[{}]用户申请次数缓存加载完成",sessionId);
        Object object = userInfo.get("name");
        model.addAttribute("userId", userId);
        model.addAttribute("userName", (object != null) ? (String) object : "");
        model.addAttribute("user", userInfo);
        model.addAttribute("FDFS_HTTP", applicationConstants.getFDFS_HTTP());
        String userAgent = request.getHeader("User-Agent");
        model.addAttribute("ua", userAgent);
        model.addAttribute("server_timestap", new Date().getTime());
        model.addAttribute("appurl", applicationConstants.downloadUrl);
        //微信浏览器单独处理
        if (userAgent != null && userAgent.contains("MicroMessenger")) {
            WeixinOfficialAccountsConfig weixinConfig = weixinOfficialAccountsService.getWeixinConfig();
            model.addAttribute("weixinConfig", weixinConfig);
            model.addAttribute("wxIndex", applicationConstants.wxIndex);
        }
        logger.info("test-session[{}]初始化数据加载完成",sessionId);
        return request.getServletPath();
    }


    /**
     * 提交挪车申请
     *
     * @param serviceYjncApply
     * @return
     */
    @RequestMapping(value = "/apply/submit", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg submitApply(ServiceYjncApply serviceYjncApply,HttpServletRequest request) {
        //验证服务生效时间
        ResultMsg res = checkServiceStatus();
        if (res.isFlag()) {
            //提交申请
            return carMoveBusinessService.submitApply(serviceYjncApply,request);
        } else {
            return res;
        }
    }

    /**
     * 分页查询挪车申请记录
     *
     * @param page             分页条件
     * @param serviceYjncApply 查询条件
     * @return
     */
    @RequestMapping(value = "/apply/page", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg pageQuery(Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply) {
        Page resultPage = carMoveBusinessService.pageQuery(page, serviceYjncApply);
        dictDecode.decode(resultPage.getRows());
        return ResultMsg.success(resultPage);
    }

    /**
     * 我的移车记录
     */
    @RequestMapping(value = "/apply/record", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg recordPage(Page<ServiceYjncApply> page,HttpServletRequest request) {
        ServiceYjncApply serviceYjncApply = new ServiceYjncApply();
        String userId = businessUserService.getCurrentUserId(request);
        serviceYjncApply.setApplyerUserId(userId);
        Page resultPage = carMoveBusinessService.pageQuery(page, serviceYjncApply);
        dictDecode.decode(resultPage.getRows());
        return ResultMsg.success(resultPage);
    }


    /**
     * 提交评价
     *
     * @return
     */
    @RequestMapping(value = "/apply/evaluate", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg evaluate(ServiceYjncApply apply,HttpServletRequest request) {
        //校验参数
        Assert.isTrue(StringUtils.length(apply.getDriverAttitudeRank())==1);
        Assert.isTrue(StringUtils.length(apply.getDriverSpeedRank()) == 1);
        Assert.isTrue(SysCode.RANK_VALUE.contains(apply.getDriverAttitudeRank()));
        Assert.isTrue(SysCode.RANK_VALUE.contains(apply.getDriverSpeedRank()));

        if (!checkUserAccess(apply.getId(),request)){
            return ResultMsg.fail("您没有权限执行此操作，请确认是否含有非法行为！",null);
        }
        return carMoveBusinessService.evaluate(apply);
    }


    /**
     * 移车申请完成，包括 成功、失败、取消 状态的改变
     *
     * @param id 申请ID
     * @return
     */
    @RequestMapping(value = "/apply/finish", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg finish(String id,HttpServletRequest request) {
        Assert.hasText(id,"申请ID不能为空！");
        if (!checkUserAccess(id,request)){
            return ResultMsg.fail("您没有权限执行此操作，请确认是否含有非法行为！",null);
        }
        logger.debug("设置挪车状态：id={},status={}", id, SysCode.MOVE_STATUS.EVALUATING);
        return carMoveBusinessService.finish(id, SysCode.MOVE_STATUS.EVALUATING,request);
    }


    /**
     * 催一催
     *
     * @param id 申请ID
     * @return
     */
    @RequestMapping(value = "/apply/press", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg pressApply(String id,HttpServletRequest request) {
        if (!checkUserAccess(id,request)){
            return ResultMsg.fail("您没有权限执行此操作，请确认是否含有非法行为！",null);
        }
        return carMoveBusinessService.pressApply(id);
    }


    /**
     * 根据ID获取移车申请信息
     *
     * @param id 移车申请ID
     * @return
     */
    @RequestMapping(value = "/apply/get", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg getApply(String id,HttpServletRequest request) {
        if (!checkUserAccess(id,request)){
            return ResultMsg.fail("您没有权限执行此操作，请确认是否含有非法行为！",null);
        }
        ServiceYjncApply apply = carMoveBusinessService.getApply(id);
        apply.setDriverMobile(null);
        apply.setDriverName(null);
        return ResultMsg.success(apply);
    }


    /**
     * 申请详情
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/apply/detail", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg getDetail(String id,HttpServletRequest request) {
        if (!checkUserAccess(id,request)){
            return ResultMsg.fail("您没有权限执行此操作，请确认是否含有非法行为！",null);
        }
        try {
            ServiceYjncApply serviceYjncApply = carMoveBusinessService.getApply(id);
            serviceYjncApply.setDriverMobile(null);
            serviceYjncApply.setDriverName(null);
            dictDecode.decode(serviceYjncApply);
            ServiceYjncTasks task = iServiceEvent.getFirstSuccess(id, SysCode.EVENT_TYPE.SMS);
            dictDecode.decode(task);
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("tasks", task);
            result.put("applyInfo", serviceYjncApply);
            return ResultMsg.success("加载成功", result);
        } catch (Exception e) {
            logger.error("数据加载失败！", e);
            return ResultMsg.fail("加载失败", null);
        }
    }


    /**
     * 接收电话状态推送数据
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/apply/receive")
    @ResponseBody
    public ResultMsg receive(HttpServletRequest request) {
        String str = request.getParameter("data");
        System.out.println("接收回调：" + str);
        if (StringUtils.isNotBlank(str)) {
            JSONObject object = JSONObject.parseObject(str);
            carMoveBusinessService.insertDialState(object.getString("out_uid"), object.getString("caller_answer"));
        } else {
            return ResultMsg.fail("接收data参数为空", null);
        }
        return ResultMsg.success("接收成功", null);
    }


    /**
     * 检查服务生效时间
     *
     * @return
     */
    private ResultMsg checkServiceStatus() {
        Calendar current = Calendar.getInstance();
        Calendar beginCalendar = Calendar.getInstance();
        Calendar endCalendar = Calendar.getInstance();

        String beginConfig = sysConfigCache.getConfig("SERVICE_BEGIN");
        String[] beginTime = beginConfig.split(":");
        beginCalendar.set(Calendar.HOUR_OF_DAY, Integer.valueOf(beginTime[0]));
        beginCalendar.set(Calendar.MINUTE, Integer.valueOf(beginTime[1]));
        beginCalendar.set(Calendar.SECOND, 0);
        String endConfig = sysConfigCache.getConfig("SERVICE_END");
        String[] endTime = endConfig.split(":");
        endCalendar.set(Calendar.HOUR_OF_DAY, Integer.valueOf(endTime[0]));
        endCalendar.set(Calendar.MINUTE, Integer.valueOf(endTime[1]));
        endCalendar.set(Calendar.SECOND, 59);

        if (current.compareTo(beginCalendar) >= 0 && current.compareTo(endCalendar) <= 0) {
            return ResultMsg.success(null);
        } else {
            return ResultMsg.fail(MessageFormat.format("当前时间段不在服务时间范围内\n(服务提供时间为每天 {0}:{1}-{2}:{3})", beginCalendar.get(Calendar.HOUR_OF_DAY), beginCalendar.get(Calendar.MINUTE), endCalendar.get(Calendar.HOUR_OF_DAY), endCalendar.get(Calendar.MINUTE)), null);
        }
    }

    /**
     * 验证指定申请ID是否属于当前用户
     * @param id
     *      申请ID
     * @return
     */
    private boolean checkUserAccess(String id,HttpServletRequest request) {
        //获取用户信息
        String userId = businessUserService.getCurrentUserId(request);
        return StringUtils.isBlank(id) || carMoveBusinessService.checkUserAccess(id, userId);
    }
}

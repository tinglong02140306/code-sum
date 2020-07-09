package com.iflytek.sgy.wjewt.web.controller;

import javax.servlet.http.HttpServletRequest;

import com.iflytek.sgy.wjewt.service.impl.RequestRecordService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.iflytek.sgy.social.uop.api.dto.WeixinOfficialAccountsConfig;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.util.WeixinOfficialAccountsService;

@Controller
public class JspDispatchController {
    /**
     * 微信公众号
     */
    @Autowired
    private WeixinOfficialAccountsService weixinOfficialAccountsService;
    
	/**
	 * 系统配置
	 */
	@Autowired
	private ApplicationConfig config;

	@Autowired
	private RequestRecordService requestRecordService;
	
	/**
	 * 
	 * 页面跳转统一
	 * 
	 * @param model model
	 * @return Model
	 */
	@RequestMapping(value = {"/*.do", "/**/*.do"})
	public Model goPage(Model model,HttpServletRequest request) {
		requestRecordService.record(request);
		return model;
	}
	
	/**
	 * 
	 * 默认跳转首页
	 */
	@RequestMapping(value = "")
	public String index(HttpServletRequest request) {
		if(StringUtils.endsWith(request.getServletPath(), "/")){
			return request.getServletPath() + "index";
		}
		return request.getServletPath() + "/index";
	}
	
	/**
	 * 
	 * 默认跳转frameset
	 */
	@RequestMapping(value = "/")
	public String frameset(HttpServletRequest request) {
		return "redirect:/frameset.do";
	}
	
	/**
	 *  ｛页面跳转｝
	 *  @param model
	 *  @return String
	 *  @author  xfzhu3
	 *  @created 2018年4月20日 上午9:02:46
	 *  @lastModified       
	 *  @history           
	 */
	@RequestMapping(value = {"/h5/news-list"}, method = RequestMethod.GET)
	public void goPageNewList(Model model, HttpServletRequest request){
		 String userAgent = request.getHeader("User-Agent");
		 model.addAttribute("ua", userAgent);
		//微信浏览器单独处理
        if (userAgent != null && userAgent.contains("MicroMessenger")) {
            WeixinOfficialAccountsConfig weixinConfig = weixinOfficialAccountsService.getWeixinConfig();
            model.addAttribute("weixinConfig", weixinConfig);
            model.addAttribute("wxIndex", config.wxIndex);
        }
	}
	
}

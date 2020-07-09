package com.iflytek.sgy.wjewt.web.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.social.prise.api.PriseService;
import com.iflytek.sgy.social.prise.api.model.PriseVo;
import com.iflytek.sgy.social.uop.api.dto.Result;
import com.iflytek.sgy.social.user.api.UserService;
import com.iflytek.sgy.social.user.api.exceptions.UserException;
import com.iflytek.sgy.social.utils.UUIDUtils;
import com.iflytek.sgy.wjewt.base.BaseController;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.util.HttpUtil;
 

/**
 * 资讯controller
 * 
 * @desc: cip-portal
 * @author: admin4
 * @createTime: 2016年8月1日 下午6:16:28
 * @history:
 * @version: v1.0
 */
@Controller
@RequestMapping(value = "/prise", method = RequestMethod.POST)
public class PriseController extends BaseController {
	/**
	* 点赞service
	*/
	@Autowired
	private PriseService priseService;
	
	/**
	* 用户服务
	*/
	@Autowired
	private UserService userService;
	/**
	* TODO
	*/
	@Autowired
	private ApplicationConfig config;
	
	/**
	* 点赞
	* @author: yanzhang9
	* @createTime: 2016年11月2日 下午2:46:10
	* @param token 用户token
	* @param deviceId 设备id
	* @param objId 被点赞对象id
	* @return String
	*/
	@ResponseBody
	@RequestMapping("/doPrise")
	public Result doPrise( String token, String objId, HttpServletRequest request,HttpServletResponse response){
		//用户id
		String userId = null;
		if(StringUtils.isNotEmpty(token)){
			userId = getUserIdByToken(token);
		}else{
			userId = getCookie(request, response);
		}
		PriseVo prise = new PriseVo();
		prise.setUserId(userId);
		prise.setObjId(objId);
		prise.setPriseDate(new Date());
		long sum = 0L;
		try {
			//获取点赞用户是否有过点赞信息
			PriseVo priseInfo = priseService.findPriseByUserIdAndObjId(userId, objId);
			sum = priseService.findPriseCountByObjId(objId);
			if(priseInfo==null){
				String result = priseService.doPrise(prise);
				if(StringUtils.isNotEmpty(result)){
					sum = priseService.findPriseCountByObjId(objId);
				}
			}
		} catch (Exception e) {
			logger.error("调用点赞接口失败！", e);
		}
		return Result.success(sum);
	}
	
	/**
	* 取消点赞
	* @author: yanzhang9
	* @createTime: 2016年11月2日 下午3:01:32
	* @param token 用户token
	* @param deviceId 设备id
	* @param objId 被点赞对象id
	* @return boolean
	*/
	@ResponseBody
	@RequestMapping("/cancelPrise")
	public Result cancelPrise(String token,String objId,HttpServletRequest request, HttpServletResponse response){
		//用户id
		String userId = null;
		if(StringUtils.isNotEmpty(token)){
			userId = getUserIdByToken(token);
		}else{
			userId = getCookie(request, response);
		}
		
		PriseVo prise = new PriseVo();
		prise.setUserId(userId);
		prise.setObjId(objId);
		boolean result = false;
		long sum = -1L;
		try {
			//获取点赞用户是否有过点赞信息
			PriseVo priseInfo = priseService.findPriseByUserIdAndObjId(userId, objId);
			sum = priseService.findPriseCountByObjId(objId);
			if(priseInfo!=null){
				result = priseService.cancelPriseByUserIdAndObjId(prise);
				if(result){
					sum = priseService.findPriseCountByObjId(objId);
				}
			}
		} catch (Exception e) {
			logger.error("取消点赞接口调用失败！", e);
		}
		return Result.success(sum);
	}
	
	/**
	* 获取被点赞对象点赞数
	* @author: yanzhang9
	* @createTime: 2016年11月2日 下午4:43:12
	* @param objId 被点赞对象id
	* @return long
	*/
	@ResponseBody
	@RequestMapping("/getPriseCount")
	public Result getPriseCount( String objId,String osType){
		long count = 0L;
		try {
			count = priseService.findPriseCountByObjId(objId);
		} catch (Exception e) {
			logger.error("获取点赞数接口失败！", e);
		}
		return Result.success(count);
	}
	
	/**
	* 从cookie中取随机生成的用户id
	* @author: yanzhang9
	* @createTime: 2016年11月3日 上午11:11:39
	* @param request
	* @param response
	* @param userId
	* @return String
	*/
	private String getCookie(HttpServletRequest request,HttpServletResponse response) {
		String userId = null;
		if(request.getCookies()!=null){  // 如果Cookie不为空
			 for(Cookie cookie :request.getCookies()){  // 遍历Cookie
				 if(cookie.getName().equals("userIdPrise"))  // 如果Cookie名为userIdPrise
					 userId = cookie.getValue();       // 保存userId内容
			 }
		}
		if(StringUtils.isBlank(userId)){
			userId = UUIDUtils.getUUID();//随机生成用户id并存入cookie
			Cookie cookie = new Cookie("userIdPrise", userId);
			cookie.setPath("/");
			response.addCookie(cookie);
		}
		return userId;
	}
	/**
	*
	* @author: admin4
	* @createTime: 2017年11月18日 下午4:25:08
	* @history:
	* @param token
	* @return String
	*/
	 String getUserIdByToken(String token){
			Map<String, String> params=new HashMap<String, String>();
			params.put("Authorization", "Bearer"+token);
			String result="";
			try {
		       result=	HttpUtil.doGet(config.getGETUSERID_URL(), params);
			} catch (Exception e) {
				logger.error("调用获取登录用户接口失败：");
				 throw new UserException("用户未登录或token失效");
			}
			JSONObject res=JSONObject.parseObject(result);
		    if(res!=null&&res.getBooleanValue("flag")){
		   	JSONObject json=(JSONObject) res.get("data");
		   	String userId=json.getString("id");
		   	return userId==null?null:userId.replace("-", "");
		    }
		  return null;
		}
}

package com.iflytek.sgy.wjewt.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.social.uop.api.CollectionService;
import com.iflytek.sgy.social.uop.api.dto.CollectionDto;
import com.iflytek.sgy.social.uop.api.dto.Result;
import com.iflytek.sgy.social.user.api.UserService;
import com.iflytek.sgy.social.user.api.exceptions.UserException;
import com.iflytek.sgy.social.utils.StringUtils;
import com.iflytek.sgy.wjewt.base.BaseController;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.util.HttpUtil;
 

 
@Controller
@RequestMapping(value = "/collection", method = RequestMethod.POST)
public class CollectionController extends BaseController {
	/**
	 * 收藏服务
	 */
	@Autowired
	private CollectionService collectionService;
/**
* 用户服务
*/
	@Autowired
     private UserService userService;
	/**
	* 系统配置
	*/
	@Autowired
	private ApplicationConfig config;

	/**
	*收藏资讯保存
	* @author: admin4
	* @createTime: 2017年11月13日 下午10:00:52
	* @history:
	* @param dto void
	*/
	@ResponseBody
	@RequestMapping("/saveCollection")
	public Result saveCollection(String resId,String token){
		if(StringUtils.isNotEmpty(resId)&&StringUtils.isNotEmpty(token)){   
			CollectionDto dto=new CollectionDto();
		    String userId=getUserIdByToken(token);
		    dto.setUserId(userId);
		    dto.setResId(resId);
			collectionService.saveCollection(dto); 
		}
		return Result.success(null);
	}
	
	 
	 
	/**
	*取消收藏
	* @author: admin4
	* @createTime: 2017年11月15日 下午3:19:01
	* @history:
	* @param resId 资讯id
	* @param token void
	*/
	@ResponseBody
	@RequestMapping("/cancelCollection")
	public Result cancelCollection( String resId,String token){
		if(StringUtils.isNoneEmpty(resId)){
			String[] idList=resId.split(",");
			  String userId=getUserIdByToken(token);
			collectionService.cancel(idList,userId);
		}
		return Result.success(null);
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

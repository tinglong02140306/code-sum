package com.iflytek.sgy.wjewt.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iflytek.sgy.social.uop.api.dto.workProject.DetailsDto;
import com.iflytek.sgy.social.uop.api.dto.workProject.SzwGuideDto;
import com.iflytek.sgy.social.uop.api.workProject.WorkProjecService;
import com.iflytek.sgy.wjewt.base.BaseController;

/**
 * {指南H5站点controller}
 * 
 * @author xfzhu3
 * @created 2017年12月26日 下午8:52:22
 * @lastModified
 * @history
 */
@Controller
@RequestMapping(value = "/guide", method = RequestMethod.POST)
public class GuideController extends BaseController {
	/**
	 * 办事大厅接口
	 */
	@Autowired
	private WorkProjecService workProjecService;

	/**
	 *  ｛根据id获取办事指南详情信息(南威)｝
	 *  @param uuid 办事指南id
	 *  @return DetailsDto 返回值
	 *  @author  xfzhu3
	 *  @created 2017年12月27日 上午8:48:04
	 *  @lastModified       
	 *  @history           
	 */
	@ResponseBody
	@RequestMapping("/getGuideDetailsById")
	public DetailsDto getGuideDetailsById(String uuid){
		return workProjecService.getGuideDetailsById(uuid);
	}
	
	/**
	 *  ｛根据id获取办事指南详情信息(省政务)｝
	 *  @param id 省政务指南id
	 *  @return List<SzwGuideDto> 返回值
	 *  @author  xfzhu3
	 *  @created 2017年12月28日 下午4:44:05
	 *  @lastModified       
	 *  @history           
	 */
	@ResponseBody
	@RequestMapping("/getSzwGuideDetailsById")
	public SzwGuideDto getSzwGuideDetailsById(String id){
		return workProjecService.getSzwGuideDetailsById(id);
	}
}

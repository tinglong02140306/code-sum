package com.iflytek.sgy.wjewt.web.controller;

import java.util.List;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iflytek.sgy.social.uop.api.dto.Result;
import com.iflytek.sgy.social.uop.api.dto.Service;
import com.iflytek.sgy.social.uop.api.dto.ServiceAndroidDetail;
import com.iflytek.sgy.social.uop.api.dto.ServiceIOSDetail;
import com.iflytek.sgy.wjewt.base.BaseController;
import com.iflytek.sgy.wjewt.constant.Constants;
import com.iflytek.sgy.wjewt.constant.TerminalType;

@Controller
@RequestMapping(value = "/service", method = RequestMethod.POST)
public class ServiceController extends BaseController {
	/**
	 * 服务service api
	 */
	@Autowired
	private com.iflytek.sgy.social.uop.api.ServiceService serviceService;

	/**
	*根据频道名称获取频道关联的服务列表
	* @author: admin4
	* @createTime: 2017年11月16日 下午7:40:31
	* @history:
	* @param areaId
	* @param osType
	* @param name 频道名称
	* @return List<Service>
	*/
	@RequestMapping(value = "/getChannelServiceList", method = RequestMethod.GET)
	@ResponseBody
	public Result channelServiceList(String areaId, String osType, String name) {
		//获取终端类型
		String terminalId = TerminalType.getCode(osType);
		List<Service> list = serviceService.getChannelServiceList(areaId,terminalId,name);
		for (Service service : list) {
			if(Constants.TERMINAL_CODE_ANDROID.equals(osType)){
				ServiceAndroidDetail detail = serviceService
						.getServiceAndroidDetail(service.getId());
				detail.setServiceName(service.getServiceName());
				service.setAndroidDetail(detail);	
			}
			if(Constants.TERMINAL_CODE_IOS.equals(osType)){
				try {
					ServiceIOSDetail detail = serviceService.getServiceIOSDetail(service.getId());
					detail.setServiceName(service.getServiceName());
					ServiceAndroidDetail androidDetail = new ServiceAndroidDetail();
					BeanUtilsBean.getInstance().getConvertUtils().register(false, false, 0);
					BeanUtils.copyProperties(androidDetail, detail);
					service.setAndroidDetail(androidDetail);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return Result.success(list);
	}
}

package com.iflytek.sgy.wjewt.web.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iflytek.sgy.social.api.Result;
import com.iflytek.sgy.social.uop.api.dto.pay.PayRequestDto;
import com.iflytek.sgy.social.uop.api.dto.pay.PaySucessInfoDto;
import com.iflytek.sgy.social.uop.api.dto.pay.QueryResultForWebDto;
import com.iflytek.sgy.social.uop.api.dto.pay.QueryUrlResultDto;
import com.iflytek.sgy.social.uop.api.pay.NewPayService;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.exception.ErrorEnum;


/** 
 * @Description: 支付控制层
 * @ClassName: NewPayController 
 * @author zhangniu
 * @date 2017年9月26日 下午4:53:49  
 */
@Controller
@RequestMapping(value = "/newPay")
public class NewPayController {
	private Logger logger = Logger.getLogger(NewPayController.class);
	@Autowired
	private NewPayService payService;
	@Autowired
	private ApplicationConfig config;

	/** 
	 * TODO(这里用一句话描述这个方法的作用) 
	 * @Title: queryPrePayInfo 
	 * @param pinCode
	 * @return 设定文件 
	 * @return QueryResultDto    返回类型 
	 * @lastModify 2018年5月15日
	 */
	@ResponseBody
    @RequestMapping(value="/queryPrePayInfo", method = RequestMethod.POST)
	public QueryResultForWebDto queryPrePayInfo(String pinCode) {
		PayRequestDto payRequestDto = new PayRequestDto();
		payRequestDto.setPayCode(pinCode);
		QueryResultForWebDto payResultDto = this.payService.queryPayCodeDetail(pinCode,SysCode.QUERY_STATUS);
		return payResultDto;
	}
	
	/** 
	 * 获取请求支付URL
	 * @Title: doPay 
	 * @param pinCode
	 * @return String    返回类型 
	 * @lastModify 2018年5月16日
	 */
	@ResponseBody
    @RequestMapping(value="/doPay", method = RequestMethod.POST)
	public QueryUrlResultDto doPay(String pinCode, String payType) {
		QueryUrlResultDto dto = this.payService.doPay(pinCode, payType);
		return dto;
	}
	
	/** 
	 * 支付成功页面跳转 
	 * @Title: cashier 
	 * @param orderNo 订单号
	 * @param model 页面
	 * @return String    返回类型 
	 * @lastModify 2017年9月29日
	 */
	@ResponseBody
    @RequestMapping(value="/cashier", method = RequestMethod.POST)
	public PaySucessInfoDto cashier(String pinCode) {
		PaySucessInfoDto infoDto = new PaySucessInfoDto();
		infoDto = this.payService.getSucessPageInfo(pinCode);
		return infoDto;
	}
	
	/** 
	 * 支付成功页面跳转 
	 * @Title: cashier 
	 * @param orderNo 订单号
	 * @param model 页面
	 * @return String    返回类型 
	 * @lastModify 2017年9月29日
	 */
	@ResponseBody
    @RequestMapping(value="/scanDeal", method = RequestMethod.POST)
	public Result scanDeal(String content) {
		if(!"1".equals(config.sacanDealFlg)) {
			return Result.fail(123,ErrorEnum.QR_CODE_ERROR.getMessage());
		}
		logger.info("接受参数content="+content);
		if(StringUtils.isEmpty(content)) {
			Result.fail(123,ErrorEnum.QR_CODE_NULL.getMessage());
		}
		String pattern = config.payCodePattern;
		Pattern r = Pattern.compile(pattern);
		Matcher m = r.matcher(content);
		if(m.matches()) {
			return Result.success(config.paySuccessJumpUrl+content);
		} else {
			return Result.fail(123,ErrorEnum.QR_CODE_ERROR.getMessage());
		}
	}
}

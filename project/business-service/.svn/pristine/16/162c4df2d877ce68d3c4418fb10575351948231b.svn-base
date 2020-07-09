package com.iflytek.sgy.wjewt.services.yjnc.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import bingo.jmt.client.web.common.ClientConfigPlaceHolder;

import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.domain.dto.DriverInfo;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.services.yjnc.service.IDriverInfoService;

/**
 * Created by Administrator on 2018/1/12.
 */
@Service
public class DirverInfoServiceImpl implements IDriverInfoService {
	private static Logger logger = LoggerFactory.getLogger(DirverInfoServiceImpl.class);
	
	@Autowired
	private ApplicationConstants config;
	
	@Autowired
    private RestTemplate restTemplate;
	
    /**
     * 根据车牌号码查、车牌类型询车主信息
     *
     * @param plateNum  车牌号码
     * @param plateType 车牌类型
     * @return
     */
    @Override
    public DriverInfo getDriverInfo(String plateNum, String plateType) {
        //TODO 查询本地用户库以及对接交管接口 获取对应车牌号和车牌类型 的车主信息
    	Assert.hasText(plateNum, "车牌号码不能为空");
    	Assert.hasText(plateType, "车牌类型不能为空");
    	Assert.isTrue(plateNum.length() > 3, "车牌号码格式有误");

//    	DriverInfo driverInfo = new DriverInfo("李亚","13866131067");
    	DriverInfo driverInfo = getDriverInfoFromWjewt(plateNum, plateType);

        return driverInfo;
    }
    
    /**
     * 从皖警e网通获取车辆信息
     * @param plateNum 车牌号
     * @param plateType 车牌类型
     * @return
     */
    private DriverInfo getDriverInfoFromWjewt(String plateNum, String plateType){
    	logger.debug("调用驾驶人信息....{} {}",plateNum,plateType);
    	LinkedMultiValueMap<String, Object> requestParams = new LinkedMultiValueMap<>();
		requestParams.add("hpzl", plateType);
		requestParams.add("hphm", plateNum);
		
		// 发送短信并查看结果
		String resourceUri = "/sdk/userInfoByCarInfo";
		ClientConfigPlaceHolder.getClientConfig().setAppCode(config.CLIENT_ID);
		String signatureUrl = ClientConfigPlaceHolder.signatureUrl(resourceUri, requestParams.toSingleValueMap());
		
		String requestUrl = ClientConfigPlaceHolder.getClientConfig().getJmtServiceEndPoint() + signatureUrl;
		HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestParams, null);
		JSONObject result = restTemplate.postForObject(requestUrl, requestEntity, JSONObject.class);
		logger.debug("请求皖警e网通车辆接口的返回报文：{}", result);
		if (result.getInteger("code") == 1 && result.getJSONArray("data") != null) {
			JSONObject resultObject = result.getJSONArray("data").getJSONObject(0);
			// 发送成功
			DriverInfo driver = new DriverInfo();
			driver.setMobile(resultObject.getString("phone"));
			driver.setName(resultObject.getString("name"));
			return driver;
		}
		return null;
    }
    
//    /**
//     * 从交管e点通获取车辆信息
//     * @param plateNum 车牌号
//     * @param plateType 车牌类型
//     * @return
//     */
//	private DriverInfo getDriverInfoFromEdt(String plateNum, String plateType){
//    	EdtQuery query = new EdtQuery();
//    	//发证机关
//    	String fzjg = StringUtils.substring(plateNum, 0, 2);
//    	String hphm = StringUtils.substring(plateNum, 1);
//    	query.setHphm(hphm);
//    	query.setFzjg(fzjg);
//    	query.setHpzl(plateType);
//    	query.setSn(config.edtSn);
//    	try {
//    		String queryString = JSON.toJSONString(query);
//    		logger.debug("交管e点通请求报文:{}", queryString);
//			String edtResult = edtVipService.getTrffInfo(queryString);
//			logger.debug("交管e点通返回报文:{}", edtResult);
//			JSONObject resultJson = JSON.parseObject(edtResult);
//			if (resultJson == null) {
//				return null;
//			}
//			String code = resultJson.getString("Code");
//			if ("0".equals(code) ) { //code为0说明成功
//				JSONObject message = resultJson.getJSONObject("Message");
//				if (message != null) {
//					DriverInfo driver = new DriverInfo();
//					driver.setMobile(message.getString("SJHM"));
//					driver.setName(message.getString("SYR"));
//					return driver;
//				}
//			} else {//提示失败原因
//				logger.warn("获取交管e点通数据出错，错误原因：{}", resultJson.getString("Message"));
//				throw new YjncException(ErrorEnum.LOAD_ERROR, "获取机动车信息出错");
//			}
//		} catch (RemoteException e) {
//			logger.warn("请求交管e点通出错", e);
//		}
//    	return null;
//    }
}

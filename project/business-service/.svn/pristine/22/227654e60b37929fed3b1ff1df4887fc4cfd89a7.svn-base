package com.iflytek.sgy.wjewt.services.base;

import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 提示语转换
 * Created by Administrator on 2018/1/25.
 */
public class MessageConvert {

  private   static Map<String,String> SMS_REASON = new HashMap<String,String>();

  static {
      SMS_REASON.put("1","挡道，请挪车");
      SMS_REASON.put("2","车门窗灯未关");
      SMS_REASON.put("3","违规停车，请挪车");
      SMS_REASON.put("4","需紧急挪车，请速来");
  }


    /**
     * 获取短信挪车原因提示
     * @param code
     * @return
     */
  public static String getSmsReasonText(String code){
      String msg = SMS_REASON.get(code);
      return StringUtils.isNotBlank(msg)?msg:"需要挪车";
  }

}

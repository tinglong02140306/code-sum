package com.iflytek.sgy.wjewt.base;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

/**
 * 系统用常量编码
 * Created by Administrator on 2018/1/10.
 */
public class SysCode {

    public static final String applyTaskQueue = "apply.task.queue";

    /**
     * 通用字典缓存
     */
    public static final  String DICT_CACHE_PREFIX = "dict-cache:";

    /**
     * 系统配置字典缓存
     */
    public static final String SYSCONFIG_CACHE_PREFIX="sysconfig-cache";

    /**
     * 用户当日申请次数缓存
     */
    public static final String USERAPPLY_CACHE_PREFIX="user-apply-num:";

    /**
     * 日期格式
     */
    public static interface DATE_FORMATTER{

        /**
         * 完整日期+时间类型
         */
        public static final DateFormat FORMATTER_L = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        /**
         * 日期类型
         */
        public static final DateFormat FORMATTER_S = new SimpleDateFormat("yyyy-MM-dd");

        /**
         * 精确到分的时间类型
         */
        public static final DateFormat FORMATTER_M = new SimpleDateFormat("yyyy-MM-dd HH:mm");


    }

    /**
     * 字典有效性
     */
    public static interface DICT_ENABLE{

        /**
         * 有效
         */
        public static final String ENABLED = "1";

        /**
         * 无效
         */
        public static final String DISABLED = "0";

    }

    /**
     * 字典是否
     */
    public static interface YES_NO{

        /**
         * 是
         */
        public static final String YES = "1";

        /**
         * 否
         */
        public static final String NO = "0";

    }


    /**
     * 移车状态
     */
    public static interface MOVE_STATUS{

        /**
         * 待移车
         */
        public static final String WATING = "1";

        /**
         * 移车成功
         */
        public static final String SUCCESS = "2";

        /**
         * 移车失败
         */
        public static final String FAIL = "3";

        /**
         * 待评价
         */
        public static final String EVALUATING = "4";

    }

    /**
     * 删除状态
     */
    public static interface DELETE_STATE{

        /**
         * 已删除
         */
        public static final String DELETED = "1";

        /**
         * 未删除
         */
        public static final String UNDELETED = "0";

    }

    /**
     * 事件结果状态
     */
    public static interface EVENT_STATUS{

        /**
         * 成功
         */
        public static final String SUCCESS = "1";

        /**
         * 失败
         */
        public static final String FAIL = "2";

    }
      /**
     * 事件类型
     */
    public static interface EVENT_TYPE{

        /**
         * 短信
         */
        public static final String SMS = "1";

        /**
         * 电话
         */
        public static final String TEL = "2";

          /**
           * 消息推送
           */
          public static final String MSG = "3";

          /**
           * 中间状态，待拨打
           */

        public static final String TEMP_STATE = "9";

          /**
           * 中间状态，已拨打一次
           */

          public static final String DIALED = "8";
      }


    /**
     * 通用字典类型
     */
    public static interface DICT_TYPE{

        /**
         * 车牌类型
         */
        public static final String PLATE_TYPE = "PLATE_TYPE";

        /**
         * 移车原因
         */
        public static final String REASON_TYPE = "REASON_TYPE";

        /**
         * 移车状态
         */
        public static final String MOVE_STATUS = "MOVE_STATUS";

        /**
         * 评价等级
         */
        public static final String EVALUATE_LEVEL = "EVALUATE_LEVEL";

        /**
         * 申请来源
         */
        public static final String APPLY_SOURCE = "APPLY_SOURCE";

        /**
         * 通知事件类型
         */
        public static final String  EVENT_TYPE = "EVENT_TYPE";

        /**
         * 通知事件结果状态
         */
        public static final String  EVENT_STATUS = "EVENT_STATUS";


    }

    /**
     * 评价域值
     */
    public static final List<String> RANK_VALUE = Arrays.asList("1","2","3");


    //移动端设备类型 0：Android  1：IOS
    public static interface DVC_TYPE{
        String ANDROID = "0";
        String ANDROID_APPID="Android";
        String IOS = "1";
        String IOS_APPID="IOS";
    }

    //消息类型 （私信：0 ，通知：1， 短信：2， 推送：3 ，邮件：4）
    public interface MsgType{
        String NOTICE = "1";
        String SMS = "2";
        String APP_PUSH = "3";
    }






}

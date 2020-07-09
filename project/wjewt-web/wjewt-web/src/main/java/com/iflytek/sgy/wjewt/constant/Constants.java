package com.iflytek.sgy.wjewt.constant;

public interface Constants {

	String APPLICATION_JSON_UTF_8 = "application/json; charset=UTF-8";
	
	String MEDIA_TYPE_IMAGE = "image";
	
	String MEDIA_TYPE_FILE = "octet-stream";
	
	String TERMINAL_CODE_ANDROID = "Android";
	String TERMINAL_ANDROID="2";
	
	String TERMINAL_CODE_IOS = "IOS";
	String TERMINAL_IOS="3";

	/**
	 * 类型 1轮播图 2运营位 3服务推荐位
	 */
	/**
	* 轮播图
	*/
	String OPERATION_TYPE_SCROLL = "1";
	/**
	* 运营位
	*/
	String OPERATION_TYPE_CONTENT= "2";
	/**
	* 服务推荐位
	*/
	String OPERATION_TYPE_SERVICE= "3";
	
	/**
	* 有新通知
	*/
	String HAVE_NEW_NOTICE = "1";
	/**
	* 无新通知
	*/
	String NO_NEW_NOTICE = "0";
}

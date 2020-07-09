package com.iflytek.sgy.wjewt.domain.entity;


import org.hibernate.annotations.AccessType;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@javax.persistence.Entity
@javax.persistence.Table(name = "SERVICE_SYS_CONFIG")
@AccessType("field")
@GenericGenerator(name = "system_uuid", strategy = "uuid")
public class ServiceSysConfig{
public ServiceSysConfig(){

}
/**
 *主键ID
 */
@Id
@GeneratedValue(generator = "system_uuid")
private String id;
/**
 *配置项
 */
@Column(name = "KEY", length = 20)
private String key;
/**
 *配置数值
 */
@Column(name = "VALUE", length = 50)
private String value;
/**
 *有效性,0：无效，1：有效
 */
@Column(name = "ENABLE", length = 1)
private String enable;
/**
 *主键ID
 */
public String getId(){
	return this.id;
}
/**
 *主键ID
 *@param id
 */
public void setId(String id){
	this.id=id;
}

/**
 *配置项
 */
public String getKey(){
	return this.key;
}
/**
 *配置项
 *@param key
 */
public void setKey(String key){
	this.key=key;
}

/**
 *配置数值
 */
public String getValue(){
	return this.value;
}
/**
 *配置数值
 *@param value
 */
public void setValue(String value){
	this.value=value;
}

/**
 *有效性,0：无效，1：有效
 */
public String getEnable(){
	return this.enable;
}
/**
 *有效性,0：无效，1：有效
 *@param enable
 */
public void setEnable(String enable){
	this.enable=enable;
}

}
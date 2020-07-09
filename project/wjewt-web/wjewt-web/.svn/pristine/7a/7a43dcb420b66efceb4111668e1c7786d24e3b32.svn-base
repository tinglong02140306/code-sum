package com.iflytek.sgy.wjewt.support;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotWritableException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;

/**
 * ClassName: FastJsonMessageConverter <br/>
 * Function: 重写FastJsonHttpMessageConverter满足，完成自定义注解处理. <br/>
 * date: 2015年12月29日 下午1:12:27 <br/>
 * 
 * @author ycli7
 */
public class FastJsonMessageConverter extends FastJsonHttpMessageConverter {
	private Charset charset = UTF8;

	private SerializerFeature[] features = new SerializerFeature[] {
			SerializerFeature.WriteNullStringAsEmpty,
			SerializerFeature.WriteNullListAsEmpty,
			SerializerFeature.WriteMapNullValue,
			SerializerFeature.WriteDateUseDateFormat,
			SerializerFeature.WriteNullBooleanAsFalse};
	
	public FastJsonMessageConverter(){
		List<MediaType> supportedMediaTypes = new ArrayList<MediaType>();
		supportedMediaTypes.add(MediaType.APPLICATION_JSON);
		supportedMediaTypes.add(MediaType.TEXT_HTML);
		this.setSupportedMediaTypes(supportedMediaTypes);
		this.setCharset(UTF8);
	}

	@Override
	protected void writeInternal(Object obj, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {
		OutputStream out = outputMessage.getBody();
		String text = JSON.toJSONString(obj, features);
		byte[] bytes = text.getBytes(charset);
		out.write(bytes);
	}

	public Charset getCharset() {
		return this.charset;
	}

	public void setCharset(Charset charset) {
		this.charset = charset;
	}

	public SerializerFeature[] getFeatures() {
		return features;
	}

	public void setFeatures(SerializerFeature... features) {
		this.features = features;
	}
}

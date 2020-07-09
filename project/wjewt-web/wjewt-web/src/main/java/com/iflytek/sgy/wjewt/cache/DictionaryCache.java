//package com.iflytek.sgy.wjewt.cache;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.stereotype.Component;
//
//import com.iflytek.sgy.wjewt.constant.CacheConstant;
//import com.iflytek.sgy.wjewt.dao.DictDao;
//import com.iflytek.sgy.wjewt.domain.entity.DictDO;
//
//@Component
//public class DictionaryCache{
//
//	@Autowired
//	private DictDao dictDao;
//	
//	@Cacheable(value = CacheConstant.CACHE_DICT, key = "#root.methodName + #type")
//	public List<DictDO> getByType(String type) {
//		return dictDao.getByType(type);
//	}
//}

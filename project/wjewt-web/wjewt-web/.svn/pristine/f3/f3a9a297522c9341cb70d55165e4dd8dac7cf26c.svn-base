package com.iflytek.sgy.social.uop.base;

import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


//@RunWith(SpringJUnit4ClassRunner.class) 
//@ContextConfiguration({"classpath*:/spring/spring-context.xml"}) 
////@Transactional
//@ActiveProfiles("local")
@ContextConfiguration(locations = { "/spring/spring-*.xml"})
public abstract class BaseTest  extends AbstractJUnit4SpringContextTests{
	protected final Logger logger = LoggerFactory.getLogger(getClass());
}

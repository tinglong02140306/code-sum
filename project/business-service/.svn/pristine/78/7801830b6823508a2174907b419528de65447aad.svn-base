package com.iflytek.sgy.wjewt.services.yjnc.controller;

import com.iflytek.sgy.wjewt.services.yjnc.service.IBusinessUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class UserController {

    @Autowired
    private IBusinessUserService businessUserService;


    @RequestMapping("/user/userInfo")
    @ResponseBody
    public  Map<String, Object> getUser(HttpServletRequest request){
        Map<String, Object> map = businessUserService.getUserInfo(request);
        return map;
    }
}

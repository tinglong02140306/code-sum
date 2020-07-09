package com.iflytek.sgy.wjewt.controller;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import com.iflytek.sgy.wjewt.redis.DictDecode;
import com.iflytek.sgy.wjewt.service.IServiceYjncApply;
import com.iflytek.sgy.wjewt.util.ExportUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.List;

/**
 * 导出EXCEL
 * Created by Administrator on 2018/1/17.
 */
@Controller
public class ExcelExportController {

    Logger logger = LoggerFactory.getLogger(ExcelExportController.class);

    @Autowired
    private IServiceYjncApply iServiceYjncApply;
    @Autowired
    private DictDecode dictDecode;


    @RequestMapping("/apply/export")
    @ResponseBody
    public void exportApply(HttpServletResponse response, Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply) throws IOException {
        String[] titles = new String[]{"序号","挪车地点","申请人账号","申请时间","完成时间","挪车耗时","状态"};
        String[] fields = new String[]{"address","applyerMobile","applyTime","lastUpdateTime","spendTime","statusMc"};
        String fileName = "挪车申请列表.xlsx";
        try (OutputStream os = response.getOutputStream()){
            response.setContentType("APPLICATION/OCTET-STREAM");
            response.setHeader("Content-Disposition",  "attachment; filename="
                    + URLEncoder.encode(fileName, "UTF-8"));

            ExportUtil exportUtil = new ExportUtil(fileName);
            logger.debug("导出开始..");
            List<ServiceYjncApply> list = iServiceYjncApply.findQuery(serviceYjncApply);
            logger.debug("已查询到{}条数据",list.size());
            dictDecode.decode(list);
            logger.debug("已完成字典翻译");
            exportUtil.exportExcel(list,titles,fields,response.getOutputStream(),true,"init");
        } catch ( IOException ioe) {
            logger.error("文件导出异常！",ioe);
            response.getWriter().write("文件导出异常！");
        }
    }
}

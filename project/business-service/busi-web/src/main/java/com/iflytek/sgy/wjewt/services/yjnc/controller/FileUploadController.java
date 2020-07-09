package com.iflytek.sgy.wjewt.services.yjnc.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.wjewt.base.ResultMsg;
import com.iflytek.sgy.wjewt.services.base.ApplicationConstants;
import com.iflytek.sgy.wjewt.services.fastdfs.FastdfsTransform;
import com.iflytek.sgy.wjewt.services.utils.OcrHttpUtil;
import com.iflytek.sgy.wjewt.services.utils.ZipImageFileUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;
import sun.misc.BASE64Decoder;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;

/**
 * 文件上传删除处理控制器
 * Created by Administrator on 2018/1/12.
 */
@Controller
public class FileUploadController {

    @Autowired
    private FastdfsTransform fastdfsTransform;

    @Autowired
    private ApplicationConstants applicationConstants;

    Logger logger = LoggerFactory.getLogger(FileUploadController.class);


    /**
     * 上传文件
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/file/upload", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg upload(HttpServletRequest request) throws Exception {
        logger.info("调用upload....");
        //将request变成多部分request
        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
        return excuteUpload(multiRequest);
    }


    /**
     * OCR识别接口
     *
     * @param photo
     * @return
     */
    @RequestMapping(value = "/ocrscan", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg ocrScan(String photo) {
        Assert.notNull(photo, "照片数据参数不能为空！");
        //去除转义的换行符
        photo = photo.replaceAll("%0A", "");
        try {
            String encode = URLEncoder.encode(photo, "utf-8");
            String res = OcrHttpUtil.post(applicationConstants.ocrUrl, "photo=" + encode);
            if (StringUtils.isNotBlank(res)) {
                return ResultMsg.success(StringUtils.replace(res,"皖",""));
            } else {
                return ResultMsg.fail("未读取到车牌信息", null);
            }
        } catch (Exception e) {
            logger.error("OCR 识别异常", e);
            return ResultMsg.fail("OCR 识别失败！", e);
        }
    }

    /**
     * 上传文件
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/file/uploadbase64", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg uploadbase64(HttpServletRequest request) throws Exception {
        logger.info("调用uploadbase64....");
        //将request变成多部分request
        String data = request.getParameter("data");
        String filename = request.getParameter("fileName");

        if (StringUtils.isBlank(data)) {
            return ResultMsg.fail("图片数据不能为空", null);
        }
        logger.debug("Base64上传文件...");
        BASE64Decoder decoder = new BASE64Decoder();
        // Base64解码
        byte[] b = decoder.decodeBuffer(data);
        for (int i = 0; i < b.length; ++i) {
            if (b[i] < 0) {// 调整异常数据
                b[i] += 256;
            }

        }
        String[] fstr = filename.split("\\.");
        String ext = fstr[fstr.length - 1];
        ResultMsg resultMsg = checkFormat(b, ext);
        if (resultMsg.isFlag()) {
            String path = fastdfsTransform.storeFile(b, ext);
            logger.debug("文件 {} 上传成功，文件ID为 {}", filename, path);
            return ResultMsg.success(path);
        } else {
            return ResultMsg.fail("检测到非法文件，终止上传", null);
        }
    }


    /**
     * 限制上传三张图片
     *
     * @param request
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/file/upload3", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg upload3(HttpServletRequest request) throws IOException {
        logger.info("调用upload3....");
        //将request变成多部分request
        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
        if (multiRequest.getFileMap().size() > 3) {
            return ResultMsg.fail("最大只能上传3张图片", null);
        } else {
            return excuteUpload(multiRequest);
        }
    }


    /**
     * 执行上传
     *
     * @param multiRequest
     * @return
     */
    public ResultMsg excuteUpload(MultipartHttpServletRequest multiRequest) throws IOException {
        ResultMsg res = ResultMsg.success(null, null);
        StringBuilder fileIds = new StringBuilder();
        //获取multiRequest 中所有的文件名
        Iterator iter = multiRequest.getFileNames();
        while (iter.hasNext()) {
            //一次遍历所有文件
            MultipartFile file = multiRequest.getFile(iter.next().toString());
            if (file != null) {
                logger.debug("上传文件 {}", file.getOriginalFilename());
                String[] filename = file.getOriginalFilename().split("\\.");
                String ext = filename[filename.length - 1];
                ResultMsg resultMsg = checkFormat(file.getBytes(), ext);
                if (resultMsg.isFlag()) {
                    //压缩图片
                    File zipFile = ZipImageFileUtil.handleImageFile(ext, file.getInputStream());
                    String path = fastdfsTransform.storeFile(ZipImageFileUtil.getByte(zipFile), ext);
                    logger.debug("文件 {} 上传成功，文件ID为 {}", file.getOriginalFilename(), path);
                    zipFile.delete();
                    fileIds.append(path).append(",");
                } else {
                    res = ResultMsg.fail("检测到非法文件，终止上传", null);
                    removeFile(fileIds.toString());
                    break;
                }
            }
        }
        if (res.isFlag() && fileIds.length() > 1) {
            fileIds.deleteCharAt(fileIds.length() - 1);
            res.setData(fileIds);
        }
        return res;
    }


    /**
     * 删除Fastdfs文件
     *
     * @param path 要删除的文件路径
     * @return
     */
    @RequestMapping(value = "/file/remove", method = RequestMethod.POST)
    @ResponseBody
    public ResultMsg removeFile(String path) {
        if (path.contains("*")) {
            return ResultMsg.fail("禁止使用特殊通配符！", null);
        }
        String[] paths = path.split(",");

        for (String p : paths) {
            if (StringUtils.isNotBlank(p)) {
                int res = fastdfsTransform.delete(path);
                if (res == 0) {
                    logger.info("文件{} 删除成功！", p);
                } else {
                    logger.error("文件{} 删除失败！", p);
                }
            }
        }
        return ResultMsg.success("文件删除成功！", null);
    }

    /**
     * 校验文件格式
     *
     * @param bytes 文件流
     * @param ext   文件后缀
     * @return
     */
    public ResultMsg checkFormat(byte[] bytes, String ext) {
        //基本校验文件后缀
        if (!equalsOr(ext, "jpg", "png", "jpeg", "bmp", "gif")) {
            return ResultMsg.fail("文件格式错误，不是有效的图片格式！", null);
        }

        //尝试获取图片尺寸
        try {
            BufferedImage sourceImg = ImageIO.read(new ByteArrayInputStream(bytes));
            int imgWidth = sourceImg.getWidth();
            int imgHeight = sourceImg.getHeight();
            if (imgHeight > 0 && imgWidth > 0) {
                return ResultMsg.success("图片校验成功", null);
            } else {
                return ResultMsg.fail("获取图片尺寸失败，不是有效的图片格式！", null);
            }
        } catch (NullPointerException | IOException e) {
            return ResultMsg.fail("图片文件处理异常，不是有效的图片格式！", null);
        }

    }

    /**
     * 字符串内容比较
     *
     * @param orgin 原始字符串
     * @param comp  比较对像集合
     * @return
     */
    private static boolean equalsOr(String orgin, String... comp) {
        for (String str : comp) {
            if (StringUtils.equalsIgnoreCase(orgin, str)) {
                return true;
            }
        }
        return false;
    }


    /**
     * 获取二进制文件流
     *
     * @param filePath
     * @return
     */
    public byte[] fileToBytes(String filePath) {
        byte[] buffer = null;
        File file = new File(filePath);
        try (FileInputStream fis = new FileInputStream(file);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] b = new byte[1024];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            buffer = bos.toByteArray();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return buffer;
    }

}

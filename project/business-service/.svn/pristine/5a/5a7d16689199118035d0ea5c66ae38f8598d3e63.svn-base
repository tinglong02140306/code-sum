package com.iflytek.sgy.wjewt.services.utils;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.FileCopyUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 图片大小压缩，尺寸缩放
 *
 * @author: yanzhang9
 * @createTime: 2017年1月5日 上午11:36:17
 */
public class ZipImageFileUtil {
    protected static Logger logger = LoggerFactory.getLogger(ZipImageFileUtil.class);

    //默认压缩质量，参数1为最高质量，一般0.8即可
    public final static float DEFAULT_QUALITY = 0.3f;

    /**
     * 处理文件大小及尺寸
     */

    public static File handleImageFile(String imageExtName, InputStream imageStream) {
        // 生成临时图片文件
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        if (StringUtils.equalsIgnoreCase("png", imageExtName)) {
            imageExtName = "jpg";
        }
        String tempImageName = df.format(new Date()) + "." + imageExtName;
        String osName = System.getProperty("os.name");
        String tempFilePath =tempImageName;
        if (StringUtils.containsIgnoreCase(osName,"windows")){
            tempFilePath = "D:\\" + tempImageName;
        }else {
            tempFilePath = "/tmp/" + tempImageName;
        }
        File tempFile = new File(tempFilePath);
        byte[] bytes;
        try {
            tempFile.createNewFile();
            bytes = FileCopyUtils.copyToByteArray(imageStream);
            FileCopyUtils.copy(bytes, tempFile);
            // 判断图片大小
            BufferedImage image = ImageIO.read(tempFile);
            // 判断内容是图片格式才压缩处理
            if (image != null) {
                int width = image.getWidth();
                int hight = image.getHeight();
                float size = tempFile.length() / 1024f;
                tempFile = zipImageFile(tempFile, width, hight, size);
            }
        } catch (IOException e) {
            logger.warn("压缩图片出错", e);
        } finally {
            IOUtils.closeQuietly(imageStream);
        }
        return tempFile;
    }


    public static byte[] getByte(File file) {
        byte[] buffer = null;
        try (FileInputStream fis = new FileInputStream(file);
             ByteArrayOutputStream bos = new ByteArrayOutputStream(1000)) {
            byte[] b = new byte[1000];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            buffer = bos.toByteArray();
            return buffer;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 按要求压缩文件大小及缩放文件尺寸
     *
     * @param tempFile 需要压缩的文件
     * @param width    文件宽度
     * @param size     文件大小
     * @return
     * @throws IOException File
     * @author: yanzhang9
     * @createTime: 2017年1月4日 下午4:57:54
     */
    public static File zipImageFile(File tempFile, int width, int hight,
                                    float size) throws IOException {
        Thumbnails.of(tempFile).scale(1f).outputQuality(DEFAULT_QUALITY).toFile(tempFile);
        return tempFile;
    }
}


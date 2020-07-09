package com.iflytek.sgy.wjewt.services.fastdfs;


import com.iflytek.sgy.filestorage.fastdfs.pool.FastdfsPool;
import com.iflytek.sgy.filestorage.fastdfs.pool.StorageClient;
import org.apache.commons.pool.impl.GenericObjectPool;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;


/**
 * fastFDS操作类
 *
 * @author
 * @createTime 2015年4月29日 下午3:26:55
 */
public final class FastdfsTransform implements InitializingBean{

    /**
     * FastDFS 连接池
     */
    private FastdfsPool fastdfsPool;

    private int MAX_ACTIVE = 500;

    private int MAX_IDLE = 100;

    private Logger logger = Logger.getLogger(FastdfsTransform.class);

    private Resource location;

    public Resource getLocation() {
        return location;
    }

    public void setLocation(Resource location) {
        this.location = location;
    }

    public FastdfsPool getFastdfsPool() {
        return fastdfsPool;
    }

    public void setFastdfsPool(FastdfsPool fastdfsPool) {
        this.fastdfsPool = fastdfsPool;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        GenericObjectPool.Config config = new GenericObjectPool.Config();
        config.maxActive = MAX_ACTIVE;
        config.maxIdle= MAX_IDLE;
        fastdfsPool = new FastdfsPool(config);
        fastdfsPool.setLocation(location);
        fastdfsPool.afterPropertiesSet();
    }

    /**
     * 根据Fastdfs路径获取文件二进制字节流
     *
     * @param path Fastdfs存储路径
     * @return 文件二进制字节流
     * @history 2016-04-20
     * @created 2016-04-20
     * @author yali@iflytek.com
     * @since 1.7.0
     */
    public byte[] getFile(String path) {
        try {

            StorageClient storageClient = fastdfsPool.getResource();

            byte[] bytes = storageClient.download_file1(path);
            fastdfsPool.returnResource(storageClient);
            if (bytes != null) {
                logger.debug("成功获取FastDFS文件：" + path);
            }
            return bytes;
        } catch (Exception e) {
            logger.error("读取图片文件出错！图片路径【" + path + "】", e);
        }
        return null;
    }

    /**
     * 存储文件
     *
     * @param file 文件二进制流
     * @return
     */
    public String storeFile(byte[] file, String ext) {
        try {
            StorageClient storageClient = fastdfsPool.getResource();
            String id = storageClient.upload_file1(file, ext, null);
            fastdfsPool.returnResource(storageClient);
            return id;
        } catch (Exception e) {
            logger.error("写入目标文件出错！", e);
            return null;
        }
    }

    /**
     * 删除指定路径的Fastdfs文件
     *
     * @param path
     * @return
     */
    public int delete(String path) {
        try {
            StorageClient storageClient = fastdfsPool.getResource();
            int i = storageClient.delete_file1(path);
            fastdfsPool.returnResource(storageClient);
            return i;
        } catch (Exception e) {
            logger.error("文件服务器连接异常！", e);
            return 0;
        }
    }


}

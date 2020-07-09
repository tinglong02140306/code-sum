package com.iflytek.sgy.wjewt.services.utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.*;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class HttpUtil {

    // 超时时间
    private static int TIMEOT_TIME = 3 * 1000;

    private static Logger logger = LoggerFactory.getLogger(HttpUtil.class);
    /**
     * 使用Get方式访问服务器资源
     * @return
     * @throws Exception
     */
    public static String doGet(String urlStr, Map<String,String> params) throws Exception {
        if(urlStr == null) {
            new NullPointerException("url is null!");
        }

        //Get请求对象
        HttpGet httpGet = new HttpGet(getUrlAddparams(urlStr, params));
        return client(httpGet);
    }

    /**
     * 接收一个HttpRequestBase（一般为，HttpPost和HttpGet）对象，然后向服务器发送请求，获取资源，返回一个完整的XML文件
     * @param request
     * @return
     * @throws Exception
     */
    private static String client(HttpRequestBase request) throws Exception {

        CloseableHttpClient httpclient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = null;

        try{
            response = httpclient.execute(request);

            //设置请求和传输超时时间
            RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(TIMEOT_TIME).setConnectTimeout(TIMEOT_TIME).build();
            request.setConfig(requestConfig);

            if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    return EntityUtils.toString(entity, "UTF-8");
                }
            }else{
                throw new Exception(response.getStatusLine().getStatusCode()+": "+response.toString());
            }
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        } finally {
            // 关闭连接,释放资源
            try {
                if (response != null) {
                    response.close();
                }

                if (httpclient != null) {
                    httpclient.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
                throw e;
            }
        }

        return null;
    }

    /**
     * 将传入的参数组织成一个字符串
     * @param url
     * @param paramsMap
     * @return
     */
    private static String getUrlAddparams(String url, Map<String, String> paramsMap){

        StringBuffer sb = new StringBuffer();

        if(paramsMap == null || paramsMap.isEmpty()){
            return url;
        }

        sb.append(url + "?");

        Iterator<Entry<String, String>> it = paramsMap.entrySet().iterator();
        Entry<String, String> entry;

        while(it.hasNext()){
            entry = it.next();
            sb.append(entry.getKey()+"="+entry.getValue()+"&");
        }

        String result = sb.toString();
        if(result != null && result.trim().length() > 0){
            result = result.substring(0,result.length()-1);
        }

        return result;
    }
    
    /**
    * post请求调用rest接口
    * @author: yanzhang9
    * @createTime: 2017年1月12日 下午2:42:01
    * @param urlPaths rest请求地址
    * @param object 参数对象
    * @return
    * @throws IOException String
    */
	public static String httpPost(String urlPaths, Object object) throws IOException {
        String sb = "";
        String urlPath = new String(urlPaths);
        //建立连接
        URL url=new URL(urlPath);
        HttpURLConnection httpConn=(HttpURLConnection)url.openConnection();
        //设置参数
        httpConn.setDoOutput(true);   //需要输出
        httpConn.setDoInput(true);   //需要输入
        httpConn.setUseCaches(false);  //不允许缓存
        httpConn.setRequestMethod("POST");   //设置POST方式连接
        //设置请求属性  application/x-www-form-urlencoded
        httpConn.setRequestProperty("Content-Type", "application/json");
        httpConn.setRequestProperty("Connection", "Keep-Alive");// 维持长连接
        httpConn.setRequestProperty("Charset", "UTF-8");
        //连接,也可以不用明文connect，使用下面的httpConn.getOutputStream()会自动connect
        httpConn.connect();
        //建立输入流，向指向的URL传入参数
        OutputStream outputStream = httpConn.getOutputStream();
        outputStream.write(JSONObject.toJSONString(object).getBytes("utf-8"));
        outputStream.flush();
        outputStream.close();
        //获得响应状态
        int resultCode=httpConn.getResponseCode();
        if(HttpURLConnection.HTTP_OK==resultCode){
            String readLine=new String();
            BufferedReader responseReader=new BufferedReader(new InputStreamReader(httpConn.getInputStream(),"UTF-8"));
            while((readLine=responseReader.readLine())!=null){
            	sb+=readLine+"\n";
            }
            responseReader.close();
        }
        return sb;
    }
    
    /**
	 * 通用get请求
	 * @author ssyang
	 * @param url 请求地址
	 * @param params 参数名值对
	 * @return
	 * @since JDK 1.6
	 */
	public static byte[] get(String url, List<NameValuePair> params) {
		if(null == params) {
			params = new ArrayList<NameValuePair>();
		}
		HttpClient httpclient = HttpClients.createDefault();
		try {
			String paramsStr = EntityUtils.toString(new UrlEncodedFormEntity(params, Consts.UTF_8));
			url = url + "?" + paramsStr;
			HttpGet httpGet = new HttpGet(url);
			HttpResponse response = httpclient.execute(httpGet);
			logger.debug("get请求{}返回状态码：{}",url,response.getStatusLine());
			HttpEntity entity = response.getEntity();
			return EntityUtils.toByteArray(entity);
			
		} catch (ParseException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}

package com.iflytek.sgy.wjewt.base;

/**
 * 响应结果封装
 * Created by Administrator on 2018/1/10.
 */
public class ResultMsg {


    private boolean flag;

    private String message;

    private Object data;

    private int code = 0;

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public ResultMsg(boolean flag, String message, Object data) {
        this.flag = flag;
        this.message = message;
        this.data = data;
    }

    public static ResultMsg success(String message,Object data){
        return new ResultMsg(true,message,data);
    }

    public static ResultMsg success(Object data){
        return new ResultMsg(true,"加载成功",data);
    }


    public static ResultMsg fail(String message,Throwable e){
        return new ResultMsg(false,message,null);
    }

    public void setSuccess(boolean success){
        this.flag=success;
    }

    public void setMsg(String msg){
        this.message = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
        this.flag = this.code == 0;
    }
}

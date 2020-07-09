package com.iflytek.sgy.wjewt.services.base;



import java.io.Serializable;
import java.sql.Date;

/**
 * <code>消息内容实体类</code>
 * @author zhuwei
 * @date 2016/12/26 14:59
 */
public class MsgContent implements Serializable {

    private static final long serialVersionUID = 1L;

    private String mid;//主键ID

    private String senderSystem;//发送系统

    private String authCode;//授权码

    private String senderUser;//发送人

    private String receiverSystem;//接收系统

    /**
     * 接收人，多个以“,”分隔(app推送：必须是userId+_+did(用户设备ID)+_+dvc_type(设备类型) 组合在一起 例如： usrId_did_dvc_type)
     */
    private String receiverUser;//接收人

    private String title;//消息标题

    private String content;//消息内容
    private String source;//明文内容
    private String securityKey;//安全码

    private String msgType;//消息类型 0:私信 1：通知 2：短信 3：app消息 4：邮件  多个类型以“,”分隔

    private Date sendTime;//发送时间

    private Date createTime;//创建时间
    
    private String extend;//设置其他信息 json串

    private MsgExtends extendVo;//其他设置信息 

    private String status;//消息状态  0：待发送  1：发送成功  2：发送失败 3：已失效 4：已读  5：未读

    private String cid;//通道ID

    private String priority;//是否优先发送（0：普通   1：优先）

    private String statusMsg;//发送状态信息（比如发送失败和原因之类）

    public String getMid() {
        return mid;
    }

    public void setMid(String mid) {
        this.mid = mid;
    }

    public String getSenderSystem() {
        return senderSystem;
    }

    public void setSenderSystem(String senderSystem) {
        this.senderSystem = senderSystem;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getSenderUser() {
        return senderUser;
    }

    public void setSenderUser(String senderUser) {
        this.senderUser = senderUser;
    }

    public String getReceiverSystem() {
        return receiverSystem;
    }

    public void setReceiverSystem(String receiverSystem) {
        this.receiverSystem = receiverSystem;
    }

    public String getReceiverUser() {
        return receiverUser;
    }

    public void setReceiverUser(String receiverUser) {
        this.receiverUser = receiverUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMsgType() {
        return msgType;
    }

    public void setMsgType(String msgType) {
        this.msgType = msgType;
    }

    public Date getSendTime() {
        return sendTime;
    }

    public void setSendTime(Date sendTime) {
        this.sendTime = sendTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatusMsg() { return statusMsg; }

    public void setStatusMsg(String statusMsg) { this.statusMsg = statusMsg; }

	/**
	 * @return the extendVo
	 */
	public MsgExtends getExtendVo() {
		return extendVo;
	}

	/**
	 * @param extendVo the extendVo to set
	 */
	public void setExtendVo(MsgExtends extendVo) {
		this.extendVo = extendVo;
	}

	/**
	 * @return the extend
	 */
	public String getExtend() {
		return extend;
	}

	/**
	 * @param extend the extend to set
	 */
	public void setExtend(String extend) {
		this.extend = extend;
	}

	/**
	 * @return the source
	 */
	public String getSource() {
		return source;
	}

	/**
	 * @param source the source to set
	 */
	public void setSource(String source) {
		this.source = source;
	}

	/**
	 * @return the securityKey
	 */
	public String getSecurityKey() {
		return securityKey;
	}

	/**
	 * @param securityKey the securityKey to set
	 */
	public void setSecurityKey(String securityKey) {
		this.securityKey = securityKey;
	}

}

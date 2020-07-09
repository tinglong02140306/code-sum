package com.iflytek.sgy.wjewt.constant;

/**
* 终端类型
* @author: yanzhang9
* @createTime: 2017年2月18日 下午5:06:13
*/
public enum TerminalType {

	ANDROID("Android","2"),
	IOS("IOS","3");
	
	private String code;
    private String text;
	
    TerminalType(String text, String code){
        this.text = text;
        this.code = code;
    }

    //根据text获取code
    public static String getCode(String text) {
	  for (TerminalType t : TerminalType.values()) {
		  if (t.getText().equals(text)) {
		     return t.code;
		  }
       }
	  return null;
    }
    
    //根据code获取text
    public static String getText(String code) {
  	  for (TerminalType t : TerminalType.values()) {
  		  if (t.getCode().equals(code)) {
  		     return t.text;
  		  }
         }
  	  return null;
      }
    
	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * @return the text
	 */
	public String getText() {
		return text;
	}

	/**
	 * @param text the text to set
	 */
	public void setText(String text) {
		this.text = text;
	} 
    
    
}

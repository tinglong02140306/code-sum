package com.iflytek.sgy.wjewt.domain.dto;


/**
 * 呼叫数量每天数量
 */
public class RecordDateCount implements Comparable<RecordDateCount> {

    /**
     * 日期
     */
    private String countDate;

    /**
     * 总量
     */
    private Long countNum;

    public RecordDateCount() {
    }

    public RecordDateCount(String countDate, Long countNum) {
        this.countDate = countDate;
        this.countNum = countNum;
    }

    public RecordDateCount(String countDate) {
        this.countDate = countDate;
        this.countNum = 0l;
    }

    public String getCountDate() {
        return countDate;
    }

    public void setCountDate(String countDate) {
        this.countDate = countDate;
    }

    public Long getCountNum() {
        return countNum;
    }

    public void setCountNum(Long countNum) {
        this.countNum = countNum;
    }

    @Override
    public int compareTo(RecordDateCount o) {
        return this.countDate.compareTo(o.getCountDate());
    }

    public void  resetDateFormat(){
        String date = this.countDate.substring(4,6).concat("-").concat(this.countDate.substring(6));
        this.countDate = date;
    }
}

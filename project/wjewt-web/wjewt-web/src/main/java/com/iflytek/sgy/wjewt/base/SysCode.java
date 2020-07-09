package com.iflytek.sgy.wjewt.base;

public interface SysCode {

    /**
     * 管理员
     */
    public static String ADMIN_NAME="管理员";
    /**
     * 用户默认名
     */
    public static String USER_DEFAULT_NAME="用户";
    /**
     * 默认页码
     */
    public static int PAGE_NO=1;
    /**
     * 默认分页大小
     */
    public static int PAGE_SIZE=10;

    /**
     * 评论时间降序排序
     */
    public static final int ORDERBY_DESC=1;
    /**
     * 评论时间升序排序
     */
    public static final int ORDERBY_ASC=0;
    /**
     *  评论审核状态
     *  @author xlwang9
     */
    public static interface COMMENT_CHECK_STATE{
        int INIT=0;
        int PASS=1;
        int NO_PASS=2;
    }

    /**
     * 是否
     *
     * @author xlwang9
     */
    public static interface IS_OR_NOT {
        /**
         * 是
         */
        public static final String IS = "1";
        /**
         * 否
         */
        public static final String NOT = "0";
        /**
         * 是
         */
        public static final int is=1;
        /**
         * 否
         */
        public static final int not=0;
    }
    
    /** QUERY_STATUS:查询缴费详情时，先查询缴费状态 */
    public static final String QUERY_STATUS = "1";
}

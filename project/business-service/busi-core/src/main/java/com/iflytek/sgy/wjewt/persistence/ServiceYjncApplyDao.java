package com.iflytek.sgy.wjewt.persistence;

import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.social.orm.tools.SqlMaker;
import com.iflytek.sgy.wjewt.base.BaseDao;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2018/1/10.
 */
@Repository
public class ServiceYjncApplyDao extends BaseDao<ServiceYjncApply> {


    /**
     * 根据查询条件获取全部查询结果列表，不分页
     * @param serviceYjncApply
     *      查询条件对象
     * @return
     */
    public List<ServiceYjncApply> findQuery(ServiceYjncApply serviceYjncApply){
        try {
            SqlMaker sqlMaker = SqlMaker.getInstance("from ServiceYjncApply where 1=1 ");
            sqlMaker.eq("applyerUserId",serviceYjncApply.getApplyerUserId());
            sqlMaker.like("applyerMobile",serviceYjncApply.getApplyerMobile());
            sqlMaker.eq("status",serviceYjncApply.getStatus());
            sqlMaker.eq("deleteState", SysCode.DELETE_STATE.UNDELETED);
            if (StringUtils.isNotBlank(serviceYjncApply.getApplyTimeBegin())){
                sqlMaker.ge("applyTime","applyTimeBegin", SysCode.DATE_FORMATTER.FORMATTER_L.parse(serviceYjncApply.getApplyTimeBegin()));
            }
            if (StringUtils.isNotBlank(serviceYjncApply.getApplyTimeEnd())){
                sqlMaker.le("applyTime","applyTimeEnd", SysCode.DATE_FORMATTER.FORMATTER_L.parse(serviceYjncApply.getApplyTimeEnd()));
            }
            sqlMaker.getSql().append(" order by applyTime desc ");
            return find(sqlMaker.getSqlString(),sqlMaker.getValues());
        } catch (Exception e) {
            logger.error("查询出错！",e);
            return null;
        }
    }


    /**
     * 根据查询条件查询挪车信息
     * @param page
     * @param serviceYjncApply
     * @return
     */
    public Page<ServiceYjncApply> pageQuery(Page<ServiceYjncApply> page, ServiceYjncApply serviceYjncApply){
            //设置分页限制
        if (page.getPageSize()> 20){
            page.setPageSize(20);
        }
        try {

           SqlMaker sqlMaker = SqlMaker.getInstance("SELECT ID, APPLYER_USER_ID, APPLYER_NAME, APPLYER_MOBILE, CAR_PLATE_TYPE, CAR_PLATE_NUM, '' AS DRIVER_MOBILE, '' AS DRIVER_NAME, ADDRESS, POINT_X, POINT_Y, REASON_TYPE, APPLY_TIME, LAST_UPDATE_USER, LAST_UPDATE_TIME, PICTURES, DRIVER_ATTITUDE_RANK, DRIVER_SPEED_RANK, EVALUATE_CONTENT, STATUS, APLLY_PLATEFORM, DELETE_STATE, SMS_OR_NOT, TEL_OR_NOT, PRESSED_OR_NOT FROM SERVICE_YJNC_APPLY WHERE 1=1 ");
           sqlMaker.eq("APPLYER_USER_ID",serviceYjncApply.getApplyerUserId());
           sqlMaker.like("APPLYER_MOBILE",serviceYjncApply.getApplyerMobile());
           sqlMaker.eq("STATUS",serviceYjncApply.getStatus());
           sqlMaker.eq("DELETE_STATE", SysCode.DELETE_STATE.UNDELETED);
           if (StringUtils.isNotBlank(serviceYjncApply.getApplyTimeBegin())){
               sqlMaker.ge("APPLY_TIME","applyTimeBegin", SysCode.DATE_FORMATTER.FORMATTER_L.parse(serviceYjncApply.getApplyTimeBegin()));
           }
           if (StringUtils.isNotBlank(serviceYjncApply.getApplyTimeEnd())){
               sqlMaker.le("APPLY_TIME","applyTimeEnd", SysCode.DATE_FORMATTER.FORMATTER_L.parse(serviceYjncApply.getApplyTimeEnd()));
           }

           sqlMaker.getSql().append(" ORDER BY APPLY_TIME DESC ");
           return findSqlPage(page,sqlMaker.getSqlString(), ServiceYjncApply.class,sqlMaker.getValues());
       } catch (Exception e) {
           logger.error("查询出错！",e);
           return null;
       }
    }


    /**
     * 变更状态
     * @param id
     * @param status
     */
    public int updateStatus(String id,String status,String userName){
       int i = createSqlQuery("update SERVICE_YJNC_APPLY set LAST_UPDATE_USER = :userName,LAST_UPDATE_TIME = :lastDate, status = :status where id=:id")
               .setParameter("userName",userName)
               .setTimestamp("lastDate",new Date())
               .setParameter("status",status)
               .setParameter("id",id).executeUpdate();
       return i;
    }

    /**
     * 催办保存
     * @param id
     * @return
     */
    public int  updatePressed(String id){
      int i =  createSqlQuery("update SERVICE_YJNC_APPLY set PRESSED_OR_NOT = :pressed where id=:id").setParameter("pressed",SysCode.YES_NO.YES).setParameter("id",id).executeUpdate();
      return i;
    }

     /**
     * 提交评价
     * @return
     */
    public int evaluate(ServiceYjncApply apply) {
        if(StringUtils.isBlank(apply.getStatus())){
            apply.setStatus(SysCode.MOVE_STATUS.SUCCESS);
        }
        int i = createSqlQuery("update SERVICE_YJNC_APPLY set DRIVER_ATTITUDE_RANK = :driverAttitudeRank, DRIVER_SPEED_RANK=:driverSpeedRank , EVALUATE_CONTENT=:evaluateContent , STATUS = :status ,LAST_UPDATE_TIME=:lastUpdateTime where id=:id")
                .setParameter("driverAttitudeRank",apply.getDriverAttitudeRank())
                .setParameter("driverSpeedRank",apply.getDriverSpeedRank())
                .setParameter("evaluateContent",xssEncode(apply.getEvaluateContent()))
                .setParameter("status",apply.getStatus())
                .setTimestamp("lastUpdateTime",new Date())
                .setParameter("id",apply.getId())
                .executeUpdate();
        return i;
    }

    /**
     * 根据用户ID和移车状态获取申请
     * @param userId
     * @return
     */
    public String findApplying(String userId,String status){
        if (StringUtils.isNotBlank(userId)){
            List res = createSqlQuery("select id from SERVICE_YJNC_APPLY where  APPLYER_USER_ID=:userId and STATUS=:status and DELETE_STATE = :deleteState order by APPLY_TIME desc ")
                    .setParameter("userId",userId)
                    .setParameter("status",status)
                    .setParameter("deleteState",SysCode.DELETE_STATE.UNDELETED).list();
            if (!CollectionUtils.isEmpty(res)){
                return (String)res.get(0);
            }else {
                return null;
            }
        }else {
            return null;
        }
    }


    /**
     * 根据申请ID 和申请状态，检查此申请是否为此状态
     * @param id
     *      申请ID
     * @param status
     *      申请状态
     * @return
     */
    public  Object findWithStatus(String id,String ... status){
        return createSqlQuery("select 1 from SERVICE_YJNC_APPLY where ID = :id and STATUS in ( :status ) ").setParameter("id",id).setParameterList("status",status).uniqueResult();
    }

    /**
     * 检测指定申请ID 是否数据此用户
     * @param id
     *      申请ID
     * @param userId
     *      用户ID
     * @return
     */
    public Object checkUserApplyAccess(String id ,String userId){
        return createSqlQuery("select 1 from SERVICE_YJNC_APPLY where ID = :id and APPLYER_USER_ID = :userId ").setParameter("id",id).setParameter("userId",userId).uniqueResult();
    }


    /**
     * 转义XSS
     * @param str
     * @return
     */
    /**
     * 将容易引起xss漏洞的半角字符直接替换成全角字符
     *
     * @param s
     * @return
     */
    private static String xssEncode(String s) {
        if (s == null || s.isEmpty()) {
            return s;
        }
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '>':
                    sb.append('＞');// 全角大于号
                    break;
                case '<':
                    sb.append('＜');// 全角小于号
                    break;
                case '\'':
                    sb.append('‘');// 全角单引号
                    break;
                case '\"':
                    sb.append('“');// 全角双引号
                    break;
                case '&':
                    sb.append('＆');// 全角
                    break;
                case '\\':
                    sb.append('＼');// 全角斜线
                    break;
                case '#':
                    sb.append('＃');// 全角井号
                    break;
                case '%':    // < 字符的 URL 编码形式表示的 ASCII 字符（十六进制格式） 是: %3c
                    processUrlEncoder(sb, s, i);
                    break;
                default:
                    sb.append(c);
                    break;
            }
        }
        return sb.toString();
    }

    public static void processUrlEncoder(StringBuilder sb, String s, int index){
        if(s.length() >= index + 2){
            if(s.charAt(index+1) == '3' && (s.charAt(index+2) == 'c' || s.charAt(index+2) == 'C')){    // %3c, %3C
                sb.append('＜');
                return;
            }
            if(s.charAt(index+1) == '6' && s.charAt(index+2) == '0'){    // %3c (0x3c=60)
                sb.append('＜');
                return;
            }
            if(s.charAt(index+1) == '3' && (s.charAt(index+2) == 'e' || s.charAt(index+2) == 'E')){    // %3e, %3E
                sb.append('＞');
                return;
            }
            if(s.charAt(index+1) == '6' && s.charAt(index+2) == '2'){    // %3e (0x3e=62)
                sb.append('＞');
                return;
            }
        }
        sb.append(s.charAt(index));
    }

}

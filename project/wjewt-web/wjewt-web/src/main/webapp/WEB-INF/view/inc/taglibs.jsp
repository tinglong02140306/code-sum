<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%-- <%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %> --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%-- <%@ taglib prefix="commontag" uri="http://www.iflytek.com/taglib/commontag" %>
<%@ taglib prefix="titletag" uri="http://www.iflytek.com/taglib/titletag" %> --%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="activityurl" value="http://static.dnyou.net/rcr-171128/index.html?brand_id=5a7bfaf732994"/>
<link href="${ctx}/resource/img/favicon.ico" type="image/vnd.microsoft.icon" rel="icon" />
<script>
	var CONTEXTPATH = "${ctx}",
		USERURL = 'http://www.ahga.gov.cn:20081/publicsso/wx/index',
		SHAREADDRESS = window.location.origin + CONTEXTPATH,
		APPDOWNURL = SHAREADDRESS + '/h5/share.do',
		ACTIVITYURL = '${activityurl}';
	var CONFIG = {
		// 开发环境
        path: 'http://61.191.24.229:5069/wjewt',
        // 现网
        // path: 'https://wj.ahga.gov.cn/',
        // 现网环境
        // path: 'http://wewt.ahga.gov.cn:8082/',
        // 测试环境
    	// path: 'http://192.168.57.177:8304/'
    };
</script>
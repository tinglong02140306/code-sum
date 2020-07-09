package com.iflytek.sgy.wjewt.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import bingo.jmt.client.web.service.JmtClientService;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.fastjson.JSONObject;
import com.iflytek.sgy.social.comment.api.CommentService;
import com.iflytek.sgy.social.comment.api.dto.CommentSearchDto;
import com.iflytek.sgy.social.comment.api.model.CommentVo;
import com.iflytek.sgy.social.comment.api.model.ReplyVo;
import com.iflytek.sgy.social.orm.Page;
import com.iflytek.sgy.social.prise.api.PriseService;
import com.iflytek.sgy.social.prise.api.model.PriseVo;
import com.iflytek.sgy.social.uop.api.CollectionService;
import com.iflytek.sgy.social.uop.api.MenuContentService;
import com.iflytek.sgy.social.uop.api.MenuExtContentService;
import com.iflytek.sgy.social.uop.api.dto.Content;
import com.iflytek.sgy.social.uop.api.dto.MenuExtContent;
import com.iflytek.sgy.social.uop.api.dto.Result;
import com.iflytek.sgy.social.uop.api.dto.WbContentDto;
import com.iflytek.sgy.social.user.api.dto.User;
import com.iflytek.sgy.social.utils.UUIDUtils;
import com.iflytek.sgy.wjewt.base.BaseController;
import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.config.ApplicationConfig;
import com.iflytek.sgy.wjewt.service.impl.UserInfoService;
import com.iflytek.sgy.wjewt.util.HttpUtil;
import com.iflytek.sgy.wjewt.util.PageSizeLimit;

/**
 * 资讯controller
 *
 * @desc: cip-portal
 * @author: admin4
 * @createTime: 2016年8月1日 下午6:16:28
 * @history:
 * @version: v1.0
 */
@Controller
@RequestMapping(value = "/content")
public class MenuContentController extends BaseController {


	static RestTemplate restTemplate = new RestTemplate();
	 //微博视频地址  正则匹配
	private static final String WEIBO_VEDIO_MATCH = "\"stream_url\": \"(.*)\",";
	private static final String WEIBO_VEDIO_MATCH_HD = "\"stream_url_hd\": \"(.*)\",";
	public static final String GROUP_PREFIX = "group";

	static Pattern pattern = Pattern.compile(WEIBO_VEDIO_MATCH);
	static Pattern pattern_hd = Pattern.compile(WEIBO_VEDIO_MATCH_HD);
	/**
	 * 栏目内容服务
	 */
	@Autowired
	private MenuContentService menuContentService;
	@Autowired
	private PriseService priseService;
	/**
	 * TODO
	 */
	@Autowired
	private MenuExtContentService extContentService;
	/**
	 * 收藏service
	 */
	@Autowired
	private CollectionService collectionService;
	/**
	 * 系统配置
	 */
	@Autowired
	private ApplicationConfig config;

    /**
     * 点赞评论组件
     */
    @Autowired
    private CommentService commentService;

    /**
     * 本地数据库获取用户信息
     */
    @Autowired
    private UserInfoService userInfoService;

    /**
     * 根据id查询资讯详情
     *
     * @param id
     * @return Result
     * @author: admin4
     * @createTime: 2016年8月13日 下午5:12:54
     * @history:
     */
    @ResponseBody
    @RequestMapping(value="/getContentDetail", method = RequestMethod.POST)
    public Result getContentDetail(String id, String token,
                                   HttpServletRequest request, HttpServletResponse response) {
        Content detail = menuContentService.getContentDetail(id);
        if (detail == null) {
            return null;
        }
        List<MenuExtContent> extContents = extContentService
                .queryExtContentList(detail.getMid(), id);
        detail.setExtContents(extContents);
        // 获取用户id
        String userId = null;
        if (StringUtils.isNotBlank(token)) {
            userId = getUserIdByToken(token);
            // 判断是否收藏此资讯
            boolean isCollection = collectionService.isCollection(userId, id);
            detail.setCollection(isCollection);
        } else {
            userId = getCookie(request, response);
        }
        // 判断该资讯信息是否点赞过
        boolean isPrise = false;
        long priseCount = 0L;
        try {
            PriseVo prise = priseService.findPriseByUserIdAndObjId(userId, id);
            // 获取该资讯点赞数
            priseCount = priseService.findPriseCountByObjId(id);
            if (prise != null) {
                // 点赞过
                isPrise = true;
            }
        } catch (Exception e) {
            logger.error("调用查询是否点赞接口失败/获取点赞数接口失败！", e);
        }
        detail.setPrise(isPrise);
        detail.setPriseCount(priseCount);
        return Result.success(detail);
	}

	/**
	 *  ｛根据微博识别码实时获取播放地址｝
	 *  @param sbm
	 *  @return String
	 *  @author  xfzhu3
	 *  @created 2018年4月17日 下午7:52:49
	 *  @lastModified
	 *  @history
	 */
	@ResponseBody
	@RequestMapping(value="/getVideoUrlBySbm", method = RequestMethod.POST)
	public String getVideoUrlBySbm(String sbm){
		String vedioUrl = null;
		// 设置请求header
		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0");

		//请求微博url，获取containerid
		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(null, requestHeaders);
		//  需要修改，将微博id作为入参，抽离出单独的方法
		String responseData = restTemplate.postForObject("https://m.weibo.cn/status/"+sbm, requestEntity, String.class);

		Matcher m = pattern.matcher(responseData);
		while (m.find()) {
			 vedioUrl = m.group(1);
		}
		if(StringUtils.isBlank(vedioUrl)){
			Matcher m_hd = pattern_hd.matcher(responseData);
			while (m_hd.find()) {
				 vedioUrl = m_hd.group(1);
			}
		}
		return vedioUrl;
	}
	
	public Map<String, Object> getUserInfo() {
		 JmtClientService clientService = new JmtClientService();
        //获取登陆警民通云平台用户详细信息
        Map<String, Object> result = clientService.getCurrentUserDetail("wh_xfzn");
        if (result.get("code").toString().equals("1")) {
            //成功获取用户信息
            @SuppressWarnings("unchecked")
			Map<String, Object> userDetail = (Map<String, Object>) result.get("data");
            return userDetail;

        } else {
            System.out.println("获取用户信息失败");
            return null;
        }
    }

    /**
     * 获取资讯相关推荐列表
     *
     * @param cid
     * @return
     */
    @RequestMapping(value="/listRelativeContent", method = RequestMethod.POST)
    @ResponseBody
    public List<Content> getRelativeContent(String cid) {
        if (StringUtils.isNotEmpty(cid)) {
            List<Content> list = menuContentService.listRelativeContent(cid);
            //处理图片地址
            for (Content content : list) {
                if (StringUtils.isNotBlank(content.getImgUrl1()) &&StringUtils.startsWith(content.getImgUrl1(),GROUP_PREFIX)) {
                    content.setImgUrl1(config.fastdfsAddress + content.getImgUrl1());
                }
                if (StringUtils.isNotBlank(content.getImgUrl2()) &&StringUtils.startsWith(content.getImgUrl2(),GROUP_PREFIX)) {
                    content.setImgUrl2(config.fastdfsAddress + content.getImgUrl2());
                }
                if (StringUtils.isNotBlank(content.getImgUrl3())  &&StringUtils.startsWith(content.getImgUrl2(),GROUP_PREFIX)) {
                    content.setImgUrl3(config.fastdfsAddress + content.getImgUrl3());
                }
            }
            return list;
        } else {
            return null;
        }

    }


    /**
     * 获取审核通过的评论分页列表，[树形结构]
     *
     * @param currentPageNo
     * @param majorId       评论对象Id，如资讯id
     * @param deviceId      设备id
     * @param pageSize
     * @author xlwang9
     */
    @RequestMapping(value="/getCommentCheckPage", method = RequestMethod.POST)
    @ResponseBody
    public Page<CommentVo> getCommentCheckPage(String currentPageNo,
                                               String majorId,
                                               String pageSize,
                                               String token,
                                               String deviceId,
                                               HttpServletRequest request,
                                               HttpServletResponse response,
                                               String osType) {
		//设定分页条数的大小限制
		pageSize = String.valueOf(PageSizeLimit.getPageSizeLimit(Integer.valueOf(pageSize)));
        //构造查询条件
        int currentPageNoInt = com.iflytek.sgy.social.utils.StringUtils.isBlank(currentPageNo) ? SysCode.PAGE_NO : Integer.parseInt(currentPageNo);
        int pageSizeInt = com.iflytek.sgy.social.utils.StringUtils.isBlank(pageSize) ? SysCode.PAGE_SIZE : Integer.parseInt(pageSize);
        CommentSearchDto commentSearchDto = new CommentSearchDto(config.commentUop, currentPageNoInt, pageSizeInt);
        commentSearchDto.setMajorId(majorId);
        commentSearchDto.setOrderBy(SysCode.ORDERBY_DESC);
        commentSearchDto.setCheckState(SysCode.COMMENT_CHECK_STATE.PASS);

        Page<CommentVo> page = new Page<>();
        //存放用户信息
        Map<String, List<Object>> userInfo = new HashMap<String, List<Object>>();
        //存放评论点赞数及是否点赞信息
        Map<String, Object> commentPrise = null;
        //存放评论回复点赞数及是否点赞信息
        Map<String, Object> replyPrise = null;
        String userId = null;
        if (com.iflytek.sgy.social.utils.StringUtils.isNotBlank(token)) {
            userId = getUserIdByToken(token);
        } else if (com.iflytek.sgy.social.utils.StringUtils.isBlank(token) && com.iflytek.sgy.social.utils.StringUtils.isNotEmpty(deviceId)) {
            userId = deviceId;
        } else {
            userId = getCookie(request, response);
        }

        try {
            page = commentService.getCommentCheckPage(commentSearchDto);
            List<CommentVo> commentVos = page.getRows();
            for (CommentVo commentVo : commentVos) {
                commentPrise = new HashMap<>();
                List<ReplyVo> rlist = commentVo.getReplyList();
                //获取评论点赞数
                commentPrise.put("priseCount", priseService.findPriseCountByObjId(commentVo.getCommentId()));
                PriseVo prise = priseService.findPriseByUserIdAndObjId(userId, commentVo.getCommentId());
                String isPrise = "0";
                if (prise != null) {
                    isPrise = "1";
                }
                commentPrise.put("isPrise", isPrise);
                commentVo.setMap(commentPrise);

                if (SysCode.IS_OR_NOT.not == commentVo.getIsAdmin()) {
                    //设置评论用户信息
                    userInfo = putUserInfo(userInfo, commentVo.getFromUser());
                    putCommentVoUser(userInfo, commentVo);
                } else {
                    commentVo.setFromUserName(SysCode.ADMIN_NAME);
                    commentVo.setFromUserImage(null);
                }

                ArrayList<ReplyVo> replyList = commentVo.getReplyList();
                //存放审核通过的回复集合
                ArrayList<ReplyVo> replyVos = new ArrayList<ReplyVo>();
                for (ReplyVo replyVo : replyList) {
                    if (SysCode.COMMENT_CHECK_STATE.PASS == replyVo.getCheckState()) {
                        if (replyVo.getIsAdmin() != null && SysCode.IS_OR_NOT.not == replyVo.getIsAdmin()) {
                            //设置回复用户信息
                            userInfo = putUserInfo(userInfo, replyVo.getFromUser());
                            putReplyVoUser(userInfo, replyVo);
                        } else {
                            replyVo.setFromUserName(SysCode.ADMIN_NAME);
                            replyVo.setFromUserImage(null);
                        }
                        if (replyVo.getToUserIsAdmin() == null) {
                            replyVo.setToUserName("");
                        } else if (SysCode.IS_OR_NOT.not == replyVo.getToUserIsAdmin()) {
                            //设置回复用户信息
                            userInfo = putUserInfo(userInfo, replyVo.getFromUser());
                            String toUser = replyVo.getToUser();
                            if (userInfo.containsKey(toUser)) {
                                replyVo.setToUserName((String) userInfo.get(toUser).get(1));
                            }
                        } else {
                            replyVo.setToUserName(SysCode.ADMIN_NAME);
                        }
                        replyPrise = new HashMap<>();
                        //获取评论回复的点赞数
                        replyPrise.put("priseCount", priseService.findPriseCountByObjId(replyVo.getReplyId()));
                        PriseVo priseVo = priseService.findPriseByUserIdAndObjId(userId, replyVo.getReplyId());
                        String isPriseVo = "0";
                        if (priseVo != null) {
                            isPriseVo = "1";
                        }
                        replyPrise.put("isPrise", isPriseVo);
                        replyVo.setMap(replyPrise);

                        replyVos.add(replyVo);
                    }
                }
                commentVo.setReplyList(replyVos);
            }
            return page;
        } catch (Exception e) {
            logger.error("评论分页异常：", e.getMessage());
            return page;
        }
    }


    /**
     * 获取用户头像和昵称信息
     *
     * @param userInfo 用户信息
     * @param formUser 用户id
     * @author xlwang9
     */
    public Map<String, List<Object>> putUserInfo(Map<String, List<Object>> userInfo, String formUser) {
        if (!userInfo.containsKey(formUser)) {
            List<Object> list = new ArrayList<Object>();
            User user =userInfoService.getUserInfo(formUser);
            try {
                String fromUserImage = com.iflytek.sgy.social.utils.StringUtils.isNotBlank(user.getPhotoUrl()) ? config.fastdfsAddress+user.getPhotoUrl():null;
                list.add(fromUserImage);
            } catch (Exception e) {
                list.add("");
                logger.error("获取用户头像出错：", e.getMessage());
            }
            try {
                String fromUserName = user.getNickName();
                if (com.iflytek.sgy.social.utils.StringUtils.isEmpty(fromUserName)) {
                    fromUserName = SysCode.USER_DEFAULT_NAME;
                }
                list.add(fromUserName);
            } catch (Exception e) {
                list.add("");
                logger.error("获取用户昵称出错：", e.getMessage());
            }
            userInfo.put(formUser, list);
        }
        return userInfo;
    }

    /**
     * 设置评论用户信息
     *
     * @param userInfo
     * @param commentVo
     * @author xlwang9
     */
    public void putCommentVoUser(Map<String, List<Object>> userInfo, CommentVo commentVo) {
        String fromUser = commentVo.getFromUser();
        if (userInfo.containsKey(fromUser)) {
            commentVo.setFromUserImage((String) userInfo.get(fromUser).get(0));
            commentVo.setFromUserName((String) userInfo.get(fromUser).get(1));
        }
    }

    /**
     * 设置回复用户信息
     *
     * @param userInfo
     * @param replyVo
     * @author xlwang9
     */
    public void putReplyVoUser(Map<String, List<Object>> userInfo, ReplyVo replyVo) {
        String fromUser = replyVo.getFromUser();
        if (userInfo.containsKey(fromUser)) {
            replyVo.setFromUserImage((String) userInfo.get(fromUser).get(0));
            replyVo.setFromUserName((String) userInfo.get(fromUser).get(1));
        }
    }


    /**
     * @param token
     * @return String
     * @author: admin4
     * @createTime: 2017年11月18日 下午4:25:08
     * @history:
     */
    String getUserIdByToken(String token) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("Authorization", "Bearer" + token);
        String result = "";
        try {
            result = HttpUtil.doGet(config.getGETUSERID_URL(), params);
            JSONObject res = JSONObject.parseObject(result);
            if (res != null && res.getBooleanValue("flag")) {
                JSONObject json = (JSONObject) res.get("data");
                String userId = json.getString("id");
                return userId == null ? null : userId.replace("-", "");
            }
        } catch (Exception e) {
            logger.error("调用获取登录用户接口失败：");
            // throw new UserException("用户未登录或token失效");
        }

		return null;
	}

	/**
	 * 微信端-警网头条列表（不区分栏目和区域）
	 * 
	 * @author: admin4
	 * @createTime: 2017年12月4日 下午4:27:08
	 * @history:
	 * @param page
	 * @return Result
	 */
	@ResponseBody
	@RequestMapping(value="/getPoliceList", method = RequestMethod.POST)
	public Result getPoliceList(Page<Content> page) {
		return Result.success(menuContentService.getPoliceContentList(page));
	}

	/**
	 * ｛H5站点-警网头条-列表｝
	 * 
	 * @param page
	 *            分页
	 * @param areaId
	 *            区域id
	 * @return Result 返回结果对象
	 * @author xfzhu3
	 * @created 2018年4月9日 下午5:15:27
	 * @lastModified
	 * @history
	 */
	@ResponseBody
	@RequestMapping(value="/getPoliceContentList", method = RequestMethod.POST)
	public Result getPoliceContentList(Page<Content> page, String areaId) {
		return Result.success(menuContentService.getPoliceContentList(page,
				areaId));
	}

	/**
	 * ｛H5站点-警微热点-列表｝
	 * 
	 * @param page
	 *            分页
	 * @return Result 返回值
	 * @author xfzhu3
	 * @created 2018年4月10日 上午9:31:15
	 * @lastModified
	 * @history
	 */
	@ResponseBody
	@RequestMapping(value="/getPoliceWbContentList", method = RequestMethod.POST)
	public Result getPoliceWbContentList(Page<WbContentDto> page) {
		//设定分页条数的大小限制
		page.setPageSize(PageSizeLimit.getPageSizeLimit(page.getPageSize()));
		page = menuContentService.getPoliceWbContentList(page, null);
		if (CollectionUtils.isNotEmpty(page.getRows())) {
			List<WbContentDto> list = page.getRows();
			for (WbContentDto item : list) {
				// 收藏数
				long collectionCount = menuContentService
						.getCollectionCountById(item.getId());
				item.setCollectionCount(collectionCount);
				// 判断该资讯信息是否点赞过
				boolean isPrise = false;
				long priseCount = 0L;
				try {
					// 获取该资讯点赞数
					priseCount = priseService.findPriseCountByObjId(item
							.getId());
				} catch (Exception e) {
					logger.error("调用查询是否点赞接口失败/获取点赞数接口失败！", e);
				}
				item.setPrise(isPrise);
				item.setPriseCount(priseCount);
				// 获取分享数
				long shareCount = menuContentService.getShareCountById(item
						.getId());
				item.setShareCount(shareCount);
			}
			page.setRows(list);
		}
		return Result.success(page);
	}

	/**
	 * ｛警微热点-详情信息｝
	 * 
	 * @param id
	 *            警微热点对象id
	 * @return Result 返回值对象
	 * @author xfzhu3
	 * @created 2018年4月10日 下午3:26:21
	 * @lastModified
	 * @history
	 */
	@ResponseBody
	@RequestMapping(value="/getWbContentById", method = RequestMethod.POST)
	public Result getWbContentById(String id) {
		WbContentDto wbContentDto = menuContentService.getWbContentById(id);
		if (wbContentDto != null) {
			// 获取分享数
			long shareCount = menuContentService.getShareCountById(id);
			wbContentDto.setShareCount(shareCount);
			// 收藏数
			long collectionCount = menuContentService
					.getCollectionCountById(id);
			wbContentDto.setCollectionCount(collectionCount);
			// 判断该资讯信息是否点赞过
			boolean isPrise = false;
			long priseCount = 0L;
			try {
				// 获取该资讯点赞数
				priseCount = priseService.findPriseCountByObjId(id);
			} catch (Exception e) {
				logger.error("调用查询是否点赞接口失败/获取点赞数接口失败！", e);
			}
			wbContentDto.setPrise(isPrise);
			wbContentDto.setPriseCount(priseCount);
		}
		return Result.success(wbContentDto);
	}
	/**
	 *  ｛H5站点分享数保存与查询｝
	 *  @param resId 热点对象id
	 *  @return Result
	 *  @author  xfzhu3
	 *  @created 2018年4月16日 上午8:46:07
	 *  @lastModified       
	 *  @history           
	 */
	@ResponseBody
	@RequestMapping(value="/saveShare", method = RequestMethod.POST)
	public Result saveShare(String resId){
		//保存分享数
		menuContentService.saveShare(resId);
		//获取分享总数
		long num = menuContentService.getShareCount(resId);
		return Result.success(num);
	}

	/**
	 * 从cookie中取随机生成的用户id
	 * 
	 * @author: yanzhang9
	 * @createTime: 2016年11月3日 上午11:11:39
	 * @param request
	 * @param response
	 * @return String
	 */
	private String getCookie(HttpServletRequest request,
			HttpServletResponse response) {
		String userId = null;
		if (request.getCookies() != null) { // 如果Cookie不为空
			for (Cookie cookie : request.getCookies()) { // 遍历Cookie
				if (cookie.getName().equals("userIdPrise")) // 如果Cookie名为userIdPrise
					userId = cookie.getValue(); // 保存userId内容
			}
		} else {
			userId = UUIDUtils.getUUID();// 随机生成用户id并存入cookie
			Cookie cookie = new Cookie("userIdPrise", userId);
			cookie.setPath("/");
			response.addCookie(cookie);
		}
		return userId;
	}

}

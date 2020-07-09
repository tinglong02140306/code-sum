/**
 * @author yaoding
 * @time 2017-11-09
 * @description 首页
 */
'use strict';

require.config(__FRAMEWORK_CONFIG__);
require.async([
	'common',
	'share',
	'slider'
], function(common, share, slider) {
	var AID, // 当前区域id
		areaId, // 区域id 中介值
		ACODE,
		ANAME,
		DEVICE = "", // 设备号
		REQUEST, //请求参数
		TOKEN = "", // 用户token
		CPAGE = 1, // 当前页
		OS = common.phoneOs(), // 终端类型
		INDEX = 1,
		swiper, // swiper 对象
		currIndex = 0, // 头条类型 tab index值 0 推荐 1 本地 2警微热点
		localCity, // 当前城市名 单位为地级市
		mescrollHome, // 首页整个对应的mescroll对象
		cpageArr = [1,1,1], // 3个菜单所对应的当前页
		currTabOffset = new Array(3), // 3个菜单所对应的当前位置
		tabRequestFlag = [true, true, true], // 判断对应tab是否请求过数据
		curConItemTotal = new Array(3),  // 当前tab对应的数据总数
		initTopOffset = $('#swiperContainer').offset().top - $('.home-top').height() - $('.tab-wrapper').height(),
		tabScrollFlag = false,
		firInitFlag = true,  // 是否首次初始化
		shareListFlag = true, // 标记是否渲染分享列表
		subHeight = $('.home-top').outerHeight(),
		opticity,
		top,
		scrollTop,
        tabTop,
		shareId = '',
		praiseIndex = 1,
		collectIndex = 1,
		requestNewsIndex = 1,
		newsPageSize = 6, // 警网头条每次加载的条数
		i = 0,
		platForm = common.checkMobilePlatform(),
		lunboSwiper,  // 轮播图swiper
		OBJ = {
			shareType: croods.shareType.WebPage,
			shareText: "",
			url: CONFIG.shareFile,
			title: CONFIG.appName,
			site: CONFIG.appName,
			titleUrl: CONFIG.shareFile,
			siteUrl: CONFIG.shareFile,
			imageUrl: CONFIG.shareImg //服务器上的图片
		},
		options = [{
			icon: "qq",
			platform: "QQ",
			type: 1
		}, {
			icon: "qzone",
			type: 2,
			platform: "QQ空间"
		}, {
			icon: "session",
			type: 4,
			platform: "微信"
		}, {
			icon: "timeline",
			type: 5,
			platform: "朋友圈"
		}];
	var vm = window.vm = fly.observable({
		// 搜索
		searchEvent: function() {
			var url = JSON.stringify({
					'isAddHeader': '0',
					'serviceAddr': 'police-search-type.html?searchTypeTxt=警网头条',
					'serviceName': ''
				}),
				REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@local@Third@url=" + url);
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: REQUEST,
				success: function(res) {}
			});
		}
	});
	var renderEvent = { // 渲染模块
		/**
		 * 渲染头部
		 */
		renderHeader: function() {
			if ($('.home-top').hasClass('hide')) {
				$('.home-top').removeClass('hide');
			}
			$('.home-top').css({
				'background': '-webkit-gradient(linear, 0 100%, 100% 0, from(rgba(82,181,246,0)), to(rgba(37,156,247, 0)))'
			});
			mescrollHome.endSuccess();
		},

		/**
		 * 加载当前滚动条
		 */
		renderScroll: function() {
			var mescroll = new MeScroll('wrapper', {
				down: { // 下拉配置
					callback: function(mescroll) {
						//请求消息
						renderEvent.renderMessage();
						//请求轮播图运营位
						requestEvent.requestPicOperationData();
						//请求推荐服务
						requestEvent.requestService();
						// 渲染头部
						renderEvent.renderHeader();

						cpageArr = [1,1,1]; // 3个菜单所对应的当前页
						mescrollHome.optUp.page.num = 1;

						// 事件绑定
				        requestEvent.requestNewData(currIndex);

        				
                    },
					isBounce: false,
					offset: 60,
					onMoving: function(mescroll, rate, downHight) {
						if (downHight > 60) {
							$('.home-top').addClass('hide');
						} else if(downHight < 60) {
							$('.home-top').removeClass('hide');
						}
					}

				},
				up: { // 上拉配置
					noMoreSize: 15,
					isBounce: false,
					htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
					callback: function(page, mescroll) {
						cpageArr[currIndex] = page.num;
						// 请求资讯列表
						requestEvent.requestNewData(currIndex);
					},
					page: {
						size: newsPageSize
					}
				}
			});
			return mescroll;
		},
		/**
		 * 渲染当前市
		 * @param {[object]} [data] [列表数据]
		 */
		renderCurrentCity: function(data) {
			if (data.areaName.length > 8) {
				data.areaName = data.areaName.substring(0, 8) + '...';
			}
			$('#areaName').text(data.areaName);
			AID = data.areaId ? data.areaId : '';
			ANAME = data.areaName ? data.areaName : '';
			ACODE = data.areaCode ? data.areaCode : ''; // 安徽的areaCode "340000000000"
			requestEvent.getDevice(); // 获取设备id

			// 判断是否启动定位 首页用户选择的是安徽则启动定位、否则不启动定位
			if (ACODE == '340000000000') {
				handleEvent.bindLocationEventBaidu(); // 使用croods精确定位
			} else {
				localCity = data.areaName;
				setTimeout(function() {
					//初始化首页
                    indexInit()
				}, 200);
			}
		},

		/**
		 * 渲染消息
		 */
		renderMessage: function(token) {
			if (token) {
				TOKEN = token;
			}
			if (TOKEN) {
				croods.ajax({
					method: 'db91d31d7b5f41eb8a4242c1e830ff94',
					params: {
						token: TOKEN,
						osType: OS
					},
					//请求参数
					success: function(res) { //请求成功回调
						if (common.checkToken(res, function(newToken) {
								renderEvent.renderMessage(newToken);
								INDEX++;
							}, INDEX)) { // token正常
							var res1 = JSON.parse(res),
								data = res1.data;
							// data：1标识有消息，否则无消息
							if (data) {
								$('.message-wrap i').removeClass('hide');
							} else {
								$('.message-wrap i').addClass('hide');
							}
						} else { // token失效

						}
					},
					fail: function(res) { //请求失败回调
					}
				});
			}

		},

		/**
		 * 渲染轮播图
		 * @param {[object]} [data] [列表数据]
		 */
		renderPic: function(data) {
			var tmpl,
				dom;
			if (!$.isEmptyObject(data)) {
				//无图片时，默认图片
				if (!data.scroll || data.scroll.length == 0) {

					dom = '<div class="swiper-slide"><img data-src="' + CONFIG.path + 'img/home/default.png"  src="' + CONFIG.path + 'img/home/default.png">';
					$("#swiperWrapperLunbo").append(dom);
					$("#swiperWrapperLunbo").height(8.98 + "rem");
				} else {
					for (var i = 0; i < data.scroll.length; i++) {
						var obj = data.scroll[i];
						obj.imgUrl = obj.imgUrl + '?crosscache=1';
						if (!obj.htmlUrl) {
							obj.url = '';
						} else {
							obj.url = JSON.stringify({
								'isAddHeader': obj.isAddHeader ? obj.isAddHeader : '',
								'serviceAddr': obj.htmlUrl ? obj.htmlUrl : '',
								'serviceName': obj.name ? obj.name : '',
								'authType': obj.authType ? obj.authType : '1'
							});
						}
					}
					if (data.scroll.length > 1) {
						tmpl = fly.template('bannerTmpl', data);
						$("#swiperWrapperLunbo").html(tmpl);
						handleEvent.initLunboSwiper(); // 初始化轮播图
					} else {
						tmpl = fly.template('bannerTmpl', data);
						$("#swiperWrapperLunbo").html(tmpl);
						/*var h = $(".home-banner .slider ul li");
						h.parent().parent().height(h.height());*/
					}
					$('#swiperContainerLunbo img').off('error').on('error', function() {
						$(this).attr('src', CONFIG.path + 'img/home/owl-default.png');
					});
				}
			} else {
				dom = '<div class="swiper-slide"><img data-src="' + CONFIG.path + 'img/home/default.png"  src="' + CONFIG.path + 'img/home/default.png">';
				$("#swiperWrapperLunbo").append(dom);
				$("#swiperWrapperLunbo").height(8.98 + "rem");
			}
		},

		/**
		 * 渲染服务推荐位
		 * @param {[object]} [data] [列表数据]
		 */
		renderServices: function(data) {
			$('.app-slider ul').remove();
			$('.home-app-entrance .dot').remove();
			for (var i = 0, len = data.length; i < len; i++) {
				data[i].info = JSON.stringify(data[i].androidDetail);
				data[i].iconUrl = data[i].iconUrl + '?crosscache=1';
			}
			var z, //分页数，等于x或者x+1
				x, //商，数据的长度除以每页固定的个数得出
				l, //数据的长度
				res = [], //存储每页的个数，例：总共20个数据，每页8个，则需要分3页
				y; //余数
			l = data.length;
			x = parseInt(l / 8);
			y = l % 8;
			y > 0 ? z = x + 1 : z = x; //如果有余数就进1，意味着要多分一页
			for (var j = 0; j < z; j++) {
				res[j] = data.slice(8 * j, 8 * (j + 1)); //分割数组，每个数组8个
			}
			if (l > 4) {
				$('.app-slider').height('6.7rem');
			} else {
				$('.app-slider').height('3.35rem');
			}
			var requestTmpl = fly.template('appTmpl', res);
			$(".app-slider").html(requestTmpl);

			if (l > 8) {
				$(".app-slider").appSlider({});
			}
			if (l > 0) {
				$('.home-app-entrance').css({
					padding: "0rem 0.44rem"
				})
				var h = $('.home-wrap .app-slider ul li');
				h.height(h.parent().height()); //所有li不留白
			} else {
				$('.home-app-entrance').css({
					padding: 0
				})
			}
		},

		/**
		 * 渲染运营位
		 * @param {[object]} [data] [列表数据]
		 */
		renderOperation: function(data) {
			$(".activity-content").empty();
			if (!$.isEmptyObject(data.operationContent)) {
				var res2 = data.operationContent,
					len = res2.length,
					arr = [];
				if(len > 3) {
					for(var i = 0; i < 3; i++) {
						arr.push(res2[i]);
					}
					res2 = [];
					res2 = arr;
				}
				if (len == 0) {
					$('.home-activity').addClass('hide');
					$('.convenience-interval').addClass('hide');
					return;
				} else {
					$('.convenience-interval').removeClass('hide');
					$('.home-activity').removeClass('hide');
				}
				/*len < 4 ? res2.push({
					imgUrl: CONFIG.path + 'img/home/banner1.png',
					name: '户政治安'
				}) : true;*/
				len < 3 ? res2.push({
					imgUrl: CONFIG.path + 'img/home/banner2.png',
					name: '出入境'
				}) : true;
				len < 2 ? res2.push({
					imgUrl: CONFIG.path + 'img/home/banner5.png',
					name: '交管'
				}) : true;
				len < 1 ? res2.push({
					imgUrl: CONFIG.path + 'img/home/banner4.png',
					name: '边防'
				}) : true;
				for (var i = 0; i < res2.length; i++) {
					var obj = res2[i];
					obj.url = JSON.stringify({
						isAddHeader: obj.isAddHeader ? obj.isAddHeader : '',
						serviceAddr: obj.htmlUrl ? obj.htmlUrl : '',
						serviceName: obj.name ? obj.name : '',
						authType: obj.authType ? obj.authType : '1'
					});
					if (obj.imgUrl) {
						obj.imgUrl = obj.imgUrl + '?crosscache=1';
					}
					res2[i].url = obj.url;
					res2[i].imgUrl = obj.imgUrl
				}
				var tmpl = fly.template('activityTmpl', res2);
				$(".activity-content").html(tmpl);

				// 办事大厅图片error处理
				$('.activity-content img').off('error').on('error', function() {
					var that = $(this),
						index = that.parent().index();
					if (index == 0) {
						that.attr('src', CONFIG.path + 'img/home/banner1.png');
					}
					if (index == 1) {
						that.attr('src', CONFIG.path + 'img/home/banner2.png');
					}
					if (index == 2) {
						that.attr('src', CONFIG.path + 'img/home/banner5.png');
					}
					/*if (index == 3) {
						that.attr('src', CONFIG.path + 'img/home/banner4.png');
					}*/
				});
			}
		},

		/**
		 * 渲染网警头条
		 * @param {[int]} [CPAGE] [当前页]
		 * @param {[object]} [data] [列表数据]
		 */
		renderNews: function(data) {
			var res = data.rows;
			if (!$.isEmptyObject(res)) {
				if (currIndex == 0 || currIndex == 1) {
					for (var i = 0, len = res.length; i < len; i++) {
						var obj = res[i],
							imgUrl1 = obj.imgUrl1, // 资讯图片1
							imgUrl2 = obj.imgUrl2, // 资讯图片2
							imgUrl3 = obj.imgUrl3; // 资讯图片3
						if (obj.clickCount) {
							if (obj.clickCount > 9999) {
								obj.clickCount = '9999+';
							}
						} else {
							obj.clickCount = 0;
						}
						obj.releaseDate = common.getTimeRange(obj.releaseDate);
						if (imgUrl1 && imgUrl2 && imgUrl3) {
							obj.tag = 3;
							obj.imgUrl1 = imgUrl1 + common.getListImgSize(4.8 * 2, 0.75);
							obj.imgUrl2 = imgUrl2 + common.getListImgSize(4.8 * 2, 0.75);
							obj.imgUrl3 = imgUrl3 + common.getListImgSize(4.8 * 2, 0.75);
						} else if (imgUrl1 || imgUrl2 || imgUrl3) {
							obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + common.getListImgSize(4.7 * 2, 0.75);
							obj.tag = 1;
						} else {
							obj.tag = 0;
						}
					}
				} else if (currIndex == 2) {
					for (var i = 0, len = res.length; i < len; i++) {

						res[i].multiple = i + (cpageArr[currIndex] -1) * newsPageSize;  // 列表项中的index值

						// 点赞 收藏 状态处理
						res[i].collection = typeof res[i].collection != 'string' ? (res[i].collection).toString() : res[i].collection;
                        res[i].prise = typeof res[i].prise != 'string' ? (res[i].prise).toString() : res[i].prise;

						// 数据格式处理
						res[i].shareCount = res[i].shareCount > 9999 ? '9999+' : res[i].shareCount;
						res[i].collectionCount = res[i].collectionCount > 9999 ? '9999+' : res[i].collectionCount;
						res[i].priseCount = res[i].priseCount > 9999 ? '9999+' : res[i].priseCount;

						// 带标签的文章内容处理
                        var resultArr = common.getContent(res[i].content, 140);
                        res[i].content = resultArr[0];
                        res[i].notFull = resultArr[1];

						// 图片预览
						if (res[i].appendixType == 1) {
							var imgList = [];
							for (var j = 0; j < res[i].appendixList.length; j++) {
								if(!!res[i].appendixList[j]) { 
									var gifFlag = res[i].appendixList[j].indexOf('gif'); // 是否为动图标志位
									if (gifFlag <= -1) {
										res[i].appendixList[j] = CONFIG.viewPath + res[i].appendixList[j];
									}
									imgList.push(res[i].appendixList[j]);
								}
								
							}
							imgList = JSON.stringify(imgList);
							res[i].imgList = imgList;
							res[i].appendixList = $.parseJSON(imgList);  // 容错处理
						} else if (res[i].appendixType == 2) { // 视频播放
							res[i].appendixAddress = CONFIG.viewPath + res[i].appendixAddress;
						}
					}
				}
				if (cpageArr[currIndex] == 1) {
					$('#dataList' + currIndex).empty();
				}

				fly.template.config('escape', false);  // 将html标签内容转换成文本内容
				var tmpl,
					wrapperSel;
				if(currIndex == 0 || currIndex == 1) {
					tmpl = fly.template('notifyTmpl', res);
				}else if(currIndex == 2) {
					tmpl = fly.template('blogTmpl', res);
				}	
				wrapperSel = '#wrapper' + currIndex;
				$('#dataList' + currIndex).append(tmpl);
				fly.template.config('escape', true);

				if(currIndex == 2) {
					// 警微热点内容行间距微调
			        if(OS == 'IOS') {
			            $('.article-sec, .article-sec .content-text').addClass('blog-con-line');
			        }
                    // 图片预览
                    mui.previewImage({ 
                        header: '',
                        footer: '<span class="mui-preview-indicator"></span><div class="mui-preview-btn save-logo">保存</div>'
                    }); // 插件预览
                }
				$('.content .city-news img, img').off('error').on('error', function() { // 图片error处理
					$(this).attr('src', CONFIG.path + 'img/home/list-default.png');
				});
				// 懒加载
				$("img.lazy", $(wrapperSel + " .city-news li.unloaded," + wrapperSel + " .city-news .item-content .unloaded")).lazyload({
					container: $(wrapperSel),
					threshold: 200,
					placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAYAAAA3d5OIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5NDFERjlDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5NDFERkFDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDk0MURGN0MyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDk0MURGOEMyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsaTlT0AAAToSURBVHja7N1LbttWFIBh6mFbsOVOu4yiC+mwaYpuIcvxDooCDZpZVpJlJAOP6rdll0cQU1doLFq694o0vw8g0jhpIjP6zXMpUh6dn59XT/xQb+/q7ad6+74CtvW53j7W21m9fWo+OFoFN6m3P+rtF/sJkntfb7/V22K6+oDYIJ9oa1xvb8arMVJskNfP0dp4tWYD8nsXwb21H6CI5Ug5tx+giO/G9gGUIzgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHggMEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOBAcIDgQHAgOEBwIDhAcCA4QHAgOBAcsKupXdB/t7e3y22xWFSj0aiaTCbVbDZb/ojgSOji4qK6u7v7+vPHx8fq4eFh+bHj4+Pq8PDQTjJSksL19fV/Ylt3eXm5POohOBK4ublJ8nsQHBvEkSvGx03u7+/tLMGB4OjTP9x4vDwjuYkzlYIjgYitzRnIo6MjO0twpLDptbb49enUKz9d4l+j50e5+Xy+PBMZL3zH62/NGBmxHRwc2EmCI3V0EVdszVnLNms7BEeC+LCGAwQHghukWHvFFSHNSQ+s4cgkLkCOrRFnFuMqf+sxRzgyxxbi6v+45QbBkVCEtR5bI8bLb/0aguOFYq0W96ptOvo9d68bgqOlGBnb3FoTUeY8keJkTXlOmhR2dXXV+i7sCCLiPD09Tf444lKweCxN+E7WOMK9ynXbS+/AjjgjjNSPI46eT4+y8bHUfw+C6/S67Vuai5NzP47m3b8QXK81o2GbdVuKUXSX9WP8PdZ0ghvMuu25aNfHwJdq8y5e8ecbLQXXWynHtF3Wcy95HLGeM1oKrndynPDYJuBtHofRUnCDW7ftMhruOoo2/x+C64XcL1q3jXmX9WO8KO6NZAXXefEkzX1ZVpuXGVKsH+MSM6Ol4DorjgqlzvI990J6HNVSjIRGS8F1et1W+skZca+/nXmzfkz5RcRoKbjOiSf5Psav9ZMiOdaPqV54FxxJxFpnX984I+Jqjmg5149GS8F1Zt227xtG4zFEEDnXj3GEc2Os4Pbq6dFl30pcHRLBGS0Ftze7Xt/Y188ZwRX3f2cIh8BoKbjitrmZ9DXZ50kiwQ1w3WasGuY4LbjCcl6U3McvPEZLwWVftzlL968Yq42WgsvCe34YLQVXSI6bSV/TaGnfCM66rfDR32gpuGQjk3vCjJaCK3RSwHv8Gy0FZ93W2dHSFyjBbb1uw2gpOOu2zn+xciWO4Frzvdl2581kBdeK7z6ajjeTFdyzunQz6WsZLZ10EpzFvtFScF0Yf1wpYbQUXKGvwt53Me9o6ayl4L6u2zwZ8vNmsoJbclFyOb5PwcCD85Zv5UfLoZ+1HHRwRpz9jJaCg1JPuPGwn3LTIX/yJycnxso1o9Eo2587mUyq2WwmuMF+8tNpNZ/PVYaREgQHCA4EBwgOBAeCAwQHggMEB4IDwQGCA8EBggPBAYIDwYHgAMGB4ADBgeBAcIDgQHCA4EBwgOBAcCA4QHAgOEBwIDgQHCA4EBwgOBAcCM4uAMGB4ADBQa+C+9tugCI+R3B/2g9QxMcI7sx+gCLOIrhP9faXfQFZfYjWmpMmv9bbe/sEsogD2tv4jya4xeoDP9bb7/X2xT6CnXxZtRRNvVk1Vv0jwABSdjl9DH5YIgAAAABJRU5ErkJggg=="

				});
				$(wrapperSel + " .city-news li.unloaded," + wrapperSel + " .city-news .item-content .unloaded").removeClass('unloaded');	
			}
		}
	};

	var requestEvent = { // 请求模块
		/**
		 * 获取轮播图和运营位数据
		 */
		requestPicOperationData: function() {
			var picData = JSON.parse(localStorage.getItem('picData' + AID)); // 轮播图缓存数据
			if (picData) {
				// 渲染轮播图
				renderEvent.renderPic(picData);
				// 渲染运营位
				renderEvent.renderOperation(picData);
			} else {
				// 渲染轮播图
				renderEvent.renderPic({
					scroll: []
				});
				renderEvent.renderOperation({
					operationContent: []
				});
			}

			croods.ajax({
				method: '034a4a1448ae461cb0431fdc6d68b537',
				params: {
					areaId: AID,
					osType: OS
				},
				//请求参数
				success: function(res) { //请求成功回调
					res = JSON.parse(res);
					var data = res.data;
					if (data) {
						localStorage.setItem('picData' + AID, JSON.stringify(data));
						// 渲染轮播图
						renderEvent.renderPic(data);
						// 渲染运营位
						renderEvent.renderOperation(data);
					}
				},
				fail: function(res) { //请求失败回调
					renderEvent.renderPic({
						scroll: []
					});
					renderEvent.renderOperation({
						operationContent: []
					});

				},
				complete: function(res) {
					if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
						common.toast('网络无法连接，请检查您的网络');
					}
				}
			});
		},

		/**
		 * 获取推荐服务
		 */
		requestService: function() {
			croods.customPlugin({
				action: 'HomePlugin.getTJFWService',
				params: {},
				success: function(res) {}
			});
		},

		/**
		 * 获取资讯数据
		 */
		requestNewData: function(index) {
			var param,
				newsData, // 资讯微博数据汇总
				code;
			switch (index) {
				case 0:
					param = {
						areaId: '',
						currentPageNo: cpageArr[currIndex],
						pageSize: newsPageSize
					};
					code = '2fe8839e9ecf47fc9b427875f085b5be';
					areaId = '';
					newsData = JSON.parse(localStorage.getItem('notifyData' + areaId));
					break;
				case 1:
					param = {
						areaId: localCity,
						currentPageNo: cpageArr[currIndex],
						pageSize: newsPageSize
					};
					code = '2fe8839e9ecf47fc9b427875f085b5be';
					areaId = localCity;
					newsData = JSON.parse(localStorage.getItem('notifyData' + areaId));
					break;
				case 2:
					param = {
						deviceId: DEVICE, // 设备ID
						token: TOKEN, // 用户登录的TOKEN
						currentPageNo: cpageArr[currIndex],
						pageSize: newsPageSize
					};
					code = 'ba9c4e2493b245f5b8ea9037691f3167';
					areaId = '';
					newsData = JSON.parse(localStorage.getItem('BlogData' + areaId));
					break;
				default:
					break;
			}
			$('.no-line').addClass('hide');
			if (cpageArr[currIndex] == 1 && newsData) { // 第一页并且有首页有缓存数据
				$("#dataList" + currIndex).empty();
				renderEvent.renderNews(newsData);
			}
			// 获取数据：
			croods.ajax({
                method: code,
                params: param,
                //请求参数
                success: function(res) { //请求成功回调
                	if(common.checkToken(res, function(newToken) {
                        TOKEN = newToken;
                        requestEvent.requestNewData();
                        requestNewsIndex++;
                    }, requestNewsIndex)) {
                    	if(index == currIndex) {
	                        res = JSON.parse(res);
	                        var data = res.data;
	                        if (data && data.rows) {
	                            for (var i = 0; i < data.rows.length; i++) {
	                                var content = data.rows[i].content;
	                                if (content) {
	                                    data.rows[i].content = content.replace(/(^\s*)|(\s*$)/g, "");
	                                }
	                            }
	                            if (data.rows.length && (cpageArr[currIndex] == 1)) {
	                                if(currIndex == 0 || currIndex == 1) {
	                                    localStorage.setItem('notifyData' + areaId, JSON.stringify(data));
	                                }else if(currIndex == 2) {
	                                    localStorage.setItem('BlogData' + areaId, JSON.stringify(data));
	                                }
	                            }
	                            if ((cpageArr[currIndex] == 1) && (data.rows.length == 0)) {
	                                $('.empty' + currIndex).removeClass('hide');
	                            } else {
	                                $('.empty' + currIndex).addClass('hide');
	                            }
	                            curConItemTotal[currIndex] = data.totalPageCount;
	                            mescrollHome.endByPage(data.rows.length, data.totalPageCount);
								// renderEvent.renderHeader(); // 渲染头部
	                            renderEvent.renderNews(data);
	                        } else {
	                            mescrollHome.endSuccess();
	                            // renderEvent.renderHeader(); // 渲染头部
	                           
	                        }
						}
                    }
                	
                },
                fail: function(res) { //请求失败回调
                    mescrollHome.endErr();
                    // renderEvent.renderHeader(); // 渲染头部
                    common.toast('数据请求失败！');
                },
                complete: function(res) {
                    if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                    	if (newsData) {
							$('.empty' + currIndex).addClass('hide');
							$('.no-line').removeClass('hide');
						} else { // 首次启动
							$("#dataList" + currIndex).empty();
							$('.empty' + currIndex).removeClass('hide');
						}
                        mescrollHome.endErr();
                        // renderEvent.renderHeader(); // 渲染头部
                    }
                }
            });
			if(firInitFlag) {
            	// 初始化默认距离
				for (var i = 0; i < 3; i++) {
					currTabOffset[i] = initTopOffset;
				}
            	firInitFlag = false;
            }
		},

		unlockPullUp: function() {
            mescrollHome.lockUpScroll(false)
        },

		/**
		 * 获取设备id
		 */
		getDevice: function(callback) {
			croods.customPlugin({
				action: 'UserPlugin.getDevice',
				params: {},
				success: function(data) {
					DEVICE = data.deviceId;
					callback && callback();
				}
			});
		},
		// 分享计数请求接口
        requestShareCount: function(self) {
            croods.ajax({
                method: 'ed01ad526eb043519c0d656f53e416db',
                params: {
                    resId: shareId // 警微热点id
                },
                //请求参数
                success: function(res) { //请求成功回调
                    res = $.parseJSON(res);
                    if (res.flag) {
                        var num = parseInt(self.find('.num').html()) + 1;
                        self.find('.num').html(num);
                    }
                },
                fail: function(res) { //请求失败回调
                },
                complete: function(res) {
                    if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                        common.toast('网络无法连接，请检查您的网络');
                    }
                }
            });
        }
	};

	var handleEvent = { // 事件处理模块
		/**
		 * 区域点击事件
		 */
		areaClick: function() {
			croods.customPlugin({
				action: 'HomePlugin.areaClick',
				params: {},
				success: function(res) {}
			});
		},

		/**
		 * 搜索点击事件
		 */
		searchClick: function() {
			var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=police-search.html'); // 对接口请求数据封装
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: request,
				success: function(res) {}
			});
		},

		/**
		 * 消息点击事件
		 */
		messageClick: function() {
			var request = common.packData({}, '', '1', '', ''),
				isRead = $('.message-wrap i').hasClass('hide') ? 0 : 1; // 1有未读，0无未读
			croods.customPlugin({
				action: 'UserPlugin.isLogin',
				params: request,
				success: function(res) {
					var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=infos-type-details.html?isRead=' + isRead); // 对接口请求数据封装
					croods.customPlugin({
						action: 'CIPRoutePlugin.action',
						params: request,
						success: function(res) {}
					});
				}
			});

		},

		/**
		 * 轮播图点击事件
		 */
		owlClick: function() {
			var url = $(this).attr('data-url'),
				type = $(this).attr('data-type'),
				jumpType = ''; // 1内链，2外链
			if (!url) {
				return;
			}
			if (type == "1") {
				jumpType = "local";
			} else {
				jumpType = "html";
			}
			REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + url);
			if (type != undefined) {
				croods.customPlugin({
					action: 'CIPRoutePlugin.action',
					params: REQUEST,
					success: function(res) {}
				});
			}
		},

		/**
		 * 服务点击事件
		 */
		appClick: function() {
			$('.app-blank').show();
			var linkUrl = $(this).attr('data-url'),
				type = $(this).attr('data-type'),
				jumpType,
				REQUEST,
				userId; // 用户id
			if (type == "1") {
				jumpType = "app";
			} else if (type == "2") {
				jumpType = "h5zip";
			} else if (type == "3") {
				jumpType = "html";
			} else {
				jumpType = "local";
			}
			
			linkUrl = $.parseJSON(linkUrl);
			// 快处快赔  服务特殊处理 需要登录
			if(linkUrl.serviceName == '快处快赔') {
				croods.customPlugin({
					action: 'UserPlugin.isLogin',
					params: common.packData({}, '', '1', '', ''),
					success: function(res) {
						userId = res.id;
						linkUrl.serviceAddr = linkUrl.serviceAddr.split('=')[0] + '=' + userId;
						handleEvent.serviceOriginJump(linkUrl, jumpType, type, REQUEST);	
					}
				});
			}else {
				handleEvent.serviceOriginJump(linkUrl, jumpType, type, REQUEST);
			}
			setTimeout(function() {
				$('.app-blank').hide();
			}, 2000);
		},

		//服务点击跳转原生方式
		serviceOriginJump: function(linkUrl, jumpType,type, REQUEST) {
			linkUrl = JSON.stringify(linkUrl);
			REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + linkUrl);
			if (type != undefined) {
				croods.customPlugin({
					action: 'CIPRoutePlugin.action',
					params: REQUEST,
					success: function(res) {}
				});
			}
		},

		/**
		 * 运营位点击事件
		 */
		optClick: function() {
			var url = $(this).attr('data-url'),
				type = $(this).attr('data-type'),
				jumpType = ''; // 1内链，2外链
			if (!url) {
				return;
			}
			if (type == "1") {
				jumpType = "local";
			} else {
				jumpType = "html";
			}
			var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + url),
				request = common.packData({}, '', '1', '', '');
			croods.customPlugin({
				action: 'UserPlugin.isLogin',
				params: request,
				success: function(res) {
					if (type != undefined) {
						croods.customPlugin({
							action: 'CIPRoutePlugin.action',
							params: REQUEST,
							success: function(res) {}
						});
					}
				}
			});
		},

		/**
		 * 办事大厅更多点击事件
		 */
		workMoreClick: function() {
			var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=service-hall.html'); // 对接口请求数据封装
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: request,
				success: function(res) {}
			});
		},

		/**
		 * 网警头条更多点击事件
		 */
		newsMoreClick: function() {
			var request = common.packData({}, '', '1', '', '');
			croods.customPlugin({
				action: 'UserPlugin.isLogin',
				params: request,
				success: function(res) {
					var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=police-headline.html'); // 对接口请求数据封装
					croods.customPlugin({
						action: 'CIPRoutePlugin.action',
						params: request,
						success: function(res) {}
					});
				}
			});
		},
		// 初始化轮播图swiper
		initLunboSwiper: function() {
			if(!lunboSwiper) {
	        	lunboSwiper = new Swiper("#swiperContainerLunbo",{  
			        direction:"horizontal",/*横向滑动*/  
			        pagination:"#swiperPaginationLunbo",/*分页器*/ 
			        autoplay:3000,/*每隔3秒自动播放*/ 
			        speed: 300,
			        autoplayDisableOnInteraction: false,  // 用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay
			        paginationBulletRender: function(index, className) {
						var htmlSizeStr = $('html').css('font-size').split('px')[0],
							htmlSizeInt = Math.round(parseInt(htmlSizeStr)),
							multiple = Math.round(htmlSizeInt / 22),
							focusSize = multiple * 7 + 'px';
						return '<div style="width:'+ focusSize +'; height: ' + focusSize + '" class="' + className + '">' + '</div>';
					}
			    });
	        }
		},
		// 初始化警网头条tab组件
		initSwiper: function() {
			if(!swiper) {
				swiper = new Swiper('#swiperContainer', {
					pagination: '#swiperPagination',
					paginationClickable: true,  // 可点击
					observer:true,
					observerParents:true,
					paginationBulletRender: function(index, className) {
						var name = '';
						switch (index) {
							case 0:
								name = '推荐';
								break;
							case 1:
								name = localCity;
								break;
							case 2:
								name = '警微热点';
								break;
							default:
								name = '';
						}
						var classNames = 'innner-item';
						return '<div class="' + className + '">' + '<span class="innner-item" >' + name + '</span>' + '</div>';
					},
					onInit: function (swiper) {
						$('.tab-item' + currIndex).addClass('tab-item-active').siblings().removeClass('tab-item-active');
						$('.tab-item1 span').text(localCity);
					},
	                onSlideChangeStart: function(swiper) {
						// 根据type类型 请求不同接口数据
						handleEvent.getTabData();
					}
				});
			}/*else {
				swiper.paginationBulletRender();
				swiper.onInit();
			}*/
		},
		// 根据tab的index值请求不同的数据
		getTabData: function() { // 头条类型 0 推荐 1 本地 2警微热点
		    currIndex = $('#swiperContainer .swiper-slide-active').data().index; // 头条类型 index值 0 推荐 1 本地 2警微热点
		    if(OS == 'IOS') {
		    	$('.tab-item' + currIndex).addClass('tab-item-active').siblings().removeClass('tab-item-active');  // 头部tab
		    }
		    
		    requestEvent.unlockPullUp(currIndex);  // 启动上拉加载
		    if(tabRequestFlag[currIndex]) {
				mescrollHome.optUp.page.num = cpageArr[currIndex];
	            requestEvent.requestNewData(currIndex);
	            tabRequestFlag[currIndex] = false;
		    }
			$('#swiperContainer .swiper-wrapper .swiper-slide').eq(currIndex).css('height', 'auto').siblings().css('height', 'calc(100vh - 5.5rem)');

			if(tabScrollFlag && OS == 'Android') {
				$('.home-view').scrollTop(currTabOffset[currIndex]);
			}
			// 没有更多了 样式处理
			var childLen = $('#dataList' + currIndex).children().length;
			if(childLen == curConItemTotal[currIndex] && childLen >= 15 && curConItemTotal[currIndex] >= 15) {
				// mescrollHome.lockUpScroll(true);
				$('.upwarp-nodata').removeClass('hide');
			}else {
				// mescrollHome.lockUpScroll(false);
				$('.upwarp-nodata').addClass('hide');
			}
			

        	$('.home-top').css({
                'background': 'rgba(76,114,255, 1)'
            });
		},

		// 使用croods 进行精确定位
		bindLocationEventBaidu: function() {
			common.getOpenLocation({
				getOpenLocationSuccess: function(lng, lat) {
					try {
						var gpsPoint = new BMap.Point(lng, lat);
						BMap.GPSConvertor.translate(gpsPoint, 0, function(point) { // 将GSP定位转换成百度地图的经度纬度
							handleEvent.getLocation(point); // 逆地址解析
						});
					} catch (err) {
						handleEvent.getLocationFailSituation();
					}
				},
				getLocationFail: function() {
					handleEvent.getLocationFailSituation();
				},
				getLocModeFail: function() {
					handleEvent.getLocationFailSituation();
				},
				openGpsSettingFail: function() {
					handleEvent.getLocationFailSituation();
				},
				getOpenLocation: function() {
					common.getOpenLocation({
						getOpenLocationSuccess: function(lng, lat) {
							var gpsPoint = new BMap.Point(lng, lat);
							BMap.GPSConvertor.translate(gpsPoint, 0, function(point) { // 将GSP定位转换成百度地图的经度纬度
								handleEvent.getLocation(point); // 逆地址解析
							});
						},
						getLocationFail: function() {
							handleEvent.getLocationFailSituation();
						},
						getLocModeFail: function() {
							handleEvent.getLocationFailSituation();
						},
						openGpsSettingFail: function() {
							handleEvent.getLocationFailSituation();
						},
						getOpenLocation: function() {
							handleEvent.getLocationFailSituation();
						}
					});
				}
			});
		},
		// 逆地址解析
		getLocation: function(point) {
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				localCity = addComp.city; // 当前定位的城市
				if (ANAME == addComp.province) { // aname为安徽省的情况
					localCity = localCity.substring(0, localCity.length - 1);
				} else {
					localCity = '合肥';
				}
				setTimeout(function() {
					//初始化首页
                    indexInit();
				}, 200);
			});
		},
		// 定位失败的情况
		getLocationFailSituation: function() {
			localCity = '合肥';
			setTimeout(function() {
				//初始化首页
                indexInit();
			}, 200);
		},
		// 资讯详情点击事件
		newsClick: function() {
			var id = $(this).data('id'),
				url = 'news-detail.html?id=' + id;
			$(this).addClass('visited');
			handleEvent.originalReturn(url);
		},
		// 警微热点详情页跳转
		returnBlogDel: function() {
			var $this = $(this),
				id = $this.data('id'),
				wbname = $this.data().wbname,
				weburl = $this.data().weburl,
				url = 'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl;
			handleEvent.originalReturn(url);
		},
		// 点击全文跳转到 警微热点详情
		returnBlogDelFull: function(e) {
			var $this = $(this),
				index = $this.data().index,
                that = $this.parents().find('.blog-news-item' + index),
				id = that.data('id'),
				wbname = that.data().wbname,
				weburl = that.data().weburl,
				url = 'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl;
			$this.addClass('add-opacity');
			setTimeout(function() {
				$this.removeClass('add-opacity');
			}, 100);
			handleEvent.originalReturn(url, that);
			e.stopPropagation();
		},
		// 本地页面跳转-原生
		originalReturn: function(url) {
			var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=' + url); // 对接口请求数据封装
			$(this).addClass('visited');
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: request,
				success: function(res) {}
			});

		},

		// 原生地址跳转 第三方
		originThirdSerReUrl: function(returnUrl) {
			var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: REQUEST,
				success: function(res) {}
			});

		},

		// 分享点击事件
		shareClick: function(e) {
			var self = $(e.currentTarget),
				id = self.data().id,
				wbName = self.data().wbname,
				weburl = self.data().weburl,
				index = self.data().index;
				shareId = id;
				
			CONFIG.shareFile = CONFIG.BlogDetail + '?id=' + id;
            CONFIG.shareFile = encodeURI(CONFIG.shareFile);
			OBJ = {
				shareType: croods.shareType.WebPage,
				shareText: $('.article-sec .content-text' + index).text().replace(/(^\s*)|(\s*$)/g, "").substr(0, 30), // 去除资讯内容的空格
				url: CONFIG.shareFile, // 警微热点id
				title: wbName,
				site: wbName,
				titleUrl: CONFIG.shareFile, // 警微热点id
				siteUrl: CONFIG.shareFile, // 警微热点id
				imageUrl: weburl ? weburl : CONFIG.shareImg
			};

			croods.getNetworkType({
				success: function(res) { //请求成功回调
					if (res.network == 'none') {
						common.toast('网络无法连接，请检查您的网络');
					} else {
						if (shareListFlag) {
							vm.set('OP', options);
							shareListFlag = false;
						}

						handleEvent.callShare(this, self, e);
					}
				}
			});
			e.stopPropagation();
		},
		// 绑定物理返回键
		bindbutton: function() {
			croods.bindButton({
				keycode: ['backbutton'],
				success: function(res) {
					var shareDom = document.getElementsByClassName('share')[0],
						shareMask = shareDom.handler.mask.className;
					if (shareMask.indexOf('show') > -1) {
						$('.mask').removeClass('show');
						$('.share').addClass('d-none');
						$(".sheet").css({
							"transform": "translate3d(0,100%,0)",
							"-webkit-transform": "translate3d(0,100%,0)",
						});
					} else {
						croods.pageClose({});
					}
				}
			});
		},
		/**
		 * 分享模块点击
		 */
		callShare: function(that, self) {
			that.shareDom = document.getElementsByClassName('share')[0];
			that.share = that.shareDom.handler;
			$('.shareset').removeClass('hide');
			that.share.show();
			that.share.shareFun(OBJ, function() {
				common.toast('分享成功');
			});
			// 隐藏 首页底部原生图标
			croods.customPlugin({
				action: 'HomePlugin.hideGuide',
				params: {},
				success: function(res) {}
			});
			
			requestEvent.requestShareCount(self);
		},
		// 收藏点击事件
		collectClick: function(e) { //用户需要登录  点赞和分享不需要用户登录
			var self = $(e.currentTarget),
				collectFlag = self.attr('data-collect'),
				id = self.data().id,
				request = common.packData({}, '', '1', '', ''),
				code;
			if (collectFlag == 'false') { //未收藏
				code = '5f22f7a03b89447eba15ad12849bbc79';
			} else { //已收藏
				code = 'ebf9c5e93faa499d9daf914f5c80bf3d';
			}
			croods.getNetworkType({
				success: function(res) { //请求成功回调
					if (res.network == 'none') {
						common.toast('网络无法连接，请检查您的网络');
					} else {
						croods.customPlugin({
							action: 'UserPlugin.isLogin',
							params: request,
							success: function(res) {
								TOKEN = res.token ?  res.token : '';
                                croods.ajax({
									method: code,
									params: {
                                        token: TOKEN,
                                        resIds: id, // 警微热点id  收藏id
                                        resId: id  // 取消收藏id
                                    },
									//请求参数
									success: function(res) { //请求成功回调
										if (common.checkToken(res, function(newToken) {
												TOKEN = newToken;
												handleEvent.collectClick(newToken);
												collectIndex++;
											}, collectIndex)) {
											res = $.parseJSON(res);
											if (res.flag) {
												if (collectFlag == 'false') {
													collectFlag = 'true';
													self.attr('data-collect', 'true');
													// var num = parseInt(self.find('.num').html()) + 1;
													self.find('.num').html(res.data);
													self.find('.icon').addClass('collected');
                                                    self.find('.icon').removeClass('uncollected');
													common.toast('已添加到我的收藏');
												} else {
													collectFlag = 'false';
													self.attr('data-collect', 'false');
													// var num = parseInt(self.find('.num').html()) - 1;
													self.find('.num').html(res.data);
													self.find('.icon').addClass('uncollected');
                                                    self.find('.icon').removeClass('collected');
													common.toast('取消收藏');
												}
											} else {
												if (collectFlag == 'true') {
													common.toast('收藏失败');
												} else {
													common.toast('取消收藏失败');
												}
											}
										}
									},
									fail: function(res) { //请求失败回调
										if (collectFlag == 'true') {
											common.toast('收藏失败');
										} else {
											common.toast('取消收藏失败');
										}
									},
									complete: function(res) {
										if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
											common.toast('网络无法连接，请检查您的网络');
										}
									}
								});    	
							}
						});
					}
				}
			});
			e.stopPropagation();
		},
		// 点赞点击事件
		praiseClick: function(e) {
			var self = $(e.currentTarget),
				id = self.data().id,
				index = self.data().index,
				dom = self.parents().find('.blog-news-item' + index),
				priseFlag = self.attr('data-prise');
			if (platForm) {
					var code;
				if (priseFlag == 'false') { //未点赞
					handleEvent.praiseAnimate(dom, index);
					code = '3140ce2df226465ca46260b7b6a4431d';
				} else { //已点赞
					code = '93f0150736934e958f51b19e929ee46c';
				}
				croods.getNetworkType({
					success: function(res) { //请求成功回调
						if (res.network == 'none') {
							common.toast('网络无法连接，请检查您的网络');
						} else {
							croods.ajax({
								method: code,
								params: {
									objId: id, // 警微热点ID
									deviceId: DEVICE, // 设备ID
									token: TOKEN, // 用户登录的TOKEN
									osType: OS // 终端类型IOS Android
								},
								//请求参数
								success: function(res) { //请求成功回调
									// common.maskPraise(false);
									if (common.checkToken(res, function(newToken) {
											TOKEN = newToken;
											handleEvent.praiseClick(e);
											praiseIndex++;
										}, praiseIndex)) {
										res = $.parseJSON(res);
										if (res.flag) {
											var data = res.data;
											if (priseFlag == 'false') {
												if (data != 0) {
													priseFlag = 'true';
													self.attr('data-prise', 'true');
													self.find('.num').html(data);
													self.find('.icon').addClass('praised');
                                                    self.find('.icon').removeClass('unpraised');
												} else {
													common.toast('点赞失败！');
												}
											} else {
												if (data != -1) {
													priseFlag = 'false';
													self.attr('data-prise', 'false');
													self.find('.num').html(data);
													self.find('.icon').addClass('unpraised');
                                                    self.find('.icon').removeClass('praised');
												} else {
													common.toast('取消点赞失败！');
												}
											}
										} else {
											if (priseFlag == 'true') {
												common.toast('取消点赞失败！');
											} else {
												common.toast('点赞失败！');
											}
										}
									}
								},
								fail: function(res) { //请求失败回调
									if (priseFlag == 'true') {
										common.toast('取消点赞失败！');
									} else {
										common.toast('点赞失败！');
									}
								},
								complete: function(res) {
									if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
										common.toast('网络无法连接，请检查您的网络');
									}
								}
							});
						}
					}
				});
			}
			e.stopPropagation();
		},
		//图片预览
		imgPreviewClick: function(e) {
			e.stopPropagation(); // 阻止事件冒泡
		},
		// 图片保存点击事件
		imgSaveClick: function(e) {
			var $this = $(this),
				downLoadUrl = $this.parents().find('.mui-preview-footer').siblings().find('.mui-active').find('img').attr('src');

			var REQUEST = common.packData({
				"downLoadUrl": downLoadUrl,
			}, "", "1", false, "");
			croods.customPlugin({
				action: 'CustomImagePlugin.downloadImage',
				params: REQUEST,
				success: function(res) {
				}
			});
		},
		// 点赞动画加载
		praiseAnimate: function(dom, index) {
			croods.getNetworkType({
				success: function(res) { //请求成功回调
					if (res.network != 'none') {
						common.maskPraise(true, dom, index);
						setTimeout(function() {
							common.maskPraise(false, dom, index);
						}, 1000);
					}
				}
			});
		},
		// 视频点击事件
		vedioPlayClick: function(e) {
			var $this = $(e.currentTarget),
				detailId = $this.data().detailid,
				name = $this.data().name,
				poster = $this.data().poster;
			var url = 'video-paly.html?id=' + detailId + '&title=' + name + '&poster=' + poster;
			handleEvent.originalReturn(url);
			e.stopPropagation();
			return;
		},
		// 扫描二维码事件
		scanClick: function() {
			croods.customPlugin({
				action: 'QRCodePlugin.scanCode',  // 原生扫描功能插件
				params: {},
				success: function(res) { 
					res = res.result;
					// console.log(res);
					croods.ajax({
						method: '4916d843ad754268942a5e7b9461c0f8',
						params: {
							content: res
						},
						//请求参数
						success: function(data) { //请求成功回调
							data = typeof data == 'string' ? $.parseJSON(data) : data;
							if(data.data) {
								// var url="pay-detail.html?payCode=" + res;
								handleEvent.originalReturn(data.data);
							}else {
								common.toast(data.errMsg);
							}
							
							// console.log(data);
						},
						fail: function(data) { //请求失败回调
							// common.toast('数据请求失败');
						},
						complete: function(data) {
							// common.toast('数据请求失败');
						}
					});
				}
			});
		},
		topTabSwitchClick: function() {
			var self = $(this),
			    index = self.data().index;
			currIndex = index;
			self.addClass('tab-item-active').siblings().removeClass('tab-item-active');
			$('#swiperPagination .swiper-pagination-bullet').eq(index).find('span').trigger('click');
		}
	};

	var addEvent = function() {
		var $this = $('.home-wrap');
		// 区域切换
		$this.off('.area-wrap').on('click', '.area-wrap', handleEvent.areaClick);

		// 点击搜索
		$this.off('.search-wrap').on('click', '.search-wrap', handleEvent.searchClick);

		// 点击消息
		$this.off('.message-wrap').on('click', '.message-wrap', handleEvent.messageClick);

		// 点击轮播图
		$this.off('.home-banner .swiper-slide').on('click', '.home-banner .swiper-slide', handleEvent.owlClick);

		// 点击app入口
		$this.off('.app-slider li a').on('click', '.app-slider li a', handleEvent.appClick);

		// 办事大厅更多点击事件
		$this.off('.home-activity .more').on('click', '.home-activity .more', handleEvent.workMoreClick);

		// banner位点击
		$this.off('.activity-content div').on('click', '.activity-content div', handleEvent.optClick);

		// 警网头条更多
		$this.off('.home-news .more').on('click', '.home-news .more', handleEvent.newsMoreClick);

		// 警网头条列表点击
		$this.off('.city-news li').on('click', '.city-news li', handleEvent.newsClick);

		// 警微热点点击 跳转详情
		$this.off('.blog-news-item').on('click', '.blog-news-item', handleEvent.returnBlogDel);

		// 警微热点点击 跳转详情
		$this.off('.full-text').on('click', '.full-text', handleEvent.returnBlogDelFull);

		// 分享按钮点击事件
		$this.off('.btn-wrap .btn-share').on('click', '.btn-wrap .btn-share', handleEvent.shareClick);

		// 收藏按钮点击事件
		$this.off('.btn-wrap .btn-collect').on('click', '.btn-wrap .btn-collect', handleEvent.collectClick);

		// 点赞按钮点击事件
		$this.off('.btn-wrap .btn-praise').on('click', '.btn-wrap .btn-praise', handleEvent.praiseClick);

		// 图片预览点击事件
		$this.off('.blog-img-list .img-item').on('click', '.blog-img-list .img-item', handleEvent.imgPreviewClick);

		// 视频点击事件
		$this.off('.vedio-unit').on('click', '.vedio-unit', handleEvent.vedioPlayClick);

		// 图片保存点击事件
		$(document).on('click', '.save-logo', handleEvent.imgSaveClick);

		// 扫描二维码事件
		$this.off('.home-top .scan-wrap').on('click', '.home-top .scan-wrap', handleEvent.scanClick);

		// 头部tab点击事件
		$this.off('.top-tab-wrap .tab-item').on('click', '.top-tab-wrap .tab-item', handleEvent.topTabSwitchClick);
	};

	/**
	 * 首页切换城市刷新方法
	 */
	window.HomeRefresh = function(data) {

		croods.customPlugin({
			action: 'UserPlugin.getUser',
			params: {},
			success: function(res) {
				TOKEN = res.token ? res.token : '';
				renderEvent.renderCurrentCity(data); // 渲染当前市
			}
		});
	};

	/**
	 * 显示下载进度
	 * @param  {[type]} data [description]
	 */
	window.showProgress = function(data) {
		for (var i = 0, len = $('.app-slider a').length; i < len; i++) {
			if ($(".app-slider a:eq(" + i + ")").attr('data-id') === data.id) {
				$(".app-slider a:eq(" + i + ") .download-progress").show();
				$(".app-slider a:eq(" + i + ") .progress-info p").text(data.progress + '%');
				$(".app-slider a:eq(" + i + ") .progress-bar").css('width', data.progress + '%');
				if (parseInt(data.progress) === 100) {
					$(".app-slider a:eq(" + i + ") .download-progress").hide();
				}
			}
		}
	};

	/**
	 * 用户退出
	 */
	window.loginOut = function() {
		TOKEN = '';
		// 请求推荐服务数据
		croods.customPlugin({
			action: 'HomePlugin.getTJFWService',
			params: {},
			success: function(res) {}
		});
		// 请求资讯数据
		renderEvent.renderNews();
	};
	/**
	 * 显示推荐服务
	 */
	window.showList = function(data) {
		if (data && data.length) {
			$('.home-app-entrance').removeClass('hide');
			renderEvent.renderServices(data);
		} else {
			$('.home-app-entrance').addClass('hide');
		}
	};
	window.changeTabCss = function(data) {
		if(data == '1') {  // -webkit-overflow-scrolling: touch;
		}else if(data == '2') { // 手指离开时触发
			$('.top-tab-wrap').addClass('sub-opacity');
		}
	};

	window.refreshMessage = function() {
		// 请求消息
		renderEvent.renderMessage();
	};
    function indexInit() {
    	handleEvent.initSwiper();
        //初始化mescroll
        mescrollHome = renderEvent.renderScroll();          
    }
	$(function() {
		fly.bind(document.body, vm);
		fly.template.config('escape', true);
		addEvent();

		// 首页刚进来调用APP插件，从而调用window.homeRefresh方法，初始化页面信息
		croods.customPlugin({
			action: 'HomePlugin.getData',
			params: {},
			success: function(res) {}
		});
		// 给home-view添加scroll事件
		$('.home-cont').on('scroll', function(e) {
			window.requestAnimationFrame(function() {
				if(OS == 'IOS' && $('.top-tab-wrap').hasClass('sub-opacity')) {
					$('.top-tab-wrap').removeClass('sub-opacity');
				}
				scrollTop = $('.home-cont').scrollTop();
                tabTop = $('.tab-wrapper').offset().top;

				if (!$('.convenience-interval').hasClass('hide')) {
					top = $('.convenience-interval').offset().top;
				} else {
					top = $('.service-interval').offset().top;
				}
				// 头部颜色渐变
				opticity = (top >= subHeight) ? (subHeight / top) : 1;
				/*if (top >= subHeight) {
					opticity = (subHeight / top);
				}*/
				if (opticity <= 0.15) {
					opticity = 0;
				}
				$('.home-top').css({
					'background': 'rgba(76,114,255, ' + opticity + ')'
				});
                if (tabTop < subHeight) {
                	if(OS == 'IOS'){
                		if(tabTop < subHeight - $('.tab-wrapper').height()) {
	                		window.requestAnimationFrame(function(){
	                			if($('.tab-wrapper .swiper-pagination').hasClass('tab-fixed')) {
			                		$('.tab-wrapper .swiper-pagination').removeClass('tab-fixed');
			                	}
		                		$('.top-tab-wrap').removeClass('hide');
		                		$('.top-tab-wrap').css('z-index', '99');
	                		});
	                	}else {
	                		if($('.swiper-pagination').hasClass('hide')) {
	                			$('.swiper-pagination').removeClass('hide');
	                		}
	                		window.requestAnimationFrame(function(){
	                			if(!$('.tab-wrapper .swiper-pagination').hasClass('tab-fixed')) {
			                		$('.tab-wrapper .swiper-pagination').addClass('tab-fixed');
			                	}
		                		$('.top-tab-wrap').addClass('hide');
		                		$('.top-tab-wrap').css('z-index', '-1');
	                		})	
	                	}
                	}else if(OS == 'Android' && !$('.tab-wrapper .swiper-pagination').hasClass('tab-fixed')) {
                        $('.tab-wrapper .swiper-pagination').addClass('tab-fixed');
                	}
                    $('.home-top').css({
                        'background': 'rgba(76,114,255, 1)'
                    });
                    currTabOffset[currIndex] = scrollTop;
					tabScrollFlag = true;
                } else {
                	window.requestAnimationFrame(function(){
                		if($('.tab-wrapper .swiper-pagination').hasClass('tab-fixed')) {
	                		$('.tab-wrapper .swiper-pagination').removeClass('tab-fixed');
	                	}
	                	if(OS == 'IOS') {
	                		$('.top-tab-wrap').addClass('hide');
	                		$('.top-tab-wrap').css('z-index', '-1');
	                	}
	                	
                	});
                	
                    tabScrollFlag = false;
                }
			});
		});
	});

});
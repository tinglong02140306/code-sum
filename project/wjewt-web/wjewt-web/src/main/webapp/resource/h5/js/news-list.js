/**
 * @author yaoding
 * @time 2017-12-03
 * @description 警网头条
 */
'use strict';
$(function() {
	var CPAGE = 1, // 当前页
        mescroll, // 上拉加载，下拉刷新
        NEWSIMG = util.getListImgSize(111, 0.75),
        swiper,   // swiper 对象
        currIndex = 0,  // 头条类型 tab index值 0 推荐 1 本地 2警微热点
        localCity = '合肥',  // 当前城市名 单位为地级市
        mescrollArr = new Array(3), // 3个菜单所对应的3个mescroll对象
        cpageArr = new Array(3),  // 3个菜单所对应的当前页
        platForm = util.checkMobilePlatform(),
        baiduPostionTimer = 0,// 调用百度次数
        newsPageSize = 6, // 每次请求的条数
        renderEvent = {
	        /**
	         * 渲染网警头条
	         * @param {[int]} [CPAGE] [当前页]
	         * @param {[object]} [data] [列表数据]
	         */
	        renderNews: function(data) {
                var res = data.rows;
                if (!$.isEmptyObject(res)) {
                    if(currIndex == 0 || currIndex == 1) {
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
                            obj.releaseDate = util.getTimeRange(obj.releaseDate);
                            if (imgUrl1 && imgUrl2 && imgUrl3) {
                                obj.tag = 3;
                                obj.imgUrl1 = imgUrl1 + util.getListImgSize(25*2, 0.75);
                                obj.imgUrl2 = imgUrl2 + util.getListImgSize(25*2, 0.75);
                                obj.imgUrl3 = imgUrl3 + util.getListImgSize(25*2, 0.75);
                            } else if (imgUrl1 || imgUrl2 || imgUrl3) {
                                obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + util.getListImgSize(24*2, 0.75);
                                obj.tag = 1;
                            } else {
                                obj.tag = 0;
                            }
                        }
                    }else if(currIndex == 2) {
                        for (var i = 0, len = res.length; i < len; i++) {
                            
                            res[i].multiple = i + (cpageArr[currIndex] -1)*newsPageSize;  // 列表项中的index值

                            // 内容样式修改
                            var resultArr = util.getContent(res[i].content, 140);
                            res[i].content = resultArr[0];
                            res[i].notFull = resultArr[1];
                            
                            // 数据格式处理
                            res[i].shareCount = res[i].shareCount > 9999 ? '9999+' : res[i].shareCount;
                            res[i].collectionCount = res[i].collectionCount > 9999 ? '9999+' : res[i].collectionCount;
                            res[i].priseCount = res[i].priseCount > 9999 ? '9999+' : res[i].priseCount;

                            // 图片预览
                            if(res[i].appendixType == 1) {
                                /*$('.img-list' + i).FlyZommImg();// 图片预览插件*/
                                var imgList = [];
                                for(var j = 0; j < res[i].appendixList.length; j++) {
                                    res[i].appendixList[j] = CONFIG.path + res[i].appendixList[j];
                                    imgList.push(res[i].appendixList[j]);
                                }
                                imgList = JSON.stringify(imgList);
                                res[i].imgList = imgList;
                            }else if(res[i].appendixType == 2) {  // 视频播放
                                res[i].appendixAddress = CONFIG.path + res[i].appendixAddress;  
                            }
                        }
                    }
                    if(cpageArr[currIndex] == 1) {
                        $('#dataList' + currIndex).empty();
                    }

                    // 数据模板渲染
                    var tmpl = fly.template('newsTempl', res),
                        wrapperSel = '#wrapper' + currIndex;
                    if(currIndex == 2) {
                        tmpl = fly.template('blogTmpl', res);
                    }
                    $('#dataList' + currIndex).append(tmpl);
                    
                    // 图片error处理
                    $('.content .city-news img, .news-list img').off('error').on('error', function() {  // 图片error处理
                        $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
                    });

                    mui.previewImage();  // 图片预览
                }
            },
	        /**
	         * 加载当前滚动条
	         */
	        renderScroll: function(mescrollId) {
	            var mescroll = new MeScroll(mescrollId, {
                    down: {
                        onMoving: function(mescroll, rate, downHight) {
                            var height = $('.downwarp-content').innerHeight();
                            $('.downwarp-progress').css('opacity', downHight/(height/2));
                        }
                    },
                    up: { // 上拉配置
                        noMoreSize: 15,
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        callback: function(page, mescroll) {
                            cpageArr[currIndex] = page.num;
                            // 请求数据
                            requestEvent.requestNewData(currIndex);
                        },
                        page: {
                            size: newsPageSize
                        }
                    }
                });
                return mescroll;
	        }
    	},
	    requestEvent = {
			/**
			 * 请求资讯列表
			 */
			requestNewData: function(index) {
				var url,
                    param = {};
                switch(index) {
                    case 0:
                        url = '/content/getPoliceContentList';
                        param = {
                            areaId: '',
                            currentPageNo: cpageArr[currIndex],
                            pageSize: newsPageSize
                        };
                        break;
                    case 1:
                        param = {
                            areaId: localCity,
                            currentPageNo: cpageArr[currIndex],
                            pageSize: newsPageSize
                        };
                        url = '/content/getPoliceContentList';
                        break;
                    case 2:
                        url = '/content/getPoliceWbContentList';
                        param = {
                            currentPageNo: cpageArr[currIndex],
                            pageSize: newsPageSize
                        };
                        break;
                    default: 
                        break;
                }
		        fly.$.ajax({
		            url: CONTEXTPATH + url,
		            data: param,
		            dataType: 'json',
		            type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
		            cache: false,
		            success: function (res) {
                        if(index == currIndex) {
                            if ((typeof res) == 'string') {
                                res = JSON.parse(res);
                            }
                            var data = res.data;
                            // console.log(data);
                            if (data && data.rows && data.rows.length) {
                                for(var i = 0; i < data.rows.length; i++) {
                                    var content = data.rows[i].content;
                                    if(content) {
                                        data.rows[i].content = content.replace(/(^\s*)|(\s*$)/g,"");
                                    }
                                }
                                $('#wrapper' + currIndex).removeClass('hide');
                                $('.empty' + currIndex).addClass('hide');
                                mescrollArr[currIndex].endByPage(data.rows.length, data.totalPageCount);
                                renderEvent.renderNews(data);
                            } else {
                                mescrollArr[currIndex].endSuccess();
                                $('#wrapper' + currIndex).addClass('hide');
                                $('.empty' + currIndex).removeClass('hide');
                            }
                        }
                        
		            },
		            error: function() {
		            	mescrollArr[currIndex].endErr();
                        util.toast('数据请求失败！');
		            }
		        });
			}
		},
		eventHandle = {
			// 初始化轮播组件
            initSwiper: function() {
                if(!swiper) {
                    swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
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
                        onSlideChangeStart: function(swiper) {
                            eventHandle.getTabData();
                        }
                    });
                }
                
            },
            // 根据type类型 请求不同接口数据
            getTabData: function() { // 头条类型 0 推荐 1 本地 2警微热点
                currIndex = $('.swiper-slide-active').data().index;  // 头条类型 index值 0 推荐 1 本地 2警微热点
                eventHandle.initRequestNewsData(currIndex);
                //取出菜单所对应的mescroll对象,如果未初始化则初始化
                /*if(mescrollArr[currIndex] == null){
                    mescrollArr[currIndex] = renderEvent.renderScroll("wrapper" + currIndex);
                }*/
            },
            // 百度地图定位 便于第三方接入
            bindLocationEventBaiduThird: function() {
                var pointX;
                try {
                    baiduPostionTimer++;
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (data) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            if (data.accuracy == null) {
                                // 用户拒绝地理位置授权
                                eventHandle.platFormToast('请检查定位服务是否打开!');
                            }
                            // 市
                            localCity = (data.address.city).substring(0, localCity.length - 1);;
                            pointX = data.point.lng.toString();
                        }else  {
                            //定位失败请刷新重试
                        }
                    },{enableHighAccuracy: true});
                }catch (e) {
                   if(baiduPostionTimer <= 3 ) {
                        eventHandle.bindLocationEventBaiduThird();
                    }else {
                        eventHandle.getLocationFailSituation();
                    }
                }
            },
            // 各种平台定位方法
            platTypeLocation: function() {
                if(util.isWeiXin()) {
                    wx.ready(function() {
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function(res) {
                                var ggPoint = new BMap.Point(res.longitude, res.latitude),
                                    pointArr = [];
                                pointArr.push(ggPoint);
                                new BMap.Convertor().translate(pointArr, 1, 5, function(data) { // 转成百度地图坐标
                                    eventHandle.getLocation(data.points[0]); // 逆地址解析
                                });
                            },
                            cancel: function(res) {
                                eventHandle.getLocationFailSituation();
                            },
                            fail: function() {
                                eventHandle.getLocationFailSituation();
                            }
                        });
                    })
                    wx.error(function() {
                        eventHandle.getLocationFailSituation(); // 默认合肥
                    });
                }else if(util.isAlipay()) {
                    ap.getLocation({
                        success: function(res) {
                            var ggPoint = new BMap.Point(res.longitude, res.latitude),
                                pointArr = [];
                            pointArr.push(ggPoint);
                            new BMap.Convertor().translate(pointArr, 3, 5, function(data) { // 转成百度地图坐标
                                eventHandle.getLocation(data.points[0]); // 逆地址解析
                            });
                        },
                        fail: function(res) {
                            eventHandle.getLocationFailSituation();
                        }
                    });
                }else {
                    eventHandle.getLocationFailSituation(); // 默认合肥
                }
            },
            // 根据平台进行提示
            platFormToast: function(msg) {
                if(platForm) {
                    util.toast(msg);
                }else {
                    util.toastHtml(msg,'','','');
                }
            },
            // 逆地址解析
			getLocation: function(point) {
				var geoc = new BMap.Geocoder();
				geoc.getLocation(point, function(rs) {
					var addComp = rs.addressComponents;
					localCity = addComp.city; // 当前定位的城市
					if (addComp.province == '安徽') {
						localCity = localCity.substring(0, localCity.length - 1);
					} else {
						localCity = '合肥';
					}
                    eventHandle.initRequestNewsData(0);
					/*eventHandle.initSwiper();
					mescrollArr[0] = renderEvent.renderScroll("wrapper0");*/
				});
			},
            // 定位失败的情况
            getLocationFailSituation: function() {
                localCity = '合肥';
                eventHandle.initRequestNewsData(0);
                /*eventHandle.initSwiper();
                mescrollArr[0] = renderEvent.renderScroll("wrapper0");*/
            },
            initRequestNewsData: function(index) {
                if(!swiper) {
                    eventHandle.initSwiper(); // 初始化轮播组件
                }
                setTimeout(function() {
                    //初始化首页
                    if(mescrollArr[index] == null) {
                        mescrollArr[index] = renderEvent.renderScroll("wrapper" + index);
                    }
                }, 400);   
            },
            // 图片预览
            imgPreviewClick: function(e) {
                e.stopPropagation();  // 阻止事件冒泡
            },
            // 视频点击
            vedioPlayClick: function(e) {
                var $this = $(e.currentTarget),
                detailId = $this.data().detailid,
                name = $this.data().name;
                util.mask(true);
                fly.$.ajax({
                    url: CONTEXTPATH + '/content/getVideoUrlBySbm',
                    data: {
                        sbm: detailId
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    success: function (res) {
                        util.mask(false);
                        // res = $.parseJSON(res).data;
                        window.location.href = res;
                    },
                    error: function(){
                        util.mask(false);
                        util.toast('数据请求失败！');
                    }
                });
                e.stopPropagation();
            },

            // 跳转到警微热点详情
            returnBlogDel: function(e) {
                var id = $(this).data('id'),
                    wbname = $(this).data().wbname,
                    weburl = $(this).data().weburl;
                window.location.href = CONTEXTPATH + '/h5/blog-news-detail.do?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl + '&jumpPlatType=1';
            },
            // 点击全文跳转到 警微热点详情
            returnBlogDelFull: function(e) {
                var $this = $(this),
                    // that = $this.parents().find('.blog-news-item'),
                    id = $this.data('id'),
                    wbname = $this.data().wbname,
                    weburl = $this.data().weburl;
                    $this.addClass('add-opacity');
                    setTimeout(function() {
                        $this.removeClass('add-opacity');
                    }, 100);
                    window.location.href = CONTEXTPATH + '/h5/blog-news-detail.do?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl + '&jumpPlatType=1';
                e.stopPropagation();
            }
		},
        addEvent = function() {
            var $this = $('.wrap');

            // 警微热点点击 跳转详情
            $this.off('.blog-news-item').on('click', '.blog-news-item', eventHandle.returnBlogDel);

            // 警微热点点击 跳转详情
            $this.off('.full-text').on('click', '.full-text', eventHandle.returnBlogDelFull);

            // 图片预览点击事件
            $this.off('.blog-img-list .img-item').on('click','.blog-img-list .img-item',eventHandle.imgPreviewClick); 

            // 视频点击事件
            $this.off('.vedio-unit').on('click','.vedio-unit',eventHandle.vedioPlayClick);
        };
	// var userName = '';
    fly.template.config('escape', false);  // xxs是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
    addEvent();
	eventHandle.platTypeLocation();

	
	// 跳转到详情
	$('.wrap').on('click', '.news-list a', function() {
		var that = $(this),
			id = that.data('id');
		window.location.href = CONTEXTPATH + '/h5/news-detail.do?id=' + id + '&jumpPlatType=1'; // jumpPlatType 跳转方式 1 不是通过分享到平台方式打开
	});
	
	var	downWrap = $('#downWrap'),
		showDown = util.getCookie('showDown');
	if(showDown == '0') {
		downWrap.addClass('hide');
	} else {
		downWrap.removeClass('hide');
	}
	
	$('#downWrap .down-content').on('click', function() {
		window.location.href = APPDOWNURL;
	});
	
	$('#downWrap .delete-icon').on('click', function() {
		$('#downWrap').addClass('hide');
		util.setCookie('showDown', '0', 0.5/24, window.location.hostname);
	});

});
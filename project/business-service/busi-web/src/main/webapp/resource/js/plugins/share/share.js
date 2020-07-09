window.hide = function() {
    $('.mask').removeClass('show');
    $('.share').addClass('d-none');
    $(".sheet").css({
        "transform": "translate3d(0,100%,0)",
        "-webkit-transform": "translate3d(0,100%,0)",
    })
};
;
(function(a, b) {
	var c = typeof define === "function",
		d = typeof module !== "undefined" && module.exports;
	if (c) {
		define(b)
	} else {
		if (d) {
			module.exports = b()
		} else {
			this[a] = b()
		}
	}
})("Share", function() {
	var flag = true;
	function a(b, c) {
		var that = this;
		that.shareDom = document.getElementById(b);
		that.options = a.extend(c, {
			hideFlag: false,
	        templateCont: fly.template('<li data-type={{type}}><div class="share-icon {{icon}}"></div><div class="share-name">{{platform}}</div></li>'),
	        templateTitle: fly.template('<span>{{title}}</span>'),
	        title: '分享到',
	        list: []
		});
		that.init(this.options);
		that.operationCont = this.shareDom.querySelector('.share-list');
		that.cancel = this.shareDom.querySelector('.button-cancel');
		that.mask = this.shareDom.querySelector('.mask');
		that.share = this.shareDom.getElementsByTagName('li');
        that.shareDom.querySelector('.share').classList.add('d-none');
        that.shareDom.querySelector('.share-title').innerText = this.options.title;
        // 创建遮罩
        that.cancel.addEventListener('click', function(e) {
            e.stopPropagation();
            // that.trigger('close');
            that.hideMask();
            that.hideSheet();
        });
        that.mask.addEventListener('click', function(e) {
            e.stopPropagation();
            that.hideMask();
            that.hideSheet();
        });
        // 防止滚动穿透
        this.shareDom.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, false);
        this.shareDom.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, false);
	}
	a.prototype.init = function(options) {
		var list = options.list,
			context = [];
		var dom = '	<div class="share">'+
					    '<div class="mask"></div>' +
					    '<div class="sheet">'+
					        '<p class="share-title"></p>'+
					        '<ul class="share-list">'+
					        '</ul>'+
					        '<div class="button button-cancel">取消</div>'+
					    '</div>'
					'</div>';
		$(this.shareDom).append(dom);
		var operationCont = this.shareDom.querySelector('.share-list');
        list.forEach(function(item, i) {
            var operaItem = $(options['templateCont'](item))[0];
            operationCont.appendChild(operaItem);
        });
	};
	a.extend = function(c, b) {
		if (!c) {
			return b
		}
		for (key in b) {
			if (c[key] == null) {
				c[key] = b[key]
			} else {
				if (typeof c[key] == "object") {
					a.extend(c[key], b[key])
				}
			}
		}
		return c
	};
	a.prototype.hideMask = function() {
		$('body').css({'overflow': 'auto'});
        $('.mask').removeClass('show');
        $('.share').addClass('d-none');
	};
	a.prototype.hideSheet = function() {
		$('.share').addClass('d-none');
        $(".sheet").css({
            "transform": "translate3d(0,100%,0)",
            "-webkit-transform": "translate3d(0,100%,0)",
        });
	};
	a.prototype.showMask = function() {
		$('body').css({'overflow': 'hidden'});
        $('.mask').addClass('show');
        $('.share').removeClass('d-none');
	};
	a.prototype.showSheet = function() {
		$('.share').removeClass('d-none');
        $(".sheet").css({
            "transform": "translate3d(0,0,0)",
            "-webkit-transform": "translate3d(0,0,0)",
            "transition": "0.4s ease"
        })
	};
	//显示
    a.prototype.show = function() {
        this.showMask();
        this.showSheet();
    };

    //隐藏
    a.prototype.hide = function() {
        this.shareDom.querySelector('.confirm-inner').classList.remove('active');
        this.mask && this.mask.close();
    };
    a.prototype.close = function(callback) {
        $('body').css({'overflow': 'auto'});
        this.shareDom.style.display = 'none';
        $('.share').addClass('d-none');
        callback && callback();
    };
    a.prototype.shareFun = function(obj,successFun,errorFun) {
        $('.share-list li').on('click', function() {
            if(!flag) {
                return;
            }
            var type = $(this).attr('data-type'),
                that = this,
                platformType;
            if (type == '1') {
                platformType = croods.sharePlatform.QQ;
            } else if (type == '2') {
                platformType = croods.sharePlatform.QZone;
            } else if (type == '3') {
                platformType = croods.sharePlatform.SinaWeibo;
            } else if (type == '4') {
                platformType = croods.sharePlatform.WeChatSession;
            } else if (type == '5') {
                platformType = croods.sharePlatform.WeChatTimeline;
            } else if (type == '6') {
                platformType = croods.sharePlatform.WeChatFav;
            }
            obj.shareText.length > 30 ? obj.shareText = obj.shareText.substring(0,30) :obj.shareText = obj.shareText;
            obj.title.length > 15 ? obj.title = obj.title.substring(0,15) :obj.title = obj.title;
            
            if(!obj.shareText) {
                obj.shareText = " ";
            }

            if(type === "3") {
                obj.shareText = obj.shareText + obj.siteUrl;
            }
            flag = false;
            setTimeout(function() {
                flag = true;
            }, 3000);
            croods.shareContent({
                platform: platformType,
                //必填，分享平台ID
                shareParams: { //必填，分享参数
                    //必填，分享内容类型
                    type: obj.shareType,
                    //必填，text是分享文本，所有平台都需要这个字段
                    text: obj.shareText,
                    //选填，微信（包括好友、朋友圈收藏）和易信（包括好友和朋友圈）中使用
                    url: obj.url,
                    //选填，印象笔记、邮箱、信息、微信（好友、朋友圈和收藏）、人人网和QQ空间使用
                    title: obj.title,
                    //选填，标题的网络链接，仅在人人网和QQ空间使用
                    titleUrl: obj.titleUrl,
                    //选填，分享此内容的网站名称，仅在QQ空间使用
                    site: obj.site,
                    //选填，分享此内容的网站地址，仅在QQ空间使用
                    siteUrl: obj.siteUrl,
                    //选填，图片路径，新浪微博、人人网、QQ空间和Linked-In支持此字段
                    imageUrl: obj.imageUrl
                },
                success: function(res) {
                    flag = true;
                    window.hide();
                    successFun && successFun();
                },
                fail: function(res) {
                    flag = true;
                    var code = res.substring(0,5);
                    if(code === '70022') {
                        common.toast('分享平台失败');
                    } else if (code === '50005') {
                        common.toast('分享平台找不到');
                    }
                    window.hide();
                    errorFun && errorFun();
                }
            });
        })
    };
	return a;
});
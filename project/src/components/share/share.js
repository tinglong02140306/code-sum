'use strict';

var CLICK = 'click',
    TOUCHSTART = 'touchstart',
    proxy = fly.$.proxy,
    common = require("common"),
    flag = true,
    template = fly.template;
window.hide = function() {
    // this.hideMask();
    // this.hideSheet();
    $('.mask').removeClass('show');
    $('.share').addClass('d-none');
    $(".sheet").css({
        "transform": "translate3d(0,100%,0)",
        "-webkit-transform": "translate3d(0,100%,0)",
    })
};
var c = module.exports = fly.Component.extend({

    name: 'share',

    template: template(__inline('share.html')),

    options: {
        hideFlag: false,
        templateCont: template('<li data-type={{type}}><div class="share-icon {{icon}}"></div><div class="share-name">{{platform}}</div></li>'),
        templateTitle: template('<span>{{title}}</span>'),
        title: '分享到'
    },

    ctor: function(element, options) {
        var that = this;
        that._super(element, options);
        element = that.element;
        that.operationCont = element.querySelector('.share-list');
        that.cancel = element.querySelector('.button-cancel');
        that.mask = element.querySelector('.mask');
        that.share = element.getElementsByTagName('li');
        that.element.classList.add('d-none');
        element.querySelector('.share-title').innerText = this.options.title;
        /*that.createButtons();
        that.createPickers();*/
        // 创建遮罩
        that.cancel.addEventListener('click', function(e) {
            e.stopPropagation();
            // that.trigger('close');
            that.hideMask();
            that.hideSheet();
            // 显示 首页底部原生图标
            croods.customPlugin({
                action: 'HomePlugin.showGuide',
                params: {},
                success: function(res) {}
            });
        });
        that.mask.addEventListener('click', function(e) {
            e.stopPropagation();
            // that.trigger('close');
            that.hideMask();
            that.hideSheet();

            // 显示 首页底部原生图标
            croods.customPlugin({
                action: 'HomePlugin.showGuide',
                params: {},
                success: function(res) {}
            });
        });
        /*that.show();*/
        // 防止滚动穿透
        element.addEventListener(TOUCHSTART, function(e) {
            /*e.preventDefault();*/
            e.stopPropagation();
        }, false);
        element.addEventListener('touchmove', function(e) {
            /*e.preventDefault();*/
            e.stopPropagation();
        }, false);
        /*实现数据绑定*/
        that._dataSource();
    },
    refresh: function(e) {
        var that = this,
            options = that.options,
            operationCont = that.operationCont;
        var view = that.dataSource.view();
        view.forEach(function(item, i) {
            var operaItem = $(options['templateCont'](item))[0];
            operationCont.appendChild(operaItem);
            operaItem.addEventListener(TOUCHSTART, proxy(function(e) {
                /*localStorage.TYPE = e.currentTarget.getAttribute('data-type');*/
                // that.hide();
            }, that), false);
            operaItem.addEventListener(TOUCHSTART, item.click || $.noop);
        });
    },

    //显示
    show: function() {
        // this.mask && this.mask.show();
        // this.element.querySelector('.confirm-inner').classList.add('active');
        this.showMask();
        this.showSheet();
    },

    //隐藏
    hide: function() {
        this.element.querySelector('.confirm-inner').classList.remove('active');
        this.mask && this.mask.close();
    },
    showSheet: function() {
        $('.share').removeClass('d-none');
        $(".sheet").css({
            "transform": "translate3d(0,0,0)",
            "-webkit-transform": "translate3d(0,0,0)",
            "transition": "0.4s ease"
        })

    },
    hideSheet: function() {
        $('.share').addClass('d-none');
        $(".sheet").css({
            "transform": "translate3d(0,100%,0)",
            "-webkit-transform": "translate3d(0,100%,0)",
        });
    },
    showMask: function() {
        $('body').css({'overflow': 'hidden'});
        $('.mask').addClass('show');
        $('.share').removeClass('d-none');
    },
    hideMask: function() {
        $('body').css({'overflow': 'auto'});
        $('.mask').removeClass('show');
        $('.share').addClass('d-none');
    },
    close: function(callback) {
        $('body').css({'overflow': 'auto'});
        this.element.style.display = 'none';
        $('.share').addClass('d-none');
        callback && callback();
    },
    shareFun: function(obj,successFun,errorFun) {
        $('.share-list li').off();
        $('.share-list li').on('click', function() {
            if(!flag) {
                return;
            }
            var type = $(this).attr('data-type'),
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
            //obj.shareText.length > 30 ? obj.shareText = obj.shareText.substring(0,30) :obj.shareText = obj.shareText;
            //obj.title.length > 15 ? obj.title = obj.title.substring(0,15) :obj.title = obj.title;
            
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
                    // 显示 首页底部原生图标
                    croods.customPlugin({
                        action: 'HomePlugin.showGuide',
                        params: {},
                        success: function(res) {}
                    });
                    console.log(res);
                    window.hide();
                    errorFun && errorFun();
                }
            });
        })
    }
});

fly.component(c);